import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  URL_SERVICIOS,
  URL_SERVICIOS_GEOCERCAS,
} from '../config/url.servicios';
import { BrandProviderJobOfferRequirementTable, BrandProviderJobOfferTable, BrandProviderZoneTable } from '../models/excel.interface';
import {
  UserModel,
  UsuarioModel,
  UsuarioPamiiModel,
} from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';
  private apikey = 'AIzaSyCr--fzsw8mVaADP3mPVyy72vsQKvJ6cYY';

  userToken: any;
  userEmail: any;
  pipe: any;
  auth: any;

  constructor(private http: HttpClient) {
    this.leerToken();
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('connemail');
    localStorage.removeItem('expira');
  }

  login(usuario: UsuarioModel) {
    let url = URL_SERVICIOS + '/auth/login';

    //console.log(url);

    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('correo', usuario.email);
    Params = Params.append('password', usuario.password);

    //console.log(Params);

    const headers = {
      Authorization: 'Bearer my-token',
      'My-Custom-Header': 'foobar',
    };

    const body = {
      correo: usuario.email,
      password: usuario.password,
    };

    /*
    this.http.post<any>(url, body, { headers }).subscribe(data => {
       return data;
    });
    */

    return this.http.post(url, body).pipe(
      map((data: any) => {
        let datos = data;
        if (data['ok'] == true) {
          this.guardarToken(data['token']);
          this.guardarEmail(usuario.email);
        }
        return datos;
      })
    );

    /*
        const authData = {
          ...usuario,
          returnSecureToken: true
        };
    
        return this.http.post(
          `${ this.url }/verifyPassword?key=${ this.apikey }`,
          authData
        ).pipe(
          map( resp => {
            this.guardarToken( resp['idToken'] );
            return resp;
          })
        );
    */
  }

  nuevoUsuario(usuario: UserModel) {
    let url = URL_SERVICIOS + '/user/create';

    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters

    Params = Params.append('password', usuario.password.toString());
    Params = Params.append('is_superuser', usuario.is_superuser.toString());
    Params = Params.append('username', usuario.username.toString());
    Params = Params.append('first_name', usuario.first_name.toString());
    Params = Params.append('last_name', usuario.last_name.toString());
    Params = Params.append('email', usuario.email.toString());
    Params = Params.append('is_staff', usuario.is_staff.toString());
    Params = Params.append('is_active', usuario.is_active.toString());
    Params = Params.append('date_joined', usuario.date_joined.toString());

    return this.http.post(url, Params).pipe(
      map((data: any) => {
        if (data['ok'] == true) {
          this.guardarToken(data['token']);
          this.guardarEmail(usuario.email);
        }
        return data;
      })
    );

    /*
        const authData = {
          ...usuario,
          returnSecureToken: true
        };
    
        return this.http.post(
          `${ this.url }/signupNewUser?key=${ this.apikey }`,
          authData
        ).pipe(
          map( resp => {
            this.guardarToken( resp['idToken'] );
            return resp;
          })
        );
    */
  }

  public guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem('expira', hoy.getTime().toString());
  }

  public guardarEmail(idEmail: string) {
    this.userEmail = idEmail;
    localStorage.setItem('connemail', idEmail);
  }

  public leerEmail() {
    if (localStorage.getItem('connemail')) {
      this.userEmail = localStorage.getItem('connemail');
    } else {
      this.userEmail = '';
    }

    return this.userEmail;
  }

  public leerToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  estaAutenticado(): boolean {
    if (this.userToken.length < 2) {
      return false;
    }

    const expira = Number(localStorage.getItem('expira'));
    const expiraDate = new Date();
    expiraDate.setTime(expira);

    if (expiraDate > new Date()) {
      return true;
    } else {
      return false;
    }
  }

  actualizarUser(unUser: UserModel) {
    const userTemp = {
      ...unUser,
    };

    let parametros = new HttpParams();

    //let url = URL_SERVICIOS + "/actualizar_encabezados";
    let url = `${URL_SERVICIOS}/user/update/${unUser.id}`;

    //delete userTemp.id;

    let unToken = this.leerToken();
    //console.log(unToken);

    var headers_object1 = new HttpHeaders().set('x-token', unToken);
    //console.log(headers_object1);

    //console.log(url);

    // Begin assigning parameters
    parametros = parametros.append('password', unUser.password);
    parametros = parametros.append('is_superuser', unUser.is_superuser);
    parametros = parametros.append('username', unUser.username);
    parametros = parametros.append('first_name', unUser.first_name);
    parametros = parametros.append('last_name', unUser.last_name);
    parametros = parametros.append('email', unUser.email);
    parametros = parametros.append('is_staff', unUser.is_staff);
    parametros = parametros.append('is_active', unUser.is_active);
    parametros = parametros.append('date_joined', unUser.date_joined);

    //console.log(parametros);
    return this.http
      .post(url, { headers: headers_object1, params: parametros })
      .pipe(
        map((data) => {
          return data;
        })
      );

    //return this.http.post(url, {: headers_object1,HttpParams:parametros})
    //  .pipe(map(data => data));

    //return this.http.put(`${ this.url }/heroes/${ heroe.id }.json`, heroeTemp);
  }

  getAuthGroupConn(id: any): Observable<any> {
    return this.http.get(`${URL_SERVICIOS}/authgroup/connect/${id}/`, {}).pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  getByIdAuthOptions(id: any): Observable<any> {
    return this.http
      .get(`${URL_SERVICIOS}/authgroup/auth_options/${id}`, {})
      .pipe(
        map((res: any) => {
          return res;
        })
      );
  }

  procesaPlantilla(anBrandProviderId: string) {
    let parametros = new HttpParams();

    //let url = URL_SERVICIOS + "/actualizar_encabezados";
    let url = `${URL_SERVICIOS}/plantilla/quest`;

    //delete userTemp.id;

    let unToken = this.leerToken();
    //console.log(unToken);

    var headers_object1 = new HttpHeaders().set('x-token', unToken);
    //console.log(headers_object1);

    const headers = {
      Authorization: 'Bearer my-token',
      'My-Custom-Header': 'foobar',
      'x-token': unToken,
    };

    //console.log(url);

    const body = {
      bpid: anBrandProviderId,
    };

    return this.http.post(url, body, { headers }).pipe(
      map((data) => {
        return data;
      })
    );

    //return this.http.post(url, {: headers_object1,HttpParams:parametros})
    //  .pipe(map(data => data));

    //return this.http.put(`${ this.url }/heroes/${ heroe.id }.json`, heroeTemp);
  }

  /**  USUARIOS*/
  getUsuarios(): any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    let url = URL_SERVICIOS + '/usuarios';

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getanUsuario(anUser: string): any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    let url = `${URL_SERVICIOS}/usuarios/${anUser}`;

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  inserta_brandProviderJobOffer(unJobOffer: BrandProviderJobOfferTable) {
    //console.log(unJobOffer);

    const jobTemp = {
      ...unJobOffer,
    };

    //console.log('JOBTEMP:', jobTemp);

    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log('HEADERS', headers_object);

    let url = URL_SERVICIOS + '/brand_providers/joboffer';

    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('job', unJobOffer.job);
    Params = Params.append('vacancies', unJobOffer.vacancies);
    Params = Params.append('description', unJobOffer.description);
    Params = Params.append('activationDate', unJobOffer.activationDate);
    Params = Params.append('finishDatthis.e', unJobOffer.finishDate);
    Params = Params.append('zoneId', unJobOffer.zoneId);
    Params = Params.append('branProviderId', unJobOffer.brandProviderId);
    Params = Params.append('optionsStatus', unJobOffer.optionsStatus);

    const headers = {
      Authorization: 'Bearer my-token',
      'My-Custom-Header': 'foobar',
      'x-token': this.leerToken(),
    };

    const body = {
      job: unJobOffer.job,
      vacancies: unJobOffer.vacancies,
      description: unJobOffer.description,
      activationDate: unJobOffer.activationDate,
      finishDate: unJobOffer.finishDate,
      zoneId: unJobOffer.zoneId,
      brandProviderId: unJobOffer.brandProviderId,
      optionsStatus: unJobOffer.optionsStatus,
    };

    return this.http.post(url, body, { headers }).pipe(
      map((data: any) => {
        /*
        if (data['ok'] == true) {
          this.auth.guardarToken(data['token']);
        }
        */
        return data;
      })
    );
  }

  inserta_brandProviderJobOfferRequirement(unJobOfferRequirement: BrandProviderJobOfferRequirementTable) {
    //console.log(unJobOfferRequirement);

    const jobRequirementTemp = {
      ...unJobOfferRequirement,
    };

    //console.log('JOBTEMP:', jobRequirementTemp);

    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log('HEADERS', headers_object);

    let url = URL_SERVICIOS + '/brand_providers/jobofferrequirement';

    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('requirement', unJobOfferRequirement.requirement);
    Params = Params.append('brandProviderJobOfferId)', unJobOfferRequirement.brandProviderJobOfferId);
    Params = Params.append('optionsStatus', unJobOfferRequirement.optionsStatus);

    const headers = {
      Authorization: 'Bearer my-token',
      'My-Custom-Header': 'foobar',
      'x-token': this.leerToken(),
    };

    const body = {
      requirement: unJobOfferRequirement.requirement,
      brandProviderJobOfferId: unJobOfferRequirement.brandProviderJobOfferId,
      optionsStatus: unJobOfferRequirement.optionsStatus,
    };

    return this.http.post(url, body, { headers }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }


  inserta_brandProviderZone(unBrandProviderZone: BrandProviderZoneTable) {
    //console.log(unBrandProviderZone);

    const unBrandProviderZoneTemp = {
      ...unBrandProviderZone,
    };

    //console.log('BPZone:', unBrandProviderZoneTemp);

    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log('HEADERS', headers_object);

    let url = URL_SERVICIOS + '/brand_providers/brandproviderZone';

    // Initialize Params Object
    let Params = new HttpParams();

    // Begin assigning parameters
    Params = Params.append('brandProviderId', unBrandProviderZone.brandProviderId);
    Params = Params.append('zoneId)', unBrandProviderZone.zoneId);
    Params = Params.append('optionsStatus', unBrandProviderZone.optionsStatus);

    const headers = {
      Authorization: 'Bearer my-token',
      'My-Custom-Header': 'foobar',
      'x-token': this.leerToken(),
    };

    const body = {
      brandProviderId: unBrandProviderZone.brandProviderId,
      zoneId: unBrandProviderZone.zoneId,
      optionsStatus: unBrandProviderZone.optionsStatus,
    };

    return this.http.post(url, body, { headers }).pipe(
      map((data: any) => {
        return data;
      })
    );
  }




  crud_usuarios(unUser: UsuarioPamiiModel, unaAccion: string): any {
    //console.log(unUser);

    const userTemp = {
      ...unUser,
    };

    //console.log('USERTEMP:', userTemp);

    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log('HEADERS', headers_object);

    if (unaAccion === 'eliminar') {
      let url = `${URL_SERVICIOS}/usuarios/${unUser.id.toString()}`;

      return this.http.delete(url, { headers: headers_object }).pipe(
        map((data) => {
          return data;
        })
      );
    }

    if (unaAccion === 'insertar') {
      let url = URL_SERVICIOS + '/usuarios';

      // Initialize Params Object
      let Params = new HttpParams();

      // Begin assigning parameters
      Params = Params.append('nombre', unUser.nombre);
      Params = Params.append('correo', unUser.correo);
      Params = Params.append('password', unUser.password);
      Params = Params.append('img', unUser.img);
      Params = Params.append('rol', unUser.rol);
      Params = Params.append('estado', unUser.estado);
      Params = Params.append('google', unUser.google);
      Params = Params.append('brandProviderId', unUser.brandProviderId);

      const headers = {
        Authorization: 'Bearer my-token',
        'My-Custom-Header': 'foobar',
        'x-token': this.leerToken(),
      };

      const body = {
        nombre: unUser.nombre,
        correo: unUser.correo,
        password: unUser.password,
        img: unUser.img,
        rol: unUser.rol,
        estado: unUser.estado,
        google: unUser.google,
        brandProviderId: unUser.brandProviderId,
      };

      return this.http.post(url, body, { headers }).pipe(
        map((data: any) => {
          /*
          if (data['ok'] == true) {
            this.auth.guardarToken(data['token']);
          }
          */
          return data;
        })
      );
    }

    if (unaAccion === 'modificar') {
      let parametros = new HttpParams();

      //let url = URL_SERVICIOS + "/actualizar_encabezados";
      let url = `${URL_SERVICIOS}/usuarios/${unUser.id}`;

      //console.log(url);

      // Begin assigning parameters
      parametros = parametros.append('nombre', unUser.nombre);
      parametros = parametros.append('correo', unUser.correo);
      parametros = parametros.append('password', unUser.password);
      parametros = parametros.append('img', unUser.img);
      parametros = parametros.append('rol', unUser.rol);
      parametros = parametros.append('estado', unUser.estado);
      parametros = parametros.append('google', unUser.google);
      parametros = parametros.append('brandProviderId', unUser.brandProviderId);

      const headers = {
        Authorization: 'Bearer my-token',
        'My-Custom-Header': 'foobar',
        'x-token': this.leerToken(),
      };

      const body = {
        nombre: unUser.nombre,
        correo: unUser.correo,
        //'password':unUser.password,
        img: unUser.img,
        rol: unUser.rol,
        estado: unUser.estado,
        google: unUser.google,
        brandProviderId: unUser.brandProviderId,
      };

      return this.http.put(url, body, { headers }).pipe(
        map((data: any) => {
          return data;
        })
      );
    }
  }

  getlogPlantilla(anBrandProviderId: number): any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    const body = {
      anbrandProviderId: anBrandProviderId,
    };

    //console.log(headers_object);

    //let url = URL_SERVICIOS + '/plantilla/logplantilla';

    let url = `${URL_SERVICIOS}/plantilla/logplantilla/${anBrandProviderId.toString()}`;

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getlogProducts(anBrandProviderId: number): any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    const body = {
      anbrandProviderId: anBrandProviderId,
    };

    //console.log(headers_object);

    let url = `${URL_SERVICIOS}/bp/logproducts/${anBrandProviderId.toString()}`;

    //console.log(url);

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        //console.log(data);
        return data;
      })
    );
  }


  /**  USUARIOS*/
  getProviders(): any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    let url = URL_SERVICIOS + '/brand_providers/providers';

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  
  getProvidersByProvider(anProviderId:number): any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS + '/brand_providers/providers';
    let url = `${URL_SERVICIOS}/brand_providers/providers/${anProviderId}`;

    ////console.log(url);

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        ////console.log(data);
        return data;
      })
    );
  }


  
  getBrandProviders(): any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    let url = URL_SERVICIOS + '/brand_providers/brandProvider';

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }


  getBrandProvidersByProvider(anProviderId:number): any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    let url = `${URL_SERVICIOS}/brand_providers/brandProvider/${anProviderId}`;

    //console.log(url);

    //let url = URL_SERVICIOS + '/brand_providers/brandProvider';

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }
 

  getOption(anOptionId:string): any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    let url = `${URL_SERVICIOS}/brand_providers/option/${anOptionId}`;

    //console.log(url);

    //let url = URL_SERVICIOS + '/brand_providers/brandProvider';

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }


  getZones(): any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    let url = URL_SERVICIOS + '/brand_providers/zones';

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getProductos(anBrandProviderId: number): //Observable<UserModel[]>
  any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS_PAMII + "/user";

    let url = `${URL_SERVICIOS}/bp/products/${anBrandProviderId}`;

    //console.log(url);

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }




  getProductoSku(anSkuProduct: string): //Observable<UserModel[]>
  any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS_PAMII + "/user";

    let url = `${URL_SERVICIOS}/bp/productsku/${anSkuProduct}`;

    //console.log(url);

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }



  getReferencias(unIdProducto: number): //Observable<UserModel[]>
  any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS_PAMII + "/user";

    let url = `${URL_SERVICIOS}/bp/references/${unIdProducto}`;

    //console.log(url);

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getMultimedia(unIdReference: number): //Observable<UserModel[]>
  any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS_PAMII + "/user";

    let url = `${URL_SERVICIOS}/bp/multimedias/${unIdReference}`;

    //console.log(url);

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getGeocercas(): //Observable<UserModel[]>
  any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS_PAMII + "/user";

    let url = `${URL_SERVICIOS_GEOCERCAS}/cursos.json`;

    //console.log(url);

    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getGeocercasFile(): //Observable<UserModel[]>
  any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS_PAMII + "/user";

    let url = `../../data/Municipios.json`;

    //console.log(url);

    return this.http.get(url).subscribe((data) => {
      //console.log(data);
      return data;
    });
  }

  getZonas(): //Observable<UserModel[]>
  any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS_PAMII + "/user";

    let url = `${URL_SERVICIOS_GEOCERCAS}/suscritos/zonas.json`;

    //console.log(url);

    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getZonasFile(): //Observable<UserModel[]>
  any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS_PAMII + "/user";

    let url = `../../data/exportZonas.json`;

    //console.log(url);

    return this.http.get(url).subscribe((data) => {
      //console.log(data);
      return data;
    });
  }

  procesaAristas(anBrandProviderId: number) {

    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS_PAMII + "/user";

    //let url = URL_SERVICIOS + "/actualizar_encabezados";
    let url = `${URL_SERVICIOS}/bp/ajustaproducts/${anBrandProviderId.toString()}`;

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );


  }


  getPlantilla(unBrandProviderId: number): //Observable<UserModel[]>
  any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS_PAMII + "/user";

    let url = `${URL_SERVICIOS}/plantilla/brands/${unBrandProviderId.toString()}`;

    //console.log(url);

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getParametros(): //Observable<UserModel[]>
  any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS_PAMII + "/user";

    let url = `${URL_SERVICIOS}/par/parametros`;

    //console.log(url);

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }


  getParametrosBP(anBrandProviderId: number): //Observable<UserModel[]>
  any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS_PAMII + "/user";

    let url = `${URL_SERVICIOS}/par/parametrosbp/${anBrandProviderId}`;

    //console.log(url);

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getanParametro(anParametroId: string): any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    let url = `${URL_SERVICIOS}/par/parametros/${anParametroId}`;

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }



  appendLeadingZeroes(n: number) {
    if (n <= 9) {
      return '0' + n;
    }
    return n;
  }

  getStrDate(unDate: Date) {
    let unStrDate =
      unDate.getFullYear() +
      '-' +
      this.appendLeadingZeroes(unDate.getMonth() + 1) +
      '-' +
      this.appendLeadingZeroes(unDate.getDate());

    return unStrDate;
  }

  numeroAFecha(numeroDeDias:number, esExcel = false) {
    var diasDesde1900 = esExcel ? 25567 + 1 : 25567;
  
    // 86400 es el número de segundos en un día, luego multiplicamos por 1000 para obtener milisegundos.
    return new Date((numeroDeDias - diasDesde1900) * 86400 * 1000);
  }



}
