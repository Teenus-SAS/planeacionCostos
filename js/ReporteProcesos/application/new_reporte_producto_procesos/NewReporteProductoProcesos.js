export function NewReporteProductoProcesos(
  consecutivo,
  cliente,
  ciudad,
  productoId,
  cantidad,
  cb,
  errorscb = () => {}
) {
  $.post(
    "/app/reportes/api/add_reporte_costeo_procesos.php",
    { consecutivo, cliente, ciudad, productoId, cantidad },
    (_products, status, xhr) => {
      if (status === "success") {
        cb();
      }
    }
  ).always((xhr) => {
    if (xhr.status == 411) {
      errorscb([`Reporte con consecutivo ${consecutivo} ya existe`]);
    }
  });
}
