import {
  Notifications,
  verifyFields,
} from "./Shared/infrastructure/Notifications.js";

let flag = false;

document
  .querySelector('a[href$="materia_prima"]')
  .addEventListener("click", () => {
    resetFormMaterials();
  });

function clearFormMaterials() {
  if ($("#input-materia-prima")[0].tagName == "SELECT") {
    let $formGroupParent = $("#input-materia-prima").parent();
    $("#input-materia-prima").fadeOut();
    $("#input-unidad").val("");
    $("#input-costo").val("");
    $formGroupParent.append(
      `<input id="input-materia-prima" class="form-control" type="text" name="material"> `
    );
    $("#input-materia-prima").remove();
    document.getElementById("material-btn").value = "adicionar";
  }
}

let materialSeletedByEdit = {
  description: null,
  id: null,
};
var materialsMateriaPrima;
$.get("api/get_materials.php", (data, status, xhr) => {
  materialsMateriaPrima = data;
});

// logica de materia prima
$("input[name=optionMateriaPrima]").change(function () {
  tableMateriaPrima.api().search("").draw();
  if ($(this).val() == "option2") {
    document.getElementById("material-btn").value = "Modificar";
    $.get("api/get_materials.php", (data, status, xhr) => {
      /*     completeSpinner() */
      // se consulta los materiales de esa empresa
      if (status == "success") {
        materialsMateriaPrima = data;
      } else {
        location = "/login";
      }
    });
  } else {
    document.getElementById("material-btn").value = "Adicionar";
    resetFormMaterials();
    document.getElementById("input-materia-prima").readOnly = false;
  }
});

/* Autocompletar el input de unidad de acuerdo con lo almacenado */
$("#input-unidad").autocomplete({
  source: function (request, response) {
    $.get("api/get_unidades.php", (data, status) => {
      response(
        data.filter((country) =>
          country
            .trim()
            .toLowerCase()
            .includes(request.term.trim().toLowerCase())
        )
      );
    });
  },
});

// inicializacion de datatable Materia prima
var tableMateriaPrima = $("#table-materia-prima").dataTable({
  scrollCollapse: true,
  pageLength: 25,
  language: {
    url: "/vendor/dataTables/Spanish.json",
  },
  ajax: {
    url: "api/get_materials.php?dataTable=true",
    dataSrc: "data",
  },
  columnDefs: [],
  columns: [
    { data: "referencia" },
    { data: "description" },
    { data: "unit" },
    {
      data: "cost",
      render: (data, type, row) => {
        $(".cost").parent().addClass("text-right");
        return `<span class="cost">$ ${$.number(data, 2, ".", ",")}</span>`;
      },
    },
    {
      data: null,
      render: (data) => {
        return `<a  href='#'><i id=${data.id} data-toggle='tooltip' title="Editar" class='nc-icon nc-refresh-69 link-editar-materia-prima' style='color:rgb(255, 165, 0)'></i></a><a href='#' style="margin-left: 1rem;"><i data-material-id=${data.id} class='nc-icon nc-simple-remove link-borrar-materia-prima' data-toggle='tooltip' title='Eliminar' style='color:rgb(255, 0, 0)'></i></a>`;
      },
    },
  ],
  reponsive: true,
});

$("#input-costo").number(true, 2);

$("#form-materia-prima").submit(function (e) {
  e.preventDefault();

  if (materialsMateriaPrima != undefined) {
    let m = $("#input-materia-prima").val();
    let ref = $("#ref-materia-prima").val();
    let unidad = $("#input-unidad").val();
    let costo = $("#input-costo").val();
    let materialSel = materialsMateriaPrima.filter(
      (material) =>
        material.description.trim().toLowerCase() == m.trim().toLowerCase() ||
        material.referencia.trim().toLowerCase() == ref.trim().toLowerCase()
    )[0];

    const fieldsVerification = verifyFields(
      { name: "Referencia", value: ref },
      { name: "Materia Prima", value: m },
      { name: "Unidad", value: unidad },
      { name: "Costo", value: costo }
    );
    if (fieldsVerification) {
      Notifications.error(fieldsVerification.message);
      return false;
    }
    if (
      materialSel &&
      document.getElementById("material-btn").value.trim().toLowerCase() ===
        "modificar"
    ) {
      submitFormMaterials(true);
      return;
    }

    if (
      existsMateriaPrimaByName(
        document.getElementById("input-materia-prima").value
      ) ||
      existsMateriaPrimaByRef(
        document.getElementById("ref-materia-prima").value
      )
    ) {
      if (
        document.getElementById("material-btn").value.trim().toLowerCase() ===
        "modificar"
      ) {
        submitFormMaterials(true);
      } else {
        $.confirm({
          title: "Tezlik",
          content: "La materia prima ya existe ¿desea actualizarla?",
          buttons: {
            SI: function () {
              submitFormMaterials(true);
              return;
            },
            No: function () {
              return;
            },
          },
        });
      }
    } else {
      submitFormMaterials();
    }
  }
});

