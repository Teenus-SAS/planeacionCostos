/* 
@Author: Alexis Holguin
@github: MoraHol
logica de productos
*/
function loadingSpinner() {
  $('#spinnerAjax').removeClass('fade')
}

function completeSpinner() {
  $('#spinnerAjax').addClass('fade')
}


// cambio entre adicionar y modificar
$('input[name=optionProductos]').change(function () {
  if ($(this).val() == 'option2') {
    // desaparece el input
    $('#inputRef').fadeOut()
    $('#inputProducto').fadeOut()
    // guarda el padre del input
    let $formGroupParent = $('#inputRef').parent()
    $('#input-cantidad').attr('disabled', false)
    $('#input-materia').parent().parent().fadeIn()
    $('#input-cantidad').parent().parent().fadeIn()
    $('#input-unidad').parent().parent().fadeIn()
    $('#delete-producto').fadeOut(400, () => {

      
      $('#delete-materia-prima').fadeIn();
    });
    loadingSpinner()
    let $selectRef = $('<select id="inputRef" class="custom-select" name="ref"></select>')
    let $selectProduct = $('<select id="inputProducto" class="custom-select" name="producto">')
    // se agregan todos los productos en un input select
    $selectProduct.append('<option selected disabled>Seleccione un producto</option>')
    $selectRef.append('<option selected disabled>Seleccione una referencia</option> ')
    $formGroupParent.append($selectRef)
    $('#inputProducto').parent().append($selectProduct)
    $.get('api/get_products.php?materials', (data, status, xhr) => {
      productsJSON = data


      // se consulta los productos de esa empresa
      if (status == 'success') {
        data.forEach((product) => {
          $selectRef.append(`<option value="${product.id}">${product.ref}</option>`)
          $selectProduct.append(`<option value="${product.id}">${product.name}</option>`)
        })

        // se quita el input de tipo de texto
        $('#inputRef').remove()
        $('#inputProducto').remove()
        $('#inputRef').change(function () {
          let productSelected = data.filter(product => product.id == $(this).val())[0]
          $('#inputProducto').val(productSelected.id)
          $('#title-products').text(productSelected.name)
          $('#input-materia option[selected]').attr('selected', false)
          $('#input-materia option[disabled]').attr('selected', 'selected')
          $tableProductoMateria.api().ajax.url(`api/get_materials_product.php?dataTable=true&id=${productSelected.id}`)
          $tableProductoMateria.api().ajax.reload()
        })
        $('#inputProducto').change(function () {
          let productSelected = data.filter(product => product.id == $(this).val())[0]
          $('#inputRef').val(productSelected.id)
          $('#title-products').text(productSelected.name)
          $('#input-materia option[selected]').attr('selected', false)
          $('#input-materia option[disabled]').attr('selected', 'selected')
          $tableProductoMateria.api().ajax.url(`api/get_materials_product.php?dataTable=true&id=${productSelected.id}`)
          $tableProductoMateria.api().ajax.reload()
        })
        // cambio de tabla a la lista de productos
        $('#tableProductos_wrapper').parent().fadeOut(400, () => {
          $('#tableProductoMateriaPrima_wrapper').parent().fadeIn()
        })

        // cambio de material
        $('#input-materia').change(function () {
          let productSelected = data.filter(product => product.id == $('#inputProducto').val())[0]
          let materialSelected = materialsJSON.filter(material => material.id == $(this).val())[0]
          let materialInProduct
          if(productSelected.materials != undefined){
            materialInProduct = productSelected.materials.filter(material => material.material.id == materialSelected.id)[0]
          }
          $('#input-unidad').val(materialSelected.unit)
          if (materialInProduct != undefined) {
            $('#input-cantidad').val(materialInProduct.quantity)
          } else {
            $('#input-cantidad').val('')
          }
        })
        completeSpinner()
      } else {
        location = '/login'
      }
    })
  } else {
    // esconder los carmpos que no se necesitan
    $('#input-materia').parent().parent().fadeOut()
    $('#input-cantidad').parent().parent().fadeOut()
    $('#input-unidad').parent().parent().fadeOut()
    $('#delete-materia-prima').fadeOut(400, () => {
      $('#delete-producto').fadeIn();
    });
    // limpiado de campos
    $('#input-unidad').val('')
    $('#input-cantidad').val('')
    $('#input-cantidad').attr('disabled', true)
    $('#input-materia option[selected]').attr('selected', false)
    $('#input-materia option[disabled]').attr('selected', 'selected')
    if ($('#inputRef')[0].tagName == 'SELECT' && $('#inputProducto')[0].tagName == 'SELECT') {
      // cambio de select por uno de texto para la referencia
      let $formGroupParent = $('#inputRef').parent()
      $('#inputRef').fadeOut()
      $formGroupParent.append(`<input id="inputRef" class="form-control" type="text" name="ref"> `)
      $('#inputRef').remove()
      // cambio de select por uno de texto para el nombre del producto
      $formGroupParent = $('#inputProducto').parent()
      $('#inputProducto').fadeOut()
      $formGroupParent.append(`<input id="inputProducto" class="form-control" type="text" name="producto"> `)
      $('#inputProducto').remove()
    }
    // cambio de tabla a la lista de productos
    $('#tableProductoMateriaPrima_wrapper').parent().fadeOut(400, () => {
      $('#tableProductos_wrapper').parent().fadeIn()
    })
    $('#title-products').text('Productos')

  }
})
// cargado de materias primas de la empresa
$.get('/app/config-general/api/get_materials.php', (_materials) => {
  $('#input-materia').html('<option selected disabled>Selecione un Material</option>')
  materialsJSON = _materials
  _materials.forEach((material) => {
    $('#input-materia').append(`<option value="${material.id}">${material.description}</option>`)
  })
})




