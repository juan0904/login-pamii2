import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from '../shared/angular-material/global-constants';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth.service';
import { BrandProviderTable } from 'src/app/models/excel.interface';
import { AddEditProductComponent } from '../add-edit-product/add-edit-product.component';

@Component({
  selector: 'app-view-plantilla',
  templateUrl: './view-plantilla.component.html',
  styleUrls: ['./view-plantilla.component.css'],
})
export class ViewPlantillaComponent implements OnInit {
  mensaje: string = 'Plantilla Productos Proveedores/Marca de EstoesPamii';

  excelData: any[] = [];
  plantillaBrands: any[] = [];

  anProviderId: any = '-1';

  anProviderName: any;

  brandProviders: BrandProviderTable[] = [];

  anBrandProviderId: any;

  constructor(private auth: AuthService, 
              public dialog: MatDialog) {}

  ngOnInit(): void {
    this.anProviderId = GlobalConstants.bpid;
    this.anProviderName = GlobalConstants.businessName;

    this.mensaje = this.mensaje + ' - ' + this.anProviderName;

    this.cargarDatos();
  }

  async cargarDatos() {
    await this.cargarBrandProviders();

    this.anBrandProviderId = this.brandProviders[0].brandProviderId;

    await this.cargarPlantillaBrands();
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

  async cargarPlantillaBrands() {
    await this.auth
      .getPlantilla(this.anBrandProviderId)
      .toPromise()
      .then((resp: any) => {
        this.plantillaBrands = resp.datos;
        console.log(this.plantillaBrands);
      });
  }

  async select(anBrandProvider: any) {
    //console.log(anBrandProvider);

    this.anBrandProviderId = anBrandProvider;

    await this.cargarPlantillaBrands();
  }

  viewProduct(anProduct:any){
    console.log(anProduct);

    const dialogRef = this.dialog.open(AddEditProductComponent, {
      width: '900px',
      data: {skuProduct: anProduct['sku del producto'],skuReferencia:anProduct['sku de la referencia'] },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');

      //let prueba = result;
      //console.log(prueba);
    });    

  }
}
