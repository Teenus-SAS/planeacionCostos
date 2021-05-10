import { GetReporteProductoProcesosByProductoId } from "../../../application/get_reporte_by_producto_id/GetReporteProductoProcesosByProductoId.js";

export function OnClickGenerateReporteProductoProcesoButton(buttonData, cb) {
  GetReporteProductoProcesosByProductoId(
    buttonData.productoId,
    buttonData.cantidad,
    (data) => {
      $("#option-id-producto-reporte").val(buttonData.productoId);
      cb(data);
    }
  );
}
