import { GetServiciosExternosByProductoId } from "../../../ServiciosExternos/application/get_by_producto_id/GetServiciosExternosByProductoId.js";
import { ServiciosExternosIndividualReporteData } from "../../elements/individual_reporte/serviciosexternos_individual_reporte_datatable/data/ServiciosExternosIndividualReporteData.js";

export async function GetServiciosExternosReporteProductoProcesoByProductoId(
  productoId,
  cantidad
) {
  cantidad = parseFloat(cantidad);
  let dataTable = [];

  let servicios = await GetServiciosExternosByProductoId(productoId);
  let serviciosExternosCostoTotal = 0;

  if (servicios && servicios.length) {
    servicios = servicios.map((servicio, index) => {
      servicio.costo *= cantidad;
      dataTable.push(
        new ServiciosExternosIndividualReporteData(
          `${index + 1}. ${servicio.nombreServicio}`,
          servicio.costo
        )
      );

      return servicio;
    });
    serviciosExternosCostoTotal = servicios.reduce((total, servicio) => {
      return total + parseFloat(servicio.costo);
    }, 0);
  }

  return { dataTable, serviciosExternosCostoTotal };
}
