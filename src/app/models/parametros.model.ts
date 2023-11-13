export class ParametrosPamiiModel {
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
}
/*
 idparametro varchar(50) not null,
 nombre varchar(150) not null,
 descripcion varchar(500) not null,
 valor_entero int null,
 valor_decimal numeric(15,3) null,
 fecha datetime null,
 texto varchar(250) null,
 optionsCreatedat datetime(6) NOT NULL DEFAULT current_timestamp(6),
 optionsUpdatedat datetime(6) NULL DEFAULT current_timestamp(6),
 brandProviderId int(10) null
 */