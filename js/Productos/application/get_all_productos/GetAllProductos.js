export function GetAllProductos(cb) {
  $.get(
    "/app/products/api/get_products.php?expenses=true&process=true&materials=true",
    (_products, status) => {
      cb(_products);
    }
  );
}
