import { GetProductosProcesosByProductoId } from "../../../ProductosProcesos/application/get_productos_procesos_by_producto_id/GetProductosProcesosByProductoId.js";
import { CosteosIndividualReporteData } from "../../elements/individual_reporte/costeos_individual_reporte_datatable/data/CosteosIndividualReporteData.js";
import { GetEmpresa } from "../../../OpcionesEmpresa/application/get_empresa/GetEmpresa.js";
import { GetAllDistribucionesDirectasRedistribuidas } from "../../../DistribucionDirecta/application/get_all_distribuciones_redistribuidas/GetAllDistribucionesDirectasRedistribuidas.js";
import { GetProductoById } from "../../../Productos/application/get_producto_by_id/GetProductoById.js";

export async function GetCosteosReporteByProductoId(
  productoId,
  cantidad,
  totalProcesos,
  totalServiciosExternos,
  totalMateriasPrimas,
  totalCargasFabriles,
  manualRecuperacion
) {
  cantidad = parseFloat(cantidad);
  const producto = await GetProductoById(productoId);
  const productosProcesos = await GetProductosProcesosByProductoId(productoId);
  const distribuciones = await GetAllDistribucionesDirectasRedistribuidas();
  const empresa = await GetEmpresa();
  const dataTable = [];
  dataTable.push(
    new CosteosIndividualReporteData(`Costo Mano de Obra`, 0, totalProcesos)
  );
  dataTable.push(
    new CosteosIndividualReporteData(`Materia Prima`, 0, totalMateriasPrimas)
  );
  dataTable.push(
    new CosteosIndividualReporteData(`Carga Fabril`, 0, totalCargasFabriles)
  );
  const costoProduccion =
    totalProcesos + totalMateriasPrimas + totalCargasFabriles;
  dataTable.push(
    new CosteosIndividualReporteData(`Costo Producción`, 0, costoProduccion, [
      "font-semibold",
    ])
  );
  dataTable.push(
    new CosteosIndividualReporteData(
      `Servicios Externos`,
      0,
      totalServiciosExternos
    )
  );

  let recuperacionGastosCostos = 0;
  let recuperacionGastosCostosManual = 0;

  if (manualRecuperacion) {
    recuperacionGastosCostosManual =
      (totalServiciosExternos + costoProduccion) *
      (parseFloat(manualRecuperacion) / 100);
  }

  distribuciones.forEach((dist) => {
    const processes = productosProcesos.filter(
      (prodProcess) => dist.idProceso == prodProcess.process.id
    );
    if (processes && processes.length > 0) {
      processes.forEach((process) => {
        recuperacionGastosCostos +=
          parseFloat(dist.valorMinuto) *
          (parseFloat(process.timeAlistamiento) +
            parseFloat(process.timeOperacion)) *
          cantidad;
      });
    }
  });
  dataTable.push(
    new CosteosIndividualReporteData(
      `Recuperación Costos`,
      0,
      recuperacionGastosCostos
    )
  );
  dataTable.push(
    new CosteosIndividualReporteData(
      `Recuperación Gastos`,
      0,
      recuperacionGastosCostosManual
    )
  );
  let costoTotalProducto =
    costoProduccion +
    totalServiciosExternos +
    recuperacionGastosCostos +
    recuperacionGastosCostosManual;
  dataTable.push(
    new CosteosIndividualReporteData(
      `Costo Total Producto`,
      0,
      costoTotalProducto,
      ["font-semibold"]
    )
  );

  let margenUtilidad =
    (parseFloat(producto.rentabilidad) / 100) * costoTotalProducto;

  dataTable.push(
    new CosteosIndividualReporteData(`Margen de Utilidad`, 0, margenUtilidad)
  );

  let costoAntescomision = margenUtilidad + costoTotalProducto;
  dataTable.push(
    new CosteosIndividualReporteData(
      `Costo antes de comisión`,
      0,
      costoAntescomision
    )
  );
  let comisionVentas =
    (parseFloat(empresa.salesCommission) / 100) * costoAntescomision;
  dataTable.push(
    new CosteosIndividualReporteData(
      `Comisión ventas %`,
      parseFloat(empresa.salesCommission),
      comisionVentas
    )
  );
  let precioVentaAntesIVA = comisionVentas + costoAntescomision;
  dataTable.push(
    new CosteosIndividualReporteData(
      `Precio de venta antes de IVA`,
      0,
      precioVentaAntesIVA,
      ["font-semibold"]
    )
  );
  return dataTable;
}
