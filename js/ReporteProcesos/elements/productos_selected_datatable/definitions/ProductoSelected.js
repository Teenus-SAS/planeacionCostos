export class ProductoSelected {
  constructor(referencia, nombre, cantidad, margen, recuperacion, pdfData) {
    this.referencia = referencia;
    this.nombre = nombre;
    this.cantidad = cantidad;
    this.margen = margen;
    this.recuperacion = recuperacion;
    this.pdfData = pdfData;
  }

  addPdfData(pdfData) {
    pdfData.main.forEach((individual) => {
      const exists = this.pdfData.main.find(
        (mainData) => mainData.productoProceso == individual.productoProceso
      );
      if (exists) {
        exists.cantidadMinuto += individual.cantidadMinuto;
        exists.costoMinuto += individual.costoMinuto;
        exists.total += individual.total;
      } else {
        this.pdfData.push(individual);
      }
    });
    console.log({ newData: this.pdfData });
  }
}
