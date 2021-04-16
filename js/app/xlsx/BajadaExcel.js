export class BajadaExcel {
  constructor(
    documentName,
    sheetName,
    formato,
    columns,
    endpoint,
    datacb = (data) => data
  ) {
    this.documentName = documentName;
    this.sheetName = sheetName;
    this.formato = formato;
    this.workbook = XLSX.utils.book_new();
    this.workbook.Props = {
      Title: documentName,
      Subject: "Tezlik",
      Author: "Tezlik",
      CreatedDate: new Date(),
    };
    this.workbook.SheetNames.push(sheetName);
    this.endpoint = endpoint;
    this.columns = columns;
    this.datacb = datacb;
    this.#loadData();
  }

  #loadData(cb = () => {}) {
    let ws_data = [];
    $.get(this.endpoint, (data, status) => {
      data = this.datacb(data);
      data.forEach((item) => {
        const row = {};
        Object.keys(this.columns).forEach((columnName) => {
          const subs = this.columns[columnName].split(".");
          let dataColumn = item[subs[0]];
          subs.forEach((sub, index) => {
            if (index != 0) {
              dataColumn = dataColumn[sub];
            }
          });
          row[columnName] = dataColumn;
        });
        ws_data.push(row);
      });
      this.data = ws_data;
      cb(ws_data);
    });
  }

  download() {
    this.#loadData((data) => {
      if (data.length <= 0) {
        saveAs(this.formato, `Formato ${this.documentName}.xlsx`);
      } else {
        let ws = XLSX.utils.json_to_sheet(data);
        this.workbook.Sheets[this.sheetName] = ws;
        let wbout = XLSX.write(this.workbook, {
          bookType: "xlsx",
          type: "binary",
        });
        let wopts = { bookType: "xlsx", bookSST: false, type: "array" };
        wbout = XLSX.write(this.workbook, wopts);

        saveAs(
          new Blob([wbout], { type: "application/octet-stream" }),
          `${this.documentName}.xlsx`
        );
      }
    });
  }
}
