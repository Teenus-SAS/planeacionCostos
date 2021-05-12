import { GetProductosProcesosByProductoId } from "../../../ProductosProcesos/application/get_productos_procesos_by_producto_id/GetProductosProcesosByProductoId.js";

export function GetMaquinasByProductoId(productoId, cb) {
  GetProductosProcesosByProductoId(productoId, (productosProcesos) => {
    $.get("/app/config-general/api/get_machines.php", (maquina) => {
      let machines = [];
      productosProcesos.forEach((prodProcess) => {
        if (prodProcess.machine) {
          machines.push(prodProcess.machine);
        }
      });
      cb(machines);
    });
  });
}
