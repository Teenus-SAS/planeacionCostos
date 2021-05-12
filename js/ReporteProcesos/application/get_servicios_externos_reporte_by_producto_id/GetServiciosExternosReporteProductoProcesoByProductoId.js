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

    cb(dataTable, serviciosExternosCostoTotal);
  });
}
