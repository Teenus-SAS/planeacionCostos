import { DomElement } from "../../../Shared/domain/DomElement.js";
import { OnClickDescargarReporteProductoProcesoButton } from "./events/OnClickDescargarReporteProductoProcesoButton.js";

export class DescargarPdfReporteProductoProcesoButton extends DomElement {
  constructor(
    elementId,
    invalidDatacb = undefined,
    aftercb = undefined,
    successcb = undefined
  ) {
    super(document.getElementById(elementId));
    this.invalidDatacb = invalidDatacb;
    this.descargarPdfOnClick(aftercb, successcb);
  }

  descargarPdfOnClick(aftercb = undefined, successcb = undefined) {
    super.onClick((data) => {
      if (this.invalidDatacb) {
        if (this.validateData()) {
          OnClickDescargarReporteProductoProcesoButton(data, successcb);
        } else {
          this.invalidDatacb();
        }
      }
    }, aftercb);
  }

  get consecutivo() {
    return this.data && this.data.consecutivo ? this.data.consecutivo : null;
  }

  get cliente() {
    return this.data && this.data.cliente ? this.data.cliente : null;
  }

  get ciudad() {
    return this.data && this.data.ciudad ? this.data.ciudad : null;
  }

  get cantidad() {
    return this.data && this.data.cantidad ? this.data.cantidad : null;
  }

  get productoId() {
    return this.data && this.data.productoId ? this.data.productoId : null;
  }

  get pdfdata() {
    return this.data && this.data.pdfdata ? this.data.pdfdata : null;
  }

  validateData() {
    console.log(this._data);
    return (
      this.consecutivo &&
      this.cliente &&
      this.ciudad &&
      this.cantidad &&
      this.pdfdata &&
      this.productoId
    );
  }

  setData(data) {
    this.data = {
      consecutivo: data.consecutivo || this.consecutivo,
      cliente: data.cliente || this.cliente,
      ciudad: data.ciudad || this.ciudad,
      cantidad: data.cantidad || this.cantidad,
      productoId: data.productoId || this.productoId,
      pdfdata: data.pdfdata || this.pdfdata,
    };
  }
}