function submitFormMaterials(updated = false) {
  $.post(
    "api/add_modify_materials.php",
    $("#form-materia-prima").serialize()
  ).always(function (xhr) {
    switch (xhr.status) {
      case 200:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "Materia prima <b>Actualizada</b> Correctamente",
          },
          {
            type: "primary",
            timer: 4000,
          }
        );
        tableMateriaPrima.api().ajax.reload();
        $(".cost").parent().addClass("text-right");
        flag = true;
        break;
      case 201:
        if (updated) {
          $.notify(
            {
              icon: "nc-icon nc-bell-55",
              message: "Materia prima <b>Actualizada</b> Correctamente",
            },
            {
              type: "primary",
              timer: 4000,
            }
          );
          flag = true;
        } else {
          $.notify(
            {
              icon: "nc-icon nc-bell-55",
              message: "Materia prima <b>Creada</b> Correctamente",
            },
            {
              type: "success",
              timer: 4000,
            }
          );
          flag = true;
        }

        tableMateriaPrima.api().ajax.reload();
        $("#form-materia-prima")[0].reset();
        break;
      case 400:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "<b>Completa</b> Todos los campos",
          },
          {
            type: "warning",
            timer: 4000,
          }
        );
        break;
      case 500:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "Ocurrió un error mientras se creaba la Materia prima",
          },
          {
            type: "danger",
            timer: 4000,
          }
        );
        break;
      case 401:
        location.href = "/login";
        break;
      case 501:
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: "El costo debe de ser mayor a cero",
          },
          {
            type: "danger",
            timer: 4000,
          }
        );
        break;
    }
    if (flag == true) {
      resetFormMaterials();
    }
  });
}

$('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {
  e.target; // newly activated tab
  e.relatedTarget; // previous active tab
  tableMateriaPrima.api().ajax.reload();
});

function alphaOnly(event) {
  var key = event.keyCode;
  return (key >= 65 && key <= 90) || key == 8 || key == 9;
}

document
  .getElementById("table-materia-prima")
  .addEventListener("click", (ev) => {
    const target = ev.target;

    if (target.classList.contains("link-borrar-materia-prima")) {
      deleteMaterial(
        target.dataset.materialId,
        target.closest("tr").cells[0].textContent
      );
    } else if (target.classList.contains("link-editar-materia-prima")) {
      const closestTr = target.closest("tr");
      const referencia = closestTr.cells[0].textContent.trim();
      const description = closestTr.cells[1].textContent.trim();
      const unidad = closestTr.cells[2].textContent.trim();
      const costo = closestTr.cells[3].textContent.replace("$", "").trim();

      document.getElementById("idMateriaPrima").value = target.id;
      document.getElementById("material-firstname").value = description;
      document.getElementById("ref-materia-prima").value = referencia;
      document.getElementById("input-materia-prima").value = description;
      document.getElementById("input-unidad").value = unidad;
      document.getElementById("input-costo").value = costo;
      document.getElementById("material-btn").value = "modificar";

      materialSeletedByEdit.description = description;
      materialSeletedByEdit.id = target.dataset.materialId;
      document
        .getElementById("idMateriaPrima")
        .setAttribute("value", materialSeletedByEdit.id);
    }
  });

function deleteMaterial(id, description) {
  bootbox.confirm({
    title: "Eliminar Materia Prima",
    message: `¿Está seguro de eliminar esta Materia Prima?.  Esta acción no se puede deshacer`,
    buttons: {
      confirm: {
        label: '<i class="fa fa-check"></i> Si',
        className: "btn-danger",
      },
      cancel: {
        label: '<i class="fa fa-times"></i> No',
        className: "btn-secondary",
      },
    },
    callback: function (result) {
      if (result == true) {
        $.post("api/delete_material.php", {
          id: id,
        }).always(function (xhr) {
          if (xhr.status == 200) {
            tableMateriaPrima.api().ajax.reload();
            $.notify({
              icon: "nc-icon nc-bell-55",
              message: `Materia prima <b>eliminada<b> Correctamente`,
              type: "info",
              timer: 4000,
            });
          } else {
            $.notify({
              icon: "nc-icon nc-bell-55",
              message: `No se puede eliminar la materia prima con referencia <b>${description} ya que está asociada a algún producto</b>.`,
              type: "danger",
              timer: 4000,
            });
          }
        });
      }
    },
  });
}

function existsMateriaPrimaByName(matPrimaName) {
  const tableRows = Array.from(
    document.getElementById("table-materia-prima").tBodies[0].rows
  );
  return tableRows.some((row) => {
    return (
      row.cells[1] &&
      row.cells[1].textContent.trim().toLowerCase() ===
        matPrimaName.trim().toLowerCase()
    );
  });
}

function existsMateriaPrimaByRef(matPrimaRef) {
  const tableRows = Array.from(
    document.getElementById("table-materia-prima").tBodies[0].rows
  );
  return tableRows.some((row) => {
    return (
      row.cells[0].textContent.trim().toLowerCase() ===
      matPrimaRef.trim().toLowerCase()
    );
  });
}

/* Limpiar campos de materia prima */

function resetFormMaterials() {
  document.getElementById("idMateriaPrima").value = "";
  document.getElementById("input-materia-prima").value = "";
  document.getElementById("ref-materia-prima").value = "";
  document.getElementById("input-materia-prima").readOnly = false;
  document.getElementById("input-unidad").value = "";
  document.getElementById("input-costo").value = "";
  document.getElementById("material-btn").value = "Adicionar";
}

export { tableMateriaPrima };
