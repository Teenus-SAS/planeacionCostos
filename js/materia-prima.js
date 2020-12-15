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

elById('inlineRadio1').click();


var materialsMateriaPrima
$.get('api/get_materials.php', (data, status, xhr) => {
  materialsMateriaPrima = data
})

// logica de materia prima
$('input[name=optionMateriaPrima]').change(function () {
  $tableMateriaPrima.api().search('').draw();
  if ($(this).val() == 'option2') {
    elById('material-btn').value = 'Modificar';
    // desaparece el input
    /* $('#input-materia-prima').fadeOut() */
    // guarda el padre del input
/*     let $formGroupParent = $('#input-materia-prima').parent()
    loadingSpinner()
    $.get('api/get_materials.php', (data, status, xhr) => {
      completeSpinner() */
      // se consulta los materiales de esa empresa
     /*  if (status == 'success') { */
        // se agregan todos los materiales en un input select
       /*  let string = `<select id="input-materia-prima" class="form-control" name="material"><option selected disabled>Seleccione un material</option>` */
 /*       let string = `<select id="input-materia-prima" class="form-control" name="material">`
        materialsMateriaPrima = data
        data.forEach((material) => {
          string += `<option value="${material.id}">${material.description}</option>`
        })
        string += '</select>'
        $formGroupParent.append(string) */
        // se quita el input de tipo de texto
/*         $('#input-materia-prima').remove()

        $('#input-materia-prima').change(function () {
          let materialSelected = data.filter(material => material.id == $(this).val())[0]
          $('#input-unidad').val(materialSelected.unit)
          $('#input-costo').val(parseFloat(materialSelected.cost))
          $tableMateriaPrima.api().search(materialSelected.description).draw();
        })
      } else {
        location = '/login'
      }
    }) */
  } else {
    elById('material-btn').value = 'Adicionar Material';
    /* clearFormMaterials() */
    resetFormMaterials();
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
   /*  {
      targets: 0,
      className: 'text-left'
    }, */
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
  },
  {
    "data": 'id',
    render: (data) => {

      return `<a  href='#'><i data-material-id=${data} data-toggle='tooltip' title="Editar" class='nc-icon nc-refresh-69 link-editar' style='color:rgb(255, 165, 0)'></i></a><a href='#' style="margin-left: 1rem;"><i data-material-id=${data} class='nc-icon nc-simple-remove link-borrar' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'></i></a>`;
    }
  }
  ],
  reponsive: true
})
$tableMateriaPrima.width('100%')
/* $tableMateriaPrima.on('click', 'tr', function () {
  $(this).toggleClass('selected');
}) */

// manejo de costo como precio
$('#input-costo').number(true, 2)

$('#form-materia-prima').submit(function (e) {
  e.preventDefault()
  if (materialsMateriaPrima != undefined) {
    let m = $('#input-materia-prima').val()
    let materialSel = materialsMateriaPrima.filter(material => material.description.trim().toLowerCase() == m.trim().toLowerCase())[0]
    if (materialSel != undefined) {
      $.confirm({
        title: 'Tezlik',
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

      elById('inlineRadio1').click();
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


document.getElementById('table-materia-prima').addEventListener('click', (ev) => {
  
    const target = ev.target;

    if (target.classList.contains('link-borrar')) {
      deleteMaterial(target.dataset.materialId, target.closest('tr').cells[0].textContent);
    }
    else if(target.classList.contains('link-editar')) {

      const closestTr = target.closest('tr');

      const description = closestTr.cells[0].textContent.trim();
      const unidad = closestTr.cells[1].textContent.trim();
      const costo = closestTr.cells[2].textContent.replace('$', '').trim();

      elById('input-materia-prima').value = description;
      elById('input-unidad').value = unidad;
      elById('input-costo').value = costo;

      elById('inlineRadio2').click();

    }
});


/// elimina material por id ///
function deleteMaterial(id, description) {
  
   $.post('api/delete_material.php', {
        id: id
      }).always(function (xhr) {
        if (xhr.status == 200) {
          $tableMateriaPrima.api().ajax.reload()  
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `Se ha eliminado un material`
          }, {
            type: 'info',
            timer: 8000
          })
        } else {
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `El material <b>${description}</b> esta asociado a uno o mas productos`
          }, {
            type: 'danger',
            timer: 8000
          })
        }
      })

}


function elById(id) {
  return document.getElementById(id);
}


function resetFormMaterials() {
  elById('input-materia-prima').value = '';
  elById('input-unidad').value = '';
  elById('input-costo').value = '';
}
