import { OnClickDeleteReporteProductoProceso } from "./events/OnClickDeleteReporteProductoProceso.js";

export class ReporteProductoProcesoDataTable {
  constructor() {
    this.dataTableReportes = $("#reportes-jquery-datatable").dataTable({
      scrollCollapse: true,
      ordering: true,
      pageLength: 5,
      language: {
        url: "/vendor/dataTables/Spanish.json",
      },
      ajax: {
        url:
          "/app/reportes/api/get_reportes_costeos_procesos.php?dataTable=true",
        dataSrc: "data",
      },
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
          data: "producto",
          render: function (data) {
            return `<span class="text-right">${data.name}</span>`;
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
    });
    this.dataTableReportes.width("100%");
  }

  delete(consecutivo) {
    OnClickDeleteReporteProductoProceso(consecutivo, () => {
      this.reload();
    });
  }

  reload() {
    this.dataTableReportes.api().ajax.reload();
  }
}
