/**
 * Teenus SAS
 * @github Teenus SAS
 * logica de máquinas
 */

elById("inlineRadio1M").click();
document
  .querySelector('a[href$="nomina-nav"]')
  .addEventListener("click", () => {
    resetFieldsRoster();
    elById("inlineRadio1M").click();
  });

// cargado de procesos de la base de datos
recargar_select();
function recargar_select() {
  $("#select-proceso").empty();
  $.get("api/get_processes.php", (processes, status) => {
    processes.forEach((process) => {
      $("#select-proceso").append(
        `<option value="${process.id}">${process.name}</option>`
      );
    });
  });
}
// cambio a formato numero
$("#input-bonificacion").number(true, 2);
$("#input-salario").number(true, 2);
$("#input-dotacion").number(true, 2);
$("#input-horas-extra").number(true, 2);

/// validadores
$.validator.addMethod(
  "decimalInput",
  function (value) {
    return /^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/.test(value);
  },
  "Máximo dos decimales"
);

//toggle
$("#panelCrearNomina").slideUp();
$("#panelImportarNomina").slideUp();

$("#btnCrearNomina").click(function (e) {
  e.preventDefault();
  $("#panelCrearNomina").toggle(1000);
  $("#panelImportarNomina").slideUp();
});

$("#btnImportarNomina").click(function (e) {
  e.preventDefault();
  $("#panelImportarNomina").toggle(1000);
  $("#panelCrearNomina").slideUp();
});

let nominasInfo = null;

$("input[name=optionNomina]").change(function () {
  if ($(this).val() == "option2") {
    $("#form-nomina").removeClass("was-validated");
    // desaparece el input
    /*  $('#input-cargo').fadeOut() */
    // guarda el padre del input
    /*   let $formGroupParent = $('#input-cargo').parent() */
    loadingSpinner();
    $.get("api/get_rosters.php", (data, status, xhr) => {
      completeSpinner();
      // se consulta las maquinas de esa empresa
      if (status == "success") {
        // se agregan todas las maquinas en un input select
        /*       let string = `<select id="input-cargo" class="custom-select" name="cargo" required><option selected disabled>Seleccione un Cargo</option>`
              data.forEach((roster) => {
                string += `<option value="${roster.id}">${roster.position}</option>`
              })
              string += '</select>'
              $formGroupParent.append(string) */
        // se quita el input de tipo de texto
        /*   $('#input-cargo').remove() */
        /*         $('#input-cargo').change(function () {
                  $('#form-nomina').validate()
                  let rosterSelected = data.filter(roster => roster.id == $(this).val())[0]
                  $('#select-proceso').val(rosterSelected.process.id)
                  $('#input-quantity-employees').val(parseInt(rosterSelected.numberEmployees))
                  $('#input-salario').val(parseFloat(rosterSelected.salary))
                  $('#input-bonificacion').val(parseFloat(rosterSelected.bonus))
                  $('#input-dotacion').val(parseFloat(rosterSelected.endowment))
                  $('#inputHorasTrabajo').val(parseInt(rosterSelected.workHours))
                  $('#inputDiasMes').val(parseInt(rosterSelected.bussinesDaysMonth))
                  $('#inputFP').val(parseFloat(rosterSelected.performaceFactor))
                  $(`input[name=optionFactorPrestacional][value=${rosterSelected.contract}]`).prop('checked', true)
                }) */
        /*    clearFieldsRoster() */
      } else {
        location = "/login";
      }
    });
  } else {
    /* if ($('#input-cargo')[0].tagName == 'SELECT') { */
    /*      let $formGroupParent = $('#input-cargo').parent()
         $('#input-cargo').fadeOut()
         $formGroupParent.append(`<input id="input-cargo" class="form-control" type="text" name="cargo" required> `)
         $('#input-cargo').remove() */
    clearFieldsRoster();

    resetFieldsRoster();

    /*     } */
  }
});

/*
 * peticion de salario
 * se hara un modal con el numero salarios colocados
 * y se sumaran para darle un valor general al salario
 */

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

/*
 * calculado de salarios acumulados
 */

$("#modalSalaryEmployees").on("hide.bs.modal", calculateSalaryTotal);

