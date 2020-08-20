/* 
@Author: Alexis Holguin
@github: MoraHol
logica de procesos
*/


function clearFormProcess() {
  if ($('#input-proceso')[0].tagName == 'SELECT') {
    let $formGroupParent = $('#input-proceso').parent()
    $('#input-proceso').fadeOut()
    $('#input-name-process').parent().parent().parent().fadeOut().remove()
    $formGroupParent.append(`<input id="input-proceso" class="form-control" type="text" name="proceso"> `)
    $('#input-proceso').remove()
  }
}

function addSelectecFormProcces(data) {
  // se agregan todas las maquinas en un input select
  let string = `<select id="input-proceso" class="form-control" name="proceso"><option selected disabled>Seleccione un proceso</option>`
  data.forEach((process) => {
    string += `<option value="${process.id}">${process.name}</option>`
  })
  string += '</select>'
  $('#input-proceso').parent().append(string)
  // se quita el input de tipo de texto
  $('#input-proceso').remove()
}

// cambio entre adicionar y modificar
$('input[name=optionProceso]').change(function () {
  $tableProcesos.api().search('').draw();
  if ($(this).val() == 'option2') {
    // desaparece el input
    $('#input-proceso').fadeOut()
    // guarda el padre del input
    let $formGroupParent = $('#input-proceso').parent()
    loadingSpinner()
    $.get('api/get_processes.php', (data, status, xhr) => {
      completeSpinner()
      // se consulta las maquinas de esa empresa
      if (status == 'success') {
        addSelectecFormProcces(data)

        $formGroupParent.parent().parent().parent().append(`<div class="row my-1 justify-content-center">
        <div class="col-md-10">
          <div class="form-group">
            <label for="input-name-process">Nuevo Nombre Proceso</label>
            <input id="input-name-process" class="form-control" type="text" name="name_proceso" required>
          </div>
        </div>
      </div>`)
        $('#input-proceso').change(function () {
          let processSelected = data.filter(process => process.id == $(this).val())[0]
          $('#input-name-process').val(processSelected.name)
          $tableProcesos.api().search(processSelected.name).draw()
        })
      } else {
        location = '/login'
      }
    })
  } else {
    clearFormProcess()
  }
})

// inicializacion de datatable
var $tableProcesos = $('#table-procesos').dataTable({
  language: {
    url: "/vendor/dataTables/Spanish.json"
  },
  ajax: {
    url: 'api/get_processes.php?dataTable=true',
    dataSrc: 'data'
  },
  columnDefs: [{
    targets: 0,
    className: 'text-left'
  }],
  columns: [{
    data: 'name',
    render: (data, type, row) => {
      return data;
    }
  }
  ],
  reponsive: true
})
$tableProcesos.width('100%')
$tableProcesos.on('click', 'tr', function () {
  $(this).toggleClass('selected');
})


// formulario para adicionar o modificar valores de una maquina

$('#form-procesos').submit(function (e) {
  e.preventDefault()
  let request = $(this).serialize()
  $.post('api/add_modify_processes.php', request)
    .always(function (xhr) {
      switch (xhr.status) {
        case 200:
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: "El proceso ha sido <b>Actualizada</b> Correctamente"
          }, {
            type: 'primary',
            timer: 8000
          })
          $tableProcesos.api().ajax.reload()
          $('#input-proceso option:selected').text($('#input-name-process').val())
          break
        case 201:
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: "El proceso ha sido <b>Creada</b> Correctamente"
          }, {
            type: 'success',
            timer: 8000
          })
          $tableProcesos.api().ajax.reload()
          $('#form-procesos')[0].reset()
          $.get('api/get_processes.php', (data, status, xhr) => {
            addSelectecFormProcces(data)
          })
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
            message: "Este Proceso ya fue creado"
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
})

// borrado de procesos
$('#delete-process').click(() => {
  let rows = $tableProcesos.api().rows('.selected').data()
  var count = 0
  var countAux = 0
  if (rows.length > 0) {
    for (let index = 0; index < rows.length; index++) {
      $.post('api/delete_process.php', {
        id: rows[index].id
      }).always(function (xhr) {
        countAux++
        if (xhr.status == 200) {
          count++
        } else {
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `El proceso <b>${rows[index].name}</b> esta asociado a uno o mas productos. <br>
            O esta asociado a uno o mas nominas`
          }, {
            type: 'danger',
            timer: 8000
          })
        }
        if (countAux == rows.length) {
          $tableProcesos.api().ajax.reload()
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `Se ${count > 1 ? 'han' : 'ha'} borrado ${count} ${count > 1 ? 'procesos' : count == 0 ? 'procesos' : 'proceso'}`
          }, {
            type: 'info',
            timer: 8000
          })
        }
      })
    }
    $.get('api/get_processes.php', (data, status, xhr) => {
      addSelectecFormProcces(data)
    })
  } else {
    $.notify({
      icon: "nc-icon nc-bell-55",
      message: `Selecciona al menos <b>1</b> proceso`
    }, {
      type: 'warning',
      timer: 8000
    })
  }
})





