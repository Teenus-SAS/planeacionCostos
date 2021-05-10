export class InfoNuevoReporteProductoProcesoForm {
  fill(consecutivo, cliente, ciudad) {
    $("#input-consecutivo-reporte").val(consecutivo);
    $("#input-cliente-reporte").val(cliente);
    $("#input-ciudad-reporte").val(ciudad);
  }

  clearForm() {
    $("#input-consecutivo-reporte").val("");
    $("#input-cliente-reporte").val("");
    $("#input-ciudad-reporte").val("");
  }

  disabledForm() {
    $("#input-consecutivo-reporte").attr("readonly", "true");
    $("#input-cliente-reporte").attr("readonly", "true");
    $("#input-ciudad-reporte").attr("readonly", "true");
    $("#generar-pdf-reporte-procesos").attr("disabled", "true");
  }

  activeForm() {
    this.clearForm();
    $("#input-consecutivo-reporte").attr("readonly", false);
    $("#input-cliente-reporte").attr("readonly", false);
    $("#input-ciudad-reporte").attr("readonly", false);
    $("#generar-pdf-reporte-procesos").attr("disabled", false);
  }
}
