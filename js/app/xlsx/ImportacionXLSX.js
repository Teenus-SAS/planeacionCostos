import { SubidaExcel } from "./SubidaExcel.js";
import { BajadaExcel } from "./BajadaExcel.js";

export class ImportacionXLSX {
  constructor(
    endpoint,
    formato,
    documentName,
    sheetName,
    columns,
    inputFile,
    verifyColumnscb,
    downloadDatacb = (data) => data,
    uploadDatacb = (data) => data
  ) {
    this.endpoint = endpoint;

    this.subidaExcel = new SubidaExcel(
      inputFile,
      sheetName,
      columns,
      verifyColumnscb,
      uploadDatacb
    );

    this.bajadaExcel = new BajadaExcel(
      documentName,
      sheetName,
      formato,
      columns,
      endpoint,
      downloadDatacb
    );
  }
}
