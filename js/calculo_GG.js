/*
 * @Author: Teenus SAS
 * @github: Teenus-SAS
 *
 * Calculo y funcionalidad de gastos especificos
 */

let structure;

var field = `<div class="row align-content-center">
  <div class="col-2">
    <div class="form-group">
      <label for="my-input">Cuenta</label>
      <input id="my-input" class="form-control account" type="text" >
    </div>
  </div>
  <div class="col-8">
    <div class="form-group">
      <label for="my-input">Descripción</label>
      <input id="my-input" class="form-control description" type="text" >
    </div>
  </div>
  <div class="col-2">
    <div class="form-group">
      <label for="my-input">Monto</label>
      <input id="my-input" class="form-control amount" type="text" >
    </div>
  </div>
</div>`;

$(".amount").number(true, 2, ".", ",");

$("#btn_add_51").click(function () {
  $("#container-51").append(field);
  $(".amount").number(true, 2, ".", ",");
  $(".amount").keyup(calculateTotalsAccounts);
});
$("#btn_add_52").click(function () {
  $("#container-52").append(field);
  $(".amount").number(true, 2, ".", ",");
  $(".amount").keyup(calculateTotalsAccounts);
});
$("#btn_add_53").click(function () {
  $("#container-53").append(field);
  $(".amount").number(true, 2, ".", ",");
  $(".amount").keyup(calculateTotalsAccounts);
});
$("#btn_add_73").click(function () {
  $("#container-73").append(field);
  $(".amount").number(true, 2, ".", ",");
  $(".amount").keyup(calculateTotalsAccounts);
});
$("#btn_add_74").click(function () {
  $("#container-74").append(field);
  $(".amount").number(true, 2, ".", ",");
  $(".amount").keyup(calculateTotalsAccounts);
});

function calculateTotalsAccounts() {
  let sum = 0;
  total = 0;
  $("#container-51 .amount").each(function () {
    sum += parseFloat($(this).val());
    total = total + sum;
  });
  $("#sum-51").html(`$ ${$.number(sum, 2, ".", ",")}`);
  sum = 0;
  $("#container-52 .amount").each(function () {
    sum += parseFloat($(this).val());
    total = total + sum;
  });
  $("#sum-52").html(`$ ${$.number(sum, 2, ".", ",")}`);
  sum = 0;
  $("#container-53 .amount").each(function () {
    sum += parseFloat($(this).val());
    total = total + sum;
  });
  $("#sum-53").html(`$ ${$.number(sum, 2, ".", ",")}`);
  sum = 0;
  $("#container-73 .amount").each(function () {
    sum += parseFloat($(this).val());
    total = total + sum;
  });
  $("#sum-73").html(`$ ${$.number(sum, 2, ".", ",")}`);
  sum = 0;
  $("#container-74 .amount").each(function () {
    sum += parseFloat($(this).val());
    total = total + sum;
  });
  $("#sum-74").html(`$ ${$.number(sum, 2, ".", ",")}`);
  sum = 0;
  $(".sum-total").html(`$ ${$.number(total, 2, ".", ",")}`);
}

// evento para guardar
$("#btn_submit_GE").click(() => {
  saveGE();
});

