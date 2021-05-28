import { GetAllDistribucionesDirectas } from "../get_all_distribuciones/GetAllDistribucionesDirectas.js";

export async function GetAllDistribucionesDirectasRedistribuidas() {
  const distribuciones = await GetAllDistribucionesDirectas();
  const otrasDistribuciones = [];
  const distribucionesProcesosInternos = distribuciones.filter((dist) => {
    if (dist.isProcesoInterno) {
      return true;
    } else {
      otrasDistribuciones.push(dist);
      return false;
    }
  });

  const porcentajeADistribuir =
    distribucionesProcesosInternos.reduce((totalPorcentaje, dist) => {
      return totalPorcentaje + parseFloat(dist.porcentaje);
    }, 0) / otrasDistribuciones.length;

  const valorMinutoADistribuir =
    distribucionesProcesosInternos.reduce((totalVAsignado, dist) => {
      return totalVAsignado + parseFloat(dist.valorMinuto);
    }, 0) / otrasDistribuciones.length;

  return otrasDistribuciones.map((dist) => {
    dist.porcentaje =
      parseFloat(dist.porcentaje) + parseFloat(porcentajeADistribuir);
    dist.valorMinuto =
      parseFloat(dist.valorMinuto) + parseFloat(valorMinutoADistribuir);
    return dist;
  });
}
