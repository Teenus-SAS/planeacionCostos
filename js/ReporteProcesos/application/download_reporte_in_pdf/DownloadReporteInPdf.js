export function DownloadReporteInPdf(productoId, cliente, ciudad, consecutivo) {
  let reportePdf = new jsPDF("p", "pt", "letter");
  const title = "Reporte";

  reportePdf.text(title, 300, 50, {
    align: "center",
  });
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
  reportePdf.autoTable({
    html: "#reporte-procesos-table table",
    startY: 200,
    theme: "grid",
  });
  reportePdf.save();
}
