import { DataTable } from "../../../../../node_modules/elegant-crud-datatable/build/DataTable.js";
import { DataTableColumnDefinition } from "../../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnDefinition.js";
import { DataTableColumnHeader } from "../../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnHeader.js";
import { DataTableColumnBody } from "../../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnBody.js";
import { ServiciosExternosIndividualReporteData } from "./data/ServiciosExternosIndividualReporteData.js";

const columnDefinitions = [
  new DataTableColumnDefinition(
    new DataTableColumnHeader("Costos de Procesos", {
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
    new DataTableColumnHeader("Total", {
      content: [
        "text-normal",
        "border-transparent",
        "text-primary",
        "text-base",
        "font-bold",
      ],
    }),
    new DataTableColumnBody(
      (value) => PriceParser.toString(value, true).strPrice,
      { cell: ["text-right"] },
      250
    )
  ),
];

export class ServiciosExternosIndividualReporteProductoProcesoDataTable extends DataTable {
  constructor(divId, data, createOptions) {
    super(columnDefinitions, data, createOptions, {
      table: ["bg-ligth", "table", "dataTable"],
    });
    this.divId = divId;
  }

  setData(_data) {
    this._data = _data;
    this.toDiv(this.divId);
  }

  toJSON() {
    return JSON.stringify(this._data);
  }

  fromJSON(json) {
    this.setData(
      JSON.parse(json).map((row) => {
        return ServiciosExternosIndividualReporteData.fromJSON(row);
      })
    );
  }
}
