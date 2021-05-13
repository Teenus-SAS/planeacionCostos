import { GetAllMaquinas } from "../../../Maquina/application/get_all_maquinas/GetAllMaquinas.js";
import { GetMaquinasByProductoId } from "../../../Maquina/application/get_maquina_by_id/GetMaquinasByProductoId.js";

export function GetTotalCargasFabrilesByProductoId(productoId, cb) {
  $.get("/app/config-general/api/get_carga_fabril.php", (cargas) => {
    GetMaquinasByProductoId(productoId, (maquinas) => {
      cargas = cargas.filter((carga) =>
        maquinas.find((maq) => maq.id == carga.idMaquina)
      );
      let total = 0;
      cargas.forEach((carga) => {
        total += parseFloat(carga.costoPorMinuto);
      });
      maquinas.forEach((maquina) => {
        if (maquina) {
          total += parseFloat(maquina.depreciation);
        }
      });
      cb(total);
    });
  });
}
