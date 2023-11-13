import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BrandProviderTable } from 'src/app/models/excel.interface';
import { GlobalConstants } from '../shared/angular-material/global-constants';
import { ParametrosPamiiModel } from 'src/app/models/parametros.model';
import { PamiiService } from 'src/app/services/pamii.service';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-parametros',
  templateUrl: './list-parametros.component.html',
  styleUrls: ['./list-parametros.component.css'],
})
export class ListParametrosComponent implements OnInit {
  mensaje: string = 'Productos Proveedor/Marca.';

  //productos!:ProductosModel [] ;

  parametros: ParametrosPamiiModel[] = [];

  cargando = false;

  //displayedColumns: string[] = ['id','sku','product','optionsStatus','optionsUpdatedat','acciones'];
  displayedColumns: string[] = [
    'idproveedormarca',
    'idparametro',
    'nombre',
    'valor1',
    'valor2',
    'valor3',
    'valor4',
    'optionsUpdatedat',
    'acciones',
  ];
  dataSource = new MatTableDataSource<ParametrosPamiiModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //mensaje: string = 'Log Plantillas';
  accion = 'Cargar';

  brandProviders: BrandProviderTable[] = [];

  anProviderId: any;
  anBrandProviderId: any;

  anProviderName: any;

  constructor(private auth: PamiiService, private snackBar: MatSnackBar) {
    this.anProviderId = GlobalConstants.bpid;
    this.anProviderName = GlobalConstants.businessName;

    this.mensaje = this.mensaje + ' - ' + this.anProviderName;

    this.cargarDatos();
  }

  ngOnInit(): void {}

  async cargarDatos() {
    await this.cargarBrandProviders();

    this.anBrandProviderId = this.brandProviders[0].brandProviderId;

    await this.cargarParametros();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async cargarParametros() {
    //Por ahora solo aplica para los productos de QUEST
    //this.anBrandProviderId = this.brandProviders[0].brandProviderId;

    //this.anBrandProviderId = GlobalConstants.bpid;
    //this.cargando = true;
    await this.auth
      .getParametrosBP(this.anBrandProviderId)
      .toPromise()
      .then((resp: any) => {
        //console.log(resp)
        this.parametros = resp.datos;
        //console.log(this.parametros);

        this.dataSource = new MatTableDataSource<ParametrosPamiiModel>(
          this.parametros
        );

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.cargando = false;
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

  async select(anBrandProvider: any) {
    //console.log(anBrandProvider);

    this.anBrandProviderId = anBrandProvider;

    await this.cargarParametros();
  }

  async eliminarParametroPamii(
    index: number,
    anParametro: ParametrosPamiiModel
  ) {
    //console.log(index, anUser);

    await this.auth
      .crud_Parametros(anParametro, anParametro.idparametro, 'eliminar')
      .toPromise()
      .then(
        (resp: any) => {
          ////console.log(resp);
          if (resp['ok'] == true) {
            //this.users.splice(i, 1);

            //console.log(resp);

            //Swal.fire('Registro Eliminado..');

            this.snackBar.open(
              'El parametro ' +
                anParametro.nombre +
                ' a sido eliminado con exito.',
              '',
              {
                duration: 3000,
              }
            );

            this.cargarParametros();
          } else {
            //console.log(resp);

            Swal.fire({
              icon: 'error',
              title: 'Error al Eliminar Usuario ' + anParametro.nombre,
              text: resp['message'],
              //footer: '<a href="">Why do I have this issue?</a>',
            });
          }
        },
        (err: any) => {
          //console.log(err);

          let mensaje = err.error.msg;

          Swal.fire({
            icon: 'error',
            title: 'Error al Eliminar el Parametro.',
            text: mensaje,
          });
        }
      );
  }
}
