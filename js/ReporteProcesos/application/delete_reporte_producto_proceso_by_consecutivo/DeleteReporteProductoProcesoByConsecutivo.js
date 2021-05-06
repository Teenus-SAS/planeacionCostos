export function DeleteReporteProductoProcesoByConsecutivo(consecutivo, cb) {
  $.post(
    "/app/reportes/api/delete_reportes_costeos_procesos_by_consecutivo.php",
    { consecutivo },
    () => {
      cb();
    }
  );
}
