import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { mixinDisabled } from '@angular/material/core';
import { AuthService } from 'src/app/services/auth.service';
import { ExcelService } from 'src/app/services/excel.service';
import {
  BrandProviderJobOfferRequirementTable,
  BrandProviderJobOfferTable,
  BrandProviderTable,
  BrandProviderZoneTable,
  IDataZonesExcel,
  ZoneTable,
} from '../../models/excel.interface';

import * as XLSX from 'xlsx';

import Swal from 'sweetalert2';
import { GlobalConstants } from '../shared/angular-material/global-constants';
//import { MatDialog } from '@angular/material/dialog';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';

export interface DialogData {
  titulo: string;
  name: string;
}

@Component({
  selector: 'app-list-brand-providers',
  templateUrl: './list-brand-providers.component.html',
  styleUrls: ['./list-brand-providers.component.css'],
})
export class ListBrandProvidersComponent implements OnInit {
  anOptionId: string = 'brandproviders';

  anOption: any;
  anInstructivo: string = '';

  animal: string = '';
  name: string = '';

  mensaje: string =
    'Plantilla de Bolsa de Oportunidades para Proveedores/Marca de EstoesPamii';

  brandProviders: BrandProviderTable[] = [];
  zones: ZoneTable[] = [];

  unJob: BrandProviderJobOfferTable = {
    id: -1,
    job: '',
    vacancies: 0,
    description: '',
    activationDate: '',
    finishDate: '',
    zoneId: -1,
    brandProviderId: -1,
    optionsStatus: 'active',
    optionsCreatedat: '',
    optionsUpdatedat: '',
    requerimientos: [],
  };

  unJobRequirement: BrandProviderJobOfferRequirementTable = {
    id: -1,
    requirement: '',
    brandProviderJobOfferId: -1,
    optionsStatus: 'active',
    optionsCreatedat: '',
    optionsUpdatedat: '',
  };

  unBrandProviderZone: BrandProviderZoneTable = {
    id: -1,
    brandProviderId: -1,
    zoneId: -1,
    optionsStatus: 'active',
    optionsCreatedat: '',
    optionsUpdatedat: '',
  };

  excelData: any[] = [];

  unosJobs: BrandProviderJobOfferTable[] = [];

  @ViewChild('fileUploader')
  fileUploader!: ElementRef;

  contador: number = 0;

  customDateInicio: any;
  customDateFin: any;

  anProviderId: any = '-1';

  anProviderName: any;

  constructor(
    private auth: AuthService,
    private _excelService: ExcelService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.anProviderId = GlobalConstants.bpid;
    this.anProviderName = GlobalConstants.businessName;

    this.mensaje = this.mensaje + ' - ' + this.anProviderName;

    this.cargarOption();

    //console.log("PROVIDER",this.anProviderId);
  }

  openDialog1() {
    const dialogRef = this.dialog.open(DialogContentExampleDialog);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogContentExampleDialog, {
      data: { name: this.anInstructivo, titulo: this.mensaje },
    });

