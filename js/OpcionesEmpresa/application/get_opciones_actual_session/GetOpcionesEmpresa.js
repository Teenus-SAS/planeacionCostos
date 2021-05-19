export function GetOpcionesEmpresa(cb) {
  $.get("/app/products/api/get_opciones_empresa.php", function (opciones) {
    cb(opciones);
  });
}
