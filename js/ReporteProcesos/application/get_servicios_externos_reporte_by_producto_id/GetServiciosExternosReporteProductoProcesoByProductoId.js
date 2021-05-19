import { DataTableSubgroupSeparator } from "../../../../node_modules/elegant-crud-datatable/build/DataTableSubgroupSeparator.js";
import { GetServiciosExternosByProductoId } from "../../../ServiciosExternos/application/get_by_producto_id/GetServiciosExternosByProductoId.js";
import { ServiciosExternosIndividualReporteData } from "../../elements/individual_reporte/serviciosexternos_individual_reporte_datatable/data/ServiciosExternosIndividualReporteData.js";

export function GetServiciosExternosReporteProductoProcesoByProductoId(
  productoId,
  cb
) {
  let dataTable = [];
  GetServiciosExternosByProductoId(productoId, (servicios) => {
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
        "TotalServicios",
        `Total Servicios Externos: ${
          PriceParser.toString(serviciosExternosCostoTotal, true).strPrice
        }`,
        [],
        ["text-right", "pr-3"],
        undefined,
        "white"
      )
    );

    cb(dataTable, serviciosExternosCostoTotal, servicios);
  });
}
