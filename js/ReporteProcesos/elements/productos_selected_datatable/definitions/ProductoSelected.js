export class ProductoSelected {
  constructor(referencia, nombre, cantidad, margen, recuperacion, pdfData) {
    this.referencia = referencia;
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.margen = margen;
    this.recuperacion = recuperacion;
    this.pdfData = JSON.stringify(pdfData);
  }

  setPdfData(pdfData) {
    this.pdfData = JSON.stringify(pdfData);
  }

  getPdfData() {
    return JSON.parse(this.pdfData);
  }
}
