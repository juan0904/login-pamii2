import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ajustaFechaExcel'
})
export class AjustaFechaExcelPipe implements PipeTransform {

  /*
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
  */

  transform(numeroDeDias: number): string{
    let esExcel = true;
    var diasDesde1900 = esExcel ? 25567 + 1 : 25567;

    // 86400 es el número de segundos en un día, luego multiplicamos por 1000 para obtener milisegundos.
    let fecha = new Date((numeroDeDias - diasDesde1900) * 86400 * 1000);

    let lafecha = this.getStrDateAlterno(fecha);
    return lafecha;
  }

  appendLeadingZeroes(n: number) {
    if (n <= 9) {
      return '0' + n;
    }
    return n;
  }

  getStrDate(unDate: Date) {
    let unStrDate =
      unDate.getFullYear() +
      '-' +
      this.appendLeadingZeroes(unDate.getMonth() + 1) +
      '-' +
      this.appendLeadingZeroes(unDate.getDate());

    return unStrDate;
  }

  getStrDateAlterno(unDate: Date) {
    let unStrDate =
    this.appendLeadingZeroes(unDate.getDate()) +
      '/' +
      this.appendLeadingZeroes(unDate.getMonth() + 1) +
      '/' +
      unDate.getFullYear();

    return unStrDate;
  }

}
