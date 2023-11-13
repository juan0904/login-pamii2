import { UsuarioModel, UsuarioPamiiModel } from "src/app/models/usuario.model";

export class GlobalConstants {
    public static apiURL: string = 'https://itsolutionstuff.com/';
    public static siteTitle: string = 'This is example of ItSolutionStuff.com';
    public static perfil: string = 'Sin Perfil';
    public static cantidad: number = 0;
  
    public static usuario: UsuarioModel = new UsuarioModel();

    public static usuarioPamii: UsuarioPamiiModel = new UsuarioPamiiModel();
  
  
    public static uid: string = '-1';
    public static bpid: string = '-1';
  
    public static MembershipMessage: string = '';

  
    //public static unBD:string = _unaBD;

    public static role: string = 'sin Role';

    public static options:any = [];


    public static businessName: string = '-1';
 

    public setOptions(anOptions:any){
        GlobalConstants.options = anOptions;
    }

    public getOptions() {
        return GlobalConstants.options;
    }

    public setRole({ anRole }: { anRole: string; }){
        GlobalConstants.role = anRole;
    }

    public getRole() {
        return GlobalConstants.role;
    }



    public ajustaCantidad() {
      GlobalConstants.cantidad++;
    }
  
    public setPerfil(unPerfil:string){
       GlobalConstants.perfil = unPerfil;
    }   
  
    public getPerfil(){
      return GlobalConstants.perfil;
    }
  
  
  }
  