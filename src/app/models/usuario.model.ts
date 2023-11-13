export class UsuarioModel {

    email!: string;
    password!: string;
    nombre!: string;

}

export class UserModel {

    id!: string;
    password!: string;
    is_superuser!: string;
    username!: string;
    first_name!: string;
    last_name!: string;
    email!: string;
    is_staff!: string;
    is_active!: string;
    date_joined!: string;

}

export class AuthGroup {
    public id!: number
    public name!: string
    public auth_group_id?: number
}

export class UsuarioPamiiModel {
    id!: number;
    nombre!: string;
    correo!: string;
    password!: string;
    img!: string;
    rol!: string;
    estado!: boolean;
    google!: string;
    brandProviderId!: number;
}