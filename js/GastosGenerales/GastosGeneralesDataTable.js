import { DataTable } from "../../node_modules/elegant-crud-datatable/build/DataTable.js";
import { DataTableColumnType } from "../../node_modules/elegant-crud-datatable/build/DataTableColumnDefinition.js";

export class GastosGeneralesDataTable extends DataTable {
  constructor(data, createOptions) {
    super(
      [
        {
          header: { name: "Cuenta" },
          body: {
            classes: ["font-normal"],
            newDataLength: 6,
          },
        },
        {
          header: { name: "Descripción" },
          body: {
            classes: ["pl-4", "text-left"],
            newDataLength: 6,
          },
        },
        {
          header: { name: "Monto", type: "number" },
          body: {
            classes: ["text-right"],
            newDataLength: 6,
            dataParser: (data2) =>
              PriceParser.toString(Number(data2), true, 2).strPrice,
          },
        },
        {
          header: {
            name: DataTableColumnType.ACTIONS,
            classes: ["border-transparent"],
          },
          body: {
            classes: null,
          },
        },
      ],
      data,
      createOptions,
      {
        table: ["bg-color"],
      }
    );
  }
}
