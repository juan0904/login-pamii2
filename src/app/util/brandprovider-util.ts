import { ImagePosition, Workbook, Worksheet } from 'exceljs';
import * as JSZip from 'jszip';
import {
  IDataHeroExcel,
  IDataSection,
  IDataSqlExcel,
  IDataZonesExcel,
  IHeroDetail,
  IHeroTable,
  ISQLTableDatos,
  ZoneTable,
} from '../models/excel.interface';
import { LOGO } from '../models/logo';

import * as fs from 'file-saver';
import { BrandProviderTable } from '../models/excel.interface';

export class BrandProviderUtil {
  private _workbook!: Workbook;

  private _workbook1!: Workbook;

  private _dataExcel!: IDataHeroExcel;
  private _dataExcel1!: IDataSqlExcel;

  private _dataExcel2!: IDataZonesExcel;

  private _jsZip = new JSZip();

  constructor(dataExcel2: IDataZonesExcel) {
    this._dataExcel2 = dataExcel2;

    //console.log('DatosZonas:', this._dataExcel2);
  }

  private readonly numberOfIterations = 1;

  //#region metodos para descargar

  async downloadZipFile() {
    await this._loadWorbooK();

    const buffer = await this._workbook.xlsx.writeBuffer();
    this._jsZip.file('HEROS.xlsx', buffer);
    const blobZip = await this._jsZip.generateAsync({ type: 'blob' });
    fs.saveAs(blobZip, 'documentos excel.zip');
  }

