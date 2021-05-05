import { GetReportesProductoProceso } from "../get_reportes_producto_proceso/GetReportesProductoProceso.js";
export function ReporteProductoProcesoDataTable() {
  GetReportesProductoProceso((reportes) => {
    $("#reportes-jquery-datatable")
      .dataTable({
        scrollCollapse: true,
        ordering: true,
        pageLength: 25,
        language: {
          url: "/vendor/dataTables/Spanish.json",
        },
        data: reportes,
        columns: [
          {
            data: "consecutivo",
            render: (data, type, row) => {
              return `<span class="name-left">${data}</span>`;
            },
          },
          {
            data: "cliente",
            render: function (data, type, row) {
              return `<span class="name-left">${data}</span>`;
            },
          },
          {
            data: "creationDate",
            render: function (data, type, row) {
              return `<span class="name-left">${data}</span>`;
            },
          },
          {
            data: "idProducto",
            render: function (data) {
              return `<span class="text-right">${data}</span>`;
            },
          },
          {
            data: null,
            render: function (data) {
              return `<a href='#' style="margin-left: 1rem;"><i id=${data.consecutivo} class='nc-icon nc-simple-remove link-borrar-reporte-pprocesos' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'></i></a>`;
            },
          },
        ],
        reponsive: true,
      })
      .width("100%");
  });

  /* Eliminar carga fabril */
  $(document).on("click", ".link-borrar-reporte-pprocesos", function (event) {
    event.preventDefault();

    let consecutivo = this.id;

    bootbox.confirm({
      title: "Eliminar Reporte",
      message: `¿Está seguro de eliminar el reporte?.  Esta acción no se puede deshacer`,
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
        } else {
          return;
        }
      },
    });
  });
}
