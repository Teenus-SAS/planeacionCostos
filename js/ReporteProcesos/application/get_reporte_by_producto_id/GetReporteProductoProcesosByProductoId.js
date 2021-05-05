import { CalculateCostoPorMinutoByProductoId } from "../../../Productos/application/calculate_costo_por_minuto_producto/CalculateCostoPorMinutoByProductoId.js";
import { GetProductoById } from "../../../Productos/application/get_producto_by_id/GetProductoById.js";
import { GetProductosProcesosByProductoId } from "../../../ProductosProcesos/application/GetProductosProcesosByProductoId.js";
import { IndividualReporteProductoProcesoData } from "../../domain/IndividualReporteProductoProcesoData.js";

export function GetReporteProductoProcesosByProductoId(productoId, cb) {
  GetProductoById(productoId, (product) => {
    if (product) {
      GetProductosProcesosByProductoId(productoId, (procesos) => {
        let reportes = [];
        if (procesos) {
          CalculateCostoPorMinutoByProductoId(productoId, "1", console.log);
          reportes = procesos.map(
            (proceso) =>
              new IndividualReporteProductoProcesoData(
                proceso.process.name,
                parseFloat(proceso.timeAlistamiento) +
                  parseFloat(proceso.timeOperacion),
                0,
                "unknown"
              )
          );
        }
        cb(reportes);
      });
    }
  });
}
