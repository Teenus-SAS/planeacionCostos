import { GetReporteProductoProcesosByProductoId } from "../../../application/get_reporte_by_producto_id/GetReporteProductoProcesosByProductoId.js";
import { IndividualReporteProductoProcesoDataTable } from "../../individual_reporte_datatable/IndividualReporteProductoProcesoDataTable.js";

export function OnClickGenerateReporteProductoProcesoButton(buttonData) {
  GetReporteProductoProcesosByProductoId(
    buttonData.productoId,
    buttonData.cantidad,
    (data) => {
      const table = new IndividualReporteProductoProcesoDataTable(data, {});
      table.toDiv("reporte-procesos-table");

      $("#reporte-procesos-content").attr("hidden", false);
      $("#option-id-producto-reporte").val(buttonData.productoId);
      document.getElementById("reporte-procesos-content").scrollIntoView();
    }
  );
}
