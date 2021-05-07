export function GetReporteProductoProcesosByConsecutivo(consecutivo, cb) {
  $.get(
    "/app/reportes/api/get_reporte_costeo_procesos_by_consecutivo.php",
    {
      consecutivo,
    },
    (reporte) => {
      cb(reporte);
    }
  );
}
