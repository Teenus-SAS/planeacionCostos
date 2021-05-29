import { DomElement } from "../../../Shared/domain/DomElement.js";
import { Loader } from "../../../Shared/infrastructure/Loader.js";
import { OnClickGenerateReporteProductoProcesoButton } from "./events/OnClickGenerateReporteProductoProcesoButton.js";

export class GenerateReporteProductoProcesoButton extends DomElement {
  constructor(
    elementId,
    reportecb,
    invalidDatacb = undefined,
    beforeclickcb = undefined
  ) {
    super(document.getElementById(elementId));
    this.invalidDatacb = invalidDatacb;
    this.generarReporteOnClick(reportecb, beforeclickcb);
  }

  generarReporteOnClick(reportecb, beforecb = undefined, aftercb = undefined) {
    super.onClick(async (data) => {
      if (this.invalidDatacb) {
        if (this.validateData()) {
          if (beforecb) {
            const producto = await beforecb(data);
            if (producto) {
              Loader.show();
              OnClickGenerateReporteProductoProcesoButton(
                data,
                producto,
                reportecb
              );
            }
          }
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

  get recuperacion() {
    return this.data && this.data.recuperacion ? this.data.recuperacion : null;
  }

  validateData() {
    return (
      this.productoId &&
      this.cantidad &&
      !isNaN(this.cantidad) &&
      this.recuperacion
    );
  }

  setData(productoId, cantidad, recuperacion) {
    this.data = { productoId, cantidad, recuperacion };
  }
}
