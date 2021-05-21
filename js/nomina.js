// import { verifySettedConfiguration } from "./OpcionesEmpresa/application/verify_setted_configuration/verifySettedConfiguration.js";

// verifySettedConfiguration("tabNomina");
$("#inputFP").prop("readonly", true);

let addModifyPanelOpen = false;

elById("inlineRadio1M").click();
document
  .querySelector('a[href$="nomina-nav"]')
  .addEventListener("click", () => {
    resetFieldsRoster();
    elById("inlineRadio1M").click();
  });
$("#select-proceso").focus(() => {
  recargar_select();
});
function recargar_select() {
  $("#select-proceso").empty();
  $.get("api/get_processes.php", (processes, status) => {
    $("#select-proceso").append(
      `<option value="0" selected="true" disabled>Seleccione un proceso</option>`
    );
    processes
      .sort((processA, processB) =>
        processA.name < processB.name
          ? -1
          : processA.name > processB.name
          ? 1
          : 0
      )
      .forEach((process) => {
        $("#select-proceso").append(
          `<option value="${process.id}">${process.name}</option>`
        );
      });
  });
}
$("#input-bonificacion").number(true, 2);
$("#input-salario").number(true, 2);
$("#input-transporte").number(true, 2);
$("#input-dotacion").number(true, 2);
$("#input-horas-extra").number(true, 2);

$.validator.addMethod(
  "decimalInput",
  function (value) {
    return /^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/.test(value);
  },
  "Máximo dos decimales"
);

$("#panelCrearNomina").slideUp();
$("#panelImportarNomina").slideUp();

$("#btnCrearNomina").click(function (e) {
  e.preventDefault();
  $("#panelCrearNomina").toggle(1000);
  $("#panelImportarNomina").slideUp();
  addModifyPanelOpen = !addModifyPanelOpen;
  resetFieldsRoster();
});

$("#btnImportarNomina").click(function (e) {
  e.preventDefault();
  $("#panelImportarNomina").toggle(1000);
  $("#panelCrearNomina").slideUp();
});

$("input[name=optionNomina]").change(function () {
  if ($(this).val() == "option2") {
    $("#form-nomina").removeClass("was-validated");
    loadingSpinner();
    $.get("api/get_rosters.php", (data, status, xhr) => {
      if (status == "success") {
      } else {
        location = "/login";
      }
    });
    completeSpinner();
  } else {
    clearFieldsRoster();
    resetFieldsRoster();
  }
});

$("#input-quantity-employees").keyup(function () {
  loadModalSalary($(this).val());
});
$("#input-quantity-employees").change(function () {
  loadModalSalary($(this).val());
});

function loadModalSalary(quantity) {
  if (
    quantity != undefined &&
    quantity != "" &&
    quantity.length > 0 &&
    quantity > 1
  ) {
    $("#form-salary-employees").html("");
    $("#checkbox-transport-total").fadeOut(400, function () {
      $(this).remove();
    });

    for (let index = 0; index < quantity; index++) {
      $("#form-salary-employees").append(`
        <div class="row">
          <div class="form-group col-md-3 col-6">
            <label for="recipient-name" >Salario trabajador ${
              index + 1
            }:</label>
            <div class="input-group">
            <div class="input-group-prepend">
            <span class="input-group-text">$</span>
          </div>
          <input type="text" class="form-control money-salary" required value="0"> 
          <div class="input-group-append">
          <div class="input-group-text">
             <input type="checkbox" title="Sumar subsidio de transporte" class="transport-option">
          </div>
          </div>
          </div>
        </div>
        <div class="form-group col-md-3 col-6">
        <label for="recipient-name">Horas extras trabajador ${
          index + 1
        }:</label>
        <div class="input-group">
        <div class="input-group-prepend">
        <span class="input-group-text">$</span>
        </div>
        <input type="text" class="form-control money-extra-hours" required>
        </div>
      </div>
        <div class="form-group col-md-3 col-6">
        <label for="recipient-name">Bonificación trabajador ${
          index + 1
        }:</label>
        <div class="input-group">
        <div class="input-group-prepend">
        <span class="input-group-text">$</span>
        </div>
        <input type="text" class="form-control money-bonus" required>
        </div>
      </div>
      <div class="form-group col-md-3 col-6">
        <label for="recipient-name" >Dotación trabajador ${index + 1}:</label>
        <div class="input-group">
        <div class="input-group-prepend">
        <span class="input-group-text">$</span>
        </div>
        <input type="text" class="form-control money-dotacion" required>
        </div>
      </div>
        </div>`);
      if (index < quantity - 1) {
        $("#form-salary-employees").append("<hr>");
      }
    }
    // formateo de las entradas generadas
    $(".money-salary").number(true, 2);
    $(".money-dotacion").number(true, 2);
    $(".money-bonus").number(true, 2);
    $(".money-extra-hours").number(true, 2);
    $(".money-dotacion").attr("max", minSalary * 2);
    addListenerTrasportOption();
    $("#modalSalaryEmployees").modal();
  } else if (quantity == 1 && $("#checkbox-transport-total").length < 1) {
    $("#input-salario").parent()
      .append(`<div class="input-group-append" id="checkbox-transport-total">
    <div class="input-group-text">
      <input type="checkbox" title="Sumar subsidio de transporte" class="transport-option">
    </div>
    </div>`);
    addListenerTrasportOption();
  }
}

