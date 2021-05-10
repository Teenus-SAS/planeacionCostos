import { DataTable } from "../../../../node_modules/elegant-crud-datatable/build/DataTable.js";
import { DataTableColumnDefinition } from "../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnDefinition.js";
import { DataTableColumnHeader } from "../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnHeader.js";
import { DataTableColumnBody } from "../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnBody.js";
import { IndividualReporteProductoProcesoData } from "./definitions/IndividualReporteProductoProcesoData.js";

const columnDefinitions = [
  new DataTableColumnDefinition(
    new DataTableColumnHeader("Proceso", { content: [""] }),
    new DataTableColumnBody(
      undefined,
      { content: ["font-normal", "text-blue-900"], cell: ["text-left"] },
      6
    )
  ),
  new DataTableColumnDefinition(
    new DataTableColumnHeader("Minutos"),
    new DataTableColumnBody(undefined, {}, 250)
  ),
  new DataTableColumnDefinition(
    new DataTableColumnHeader("Costo/min"),
    new DataTableColumnBody(
      (data) => PriceParser.toString(data, true).strPrice,
      { cell: ["text-right", "pr-2"] },
      250
    )
  ),
  new DataTableColumnDefinition(
    new DataTableColumnHeader("Total"),
    new DataTableColumnBody(
      (data) => PriceParser.toString(data, true).strPrice,
      { cell: ["text-right"] },
      250
    )
  ),
];

export class IndividualReporteProductoProcesoDataTable extends DataTable {
  constructor(divId, data, createOptions) {
    super(columnDefinitions, data, createOptions, {
      table: ["bg-ligth"],
    });
    this.divId = divId;
  }

  show() {
    $("#reporte-procesos-content").attr("hidden", false);
    document.getElementById("reporte-procesos-content").scrollIntoView();
  }

  hide() {
    $("#reporte-procesos-content").attr("hidden", "true");
    document.getElementById("main-panel-content").scrollIntoView();
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
        return IndividualReporteProductoProcesoData.fromJSON(row);
      })
    );
  }
}
