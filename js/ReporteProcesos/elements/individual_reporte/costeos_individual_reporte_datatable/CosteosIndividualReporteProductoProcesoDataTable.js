import { DataTable } from "../../../../../node_modules/elegant-crud-datatable/build/DataTable.js";
import { DataTableColumnDefinition } from "../../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnDefinition.js";
import { DataTableColumnHeader } from "../../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnHeader.js";
import { DataTableColumnBody } from "../../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnBody.js";
import { CosteosIndividualReporteData } from "./data/CosteosIndividualReporteData.js";

const columnDefinitions = [
  new DataTableColumnDefinition(
    new DataTableColumnHeader("Detalle", {
      content: ["text-2xl", "font-semibold"],
    }),
    new DataTableColumnBody(
      undefined,
      { content: [""], cell: ["text-left", "text-xl"] },
      6
    )
  ),
  new DataTableColumnDefinition(
    new DataTableColumnHeader("Total", {
      content: ["text-2xl", "font-semibold"],
    }),
    new DataTableColumnBody(
      (value) => PriceParser.toString(value, true, 0).strPrice,
      { cell: ["text-right", "text-xl"], content: ["font-semibold"] },
      250
    )
  ),
];

export class CosteosIndividualReporteProductoProcesoDataTable extends DataTable {
  constructor(divId, data, createOptions) {
    super(columnDefinitions, data, createOptions, {
      table: ["bg-ligth"],
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
        return CosteosIndividualReporteData.fromJSON(row);
      })
    );
  }
}