$("#modalSalaryEmployees").on("hide.bs.modal", calculateSalaryTotal);

// bandera para saber si un salario de empleado supera los 10 salarios minimos
var flagPerformanceFactor = false;
function calculateSalaryTotal() {
  let salaryTotal = 0,
    bonusTotal = 0,
    dotacionTotal = 0,
    horasExtraTotal = 0;
  $(".money-salary").each(function () {
    salaryTotal += parseFloat($(this).val());

    if (!flagPerformanceFactor) {
      flagPerformanceFactor =
        parseFloat($(this).val()) > minSalary * 10 ? true : false;
    }
  });
  // se recorre todas las entradas de dotacion
  $(".money-dotacion").each(function () {
    dotacionTotal += parseFloat($(this).val());
  });
  // se recorre todas las entradas de bonificacion
  $(".money-bonus").each(function () {
    bonusTotal += parseFloat($(this).val());
  });
  // se recorre todas las entradas de dotacion
  $(".money-extra-hours").each(function () {
    horasExtraTotal += parseFloat($(this).val());
  });
  $("#input-salario").val(salaryTotal);
  $("#input-bonificacion").val(bonusTotal);
  $("#input-dotacion").val(dotacionTotal);
  $("#input-horas-extra").val(horasExtraTotal);
  $("#input-salario").number(true, 2);
}
// quitado el recargo de pagina del formulario de salarios
$("#form-salary-employees-form").submit((e) => {
  e.preventDefault();
  $("#modalSalaryEmployees").modal("hide");
  calculateSalaryTotal();
});

$("#btn-calculate-salary").click(function () {
  let flag = true,
    flagF = true;
  $(".money-dotacion").each(function () {
    let x = parseFloat($(this).val());
    if (parseFloat($(this).val()) > minSalary * 2) {
      this.validity.valid = false;
      this.setCustomValidity("No puede ser mayor a 2 SMLV");
      flag = false;
      return false;
    } else {
      this.setCustomValidity("");
    }
  });

  $(".money-salary").each(function () {
    if (!this.checkValidity()) {
      flagF = false;
      return false;
    }
  });
  // se recorre todas las entradas de dotacion
  $(".money-dotacion").each(function () {
    if (!this.checkValidity()) {
      flagF = false;
      return false;
    }
  });
  // se recorre todas las entradas de bonificacion
  $(".money-bonus").each(function () {
    if (!this.checkValidity()) {
      flagF = false;
      return false;
    }
  });
  // se recorre todas las entradas de dotacion
  $(".money-extra-hours").each(function () {
    if (!this.checkValidity()) {
      flagF = false;
      return false;
    }
  });

  if (flag && flagF) {
    $("#form-salary-employees-form").submit();
  }
});

//cargado de salario desde json externo

var minSalary;
var transport;
$.get("api/salary_min.json", (data, status) => {
  minSalary = data.minSalary;
  transport = data.transport;
});

//Calcular factor prestacional

