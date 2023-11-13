import { Component, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  Validators,
  FormGroup,
  FormBuilder,
  NgModel,
} from '@angular/forms';
import { UsuarioPamiiModel } from 'src/app/models/usuario.model';
import { ParametrosPamiiModel } from '../../models/parametros.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { GlobalConstants } from '../shared/angular-material/global-constants';

/*
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';

import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';

import 'moment/locale/ja';
import 'moment/locale/fr';

import { MatDatepickerIntl, MatDatepickerModule } from '@angular/material/datepicker';
*/

import { PamiiService } from 'src/app/services/pamii.service';

@Component({
  selector: 'app-add-edit-parametro',
  templateUrl: './add-edit-parametro.component.html',
  styleUrls: ['./add-edit-parametro.component.css'],

  /*
  providers: [
    // The locale would typically be provided on the root module of your application. We do it at
    // the component level here, due to limitations of our example generation script.
    {provide: MAT_DATE_LOCALE, useValue: 'ja-JP'},
    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
  ],
  //standalone: true,
  //imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule],  
  */
})
export class AddEditParametroComponent implements OnInit {
  [x: string]: any;
  email = new FormControl('', [Validators.required, Validators.email]);

  mensaje: string = 'Parametro Pamii';

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
  anParametro: ParametrosPamiiModel = new ParametrosPamiiModel();

  idUsuario: any;
  idParametro: any;

  accion = 'Crear';

  anProviderId: any;
  anProviderName: any;

  get valorEnteroNoValido() {
    return (
      this.myForm.get('valor_entero')?.invalid &&
      this.myForm.get('valor_entero')?.touched
    );
  }

  constructor(
    private fb: FormBuilder,
    private route: Router,
    private auth: PamiiService,
    private snackBar: MatSnackBar,
    private aRoute: ActivatedRoute
  ) //    private _adapter: DateAdapter<any>,
  //    private _intl: MatDatepickerIntl,
  //    @Inject(MAT_DATE_LOCALE) private _locale: string,

