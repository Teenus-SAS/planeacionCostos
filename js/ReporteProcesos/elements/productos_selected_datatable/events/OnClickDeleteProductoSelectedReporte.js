export function OnClickDeleteProductoSelectedReporte(ref, productosList, cb) {
  bootbox.confirm({
    title: "Descartar producto",
    message: `¿Está seguro de eliminar el producto con referencia <b>${ref}</b>?.  Esta acción no se puede deshacer`,
    buttons: {
      confirm: {
        label: '<i class="fa fa-check"></i> Si',
        className: "btn-danger",
      },
      cancel: {
        label: '<i class="fa fa-times"></i> No',
        className: "btn-info",
      },
    },
    callback: function (result) {
      if (result == true) {
        cb(productosList.filter((producto) => producto.ref != ref));
      }
    },
  });
}
