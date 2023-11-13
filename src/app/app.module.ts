import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularMaterialModule } from './components/shared/angular-material/angular-material.module';
import { UserComponent } from './components/user/user.component';
import { LoadPlantillaComponent } from './components/load-plantilla/load-plantilla.component';
import { ListUsuariosComponent } from './components/list-usuarios/list-usuarios.component';
import { AddEditUsuariosComponent } from './components/add-edit-usuarios/add-edit-usuarios.component';
import { ListProductosComponent } from './components/list-productos/list-productos.component';
import { ListReferenciasComponent } from './components/list-referencias/list-referencias.component';
import { ListMultimediaComponent } from './components/list-multimedia/list-multimedia.component';
import { ListBrandProvidersComponent, DialogContentExampleDialog } from './components/list-brand-providers/list-brand-providers.component';
import { AjustaFechaExcelPipe } from './pipes/ajusta-fecha-excel.pipe';
import { AjustaAristasComponent } from './components/ajusta-aristas/ajusta-aristas.component';
import { ViewPlantillaComponent } from './components/view-plantilla/view-plantilla.component';
import { AddEditProductComponent } from './components/add-edit-product/add-edit-product.component';
import { ListParametrosComponent } from './components/list-parametros/list-parametros.component';
import { AddEditParametroComponent } from './components/add-edit-parametro/add-edit-parametro.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';


@NgModule({
   entryComponents:[
    AddEditProductComponent
   ],

  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    NavbarComponent,
    UserComponent,

    LoadPlantillaComponent,
    ListUsuariosComponent,
    AddEditUsuariosComponent,
    ListProductosComponent,
    ListReferenciasComponent,
    ListMultimediaComponent,
    ListBrandProvidersComponent,

    DialogContentExampleDialog,
     AjustaFechaExcelPipe,
     AjustaAristasComponent,
     ViewPlantillaComponent,
     AddEditProductComponent,
     ListParametrosComponent,
     AddEditParametroComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,

    AngularMaterialModule,
    ReactiveFormsModule,
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