  {
    this.anProviderId = GlobalConstants.bpid;
    this.anProviderName = GlobalConstants.businessName;

    this.mensaje = this.mensaje + ' - ' + this.anProviderName;

    this.myForm = this.fb.group({
      idparametro: [
        null,
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
        ],
      ],
      nombre: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(150),
        ],
      ],
      descripcion: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(500),
        ],
      ],
      valor_entero: [
        null,
        [
          Validators.min(0),
          Validators.max(999999999),
          //Validators.pattern('^-?[0-9]\\d*(\\.\\d{1,2})?$')
          //Validators.pattern(/^\+?(?:[1-9]\d*(?:\.\d{1,2})?|0\.(?:[1-9]\d?|\d[1-9]))$/)
        ],
      ],
      valor_decimal: [null],
      fecha: [null],
      texto: [null],
      brandProviderId: [null],
    });

    /*
  idparametro !: string;
  nombre!: string;
  descripcion!: string;
  valor_entero!: number;
  valor_decimal!: number;
  fecha!: Date;
  optionsCreatedat!: Date;
  optionsUpdatedat!: Date;
  texto!: string;
  brandProviderId!: number;
  */

    this.idParametro = this.aRoute.snapshot.params['id'];

    //console.log(this.idParametro);

    this.cargarBrandProviders();
  }

  ngOnInit(): void {
    //this.updateCloseButtonLabel('カレンダーを閉じる');

    if (this.idParametro !== undefined) {
      this.accion = 'Editar';

      this.editParametro();
    }
  }

  async editParametro() {
    await this.auth
      .getanParametro(this.idParametro)
      .toPromise()
      .then((resp: any) => {
        let datos = resp;

        //console.log('DATOS', datos);

        this.anParametro = datos['datos'];

        //console.log('Parametro', this.anParametro);

        //this.myForm.setValue({firstName: 'Prueba'});

        this.myForm.patchValue({
          idparametro: this.anParametro.idparametro,
          nombre: this.anParametro.nombre,
          descripcion: this.anParametro.descripcion,
          valor_entero: this.anParametro.valor_entero,
          valor_decimal: this.anParametro.valor_decimal,
          fecha: this.anParametro.fecha,
          texto: this.anParametro.texto,
          brandProviderId: this.anParametro.brandProviderId,
        });
      });
  }

  async cargarBrandProviders() {
    //this.cargando = true;
    await this.auth
      .getBrandProvidersByProvider(this.anProviderId)
      .toPromise()
      .then((resp: any) => {
        this.brandProviders = resp['data'];
        //console.log('BRAND_PROVIDERS', this.brandProviders);

        //this.cargando = false;
      });
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

  async guardarParametro() {
    this.anParametro = {
      idparametro: this.myForm.get('idparametro')?.value,
      nombre: this.myForm.get('nombre')?.value,
      descripcion: this.myForm.get('descripcion')?.value,
      valor_entero: this.myForm.get('valor_entero')?.value,
      valor_decimal: this.myForm.get('valor_decimal')?.value,
      fecha: this.myForm.get('fecha')?.value,
      texto: this.myForm.get('texto')?.value,
      brandProviderId: this.myForm.get('brandProviderId')?.value,
      optionsCreatedat: this.myForm.get('optionsCreatedat')?.value,
      optionsUpdatedat: this.myForm.get('optionsUpdatedat')?.value,
    };

    if (this.accion === 'Crear') {
      this.idParametro = this.anParametro.idparametro;
      await this.auth
        .crud_Parametros(this.anParametro, this.idParametro, 'insertar')
        .toPromise()
        .then(
          (resp: any) => {
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
                  'El parametro ' +
                  this.anParametro.nombre +
                  ' a sido creado...',
                showConfirmButton: false,
                timer: 1500,
              });

              this.route.navigate(['/parametros']);

              //this.cargarUsers();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error al crear Parametro ' + this.anParametro.nombre,
                text: resp['msg'],
                //footer: '<a href="">Why do I have this issue?</a>',
              });
            }
          },
          (err: any) => {
            //console.log(err);

            let mensaje = err.error.msg;

            Swal.fire({
              icon: 'error',
              title: 'Error al Insertar el Parametro.',
              text: mensaje,
            });
          }
        );
    } else {
      await this.auth
        .crud_Parametros(this.anParametro, this.idParametro, 'modificar')
        .toPromise()
        .then(
          (resp: any) => {
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
                  'El parametro ' +
                  this.anParametro.nombre +
                  ' a sido modificado...',
                showConfirmButton: false,
                timer: 1500,
              });

              this.route.navigate(['/parametros']);

              //this.cargarUsers();
            } else {
              //console.log(resp);

              //Swal.fire(resp["res"]);

              Swal.fire({
                icon: 'error',
                title:
                  'Error al modificar Parametro ' + this.anParametro.nombre,
                text: resp['message'],
                //footer: '<a href="">Why do I have this issue?</a>',
              });
            }
          },
          (err: any) => {
            //console.log(err);

            let mensaje = err.error.msg;

            Swal.fire({
              icon: 'error',
              title: 'Error al Modificar el Parametro.',
              text: mensaje,
            });
          }
        );
    }
  }

  validaNumeroEntero() {
    let unValor = this.myForm.get('valor_entero')?.value;

    //console.log(unValor);

    if (unValor !== undefined) {
      if (typeof unValor !== 'number') {
        this.myForm.get('valor_entero')?.setValue(null);
      }
    } else {
      this.myForm.get('valor_entero')?.setValue(null);
    }
  }

  validaNumeroDecimal() {
    let unValor = this.myForm.get('valor_decimal')?.value;
    //console.log(unValor);
    
    if (unValor !== undefined) {
      if (typeof unValor !== 'number') {
        this.myForm.get('valor_decimal')?.setValue(null);
      }
    } else {
      this.myForm.get('valor_decimal')?.setValue(null);
    }
    
  }

}

/*
  french() {
    this._locale = 'fr';
    this._adapter.setLocale(this._locale);
    this.updateCloseButtonLabel('Fermer le calendrier');
  }



  updateCloseButtonLabel(label: string) {
    this._intl.closeCalendarLabel = label;
    this._intl.changes.next();
  }

  getDateFormatString(): string {
    if (this._locale === 'ja-JP') {
      return 'YYYY/MM/DD';
    } else if (this._locale === 'fr') {
      return 'DD/MM/YYYY';
    }
    return '';
  }
*/
