export function DownloadReporteInPdf(
  productoId,
  cliente,
  ciudad,
  consecutivo,
  fecha
) {
  let reportePdf = new jsPDF("p", "pt", "letter");
  const title = "Reporte";

  reportePdf.text(title, 300, 50, {
    align: "center",
  });
  reportePdf.setFontSize(14);
  reportePdf.text(
    [
      `# Consecutivo: ${consecutivo}`,
      `Cliente: ${cliente}`,
      `Ciudad: ${ciudad}`,
    ],
    50,
    120,
    {}
  );
  reportePdf.setFontSize(12);
  reportePdf.autoTable({
    html: "#reporte-procesos-table table",
    startY: 175,
    theme: "grid",
  });
  reportePdf.addPage();
  reportePdf.text("Materia Prima", 300, 50, {
    align: "center",
  });
  reportePdf.autoTable({
    html: "#materias-reporte-procesos-table table",
    startY: 70,
    theme: "grid",
  });
  reportePdf.text("Servicios Externos", 300, 140, {
    align: "center",
  });
  reportePdf.autoTable({
    html: "#servicios-externos-reporte-procesos-table table",
    startY: 160,
    theme: "grid",
  });
  reportePdf.addPage();
  reportePdf.text("Costeos", 300, 50, {
    align: "center",
  });
  reportePdf.autoTable({
    html: "#costeo-reporte-procesos-table table",
    startY: 70,
    theme: "grid",
  });
  if (!fecha) {
    const now = new Date();
    fecha = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
  }
  reportePdf.save(`Cotizacion_${consecutivo}_${fecha}.pdf`);
}
