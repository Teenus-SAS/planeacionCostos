
/**
* @author Alexis Holguin
* @github MoraHol
* logica de máquinas
*/

// cargado de procesos de la base de datos
$.get('api/get_processes.php', (processes, status) => {
  processes.forEach((process) => {
    $('#select-proceso').append(`<option value="${process.id}">${process.name}</option>`)
  })
})

// cambio a formato numero
$('#input-bonificacion').number(true, 2)
$('#input-salario').number(true, 2)
$('#input-dotacion').number(true, 2)
$('#input-horas-extra').number(true, 2)



$('input[name=optionNomina]').change(function () {
  if ($(this).val() == 'option2') {
    $('#form-nomina').removeClass('was-validated')
    // desaparece el input
    $('#input-cargo').fadeOut()
    // guarda el padre del input
    let $formGroupParent = $('#input-cargo').parent()
    loadingSpinner()
    $.get('api/get_rosters.php', (data, status, xhr) => {
      completeSpinner()
      // se consulta las maquinas de esa empresa
      if (status == 'success') {
        // se agregan todas las maquinas en un input select
        let string = `<select id="input-cargo" class="custom-select" name="cargo" required><option selected disabled>Seleccione un Cargo</option>`
        data.forEach((roster) => {
          string += `<option value="${roster.id}">${roster.position}</option>`
        })
        string += '</select>'
        $formGroupParent.append(string)
        // se quita el input de tipo de texto
        $('#input-cargo').remove()

        $('#input-cargo').change(function () {
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
        })
        clearFieldsRoster()
      } else {
        location = '/login'
      }
    })
  } else {
    if ($('#input-cargo')[0].tagName == 'SELECT') {
      let $formGroupParent = $('#input-cargo').parent()
      $('#input-cargo').fadeOut()
      $formGroupParent.append(`<input id="input-cargo" class="form-control" type="text" name="cargo" required> `)
      $('#input-cargo').remove()
      clearFieldsRoster()
    }
  }
})

/* 
* peticion de salario 
 * se hara un modal con el numero salarios colocados
 * y se sumaran para darle un valor general al salario 
 */

$('#input-quantity-employees').keyup(function () {
  loadModalSalary($(this).val())
})
$('#input-quantity-employees').change(function () {
  loadModalSalary($(this).val())
})

function loadModalSalary(quantity) {
  if (quantity != undefined && quantity != "" && quantity.length > 0 && quantity > 1) {
    $('#form-salary-employees').html('')
    $('#checkbox-transport-total').fadeOut(400, function () {
      $(this).remove()
    })

    for (let index = 0; index < quantity; index++) {
      $('#form-salary-employees').append(`
      <div class="row">
      <div class="form-group col-md-3 col-6">
    <label for="recipient-name" >Salario trabajador ${index + 1}:</label>
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
  <label for="recipient-name">Horas extras trabajador ${index + 1}:</label>
  <div class="input-group">
  <div class="input-group-prepend">
  <span class="input-group-text">$</span>
  </div>
  <input type="text" class="form-control money-extra-hours" required>
  </div>
</div>
  <div class="form-group col-md-3 col-6">
  <label for="recipient-name">Bonificación trabajador ${index + 1}:</label>
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
  </div>`)
      if (index < (quantity - 1)) {
        $('#form-salary-employees').append('<hr>')
      }
    }
    // formateo de las entradas generadas 
    $('.money-salary').number(true, 2)
    $('.money-dotacion').number(true, 2)
    $('.money-bonus').number(true, 2)
    $('.money-extra-hours').number(true, 2)
    $('.money-dotacion').attr("max", minSalary * 2)
    addListenerTrasportOption()
    $('#modalSalaryEmployees').modal()

  } else if (quantity == 1 && $('#checkbox-transport-total').length < 1) {
    $('#input-salario').parent().append(`<div class="input-group-append" id="checkbox-transport-total">
    <div class="input-group-text">
      <input type="checkbox" title="Sumar subsidio de transporte" class="transport-option">
    </div>
    </div>`)
    addListenerTrasportOption()
  }
}


/*
* calculado de salarios acumulados
*/

$('#modalSalaryEmployees').on('hide.bs.modal', calculateSalaryTotal)

