import { DataForTable } from "../../../node_modules/elegant-crud-datatable/build/DataForTable.js";

export class ReporteProductoProceso extends DataForTable {
  constructor(consecutivo, cantidad, ciudad, cliente, fechaCreacion, producto) {
    super();
    this.consecutivo = consecutivo;
    this.cantidad = cantidad;
    this.ciudad = ciudad;
    this.cliente = cliente;
    this.fechaCreacion = fechaCreacion;
    this.producto = producto;
  }

  toObject() {
    return {
      Consecutivo: this.consecutivo,
      Cantidad: this.cantidad,
      Ciudad: this.ciudad,
      Cliente: this.cliente,
      Fecha: this.fechaCreacion,
      Producto: this.producto,
    };
  }
}
