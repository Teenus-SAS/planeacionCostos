import { GetServiciosExternosReporteProductoProcesoByProductoId } from "../../../application/get_servicios_externos_reporte_by_producto_id/GetServiciosExternosReporteProductoProcesoByProductoId.js";
import { GenerateReporteProductoProcesosByProductoId } from "../../../application/generate_reporte_by_producto_id/GenerateReporteProductoProcesosByProductoId.js";
import { GetCosteosReporteByProductoId } from "../../../application/get_costeos_reporte_by_producto_id/GetCosteosReporteByProductoId.js";

export async function OnClickGenerateReporteProductoProcesoButton(
  buttonData,
  productoSelected,
  cb
) {
  const { reportes, reporteTotal, totalMateriasPrimas, totalCargasFabriles } =
    await GenerateReporteProductoProcesosByProductoId(
      buttonData.productoId,
      buttonData.cantidad
    );
  const { dataTable: dataTableServiciosExternos, serviciosExternosCostoTotal } =
    await GetServiciosExternosReporteProductoProcesoByProductoId(
      buttonData.productoId,
      buttonData.cantidad
    );

  $("#option-id-producto-reporte").val(buttonData.productoId);
  const dataCosteos = await GetCosteosReporteByProductoId(
    buttonData.productoId,
    buttonData.cantidad,
    reporteTotal,
    serviciosExternosCostoTotal,
    totalMateriasPrimas,
    totalCargasFabriles,
    buttonData.recuperacion
  );
  await cb(
    reportes,
    dataTableServiciosExternos,
    totalMateriasPrimas,
    dataCosteos,
    productoSelected
  );
}