$("input[name=fpRadioB]").click(function () {
  idradio = this.id;

  let salario = $("#input-salario").val();

  if (salario === undefined || salario == 0) {
    $("#fpNomina").prop("checked", false);
    $("#fpServicios").prop("checked", false);
    $("#fpManual").prop("checked", false);

    return $.notify(
      {
        icon: "nc-icon nc-bell-55",
        message: "El salario no puede ser cero",
      },
      {
        type: "danger",
        timer: 4000,
      }
    );
  }

  if (idradio === "fpNomina") {
    $("#inputFP").val(parseFloat(salario) > minSalary * 10 ? 46.85 : 38.35);
    $("#optionFactorPrestacional").val("nomina");
    $("#inputFP").prop("readonly", true);
  }

  if (idradio === "fpServicios") {
    $("#inputFP").val(0);
    $("#optionFactorPrestacional").val("servicios");
    $("#inputFP").prop("readonly", true);
  }

  if (idradio === "fpManual") {
    $("#optionFactorPrestacional").val("manual");
    $("#inputFP").prop("readonly", false);
  }
});

// eliminacion de clases de padding para algunos inputs cuando hay cambios en pantalla
if ($(window).width() > 800) {
  $("#input-salario").parent().parent().addClass("pl-0");
  $("#input-quantity-employees").parent().addClass("pr-0");
} else {
  $("#input-salario").parent().parent().removeClass("pl-0");
  $("#input-quantity-employees").parent().removeClass("pr-0");
}

var $tableNominas = $("#tableNominas").dataTable({
  scrollCollapse: true,
  pageLength: 25,

  language: {
    url: "/vendor/dataTables/Spanish.json",
  },
  responsive: true,
  ajax: {
    url: "api/get_rosters.php?dataTable=true",
    dataSrc: function (json) {
      return json.data;
    },
  },
  columnDefs: [{ targets: [4, 5], className: "text-right" }],
  columns: [
    { data: "position" },
    { data: "process.name" },
    {
      data: "salary",
      render: function (data, type, row) {
        return `$ ${$.number(data, 2, ".", ",")}`;
      },
    },
    {
      data: "netSalary",
      render: function (data, type, row) {
        return `$ ${$.number(data, 2, ".", ",")}`;
      },
    },
    {
      data: "minuteValue",
      render: function (data) {
        return `$ ${$.number(data, 2, ".", ",")}`;
      },
    },
    {
      data: null,
      render: function (data) {
        return `<a href='#'><i data-nomina-id=${data.id} data-toggle='tooltip' title="Editar" class='nc-icon nc-refresh-69 link-editar' style='color:rgb(255, 165, 0)'></i></a><a href='#' style="margin-left: 1rem;"><i data-nomina-id=${data.id} class='nc-icon nc-simple-remove link-borrar' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'></i></a>`;
      },
    },
  ],

  footerCallback: function (row, data, start, end, display) {
    const api = this.api();

    const intVal = function (i) {
      return typeof i === "string"
        ? i.replace(/[\$,]/g, "") * 1
        : typeof i === "number"
        ? i
        : 0;
    };

    let processesSubtotals = [];

    const salarios = api.column(3).data();
    api
      .column(1)
      .data()
      .map((processName, index) => {
        const processExists = processesSubtotals.find(
          (process) => process.name === processName
        );
        if (!processExists) {
          processesSubtotals.push({
            name: processName,
            total: parseFloat(salarios[index]),
          });
        } else {
          processExists.total += parseFloat(salarios[index]);
        }
      });

    let total = api
      .column(3)
      .data()
      .reduce(function (a, b) {
        return intVal(a) + intVal(b);
      }, 0);

    let pageTotal = api
      .column(3, { page: "current" })
      .data()
      .reduce(function (a, b) {
        return intVal(a) + intVal(b);
      }, 0);

    let footer = "";
    processesSubtotals.forEach((processSubtotal) => {
      footer += `<p>Subtotal ${processSubtotal.name} $ ${$.number(
        processSubtotal.total,
        2,
        ".",
        ","
      )}</p>`;
    });
    let minutoTotal = api
      .column(4)
      .data()
      .reduce(function (a, b) {
        return intVal(a) + intVal(b);
      }, 0);
    let pageMinutoTotal = api
      .column(4, { page: "current" })
      .data()
      .reduce(function (a, b) {
        return intVal(a) + intVal(b);
      }, 0);
    footer += `</br><p class="text-right">Total Nómina $ ${$.number(
      total,
      2,
      ".",
      ","
    )}</p>`;

    $(api.column(3).footer()).html(footer);
  },
});