// bandera para saber si un salario de empleado supera los 10 salarios minimos
var flagPerformanceFactor = false
function calculateSalaryTotal() {
  let salaryTotal = 0, bonusTotal = 0, dotacionTotal = 0, horasExtraTotal = 0
  // se recorre todas las entradas de salario
  $('.money-salary').each(function () {
    salaryTotal += parseFloat($(this).val())

    if (!flagPerformanceFactor) {
      flagPerformanceFactor = parseFloat($(this).val()) > minSalary * 10 ? true : false
    }
  })
  // se recorre todas las entradas de dotacion
  $('.money-dotacion').each(function () {
    dotacionTotal += parseFloat($(this).val())
  })
  // se recorre todas las entradas de bonificacion
  $('.money-bonus').each(function () {
    bonusTotal += parseFloat($(this).val())
  })
  // se recorre todas las entradas de dotacion
  $('.money-extra-hours').each(function () {
    horasExtraTotal += parseFloat($(this).val())
  })
  $('#input-salario').val(salaryTotal)
  $('#input-bonificacion').val(bonusTotal)
  $('#input-dotacion').val(dotacionTotal)
  $('#input-horas-extra').val(horasExtraTotal)
  $('#input-salario').number(true, 2)
}
// quitado el recargo de pagina del formulario de salarios
$('#form-salary-employees-form').submit((e) => {
  e.preventDefault()
  $('#modalSalaryEmployees').modal('hide')
  calculateSalaryTotal()
})

$('#btn-calculate-salary').click(function () {
  let flag = true, flagF = true
  $('.money-dotacion').each(function () {
    let x = parseFloat($(this).val())
    if (parseFloat($(this).val()) > minSalary * 2) {
      this.validity.valid = false
      this.setCustomValidity('No puede ser mayor a 2 SMLV')
      flag = false
      return false;
    } else {
      this.setCustomValidity('')
      console.log(this.validity)
      console.log(this.validity.valid)
      console.log(this.validity.customError)
    }
  })

  $('.money-salary').each(function () {
    if (!this.checkValidity()) {
      flagF = false
      return false
    }
  })
  // se recorre todas las entradas de dotacion
  $('.money-dotacion').each(function () {
    if (!this.checkValidity()) {
      flagF = false
      return false
    }
  })
  // se recorre todas las entradas de bonificacion
  $('.money-bonus').each(function () {
    if (!this.checkValidity()) {
      flagF = false
      return false
    }
  })
  // se recorre todas las entradas de dotacion
  $('.money-extra-hours').each(function () {
    if (!this.checkValidity()) {
      flagF = false
      return false
    }
  })

  if (flag && flagF) {
    $('#form-salary-employees-form').submit()
  }
})
//cargado de salario desde json externo
var minSalary
var transport
$.get('api/salary_min.json', (data, status) => {
  minSalary = data.minSalary
  transport = data.transport
})

//calcular factor prestacional
$('input[name=optionFactorPrestacional]').change(function () {
  // si se quiere realizar el calculo manual
  if (!$('#checkboxCalculadoManualFP').prop('checked')) {
    // si el tipo de contrato es por nomina
    if ($(this).val() == 'nomina') {
      if ($('#input-quantity-employees').val().length > 0) {
        if ($('#input-quantity-employees').val() == 1) {
          $('#inputFP').val(parseFloat($(this).val()) > minSalary * 10 ? 46.85 : 38.35)
        } else {
          $('#inputFP').val(!flagPerformanceFactor ? 38.35 : 46.85)
        }
      } else {
        $.notify({
          icon: "nc-icon nc-bell-55",
          message: "Por favor registra una cantidad de empleados para este cargo"
        }, {
          type: 'warning',
          timer: 8000
        })
      }
    } else {
      $('#inputFP').val(0)
    }
  } else {
    $('#inputFP').val('')
  }

})

// quitado de calses de paddind para algunos inputs cuanodo hay cambios en pantalla
if ($(window).width() > 800) {
  $('#input-salario').parent().parent().addClass('pl-0')
  $('#input-quantity-employees').parent().addClass('pr-0')
} else {
  $('#input-salario').parent().parent().removeClass('pl-0')
  $('#input-quantity-employees').parent().removeClass('pr-0')
}

// inicializacion de datatable
var $tableNominas = $('#tableNominas').dataTable({
  language: {
    url: "/vendor/dataTables/Spanish.json"
  },
  responsive: true,
  ajax: {
    url: 'api/get_rosters.php?dataTable=true',
    dataSrc: 'data'
  },
  columnDefs: [
    {
      targets: [4, 5],
      className: 'text-right'
    }
  ],
  columns: [{
    data: 'position'
  },
  {
    data: 'process.name'
  },
  {
    data: 'numberEmployees'
  },
/*   {
    data: 'contract'
  }, */
  {
    data: 'salary',
    render: function (data, type, row) {
      return `$ ${$.number(data, 2, '.', ',')}`
    }
  },
  {
    data: 'netSalary',
    render: function (data, type, row) {
      return `$ ${$.number(data, 2, '.', ',')}`
    }
  },
  {
    data: 'minuteValue',
    render: function (data) {
      return `$ ${$.number(data,2, '.', ',')}`;
    }
  }
  ]
})
$tableNominas.width('100%')
$tableNominas.on('click', 'tr', function () {
  $(this).toggleClass('selected');
})



