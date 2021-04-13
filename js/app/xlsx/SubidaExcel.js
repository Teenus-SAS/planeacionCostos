export class SubidaExcel {
  constructor(reader, sheetName, excelColumns) {
    let data = new Uint8Array(reader.result);
    this.workbook = XLSX.read(data, { type: "array" });
    this.sheetName = sheetName;
    this.sheet = this.workbook.Sheets[sheetName];
    this.array = this.#cleanExcelCells(XLSX.utils.sheet_to_json(this.sheet));
    this.excelColumns = excelColumns;
    this.#verifyColumns();
  }

  verifySheetName(callback) {
    if (this.sheet != undefined) {
      return bootbox.confirm({
        title: "Carga masiva archivo Excel",
        message: `Los datos han sido procesados y estan listos para ser cargados`,
        buttons: {
          confirm: {
            label: '<i class="fa fa-check"></i> Continuar',
            className: "btn-success",
          },
          cancel: {
            label: '<i class="fa fa-times"></i> Cancelar',
            className: "btn-info",
          },
        },
        callback,
      });
    } else {
      $.dialog({
        title: "Alerta",
        type: "red",
        icon: "fas fa-warning",
        content:
          "<b>Este Archivo no cumple los formatos indicados:</b> <br>" +
          `No se encontró la hoja '${this.sheetName}' en el archivo Excel`,
      });
    }
  }

  #verifyColumns() {
    this.errors = [];
    this.array.forEach((cell) => {
      this.excelColumns.forEach((columnName) => {
        if (cell[columnName] == undefined) {
          this.errors.push({
            row: cell.__rowNum__ + 1,
            cell,
          });
        }
      });
    });
    this.#filterColumnsWithErrors();
  }

  #filterColumnsWithErrors() {
    this.array = this.array.filter((cell) => {
      const filaConError = this.errors.find((error) => error.cell == cell);
      return filaConError ? false : true;
    });
  }

  #cleanExcelCells(array) {
    let mapped = [];
    array.forEach((item) => {
      let keys = Object.keys(item);
      let cleaned = { rowNum: parseInt(item.__rowNum__) - 1 };
      keys.forEach((key) => {
        cleaned[key.trim()] =
          typeof item[key] == "string" ? item[key].trim() : item[key];
      });
      mapped.push(cleaned);
    });
    return mapped;
  }

  static resumenSubidaExcel(
    createdCount,
    updatedCount,
    errorsCount,
    stringType,
    pluralStringType
  ) {
    const updatedString = `<p>- Se ${
      updatedCount > 1 ? "han" : "ha"
    } <span style="color:blue">actualizado</span> ${updatedCount} ${
      updatedCount > 1 || updatedCount == 0 ? pluralStringType : stringType
    }.</p>`;
    const createdString = `<p>- Se ${
      createdCount > 1 ? "han" : "ha"
    } <span style="color:green">cargado</span> ${createdCount} ${
      createdCount > 1 || createdCount == 0 ? pluralStringType : stringType
    }.</p>`;
    const errorsString = `<p>- ${errorsCount} ${
      errorsCount > 1 ? "filas" : "fila"
    } <span style="color:red">con errores</span>.</p>`;

    return bootbox.dialog({
      title: "Resumen subida",
      message: `${createdCount > 0 ? createdString : ""}${
        updatedCount > 0 ? updatedString : ""
      }${errorsCount > 0 ? errorsString : ""}`,
    });
  }
}
