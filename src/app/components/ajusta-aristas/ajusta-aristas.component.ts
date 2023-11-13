import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalConstants } from '../shared/angular-material/global-constants';

import Swal from 'sweetalert2';
import { ProductosLogModel } from 'src/app/models/productos.model';

@Component({
  selector: 'app-ajusta-aristas',
  templateUrl: './ajusta-aristas.component.html',
  styleUrls: ['./ajusta-aristas.component.css']
})
export class AjustaAristasComponent implements OnInit {
  mensaje: string = 'ETL Ajusta Aristas x Proveedor/Marca.';

  logProduct!: ProductosLogModel[];
  //  Identificationtypes!: IdentificationtypeModel[];

  cargando = false;

  displayedColumns: string[] = [
    'id',
    'brandProviderProductId',
    'sku',
    'product',
    'long',
    'high',
    'wide'
    //'acciones'
  ];
  
  dataSource = new MatTableDataSource<ProductosLogModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //mensaje: string = 'Log Plantillas';
  accion = 'Cargar';

  anBrandProviderId: number = -1;

  anProviderId: any;
  anProviderName: any;

  brandProviders!: any[];
  providers!: any[];


  constructor(
    private auth: AuthService,
    
  ) { 
    //this.anProviderId = GlobalConstants.bpid;
    //this.anProviderId = '11';

    
    //this.anProviderName = GlobalConstants.businessName;
    //this.anProviderName = 'ENACSA';

    this.mensaje = this.mensaje;

    this.cargarBrandProviders();

  }

  ngOnInit(): void {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  async cargarLogProducts() {
    //this.cargando = true;

    await this.auth
      .getlogProducts(this.anBrandProviderId)
      .toPromise()
      .then((resp: any) => {
        this.logProduct = resp['datos']['rows'];
        //console.log(this.logProduct);

        this.dataSource = new MatTableDataSource<ProductosLogModel>(
          this.logProduct
        );

        //console.log(this.dataSource);

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


  ajustaBrandProvider(anBrandProvider:any){
    this.anBrandProviderId = anBrandProvider;

    this.cargarLogProducts();

  }
 
  async loadAristas(){
    //console.log(this.anBrandProviderId);

    if (this.anBrandProviderId != -1){

   
    Swal.fire({
      title: 'Ajustando Aristas en Pamii App... Proveedor/Marca: ' + this.anBrandProviderId,
      text: 'Espere por favor...',
      //imageUrl: 'https://unsplash.it/400/200',
      imageUrl: '../../../assets/images/pamii_logo.jpg',
      //imageWidth: 400,
      //imageHeight: 200,
      imageAlt: 'Pamii image',
    });

    Swal.showLoading();


    //this.anBrandProviderId = GlobalConstants.bpid;

    //console.log('BPID:', this.anBrandProviderId);

    await this.auth.procesaAristas(this.anBrandProviderId).subscribe(
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
              'Fueron Ajustados : ' +
              resp['nro_ajustes'] +
              ' Productos...',
            showConfirmButton: false,
            timer: 3000,
          });

          this.cargarLogProducts();

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
        //console.log(err);
      }
    );
 
    }
    else {
      Swal.fire({
        icon: 'error',
        title: 'Error al Procesar',
        text: "Debe seleccionar un Proveedor/Marca para ajustar Aristas.",
      });      
    }
  }

  async cargarBrandProviders() {
    //this.cargando = true;
    await this.auth
      .getBrandProviders()
      .toPromise()
      .then((resp: any) => {
        this.brandProviders = resp['data'];
        //console.log('BRAND_PROVIDERS', this.brandProviders);

        //this.cargando = false;
      });
  }

  async cargarProviders() {
    //this.cargando = true;
    await this.auth
      .getProviders()
      .toPromise()
      .then((resp: any) => {
        this.providers = resp['data'];
        //console.log('PROVIDERS', this.providers);

        //this.cargando = false;
      });
  }


}
