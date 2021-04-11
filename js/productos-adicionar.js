document
  .querySelector('li.nav-item a[href$="#products"]')
  .addEventListener("click", () => {
    resetFormProducts();
  });

/* document.querySelector('li.nav-item > a[href$="#products"]')
addEventListener('click', (ev) => { console.log(ev.target); });
 */

function loadingSpinner() {
  $("#spinnerAjax").removeClass("fade");
}

function completeSpinner() {
  $("#spinnerAjax").addClass("fade");
}

var $tableProductos = $("#tableProductos").dataTable({
  scrollY: "300px",
  scrollCollapse: true,
  paging: false,

  language: {
    url: "/vendor/dataTables/Spanish.json",
  },
  responsive: true,
  ajax: {
    url: "api/get_products.php?dataTable=true",
    dataSrc: "data",
  },
  columns: [
    {
      data: "ref",
    },
    {
      data: "name",
    },
    {
      data: "rentabilidad",
      render: function (data) {
        return data + " %";
      },
    },
    {
      data: "id",
      render: function (data) {
        return `<a href='#'><i data-prod-id=${data} data-toggle='tooltip' title="Editar" class='nc-icon nc-refresh-69 link-editar' style='color:rgb(255, 165, 0)'></i></a><a href='#' style="margin-left: 1rem;"><i data-prod-id=${data} class='nc-icon nc-simple-remove link-borrar' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'></i></a>`;
      },
    },
  ],
  reponsive: true,
});

let productsJSON;

loadProducts();
// cargado de productos de base de datos
function loadProducts() {
  loadingSpinner();
  $.get("api/get_products.php", (data, status, xhr) => {
    productsJSON = data;
  });
  completeSpinner();
}

//redimensiona la tabla para no desfigurar el encabezado con respecto al cuerpo de la tabla

$tableProductos.width("100%");

/* $(window).on('resize', function() {
  $('#tableProductos').css('width', '100%');
  table.draw(true);
}); */

$.validator.addMethod(
  "rentabilidadInput",
  function (value) {
    return /^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/.test(value) || value.trim() === "";
  } /* , "Ingrese áximo dos decimales" */
);

// formulario para adicionar o modificar valores de una producto

$("#form-products").validate({
  /*  rules: {
     rentabilidad: 'rentabilidadInput'
   },
   messages: {
     rentabilidad: "Ingrese máximo dos decimales"
   }, */
  submitHandler: function (form) {
    let request = $(form).serialize();
    request += "&optionProductos=option1";

    ref = $("#inputRef").val();
    producto = $("#inputProducto").val();

    if (
      ref == undefined ||
      ref == "" ||
      producto == undefined ||
      producto == ""
    ) {
      $.notify(
        {
          icon: "nc-icon nc-bell-55",
          message: `Ingrese todos los datos`,
        },
        {
          type: "danger",
          timer: 8000,
        }
      );

      return false;
    }

    if (
      productReferenceExists(document.getElementById("inputRef").value) &&
      document.getElementById("form-product-btn").textContent.toLowerCase() ===
        "guardar"
    ) {
      if (
        productReferenceAndNameExists(
          document.getElementById("inputRef").value,
          document.getElementById("inputProducto").value
        )
      ) {
        bootbox.confirm({
          title: "Crear Productos",
          message: `El producto con referencia <b>"${
            document.getElementById("inputRef").value
          }"</b> y nombre <b>"${
            document.getElementById("inputProducto").value
          }"</b> ya existe, ¿Desea actualizarlo?`,
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
              /// Opcion en formulario 1 = editar, 0 = guardar
              $("#formOption").val("1");
              $("#prodId").val(
                findProductByName(
                  document.getElementById("inputProducto").value
                )
              );
              request = $(form).serialize();
              request += "&optionProductos=option1";
              sendRequest(request);
              return;
            } else {
              return;
            }
          },
        });
      } else {
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: `La referencia ${
              document.getElementById("inputRef").value
            } ya existe. Ingrese otra referencia`,
          },
          {
            type: "danger",
            timer: 8000,
          }
        );
      }
    } else {
      sendRequest($(form).serialize());
    }
  },
});

