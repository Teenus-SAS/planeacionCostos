import { OnClickDeleteReporteProductoProceso } from "./events/OnClickDeleteReporteProductoProceso.js";
import { OnClickDownloadReporteProductoProceso } from "./events/OnClickDownloadReporteProductoProceso.js";
import { OnClickViewReporteProductoProceso } from "./events/OnClickViewReporteProductoProceso.js";

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
        url: "/app/reportes/api/get_reportes_costeos_procesos.php?dataTable=true",
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
          data: null,
          render: function (data) {
            return `<a href='#' style="margin-left: 1rem;">
            <i id="${data.consecutivo}" class='nc-icon nc-zoom-split link-ver-reporte-pprocesos' data-toggle='tooltip' title='Ver' style='color:rgb(50, 0, 255)'>
            </i>
            <i id="${data.consecutivo}" class='nc-icon nc-cloud-download-93 link-descargar-reporte-pprocesos' data-toggle='tooltip' title='Descargar' style='color:rgb(20, 200, 55)'>
            </i>
            <i id="${data.consecutivo}" class='nc-icon nc-simple-remove link-borrar-reporte-pprocesos' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'>
            </i>
                    </a>`;
          },
        },
      ],
      reponsive: true,
    });
    this.dataTableReportes.width("100%");
  }

  async delete(consecutivo) {
    await OnClickDeleteReporteProductoProceso(consecutivo);
    this.reload();
  }

  async download(consecutivo) {
    return await OnClickDownloadReporteProductoProceso(consecutivo);
  }

  async view(consecutivo) {
    return await OnClickViewReporteProductoProceso(consecutivo);
  }

  reload() {
    this.dataTableReportes.api().ajax.reload();
  }
}
