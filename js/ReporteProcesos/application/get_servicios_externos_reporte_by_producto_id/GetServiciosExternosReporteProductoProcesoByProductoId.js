import { DataTableSubgroupSeparator } from "../../../../node_modules/elegant-crud-datatable/build/DataTableSubgroupSeparator.js";
import { GetServiciosExternosByProductoId } from "../../../ServiciosExternos/application/get_by_producto_id/GetServiciosExternosByProductoId.js";
import { ServiciosExternosIndividualReporteData } from "../../elements/individual_reporte/serviciosexternos_individual_reporte_datatable/data/ServiciosExternosIndividualReporteData.js";

export async function GetServiciosExternosReporteProductoProcesoByProductoId(
  productoId
) {
  let dataTable = [];

  const servicios = await GetServiciosExternosByProductoId(productoId);
  let serviciosExternosCostoTotal = 0;

  if (servicios && servicios.length) {
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

  return { dataTable, serviciosExternosCostoTotal };
}
