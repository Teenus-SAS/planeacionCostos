import { GetProductoById } from "../../../Productos/application/get_producto_by_id/GetProductoById.js";
import { CalculateCostPerMinuteByProductoProcesoId } from "../../../ProductosProcesos/application/calculate_cost_per_minute_by_producto_id/CalculateCostPerMinuteByProductoProcesoId.js";
import { GetProductosProcesosByProductoId } from "../../../ProductosProcesos/application/get_productos_procesos_by_producto_id/GetProductosProcesosByProductoId.js";
import { IndividualReporteProductoProcesoData } from "../../elements/individual_reporte_datatable/definitions/IndividualReporteProductoProcesoData.js";

export function GetReporteProductoProcesosByProductoId(
  productoId,
  cantidad,
  cb
) {
  GetProductoById(productoId, (product) => {
    if (product) {
      GetProductosProcesosByProductoId(productoId, (procesos) => {
        let reportes = [];
        if (procesos) {
          CalculateCostPerMinuteByProductoProcesoId(
            productoId,
            cantidad,
            (costosPorMinuto) => {
              procesos.forEach((proceso) => {
                const costoMinuto = costosPorMinuto.find(
                  (costo) => costo[0] == String(proceso.id).trim()
                )[1];
                const totalTime =
                  parseFloat(proceso.timeAlistamiento) +
                  parseFloat(proceso.timeOperacion);
                reportes.push(
                  new IndividualReporteProductoProcesoData(
                    proceso.process.name,
                    proceso.machine ? proceso.machine.name : "N/A",
                    totalTime,
                    costoMinuto,
                    totalTime * costoMinuto
                  )
                );
              });
              cb(reportes);
            }
          );
        }
      });
    }
  });
}
