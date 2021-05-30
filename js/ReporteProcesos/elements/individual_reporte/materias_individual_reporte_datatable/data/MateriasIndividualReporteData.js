import { DataForTable } from "../../../../../../node_modules/elegant-crud-datatable/build/DataForTable.js";

export class MateriasIndividualReporteData extends DataForTable {
  constructor(concepto, monto) {
    super();
    this.concepto = concepto;
    this.monto = monto;
  }

  static fromJSON(json) {
    return new MateriasIndividualReporteData(json.concepto, json.monto);
  }

  toObject() {
    return {
      "Costos Materia Prima": this.concepto,
      Total: this.monto,
    };
  }
}