function saveGE() {
  structure = {
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
    /* "71":
    {
      value: 0,
      accounts: []
    },
    "72":
    {
      value: 0,
      accounts: []
    }, */
    73: {
      value: 0,
      accounts: [],
    },
    74: {
      value: 0,
      accounts: [],
    },
  };

  sum = 0;
  $("#container-51 .row").each(function () {
    if (!isNaN(parseFloat($(this).find(".amount").val()))) {
      sum += parseFloat($(this).find(".amount").val());
      structure["51"].accounts.push({
        account: $(this).find(".account").val(),
        description: $(this).find(".description").val(),
        amount: parseFloat($(this).find(".amount").val()),
      });
    }
  });
  structure["51"].value = sum;
  sum = 0;
  $("#container-52 .row").each(function () {
    if (!isNaN(parseFloat($(this).find(".amount").val()))) {
      sum += parseFloat($(this).find(".amount").val());
      structure["52"].accounts.push({
        account: $(this).find(".account").val(),
        description: $(this).find(".description").val(),
        amount: parseFloat($(this).find(".amount").val()),
      });
    }
  });
  structure["52"].value = sum;
  sum = 0;
  $("#container-53 .row").each(function () {
    if (!isNaN(parseFloat($(this).find(".amount").val()))) {
      sum += parseFloat($(this).find(".amount").val());
      structure["53"].accounts.push({
        account: $(this).find(".account").val(),
        description: $(this).find(".description").val(),
        amount: parseFloat($(this).find(".amount").val()),
      });
    }
  });
  structure["53"].value = sum;
  sum = 0;
  $("#container-73 .row").each(function () {
    if (!isNaN(parseFloat($(this).find(".amount").val()))) {
      sum += parseFloat($(this).find(".amount").val());
      structure["73"].accounts.push({
        account: $(this).find(".account").val(),
        description: $(this).find(".description").val(),
        amount: parseFloat($(this).find(".amount").val()),
      });
    }
  });
  structure["73"].value = sum;
  sum = 0;
  $("#container-74 .row").each(function () {
    if (!isNaN(parseFloat($(this).find(".amount").val()))) {
      sum += parseFloat($(this).find(".amount").val());
      structure["74"].accounts.push({
        account: $(this).find(".account").val(),
        description: $(this).find(".description").val(),
        amount: parseFloat($(this).find(".amount").val()),
      });
    }
  });
  structure["74"].value = sum;
  structure.total =
    structure["74"].value +
    structure["73"].value +
    structure["53"].value +
    structure["52"].value +
    structure["51"].value;
  sum = 0;

  $.post("api/modify_expenses_description.php", {
    expensesDescription: JSON.stringify(structure),
    totalExpenses: structure.total,
  }).always((xhr) => {
    if (xhr.status == 200) {
      $.notify(
        {
          icon: "nc-icon nc-bell-55",
          message: `Informacion <b>Actualizada</b>`,
        },
        {
          type: "primary",
          timer: 8000,
        }
      );
    }
    loadMonthExpenses();
    $tableGastosMensuales.api().ajax.reload();
  });
}
loadExpensesGE();
function loadExpensesGE() {
  $.get("api/get_expenses_description.php", (data, status) => {
    $("#container-51").html("");
    $("#container-52").html("");
    $("#container-53").html("");
    $("#container-73").html("");
    $("#container-74").html("");
    data["51"].accounts.forEach((account) => {
      $("#container-51").append(`<div class="row align-content-center">
      <div class="col-2">
        <div class="form-group">
          <label for="my-input">Cuenta</label>
          <input id="my-input" class="form-control account" type="text" value="${account.account}">
        </div>
      </div>
      <div class="col-8">
        <div class="form-group">
          <label for="my-input">Descripción</label>
          <input id="my-input" class="form-control description" type="text" value="${account.description}">
        </div>
      </div>
      <div class="col-2">
        <div class="form-group">
          <label for="my-input">Monto</label>
          <input id="my-input" class="form-control amount" type="text" value="${account.amount}">
        </div>
      </div>
    </div>`);
    });
    data["52"].accounts.forEach((account) => {
      $("#container-52").append(`<div class="row align-content-center">
      <div class="col-2">
        <div class="form-group">
          <label for="my-input">Cuenta</label>
          <input id="my-input" class="form-control account" type="text" value="${account.account}">
        </div>
      </div>
      <div class="col-8">
        <div class="form-group">
          <label for="my-input">Descripción</label>
          <input id="my-input" class="form-control description" type="text" value="${account.description}">
        </div>
      </div>
      <div class="col-2">
        <div class="form-group">
          <label for="my-input">Monto</label>
          <input id="my-input" class="form-control amount" type="text" value="${account.amount}">
        </div>
      </div>
    </div>`);
    });
    data["53"].accounts.forEach((account) => {
      $("#container-53").append(`<div class="row align-content-center">
      <div class="col-2">
        <div class="form-group">
          <label for="my-input">Cuenta</label>
          <input id="my-input" class="form-control account" type="text" value="${account.account}">
        </div>
      </div>
      <div class="col-8">
        <div class="form-group">
          <label for="my-input">Descripción</label>
          <input id="my-input" class="form-control description" type="text" value="${account.description}">
        </div>
      </div>
      <div class="col-2">
        <div class="form-group">
          <label for="my-input">Monto</label>
          <input id="my-input" class="form-control amount" type="text" value="${account.amount}">
        </div>
      </div>
    </div>`);
    });
    data["73"].accounts.forEach((account) => {
      $("#container-73").append(`<div class="row align-content-center">
      <div class="col-2">
        <div class="form-group">
          <label for="my-input">Cuenta</label>
          <input id="my-input" class="form-control account" type="text" value="${account.account}">
        </div>
      </div>
      <div class="col-8">
        <div class="form-group">
          <label for="my-input">Descripción</label>
          <input id="my-input" class="form-control description" type="text" value="${account.description}">
        </div>
      </div>
      <div class="col-2">
        <div class="form-group">
          <label for="my-input">Monto</label>
          <input id="my-input" class="form-control amount" type="text" value="${account.amount}">
        </div>
      </div>
    </div>`);
    });
    data["74"].accounts.forEach((account) => {
      $("#container-74").append(`<div class="row align-content-center">
      <div class="col-2">
        <div class="form-group">
          <label for="my-input">Cuenta</label>
          <input id="my-input" class="form-control account" type="text" value="${account.account}">
        </div>
      </div>
      <div class="col-8">
        <div class="form-group">
          <label for="my-input">Descripción</label>
          <input id="my-input" class="form-control description" type="text" value="${account.description}">
        </div>
      </div>
      <div class="col-2">
        <div class="form-group">
          <label for="my-input">Monto</label>
          <input id="my-input" class="form-control amount" type="text" value="${account.amount}">
        </div>
      </div>
    </div>`);
    });
    calculateTotalsAccounts();
    $(".amount").number(true, 2, ".", ",");
    loadMonthExpenses();
    $(".amount").keyup(calculateTotalsAccounts);
  });
}
