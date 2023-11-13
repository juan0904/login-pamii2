import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router, TitleStrategy } from '@angular/router';
import { UserModel } from 'src/app/models/usuario.model';
//import { DotusService } from 'src/app/services/dotus.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: UserModel = new UserModel();
  idUser: any;

  constructor(
//    private dotus: DotusService,
    //private route: ActivatedRoute,
    private router: Router,
    private parametros: ActivatedRoute,    
    ) { 

      this.parametros.params.subscribe(params => {
        const idParam = 'id';
        this.idUser = params[idParam];
        
        if ( this.idUser !== undefined ) {

          //this.cargarDatosDetCasting();

          this.getUser();
        }
      });

   

    }

  ngOnInit(): void {
    //this.idUser = this.route.snapshot.paramMap.get('id');

    ////console.log(this.idUser);

  


    //if ( this.idUser !== undefined ) {

      /*
      this.dotus.getanUser( this.idUser )
      .toPromise()
      .then((resp: any) => {
        let temp = resp; 

        this.user = temp;
        //console.log(temp);


        /*
        this.myForm.patchValue({
          firstName: this.anUser1.first_name,
          lastName: this.anUser1.last_name,
          email: this.anUser1.email,
          isStaff: this.anUser1.is_staff,
          isActive: this.anUser1.is_active,
          dateJoined: this.anUser1.date_joined,
          password: this.anUser1.password,
          isSuperuser: this.anUser1.is_superuser,
          username: this.anUser1.username,
        });
        
      });

      */
    //}

    
   

  }

  guardar( form: NgForm ) {
/*
    if ( form.invalid ) {
      //console.log('Formulario no válido');
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      type: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

  

    let peticion: Observable<any>;
   
    if ( this.user.id ) {
      peticion = this.dotusService.crud_users( this.user,'modificar');
    } else {
      peticion = this.dotusService.crud_users( this.user,'insertar');
    }   


    peticion.subscribe( resp => {

      Swal.close();

      if (resp["ok"] == true){
        //console.log(resp);
        Swal.fire({
          title: this.user.username,
          text: 'Se actualizó correctamente',
          type: 'success'
        });
  

        //this.router.navigateByUrl('/users');

      }
      else{
        //console.log(resp);

        Swal.fire({
          type: 'error',
          title: 'Error al actualizar',
          text: resp["message"]
        });

      }



    });



  }

*/

  }

  async editUser() {
    /*
    await this.dotus
      .getanUser(this.idUser)
      .toPromise()
      .then((resp: any) => {
        this.user = resp;
        //console.log(this.user);


      });
      */
  }


  getUser() {
/*
    this.dotus.getanUser(this.idUser)
      .subscribe((res: any) => {

        let datos = res;

        this.user = datos[0];

        ////console.log(this.unaDivision);

      });
      */
  }


}
