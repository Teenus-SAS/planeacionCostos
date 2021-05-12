import { GetEmpresa } from "../../../AjustesEmpresa/application/get_empresa/GetEmpresa.js";
import { GetAllGastosGenerales } from "../../../GastosGenerales/application/get_gastos_generales_by_proceso_id/GetGastosGeneralesByProcesoId.js";
import { GetProductosProcesosByProductoId } from "../../../ProductosProcesos/application/get_productos_procesos_by_producto_id/GetProductosProcesosByProductoId.js";
import { CosteosIndividualReporteData } from "../../elements/individual_reporte/costeos_individual_reporte_datatable/data/CosteosIndividualReporteData.js";

export function GetCosteosReporteByProductoId(
  productoId,
  totalProcesos,
  totalServiciosExternos,
  totalMateriasPrimas,
  totalCargasFabriles,
  cb
) {
  GetProductosProcesosByProductoId(productoId, (productosProcesos) => {
    GetAllGastosGenerales((distribuciones) => {
      GetEmpresa((empresa) => {
        let dataTable = [];
        dataTable.push(
          new CosteosIndividualReporteData(`Costo Mano de Obra`, totalProcesos)
        );
        dataTable.push(
          new CosteosIndividualReporteData(`Materia Prima`, totalMateriasPrimas)
        );
        dataTable.push(
          new CosteosIndividualReporteData(`Carga Fabril`, totalCargasFabriles)
        );
        const costoProduccion =
          totalProcesos + totalMateriasPrimas + totalCargasFabriles;
        dataTable.push(
          new CosteosIndividualReporteData(`Costo Producción`, costoProduccion)
        );
        dataTable.push(
          new CosteosIndividualReporteData(
            `Servicios Externos`,
            totalServiciosExternos
          )
        );

        let recuperacionGastosCostos = 0;
        distribuciones.forEach((dist) => {
          const process = productosProcesos.find(
            (prodProcess) => dist.idProceso == prodProcess.process.id
          );
          if (process) {
            recuperacionGastosCostos += parseFloat(dist.valorAsignado);
          }
        });
        dataTable.push(
          new CosteosIndividualReporteData(
            `Recuperación gastos y costos`,
            recuperacionGastosCostos
          )
        );
        let costoTotalProducto =
          costoProduccion + totalServiciosExternos + recuperacionGastosCostos;
        dataTable.push(
          new CosteosIndividualReporteData(
            `Costo Total Producto`,
            costoTotalProducto
          )
        );
        let margenUtilidad =
          (parseFloat(empresa.profitabilityMargin) / 100) * costoTotalProducto;

        dataTable.push(
          new CosteosIndividualReporteData(`Margen de Utilidad`, margenUtilidad)
        );
        let costoAntescomision = margenUtilidad + costoTotalProducto;
        dataTable.push(
          new CosteosIndividualReporteData(
            `Costo antes de comisión`,
            costoAntescomision
          )
        );
        let comisionVentas =
          (parseFloat(empresa.salesCommission) / 100) * costoAntescomision;
        dataTable.push(
          new CosteosIndividualReporteData(`Comisión ventas %`, comisionVentas)
        );
        let precioVentaAntesIVA = comisionVentas + costoAntescomision;
        dataTable.push(
          new CosteosIndividualReporteData(
            `Precio de venta antes de IVA`,
            precioVentaAntesIVA
          )
        );
        cb(dataTable);
      });
    });
  });
}
