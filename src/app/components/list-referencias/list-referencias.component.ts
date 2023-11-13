import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ReferenciasModel } from 'src/app/models/productos.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-list-referencias',
  templateUrl: './list-referencias.component.html',
  styleUrls: ['./list-referencias.component.css']
})
export class ListReferenciasComponent implements OnInit {
  mensaje: string = "Productos Proveedor/Marca."

  //productos!:ProductosModel [] ;

  referencias!: ReferenciasModel[];

  cargando = false;


  displayedColumns: string[] = [
    'id',
    'sku', 'reference',
    'optionsStatus', 'optionsUpdatedat',
    'qty', 'price', 'iva',
    'size',
    //'color'
    'acciones'
  ];
  dataSource = new MatTableDataSource<ReferenciasModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  //mensaje: string = 'Log Plantillas';
  accion = 'Cargar';


  anBrandProviderId: any = 2;

  anIdProduct: any;

  constructor(
    private auth: AuthService,
    private aRoute: ActivatedRoute
  ) {

    this.anIdProduct = this.aRoute.snapshot.params['id'];

    this.cargarReferencias();

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


  async cargarReferencias() {
    //this.cargando = true;
    await this.auth.getReferencias(this.anIdProduct)
      .toPromise().then((resp: any) => {

        //console.log(resp)
        this.referencias = resp;
        //console.log(this.referencias)

        this.dataSource = new MatTableDataSource<ReferenciasModel>(this.referencias);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.cargando = false;

      });

  }


}
