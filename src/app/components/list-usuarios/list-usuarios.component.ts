import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import {
  IDataSqlExcel,
  ISQLTable,
  ISQLTableDatos,
  TestEvent,
} from 'src/app/models/excel.interface';
import { LogPlantillaModel } from 'src/app/models/logplantilla.model';
import { UsuarioPamiiModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import { ExcelService } from 'src/app/services/excel.service';
import { HerosService } from 'src/app/services/heros.service';
//import { DotusService } from 'src/app/services/dotus.service';
import Swal from 'sweetalert2';
import * as fs from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../shared/angular-material/global-constants';

@Component({
  selector: 'app-list-usuarios',
  templateUrl: './list-usuarios.component.html',
  styleUrls: ['./list-usuarios.component.css'],
})
export class ListUsuariosComponent implements OnInit {
  mensaje: string = 'Usuarios Pamii';

  //municipios:any= municipiosData;

  geocercas: any = [];
  zonas: any = [];

  sqls: any = [];

  sqls1!: IDataSqlExcel;

  rows: ISQLTable[] = [];

  misSqls: ISQLTableDatos[] = [];

  users!: UsuarioPamiiModel[];
  logPlantilla!: LogPlantillaModel[];
  //  Identificationtypes!: IdentificationtypeModel[];

  cargando = false;

  displayedColumns: string[] = [
    'id',
    'nombre',
    'correo',
    'estado',
    'rol',
    'acciones',
  ];
  dataSource = new MatTableDataSource<UsuarioPamiiModel>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //mensaje: string = 'Log Plantillas';
  accion = 'Cargar';

  anBrandProviderId: any = 2;

  userInfo: any;

  //cargando = false;

  //displayedColumns: string[] = ['brandProviderId','fecha_horaInicio','fecha_horaFin','status','acciones'];
  //dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  //dataSource = new MatTableDataSource<LogPlantillaModel>();

  //@ViewChild(MatPaginator) paginator!: MatPaginator;
  //@ViewChild(MatSort) sort!: MatSort;


  anProviderId:any = '-1';


  anProviderName:any;

  constructor(
    private auth: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private _herosService: HerosService,
    private _excelService: ExcelService,
    private http: HttpClient
  ) {
    ////console.log(this.municipios);

    this.anProviderId = GlobalConstants.bpid;
    this.anProviderName = GlobalConstants.businessName;

    //this.mensaje = this.mensaje + " - " + this.anProviderName

    this.cargarData();
  }

  ngOnInit(): void {
    //const url: string = '../data/exportZonas.json';
    
    //this.http.get(url).subscribe((response) => {
    //  this.userInfo = response;
      //console.log(this.userInfo);
    //});
  }

  async cargarData() {
    await this.cargarUsuarios();

    //await this.generaGeocercas();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async cargarUsuarios() {
    //this.cargando = true;
    await this.auth
      .getUsuarios()
      .toPromise()
      .then((resp: any) => {
        //console.log(resp);
        //this.logPlantilla = resp['datos']['rows'];
        this.users = resp['data'];

        //console.log(this.users);

        this.dataSource = new MatTableDataSource<UsuarioPamiiModel>(this.users);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.cargando = false;
      });
  }

  async cargarGeocercas() {
    //this.cargando = true;
    await this.auth
      .getGeocercasFile()
      .toPromise()
      .then((resp: any) => {
        //console.log(resp);
        //this.logPlantilla = resp['datos']['rows'];
        this.geocercas = resp;

        this.cargando = false;
      });
  }

  async cargarZonas() {
    //this.cargando = true;
    await this.auth
      .getZonasFile()
      .toPromise()
      .then((resp: any) => {
        //console.log(resp);
        //this.logPlantilla = resp['datos']['rows'];
        this.zonas = resp;

        //console.log(this.zonas);

        //let codigo = '1';
        //this.buscarDane('76001000');

        /*
        for (let i=0; i< this.geocercas.features.length; i++){
          //console.log('GEOCERCAS Propiedades',this.geocercas.features[i].properties)
          ////console.log('GEOCERCAS Coordenadas',this.geocercas.features[i].geometry.coordinates)
          let coordenadas = this.geocercas.features[i].geometry.coordinates[0]
          for (let j=0; j< coordenadas.length; j++){
            //console.log('GEOCERCAS Coordenada(',j,') Lat:', coordenadas[j][0])
            //console.log('GEOCERCAS Coordenada(',j,') Long:',coordenadas[j][1])
          }
        }
        */

        this.cargando = false;
      });
  }

  buscarDane(unDane: string) {
    for (let i = 0; i < this.zonas.length; i++) {
      let infoDane = this.zonas[i].zone.split('-');
      if (infoDane.length == 2) {
        infoDane[0] = infoDane[0].trim();
        infoDane[1] = infoDane[1].trim();

        if (infoDane[1] == unDane) {
          infoDane.push(this.zonas[i].id);

          ////console.log(infoDane);
          return infoDane;
        }
      }
    }
    return null;
  }

  eliminarUsuarioPamii(index: number, anUser: UsuarioPamiiModel) {
    //console.log(index, anUser);

    this.auth
      .crud_usuarios(anUser, 'eliminar')
      .toPromise()
      .then((resp: any) => {
        ////console.log(resp);
        if (resp['ok'] == true) {
          //this.users.splice(i, 1);

          //console.log(resp);

          //Swal.fire('Registro Eliminado..');

          this.snackBar.open(
            'El usuario ' + anUser.nombre + ' a sido eliminado con exito.',
            '',
            {
              duration: 3000,
            }
          );

          this.cargarUsuarios();
        } else {
          //console.log(resp);

          Swal.fire({
            icon: 'error',
            title: 'Error al Eliminar Usuario ' + anUser.nombre,
            text: resp['message'],
            //footer: '<a href="">Why do I have this issue?</a>',
          });
        }
      });
  }

  /*
  async generaGeocercas() {
    await this.cargarGeocercas();

    await this.cargarZonas();

    //this.sqls = [];

    this.misSqls = [];

    for (let i = 0; i < this.geocercas.features.length; i++) {

      let codigoDane = this.geocercas.features[i].properties.DPTOMPIO + '000';
      ////console.log(codigoDane);

      let datosPamii = this.buscarDane(codigoDane);

      if (datosPamii != null) {
        ////console.log(datosPamii);

        let systemZoneId = datosPamii[2];

        //let unSql!:ISQLTable;

        let SQL = `DELETE FROM system_zone_location WHERE systemZoneId = ${systemZoneId};`;

        //unSql.sql = SQL;
        //unSql.idzona = systemZoneId;

        this.sqls.push(SQL);

        this.rows = [];

        var test: ISQLTable = { idzona: systemZoneId, sql: SQL };
        ////console.log(test); // Outputs the array

        this.rows.push(test);

        ////console.log(this.rows);
        ////console.log(this.rows[0]);

        ////console.log(SQL)

        ////console.log('GEOCERCAS Coordenadas',this.geocercas.features[i].geometry.coordinates)
        let coordenadas = this.geocercas.features[i].geometry.coordinates[0];
        for (let j = 0; j < coordenadas.length; j++) {
          ////console.log('GEOCERCAS Coordenada(', j, ') Lat:', coordenadas[j][0]);
          ////console.log('GEOCERCAS Coordenada(', j, ') Long:', coordenadas[j][1]);

          let separador = '`';

          let SQL = `INSERT INTO system_zone_location (latitude,longitude,${separador}order${separador},systemZoneId) VALUES (${coordenadas[j][1]},${coordenadas[j][0]},${j},${systemZoneId});`;

          //let unSql!:ISQLTable;

          //unSql.sql = SQL;
          //unSql.idzona = systemZoneId;

          this.sqls.push(SQL);

          var test: ISQLTable = { idzona: systemZoneId, sql: SQL };
          ////console.log(test); // Outputs the array

          this.rows.push(test);

          ////console.log(SQL)
        }

        var misDatos: ISQLTableDatos = { id: systemZoneId, datos: this.rows };

        ////console.log(this.sqls);
        ////console.log(misDatos);

        this.misSqls.push(misDatos);
      }
    }

    ////console.log(this.misSqls);

    var misSqls11: IDataSqlExcel = { sqlTable: this.misSqls };

    this.sqls1 = { sqlTable: this.misSqls };

    ////console.log(this.sqls1);

    //console.log(this.sqls);

    //this.saveFile(this.sqls[0]);

    this._excelService.dowloadZonas(this.sqls1);

    ////console.log(this.rows)

    //var misSqls: IDataSqlExcel = {sqlTable: this.rows};

    ////console.log(misSqls);
  }

  generaHeroes() {
    this._herosService.getHeros().subscribe((response) => {
      //console.log(response);
      this._excelService.dowloadExcel(response);
    });
  }
 
  saveFile(misDatos: string) {
    const myText = 'Hi!\r\n';
    fs.saveAs('./salida.txt', myText);
  }
 */
 
  /*
  download(): void {
    this._herosService.getHeros().subscribe((response) => {
      this._excelService.dowloadExcel(response);
    });
  }
  */
}
