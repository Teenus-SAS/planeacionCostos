/* 
@Author: Teenus SAS
@github: Teenus-SAS
logica de procesos
*/

document.querySelector('a[href$="#process"')
  .addEventListener('click', () => { elById('input-proceso').value = ''; elById('inlineRadioProc1').click(); });


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
    /* $('#input-proceso').fadeOut() */
    // guarda el padre del input
    /*     let $formGroupParent = $('#input-proceso').parent()
        loadingSpinner() */
    /*    $.get('api/get_processes.php', (data, status, xhr) => {
         completeSpinner() */
    // se consulta las maquinas de esa empresa
    /*   if (status == 'success') { */
    /* s */

    /*         $formGroupParent.parent().parent().parent().append(`<div class="row my-1 justify-content-center">
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
        }) */
  } else {
    elById('btn-procesos').value = 'Adicionar';
    elById('input-proceso').value = '';
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
  },
  {
    data: null,
    render: (data) => {
      return `<a href='#'><i data-procesos-id=${data.id} data-toggle='tooltip' title="Editar" class='nc-icon nc-refresh-69 link-editar' style='color:rgb(255, 165, 0)'></i></a><a href='#' style="margin-left: 1rem;"><i data-procesos-id=${data.id} class='nc-icon nc-simple-remove link-borrar' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'></i></a>`;
    }
  }
  ],
  reponsive: true
})
$tableProcesos.width('100%')
/* $tableProcesos.on('click', 'tr', function () {
  $(this).toggleClass('selected');
}) */


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
            message: "Proceso <b>Actualizado</b> Correctamente"
          }, {
            type: 'primary',
            timer: 8000
          })
          recargar_select();
          $tableProcesos.api().ajax.reload()
          /*  $('#input-proceso option:selected').text($('#input-name-process').val()) */
          break
        case 201:
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: "Proceso <b>Creado</b> Correctamente"
          }, {
            type: 'success',
            timer: 8000
          })
          $tableProcesos.api().ajax.reload()
          recargar_select();
          /*     $('#form-procesos')[0].reset()
              $.get('api/get_processes.php', (data, status, xhr) => {
                addSelectecFormProcces(data)
              }) */
          break
        case 412:
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: "<b>Selecciona</b> una opcion para <b>adicionar</b> o <b>modificar</b>"
          }, {
            type: 'warning',
            timer: 8000
          })
          break
        case 400:
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: "<b>Completa</b> Todos los campos"
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
      elById('inlineRadioProc1').click();
      elById('input-proceso').value = '';
    })
})

// borrado de procesos
function deleteProceso(id, proceso) {

  bootbox.confirm({
    title: "Eliminar Procesos",
    message: `¿Está seguro de eliminar el proceso <b>${proceso}</b>?.  Esta acción no se puede deshacer`,
    buttons: {
      confirm: {
        label: '<i class="fa fa-check"></i> Si',
        className: 'btn-danger'
      },
      cancel: {
        label: '<i class="fa fa-times"></i> No',
        className: 'btn-info'
      }
    },
    callback: function (result) {
      if (result == true) {
        $.post('api/delete_process.php', {
          id: id
        }).always(function (xhr) {
          if (xhr.status == 200) {

            $tableProcesos.api().ajax.reload()
            $.notify({
              icon: "nc-icon nc-bell-55",
              message: `Proceso <b>Eliminado<b> correctamente`
            }, {
              type: 'info',
              timer: 8000
            })
            recargar_select();
          } else {
            $.notify({
              icon: "nc-icon nc-bell-55",
              message: `El proceso <b>${proceso}</b> no se puede eliminar. Este proceso está asociado a uno o más productos. <br>
              o esta asociado a la nomina`
            }, {
              type: 'danger',
              timer: 8000
            })
          }
        })
      }
    }
  })
}


elById('table-procesos').addEventListener('click', ev => {

  const selectedEl = ev.target;
  const proceso = selectedEl.closest('tr').cells[0].textContent;

  if (selectedEl.classList.contains('link-borrar')) {

    deleteProceso(selectedEl.dataset.procesosId, proceso);

  } else if (selectedEl.classList.contains('link-editar')) {

    const inputProceso = elById('input-proceso');
    inputProceso.value = proceso;

    elById('proceso-id').value = selectedEl.dataset.procesosId;
    elById('btn-procesos').value = 'Modificar';
    elById('inlineRadioProc2').click();

  }

});

/* recargar select si son adicionados procesos */
/* function recargar_select() {
  $('#select-proceso').empty();
  $.get('api/get_processes.php', (processes, status) => {
    processes.forEach((process) => {
      $('#select-proceso').append(`<option value="${process.id}">${process.name}</option>`)
    })
  })
} */





