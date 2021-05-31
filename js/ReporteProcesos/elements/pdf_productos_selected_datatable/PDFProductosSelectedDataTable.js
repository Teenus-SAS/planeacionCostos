import { DataTable } from "../../../../node_modules/elegant-crud-datatable/build/DataTable.js";
import { DataTableColumnDefinition } from "../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnDefinition.js";
import { DataTableColumnHeader } from "../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnHeader.js";
import { DataTableColumnBody } from "../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnBody.js";

const columnDefinitions = [
  new DataTableColumnDefinition(
    new DataTableColumnHeader("Ref", {
      content: [
        "text-normal",
        "border-transparent",
        "text-primary",
        "text-base",
        "font-bold",
      ],
    }),
    new DataTableColumnBody(
      undefined,
      { content: [""], cell: ["text-left"] },
      6
    )
  ),
  new DataTableColumnDefinition(
    new DataTableColumnHeader("Producto", {
      content: ["text-xl", "border-transparent", "text-transparent"],
    }),
    new DataTableColumnBody(
      undefined,
      { cell: ["text-right"], content: [] },
      250
    )
  ),
  new DataTableColumnDefinition(
    new DataTableColumnHeader("Cantidad", {
      content: [
        "text-normal",
        "border-transparent",
        "text-primary",
        "text-base",
        "font-bold",
      ],
    }),
    new DataTableColumnBody(
      undefined,
      { cell: ["text-right"], content: [] },
      250
    )
  ),
  new DataTableColumnDefinition(
    new DataTableColumnHeader("Margen Utilidad", {
      content: [
        "text-normal",
        "border-transparent",
        "text-primary",
        "text-base",
        "font-bold",
      ],
    }),
    new DataTableColumnBody(
      (data) => `${data}%`,
      { cell: ["text-right"], content: [] },
      250
    )
  ),
  new DataTableColumnDefinition(
    new DataTableColumnHeader("Recuperación", {
      content: [
        "text-normal",
        "border-transparent",
        "text-primary",
        "text-base",
        "font-bold",
      ],
    }),
    new DataTableColumnBody(
      (data) => `${data}%`,
      { cell: ["text-right"], content: [] },
      250
    )
  ),
];

export class PDFProductosSelectedDataTable extends DataTable {
  constructor(data, createOptions) {
    super(columnDefinitions, data, createOptions, {
      table: ["bg-ligth", "table", "dataTable"],
    });
    this.divId = "pdf-productos-selected";
    this.setData(data);
  }

  setData(_data) {
    this._data = _data;
    this.toDiv(this.divId);
  }
}
