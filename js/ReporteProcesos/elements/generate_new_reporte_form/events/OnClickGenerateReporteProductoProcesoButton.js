import { GetServiciosExternosReporteProductoProcesoByProductoId } from "../../../application/get_servicios_externos_reporte_by_producto_id/GetServiciosExternosReporteProductoProcesoByProductoId.js";
import { GenerateReporteProductoProcesosByProductoId } from "../../../application/generate_reporte_by_producto_id/GenerateReporteProductoProcesosByProductoId.js";
import { GetCosteosReporteByProductoId } from "../../../application/get_costeos_reporte_by_producto_id/GetCosteosReporteByProductoId.js";

export function OnClickGenerateReporteProductoProcesoButton(buttonData, cb) {
  GenerateReporteProductoProcesosByProductoId(
    buttonData.productoId,
    buttonData.cantidad,
    (data, total, totalMateriasPrimas, totalCargasFabriles) => {
      GetServiciosExternosReporteProductoProcesoByProductoId(
        buttonData.productoId,
        (dataTableDetalle, totalServiciosExternos, serviciosExternos) => {
          $("#option-id-producto-reporte").val(buttonData.productoId);
          GetCosteosReporteByProductoId(
            buttonData.productoId,
            total,
            totalServiciosExternos,
            totalMateriasPrimas,
            totalCargasFabriles,
            serviciosExternos,
            (dataCosteos) => {
              cb(data, dataTableDetalle, totalMateriasPrimas, dataCosteos);
            }
          );
        }
      );
    }
  );
}
