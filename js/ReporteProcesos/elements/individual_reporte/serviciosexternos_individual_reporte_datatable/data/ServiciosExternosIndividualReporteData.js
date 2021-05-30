import { DataForTable } from "../../../../../../node_modules/elegant-crud-datatable/build/DataForTable.js";

export class ServiciosExternosIndividualReporteData extends DataForTable {
  constructor(concepto, monto) {
    super();
    this.concepto = concepto;
    this.monto = monto;
  }

  static fromJSON(json) {
    return new ServiciosExternosIndividualReporteData(
      json.concepto,
      json.monto
    );
  }

  toObject() {
    return {
      "Costos Servicios Externos": this.concepto,
      Total: this.monto,
    };
  }
}
