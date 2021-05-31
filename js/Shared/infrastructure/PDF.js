import { jsPDF } from "../../../node_modules/jspdf/dist/jspdf.es.js";

export class PDF {
  constructor(piePagina = null, fontSize = 14) {
    this.pdf = new jsPDF("p", "pt", "letter");
    this.pdf.setFontSize(fontSize);
    this.piePagina = piePagina;
    if (piePagina) {
      this.addPiePagina();
    }
  }

  async printCanvas(element) {
    const canvas = await html2canvas(element);
    let canvasImageData = canvas.toDataURL("image/png", 1.0);
    const pageWidth = this.pdf.internal.pageSize.getWidth();
    const pageHeight = this.pdf.internal.pageSize.getHeight();

    const widthRatio = pageWidth / canvas.width;
    const heightRatio = pageHeight / canvas.height;
    const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

    const canvasWidth = canvas.width * ratio * 0.85;
    const canvasHeight = canvas.height * ratio * 0.85;

    const marginX = (pageWidth - canvasWidth) / 2;
    this.pdf.addImage(
      canvasImageData,
      "PNG",
      marginX,
      50,
      canvasWidth,
      canvasHeight
    );
  }

  addPage(piePagina = true) {
    this.pdf.addPage();
    if (piePagina && this.piePagina) {
      this.addPiePagina();
    }
  }

  addPiePagina() {
    if (!this.piePagina) {
      return;
    }

    const piepaginaImageData = this.piePagina.toDataURL("image/png", 1.0);

    const pageWidth = this.pdf.internal.pageSize.getWidth();
    const pageHeight = this.pdf.internal.pageSize.getHeight();

    const piePaginaWidthRatio = pageWidth / this.piePagina.width;
    const piePaginaHeightRatio = pageHeight / this.piePagina.height;
    const piePaginaRatio =
      piePaginaWidthRatio > piePaginaHeightRatio
        ? piePaginaHeightRatio
        : piePaginaWidthRatio;

    const piePaginaWidth = this.piePagina.width * piePaginaRatio;
    const piePaginaHeight = this.piePagina.height * piePaginaRatio;
    this.pdf.addImage(
      piepaginaImageData,
      "PNG",
      0,
      pageHeight - piePaginaHeight + 1,
      piePaginaWidth,
      piePaginaHeight
    );
  }

  save(name) {
    this.pdf.save(name);
  }

  async html(element) {
    return new Promise((resolve, reject) => {
      let pWidth = this.pdf.internal.pageSize.width;
      let srcWidth = element.scrollWidth;
      let margin = 30;
      let scale = (pWidth - margin * 2) / srcWidth;
      this.pdf.html(element, {
        x: margin,
        y: 15,
        html2canvas: {
          scale: scale,
        },
        callback: (doc) => {
          resolve(doc);
        },
      });
    });
  }
}
