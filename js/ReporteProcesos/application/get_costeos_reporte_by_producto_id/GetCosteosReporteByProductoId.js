import { GetProductosProcesosByProductoId } from "../../../ProductosProcesos/application/get_productos_procesos_by_producto_id/GetProductosProcesosByProductoId.js";
import { CosteosIndividualReporteData } from "../../elements/individual_reporte/costeos_individual_reporte_datatable/data/CosteosIndividualReporteData.js";
import { GetEmpresa } from "../../../OpcionesEmpresa/application/get_empresa/GetEmpresa.js";
import { GetAllDistribucionesDirectasRedistribuidas } from "../../../DistribucionDirecta/application/get_all_distribuciones_redistribuidas/GetAllDistribucionesDirectasRedistribuidas.js";

export function GetCosteosReporteByProductoId(
  productoId,
  totalProcesos,
  totalServiciosExternos,
  totalMateriasPrimas,
  totalCargasFabriles,
  manualRecuperacion,
  cb
) {
  GetProductosProcesosByProductoId(productoId, (productosProcesos) => {
    GetAllDistribucionesDirectasRedistribuidas((distribuciones) => {
      GetEmpresa((empresa) => {
        let dataTable = [];
        dataTable.push(
          new CosteosIndividualReporteData(
            `Costo Mano de Obra`,
            0,
            totalProcesos
          )
        );
        dataTable.push(
          new CosteosIndividualReporteData(
            `Materia Prima`,
            0,
            totalMateriasPrimas
          )
        );
        dataTable.push(
          new CosteosIndividualReporteData(
            `Carga Fabril`,
            0,
            totalCargasFabriles
          )
        );
        const costoProduccion =
          totalProcesos + totalMateriasPrimas + totalCargasFabriles;
        dataTable.push(
          new CosteosIndividualReporteData(
            `Costo Producción`,
            0,
            costoProduccion,
            ["font-semibold"]
          )
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

        recuperacionGastosCostosManual =
          (totalServiciosExternos + costoProduccion) *
          (parseFloat(manualRecuperacion) / 100);

        console.log(recuperacionGastosCostosManual);

        distribuciones.forEach((dist) => {
          const process = productosProcesos.find(
            (prodProcess) => dist.idProceso == prodProcess.process.id
          );
          if (process) {
            recuperacionGastosCostos +=
              parseFloat(dist.valorMinuto) *
              (process.timeAlistamiento + process.timeOperacion);
          }
        });
        dataTable.push(
          new CosteosIndividualReporteData(
            `Recuperación Gastos y Costos`,
            manualRecuperacion,
            recuperacionGastosCostos + recuperacionGastosCostosManual
          )
        );
        let costoTotalProducto =
          costoProduccion + totalServiciosExternos + recuperacionGastosCostos;
        dataTable.push(
          new CosteosIndividualReporteData(
            `Costo Total Producto`,
            0,
            costoTotalProducto,
            ["font-semibold"]
          )
        );
        let margenUtilidad =
          (parseFloat(empresa.profitabilityMargin) / 100) * costoTotalProducto;

        dataTable.push(
          new CosteosIndividualReporteData(
            `Margen de Utilidad`,
            parseFloat(empresa.profitabilityMargin),
            margenUtilidad
          )
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
        cb(dataTable);
      });
    });
  });
}
