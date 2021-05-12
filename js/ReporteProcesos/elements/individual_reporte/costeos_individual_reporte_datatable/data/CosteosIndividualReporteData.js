import { DataForTable } from "../../../../../../node_modules/elegant-crud-datatable/build/DataForTable.js";

export class CosteosIndividualReporteData extends DataForTable {
  constructor(concepto, porcentaje, monto, rowClasses) {
    super();
    this.concepto = concepto;
    this.porcentaje = porcentaje;
    this.monto = monto;
    this.rowClasses = rowClasses;
  }

  static fromJSON(json) {
    return new CosteosIndividualReporteData(json.concepto, json.monto);
  }

  toObject() {
    return {
      Detalle: this.concepto,
      Porcentaje: this.porcentaje,
      Total: this.monto,
    };
  }
}
