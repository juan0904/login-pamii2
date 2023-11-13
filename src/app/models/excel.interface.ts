import { IPowerstats } from './api.interface';

export interface IDataHeroExcel {
  herosTable: IHeroTable[];
  herosDetail: IHeroDetail[];
}

export interface IDataSqlExcel {
  sqlTable: ISQLTableDatos[];
}


export interface IDataZonesExcel {
  zonesTable: ZoneTable[];
  brandprovidersTable: BrandProviderTable[];
}


export interface IHeroTable {
  urlImage: string;
  fullName: string;
  eyeColor: string;
  hairColor: string;
  work: string;
}


export interface ISQLTableDatos {
  id:number;
  datos:ISQLTable[];
}


export interface ISQLTable {
  sql: string;
  idzona:number;
}


export interface ZoneTable {
  zonaid:number;
  zone: string;
  cityId:number;
  ciudad: string;
  dane: string;
  stateId:number;
  departamento: string;
  countryId:string;
  country: string;
  total_zona: string;
}


export interface BrandProviderTable {
  brandProviderId:number;
  providerId:number;
  businessName:string;
  brandId:number;
  brand:string;
  total_name:string;
}


export interface BrandProviderJobOfferTable {
  id:number;
  job: string;
  vacancies:number;
  description: string;
  activationDate: string;
  finishDate:string;
  zoneId: number;
  brandProviderId:number;
  optionsStatus: string;
  optionsCreatedat: string;
  optionsUpdatedat: string;
  requerimientos: string[];
}

export interface BrandProviderJobOfferRequirementTable {
  id:number;
  requirement: string;
  brandProviderJobOfferId:number;
  optionsStatus: string;
  optionsCreatedat: string;
  optionsUpdatedat: string;
}

export interface BrandProviderZoneTable {
  id:number;
  brandProviderId:number;
  zoneId:number;
  optionsStatus: string;
  optionsCreatedat: string;
  optionsUpdatedat: string;
}





export interface IHeroDetail {
  name: string;
  urlImage: string;
  powerstats: IPowerstats;
  appearance: IAppearance;
}

interface IAppearance {
  gender: string;
  race: string;
  height: string;
  weight: string;
  eyeColor: string;
  hairColor: string;
}

export interface IDataSection {
  keyColumnTitle: string;
  keyColumnValue: string;
  values: { key: string; value: unknown }[];
}


export interface TestEvent{ 
  id?: number,
  sql?: string
}
