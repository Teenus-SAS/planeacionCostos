import { SubidaExcel } from "./SubidaExcel.js";
import { BajadaExcel } from "./BajadaExcel.js";

export class ImportacionXLSX {
  constructor(endpoint, formato, documentName, sheetName, columns, inputFile) {
    this.endpoint = endpoint;

    this.subidaExcel = new SubidaExcel(inputFile, sheetName, columns);

    bajadaExcel = new BajadaExcel(
      documentName,
      sheetName,
      formato,
      columns,
      endpoint
    );
  }
}
