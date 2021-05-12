import { DataForTable } from "../../../../../../node_modules/elegant-crud-datatable/build/DataForTable.js";

export class CosteosIndividualReporteData extends DataForTable {
  constructor(concepto, monto) {
    super();
    this.concepto = concepto;
    this.monto = monto;
  }

  static fromJSON(json) {
    return new CosteosIndividualReporteData(json.concepto, json.monto);
  }

  toObject() {
    return {
      Detalle: this.concepto,
      Total: this.monto,
    };
  }
}
