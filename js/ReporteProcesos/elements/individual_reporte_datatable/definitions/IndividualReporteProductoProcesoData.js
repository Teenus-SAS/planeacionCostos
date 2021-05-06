import { DataForTable } from "../../../../../node_modules/elegant-crud-datatable/build/DataForTable.js";

export class IndividualReporteProductoProcesoData extends DataForTable {
  constructor(
    productoProceso,
    maquinaProceso,
    cantidadMinuto,
    costoMinuto,
    total
  ) {
    super();
    this.productoProceso = productoProceso;
    this.maquinaProceso = maquinaProceso;
    this.cantidadMinuto = cantidadMinuto;
    this.costoMinuto = costoMinuto;
    this.total = total;
  }

  toObject() {
    return {
      Proceso: this.productoProceso,
      Maquina: this.maquinaProceso,
      Minutos: this.cantidadMinuto,
      "Costo/min": this.costoMinuto,
      Total: this.total,
    };
  }
}
