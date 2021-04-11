let tab;

function loadingSpinner() {
  $("#spinnerAjax").removeClass("fade");
}

function completeSpinner() {
  $("#spinnerAjax").addClass("fade");
}

// inicializacion de datatable de productos
var $tableProductoMateria = $("#tableProductoMateriaPrima").dataTable({
  scrollY: "500px",
  scrollCollapse: true,
  paging: false,

  language: {
    url: "/vendor/dataTables/Spanish.json",
  },
  responsive: true,
  ajax: {
    url: "api/get_materials_product.php?dataTable=true",
    dataSrc: "data",
  },
  columns: [
    {
      data: "material.description",
    },
    {
      data: "quantity",
      render: (data, type, row) => {
        if (parseFloat(data) < 1) {
          let sum = 0;
          for (let index = 0; index < data.toString().length; index++) {
            sum += data.toString().charAt(index) == "0" ? 1 : 0;
          }
          sum += 1;
          return $.number(data, sum, ",", ".");
        } else {
          return $.number(data, 2, ",", ".");
        }
      },
    },
    {
      data: "material.unit",
    },
    {
      data: "id",
      render: function (data) {
        return `<a href='#'><i data-prod-id=${data} data-toggle='tooltip' title="Editar" class='nc-icon nc-refresh-69 link-editar' style='color:rgb(255, 165, 0)'></i></a> <a href='#' style="margin-left: 1rem;"><i data-prod-id=${data} class='nc-icon nc-simple-remove link-borrar' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'></i></a>`;
      },
    },
  ],
});
$tableProductoMateria.width("100%");
/* $tableProductoMateria.on('click', 'tr', function () {
  $(this).toggleClass('selected');
}) */

//RESETEA OPCIONES DE GUARDAR EDITAR
resetFormOptions();

// desaparece el input
$("#inputRef").fadeOut();
$("#inputProducto").fadeOut();
$("#inputRentabilidad").parent().parent().fadeOut();
// guarda el padre del input
let $formGroupParent = $("#inputRef").parent();
$("#input-cantidad").attr("disabled", false);
$("#input-materia").parent().parent().fadeIn();
$("#input-cantidad").parent().parent().fadeIn();
$("#input-unidad").parent().parent().fadeIn();

$("#delete-producto").fadeOut(400, () => {
  $("#delete-materia-prima").fadeIn();
});

let $selectRef = $(
  '<select id="inputRef" class="custom-select" name="ref"></select>'
);
let $selectProduct = $(
  '<select id="inputProducto" class="custom-select" name="producto">'
);
// se agregan todos los productos en un input select
$selectProduct.append(
  "<option selected disabled>Seleccione un producto</option>"
);
$selectRef.append(
  "<option selected disabled>Seleccione una referencia</option> "
);
$formGroupParent.append($selectRef);
$("#inputProducto").parent().append($selectProduct);
$.get("api/get_products.php?materials", (data, status, xhr) => {
  productsJSON = data;

  // se consulta los productos de la empresa
  if (status == "success") {
    data.forEach((product) => {
      $selectRef.append(
        `<option value="${product.id}">${product.ref}</option>`
      );
      $selectProduct.append(
        `<option value="${product.id}">${product.name}</option>`
      );
    });

    // se quita el input de tipo de texto
    $("#inputRef").remove();
    $("#inputProducto").remove();
    $("#inputRef").change(function () {
      let productSelected = data.filter(
        (product) => product.id == $(this).val()
      )[0];
      $("#inputProducto").val(productSelected.id);
      $("#title-products").text(productSelected.name);
      $("#input-materia option[selected]").attr("selected", false);
      $("#input-materia option[disabled]").attr("selected", "selected");
      $tableProductoMateria
        .api()
        .ajax.url(
          `api/get_materials_product.php?dataTable=true&id=${productSelected.id}`
        );
      $tableProductoMateria.api().ajax.reload();
    });
    $("#inputProducto").change(function () {
      let productSelected = data.filter(
        (product) => product.id == $(this).val()
      )[0];
      $("#inputRef").val(productSelected.id);
      $("#title-products").text(productSelected.name);
      $("#input-materia option[selected]").attr("selected", false);
      $("#input-materia option[disabled]").attr("selected", "selected");
      $tableProductoMateria
        .api()
        .ajax.url(
          `api/get_materials_product.php?dataTable=true&id=${productSelected.id}`
        );
      $tableProductoMateria.api().ajax.reload();
    });
    // cambio de tabla a la lista de productos
    $("#tableProductos_wrapper")
      .parent()
      .fadeOut(400, () => {
        $("#tableProductoMateriaPrima_wrapper").parent().fadeIn();
      });

    // cambio de material
    $("#input-materia").change(function () {
      $("#form-product-btn").html("Guardar");
      let productSelected = data.filter(
        (product) => product.id == $("#inputProducto").val()
      )[0];
      let materialSelected = materialsJSON.filter(
        (material) => material.id == $(this).val()
      )[0];
      let materialInProduct;
      if (productSelected.materials != undefined) {
        materialInProduct = productSelected.materials.filter(
          (material) => material.material.id == materialSelected.id
        )[0];
      }
      $("#input-unidad").val(materialSelected.unit);
      if (materialInProduct != undefined) {
        $("#input-cantidad").val(materialInProduct.quantity);
      } else {
        $("#input-cantidad").val("");
      }
    });
    completeSpinner();
  } else {
    location = "/login";
  }
});

