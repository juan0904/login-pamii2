import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';



import { LoadPlantillaComponent } from './components/load-plantilla/load-plantilla.component';
import { ListUsuariosComponent } from './components/list-usuarios/list-usuarios.component';
import { AddEditUsuariosComponent } from './components/add-edit-usuarios/add-edit-usuarios.component';
import { ListProductosComponent } from './components/list-productos/list-productos.component';
import { ListReferenciasComponent } from './components/list-referencias/list-referencias.component';
import { ListMultimediaComponent } from './components/list-multimedia/list-multimedia.component';
import { ListBrandProvidersComponent } from './components/list-brand-providers/list-brand-providers.component';
import { AjustaAristasComponent } from './components/ajusta-aristas/ajusta-aristas.component';
import { ViewPlantillaComponent } from './components/view-plantilla/view-plantilla.component';
import { ListParametrosComponent } from './components/list-parametros/list-parametros.component';
import { AddEditParametroComponent } from './components/add-edit-parametro/add-edit-parametro.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },

  {
    path: 'home', component: HomeComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'loadplantilla', component: LoadPlantillaComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'usuarios', component: ListUsuariosComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'usuario', component: AddEditUsuariosComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'usuario/:id', component: AddEditUsuariosComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'productos', component: ListProductosComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'referencias/:id', component: ListReferenciasComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'multimedia/:id/:id2', component: ListMultimediaComponent,
    canActivate: [AuthGuard]
  },
  
  {
    path: 'brandproviders', component: ListBrandProvidersComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'ajustaaristas', component: AjustaAristasComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'viewplantilla', component: ViewPlantillaComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'parametros', component: ListParametrosComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'parametro', component: AddEditParametroComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'parametro/:id', component: AddEditParametroComponent,
    canActivate: [AuthGuard]
  },


  /*
  //USERS
  { path: 'users', component:ListUsersComponent, 
  canActivate: [ AuthGuard ]  },
  { path: 'user', component:AddEditUserComponent, 
  canActivate: [ AuthGuard ]  },
  { path: 'user/:id', component:AddEditUserComponent, 
  canActivate: [ AuthGuard ]  },
  //User Alterno
  { path: 'user1/:id', component:UserComponent, 
  canActivate: [ AuthGuard ]  },

  //CUSTOMERS
  { path: 'customers', component:ListCustomersComponent, 
  canActivate: [ AuthGuard ]  },
  { path: 'customer', component:AddEditCustomerComponent, 
  canActivate: [ AuthGuard ]  },
  { path: 'customer/:id', component:AddEditCustomerComponent, 
  canActivate: [ AuthGuard ]  },  

  //CATEGORIES
  { path: 'categories', component:ListCategoriesComponent, 
  canActivate: [ AuthGuard ]  },
  { path: 'category', component:AddEditCategoryComponent, 
  canActivate: [ AuthGuard ]  },
  { path: 'category/:id', component:AddEditCategoryComponent, 
  canActivate: [ AuthGuard ]  },  

   //CONVEYORS/CARRIER
   { path: 'conveyors', component:ListConveyorsComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'conveyor', component:AddEditConveyorComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'conveyor/:id', component:AddEditConveyorComponent, 
   canActivate: [ AuthGuard ]  },  
  
   //VEHICLES
   { path: 'vehicles', component:ListVehiclesComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'vehicle', component:AddEditVehicleComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'vehicle/:id', component:AddEditVehicleComponent, 
   canActivate: [ AuthGuard ]  },  

   //MARKETSEGMENTS
   { path: 'market-segments', component:ListMarketSegmentsComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'marketsegment', component:AddEditMarketSegmentComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'marketsegment/:id', component:AddEditMarketSegmentComponent, 
   canActivate: [ AuthGuard ]  },  

   //VEHICLEFLEETS
   { path: 'vehicle-fleets', component:ListVehicleFleetsComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'vehiclefleet', component:AddEditVehicleFleetComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'vehiclefleet/:id', component:AddEditVehicleFleetComponent, 
   canActivate: [ AuthGuard ]  },  

  //BRANDS
  { path: 'brands', component:ListBrandsComponent, 
  canActivate: [ AuthGuard ]  },
  { path: 'brand', component:AddEditBrandComponent, 
  canActivate: [ AuthGuard ]  },
  { path: 'brand/:id', component:AddEditBrandComponent, 
  canActivate: [ AuthGuard ]  },  

  //PRESENTATIONS
  { path: 'presentations', component:ListPresentationsComponent, 
  canActivate: [ AuthGuard ]  },
  { path: 'presentation', component:AddEditPresentationComponent, 
  canActivate: [ AuthGuard ]  },
  { path: 'presentation/:id', component:AddEditPresentationComponent, 
  
  canActivate: [ AuthGuard ]  }, 
   //PRODUCERS
   { path: 'producers', component:ListProducersComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'producer', component:AddEditProducerComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'producer/:id', component:AddEditProducerComponent, 
   canActivate: [ AuthGuard ]  },  

   //GROUPS
   { path: 'groups', component:ListGroupsComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'group', component:AddEditGroupComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'group/:id', component:AddEditGroupComponent, 
   canActivate: [ AuthGuard ]  },  
   
   //PRODUCTS
   { path: 'products', component:ListProductsComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'product', component:AddEditProductComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'product/:id', component:AddEditProductComponent, 
   canActivate: [ AuthGuard ]  },  

   //CLIENTS
   { path: 'clients', component:ListClientsComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'client', component:AddEditClientComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'client/:id', component:AddEditClientComponent, 
   canActivate: [ AuthGuard ]  },  

   //INHOUSECONVEYOR
   { path: 'in-house-conveyors', component:ListInHouseConveyorsComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'inhouseconveyor', component:AddEditInHouseConveyorComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'inhouseconveyor/:id', component:AddEditInHouseConveyorComponent, 
   canActivate: [ AuthGuard ]  },  

   
   //IDENTIFICATIONTYPES
   { path: 'identificationtypes', component:ListIdentificationTypesComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'identificationtype', component:AddEditIdentificationTypesComponent, 
   canActivate: [ AuthGuard ]  },
   { path: 'identificationtype/:id', component:AddEditIdentificationTypesComponent, 
   canActivate: [ AuthGuard ]  }, 
*/

  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
