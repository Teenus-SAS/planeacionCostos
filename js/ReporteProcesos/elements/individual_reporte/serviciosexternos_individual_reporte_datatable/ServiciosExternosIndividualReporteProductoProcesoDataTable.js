import { DataTable } from "../../../../../node_modules/elegant-crud-datatable/build/DataTable.js";
import { DataTableColumnDefinition } from "../../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnDefinition.js";
import { DataTableColumnHeader } from "../../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnHeader.js";
import { DataTableColumnBody } from "../../../../../node_modules/elegant-crud-datatable/build/DataTableColumn/DataTableColumnBody.js";
import { ServiciosExternosIndividualReporteData } from "./data/ServiciosExternosIndividualReporteData.js";
import { DataTableSubgroupSeparator } from "../../../../../node_modules/elegant-crud-datatable/build/DataTableSubgroupSeparator.js";

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

  adicionarFromData(newData) {
    let previousState = this._data;
    let previousTotal = 0;

    if (this._subgroups[0]) {
      previousState = previousState.filter(
        (state) => !(state instanceof DataTableSubgroupSeparator)
      );
      previousTotal = PriceParser.fromString(
        this._subgroups[0]._title.replace("Total Servicios Externos:", ""),
        true
      ).price;
    }
    newData.forEach((value) => {
      const exists = previousState.find(
        (state) => state.concepto == value.concepto
      );
      if (exists) {
        exists.monto = parseFloat(exists.monto);
        exists.monto += parseFloat(value.monto);
      } else {
        previousState.push(value);
      }
      previousTotal += parseFloat(value.monto);
    });

    this._subgroups[0] = new DataTableSubgroupSeparator(
      "TotalServicios",
      `Total Servicios Externos: ${
        PriceParser.toString(previousTotal, true).strPrice
      }`,
      [],
      ["text-right", "pr-3"],
      undefined,
      "white"
    );
    previousState.push(this._subgroups[0]);

    this.setData(previousState);
  }

  removerFromData(dataForRemove) {
    let previousState = this._data;
    let previousTotal = 0;

    if (this._subgroups[0]) {
      previousState = previousState.filter(
        (state) => !(state instanceof DataTableSubgroupSeparator)
      );
      previousTotal = PriceParser.fromString(
        this._subgroups[0]._title.replace("Total Servicios Externos:", ""),
        true
      ).price;
    }
    dataForRemove.forEach((value) => {
      const exists = previousState.find(
        (state) => state.concepto == value.concepto
      );
      if (exists) {
        exists.monto = parseFloat(exists.monto);
        const montoPrev = parseFloat(value.monto);
        exists.monto -= montoPrev;
        previousTotal -= montoPrev;
      }
    });

    this._subgroups[0] = new DataTableSubgroupSeparator(
      "TotalServicios",
      `Total Servicios Externos: ${
        PriceParser.toString(previousTotal, true).strPrice
      }`,
      [],
      ["text-right", "pr-3"],
      undefined,
      "white"
    );
    previousState = previousState.filter((servicio) => servicio.monto);
    previousState.push(this._subgroups[0]);

    this.setData(previousState);
  }

  toJSON() {
    return JSON.stringify(this._data);
  }

  fromJSON(json) {
    this.adicionarFromData(
      JSON.parse(json)
        .filter((row) => !row._title)
        .map((row) => {
          return ServiciosExternosIndividualReporteData.fromJSON(row);
        })
    );
  }
}
