import { GetMaquinasByProductoId } from "../../../Maquina/application/get_maquina_by_id/GetMaquinasByProductoId.js";

export function GetTotalCargasFabrilesByProductoId(productoId, procesos, cb) {
  $.get("/app/config-general/api/get_carga_fabril.php", (cargas) => {
    GetMaquinasByProductoId(productoId, (maquinas) => {
      let machineId = undefined;

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
      cb(total);
    });
  });
}
