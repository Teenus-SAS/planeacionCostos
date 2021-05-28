import { GetAllProductos } from "../get_all_productos/GetAllProductos.js";

export async function GetProductoById(productoId) {
  const productos = await GetAllProductos();
  return productos.find((prod) => prod.id === productoId);
}
