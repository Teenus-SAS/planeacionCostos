import { GetAllProductos } from "../get_all_productos/GetAllProductos.js";

export function GetProductoById(productoId, cb) {
  GetAllProductos((products) => {
    if (products) {
      cb(products.find((prod) => prod.id === productoId));
    }
  });
}
