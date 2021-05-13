import { DomElement } from "../../../Shared/domain/DomElement.js";
import { OnClickGenerateReporteProductoProcesoButton } from "./events/OnClickGenerateReporteProductoProcesoButton.js";

export class GenerateReporteProductoProcesoButton extends DomElement {
  constructor(elementId, reportecb, invalidDatacb = undefined) {
    super(document.getElementById(elementId));
    this.invalidDatacb = invalidDatacb;
    this.generarReporteOnClick(reportecb);
  }

  generarReporteOnClick(reportecb, aftercb = undefined) {
    super.onClick((data) => {
      if (this.invalidDatacb) {
        if (this.validateData()) {
          $("#new-reporte-procesos-button").addClass("hover:cursor-wait");
          $("html, body").addClass("cursor-wait");
          OnClickGenerateReporteProductoProcesoButton(data, reportecb);
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
