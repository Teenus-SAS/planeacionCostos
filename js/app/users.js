import { Notifications } from "../Shared/infrastructure/Notifications.js";

let $tableUsers = $("#table-users").dataTable({
  language: {
    url: "/vendor/dataTables/Spanish.json",
  },
  ajax: {
    url: "api/get_users.php?dataTable=true",
    dataSrc: "data",
  },
  columns: [
    {
      data: "username",
    },
    {
      data: "email",
    },
    {
      data: "rolId",
      render: (data, type, row) => {
        return data == 2 ? "Administrador" : "Standard";
      },
    },
    {
      data: "active",
      render: (data, type, row) => {
        return data
          ? '<span class="text-success">Activo</span>'
          : '<span class="text-danger">Inactivo</span>';
      },
    },
    {
      data: "id",
      render: (data, type, row) => {
        return `<a href="#" id="${data}" class="update-user" title="Actualizar información"><i class="nc-icon nc-refresh-69"></i></a>
        <a href="#" id="${data}" class="delete-user" title="Eliminar Usuario"><i class="nc-icon nc-simple-delete text-danger"></i></a>`;
      },
    },
  ],
  responsive: true,
});
$tableUsers.width("100%");

$("#waitMe_ex").slideUp();
$("#btn-modal-nuevo-usuario").on("click", (e) => {
  $("#waitMe_ex").toggle(700);
});

$(document).on("click", ".update-user", function (e) {
  e.preventDefault();
  updateDetailsUser(this.id);
  $("#waitMe_ex").slideDown();
});
$(document).on("click", ".delete-user", function (e) {
  e.preventDefault();
  deleteUser(this.id);
});

$("#create-user").submit(function (e) {
  e.preventDefault();
  showWaitMe();
  const isUpdate = $("#actualizar-usuario").val() == "false" ? false : true;

  if (isUpdate) {
    const id = $("#actualizar-usuario").val();
    const firstname = $("#firstname-user").val();
    const lastname = $("#lastname-user").val();
    const username = $("#name-user").val();
    const email = $("#email-user").val();
    const rol = $(`#rol-user`).val();
    $.post(
      "/admin/api/update_user.php",
      {
        id,
        firstname,
        lastname,
        username,
        email,
        rol,
      },
      (data, status) => {
        clearUsersForm();
        $("#waitMe_ex").waitMe("hide");
        if (status == "success") {
          if (data.status) {
            Notifications.info(`Información <b>Actualizada</b>`);
          } else {
            Notifications.error(`El correo ya esta en uso `);
          }
        }
        $tableUsers.api().ajax.reload();
      }
    );
  } else {
    let request = $(this).serialize();
    $.post("api/create_user.php", request, (data, status) => {
      $("#waitMe_ex").waitMe("hide");
      if (status == "success") {
        if (data.status) {
          Notifications.success(`Usuario <b>Creado</b> Correctamente`);
          clearUsersForm();
          $tableUsers.api().ajax.reload();
          $.post(
            "api/notify_admins.php",
            $(this).serialize(),
            (data, satus) => {}
          );
        } else {
          Notifications.error(
            `<b>Error</b> Correo o nombre de usuario ya esta en uso`
          );
          $tableUsers.api().ajax.reload();
          $("#waitMe_ex").waitMe("hide");
        }
      } else {
        Notifications.warning(`<b>Advertencia</b> Completa todos los campos`);
      }
    });
  }
});

function updateDetailsUser(idUser) {
  let user = $tableUsers
    .api()
    .rows()
    .data()
    .filter((data) => data.id == idUser)[0];

  $("#firstname-user").val(user.firstname);
  $("#lastname-user").val(user.lastname);
  $("#name-user").val(user.username);
  $("#name-user").attr("disabled", "true");
  $("#email-user").val(user.email);
  $(`#rol-user`).val(String(user.rolId));
  $("#actualizar-usuario").val(idUser);
  $("#create-user button").html("Actualizar");
}

function deleteUser(idUser) {
  $.post(
    "/admin/api/delete_user.php",
    {
      id: idUser,
    },
    (data, status) => {
      if (status == "success") {
        if (data.status) {
          Notifications.info(`Usuario <b>Borrado</b>`);
        } else {
          Notifications.error(`El usuario no se ha podido borrar`);
        }
      }
      $tableUsers.api().ajax.reload();
    }
  );
}

function clearUsersForm() {
  $("#name-user").val("");
  $("#name-user").attr("disabled", false);
  $("#firstname-user").val("");
  $("#lastname-user").val("");
  $("#email-user").val("");
  $("#rol-user").val("");
  $("#actualizar-usuario").val("false");
  $("#create-user button").html(`<i class="nc-icon nc-simple-add"></i> Crear`);
}

function showWaitMe() {
  $("#waitMe_ex").waitMe({
    effect: "roundBounce",
    text: "Por favor, espere unos minutos",
    //bg: rgba(255, 255, 255, 0.7),
    //color: #0000,
    //maxSize: '',
    //waitTime: 6000,
    textPos: "vertical",
    //fontSize: '',
    //source: '',
    onClose: function () {},
  });
}