// bandera para saber si un salario de empleado supera los 10 salarios minimos
var flagPerformanceFactor = false;
function calculateSalaryTotal() {
  let salaryTotal = 0,
    bonusTotal = 0,
    dotacionTotal = 0,
    horasExtraTotal = 0;
  // se recorre todas las entradas de salario
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
      console.log(this.validity);
      console.log(this.validity.valid);
      console.log(this.validity.customError);
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

//calcular factor prestacional
$("input[name=optionFactorPrestacional]").change(function () {
  // si se quiere realizar el calculo manual
  if (!$("#checkboxCalculadoManualFP").prop("checked")) {
    // si el tipo de contrato es por nomina
    if ($(this).val() == "nomina") {
      if ($("#input-quantity-employees").val().length > 0) {
        if ($("#input-quantity-employees").val() == 1) {
          $("#inputFP").val(
            parseFloat($(this).val()) > minSalary * 10 ? 46.85 : 38.35
          );
        } else {
          $("#inputFP").val(!flagPerformanceFactor ? 38.35 : 46.85);
        }
      } else {
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "Registra una cantidad de empleados para este cargo",
          },
          {
            type: "warning",
            timer: 8000,
          }
        );
      }
    } else {
      $("#inputFP").val(0);
    }
  } else {
    $("#inputFP").val("");
  }
});

// eliminacion de clases de paddind para algunos inputs cuando hay cambios en pantalla
if ($(window).width() > 800) {
  $("#input-salario").parent().parent().addClass("pl-0");
  $("#input-quantity-employees").parent().addClass("pr-0");
} else {
  $("#input-salario").parent().parent().removeClass("pl-0");
  $("#input-quantity-employees").parent().removeClass("pr-0");
}

// inicializacion de datatable
var $tableNominas = $("#tableNominas").dataTable({
  scrollY: "500px",
  scrollCollapse: true,
  paging: false,

  language: {
    url: "/vendor/dataTables/Spanish.json",
  },
  responsive: true,
  ajax: {
    url: "api/get_rosters.php?dataTable=true",
    /*   dataSrc: 'data' */
    dataSrc: function (json) {
      //console.log(json.data);
      nominasInfo = json.data;
      return json.data;
    },
  },
  columnDefs: [{ targets: [4, 5], className: "text-right" }],
  columns: [
    { data: "position" },
    { data: "process.name" },
    { data: "numberEmployees" },
    /*   {data: 'contract'}, */
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
    var api = this.api(),
      data;

    // Remove the formatting to get integer data for summation
    var intVal = function (i) {
      return typeof i === "string"
        ? i.replace(/[\$,]/g, "") * 1
        : typeof i === "number"
        ? i
        : 0;
    };

    // Total over all pages
    total = api
      .column(4)
      .data()
      .reduce(function (a, b) {
        return intVal(a) + intVal(b);
      }, 0);

    // Total over this page
    pageTotal = api
      .column(4, { page: "current" })
      .data()
      .reduce(function (a, b) {
        return intVal(a) + intVal(b);
      }, 0);

    // Update footer
    $(api.column(4).footer()).html(
      //'$ '+pageTotal,

      `$ ${$.number(pageTotal, 2, ".", ",")}`
    );
  },
});
$tableNominas.width("100%");
/* $tableNominas.on('click', 'tr', function () {
  $(this).toggleClass('selected');
}) */

/* Borrar seleccion de tipos de contrato si se ha seleccionado manualmente */

/* $('#checkboxCalculadoManualFP').click(function (e) {
  e.preventDefault();
  $('#inlineRadioTipoContrato1').prop("checked", false);
  $('#inlineRadioTipoContrato2').prop("checked", false);
  $('.checkboxCalculadoManualFP').prop("checked", true);

}); */

