export function GetAllGastosGenerales(cb) {
  $.get(
    "/app/products/api/get_distribuciones_directas.php",
    (distribuciones) => {
      cb(distribuciones);
    }
  );
}