// cargado de materias primas de la empresa
$.get("/app/config-general/api/get_materials.php", (_materials) => {
  $("#input-materia").html(
    "<option selected disabled>Selecione un Material</option>"
  );
  materialsJSON = _materials;
  _materials.forEach((material) => {
    $("#input-materia").append(
      `<option value="${material.id}">${material.description}</option>`
    );
  });
});

$.validator.addMethod(
  "rentabilidadInput",
  function (value) {
    return /^\s*-?[1-9]\d*(\.\d{1,2})?\s*$/.test(value) || value.trim() === "";
  },
  "Máximo dos decimales"
);

$(document).on("click", ".link-editar", function (ev) {
  const selectedElement = ev.target;

  materia_prima = $(this).parents("tr").find("td").eq(0).html();
  cantidad = $(this).parents("tr").find("td").eq(1).html();
  unidad = $(this).parents("tr").find("td").eq(2).html();

  cantidad = parseInt(cantidad.replace(".", ""));

  $(`#input-materia option:contains(${materia_prima})`).attr("selected", true);
  $("#input-cantidad").val(cantidad);
  $("#input-unidad").val(unidad);
  $("#form-product-btn").html("Actualizar");
});

// formulario para adicionar o modificar materia prima de un producto

$("#form-products").validate({
  /* rules: {
    rentabilidad: 'rentabilidadInput'
  },
  messages: {
    rentabilidad: "Máximo dos decimales"
  }, */
  submitHandler: function (form) {
    const cantidad = parseFloat($("#input-cantidad").val());
    console.log({ cantidad });

    if (!cantidad) {
      $.notify(
        {
          icon: "nc-icon nc-bell-55",
          message: "Cantidad no puede ser 0",
        },
        {
          type: "danger",
          timer: 8000,
        }
      );
      return;
    }
    let request = $(form).serialize();
    request += "&optionProductos=option2";

    console.log(request);

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
          $tableProductoMateria.api().ajax.reload();
          resetFormOptions();
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
          $tableProductoMateria.api().ajax.reload();
          resetFormOptions();
          loadProductsGG();
          loadProductsPP();
          loadProductsInProcess();
          loadProductsInXLSX();
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
    });
  },
});

/* Desvincular materia prima del producto */
$(document).on("click", ".link-borrar", function (e) {
  e.preventDefault();
  const selectedElement = e.target;

  element = $(this).parents("tr").find("td").eq(0).html();
  eliminar_materiaprima_productos(selectedElement.dataset.prodId, element);
});

function eliminar_materiaprima_productos(element, materiaprima) {
  producto = $("#inputProducto option:selected").html();

  if (producto == undefined) producto = "";

  bootbox.confirm({
    title: "Desvincular materias primas",
    message: `¿Desea desvincular la materia prima <b>${materiaprima}</b> del producto <b>${producto}</b>?. Esta acción no se puede deshacer`,
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
        $.post("api/delete_raw_material.php", {
          id: element,
        }).always(function (xhr) {
          if (xhr.status == 200) {
            $tableProductoMateria.api().ajax.reload();

            $.notify(
              {
                icon: "nc-icon nc-bell-55",
                message: `Materia prima <b>desvinculada</b> del producto`,
              },
              {
                type: "info",
                timer: 8000,
              }
            );
          }
          completeSpinner();
        });
      }
    },
  });
}

function resetFormOptions() {
  const formOption = document.getElementById("formOption");
  document.getElementById("form-product-btn").textContent = "Guardar";
  document.getElementById("prodId").value = "-1";
  formOption.value = 0;
  $("#input-materia").val("");
  $("#input-cantidad").val("");
  $("#input-unidad").val("");
}
