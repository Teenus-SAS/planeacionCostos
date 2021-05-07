import { DeleteReporteProductoProcesoByConsecutivo } from "../../../application/delete_reporte_producto_proceso_by_consecutivo/DeleteReporteProductoProcesoByConsecutivo.js";

export function OnClickDeleteReporteProductoProceso(consecutivo, cb) {
  bootbox.confirm({
    title: "Eliminar Reporte",
    message: `¿Está seguro de eliminar el reporte con consecutivo <b>${consecutivo}</b>?.  Esta acción no se puede deshacer`,
    buttons: {
      confirm: {
        label: '<i class="fa fa-check"></i> Si',
        className: "btn-danger",
      },
      cancel: {
        label: '<i class="fa fa-times"></i> No',
        className: "btn-info",
      },
    },
    callback: function (result) {
      if (result == true) {
        DeleteReporteProductoProcesoByConsecutivo(consecutivo, () => {
          $.notify(
            {
              icon: "nc-icon nc-bell-55",
              message: `Proceso eliminado`,
            },
            {
              type: "info",
              timer: 2500,
            }
          );
        });
        cb();
      } else {
        return;
      }
    },
  });
}