$('#form-nomina').validate({
  rules: {
    cargo: 'required',
    proceso: 'required',
    Numeroempleados: 'required',
    salario: 'required',
    horasTrabajo: {
      required: true,
      min: 1,
      max: 18
    },
    diasMes: {
      required: true,
      min: 1,
      max: 31
    },
    optionFactorPrestacional: 'required',
    factorPrestacional: 'required'
  },
  messages: {
    cargo: 'Ingrese un cargo',
    proceso: 'Ingrese un proceso',
    Numeroempleados: 'Ingrese el numero de empleados',
    salario: '',
    horasTrabajo: {
      required: 'Ingrese las horas de trabajo',
      min: 'El número de horas minimo es 1',
      max: 'El número de horas maximo es de 18'
    },
    diasMes: {
      required: 'Ingrese los días de trabajo',
      min: 'El número de horas minimo es 1',
      max: 'El número de horas maximo es de 31'
    },
    optionFactorPrestacional: '',
    factorPrestacional: ''
  },
  submitHandler: function (form) {
    let request = $(form).serialize()
    $.post('api/add_modify_rosters.php', request)
      .always(function (xhr) {
        switch (xhr.status) {
          case 200:
            $.notify({
              icon: "nc-icon nc-bell-55",
              message: "La Nomina ha sido <b>Actualizada</b> Correctamente"
            }, {
              type: 'primary',
              timer: 8000
            })
            $tableNominas.api().ajax.reload()
            $('#form-nomina')[0].reset()
            if ($('#input-cargo')[0].tagName == 'SELECT') {
              let $formGroupParent = $('#input-cargo').parent()
              $('#input-cargo').fadeOut()
              $formGroupParent.append(`<input id="input-cargo" class="form-control" type="text" name="cargo" required> `)
              $('#input-cargo').remove()
            }
            break
          case 201:
            $.notify({
              icon: "nc-icon nc-bell-55",
              message: "La Nomina ha sido <b>Creada</b> Correctamente"
            }, {
              type: 'success',
              timer: 8000
            })
            $tableNominas.api().ajax.reload()
            $('#form-nomina')[0].reset()
            break
          case 412:
            $.notify({
              icon: "nc-icon nc-bell-55",
              message: "Por favor <b>selecciona</b> una opcion para <b>adicionar</b> o <b>modificar</b>"
            }, {
              type: 'warning',
              timer: 8000
            })
            break
          case 400:
            $.notify({
              icon: "nc-icon nc-bell-55",
              message: "Por favor <b>Completa</b> Todos los campos"
            }, {
              type: 'warning',
              timer: 8000
            })
            break
          case 500:
            $.notify({
              icon: "nc-icon nc-bell-55",
              message: "No se puede Asignar dos nominas al mismo proceso"
            }, {
              type: 'danger',
              timer: 8000
            })
            break
          case 401:
            location.href = "/login"
            break
        }
      })
  },
  focusCleanup: true,
  errorClass: "is-invalid",
  validClass: 'is-valid'
})



// borrado de procesos
$('#delete-nomina').click(() => {
  let rows = $tableNominas.api().rows('.selected').data()
  let count = 0, countAux = 0
  if (rows.length > 0) {
    for (let index = 0; index < rows.length; index++) {
      $.post('api/delete_roster.php', {
        id: rows[index].id
      }).always(function (xhr) {
        countAux++
        if (xhr.status == 200) {
          count++
        }
        if (countAux == rows.length) {
          $tableNominas.api().ajax.reload()
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `Se ${count > 1 ? 'han' : 'ha'} borrado ${count} ${count > 1 ? 'nominas' : 'nomina'}`
          }, {
            type: 'info',
            timer: 8000
          })
        }
      })
    }
  } else {
    $.notify({
      icon: "nc-icon nc-bell-55",
      message: `Selecciona al menos <b>1</b> nomina`
    }, {
      type: 'warning',
      timer: 8000
    })
  }
})

function clearFieldsRoster() {
  $('#inputHorasTrabajo').val('')
  $('#inputDiasMes').val('')
  $('#input-dotacion').val('')
  $('#input-bonificacion').val('')
  $('#input-horas-extra').val('')
  $('#input-salario').val('')
  $('#inputFP').val('')
  $('#input-quantity-employees').val('')
}


/**
 * Cuando se selecciona un checkbox de transporte
 * Este se le sumara o se le restara
 * El valor del subsidio de transporte
 */
function addListenerTrasportOption() {
  $('.transport-option').off('click')
  $('.transport-option').click(function () {
    let $input = $(this).parent().parent().siblings('input')

    if ($(this).is(':checked')) {
      $input.val(parseFloat($input.val()) + transport)
    } else {
      $input.val(parseFloat($input.val()) - transport)
    }
  })
}

