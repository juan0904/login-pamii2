export class ProductosModel {
    id!: string;
    product!: string;
    characteristics!: string;
    linkVideo!: string;
    conditions!: string;
    featured!: string;
    brandProviderId!: string;
    subcategoryId!: string;
    optionsStatus!: string;
    optionsCreatedat!: string;
    optionsUpdatedat!: string;
    weight!: string;
    volume!: string;
    sku!: string;
    long!: string;
    high!: string;
    wide!: string;
    warrantyId!: string;
    applyDevolution!: string;
}

export class ReferenciasModel {
    id!: string;
    sku!: string;
    reference!: string;
    price!: string;
    qty!: string;
    color!: string;
    brandProviderProductId!: string;
    optionsStatus!: string;
    optionsCreatedat!: string;
    optionsUpdatedat!: string;
    iva!: string;
    qualification!: string;
    size!: string;
    brand_provider_media_group_id!: string;
}

export class MultimediaModel {
    id!: string;
    url!: string;
    type!: string;
    brandProviderProductReferenceId!: string;
    optionsStatus!: string;
    optionsCreatedat!: string;
    optionsUpdatedat!: string;
}


export class ProductosLogModel {
    id!: string;
    ​brandProviderProductId!: string;
    product!: string;
    characteristics!: string;
    linkVideo!: string;
    conditions!: string;
    featured!: string;
    ​brandProviderId!: string;
    subcategoryId!: string;
    optionsStatus!: string;
    optionsCreatedat!: string;
    optionsUpdatedat!: string;
    weight!: string;
    volume!: string;
    sku!: string;
    long!: string;
    high!: string;
    wide!: string;
    warrantyId!: string;
    applyDevolution!: string;
    service!: string;
}
