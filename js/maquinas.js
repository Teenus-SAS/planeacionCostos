/* 
@Author: Alexis Holguin
@github: MoraHol
logica de maquinas
*/


function clearformMachines() {
  if ($('#input-maquinas')[0].tagName == 'SELECT') {
    let $formGroupParent = $('#input-maquinas').parent()
    $('#input-maquinas').fadeOut()
    $('#input-price-machine').val('')
    $('#input-depreciation-machine').val('')
    $formGroupParent.append(`<input id="input-maquinas" class="form-control" type="text" name="machine"> `)
    $('#input-maquinas').remove()
  }
}
function clearFile(input) {
  $(input).val('')
}

$('input[name=optionMaquinas]').change(function () {
  $tableMaquinas.api().search('').draw();
  if ($(this).val() == 'option2') {
    // desaparece el input
    $('#input-maquinas').fadeOut()
    // guarda el padre del input
    let $formGroupParent = $('#input-maquinas').parent()
    $.get('api/get_machines.php', (data, status, xhr) => {
      // se consulta las maquinas de esa empresa
      if (status == 'success') {
        // se agregan todas las maquinas en un input select
        let string = `<select id="input-maquinas" class="form-control" name="machine">
        <option selected disabled>Seleccione una maquina</option>`
        machines = data
        data.forEach((machine) => {
          string += `<option value="${machine.id}">${machine.name}</option>`
        })
        string += '</select>'
        $formGroupParent.append(string)
        // se quita el input de tipo de texto
        $('#input-maquinas').remove()

        $('#input-maquinas').change(function () {
          let machineSelected = data.filter(machine => machine.id == $(this).val())[0]
          $('#input-price-machine').val(machineSelected.price)
          $('#input-depreciation-machine').val(parseFloat(machineSelected.depreciation))
          $('#input-years-depreciation').val(machineSelected.yearsDepreciation)
          $('#input-valor-residual').val(machineSelected.residualValue)
          $tableMaquinas.api().search(machineSelected.name).draw();
        })
      } else {
        location = '/login'
      }
    })
  } else {
    clearformMachines()
  }
})

// inicializacion de datatable para maquinas

// inicializacion de datatable
var $tableMaquinas = $('#table-maquinas').dataTable({
  language: {
    url: "/vendor/dataTables/Spanish.json"
  },
  ajax: {
    url: 'api/get_machines.php?dataTable=true',
    dataSrc: 'data'
  },
  columnDefs: [
    {
      targets: 0,
      className: 'text-left'
    },
    {
      targets: 1,
      className: 'text-right'
    },
    {
      targets: -1,
      className: 'text-right'
    }
  ],
  columns: [{
    "data": 'name',
    render: (data, type, row) => {
      return `<span class="name-left">${data}</span>`
    }
  },
  {
    "data": 'price',
    render: function (data, type, row) {
      return `$ ${$.number(data, 0, '.', ',')}`
    }
  },
  {
    "data": 'depreciation',
    render: function (data, type, row) {
      if (parseFloat(data) < 1) {
        /* return data */
        return $.number(data, 2, '.', ',')
      } else {
        return $.number(data, 2, '.', ',')
      }
    }
  }
  ],
  reponsive: true
})
$tableMaquinas.width('100%')
$tableMaquinas.on('click', 'tr', function () {
  $(this).toggleClass('selected');
})
// formulario para adicionar o modificar valores de una maquina

$('#form-maquinas').submit(function (e) {
  e.preventDefault()
  let request = $(this).serialize()
  request += `&depreciation=${$('#input-depreciation-machine').val()}`
  $.post('api/add_modify_machines.php', request)
    .always(function (xhr) {
      switch (xhr.status) {
        case 200:
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: "Maquina <b>Actualizada</b>"
          }, {
            type: 'primary',
            timer: 8000
          })
          $tableMaquinas.api().ajax.reload()
          break
        case 201:
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: "La Maquina ha sido <b>Creada</b> Correctamente"
          }, {
            type: 'success',
            timer: 8000
          })
          $tableMaquinas.api().ajax.reload()
          $('#form-maquinas')[0].reset()
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
            message: "Ha ocurrido un error mientras se creaba la maquina"
          }, {
            type: 'danger',
            timer: 8000
          })
          break
        case 401:
          location.href = "/login"
          break
        case 501:
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: "El precio no puede ser 0"
          }, {
            type: 'danger',
            timer: 8000
          })
          break
      }
    })
})






// borrado de maquinas
$('#delete-maquinas').click(() => {
  let rows = $tableMaquinas.api().rows('.selected').data()
  let count = 0
  if (rows.length > 0) {
    for (let index = 0; index < rows.length; index++) {
      $.post('api/delete_machine.php', {
        id: rows[index].id
      }).always(function (xhr) {
        if (xhr.status == 200) {
          count++
        } else {
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `La maquina <b>${rows[index].name}</b> esta asociado a uno o mas productos`
          }, {
            type: 'danger',
            timer: 8000
          })
        }

        if (count == rows.length) {
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `Se ${count > 1 ? 'han' : 'ha'} borrado ${count} ${count > 1 ? 'maquinas' : count == 0 ? 'maquinas' : 'maquina'}`
          }, {
            type: 'info',
            timer: 8000
          })
          $tableMaquinas.api().ajax.reload()
        }
      })
    }

  } else {
    $.notify({
      icon: "nc-icon nc-bell-55",
      message: `Selecciona al menos <b>1</b> máquina`
    }, {
      type: 'warning',
      timer: 8000
    })
  }
})
// calcular depreciacion con el cambio de precio
$('#input-price-machine').keyup(calulateDepreciation)
$('#input-years-depreciation').keyup(calulateDepreciation)
$('#input-years-depreciation').change(calulateDepreciation)
$('#input-valor-residual').keyup(calulateDepreciation)

function calulateDepreciation() {
  "use strict";

  let request = {
    price: $('#input-price-machine').val(),
    years: $('#input-years-depreciation').val(),
    residualValue: $('#input-valor-residual').val()
  }
  $.get('api/get_depreciation.php', request, (data, status) => {
    if (status == 'success') {
      if (parseFloat(data.depreciation) < 1) {
        let sum = 0
        for (let index = 0; index < data.depreciation.toString().length; index++) {
          sum += data.depreciation.toString().charAt(index) == '0' ? 1 : 0
        }
        sum += 3
        $('#input-depreciation-machine').val(Math.round10(parseFloat(data.depreciation), -(sum)))
      } else {
        $($('#input-depreciation-machine').val(Math.round10(parseFloat(data.depreciation), -2)))
      }
    } else {
      location.href = "/login"
    }
  })

}
// agreado de formato al input de precio
$('#input-price-machine').number(true, 2);
$('#input-valor-residual').number(true, 2);


function loadingSpinner() {
  $('#spinnerAjax').removeClass('fade')
}

function completeSpinner() {
  $('#spinnerAjax').addClass('fade')
}
