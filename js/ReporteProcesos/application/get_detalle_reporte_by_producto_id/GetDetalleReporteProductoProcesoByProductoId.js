import { DataTableSubgroupSeparator } from "../../../../node_modules/elegant-crud-datatable/build/DataTableSubgroupSeparator";
import { GetAllGastosGenerales } from "../../../GastosGenerales/application/get_gastos_generales_by_proceso_id/GetGastosGeneralesByProcesoId.js";
import { GetProductosProcesosByProductoId } from "../../../ProductosProcesos/application/get_productos_procesos_by_producto_id/GetProductosProcesosByProductoId.js";
import { GetServiciosExternosByProductoId } from "../../../ServiciosExternos/application/get_by_producto_id/GetServiciosExternosByProductoId.js";
import { ServiciosExternosIndividualReporteData } from "../../elements/serviciosexternos_individual_reporte_datatable/data/ServiciosExternosIndividualReporteData.js";

export function GetDetalleReporteProductoProcesoByProductoId(
  productoId,
  totalProcesos,
  cb
) {
  let dataTable = [];
  GetServiciosExternosByProductoId(productoId, (servicios) => {
    GetProductosProcesosByProductoId(productoId, (productosProcesos) => {
      GetAllGastosGenerales((distribuciones) => {
        let serviciosExternosCostoTotal = 0;
        if (servicios) {
          servicios.forEach((servicio, index) => {
            dataTable.push(
              new ServiciosExternosIndividualReporteData(
                `${index + 1}. ${servicio.nombreServicio}`,
                servicio.costo
              )
            );
            return `${index + 1}. ${servicio.nombreServicio}`;
          });
          serviciosExternosCostoTotal = servicios.reduce((total, servicio) => {
            return total + parseFloat(servicio.costo);
          }, 0);
        }
        dataTable.push(
          new DataTableSubgroupSeparator(
            "CostoProduccion",
            `Costo Producción: ${
              PriceParser.toString(totalProcesos, true).strPrice
            }`,
            [],
            ["text-right", "pr-3"],
            undefined,
            "white"
          )
        );
        dataTable.push(
          new DataTableSubgroupSeparator(
            "TotalServiciosExternos",
            `Total Servicios Externos: ${
              PriceParser.toString(serviciosExternosCostoTotal, true).strPrice
            }`,
            [],
            ["text-right", "pr-3"],
            undefined,
            "white"
          )
        );

        let recuperacionGastosCostos = 0;
        distribuciones.forEach((dist) => {
          const process = productosProcesos.find(
            (prodProcess) => dist.idProceso == prodProcess.process.id
          );
          if (process) {
            recuperacionGastosCostos += parseFloat(dist.valorAsignado);
          }
        });
        dataTable.push(
          new DataTableSubgroupSeparator(
            "Recuperacion",
            `Recuperación gastos y costos: ${
              PriceParser.toString(recuperacionGastosCostos, true).strPrice
            }`,
            [],
            ["text-right", "pr-3"],
            undefined,
            "white"
          )
        );
        dataTable.push(
          new DataTableSubgroupSeparator(
            "toalP",
            `Costo Total Producto: ${
              PriceParser.toString(
                recuperacionGastosCostos + parseFloat(totalProcesos),
                true
              ).strPrice
            }`,
            [],
            ["text-right", "pr-3"],
            undefined,
            "white"
          )
        );

        cb(dataTable);
      });
    });
  });
}
