import { Injectable } from '@angular/core';
import {
  IDataHeroExcel,
  IDataSqlExcel,
  IDataZonesExcel,
} from '../models/excel.interface';
import * as fs from 'file-saver';
import { ExcelUtil } from '../util/excel-util';
import { ZoneUtil } from '../util/zone-util';
import { BrandProviderUtil } from '../util/brandprovider-util';

//import * as fs1 from 'fs';

@Injectable({
  providedIn: 'root',
})
export class ExcelService {
  /*
  private _myWorker = new Worker(new URL('../web.worker.ts', import.meta.url), {
    type: 'module',
  });
  */

  constructor() {}

  async dowloadExcel(dataExcel: IDataHeroExcel): Promise<void> {
    this.generateZipUsingWorker(dataExcel);
  }

  async dowloadZonas(dataZonas: IDataSqlExcel): Promise<void> {
    this.generateZipUsingZonas(dataZonas);
  }

  async dowloadZones(dataZonas: IDataZonesExcel): Promise<void> {
    this.generateZipUsingZones(dataZonas);
  }

  /*
  private _generateZipUsingWorker(dataExcel: IDataHeroExcel) {
  
    this._myWorker.onmessage = ({ data }) => {
      //console.log('MENSAJE ENVIADO POR EL WORKER: ', data);
      fs.saveAs(data, 'documentos excel.zip');
    };

    this._myWorker.postMessage(dataExcel);
  }
  */

  async generateZipUsingWorker(dataExcel: IDataHeroExcel) {
    //console.log(dataExcel);

    const excelUtil = new ExcelUtil(dataExcel);

    const blobZip = await excelUtil.generateBlobZip();

    //console.log(blobZip);

    fs.saveAs(blobZip, 'documentos excel.zip');

    //postMessage(blobZip);
  }

  async generateZipUsingZonas(dataZonas: IDataSqlExcel) {
    ////console.log(dataZonas);

    const zoneUtil = new ZoneUtil(dataZonas);

    const blobZip = await zoneUtil.generateBlobZip();

    //console.log(blobZip);

    fs.saveAs(blobZip, 'zones excel.zip');
  }

  async generateZipUsingZones(dataZones: IDataZonesExcel) {
    //console.log(dataZones);

    const zonesUtil = new BrandProviderUtil(dataZones);

    zonesUtil.downloadMultipleFiles1();

    //const blobZip = await zonesUtil.generateBlobZip();

    ////console.log(blobZip)

    //fs.saveAs(blobZip, 'plantillaOfertas Excel.zip');
  }

}