  async downloadMultipleFiles() {
    await this._loadWorbooK();

    for (let index = 0; index < this.numberOfIterations; index++) {
      this._workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer]);
        fs.saveAs(blob, `HEROS ${index + 1}.xlsx`);
      });
    }
  }

  async downloadMultipleFiles1() {
    await this._loadWorbooK1();

    //for (let index = 0; index < this.numberOfIterations; index++) {
    this._workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer]);
      fs.saveAs(blob, `plantillaOfertas.xlsx`);
    });
    //}
  }

  async downloadMultipleFileIntoZip() {
    await this._loadWorbooK();

    const arrayPromise = [];

    for (let index = 0; index < this.numberOfIterations; index++) {
      arrayPromise.push(this._workbook.xlsx.writeBuffer());
    }

    Promise.all(arrayPromise).then((data) => {
      data.forEach((buffer, index) =>
        this._jsZip.file(`HEROS ${index + 1}.xlsx`, buffer)
      );

      this._jsZip.generateAsync({ type: 'blob' }).then((blob) => {
        fs.saveAs(blob, 'documentos excel.zip');
      });
    });
  }

  async generateBlobZip(): Promise<Blob> {
    await this._loadWorbooK1();

    const arrayPromise = [];
    const zip = new JSZip();

    //for (let index = 0; index < this.numberOfIterations; index++) {
    arrayPromise.push(this._workbook.xlsx.writeBuffer());
    //}

    const buffers = await Promise.all(arrayPromise);

    buffers.forEach((buffer, index) =>
      zip.file(`plantillaOfertas.xlsx`, buffer)
    );

    const blobZip = await zip.generateAsync({ type: 'blob' });

    return blobZip;
  }

  //#endregion
  //#region cargar datos al libro excel
  private async _loadWorbooK() {
    this._workbook = new Workbook();
    this._workbook.creator = 'LogiDev';

    await this._createHeroTable(this._dataExcel.herosTable);
    await this._createHeroDetail(this._dataExcel.herosDetail);
  }

  private async _loadWorbooK1() {
    this._workbook = new Workbook();
    this._workbook.creator = 'EstoesPamii';

    await this._createZoneDetail2(
      this._dataExcel2.zonesTable,
      this._dataExcel2.brandprovidersTable
    );
    //await this._createHeroDetail(this._dataExcel.herosDetail);
  }

  private async _createHeroDetail(
    dataHeroDetail: IHeroDetail[]
  ): Promise<void> {
    for (let index = 0; index < dataHeroDetail.length; index++) {
      const item = dataHeroDetail[index];
      //CREAMOS UNA HOJA
      const sheet = this._workbook.addWorksheet(
        `${index + 1} - ${item.name.toUpperCase()}` //1 - A Boom
      );

      // ESTABLECEMOS EL ANCHO DE LAS COLUMNAS Y UNOS CUANTOS ESTILOS
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].forEach((columnKey) => {
        sheet.getColumn(columnKey).width = 11;
        sheet.getColumn(columnKey).font = {
          bold: true,
          color: { argb: 'FFFFFF' },
        };
      });

      // PINTAMOS LAS CELDAS SEGUN NUESTRA LA PLANTILLA
      this._paintCellsHeroDetail(sheet);

      // AGREGAR IMAGEN DEL HEROE Y AGREGAMOS SU NOMBRE DEBAJO DE LA IMAGEN
      const idImage = await this._getIdImage(item.urlImage);
      sheet.addImage(idImage, 'B2:C13');

      sheet.mergeCells('B14:C14');
      const nameHero = sheet.getCell('B14');
      nameHero.value = item.name; // ACA AGREGAMOS EL NOMBRE DEL HEROE
      nameHero.font = {
        ...nameHero.font,
        size: 28,
        color: { argb: 'ffa43a' },
      };

      // CREAMOS LA SECCIÓN "Powerstats" Y  "Appearance"
      this._applyStyleTitleSection(sheet, [
        { value: 'Powerstats', cell: 'E3' },
        { value: 'Appearance', cell: 'H3' },
      ]);

      const keysSectionPowerstats: IDataSection[] = [
        {
          keyColumnTitle: 'E',
          keyColumnValue: 'F',
          values: [
            { key: 'Intelligence', value: item.powerstats.intelligence },
            { key: 'Strength', value: item.powerstats.strength },
            { key: 'Speed', value: item.powerstats.speed },
            { key: 'Durability', value: item.powerstats.durability },
            { key: 'Power', value: item.powerstats.power },
            { key: 'Combat', value: item.powerstats.combat },
          ],
        },
        {
          keyColumnTitle: 'H',
          keyColumnValue: 'I',
          values: [
            { key: 'Gender', value: item.appearance.gender },
            { key: 'Race', value: item.appearance.race },
            { key: 'Height', value: item.appearance.height },
            { key: 'Weight', value: item.appearance.weight },
            { key: 'EyeColor', value: item.appearance.eyeColor },
            { key: 'HairColor', value: item.appearance.hairColor },
          ],
        },
      ];

      this._applyStyleDataSection(sheet, keysSectionPowerstats);
    }
  }

  private _applyStyleDataSection(
    sheet: Worksheet,
    dataSection: IDataSection[]
  ) {
    dataSection.forEach((item) => {
      let rowNumber = 5;

      item.values.forEach((value) => {
        // CREO LA DESCRIPCIÓN
        const cellTilte = sheet.getCell(`${item.keyColumnTitle}${rowNumber}`); // E6
        cellTilte.value = value.key; //Intelligence

        cellTilte.font.color = { argb: '2E86C1' };

        //CREO EL VALOR DE LA DESCRIPCION
        const cellValue = sheet.getCell(`${item.keyColumnValue}${rowNumber}`); //F6
        cellValue.value = value.value as string; //COGE EL VALOR DE item.powerstats.intelligence
        cellValue.font.bold = false;
        rowNumber++;
      });
    });
  }

  private _applyStyleTitleSection(
    sheet: Worksheet,
    cells: { value: string; cell: string }[]
  ) {
    // PRIMERO HACERMOS UN MERGE DE LAS CELDAS
    sheet.mergeCells('E3:F3');
    sheet.mergeCells('H3:I3');

    cells.forEach((item) => {
      const sectionTitle = sheet.getCell(item.cell);
      sectionTitle.value = item.value;
      sectionTitle.style = {
        font: { size: 14, bold: true, italic: true, color: { argb: 'FFFFFF' } },
        fill: {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'D35400' },
        },
        alignment: { horizontal: 'center' },
      };
    });
  }

  private _applyStyleTitleSection1(
    sheet: Worksheet,
    cells: { value: string; cell: string }[],
    anColor: string,
    ancentrado: string,
    sizeLetra: number
  ) {
    // PRIMERO HACERMOS UN MERGE DE LAS CELDAS
    //sheet.mergeCells('E3:F3');
    //sheet.mergeCells('H3:I3');

    if ( ancentrado == 'center') {
      cells.forEach((item) => {
        const sectionTitle = sheet.getCell(item.cell);
        sectionTitle.value = item.value;
        sectionTitle.style = {
          font: {
            size: sizeLetra,
            bold: true,
            italic: true,
            color: { argb: 'FFFFFF' },
          },
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: anColor },
          },
          alignment: { horizontal: 'center' },
        };
      });
    }

    else if ( ancentrado == 'left') {
      cells.forEach((item) => {
        const sectionTitle = sheet.getCell(item.cell);
        sectionTitle.value = item.value;
        sectionTitle.style = {
          font: {
            size: sizeLetra,
            bold: true,
            italic: true,
            color: { argb: 'FFFFFF' },
          },
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: anColor },
          },
          alignment: { horizontal: 'left' },
        };
      });
    }
    else{
      cells.forEach((item) => {
        const sectionTitle = sheet.getCell(item.cell);
        sectionTitle.value = item.value;
        sectionTitle.style = {
          font: {
            size: sizeLetra,
            bold: true,
            italic: true,
            color: { argb: 'FFFFFF' },
          },
          fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: anColor },
          },
          alignment: { horizontal: 'center' },
        };
      });

    }

  }

  private _paintCellsHeroDetail(sheet: Worksheet) {
    for (let index = 0; index < 14; index++) {
      [
        `A${index + 1}`,
        `B${index + 1}`,
        `C${index + 1}`,
        `D${index + 1}`,
        `E${index + 1}`,
        `F${index + 1}`,
        `G${index + 1}`,
        `H${index + 1}`,
        `I${index + 1}`,
        `J${index + 1}`,
      ].forEach((key) => {
        sheet.getCell(key).fill = {
          // pintar celda
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '000000' },
        };
      });
    }
  }

  private async _createHeroTable(dataHerosTable: IHeroTable[]): Promise<void> {
    // CREAMOS LA PRIMERA HOJA
    const sheet = this._workbook.addWorksheet('HEROS');

    // ESTABLECEMOS EL ANCHO Y ESTILO DE LAS COLUMNAS
    sheet.getColumn('B').width = 21;
    sheet.getColumn('C').width = 38;
    sheet.getColumn('D').width = 20;
    sheet.getColumn('E').width = 20;
    sheet.getColumn('F').width = 29;

    sheet.columns.forEach((column) => {
      column.alignment = { vertical: 'middle', wrapText: true };
    });

    //CREAMO E INSERTAMOS EL LOGO EN LA COLUMNA "B"
    const logoId = this._workbook.addImage({
      base64: LOGO,
      extension: 'png',
    });

    const position: ImagePosition = {
      tl: { col: 1.15, row: 1.3 },
      ext: { width: 128, height: 128 },
    };

    ///sheet.addImage(logoId, 'B2:B7');
    sheet.addImage(logoId, position);

    //AGREGAMOS UN TITULO
    const titleCell = sheet.getCell('C5');
    titleCell.value = 'HEROS';
    titleCell.style.font = { bold: true, size: 24 };

    //CREAMOS LOS TITULOS PARA LA CABECERA

    const headerRow = sheet.getRow(10);
    // ESTAMOS JALANDO TODAS LAS COLUMNAS DE ESA FILA, "A","B","C"..etc
    headerRow.values = [
      '', // column A
      'Image', // column B
      'Full name', // column C
      'Eye Color', // column D
      'Hair Color', // column E
      'Work', // column F
    ];

    headerRow.font = { bold: true, size: 12 };

    // INSERTAMOS LOS DATOS EN LAS RESPECTIVAS COLUMNAS
    const rowsToInsert = sheet.getRows(11, dataHerosTable.length)!;

    for (let index = 0; index < rowsToInsert.length; index++) {
      const itemData = dataHerosTable[index]; // obtenemos el item segun el index de la iteracion (recorrido)
      const row = rowsToInsert[index]; // obtenemos la primera fila segun el index de la iteracion (recorrido)

      //  los valores de itemData seran asignados a "row" (fila actual en la iteracion)

      row.values = [
        '', // column A
        '', // column B
        itemData.fullName, // column C
        itemData.eyeColor, // column D
        itemData.hairColor, // column E
        itemData.work, // column F
      ];

      const idImage = await this._getIdImage(itemData.urlImage);
      sheet.addImage(idImage, {
        tl: { col: 1, row: row.number - 1 },
        ext: { width: 109, height: 110 },
      });

      row.height = 92;
    }
  }
  /**
   * Esta función realizará una petición http a la url de la imagen, cuando retorne la imagen capturamos el buffer y lo agregamos al libro,
   * cuando lo agreguemos retornara un id
   * @param url
   * @returns id de la imagen insertada en el libro
   */
  private async _getIdImage(url: string): Promise<number> {
    const response = await fetch(url);
    const image = this._workbook.addImage({
      buffer: await response.arrayBuffer(),
      extension: 'jpeg',
    });

    return image;
  }

  //#endregion

  private async _createZoneDetail1(
    dataSqlDetail: ISQLTableDatos[]
  ): Promise<void> {
    for (let index = 0; index < dataSqlDetail.length; index++) {
      ////console.log(dataSqlDetail[index]);

      const zona = dataSqlDetail[index];

      if (zona.id >= 700 && zona.id <= 799) {
        //CREAMOS UNA HOJA
        const sheet = this._workbook.addWorksheet(
          `${zona.id}` //1 - A Boom
        );

        // ESTABLECEMOS EL ANCHO DE LAS COLUMNAS Y UNOS CUANTOS ESTILOS
        ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].forEach((columnKey) => {
          sheet.getColumn(columnKey).width = 11;
          /*
          sheet.getColumn(columnKey).font = {
            bold: true,
            color: { argb: 'FFFFFF' },
          };
          */
        });

        // PINTAMOS LAS CELDAS SEGUN NUESTRA LA PLANTILLA
        //this._paintCellsHeroDetail(sheet);

        // CREAMOS LA SECCIÓN "Powerstats" Y  "Appearance"
        /*
      this._applyStyleTitleSection(sheet, [
        { value: 'Powerstats', cell: 'E3' },
        { value: 'Appearance', cell: 'H3' },
      ]);
      */

        /*

      const keysSectionPowerstats: IDataSection[] = [
        {
          keyColumnTitle: 'E',
          keyColumnValue: 'F',
          values: [
            { key: 'Intelligence', value: zona.id },
            { key: 'Strength', value: zona.id },
            { key: 'Speed', value: zona.id },
            { key: 'Durability', value: zona.id },
            { key: 'Power', value: zona.id },
            { key: 'Combat', value: zona.id },
          ],
        },
        {
          keyColumnTitle: 'H',
          keyColumnValue: 'I',
          values: [
            { key: 'Gender', value: zona.id },
            { key: 'Race', value: zona.id },
            { key: 'Height', value: zona.id },
            { key: 'Weight', value: zona.id },
            { key: 'EyeColor', value: zona.id },
            { key: 'HairColor', value: zona.id },
          ],
        },
      ];

      this._applyStyleDataSection(sheet, keysSectionPowerstats);
      */

        //CREAMOS LOS TITULOS PARA LA CABECERA

        const headerRow = sheet.getRow(10);
        // ESTAMOS JALANDO TODAS LAS COLUMNAS DE ESA FILA, "A","B","C"..etc

        /*
        headerRow.values = [
          //'', // column A
          //'Image', // column B
          'SQL', // column C
          //'Eye Color', // column D
          //'Hair Color', // column E
          //'Work', // column F
        ];
        */

        //headerRow.font = { bold: true, size: 12 };

        // INSERTAMOS LOS DATOS EN LAS RESPECTIVAS COLUMNAS
        const rowsToInsert = sheet.getRows(1, zona.datos.length)!;

        for (let index1 = 0; index1 < zona.datos.length; index1++) {
          const itemData = zona.datos[index1].sql; // obtenemos el item segun el index de la iteracion (recorrido)
          const row = rowsToInsert[index1]; // obtenemos la primera fila segun el index de la iteracion (recorrido)

          //  los valores de itemData seran asignados a "row" (fila actual en la iteracion)

          row.values = [
            //'', // column A
            //'', // column B
            itemData, // column C
            //itemData.eyeColor, // column D
            //itemData.hairColor, // column E
            //itemData.work, // column F
          ];

          /*
      const idImage = await this._getIdImage(itemData.urlImage);
      sheet.addImage(idImage, {
        tl: { col: 1, row: row.number - 1 },
        ext: { width: 109, height: 110 },
      });
      */

          //row.height = 92;
        }

        /*  
        
      const item = dataHeroDetail[index];
      //CREAMOS UNA HOJA
      const sheet = this._workbook.addWorksheet(
        `${index + 1} - ${item.name.toUpperCase()}` //1 - A Boom
      );

      // ESTABLECEMOS EL ANCHO DE LAS COLUMNAS Y UNOS CUANTOS ESTILOS
      ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'].forEach((columnKey) => {
        sheet.getColumn(columnKey).width = 11;
        sheet.getColumn(columnKey).font = {
          bold: true,
          color: { argb: 'FFFFFF' },
        };
      });

      // PINTAMOS LAS CELDAS SEGUN NUESTRA LA PLANTILLA
      this._paintCellsHeroDetail(sheet);

      // AGREGAR IMAGEN DEL HEROE Y AGREGAMOS SU NOMBRE DEBAJO DE LA IMAGEN
      const idImage = await this._getIdImage(item.urlImage);
      sheet.addImage(idImage, 'B2:C13');

      sheet.mergeCells('B14:C14');
      const nameHero = sheet.getCell('B14');
      nameHero.value = item.name; // ACA AGREGAMOS EL NOMBRE DEL HEROE
      nameHero.font = {
        ...nameHero.font,
        size: 28,
        color: { argb: 'ffa43a' },
      };

      // CREAMOS LA SECCIÓN "Powerstats" Y  "Appearance"
      this._applyStyleTitleSection(sheet, [
        { value: 'Powerstats', cell: 'E3' },
        { value: 'Appearance', cell: 'H3' },
      ]);

      const keysSectionPowerstats: IDataSection[] = [
        {
          keyColumnTitle: 'E',
          keyColumnValue: 'F',
          values: [
            { key: 'Intelligence', value: item.powerstats.intelligence },
            { key: 'Strength', value: item.powerstats.strength },
            { key: 'Speed', value: item.powerstats.speed },
            { key: 'Durability', value: item.powerstats.durability },
            { key: 'Power', value: item.powerstats.power },
            { key: 'Combat', value: item.powerstats.combat },
          ],
        },
        {
          keyColumnTitle: 'H',
          keyColumnValue: 'I',
          values: [
            { key: 'Gender', value: item.appearance.gender },
            { key: 'Race', value: item.appearance.race },
            { key: 'Height', value: item.appearance.height },
            { key: 'Weight', value: item.appearance.weight },
            { key: 'EyeColor', value: item.appearance.eyeColor },
            { key: 'HairColor', value: item.appearance.hairColor },
          ],
        },
      ];

      this._applyStyleDataSection(sheet, keysSectionPowerstats);
      */
      }
    }
  }

  private async _createZoneDetail2(
    dataZoneDetail: ZoneTable[],
    dataBrandProviderDetail: BrandProviderTable[]
  ): Promise<void> {
    //////CREAMOS UNA HOJA PARA LAS OFERTAS
    const sheet0 = this._workbook.addWorksheet(
      `Oportunidades`, //Sheet para las ZONAS,
      { properties: { tabColor: { argb: '92D050' } } }
    );

    // ESTABLECEMOS EL ANCHO DE LAS COLUMNAS Y UNOS CUANTOS ESTILOS
    ['A', 'B', 'C', 'D', 'E'].forEach((columnKey) => {
      sheet0.getColumn(columnKey).width = 23;
    });

    ['F', 'G', 'H', 'I', 'J', 'K'].forEach((columnKey) => {
      sheet0.getColumn(columnKey).width = 45;
    });

    //CREAMOS LOS TITULOS PARA LA CABECERA
    const headerRow0 = sheet0.getRow(1);
    // ESTAMOS JALANDO TODAS LAS COLUMNAS DE ESA FILA, "A","B","C"..etc

    headerRow0.values = [
      'PROVEEDOR/MARCA', // column A
      'ZONA', // column B
      'FECHA ACTIVACION', // column C
      'FECHA FINALIZACION', // column D
      'NRO OPORTUNIDADES', // column E
      'TITULO OPORTUNIDAD', // column F
      'DESCRIPCION OPORTUNIDAD', // column G
      'REQUERIMIENTO1', // column H
      'REQUERIMIENTO2', // column I
      'REQUERIMIENTO3', // column J
      'REQUERIMIENTO4', // column K
    ];

    headerRow0.font = { bold: true, size: 12 };

    const headerRow01 = sheet0.getRow(2);

    headerRow01.values = [
      '2 - NCS SAS / Quest', // column A
      '16 - CALI - 76001000', // column B
      '23/03/2023', // column C
      '31/12/2023', // column D
      10, // column E
      'Nombre Oferta de ejemplo', // column F
      'Descripcion Oferta de ejemplo', // column G
      'Ejemplo Mayor de Edad', // column H
      'Ejemplo Venta por Catalogo', // column I
      'Ejemplo Vivir en la Zona', // column J
      'Ejemplo Otro Requirimiento', // column K
    ];

    /*
    sheet0.getCell('E2').dataValidation = {
      type: 'decimal',
      operator: 'between',
      allowBlank: true,
      showInputMessage: true,
      formulae: [1, 1000],
      promptTitle: 'Decimal',
      prompt: 'El Valor debe estar entre 1 and 1000'
    };
    */

    //sheet0.getCell('C2').value = new Date(2023, 0, 15);
    sheet0.getCell('C2').value = new Date('2023-01-01');
    sheet0.getCell('C2').numFmt = 'dd/mm/yyyy';
    sheet0.getCell('C2').dataValidation = {
      type: 'date',
      operator: 'greaterThan',
      showErrorMessage: true,
      allowBlank: true,
      formulae: [new Date('2022-12-31')],
    };
    //sheet0.getCell('D2').value = new Date(2023, 11, 15);
    sheet0.getCell('D2').value = new Date('2023-12-31');
    sheet0.getCell('D2').numFmt = 'dd/mm/yyyy';
    sheet0.getCell('D2').dataValidation = {
      type: 'date',
      operator: 'greaterThan',
      showErrorMessage: true,
      allowBlank: true,
      formulae: [new Date('2022-12-31')],
    };

    //Para Validar la Cantidad de ofertas
    sheet0.getCell('E2').dataValidation = {
      type: 'whole',
      operator: 'greaterThan',
      showErrorMessage: true,
      formulae: [0],
      errorStyle: 'error',
      errorTitle: 'Cero',
      error: 'El valor debe ser mayor a Cero',
    };

    // Specify list of valid values from a range.
    // Excel will provide a dropdown with these values.
    /*
    sheet0.getCell('A2').dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['ProveedoresMarca!$F$2:$F$3'],
    };

    sheet0.getCell('B2').dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['Zonas!$J$2:$J$1107'],
    };

    */

    //////CREAMOS UNA HOJA EL INSTRUCTIVO
    const sheet01 = this._workbook.addWorksheet(
      `Instructivo`, //Sheet para el Instructivo
      { properties: { tabColor: { argb: '0070C0' } } }
    );

    // ESTABLECEMOS EL ANCHO DE LAS COLUMNAS Y UNOS CUANTOS ESTILOS
    ['A'].forEach((columnKey) => {
      sheet01.getColumn(columnKey).width = 25;

      sheet01.getColumn(columnKey).font = {
        bold: true,
        //color: { argb: 'FFFFFF' },
      };
    });

    ['B'].forEach((columnKey) => {
      sheet01.getColumn(columnKey).width = 2;
    });

    ['C'].forEach((columnKey) => {
      sheet01.getColumn(columnKey).width = 200;
    });

    const headerRow0001 = sheet01.getRow(1);
    headerRow0001.values = [
      'Instructivo para llenar Plantilla de Bolsa de Oportunidades para Proveedores/Marca de EstoesPamii', // column A
    ];

    sheet01.mergeCells('A1:C1');

    this._applyStyleTitleSection1(
      sheet01,
      [
        {
          value:
            'Instructivo para llenar Plantilla de Bolsa de Oportunidades para Proveedores/Marca de EstoesPamii',
          cell: 'A1',
        },
        {
          value:
            'Instructivo para llenar Plantilla de Bolsa de Oportunidades para Proveedores/Marca de EstoesPamii',
          cell: 'C1',
        },
      ],
      'D35400',
      'center',
      14
    );

    const headerRow0002 = sheet01.getRow(2);
    headerRow0002.values = [
      'A continuación, se describe el instructivo que servirá de apoyo para diligenciar correctamente la plantilla de Bolsa de Oportunidades para Proveedores/Marca de EstoesPamii.', // column A
    ];

    sheet01.mergeCells('A2:C2');

    this._applyStyleTitleSection1(
      sheet01,
      [
        {
          value:
            'A continuación, se describe el instructivo que servirá de apoyo para diligenciar correctamente la plantilla de Bolsa de Oportunidades para Proveedores/Marca de EstoesPamii.',
          cell: 'A2',
        },
        {
          value:
            'A continuación, se describe el instructivo que servirá de apoyo para diligenciar correctamente la plantilla de Bolsa de Oportunidades para Proveedores/Marca de EstoesPamii.',
          cell: 'C2',
        },
      ],
      'D35400',
      'center',
      14
    );

    const headerRow0003 = sheet01.getRow(3);
    headerRow0003.values = [
      'IMPORTANTE: En la hoja "Oportunidades" la fila 2 es solo de ejemplo y no será tenida en cuenta para el cargue.', // column A
    ];

    sheet01.mergeCells('A3:C3');

    this._applyStyleTitleSection1(
      sheet01,
      [
        {
          value:
            'IMPORTANTE: En la hoja "Oportunidades" la fila 2 es solo de ejemplo y no será tenida en cuenta para el cargue.',
          cell: 'A3',
        },
        {
          value:
            'IMPORTANTE: En la hoja "Oportunidades" la fila 2 es solo de ejemplo y no será tenida en cuenta para el cargue.',
          cell: 'C3',
        },
      ],
      '244062',
      'left',
      16
    );

    /*
    Este campo se llena con el dato que se encuentra en la Hoja "ProveedoresMarca" columna F denominada "total_name" que describe la razón social y marca para la que deseas publicar la oportunidad
    Este campo se llena con el dato que se encuentra en la Hoja "Zonas" Columna J denominada "total_zona". Recuerda que puedes publicar oportunidades en las zonas que desees de acuerdo a tu estrategia comercial.
    Para llenar este campo correctamente, primero se debe colocar una comilla ( ' ) y luego la fecha de activación en el formato yyyy-mm-dd. Ejemplo: '2023-04-12 (ajustar formato)
    Para llenar este campo correctamente, primero se debe colocar una comilla ( ' ) y luego la fecha de finalización en el formato yyyy-mm-dd. Ejemplo: '2023-04-12 (ajustar formato)
    Nota: Recuerda que la fecha de finalización debe ser mayor o igual a la fecha de activación.
    Debe ser un valor numérico mayor a 0. Recuerda que puedes publicar el número de oportunidades que consideres necesario para tu marca
    Este campo se llena con un titulo |alfanumérico hasta un total de 50 caracteres. Describe el titulo de la oportunidad con palabras clave que llamen la atención de los futuros Pamiigos
    Este campo se llena con una descripción alfanumérica hasta un total de 150 caracteres.
    Este campo se llena con una descripción alfanumérica hasta un total de 50 caracteres. Describe un requerimiento especifico que deba cumplir el postulante
    Este campo se llena con una descripción alfanumérica hasta un total de 50 caracteres. Describe un requerimiento especifico que deba cumplir el postulante
    Este campo se llena con una descripción alfanumérica hasta un total de 50 caracteres. Describe un requerimiento especifico que deba cumplir el postulante
    Este campo se llena con una descripción alfanumérica hasta un total de 50 caracteres. Describe un requerimiento especifico que deba cumplir el postulante
    */

    //CREAMOS LOS TITULOS PARA LA CABECERA
    const headerRow001 = sheet01.getRow(5);
    headerRow001.values = [
      'PROVEEDOR/MARCA', // column A
      ':', // column B
      'Este campo se llena con el dato que se encuentra en la Hoja "ProveedoresMarca" columna F denominada "total_name" que describe la razón social y marca para la que deseas publicar la oportunidad', // column C
    ];

    //headerRow001.font = { bold: true, size: 12 };

    const headerRow002 = sheet01.getRow(6);
    headerRow002.values = [
      'ZONA', // column A
      ':', // column B
      'Este campo se llena con el dato que se encuentra en la Hoja "Zonas" Columna J denominada "total_zona". Recuerda que puedes publicar oportunidades en las zonas que desees de acuerdo a tu estrategia comercial.', // column C
    ];

    const headerRow003 = sheet01.getRow(7);
    headerRow003.values = [
      'FECHA ACTIVACION', // column A
      ':', // column B
      'Para llenar este campo correctamente, digite una fecha valida en excel' +
        ' ' +
        'en el formato dd/mm/yyyy. Ejemplo: ' +
        ' ' +
        '12/04/2023', // column C
    ];

    const headerRow004 = sheet01.getRow(8);
    headerRow004.values = [
      'FECHA FINALIZACION', // column A
      ':', // column B
      'Para llenar este campo correctamente, digite una fecha valida en excel' +
        ' ' +
        'en el formato dd/mm/yyyy. Ejemplo: ' +
        ' ' +
        '31/12/2023', // column C
    ];

    const headerRow005 = sheet01.getRow(9);
    headerRow005.values = [
      '', // column A
      '', // column B
      'Nota: Recuerda que la fecha de finalización debe ser mayor o igual a la fecha de activación.', // column C
    ];

    const headerRow006 = sheet01.getRow(10);
    headerRow006.values = [
      'NRO OPORTUNIDADES', // column A
      ':', // column B
      'Debe ser un valor numérico mayor a 0. Recuerda que puedes publicar el número de oportunidades que consideres necesario para tu marca', // column C
    ];

    const headerRow008 = sheet01.getRow(11);
    headerRow008.values = [
      'TITULO OPORTUNIDAD', // column A
      ':', // column B
      'Este campo se llena con un titulo alfanumérico hasta un total de 50 caracteres. Describe el titulo de la oportunidad con palabras clave que llamen la atención de los futuros Pamiigos', // column C
    ];

    const headerRow009 = sheet01.getRow(12);
    headerRow009.values = [
      'DESCRIPCION OPORTUNIDAD', // column A
      ':', // column B
      'Este campo se llena con una descripción alfanumérica hasta un total de 150 caracteres.', // column C
    ];

    const headerRow0010 = sheet01.getRow(13);
    headerRow0010.values = [
      'REQUERIMIENTO1', // column A
      ':', // column B
      'Este campo se llena con una descripción alfanumérica hasta un total de 50 caracteres. Describe un requerimiento especifico que deba cumplir el postulante', // column C
    ];

    const headerRow0011 = sheet01.getRow(14);
    headerRow0011.values = [
      'REQUERIMIENTO2', // column A
      ':', // column B
      'Este campo se llena con una descripción alfanumérica hasta un total de 50 caracteres. Describe un requerimiento especifico que deba cumplir el postulante', // column C
    ];

    const headerRow0012 = sheet01.getRow(15);
    headerRow0012.values = [
      'REQUERIMIENTO3', // column A
      ':', // column B
      'Este campo se llena con una descripción alfanumérica hasta un total de 50 caracteres. Describe un requerimiento especifico que deba cumplir el postulante ', // column C
    ];

    const headerRow0013 = sheet01.getRow(16);
    headerRow0013.values = [
      'REQUERIMIENTO4', // column A
      ':', // column B
      'Este campo se llena con una descripción alfanumérica hasta un total de 50 caracteres. Describe un requerimiento especifico que deba cumplir el postulante ', // column C
    ];

    const headerRow0014 = sheet01.getRow(18);
    headerRow0014.values = [
      'Nota: Se sugiere copiar la fila 2 y pegar en la siguiente fila para arrastrar el formato y diligenciar la plantilla de manera más eficiente.', // column A
    ];

    sheet01.mergeCells('A18:C18');

    this._applyStyleTitleSection1(
      sheet01,
      [
        {
          value:
            'Nota: Se sugiere copiar la fila 2 y pegar en la siguiente fila para arrastrar el formato y diligenciar la plantilla de manera más eficiente.',
          cell: 'A18',
        },
        {
          value:
            'Nota: Se sugiere copiar la fila 2 y pegar en la siguiente fila para arrastrar el formato y diligenciar la plantilla de manera más eficiente.',
          cell: 'C18',
        },
      ],
      '244062',
      'left',
      16
    );

    const headerRow0015 = sheet01.getRow(19);
    headerRow0015.values = [
      'Luego de diligenciar la plantilla, proceda con la opción de carga y confirmación.', // column A
    ];

    sheet01.mergeCells('A19:C19');

    this._applyStyleTitleSection1(
      sheet01,
      [
        {
          value:
            'Luego de diligenciar la plantilla, proceda con la opción de carga y confirmación.',
          cell: 'A19',
        },
        {
          value:
            'Luego de diligenciar la plantilla, proceda con la opción de carga y confirmación.',
          cell: 'C19',
        },
      ],
      'D35400',
      'center',
      16
    );

    //////CREAMOS UNA HOJA PARA LOS PROVEEDORES/MARCA
    const sheet1 = this._workbook.addWorksheet(
      `ProveedoresMarca` //Sheet para las ZONAS
    );

    // ESTABLECEMOS EL ANCHO DE LAS COLUMNAS Y UNOS CUANTOS ESTILOS
    ['A'].forEach((columnKey) => {
      sheet1.getColumn(columnKey).width = 17;
    });

    ['B', 'D'].forEach((columnKey) => {
      sheet1.getColumn(columnKey).width = 10;
    });

    ['C', 'E'].forEach((columnKey) => {
      sheet1.getColumn(columnKey).width = 30;
    });

    ['F'].forEach((columnKey) => {
      sheet1.getColumn(columnKey).width = 50;

      sheet1.getColumn(columnKey).font = {
        bold: true,
        //color: { argb: 'FFFFFF' },
      };
    });

    //CREAMOS LOS TITULOS PARA LA CABECERA
    const headerRow1 = sheet1.getRow(1);
    // ESTAMOS JALANDO TODAS LAS COLUMNAS DE ESA FILA, "A","B","C"..etc

    headerRow1.values = [
      'brandProviderId', // column A
      'brandId', // column B
      'brand', // column C
      'providerId', // column D
      'businessName', // column E
      'total_name', // column F
    ];

    headerRow1.font = { bold: true, size: 12 };

    // INSERTAMOS LOS DATOS EN LAS RESPECTIVAS COLUMNAS
    const rowsToInsert1 = sheet1.getRows(2, dataBrandProviderDetail.length)!;

    //Recorremos todos los items que tienen las ZONAS
    for (let index1 = 0; index1 < dataBrandProviderDetail.length; index1++) {
      const itemData = dataBrandProviderDetail[index1]; // obtenemos el item segun el index de la iteracion (recorrido)
      const row = rowsToInsert1[index1]; // obtenemos la primera fila segun el index de la iteracion (recorrido)

      //  los valores de itemData seran asignados a "row" (fila actual en la iteracion)
      row.values = [
        itemData.brandProviderId, // column A
        itemData.brandId, // column B
        itemData.brand, // column C
        itemData.providerId, // column D
        itemData.businessName, // column F
        itemData.total_name, // column E
      ];
    }

    //Para Validar los proveedores Marca
    sheet0.getCell('A2').dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: [
        'ProveedoresMarca!$F$2:$F$' + (dataBrandProviderDetail.length + 1),
      ],
    };

    ///////CREAMOS UNA HOJA PARA LAS ZONAS
    const sheet = this._workbook.addWorksheet(
      `Zonas` //Sheet para las ZONAS
    );

    // ESTABLECEMOS EL ANCHO DE LAS COLUMNAS Y UNOS CUANTOS ESTILOS
    ['A', 'C', 'E', 'F', 'H'].forEach((columnKey) => {
      sheet.getColumn(columnKey).width = 10;
    });

    ['B', 'D', 'G', 'I'].forEach((columnKey) => {
      sheet.getColumn(columnKey).width = 30;
    });

    ['J'].forEach((columnKey) => {
      sheet.getColumn(columnKey).width = 50;

      sheet.getColumn(columnKey).font = {
        bold: true,
        //color: { argb: 'FFFFFF' },
      };
    });

    //CREAMOS LOS TITULOS PARA LA CABECERA
    const headerRow = sheet.getRow(1);
    // ESTAMOS JALANDO TODAS LAS COLUMNAS DE ESA FILA, "A","B","C"..etc

    headerRow.values = [
      'zonaid', // column A
      'zone', // column B
      'cityId', // column C
      'ciudad', // column D
      'dane', // column E
      'stateId', // column F
      'departamento', // column G
      'countryId', // column H
      'country', // column I
      'total_zona', // column J
    ];

    headerRow.font = { bold: true, size: 12 };

    // INSERTAMOS LOS DATOS EN LAS RESPECTIVAS COLUMNAS
    const rowsToInsert = sheet.getRows(2, dataZoneDetail.length)!;

    //Recorremos todos los items que tienen las ZONAS
    for (let index1 = 0; index1 < dataZoneDetail.length; index1++) {
      const itemData = dataZoneDetail[index1]; // obtenemos el item segun el index de la iteracion (recorrido)
      const row = rowsToInsert[index1]; // obtenemos la primera fila segun el index de la iteracion (recorrido)

      //  los valores de itemData seran asignados a "row" (fila actual en la iteracion)
      row.values = [
        itemData.zonaid, // column A
        itemData.zone, // column B
        itemData.cityId, // column C
        itemData.ciudad, // column D
        itemData.dane, // column F
        itemData.stateId, // column E
        itemData.departamento, // column G
        itemData.countryId, // column H
        itemData.country, // column I
        itemData.total_zona, // column J
      ];
    }

    //Para Validar las Zonas
    sheet0.getCell('B2').dataValidation = {
      type: 'list',
      allowBlank: true,
      formulae: ['Zonas!$J$2:$J$' + (dataZoneDetail.length + 1)],
    };
  }
}
