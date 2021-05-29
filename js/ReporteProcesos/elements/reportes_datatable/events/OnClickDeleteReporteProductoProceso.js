import { Notifications } from "../../../../Shared/infrastructure/Notifications.js";
import { DeleteReporteProductoProcesoByConsecutivo } from "../../../application/delete_reporte_producto_proceso_by_consecutivo/DeleteReporteProductoProcesoByConsecutivo.js";

export async function OnClickDeleteReporteProductoProceso(consecutivo) {
  return new Promise((resolve, reject) => {
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
          DeleteReporteProductoProcesoByConsecutivo(consecutivo)
            .then(() => {
              Notifications.info("Producto eliminado");
              resolve(true);
            })
            .catch((reason) => reject(reason));
        } else {
          resolve(false);
        }
      },
    });
  });
}
