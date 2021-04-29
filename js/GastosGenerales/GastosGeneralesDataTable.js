import {
  DataTable,
  ColumnType,
} from "../../node_modules/elegant-crud-datatable/build/DataTable.js";

export class GastosGeneralesDataTable extends DataTable {
  constructor(data, createOptions) {
    super(
      [
        {
          header: { name: "Cuenta" },
          body: {
            classes: ["font-normal"],
          },
        },
        {
          header: { name: "Descripción" },
          body: {
            classes: ["pl-4", "text-left"],
          },
        },
        {
          header: { name: "Monto", type: "number" },
          body: {
            classes: ["text-right"],
            dataParser: (data2) =>
              PriceParser.toString(Number(data2), true, 2).strPrice,
          },
        },
        {
          header: { name: ColumnType.ACTIONS, classes: ["border-transparent"] },
          body: {
            classes: null,
          },
        },
      ],
      data,
      {
        table: ["bg-color"],
      },
      createOptions
    );
  }
}
