import { GetProductoById } from "../../../Productos/application/get_producto_by_id/GetProductoById.js";
import { ProductoSelected } from "./definitions/ProductoSelected.js";
import { OnClickDeleteProductoSelectedReporte } from "./events/OnClickDeleteProductoSelectedReporte.js";

export class ProductosSelectedReporteDataTable {
  constructor(data = []) {
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
          data: "referencia",
          render: (data, type, row) => {
            return `<span>${data}</span>`;
          },
        },
        {
          data: "nombre",
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
          data: "margen",
          render: function (data) {
            return `<span class="text-right">${data}%</span>`;
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
            <i id="${data.referencia}" class='nc-icon nc-simple-remove link-borrar-producto-reporte-pprocesos' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'>
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

  async delete(ref, needConfirmation = true) {
    const { newData, productRemoved } =
      await OnClickDeleteProductoSelectedReporte(
        ref,
        this.data,
        needConfirmation
      );
    this.data = newData;
    this.reload();
    return productRemoved;
  }

  async clear() {
    const products = this.data;

    this.data = [];
    this.reload();

    return products;
  }

  async addProduct(productoId, cantidad, margen, recuperacion, pdfData) {
    const producto = await GetProductoById(productoId);
    if (!producto) {
      return;
    }
    const productoSelected = new ProductoSelected(
      producto.ref,
      producto.name,
      parseFloat(cantidad),
      margen,
      parseFloat(recuperacion),
      pdfData
    );

    const productoInData = this.checkIfProductExists(productoSelected);
    if (!productoInData) {
      this.data.push(productoSelected);
    } else {
      return false;
    }

    this.reload();
    return productoSelected;
  }

  checkIfProductExists(producto) {
    return this.data.find(
      (product) => product.referencia == producto.referencia
    );
  }

  reload(newData = null) {
    this.dataTableProductosReporte.api().clear().draw();
    if (newData) {
      this.dataTableProductosReporte.api().rows.add(newData).draw();
    } else {
      this.dataTableProductosReporte.api().rows.add(this.data).draw();
    }
  }

  disabledDeleteOption(disabled = true) {
    if (disabled) {
      this.dataTableProductosReporte.api().column(5).visible(false);
    } else {
      this.dataTableProductosReporte.api().column(5).visible(true);
    }
  }
}
