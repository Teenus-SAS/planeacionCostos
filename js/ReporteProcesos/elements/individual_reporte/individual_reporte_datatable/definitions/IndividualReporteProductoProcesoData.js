import { DataForTable } from "../../../../../../node_modules/elegant-crud-datatable/build/DataForTable.js";

export class IndividualReporteProductoProcesoData extends DataForTable {
  constructor(productoProceso, cantidadMinuto, costoMinuto, total) {
    super();
    this.productoProceso = productoProceso;
    this.cantidadMinuto = cantidadMinuto;
    this.costoMinuto = costoMinuto;
    this.total = total;
  }

  static fromJSON(json) {
    return new IndividualReporteProductoProcesoData(
      json.productoProceso,
      json.cantidadMinuto,
      json.costoMinuto,
      json.total
    );
  }

  toObject() {
    return {
      "Costos de Procesos": this.productoProceso,
      Minutos: this.cantidadMinuto,
      "Costo/min": this.costoMinuto,
      Total: this.total,
    };
  }
}