    console.log(this.anInstructivo);
    
    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      this.animal = result;
    });
  }

  async cargarOption() {
    //this.anBrandProviderId = GlobalConstants.bpid;
    //this.cargando = true;
    await this.auth
      .getOption(this.anOptionId)
      .toPromise()
      .then((resp: any) => {
        this.anOption = resp.data;
        this.anInstructivo = this.anOption[0].instructivo;
        //console.log(this.anInstructivo);

        /*
        this.dataSource = new MatTableDataSource<ProductosModel>(this.productos);    
 
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.cargando = false;
*/
      });
  }

  async cargarBrandProviders() {
    //this.anBrandProviderId = GlobalConstants.bpid;
    //this.cargando = true;
    await this.auth
      .getBrandProvidersByProvider(this.anProviderId)
      .toPromise()
      .then((resp: any) => {
        this.brandProviders = resp.data;
        ////console.log(this.brandProviders)

        /*
        this.dataSource = new MatTableDataSource<ProductosModel>(this.productos);    
 
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.cargando = false;
*/
      });
  }

  async cargarZones() {
    //this.anBrandProviderId = GlobalConstants.bpid;
    //this.cargando = true;
    await this.auth
      .getZones()
      .toPromise()
      .then((resp: any) => {
        this.zones = resp.data;

        ////console.log(this.zones)

        /*
        this.dataSource = new MatTableDataSource<ProductosModel>(this.productos);    
 
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.cargando = false;
*/
      });
  }

  async cargarPlantilla(event: any) {
    let file = event.target.files[0];
    //console.log(file);

    let fileReader = new FileReader();
    fileReader.readAsBinaryString(file);

    fileReader.onload = (e: any) => {
      var workBook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetNames = workBook.SheetNames;

      this.excelData = XLSX.utils.sheet_to_json(workBook.Sheets[sheetNames[0]]);
      //console.log('DATA', this.excelData);

      if (this.excelData.length > 0) {
        let itemData = this.excelData[0];

        if (
          itemData['PROVEEDOR/MARCA'] == undefined ||
          itemData['ZONA'] == undefined ||
          itemData['TITULO OPORTUNIDAD'] == undefined ||
          itemData['DESCRIPCION OPORTUNIDAD'] == undefined ||
          itemData['NRO OPORTUNIDADES'] == undefined ||
          itemData['FECHA ACTIVACION'] == undefined ||
          itemData['FECHA FINALIZACION'] == undefined
        ) {
          Swal.fire({
            icon: 'error',
            title: 'Error al Cargar Plantilla',
            text: 'El archivo no es una Plantilla Valida de Oportunidades.\nRevise su Archivo...',
            //footer: '<a href="">Why do I have this issue?</a>',
          });

          this.excelData = [];
          return;
        }

        //Borra el primer elemento de la lista
        this.excelData.shift();
        console.log('Tamaño',this.excelData.length)

        if (this.excelData.length == 0){
          Swal.fire({
            icon: 'error',
            title: 'Error al Cargar Plantilla',
            text: 'No tiene Datos para Cargar. Recuerde que la primera oferta no es tenida en Cuenta.\nRevise su Archivo...',
            //footer: '<a href="">Why do I have this issue?</a>',
          });

          return;

        }

        for (let index = 0; index < this.excelData.length; index++) {

          let itemData1 = this.excelData[0];

          let unDatoFecha = this.numeroAFecha(this.excelData[index]['FECHA ACTIVACION'],true);
          let unDatoFechString =  this.getStrDate(unDatoFecha);

          this.excelData[index]['FECHA ACTIVACION'] = unDatoFechString;

          unDatoFecha = this.numeroAFecha(this.excelData[index]['FECHA FINALIZACION'],true);
          unDatoFechString =  this.getStrDate(unDatoFecha);

          this.excelData[index]['FECHA FINALIZACION'] = unDatoFechString;  

        }

        console.log( "DATOS_EXCEL",this.excelData);


      }

      ////console.log(e);
    };

    ////console.log(fileReader);

    //await this.cargarBrandProviders()
    //await this.cargarZones()

    //var misDatos: IDataZonesExcel = { zonesTable: this.zones , brandprovidersTable:this.brandProviders};

    //await this._excelService.loadOfertas(fileReader,file,misDatos);
  }

  async confirmarPlantilla() {
    this.unosJobs = [];

    for (let index = 0; index < this.excelData.length; index++) {
      this.unJob = {
        id: -1,
        job: '',
        vacancies: 0,
        description: '',
        activationDate: '',
        finishDate: '',
        zoneId: -1,
        brandProviderId: -1,
        optionsStatus: 'active',
        optionsCreatedat: '',
        optionsUpdatedat: '',
        requerimientos: [],
      };

      let itemData = this.excelData[index];

      //Aqui ajusta los Datos del BrandProviderId

      if (itemData['PROVEEDOR/MARCA'] != undefined) {
        let datos = itemData['PROVEEDOR/MARCA'].split(' - ');
        let brandProviderId = datos[0];
        this.unJob.brandProviderId = brandProviderId;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al Confirmar Plantilla',
          text:
            'El PROVEEDOR/MARCA es un dato requerido revisar en la linea ' +
            (index + 1),
          //footer: '<a href="">Why do I have this issue?</a>',
        });
        return;
      }

      ////console.log(brandProviderId);

      //Aqui ajusta los Datos de la ZoneId
      if (itemData['ZONA'] != undefined) {
        let datosZone = itemData['ZONA'].split(' - ');
        let zoneId = datosZone[0];
        this.unJob.zoneId = zoneId;
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al Confirmar Plantilla',
          text:
            'El ZONA es un dato requerido revisar en la linea ' +
            (index + 1),
          //footer: '<a href="">Why do I have this issue?</a>',
        });
        return;
      }

      ////console.log(this.unJob);

      //Aqui ajusta los Demas Datos
      if (itemData['TITULO OPORTUNIDAD'] != undefined) {
        this.unJob.job = itemData['TITULO OPORTUNIDAD'];
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al Confirmar Plantilla',
          text:
            'El TITULO OPORTUNIDAD es un dato requerido revisar en la linea ' +
            (index + 1),
          //footer: '<a href="">Why do I have this issue?</a>',
        });
        return;
      }

      if (itemData['DESCRIPCION OPORTUNIDAD'] != undefined) {
        this.unJob.description = itemData['DESCRIPCION OPORTUNIDAD'];
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al Confirmar Plantilla',
          text:
            'La DESCRIPCION OPORTUNIDAD es un dato requerido revisar en la linea ' +
            (index + 1),
          //footer: '<a href="">Why do I have this issue?</a>',
        });
        return;
      }

      if (itemData['NRO OPORTUNIDADES'] != undefined) {
        if (
          isNaN(itemData['NRO OPORTUNIDADES']) == true 
        ) {
          Swal.fire({
            icon: 'error',
            title: 'Error al Confirmar Plantilla',
            text:
              'El NRO OPORTUNIDADES debe ser un Dato Numerico en la linea ' +
              (index + 1),
            //footer: '<a href="">Why do I have this issue?</a>',
          });
          return;
          
        } else {
          this.unJob.vacancies = itemData['NRO OPORTUNIDADES'];
          if (this.unJob.vacancies <= 0) {
            Swal.fire({
              icon: 'error',
              title: 'Error al Confirmar Plantilla',
              text:
                'El NRO OPORTUNIDADES debe ser mayor que 0 en la linea ' +
                (index + 1),
              //footer: '<a href="">Why do I have this issue?</a>',
            });
            return;
          }

        }

      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al Confirmar Plantilla',
          text:
            'El NRO OPORTUNIDADES es un dato requerido revisar en la linea ' +
            (index + 1),
          //footer: '<a href="">Why do I have this issue?</a>',
        });
        return;
      }

      if (itemData['FECHA ACTIVACION'] != undefined) {
        //const util = require('util');

        this.customDateInicio = new Date(itemData['FECHA ACTIVACION']);

        if (this.customDateInicio != 'Invalid Date') {
          this.unJob.activationDate = itemData['FECHA ACTIVACION'];
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al Confirmar Plantilla',
            text:
              'La FECHA ACTIVACION (' +
              itemData['FECHA ACTIVACION'] +
              ') debe ser una Fecha Valida en la linea ' +
              (index + 1),
            //footer: '<a href="">Why do I have this issue?</a>',
          });
          return;
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al Confirmar Plantilla',
          text:
            'La FECHA ACTIVACION es un dato requerido revisar en la linea ' +
            (index + 1),
          //footer: '<a href="">Why do I have this issue?</a>',
        });
        return;
      }

      if (itemData['FECHA FINALIZACION'] != undefined) {
        this.customDateFin = new Date(itemData['FECHA FINALIZACION']);

        if (this.customDateFin != 'Invalid Date') {
          if (this.customDateFin < this.customDateInicio) {
            Swal.fire({
              icon: 'error',
              title: 'Error al Confirmar Plantilla',
              text:
                'La FECHA FINALIZACION (' +
                itemData['FECHA FINALIZACION'] +
                ') debe ser Mayor o Igual a la  FECHA ACTIVACION (' +
                itemData['FECHA ACTIVACION'] +
                ') en la linea ' +
                (index + 1),
              //footer: '<a href="">Why do I have this issue?</a>',
            });
            return;
          }

          this.unJob.finishDate = itemData['FECHA FINALIZACION'];
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al Confirmar Plantilla',
            text:
              'La FECHA FINALIZACION (' +
              itemData['FECHA FINALIZACION'] +
              ') debe ser una Fecha Valida en la linea ' +
              (index + 1),
            //footer: '<a href="">Why do I have this issue?</a>',
          });
          return;
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error al Confirmar Plantilla',
          text:
            'La FECHA FINALIZACION es un dato requerido revisar en la linea ' +
            (index + 1),
          //footer: '<a href="">Why do I have this issue?</a>',
        });
        return;
      }

      this.unJob.requerimientos = [];

      //Aqui ajusta los Datos de los Requerimientos
      if (itemData['REQUERIMIENTO1'] != undefined) {
        this.unJob.requerimientos.push(itemData['REQUERIMIENTO1']);
      }

      if (itemData['REQUERIMIENTO2'] != undefined) {
        this.unJob.requerimientos.push(itemData['REQUERIMIENTO2']);
      }

      if (itemData['REQUERIMIENTO3'] != undefined) {
        this.unJob.requerimientos.push(itemData['REQUERIMIENTO3']);
      }

      if (itemData['REQUERIMIENTO4'] != undefined) {
        this.unJob.requerimientos.push(itemData['REQUERIMIENTO4']);
      }

      this.unosJobs.push(this.unJob);
      
      //for (let index1 = 0; index1 < datosRequerimientos.length; index1++) {
      //  //console.log(datosRequerimientos[index1]);
      //}
    }

    //Aqui estan los datos ajustados OK, para ser insertados a la BD
    //console.log('DATOS AJUSTADOS', this.unosJobs);

    this.contador = 0;

    for (let index = 0; index < this.unosJobs.length; index++) {
      let miData = this.unosJobs[index];
      console.log("Datos aInsertar",miData);


      //Aqui inserta la Oferta
      await this.auth
        .inserta_brandProviderJobOffer(miData)
        .toPromise()
        .then((resp: any) => {
          ////console.log(resp);
          if (resp['ok'] == true) {
            //this.users.splice(i, 1);

            //console.log(resp['data'].id);

            //Aqui ajusta del ID de la oferta que acabo de crear para asignarlo a los requerimientos
            this.unJobRequirement.brandProviderJobOfferId = resp['data'].id;

            //Aqui inserta los requerimientos de la Oferta
            for (
              let index1 = 0;
              index1 < miData.requerimientos.length;
              index1++
            ) {
              //Aqui ajusta el requerimiento de la oferta que va a crear
              this.unJobRequirement.requirement = miData.requerimientos[index1];

              this.auth
                .inserta_brandProviderJobOfferRequirement(this.unJobRequirement)
                .toPromise()
                .then((resp1: any) => {
                  ////console.log(resp);
                  if (resp1['ok'] == true) {
                    //this.users.splice(i, 1);
                  } else {
                    //console.log(resp1);

                    Swal.fire({
                      icon: 'error',
                      title: 'Error al Insertar JobOfferRequirement ',
                      text: resp['message'],
                      //footer: '<a href="">Why do I have this issue?</a>',
                    });
                    return;
                  }
                });
            }

            //Aqui ajusta la autorizacion de la Zona, para el Proveedor/Marca
            this.unBrandProviderZone.brandProviderId = miData.brandProviderId;
            this.unBrandProviderZone.zoneId = miData.zoneId;

            //Aqui crea la autorizacion de la Zona, para el Proveedor/Marca
            this.auth
              .inserta_brandProviderZone(this.unBrandProviderZone)
              .toPromise()
              .then((resp2: any) => {
                ////console.log(resp);
                if (resp2['ok'] != true) {
                  //console.log("Ya existe la autorizacion para la Zona...");
                  //Swal.fire({
                  //  icon: 'error',
                  //  title: 'Error al Insertar JobZone ',
                  //  text: resp['message'],
                  //footer: '<a href="">Why do I have this issue?</a>',
                  //});
                  //return;
                }
              });

            //Aqui inserta la activacion de la Zona en el proveedor/Marca

            this.contador++;
          } else {
            //console.log(resp);

            Swal.fire({
              icon: 'error',
              title: 'Error al Insertar JobOffer ',
              text: resp['message'],
              //footer: '<a href="">Why do I have this issue?</a>',
            });
            return;
          }
        });
        
    }

    //console.log(this.contador);
    Swal.fire(
      ' Ofertas Creadas desde Plantilla. (' + this.contador.toString() + ')'
    );

    this.unosJobs = [];
    this.excelData = [];
    this.fileUploader.nativeElement.value = null;
  }

  async generaPlantilla() {
    await this.cargarBrandProviders();
    await this.cargarZones();

    var misDatos: IDataZonesExcel = {
      zonesTable: this.zones,
      brandprovidersTable: this.brandProviders,
    };

    ////console.log(misDatos);

    //this.saveFile(this.sqls[0]);

    await this._excelService.dowloadZones(misDatos);
  }


  appendLeadingZeroes(n: number) {
    if (n <= 9) {
      return '0' + n;
    }
    return n;
  }

  getStrDate(unDate: Date) {
    let unStrDate =
      unDate.getFullYear() +
      '-' +
      this.appendLeadingZeroes(unDate.getMonth() + 1) +
      '-' +
      this.appendLeadingZeroes(unDate.getDate());

    return unStrDate;
  }

  numeroAFecha(numeroDeDias:number, esExcel = false) {
    var diasDesde1900 = esExcel ? 25567 + 1 : 25567;
  
    // 86400 es el número de segundos en un día, luego multiplicamos por 1000 para obtener milisegundos.
    return new Date((numeroDeDias - diasDesde1900) * 86400 * 1000);
  }

}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogContentExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
