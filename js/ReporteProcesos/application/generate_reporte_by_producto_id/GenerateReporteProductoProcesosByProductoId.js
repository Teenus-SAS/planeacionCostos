import { DataTableSubgroupSeparator } from "../../../../node_modules/elegant-crud-datatable/build/DataTableSubgroupSeparator.js";
import { GetTotalCargasFabrilesByProductoId } from "../../../CargaFabril/application/get_total_cargas_by_producto_id/GetTotalCargasFabrilesByProductoId.js";
import { GetMateriasPrimasByProductoId } from "../../../MateriaPrima/application/GetMateriasPrimasByProductoId.js";
import { GetProductoById } from "../../../Productos/application/get_producto_by_id/GetProductoById.js";
import { CalculateCostPerMinuteByProductoProcesoId } from "../../../ProductosProcesos/application/calculate_cost_per_minute_by_producto_id/CalculateCostPerMinuteByProductoProcesoId.js";
import { GetProductosProcesosByProductoId } from "../../../ProductosProcesos/application/get_productos_procesos_by_producto_id/GetProductosProcesosByProductoId.js";
import { IndividualReporteProductoProcesoData } from "../../elements/individual_reporte/individual_reporte_datatable/definitions/IndividualReporteProductoProcesoData.js";

export function GenerateReporteProductoProcesosByProductoId(
  productoId,
  cantidad,
  cb
) {
  GetProductoById(productoId, (product) => {
    if (product) {
      GetProductosProcesosByProductoId(productoId, (procesos) => {
        GetTotalCargasFabrilesByProductoId(
          productoId,
          (totalCargasFabriles) => {
            let reportes = [];
            if (procesos) {
              CalculateCostPerMinuteByProductoProcesoId(
                productoId,
                cantidad,
                (costosPorMinuto) => {
                  GetMateriasPrimasByProductoId(productoId, (materias) => {
                    let tiempoTotalProcesos = 0;
                    procesos.forEach((proceso) => {
                      const costoMinuto = costosPorMinuto.find(
                        (costo) => costo[0] == String(proceso.id).trim()
                      )[1];
                      const totalTime =
                        parseFloat(proceso.timeAlistamiento) +
                        parseFloat(proceso.timeOperacion);
                      tiempoTotalProcesos += totalTime;
                      const processExists = reportes.find(
                        (reporte) =>
                          reporte.productoProceso == proceso.process.name
                      );
                      if (!processExists) {
                        reportes.push(
                          new IndividualReporteProductoProcesoData(
                            proceso.process.name,
                            totalTime,
                            costoMinuto,
                            totalTime * costoMinuto
                          )
                        );
                      } else {
                        processExists.costoMinuto += costoMinuto;
                        processExists.cantidadMinuto += totalTime;
                        processExists.total += totalTime * costoMinuto;
                      }
                    });
                    let reporteTotal = reportes.reduce(
                      (total, report) => total + report.total,
                      0
                    );
                    reportes.push(
                      new DataTableSubgroupSeparator(
                        "TotalProcesos",
                        `Total Procesos: ${
                          PriceParser.toString(reporteTotal, true).strPrice
                        }`,
                        [],
                        ["text-right", "pr-3"],
                        undefined,
                        "white"
                      )
                    );

                    let totalMateriasPrimas = 0;
                    materias.forEach((materiaPrima) => {
                      totalMateriasPrimas +=
                        materiaPrima.quantity * materiaPrima.material.cost;
                    });

                    cb(
                      reportes,
                      reporteTotal,
                      totalMateriasPrimas,
                      totalCargasFabriles * tiempoTotalProcesos
                    );
                  });
                }
              );
            }
          }
        );
      });
    }
  });
}
