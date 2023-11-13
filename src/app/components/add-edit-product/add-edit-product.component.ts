import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReferenciasModel } from 'src/app/models/productos.model';
//import { DialogData } from '../list-brand-providers/list-brand-providers.component';
import { AuthService } from 'src/app/services/auth.service';

//import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-edit-product',
  templateUrl: './add-edit-product.component.html',
  styleUrls: ['./add-edit-product.component.css']
})
export class AddEditProductComponent implements OnInit {

  anProduct: any[] = [];
  referencias!: ReferenciasModel[];

  anSkuProduct:any;

  //forma!: FormGroup;

  anIdProduct:any;

  constructor(
    //public fb: FormBuilder,
    public dialogRef: MatDialogRef<AddEditProductComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private auth: AuthService
  ) {

    this.anSkuProduct = data.skuProduct;

    this.cargarDatos();


/*
    this.forma = fb.group({
      'titulo': data.skuProduct,
      'desc' : data.skuReferencia
    });
*/


  }
  
  ngOnInit(): void {

  }


  async cargarDatos(){
    await this.cargarProductBySku();

    await this.cargarReferencias();

  }

  async cargarProductBySku() {
    //this.anBrandProviderId = GlobalConstants.bpid;
    //this.cargando = true;

    //console.log("SKU Producto:",this.anSkuProduct);
    
    await this.auth
      .getProductoSku(this.anSkuProduct)
      .toPromise()
      .then((resp: any) => {
        this.anProduct = resp.datos;

        this.anIdProduct = this.anProduct[0].id;

        //console.log("Producto",this.anProduct)
      });
    
  }


  async cargarReferencias() {
    //this.cargando = true;
    await this.auth.getReferencias(this.anIdProduct)
      .toPromise().then((resp: any) => {

        //console.log(resp)
        this.referencias = resp;
        //console.log(this.referencias)
      });

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