$tableNominas.api().ajax.reload();
$tableNominas.width("100%");

$("#form-nomina").validate({
  rules: {
    cargo: "required",
    proceso: "required",
    salario: "required",
    horasTrabajo: {
      required: true,
      min: 1,
      max: 18,
      decimalInput: true,
    },
    diasMes: {
      required: true,
      min: 1,
      max: 31,
    },
    optionFactorPrestacional: "required",
    factorPrestacional: {
      required: true,
      /*decimalInput: true*/
    },
  },
  messages: {
    cargo: "Ingrese el nombre o cargo del empleado",
    proceso: "Seleccione un proceso",
    //Numeroempleados: "Ingrese el numero de empleados",
    salario: "Ingrese el salario",
    horasTrabajo: {
      required: "<b>Ingrese las horas de trabajo</b>",
      min: "El número mínimo de horas es uno (1)",
      max: "El número máximo de horas es 18",
    },
    diasMes: {
      required: "Ingrese los días de trabajo",
      min: "El número mínimo de días es 1",
      max: "El número máximo de días es de 31",
    },
    optionFactorPrestacional: "",
    factorPrestacional: {
      required: "Ingrese el factor prestacional",
    },
  },
  submitHandler: function (form) {
    pf = $("input:radio[name=fpRadioB]:checked").val();
    if (!pf) {
      $.notify(
        {
          icon: "nc-icon nc-bell-55",
          message: "Seleccione el <b>Factor prestacional</b>",
        },
        {
          type: "danger",
          timer: 8000,
        }
      );
      return false;
    }
    let request = $(form).serialize();

    $.post("api/add_modify_rosters.php", request).always(function (xhr) {
      switch (xhr.status) {
        case 200:
          $.notify(
            {
              icon: "nc-icon nc-bell-55",
              message: "Nómina <b>Actualizada</b> Correctamente",
            },
            {
              type: "warning",
              timer: 8000,
            }
          );
          $tableNominas.api().ajax.reload();
          $("#form-nomina")[0].reset();
          /*       if ($('#input-cargo')[0].tagName == 'SELECT') {
                    let $formGroupParent = $('#input-cargo').parent()
                    $('#input-cargo').fadeOut()
                    $formGroupParent.append(`<input id="input-cargo" class="form-control" type="text" name="cargo" required> `)
                    $('#input-cargo').remove() */
          /*    } */
          break;
        case 201:
          $.notify(
            {
              icon: "nc-icon nc-bell-55",
              message: "Nómina <b>Creada</b> Correctamente",
            },
            {
              type: "success",
              timer: 8000,
            }
          );
          $tableNominas.api().ajax.reload();
          $("#form-nomina")[0].reset();
          break;
        case 400:
          $.notify(
            {
              icon: "nc-icon nc-bell-55",
              message: "<b>Completa</b> Todos los campos",
            },
            {
              type: "warning",
              timer: 8000,
            }
          );
          break;
        case 500:
          $.notify(
            {
              icon: "nc-icon nc-bell-55",
              message:
                "No se puede <b>Asignar</b> dos cargos de nómina al mismo proceso",
            },
            {
              type: "danger",
              timer: 8000,
            }
          );
          break;
        case 401:
          location.href = "/login";
          break;
      }

      //elById("inlineRadioNom1").click();
      elById("nomina-btn").value = "Adicionar";
    });
  },
  focusCleanup: true,
  errorClass: "is-invalid",
  validClass: "is-valid",
});

// borrado de Nomina

$("#delete-nomina").click(() => {
  let rows = $tableNominas.api().rows(".selected").data();
  let count = 0,
    countAux = 0;
  if (rows.length > 0) {
    for (let index = 0; index < rows.length; index++) {
      $.post("api/delete_roster.php", {
        id: rows[index].id,
      }).always(function (xhr) {
        countAux++;
        if (xhr.status == 200) {
          count++;
        }
        if (countAux == rows.length) {
          $tableNominas.api().ajax.reload();
          $.notify(
            {
              icon: "nc-icon nc-bell-55",
              message: `Se ${count > 1 ? "han" : "ha"} borrado ${count} ${
                count > 1 ? "nominas" : "nomina"
              }`,
            },
            {
              type: "info",
              timer: 8000,
            }
          );
        }
      });
    }
  } else {
    $.notify(
      {
        icon: "nc-icon nc-bell-55",
        message: `Selecciona mínimo<b>un registro</b> de la nómina`,
      },
      {
        type: "warning",
        timer: 8000,
      }
    );
  }
});

