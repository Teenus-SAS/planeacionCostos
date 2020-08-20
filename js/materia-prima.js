/* 
@Author: Alexis Holguin
@github: MoraHol
logica de materia prima
*/

function clearFormMaterials() {
  if ($('#input-materia-prima')[0].tagName == 'SELECT') {
    let $formGroupParent = $('#input-materia-prima').parent()
    $('#input-materia-prima').fadeOut()
    $('#input-unidad').val('')
    $('#input-costo').val('')
    $formGroupParent.append(`<input id="input-materia-prima" class="form-control" type="text" name="material"> `)
    $('#input-materia-prima').remove()
  }
}

//eliminado de materiales seleccionados
$('#delete-materials').click(() => {
  let rows = $tableMateriaPrima.api().rows('.selected').data()
  var count = 0
  if (rows.length > 0) {
    for (let index = 0; index < rows.length; index++) {
      $.post('api/delete_material.php', {
        id: rows[index].id
      }).always(function (xhr) {
        if (xhr.status == 200) {
          $tableMateriaPrima.api().ajax.reload()
          count++
        } else {
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `El material <b>${rows[index].description}</b> esta asociado a uno o mas productos`
          }, {
            type: 'danger',
            timer: 8000
          })
        }

        if (count == rows.length) {
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `Se ${count > 1 ? 'han' : 'ha'} borrado ${count} ${count > 1 ? 'materiales' : count == 0 ? 'materiales' : 'material'}`
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
      message: `Selecciona al menos <b>1</b> material`
    }, {
      type: 'warning',
      timer: 8000
    })
  }
})


var materialsMateriaPrima
$.get('api/get_materials.php', (data, status, xhr) => {
  materialsMateriaPrima = data
})

// logica de materia prima
$('input[name=optionMateriaPrima]').change(function () {
  $tableMateriaPrima.api().search('').draw();
  if ($(this).val() == 'option2') {
    // desaparece el input
    $('#input-materia-prima').fadeOut()
    // guarda el padre del input
    let $formGroupParent = $('#input-materia-prima').parent()
    loadingSpinner()
    $.get('api/get_materials.php', (data, status, xhr) => {
      completeSpinner()
      // se consulta los materiales de esa empresa
      if (status == 'success') {
        // se agregan todos los materiales en un input select
        let string = `<select id="input-materia-prima" class="form-control" name="material"><option selected disabled>Seleccione un material</option>`
        materialsMateriaPrima = data
        data.forEach((material) => {
          string += `<option value="${material.id}">${material.description}</option>`
        })
        string += '</select>'
        $formGroupParent.append(string)
        // se quita el input de tipo de texto
        $('#input-materia-prima').remove()

        $('#input-materia-prima').change(function () {
          let materialSelected = data.filter(material => material.id == $(this).val())[0]
          $('#input-unidad').val(materialSelected.unit)
          $('#input-costo').val(parseFloat(materialSelected.cost))
          $tableMateriaPrima.api().search(materialSelected.description).draw();
        })
      } else {
        location = '/login'
      }
    })
  } else {
    clearFormMaterials()
  }
})
$("#input-unidad").autocomplete({
  source: function (request, response) {
    $.get('api/get_unidades.php', (data, status) => {
      response(data.filter(country => country.trim().toLowerCase().includes(request.term.trim().toLowerCase())))
    })
  }
})

// inicializacion de datatable
var $tableMateriaPrima = $('#table-materia-prima').dataTable({
  language: {
    url: "/vendor/dataTables/Spanish.json"
  },
  ajax: {
    url: 'api/get_materials.php?dataTable=true',
    dataSrc: 'data'
  },
  columnDefs: [
    {
      targets: 0,
      className: 'text-left'
    },
    {
      targets: -1,
      className: 'text-right'
    }
  ],
  columns: [{
    "data": 'description'
  },
  {
    "data": 'unit'
  },
  {
    "data": 'cost',
    render: (data, type, row) => {
      $('.cost').parent().addClass('text-right')
      return `<span class="cost">$ ${$.number(data, 2, '.', ',')}</span>`
    }
  }
  ],
  reponsive: true
})
$tableMateriaPrima.width('100%')
$tableMateriaPrima.on('click', 'tr', function () {
  $(this).toggleClass('selected');
})

// manejo de costo como precio
$('#input-costo').number(true, 2)

$('#form-materia-prima').submit(function (e) {
  e.preventDefault()
  if (materialsMateriaPrima != undefined) {
    let m = $('#input-materia-prima').val()
    let materialSel = materialsMateriaPrima.filter(material => material.description.trim().toLowerCase() == m.trim().toLowerCase())[0]
    if (materialSel != undefined) {
      $.confirm({
        title: 'EQUOTE',
        content: '¿Desea Actualizar El material?',
        buttons: {
          SI: function () {
            submitFormMaterials(true)
          },
          No: function () {

          }
        }
      })
    } else {
      submitFormMaterials()
    }
  }

})
function submitFormMaterials(updated = false) {
  $.post('api/add_modify_materials.php', $('#form-materia-prima').serialize())
    .always(function (xhr) {
      switch (xhr.status) {
        case 200:
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: "El Material ha sido <b>Actualizado</b> Correctamente"
          }, {
            type: 'primary',
            timer: 8000
          })
          $tableMateriaPrima.api().ajax.reload()
          $('.cost').parent().addClass('text-right')
          break
        case 201:
          if (updated) {
            $.notify({
              icon: "nc-icon nc-bell-55",
              message: "El Material ha sido <b>Actualizado</b> Correctamente"
            }, {
              type: 'primary',
              timer: 8000
            })
          } else {
            $.notify({
              icon: "nc-icon nc-bell-55",
              message: "El Material ha sido <b>Creado</b> Correctamente"
            }, {
              type: 'success',
              timer: 8000
            })
          }

          $tableMateriaPrima.api().ajax.reload()
          $('#form-materia-prima')[0].reset()
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
            message: "Ha ocurrido un error mientras se creaba el material"
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
            message: "El costo debe de ser mayor a cero"
          }, {
            type: 'danger',
            timer: 8000
          })
          break
      }
    })
}

$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
  e.target // newly activated tab
  e.relatedTarget // previous active tab
  $tableMateriaPrima.api().ajax.reload()
  $tableNominas.api().ajax.reload()
  $tableProcesos.api().ajax.reload()
  $tableMaquinas.api().ajax.reload()
})

function alphaOnly(event) {
  var key = event.keyCode;
  return ((key >= 65 && key <= 90) || key == 8 || key == 9);
}
