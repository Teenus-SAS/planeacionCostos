import { GetMaquinasByProductoId } from "../../../Maquina/application/get_maquina_by_id/GetMaquinasByProductoId.js";
import { GetAllCargasFabriles } from "../get_all_cargas_fabriles/GetAllCargasFabriles.js";

export async function GetTotalCargasFabrilesByProductoId(productoId, procesos) {
  const cargas = await GetAllCargasFabriles();
  const maquinas = await GetMaquinasByProductoId(productoId);

  let total = 0;
  procesos.forEach((proceso) => {
    let processTotal = 0;
    let maquina = maquinas.find((mach) => {
      if (proceso.machine) {
        return mach.id == proceso.machine.id;
      }
      return false;
    });
    if (maquina) {
      let cargasMaquina = cargas.filter(
        (carga) => maquina.id == carga.idMaquina
      );
      cargasMaquina.forEach((carga) => {
        processTotal += parseFloat(carga.costoPorMinuto);
      });
      processTotal += parseFloat(maquina.depreciation);
      processTotal *= parseFloat(proceso.timeOperacion);

      total += processTotal;
    }
  });
  return total;
}
