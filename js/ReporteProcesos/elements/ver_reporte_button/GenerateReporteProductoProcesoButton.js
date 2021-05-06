import { DomElement } from "../../../Shared/domain/DomElement.js";
import { OnClickGenerateReporteProductoProcesoButton } from "./events/OnClickGenerateReporteProductoProcesoButton.js";

export class GenerateReporteProductoProcesoButton extends DomElement {
  constructor(elementId, invalidDatacb = undefined) {
    super(document.getElementById(elementId));
    this.invalidDatacb = invalidDatacb;
    this.generarReporteOnClick();
  }

  generarReporteOnClick(aftercb = undefined) {
    super.onClick((data) => {
      if (this.invalidDatacb) {
        if (this.validateData()) {
          OnClickGenerateReporteProductoProcesoButton(data);
        } else {
          this.invalidDatacb();
        }
      }
    }, aftercb);
  }

  get productoId() {
    return this.data && this.data.productoId ? this.data.productoId : null;
  }

  get cantidad() {
    return this.data && this.data.cantidad ? this.data.cantidad : null;
  }

  validateData() {
    return this.productoId && this.cantidad && !isNaN(this.cantidad);
  }

  setData(productoId, cantidad) {
    this.data = { productoId, cantidad };
  }
}
