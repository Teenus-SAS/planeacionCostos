import { OnClickDeleteProductoSelectedReporte } from "./events/OnClickDeleteProductoSelectedReporte.js";

export class ProductosSelectedReporteDataTable {
  constructor(data) {
    this.data = data;

    this.dataTableProductosReporte = $(
      "#productos-reporte-jquery-datatable"
    ).dataTable({
      scrollCollapse: true,
      ordering: true,
      pageLength: 5,
      language: {
        url: "/vendor/dataTables/Spanish.json",
      },
      data,
      columns: [
        {
          data: "ref",
          render: (data, type, row) => {
            return `<span>${data}</span>`;
          },
        },
        {
          data: "name",
          render: function (data, type, row) {
            return `<span>${data}</span>`;
          },
        },
        {
          data: "cantidad",
          render: function (data, type, row) {
            return `<span>${data}</span>`;
          },
        },
        {
          data: "recuperacion",
          render: function (data) {
            return `<span class="text-right">${data}%</span>`;
          },
        },
        {
          data: null,
          render: function (data) {
            return `<a href='#' style="margin-left: 1rem;">
            <i id="${data.ref}" class='nc-icon nc-simple-remove link-borrar-producto-reporte-pprocesos' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'>
            </i>
                    </a>`;
          },
        },
      ],
      reponsive: true,
    });
    this.dataTableProductosReporte.width("100%");
    this.reload();
  }

  delete(ref) {
    OnClickDeleteProductoSelectedReporte(ref, this.data, (newData) => {
      this.data = newData;
      this.reload();
    });
  }

  reload(newData = null) {
    this.dataTableProductosReporte.api().clear().draw();
    if (newData) {
      this.dataTableProductosReporte.api().rows.add(newData);
    } else {
      this.dataTableProductosReporte.api().rows.add(this.data);
    }
  }
}
