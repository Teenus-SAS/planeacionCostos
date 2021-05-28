export function CreateReporteProductoProcesos(
  consecutivo,
  cliente,
  ciudad,
  productos,
  cantidad,
  pdfData,
  cb,
  errorscb = () => {}
) {
  console.log({ productos });
  $.post("/app/reportes/api/add_reporte_costeo_procesos.php", {
    consecutivo,
    cliente,
    ciudad,
    productos: JSON.stringify(productos),
    cantidad,
    pdfdata: JSON.stringify(pdfData),
  }).always((xhr) => {
    if (xhr.status == 200) {
      cb();
    } else if (xhr.status == 411) {
      errorscb([`Reporte con consecutivo ${consecutivo} ya existe`]);
    }
  });
}
