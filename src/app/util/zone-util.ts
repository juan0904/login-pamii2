import { ImagePosition, Workbook, Worksheet } from 'exceljs';
import * as JSZip from 'jszip';
import {
  IDataHeroExcel,
  IDataSection,
  IDataSqlExcel,
  IHeroDetail,
  IHeroTable,
  ISQLTableDatos,
} from '../models/excel.interface';
import { LOGO } from '../models/logo';

import * as fs from 'file-saver';

export class ZoneUtil {
  private _workbook!: Workbook;

  private _dataExcel!: IDataHeroExcel;
  private _dataExcel1!: IDataSqlExcel;

  private _jsZip = new JSZip();

  constructor(dataExcel1: IDataSqlExcel) {
    this._dataExcel1 = dataExcel1;

    //console.log('DatosZonas:',this._dataExcel1);
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

    for (let index = 0; index < this.numberOfIterations; index++) {
      arrayPromise.push(this._workbook.xlsx.writeBuffer());
    }

    const buffers = await Promise.all(arrayPromise);

    buffers.forEach((buffer, index) =>
      zip.file(`ZONES ${index + 1}.xlsx`, buffer)
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
    this._workbook.creator = 'LogiDev';

    await this._createZoneDetail1(this._dataExcel1.sqlTable);
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
      //console.log(dataSqlDetail[index]);

      const zona = dataSqlDetail[index];

      if ((zona.id >= 700) && (zona.id <=799)) {
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







}
