import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MultimediaModel } from 'src/app/models/productos.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-list-multimedia',
  templateUrl: './list-multimedia.component.html',
  styleUrls: ['./list-multimedia.component.css']
})
export class ListMultimediaComponent implements OnInit {
  mensaje: string = "Multimedia Proveedor/Marca."

  //productos!:ProductosModel [] ;

  multimedias!: MultimediaModel[];

  cargando = false;


  displayedColumns: string[] = [
    'id',
    'url',
    'imagen',
    //'reference',
    //'optionsStatus','optionsUpdatedat',
    /*
    'qty','price','iva',
    'size',
    */
    //'color'
    //'acciones'
  ];
  dataSource = new MatTableDataSource<MultimediaModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  //mensaje: string = 'Log Plantillas';
  accion = 'Cargar';


  anBrandProviderId: any;

  anIdReference: any;
  anIdProduct: any;

  constructor(
    //private pamii: PamiiService, 
    private auth: AuthService,
    //private snackBar: MatSnackBar,
    private aRoute: ActivatedRoute
  ) {

    this.anIdReference = this.aRoute.snapshot.params['id'];
    this.anIdProduct = this.aRoute.snapshot.params['id2'];

    //console.log(this.anIdReference, this.anIdProduct)

    this.cargarMultimedias();

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


  async cargarMultimedias() {
    //this.cargando = true;
    await this.auth.getMultimedia(this.anIdReference)
      .toPromise().then((resp: any) => {

        //console.log(resp)
        this.multimedias = resp;
        //console.log(this.multimedias)

        this.dataSource = new MatTableDataSource<MultimediaModel>(this.multimedias);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.cargando = false;

      });

  }



}

