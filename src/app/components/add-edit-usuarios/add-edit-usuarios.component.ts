import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { UsuarioPamiiModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-edit-usuarios',
  templateUrl: './add-edit-usuarios.component.html',
  styleUrls: ['./add-edit-usuarios.component.css']
})
export class AddEditUsuariosComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);

  mensaje: string = "Usuario Pamii";

  roles: any[] = ['ADMIN_ROLE', 'USER_ROLE'];

  brandProviders!: any[];

  providers!: any[];

  estados: any[] = [
    [true, 'Activo'],
    [false, 'Inactivo'],
  ];

  checked = false;
  indeterminate = false;
  labelPosition: 'before' | 'after' = 'after';
  disabled = false;

  hide = true;

  myForm!: FormGroup;

  anUser1: UsuarioPamiiModel = new UsuarioPamiiModel();

  idUsuario: any;
  accion = 'Crear';

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private auth: AuthService,
    private snackBar: MatSnackBar,
    private aRoute: ActivatedRoute
  ) {
    this.myForm = this.fb.group({
      id: [-1],
      nombre: [null],
      correo: ['Ingrese un Correo'],
      password: ['Ingrese un Password'],
      img: [null],
      rol: [null],
      estado: [true],
      google: [null],
      brandProviderId: [null]
    });

    this.idUsuario = this.aRoute.snapshot.params['id'];

    this.cargarProviders();

  }

  ngOnInit(): void {
    if (this.idUsuario !== undefined) {
      this.accion = 'Editar';
      this.editUsuario();
    }
  }


  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  get passwordInput() {
    return this.myForm.get('password');
  }


  async guardarUsuario() {

    this.anUser1 = {
      id: -1,
      nombre: this.myForm.get('nombre')?.value,
      correo: this.myForm.get('correo')?.value,
      password: this.myForm.get('password')?.value,
      img: this.myForm.get('img')?.value,
      rol: this.myForm.get('rol')?.value,
      estado: this.myForm.get('estado')?.value,
      google: this.myForm.get('google')?.value,
      brandProviderId: this.myForm.get('brandProviderId')?.value
    };

  
    if (this.accion === 'Crear') {
      ////console.log(this.anUser1);
      await this.auth
        .crud_usuarios(this.anUser1, 'insertar')
        .toPromise()
        .then((resp: any) => {
          //console.log(this.anUser1);
          //console.log(resp);
          if (resp['ok'] == true) {
            //this.users.splice(i, 1);

            //console.log(resp);

            Swal.fire({
              //position: 'top-end',
              position: 'center',
              icon: 'success',
              title:
                'El usuario ' +
                this.anUser1.nombre +
                ' a sido creado...',
              showConfirmButton: false,
              timer: 1500,
            });

            this.route.navigate(['/usuarios']);


            //this.cargarUsers();
          } else {
            //console.log(resp);

            //Swal.fire(resp["res"]);

            Swal.fire({
              icon: 'error',
              title:
                'Error al crear Usuario ' +
                this.anUser1.nombre,
              text: resp['message'],
              //footer: '<a href="">Why do I have this issue?</a>',
            });


          }

        });
    }
    else {

      this.anUser1.id = this.idUsuario;
      await this.auth
        .crud_usuarios(this.anUser1, 'modificar')
        .toPromise()
        .then((resp: any) => {
          //console.log(this.anUser1);
          //console.log(resp);
          if (resp['ok'] == true) {
            //this.users.splice(i, 1);

            //console.log(resp);


            Swal.fire({
              //position: 'top-end',
              position: 'center',
              icon: 'success',
              title:
                'El usuario ' +
                this.anUser1.nombre +
                ' a sido modificado...',
              showConfirmButton: false,
              timer: 1500,
            });

            this.route.navigate(['/usuarios']);

            //this.cargarUsers();
          } else {
            //console.log(resp);

            //Swal.fire(resp["res"]);

            Swal.fire({
              icon: 'error',
              title:
                'Error al modificar Usuario ' +
                this.anUser1.nombre,
              text: resp['message'],
              //footer: '<a href="">Why do I have this issue?</a>',
            });


          }

        });

    }
  }


  async editUsuario() {
    await this.auth
      .getanUsuario(this.idUsuario)
      .toPromise()
      .then((resp: any) => {
        let datos = resp;

        this.anUser1 = datos['data'];

        //console.log('USUARIO', this.anUser1);

        //this.myForm.setValue({firstName: 'Prueba'});

        this.myForm.patchValue({
          nombre: this.anUser1.nombre,
          correo: this.anUser1.correo,
          password: this.anUser1.password,
          img: this.anUser1.img,
          rol: this.anUser1.rol,
          estado: this.anUser1.estado,
          google: this.anUser1.google,
          brandProviderId: this.anUser1.brandProviderId
        });
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
