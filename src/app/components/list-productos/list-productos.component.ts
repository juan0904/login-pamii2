import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BrandProviderTable } from 'src/app/models/excel.interface';
import { ProductosModel } from 'src/app/models/productos.model';
import { AuthService } from 'src/app/services/auth.service';
import { GlobalConstants } from '../shared/angular-material/global-constants';

@Component({
  selector: 'app-list-productos',
  templateUrl: './list-productos.component.html',
  styleUrls: ['./list-productos.component.css']
})
export class ListProductosComponent implements OnInit {
  mensaje:string = "Productos Proveedor/Marca."

  productos!:ProductosModel [] ;

  cargando = false;


  displayedColumns: string[] = ['id','sku','product','optionsStatus','optionsUpdatedat','acciones'];
  dataSource = new MatTableDataSource<ProductosModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  //mensaje: string = 'Log Plantillas';
  accion = 'Cargar';


  brandProviders: BrandProviderTable[] = [];


  anProviderId:any;
  anBrandProviderId:any;

  anProviderName:any;

   
  constructor(
     private auth: AuthService,
    ) { 
      this.anProviderId = GlobalConstants.bpid;
      this.anProviderName = GlobalConstants.businessName;

      this.mensaje = this.mensaje + " - " + this.anProviderName

      this.cargarDatos();

    }

  ngOnInit(): void {
   
  }

  async cargarDatos(){

    await this.cargarBrandProviders(); 

    this.anBrandProviderId = this.brandProviders[0].brandProviderId;
      
    await this.cargarProductos();      

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
        
  }


  async cargarProductos() {
   
    //Por ahora solo aplica para los productos de QUEST
    //this.anBrandProviderId = this.brandProviders[0].brandProviderId;

    //this.anBrandProviderId = GlobalConstants.bpid;
    //this.cargando = true;
    await this.auth.getProductos(this.anBrandProviderId)
      .toPromise().then((resp: any) => {
    
        //console.log(resp)
        this.productos = resp;
        //console.log(this.productos)

        this.dataSource = new MatTableDataSource<ProductosModel>(this.productos);    
 
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


  async select(anBrandProvider:any){
    //console.log(anBrandProvider);
    
    this.anBrandProviderId = anBrandProvider;

    await this.cargarProductos();      


  }

}
