
document.querySelector('li.nav-item a[href$="#products"]')
  .addEventListener('click', () => {
    resetFormProducts();
  });

/* document.querySelector('li.nav-item > a[href$="#products"]')
addEventListener('click', (ev) => { console.log(ev.target); });
 */

function loadingSpinner() {
  $('#spinnerAjax').removeClass('fade')
}

function completeSpinner() {
  $('#spinnerAjax').addClass('fade')
}

var $tableProductos = $('#tableProductos').dataTable({

  "scrollY": "500px",
  "scrollCollapse": true,
  "paging": false,

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
  },
  {
    data: 'rentabilidad',
    render: function (data) {
      return data + ' %';
    }
  },
  {
    data: 'id',
    render: function (data) {
      return `<a href='#'><i data-prod-id=${data} data-toggle='tooltip' title="Editar" class='nc-icon nc-refresh-69 link-editar' style='color:rgb(255, 165, 0)'></i></a><a href='#' style="margin-left: 1rem;"><i data-prod-id=${data} class='nc-icon nc-simple-remove link-borrar' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'></i></a>`;
    }
  },
  ],
  reponsive: true
})

$tableProductos.width('100%');



$.validator.addMethod("rentabilidadInput", function (value) {
  return /^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/.test(value) || value.trim() === '';
}, "Máximo dos decimales");


// formulario para adicionar o modificar valores de una nomina

$('#form-products').validate({
  rules: {
    rentabilidad: 'rentabilidadInput'
  },
  messages: {
    rentabilidad: "Máximo dos decimales"
  },
  submitHandler: function (form) {
    let request = $(form).serialize()
    request += '&optionProductos=option1';
    /*   console.log(productExists(document.getElementById('inputRef').value)); */
    console.log(document.getElementById('form-product-btn').textContent);
    if (productExists(document.getElementById('inputRef').value) &&
      document.getElementById('form-product-btn').textContent.toLowerCase() === 'guardar') {

      $.confirm({
        title: 'Tezlik',
        content: `${document.getElementById('inputRef').value} ya existe, ¿desea actualizarlo?`,
        buttons: {
          SI: function () {
            sendRequest(request);
            return;
          },
          No: function () {
            resetFormOptions();
            resetFormProducts();
            return;
          }
        }
      })

    } else {
      sendRequest(request);
    }

  }
});


function sendRequest(request) {

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
          /*     $tableProductoMateria.api().ajax.reload() */
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
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: "Ahora ah configurar el producto"
          }, {
            type: 'primary',
            timer: 8000
          })
          $('#config-color').css("color", "orange")
          $tableProductos.api().ajax.reload()
          /*       $tableProductoMateria.api().ajax.reload() */
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

      $('#inputRef').val('');
      $('#inputProducto').val('');
      $('#inputRentabilidad').val('');
      /// RESETEA EL VALOR DEL FORM OPTION GUARDAR/EDITAR ///
      resetFormOptions();
    })

}



/* FUNCIONALIDAD EDITAR / ELIMINAR PRODUCTOS */

document.getElementById('tableProductos').addEventListener('click', (ev) => {

  const selectedElement = ev.target;

  if (selectedElement.classList.contains('link-borrar')) {
    deleteProduct(selectedElement.dataset.prodId);
  }
  else if (selectedElement.classList.contains('link-editar')) {

    const closestRow = selectedElement.closest('tr');
    const ref = closestRow.cells[0].textContent;
    const producto = closestRow.cells[1].textContent;
    const rentabilidad = closestRow.cells[2].textContent.slice(0, -2);

    document.getElementById('inputRef').value = ref;
    document.getElementById('inputProducto').value = producto;
    document.getElementById('inputRentabilidad').value = rentabilidad;

    document.getElementById('form-product-btn').textContent = 'Actualizar';
    /// Opcion en formulario 1 = editar, 0 = guardar
    document.getElementById('formOption').value = 1;
    //// id del producto ///////
    document.getElementById('prodId').value = selectedElement.dataset.prodId;
  }

});


function deleteProduct(prodId) {
  $.post('api/delete_product.php', {
    id: prodId
  }).always(function (xhr) {
    loadingSpinner()
    if (xhr.status == 200) {
      $tableProductos.api().ajax.reload()
      loadProductsGG()
      loadProductsPP()
      loadProductsInProcess()
      loadProductsInXLSX()
      $.notify({
        icon: "nc-icon nc-bell-55",
        message: `Se ha borrado 1 producto`,
      }, {
        type: 'info',
        timer: 8000
      })
      completeSpinner()
    }
  })
}


/// resetea opciones de guardar editar/////
function resetFormOptions() {
  const formOption = document.getElementById('formOption');
  if (formOption.value == 1) {
    document.getElementById('form-product-btn').textContent = 'Guardar';
    document.getElementById('prodId').value = '-1';
    formOption.value = 0;
  }
}

function resetFormProducts() {
  document.getElementById('inputRef').value = '';
  document.getElementById('inputProducto').value = '';
  document.getElementById('inputRentabilidad').value = '';
}


function productExists(prodName) {

  const tableRows = Array.from(document.getElementById('tableProductos').tBodies[0].rows);

  return tableRows
    .some(row => row.cells[0].textContent.trim().toLowerCase() === prodName.trim().toLowerCase());

}




