export class SubidaExcel {
  constructor(
    inputFile,
    sheetName,
    columns,
    verifyColumnscb = () => {},
    uploadDatacb = (data) => data
  ) {
    this.reader = new FileReader();
    this.inputFile = inputFile;
    this.sheetName = sheetName;
    this.columns = columns;
    this.errorsCount = 0;
    this.verifyColumnscb = verifyColumnscb;
    this.uploadDatacb = uploadDatacb;
    this.errors = [];
  }

  onloadReader(cb, verifyColumns = null) {
    this.errors = [];
    this.#getReader(cb, verifyColumns);
    this.clearFile();
  }

  clearFile() {
    $(this.inputFile).val("");
    $(this.inputFile).siblings("label").text("Seleccionar Archivo");
  }

  #getReader(cb, verifyColumns = null) {
    const file =
      this.inputFile && this.inputFile.files ? this.inputFile.files[0] : null;
    if (file) {
      $(this.inputFile).siblings("label").text(file.name);
      this.reader.readAsArrayBuffer(file);
    }
    this.reader.onloadend = () => {
      this.workbook = XLSX.read(new Uint8Array(this.reader.result), {
        type: "array",
      });
      this.sheet = this.workbook.Sheets[this.sheetName];
      this.array = this.#cleanExcelCells(XLSX.utils.sheet_to_json(this.sheet));
      this.array = this.uploadDatacb(this.array);
      if (verifyColumns) {
        this.errors = verifyColumns(this.array);
      } else {
        this.#verifyColumns();
      }
      this.#filterColumnsWithErrors();
      cb();
    };
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
        callback: (result) => {
          if (result == true) {
            callback();
          } else {
            $.notify(
              {
                icon: "nc-icon nc-bell-55",
                message: `Proceso cancelado`,
              },
              {
                type: "info",
                timer: 8000,
              }
            );
            this.clearFile();
          }
        },
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
    this.array.forEach((cell) => {
      const verification = this.verifyColumnscb(cell);
      if (verification) {
        this.errors.push({
          type: verification.type || "",
          columnName: verification.columnName || "",
          row: cell.__rowNum__ || cell.rowNum,
          cell,
        });
      } else {
        Object.keys(this.columns).forEach((columnName) => {
          columnName = columnName.trim().toLowerCase().replaceAll(" ", "");
          if (cell[columnName] == undefined || verification) {
            this.errors.push({
              type: "undefined",
              columnName,
              row: cell.__rowNum__ || cell.rowNum,
              cell,
            });
          }
        });
      }
    });
  }

  #filterColumnsWithErrors() {
    const beforeLength = this.array.length;
    if (!this.errors.length) {
      return;
    }
    this.array = this.array.filter((cell) => {
      const filaConError = this.errors.find((error) => error.cell == cell);
      return filaConError ? false : true;
    });
    const afterLength = this.array.length;
    this.errorsCount = beforeLength - afterLength;
  }

  #cleanExcelCells(array) {
    let mapped = [];
    array.forEach((item) => {
      let keys = Object.keys(item);
      let cleaned = { rowNum: parseInt(item.__rowNum__) };
      keys.forEach((key) => {
        cleaned[key.trim().toLowerCase().replaceAll(" ", "")] =
          typeof item[key] == "string" ? item[key].trim() : item[key];
      });
      mapped.push(cleaned);
    });
    return mapped;
  }

  getResumenErrores() {
    let resumenErrores = '<ul style="">';
    this.errors.forEach((error) => {
      resumenErrores += `<li>${error.type}: '${
        error.cell[error.columnName]
      }' (fila: ${parseInt(error.row) + 1})</li>`;
    });

    return resumenErrores + "</ul>";
  }

  resumenSubida(
    createdCount,
    updatedCount,
    stringType,
    pluralStringType,
    fem = false
  ) {
    const isPlural = (count) => {
      return count > 1 || count === 0;
    };
    const pluralCreated = isPlural(createdCount);
    const pluralUpdated = isPlural(updatedCount);
    const pluralErrors = isPlural(this.errorsCount);
    const resumenErrores = this.getResumenErrores();

    const updatedString = `<p>${updatedCount} ${
      pluralUpdated ? pluralStringType : stringType
    } <span style="color:blue">${
      pluralUpdated
        ? fem
          ? "actualizadas"
          : "actualizados"
        : fem
        ? "actualizada"
        : "actualizado"
    }</span></p>`;
    const createdString = `<p>${createdCount} ${
      pluralCreated ? pluralStringType : stringType
    } <span style="color:green">${
      pluralCreated ? (fem ? "creadas" : "creados") : fem ? "creada" : "creado"
    }</span></p>`;
    const errorsString = `<p>${this.errorsCount} ${
      pluralErrors ? "filas" : "fila"
    } <span style="color:red">con errores:</span>
    ${resumenErrores}</p>`;

    return this.customMessageResumenSubida(
      `<div>${createdCount > 0 ? createdString : ""}${
        updatedCount > 0 ? updatedString : ""
      }${this.errorsCount > 0 ? errorsString : ""}</div>`
    );
  }

  customMessageResumenSubida(message) {
    return bootbox.dialog({
      title: "Resumen subida",
      message,
    });
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
