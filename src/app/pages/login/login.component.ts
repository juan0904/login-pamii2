import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { GlobalConstants } from 'src/app/components/shared/angular-material/global-constants';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  usuario: UsuarioModel = new UsuarioModel();
  recordarme = false;

  roleId: string = '';
  opciones: any;


  anProviderId:any;
  provider:any = [];

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (localStorage.getItem('email')) {
      this.usuario.email = localStorage.getItem('email') || '';
      this.recordarme = true;
    }
  }

 login(form: NgForm) {
    if (form.invalid) {
      return;
    }

    
    Swal.fire({
      title: 'Bienvenido a Pamii App...',
      text: 'Espere por favor...',
      //imageUrl: 'https://unsplash.it/400/200',
      imageUrl: '../../../assets/images/pamii_logo.jpg',
      //imageWidth: 400,
      //imageHeight: 200,
      imageAlt: 'Pamii image',
    });

    
    Swal.showLoading();

    this.auth.login(this.usuario).subscribe(
      (resp:any) => {
        //console.log(resp);
        Swal.close();

        if (this.recordarme) {
          localStorage.setItem('email', this.usuario.email);
        }

        if (resp['ok'] == true) {
          GlobalConstants.bpid = resp['bpid'];
          GlobalConstants.role = resp['role'];

          this.anProviderId =  GlobalConstants.bpid;

          this.cargarDatos();

          /*
          this.auth
          .getProvidersByProvider(this.anProviderId)
          .toPromise()
          .then((resp: any) => {
            this.provider = resp[0];
            GlobalConstants.businessName =this.provider.businessName;
    
            //console.log('PROVIDER',GlobalConstants.businessName);
    
          });
          */
              
          //console.log(resp);
          Swal.close();


          this.router.navigateByUrl('/home');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error al autenticar',
            text: resp['msg'],
            //footer: '<a href="">Why do I have this issue?</a>',
          });
        }
      },
      (err:any) => {

        //console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Error al autenticar',
          text: 'Email / Password Errados...',
          //footer: '<a href="">Why do I have this issue?</a>',
        });

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

  submitLogin() {}

  getConnectGroup() {}

  async cargarGroup() {
    //this.cargando = true;
    await this.auth
      .getAuthGroupConn(this.usuario.email)
      .toPromise()
      .then((resp: any) => {
        let datos = resp[0];
        this.roleId = datos.role_id;
        GlobalConstants.role =this.roleId;
        //console.log('ROLE',GlobalConstants.role);

        this.auth
          .getByIdAuthOptions(this.roleId)
          .toPromise()
          .then((resp: any) => {
            this.opciones = resp;

            GlobalConstants.options = this.opciones;
            //console.log('OPCIONES', GlobalConstants.options);
          });
      });
  }

  async cargarProvider() {
    //this.cargando = true;
    await this.auth
      .getProvidersByProvider(this.anProviderId)
      .toPromise()
      .then((resp: any) => {
        this.provider = resp;
        //console.log('PROVIDER',this.provider['data'][0].businessName);

        GlobalConstants.businessName = this.provider['data'][0].businessName;

      });
  }


  async cargarDatos(){

    await this.cargarProvider()

  }


  private async getAllOptions(anId: string): Promise<void> {
    //console.log('OPCIONES', anId);

    await this.auth
      .getByIdAuthOptions(anId)
      .toPromise()
      .then((resp: any) => {
        this.opciones = resp;
        //console.log('OPCIONES', this.opciones);
      });
  }
}
