import { DataForTable } from "../../../../../node_modules/elegant-crud-datatable/build/DataForTable.js";

export class PDFProductosSelectedData extends DataForTable {
  constructor(ref, producto, cantidad, margen, recuperacion) {
    super();
    this.ref = ref;
    this.producto = producto;
    this.cantidad = cantidad;
    this.margen = margen;
    this.recuperacion = recuperacion;
  }

  toObject() {
    return {
      Ref: this.ref,
      Producto: this.producto,
      Cantidad: this.cantidad,
      "Margen Utilidad": this.margen,
      Recuperación: this.recuperacion,
    };
  }
}