$("#form-nomina").validate({
  rules: {
    cargo: "required",
    proceso: "required",
    Numeroempleados: "required",
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
    cargo: "Ingrese un cargo",
    proceso: "Ingrese un proceso",
    Numeroempleados: "Ingrese el numero de empleados",
    salario: "",
    horasTrabajo: {
      required: "Ingrese las horas de trabajo",
      min: "El número mínimo de horas es uno (1)",
      max: "El número máximo de horas es 18",
      //decimalInput: 'máximo dos decimales'
    },
    diasMes: {
      required: "Ingrese los días de trabajo",
      min: "El número de horas minimo es 1",
      max: "El número de horas maximo es de 31",
    },
    optionFactorPrestacional: "",
    factorPrestacional: {
      required: "Ingrese el factor prestacional",
      //decimalInput: 'máximo dos decimales'
    },
  },
  submitHandler: function (form) {
    let request = $(form).serialize();
    console.log(request);
    $.post("api/add_modify_rosters.php", request).always(function (xhr) {
      switch (xhr.status) {
        case 200:
          $.notify(
            {
              icon: "nc-icon nc-bell-55",
              message: "Nómina <b>Actualizada</b> Correctamente",
            },
            {
              type: "primary",
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
        case 412:
          $.notify(
            {
              icon: "nc-icon nc-bell-55",
              message:
                "<b>selecciona</b> una opción para <b>adicionar</b> o <b>modificar</b>",
            },
            {
              type: "warning",
              timer: 8000,
            }
          );
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

      elById("inlineRadioNom1").click();
      elById("nomina-btn").value = "Adicionar";
    });
  },
  focusCleanup: true,
  errorClass: "is-invalid",
  validClass: "is-valid",
});

// borrado de procesos
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
        /*   let rows = $tableNominas.api().rows('.selected').data()
         let count = 0, countAux = 0
         if (rows.length > 0) {
           for (let index = 0; index < rows.length; index++) { */

        $.post("api/delete_roster.php", {
          id: id,
        }).always(function (xhr) {
          /*   countAux++ */
          if (xhr.status == 200) {
            /*   count++ */
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
          /*         if (countAux == rows.length) {
                    $tableNominas.api().ajax.reload()
                    $.notify({
                      icon: "nc-icon nc-bell-55",
                      message: `Se ${count > 1 ? 'han' : 'ha'} borrado ${count} ${count > 1 ? 'nominas' : 'nomina'}`
                    }, {
                      type: 'info',
                      timer: 8000
                    })
                  } */
        });
        /*   } */
        /*   } else {
            $.notify({
              icon: "nc-icon nc-bell-55",
              message: `Selecciona al menos <b>1</b> nomina`
            }, {
              type: 'warning',
              timer: 8000
            })
          } */
      }
    },
  });
}

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

/**
 * Cuando se selecciona un checkbox de transporte
 * Este se le sumara o se le restara
 * El valor del subsidio de transporte
 */
function addListenerTrasportOption() {
  $(".transport-option").off("click");
  $(".transport-option").click(function () {
    let $input = $(this).parent().parent().siblings("input");

    if ($(this).is(":checked")) {
      $input.val(parseFloat($input.val()) + transport);
    } else {
      $input.val(parseFloat($input.val()) - transport);
    }
  });
}

elById("tableNominas").addEventListener("click", (ev) => {
  const selectedEl = ev.target;

  if (selectedEl.classList.contains("link-borrar")) {
    deleteNomina(selectedEl.dataset.nominaId);
  } else if (selectedEl.classList.contains("link-editar")) {
    /* 
        console.log(new FormData(elById('form-nomina'))); */
    const rowInfo = $tableNominas.fnGetData(selectedEl.closest("tr"));
    console.log($tableNominas.fnGetData(selectedEl.closest("tr")));
    const { process: proceso } = rowInfo;

    elById("input-cargo").value = rowInfo.position;
    elById("input-quantity-employees").value = rowInfo.numberEmployees;
    elById("input-salario").value = parseFloat(rowInfo.salary);
    $("#input-salario").number(true, 2);
    elById("input-bonificacion").value = rowInfo.bonus;
    $("#input-bonificacion").number(true, 2);
    elById("input-dotacion").value = rowInfo.endowment;
    $("#input-dotacion").number(true, 2);
    elById("input-horas-extra").value = rowInfo.extraHours;
    $("#input-horas-extra").number(true, 2);
    elById("inputHorasTrabajo").value = rowInfo.workHours;
    elById("inputDiasMes").value = rowInfo.bussinesDaysMonth;
    elById("inputFP").value = rowInfo.performaceFactor;
    elById("cargo-id").value = rowInfo.id;

    if (rowInfo.contract.trim() === "nomina") {
      elById("inlineRadioTipoContrato1").checked = true;
    } else {
      elById("inlineRadioTipoContrato2").checked = true;
    }

    Array.from(elById("select-proceso")).forEach((option) => {
      if (option.textContent.trim() === proceso.name) {
        option.selected = true;
        return true;
      } else {
        return false;
      }
    });

    elById("inlineRadioNom2").click();
    elById("nomina-btn").value = "Modificar";
  }
});

function resetFieldsRoster() {
  elById("input-cargo").value = "";
  elById("input-quantity-employees").value = "";
  elById("input-salario").value = "0.0";
  elById("input-bonificacion").value = "0.0";
  elById("input-dotacion").value = "0.0";
  elById("input-horas-extra").value = "0.0";
  elById("inputHorasTrabajo").value = "";
  elById("inputDiasMes").value = "";
  elById("inputFP").value = "0.0";
  elById("cargo-id").value = "";
}
