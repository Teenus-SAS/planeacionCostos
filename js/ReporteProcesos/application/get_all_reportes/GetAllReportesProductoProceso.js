export function GetAllReportesProductoProceso(cb) {
  $.get(`/app/reportes/api/get_reportes_costeos_procesos.php`, (data) => {
    cb(data);
  });
}
