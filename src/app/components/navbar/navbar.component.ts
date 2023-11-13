import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
//import { DotusService } from 'src/app/services/dotus.service';
import { GlobalConstants } from '../shared/angular-material/global-constants';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  anRole: string = GlobalConstants.role;
  anOptions: any = GlobalConstants.options;

  anProvider:any = GlobalConstants.bpid;

  anProviderName:any = GlobalConstants.businessName;


  anEmail: string = '';

  @Input('mensaje') mensaje: any;

  constructor(
    private auth: AuthService,    
    private router: Router,
    ) {
    if (this.anRole === 'sin Role') {
      this.anRole =  GlobalConstants.role;

      //console.log('ROLE22', this.anRole);
      //console.log('ROLE2222', this.anOptions);

      this.anEmail = this.auth.leerEmail();
      //console.log('Email22', this.anEmail);
    }
    else{
      //console.log('ROLE23', this.anRole);
      //console.log('ROLE2223', this.anOptions);

      this.anEmail = this.auth.leerEmail();
      //console.log('Email23', this.anEmail);

    }

    //console.log(this.anProvider,this.anProviderName)

    /*
    if (GlobalConstants.businessName === '-1') {
      //console.log("Cargardo provider...")
      this.cargarDatos()
    }
    */

  }

  async ngOnInit() {

  }

  async cargarGroup() {
    //this.cargando = true;
    await this.auth
      .getAuthGroupConn(this.anEmail)
      .toPromise()
      .then((resp: any) => {
        let datos = resp[0];
        this.anRole = datos.role_id;
        GlobalConstants.role = this.anRole;
        //console.log('ROLE1', GlobalConstants.role);

        this.auth
          .getByIdAuthOptions(this.anRole)
          .toPromise()
          .then((resp: any) => {
            this.anOptions = resp;

            GlobalConstants.options = this.anOptions;
            //console.log('OPCIONES1', GlobalConstants.options);
          });
      });
  }



  salir() {
    this.auth.logout();
    GlobalConstants.options = [];
    this.router.navigateByUrl('/login');
  }

}