// inicializacion de datatable de productos
var $tableProductos = $('#tableProductos').dataTable({
  language: {
    url: "/vendor/dataTables/Spanish.json"
  },
  responsive: true,
  ajax: {
    url: 'api/get_products.php?dataTable=true',
    dataSrc: 'data'
  },
  columns: [{
    data: 'ref'
  },
  {
    data: 'name'
  }
  ],
  reponsive: true
})
$tableProductos.width('100%')
$tableProductos.on('click', 'tr', function () {
  $(this).toggleClass('selected');
})

// inicializacion de datatable de productos
var $tableProductoMateria = $('#tableProductoMateriaPrima').dataTable({
  language: {
    url: "/vendor/dataTables/Spanish.json"
  },
  responsive: true,
  ajax: {
    url: 'api/get_materials_product.php?dataTable=true',
    dataSrc: 'data'
  },
  columns: [{
    data: 'material.description'
  },
  {
    data: 'quantity',
    render: (data, type, row) => {
      if(parseFloat(data) < 1){
        let sum = 0
        for (let index = 0; index < data.toString().length; index++) {
          sum += data.toString().charAt(index) == '0' ? 1 : 0
        }
        sum += 1
        return $.number(data, sum, ',', '.')
      }else{
        return $.number(data, 2, ',', '.')
      }
    }
  }, {
    data: 'material.unit'
  }
  ]
})
$tableProductoMateria.width('100%')
$tableProductoMateria.on('click', 'tr', function () {
  $(this).toggleClass('selected');
})


// formulario para adicionar o modificar valores de una nomina

$('#form-products').submit(function (e) {
  e.preventDefault()
  let request = $(this).serialize()
  $.post('api/add_modify_products.php', request, (_data, _status, xhr) => {
  })
    .always(function (xhr) {
      switch (xhr.status) {
        case 200:
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: "El producto ha sido <b>Actualizado</b> Correctamente"
          }, {
            type: 'primary',
            timer: 8000
          })
          $tableProductos.api().ajax.reload()
          $tableProductoMateria.api().ajax.reload()
          $tableGastosMensuales.api().ajax.reload()
          loadProductsInProcess()
          break
        case 201:
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: "El producto ha sido <b>Creado</b> Correctamente"
          }, {
            type: 'success',
            timer: 8000
          })
          $tableProductos.api().ajax.reload()
          $tableProductoMateria.api().ajax.reload()
          $tableGastosMensuales.api().ajax.reload()
          $('#form-products')[0].reset()
          loadProductsGG()
          loadProductsPP()
          loadProductsInProcess()
          loadProductsInXLSX()
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
            message: "Esta <b>Referencia</b> ya existe"
          }, {
            type: 'danger',
            timer: 8000
          })
          break
        case 401:
          location.href = "/login"
          break
        case 403:
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: "Ya no puede crear mas productos <br> Se ha alcanzado el limite de productos licenciados"
          }, {
            type: 'danger',
            timer: 8000
          })
          break

      }
    })
})


//borrado de productos
$('#delete-producto').click(() => {
  let rows = $tableProductos.api().rows('.selected').data()
  let count = 0
  let countAux = 0
  if (rows.length > 0) {
    loadingSpinner()
    for (let index = 0; index < rows.length; index++) {
      $.post('api/delete_product.php', {
        id: rows[index].id
      }).always(function (xhr) {
        loadingSpinner()
        countAux++
        if (xhr.status == 200) {
          count++
        }
        if (countAux == rows.length) {
          $tableProductos.api().ajax.reload()
          loadProductsGG()
          loadProductsPP()
          loadProductsInProcess()
          loadProductsInXLSX()
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `Se ${count > 1 ? 'han' : 'ha'} borrado ${count} ${count > 1 ? 'productos' : 'producto'}`
          }, {
            type: 'info',
            timer: 8000
          })
          completeSpinner()
        }
      })
    }
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

//borrado de materia prima
$('#delete-materia-prima').click(() => {
  let rows = $tableProductoMateria.api().rows('.selected').data()
  let count = 0
  let countAux = 0
  if (rows.length > 0) {
    loadingSpinner()
    for (let index = 0; index < rows.length; index++) {
      $.post('api/delete_raw_material.php', {
        id: rows[index].id
      }).always(function (xhr) {
        countAux++
        if (xhr.status == 200) {
          count++
        }
        if (countAux == rows.length) {
          $tableProductoMateria.api().ajax.reload()
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `Se ${count > 1 ? 'han' : 'ha'} borrado ${count} ${count > 1 ? 'materias primas' : 'materia prima'}`
          }, {
            type: 'info',
            timer: 8000
          })
          completeSpinner()
        }
      })
    }
  } else {
    $.notify({
      icon: "nc-icon nc-bell-55",
      message: `Selecciona al menos <b>1</b> materia prima`
    }, {
      type: 'warning',
      timer: 8000
    })
  }
})