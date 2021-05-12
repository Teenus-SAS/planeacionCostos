import { DataForTable } from "../../../../../node_modules/elegant-crud-datatable/build/DataForTable.js";

export class DetallesIndividualReporteData extends DataForTable {
  constructor(concepto, monto) {
    super();
    this.concepto = concepto;
    this.monto = monto;
  }

  static fromJSON(json) {
    return new DetallesIndividualReporteData(json.concepto, json.monto);
  }

  toObject() {
    return {
      Concepto: this.concepto,
      Monto: this.monto,
    };
  }
}
