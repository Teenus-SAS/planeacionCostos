import { DataTable } from "../../../../node_modules/elegant-crud-datatable/build/DataTable.js";
import { DataTableColumnDefinition } from "../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnDefinition.js";
import { DataTableColumnHeader } from "../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnHeader.js";
import { DataTableColumnBody } from "../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnBody.js";

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
    new DataTableColumnHeader("Maquina", { content: [""] }),
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
  constructor(data, createOptions) {
    super(columnDefinitions, data, createOptions, {
      table: ["bg-ligth"],
    });
  }
}
