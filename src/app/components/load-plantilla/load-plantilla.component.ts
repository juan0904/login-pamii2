import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LogPlantillaModel } from 'src/app/models/logplantilla.model';
import { AuthService } from 'src/app/services/auth.service';
//import { DotusService } from 'src/app/services/dotus.service';
import Swal from 'sweetalert2';
import { GlobalConstants } from '../shared/angular-material/global-constants';
import { BrandProviderTable } from 'src/app/models/excel.interface';

@Component({
  selector: 'app-load-plantilla',
  templateUrl: './load-plantilla.component.html',
  styleUrls: ['./load-plantilla.component.css'],
})
export class LoadPlantillaComponent implements OnInit {
  mensaje: string = 'ETL Productos Proveedor/Marca.';

  logPlantilla: LogPlantillaModel[] = [];
  //  Identificationtypes!: IdentificationtypeModel[];

  cargando = false;

  displayedColumns: string[] = [
    'id',
    'fechahorainicio',
    'fechahorafin',
    'status',
    //'acciones'
  ];
  dataSource = new MatTableDataSource<LogPlantillaModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //mensaje: string = 'Log Plantillas';
  accion = 'Cargar';


  //cargando = false;

  //displayedColumns: string[] = ['brandProviderId','fecha_horaInicio','fecha_horaFin','status','acciones'];
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  //dataSource = new MatTableDataSource<LogPlantillaModel>();

  //@ViewChild(MatPaginator) paginator!: MatPaginator;
  //@ViewChild(MatSort) sort!: MatSort;

  anProviderId: any;
  anProviderName: any;

  brandProviders: BrandProviderTable[] = [];
  anBrandProviderId: any = '-1';

  constructor(
    private auth: AuthService,
  ) {
    this.anProviderId = GlobalConstants.bpid;
    this.anProviderName = GlobalConstants.businessName;

    this.mensaje = this.mensaje + ' - ' + this.anProviderName;

    this.cargarDatos();

  }

  ngOnInit(): void {}

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async loadPlantilla() {
    
    Swal.fire({
      title: 'Procesando Cargue de Productos a Pamii App...',
      text: 'Espere por favor...',
      //imageUrl: 'https://unsplash.it/400/200',
      imageUrl: '../../../assets/images/pamii_logo.jpg',
      //imageWidth: 400,
      //imageHeight: 200,
      imageAlt: 'Pamii image',
    });

    Swal.showLoading();

    //brandProviderId	brandId	brand	providerId	businessName	total_name
    //              2	      3	Quest	         5	NCS SAS	      2 - NCS SAS / Quest
    //Este cargue de Plantilla solo aplica para los productos de QUEST
    //Se modifico ya que el Usuario esta Autorizado por Proveedor y no por Proveedor/Marca como inicialmente se ajusto

    this.anBrandProviderId = 2;

    //this.anBrandProviderId = GlobalConstants.bpid;

    //console.log('BPID:', this.anBrandProviderId);

    await this.auth.procesaPlantilla(this.anBrandProviderId).subscribe(
      (resp: any) => {
        //console.log(resp);
        Swal.close();

        if (resp['ok'] == true) {
          //console.log(resp);
          Swal.close();

          Swal.fire({
            //position: 'top-end',
            position: 'center',
            icon: 'success',
            title:
              'Fueron Procesados: ' +
              resp['nro_registros_cargados'] +
              ' Registros...',
            showConfirmButton: false,
            timer: 3000,
          });

          this.cargarLogPlantilla();

          //this.router.navigateByUrl('/home');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al Procesar',
            text: resp['msg'],
            //footer: '<a href="">Why do I have this issue?</a>',
          });
        }
      },
      (err: any) => {
        console.log(err);
        /*
        //console.log(err.error.error.message);
        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: err.error.error.message,
          footer: '<a href="">Why do I have this issue?</a>',
        });
        */

        /*
          Swal.fire({
            type: 'error',
            title: 'Error al autenticar',
            text: err.error.error.message
          });
          */
      }
    );
  }

  async cargarLogPlantilla() {
    //this.cargando = true;
    await this.auth
      .getlogPlantilla(this.anBrandProviderId)
      .toPromise()
      .then((resp: any) => {
        console.log(resp);
        
        this.logPlantilla = resp['datos']['rows'];
        console.log("PLANTILLA",this.logPlantilla);

        this.dataSource = new MatTableDataSource<LogPlantillaModel>(
          this.logPlantilla
        );

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        //this.dataSource.sort = this.sort;

        //Cambia el orden de ASC a DESC
        const sortState: Sort = { active: 'id', direction: 'desc' };
        this.sort.active = sortState.active;
        this.sort.direction = sortState.direction;
        this.sort.sortChange.emit(sortState);

        this.cargando = false;
      });
  }

  async cargarDatos() {
    await this.cargarBrandProviders();

    this.anBrandProviderId = this.brandProviders[0].brandProviderId;

    this.cargarLogPlantilla();

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
      });
  }

  async select(anBrandProvider: any) {
    //console.log(anBrandProvider);

    this.anBrandProviderId = anBrandProvider;
    
    await this.cargarLogPlantilla();;
  }  
  
}
