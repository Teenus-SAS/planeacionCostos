import { ImportacionXLSX } from "./ImportacionXLSX.js";

const exportImportGastosGenerales = new ImportacionXLSX(
  "/app/config-general/api/get_expenses_description.php",
  "/formatos/formato-gastos-especificos.xlsx",
  "Gastos Generales",
  "Gastos Generales",
  {
    Cuenta: "account",
    Descripcion: "description",
    Monto: "amount",
  },
  $("#fileExpensesDescription"),
  () => {},
  (data) => {
    const mapped = [];
    if (data != null) {
      data["51"].accounts.forEach((account) => {
        mapped.push({
          account: account.account,
          description: account.description,
          amount: account.amount,
        });
      });
      data["52"].accounts.forEach((account) => {
        mapped.push({
          account: account.account,
          description: account.description,
          amount: account.amount,
        });
      });
      data["53"].accounts.forEach((account) => {
        mapped.push({
          account: account.account,
          description: account.description,
          amount: account.amount,
        });
      });
      data["73"].accounts.forEach((account) => {
        mapped.push({
          account: account.account,
          description: account.description,
          amount: account.amount,
        });
      });
      data["74"].accounts.forEach((account) => {
        mapped.push({
          account: account.account,
          description: account.description,
          amount: account.amount,
        });
      });
    }
    return mapped;
  },
  (data) => {
    let structure = {
      total: 0,
      51: {
        value: 0,
        accounts: [],
      },
      52: {
        value: 0,
        accounts: [],
      },
      53: {
        value: 0,
        accounts: [],
      },
      73: {
        value: 0,
        accounts: [],
      },
      74: {
        value: 0,
        accounts: [],
      },
    };
    let sum51 = 0,
      sum52 = 0,
      sum53 = 0,
      sum73 = 0,
      sum74 = 0;
    data.forEach((expense) => {
      let parentAccount = expense.cuenta.toString().substring(0, 2);
      switch (parentAccount) {
        case "51":
          structure["51"].accounts.push({
            account: expense.cuenta.toString(),
            description: expense.descripcion,
            amount: expense.monto,
          });
          sum51 += expense.monto;
          break;
        case "52":
          structure["52"].accounts.push({
            account: expense.cuenta.toString(),
            description: expense.descripcion,
            amount: expense.monto,
          });
          sum52 += expense.monto;
          break;
        case "53":
          structure["53"].accounts.push({
            account: expense.cuenta.toString(),
            description: expense.descripcion,
            amount: expense.monto,
          });
          sum53 += expense.monto;
          break;
        case "73":
          structure["73"].accounts.push({
            account: expense.cuenta.toString(),
            description: expense.descripcion,
            amount: expense.monto,
          });
          sum73 += expense.monto;
          break;
        case "74":
          structure["74"].accounts.push({
            account: expense.cuenta.toString(),
            description: expense.descripcion,
            amount: expense.monto,
          });
          sum74 += expense.monto;
          break;
        default:
          break;
      }
    });
    structure["51"].value = sum51;
    structure["52"].value = sum52;
    structure["53"].value = sum53;
    structure["73"].value = sum73;
    structure["74"].value = sum74;
    structure.total = sum51 + sum52 + sum53 + sum73 + sum74;

    return structure;
  }
);

$("#fileExpensesDescription").change(function () {
  const subidaExcelGastosGenerales = exportImportGastosGenerales.subidaExcel;
  subidaExcelGastosGenerales.inputFile = this;
  $("#spinnerAjax").removeClass("fade");
  subidaExcelGastosGenerales.onloadReader(
    () => {
      subidaExcelGastosGenerales.verifySheetName(() => {
        uploadExpenses(subidaExcelGastosGenerales);
      });
    },
    (data) => {
      return [];
    }
  );
  $("#spinnerAjax").addClass("fade");
});

function uploadExpenses(subidaExcel) {
  const expenses = subidaExcel.array;
  $.post(
    "api/modify_expenses_description.php",
    {
      totalExpenses: expenses.total,
      expensesDescription: JSON.stringify(expenses),
    },
    (data, status) => {
      if (status == "success") {
        subidaExcel.customMessageResumenSubida(
          "Se han <span style='color:blue'>actualizado correctamente</span> los <b>gastos generales</b>"
        );
      }
    }
  );
}

$("#download-description-expenses").click(() => {
  exportImportGastosGenerales.bajadaExcel.download();
});
