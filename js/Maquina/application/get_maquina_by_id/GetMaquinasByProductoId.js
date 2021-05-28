import { GetProductosProcesosByProductoId } from "../../../ProductosProcesos/application/get_productos_procesos_by_producto_id/GetProductosProcesosByProductoId.js";

export async function GetMaquinasByProductoId(productoId) {
  const productosProcesos = await GetProductosProcesosByProductoId(productoId);

  let maquinasDelProducto = [];
  productosProcesos.forEach((prodProcess) => {
    if (prodProcess.machine) {
      maquinasDelProducto.push(prodProcess.machine);
    }
  });
  return maquinasDelProducto;
}