function clearFieldsRoster() {
  $("#inputHorasTrabajo").val("");
  $("#inputDiasMes").val("");
  $("#input-dotacion").val("");
  $("#input-bonificacion").val("");
  $("#input-horas-extra").val("");
  $("#input-salario").val("");
  $("#inputFP").val("");
  $("#input-quantity-employees").val("");
}

elById("tableNominas").addEventListener("click", (ev) => {
  const selectedEl = ev.target;

  if (selectedEl.classList.contains("link-borrar")) {
    deleteNomina(selectedEl.dataset.nominaId);
  } else if (selectedEl.classList.contains("link-editar")) {
    if (!addModifyPanelOpen) {
      $("#btnCrearNomina").trigger("click");
    }
    const rowInfo = $tableNominas.fnGetData(selectedEl.closest("tr"));
    ActualizarNomina(rowInfo);
  }

  /* Actualizacion Nomina */

  function ActualizarNomina(rowInfo) {
    const { process: proceso } = rowInfo;

    elById("input-cargo").value = rowInfo.position;
    elById("input-salario").value = parseFloat(rowInfo.salary);
    $("#input-salario").number(true, 2);

    elById("input-transporte").value = parseFloat(rowInfo.transporte);
    $("#input-transporte").number(true, 2);

    elById("input-bonificacion").value = rowInfo.bonus;
    $("#input-bonificacion").number(true, 2);

    elById("input-dotacion").value = rowInfo.endowment;
    $("#input-dotacion").number(true, 2);

    elById("input-horas-extra").value = rowInfo.extraHours;
    $("#input-horas-extra").number(true, 2);

    elById("inputHorasTrabajo").value = rowInfo.workHours;
    elById("inputDiasMes").value = rowInfo.bussinesDaysMonth;
    elById("inputFP").value = parseFloat(rowInfo.performaceFactor);
    elById("cargo-id").value = rowInfo.id;

    if (rowInfo.contract.trim() === "nomina") elById("fpNomina").checked = true;
    else if (rowInfo.contract.trim() === "servicios")
      elById("fpServicios").checked = true;
    else elById("fpManual").checked = true;

    Array.from(elById("select-proceso")).forEach((option) => {
      if (option.textContent.trim() === proceso.name) {
        option.selected = true;
        return true;
      } else {
        return false;
      }
    });

    elById("nomina-btn").value = "Actualizar";
  }
});

function deleteNomina(id) {
  bootbox.confirm({
    title: "Eliminar registros nómina",
    message: `¿Está seguro de eliminar este registro?.  Esta acción no se puede deshacer`,
    buttons: {
      confirm: {
        label: '<i class="fa fa-check"></i> Si',
        className: "btn-danger",
      },
      cancel: {
        label: '<i class="fa fa-times"></i> No',
        className: "btn-info",
      },
    },
    callback: function (result) {
      if (result == true) {
        $.post("api/delete_roster.php", {
          id: id,
        }).always(function (xhr) {
          if (xhr.status == 200) {
            $tableNominas.api().ajax.reload();
            $.notify(
              {
                icon: "nc-icon nc-bell-55",
                message: `Registro de nómina <b>eliminado</b> correctamente`,
              },
              {
                type: "info",
                timer: 8000,
              }
            );
          }
        });
      }
    },
  });
}

function resetFieldsRoster() {
  elById("input-cargo").value = "";
  elById("input-salario").value = "0.0";
  elById("input-bonificacion").value = "0.0";
  elById("input-dotacion").value = "0.0";
  elById("input-horas-extra").value = "0.0";
  elById("inputHorasTrabajo").value = "";
  elById("inputDiasMes").value = "";
  elById("inputFP").value = "0.0";
  elById("cargo-id").value = "";
}

function elById(id) {
  return document.getElementById(id);
}