function sendRequest(request) {
  $.post(
    "api/add_modify_products.php",
    request,
    (_data, _status, xhr) => {}
  ).always(function (xhr) {
    switch (xhr.status) {
      case 200:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "Producto <b>Actualizado</b> Correctamente",
          },
          {
            type: "primary",
            timer: 8000,
          }
        );
        $tableProductos.api().ajax.reload();
        resetFormProducts();
        loadProductsInProcess();
        break;
      case 201:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "Producto <b>Creado</b> Correctamente",
          },
          {
            type: "success",
            timer: 8000,
          }
        );
        $("#config-color").css("color", "orange");
        $tableProductos.api().ajax.reload();
        break;
      case 412:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message:
              "Por favor <b>selecciona</b> una opcion para <b>adicionar</b> o <b>modificar</b>",
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
            message: "Por favor <b>Completa</b> Todos los campos",
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
            message: "Esta <b>Referencia</b> ya existe",
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
      case 403:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message:
              "No puede crear más productos <br> Se ha alcanzado el limite de productos licenciados",
          },
          {
            type: "danger",
            timer: 8000,
          }
        );
        break;
    }
    /// RESETEA EL VALOR DEL FORM OPTION GUARDAR/EDITAR ///
    resetFormOptions();
  });
}

function findProductByName(name) {
  const product = productsJSON.find((product) => product.name == name);
  return product.id;
}

/* Editar o eliminar productos */

document.getElementById("tableProductos").addEventListener("click", (ev) => {
  const selectedElement = ev.target;

  if (selectedElement.classList.contains("link-borrar")) {
    deleteProduct(selectedElement.dataset.prodId);
  } else if (selectedElement.classList.contains("link-editar")) {
    const closestRow = selectedElement.closest("tr");
    const ref = closestRow.cells[0].textContent;
    const producto = closestRow.cells[1].textContent;
    const rentabilidad = closestRow.cells[2].textContent.slice(0, -2);

    document.getElementById("inputRef").value = ref;
    document.getElementById("inputProducto").value = producto;
    document.getElementById("inputRentabilidad").value = rentabilidad;

    document.getElementById("form-product-btn").textContent = "Actualizar";
    /// Opcion en formulario 1 = editar, 0 = guardar
    document.getElementById("formOption").value = 1;
    //// id del producto ///////
    document.getElementById("prodId").value = selectedElement.dataset.prodId;
  }
});

/* Eliminar productos */

function deleteProduct(prodId) {
  bootbox.confirm({
    title: "Eliminar productos",
    message: `${
      document.getElementById("inputRef").value
    } ¿Está seguro de eliminar este producto?.  Esta acción no se puede deshacer`,
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
        loadingSpinner();
        $.post("api/delete_product.php", {
          id: prodId,
        }).always(function (xhr) {
          completeSpinner();
          if (xhr.status == 200) {
            $tableProductos.api().ajax.reload();
            loadProductsPP();
            loadProductsInProcess();
            loadProductsInXLSX();
            $.notify(
              {
                icon: "nc-icon nc-bell-55",
                message: `Producto Eliminado`,
              },
              {
                type: "info",
                timer: 8000,
              }
            );
          }
        });
        return;
      } else {
        resetFormOptions();
        resetFormProducts();
        return;
      }
    },
  });

  /* $.confirm({
    title: 'Tezlik',
    content: `${document.getElementById('inputRef').value} ¿Está seguro de eliminar este producto?.  Esta acción no se puede deshacer`,
    buttons: {
      SI: function () {

      },
      No: function () {
        resetFormOptions();
        resetFormProducts();
        return;
      }
    }
  }) */
}

/// resetea opciones de guardar editar/////
function resetFormOptions() {
  const formOption = document.getElementById("formOption");
  if (formOption.value == 1) {
    document.getElementById("form-product-btn").textContent = "Guardar";
    document.getElementById("prodId").value = "-1";
    formOption.value = 0;
  }
}

function resetFormProducts() {
  console.log("reset");
  $("#inputRef").val("");
  $("#inputProducto").val("");
  $("#inputRentabilidad").val("");
}

function productReferenceExists(prodRef) {
  const tableRows = Array.from(
    document.getElementById("tableProductos").tBodies[0].rows
  );

  return tableRows.some(
    (row) =>
      row.cells[0].textContent.trim().toLowerCase() ===
      prodRef.trim().toLowerCase()
  );
}

function productReferenceAndNameExists(prodRef, prodName) {
  const tableRows = Array.from(
    document.getElementById("tableProductos").tBodies[0].rows
  );

  const product = tableRows.find(
    (row) =>
      row.cells[0].textContent.trim().toLowerCase() ===
        prodRef.trim().toLowerCase() &&
      row.cells[1].textContent.trim().toLowerCase() ===
        prodName.trim().toLowerCase()
  );

  return product ? true : false;
}
