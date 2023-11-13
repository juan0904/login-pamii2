import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import {
  URL_SERVICIOS_GEOCERCAS,
  URL_SERVICIOS_PAMII,
} from '../config/url.servicios';
import { ParametrosPamiiModel } from '../models/parametros.model';

@Injectable({
  providedIn: 'root',
})
export class PamiiService {
  userToken: any;

  constructor(public http: HttpClient) {}


  public leerToken() {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }



  getProductos(): //Observable<UserModel[]>
  any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS_PAMII + "/user";

    let url = `${URL_SERVICIOS_PAMII}/productos`;

    //console.log(url);

    return this.http.get(url).pipe(
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

    let url = `${URL_SERVICIOS_PAMII}/productos/reference/${unIdProducto.toString()}`;

    //console.log(url);

    return this.http.get(url).pipe(
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
    let url = `${URL_SERVICIOS_PAMII}/productos/multimedia/${unIdReference.toString()}`;

    //console.log(url);

    return this.http.get(url).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getProductosComo(como: string): //Observable<UserModel[]>
  any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS_PAMII + "/user";

    let url = `${URL_SERVICIOS_PAMII}/productos/como/${como}`;

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getProductsColor(id: number): //Observable<UserModel[]>
  any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS_PAMII + "/user";

    let url = `${URL_SERVICIOS_PAMII}/productos/detProduct1/${id.toString()}`;

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getReferenceColor(
    id: number,
    unColor: string
  ): //Observable<UserModel[]>
  any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS_PAMII + "/user";

    let url = `${URL_SERVICIOS_PAMII}/productos/detReference2/${id.toString()}/${unColor}`;

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getMultimediaColor(
    id: number,
    unColor: string
  ): //Observable<UserModel[]>
  any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    //let url = URL_SERVICIOS_PAMII + "/user";

    let url = `${URL_SERVICIOS_PAMII}/productos/detMultimedia1/${id.toString()}/${unColor}`;

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getBrandProvidersByProvider(anProviderId:number): any {
    var headers_object = new HttpHeaders().set('x-token', this.leerToken());

    //console.log(headers_object);

    let url = `${URL_SERVICIOS_PAMII}/brand_providers/brandProvider/${anProviderId}`;

    //console.log(url);

    //let url = URL_SERVICIOS + '/brand_providers/brandProvider';

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

    let url = `${URL_SERVICIOS_PAMII}/par/parametros`;

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

    let url = `${URL_SERVICIOS_PAMII}/par/parametrosbp/${anBrandProviderId}`;

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

    let url = `${URL_SERVICIOS_PAMII}/par/parametros/${anParametroId}`;

    return this.http.get(url, { headers: headers_object }).pipe(
      map((data) => {
        return data;
      })
    );
  }




  crud_Parametros(unParametro: ParametrosPamiiModel, unIdParametro:any,unaAccion: string): any {
    //console.log(unParametro);

    const ParametroTemp = {
      ...unParametro,
    };

    //console.log('ParametroTEMP:', ParametroTemp);

    var headers_object = new HttpHeaders().set('x-token',this.leerToken());

    const headers = {
      Authorization: 'Bearer my-token',
      'My-Custom-Header': 'foobar',
      'x-token': this.leerToken(),
    };

    //console.log('HEADERS', headers_object);

    if (unaAccion === 'eliminar') {
      // Initialize Params Object
      let Params = new HttpParams();

      let url = `${URL_SERVICIOS_PAMII}/par/parametros/${unIdParametro}`;

      return this.http
        .delete(url, { headers: headers_object, params: Params })
        .pipe(
          map((data) => {
            return data;
          })
        );
    }

    
    const body = {
      idparametro: unParametro.idparametro,
      nombre: unParametro.nombre,
      descripcion: unParametro.descripcion,
      valor_entero: unParametro.valor_entero,
      valor_decimal: unParametro.valor_decimal,
      fecha: unParametro.fecha,
      texto: unParametro.texto,
      brandProviderId: unParametro.brandProviderId
    };
    
    //  const body = unParametro;

      //console.log('BODY', body);

    if (unaAccion === 'insertar') {
      let url = URL_SERVICIOS_PAMII + '/par/parametros';

      return this.http.post(url, body, { headers }).pipe(
        map((data: any) => {
          return data;
        })
      );

    }

    if (unaAccion === 'modificar') {

      let url = `${URL_SERVICIOS_PAMII}/par/parametros/${unIdParametro}`;

      //console.log("URL",url);

      return this.http.put(url, body, { headers }).pipe(
        map((data: any) => {
          //console.log("DATA_PARAMETRO",data)
          return data;
        })
      );
    }

  }



}
