/*
 * @Author: Teenus SAS
 * @github: Teenus-SAS
 *
 * Funcionalidad para crear usuarios
 */

// inicializacion de datatable de usuarios
var $tableUsers = $("#table-users").dataTable({
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
        return `<a href="javascript:updateDetailsUser(${data})" title="Actualizar información"><i class="nc-icon nc-refresh-69"></i></a>
        <a href="javascript:deleteUser(${data})" title="Eliminar Usuario"><i class="nc-icon nc-simple-delete text-danger"></i></a>`;
      },
    },
  ],
  responsive: true,
});
$tableUsers.width("100%");

$("#create-user").submit(function (e) {
  e.preventDefault();
  let request = $(this).serialize();
  $.post("api/create_user.php", request, (data, status) => {
    if (status == "success") {
      if (data.status) {
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: `Usuario <b>Creado</b> Correctamente`,
          },
          {
            type: "success",
            timer: 8000,
          }
        );
        clearUsersForm();
        $("#waitMe_ex").waitMe("hide");
        $tableUsers.api().ajax.reload();
        $.post("api/notify_admins.php", form.serialize(), (data, satus) => {});
      } else {
        $.notify(
          {
            icon: "nc-icon nc-bell-55",
            message: `<b>Error</b> Correo o nombre de usuario ya esta en uso`,
          },
          {
            type: "danger",
            timer: 8000,
          }
        );
        $tableUsers.api().ajax.reload();
        $("#waitMe_ex").waitMe("hide");
      }
    } else {
      $.notify(
        {
          icon: "nc-icon nc-bell-55",
          message: `<b>Advertencia</b> Completa todos los campos`,
        },
        {
          type: "warning",
          timer: 8000,
        }
      );
      $tab;
    }
  });
});

function updateDetailsUser(idUser) {
  let user = $tableUsers
    .api()
    .rows()
    .data()
    .filter((data) => data.id == idUser)[0];
  $.confirm({
    title: "Actualizar Licenciamiento",
    content:
      "" +
      '<form action="" class="formName">' +
      '<div class="form-group">' +
      "<label>Correo</label>" +
      '<input type="email" placeholder="Email" class="email-user form-control" required value="' +
      user.email +
      '" />' +
      "</div>" +
      '<div class="form-group">' +
      "<label>rol</label>" +
      '<select class="form-control rol">' +
      '<option value="2" ' +
      (user.rolId == 2 ? "selected" : "") +
      ">Administrador</option>" +
      '<option value="1" ' +
      (user.rolId == 1 ? "selected" : "") +
      ">Standard</option>" +
      "</select>" +
      "</div>" +
      "</form>",
    buttons: {
      formSubmit: {
        text: "Actualizar",
        btnClass: "btn-blue",
        action: function () {
          var email = this.$content.find(".email-user").val();
          let rolId = this.$content.find(".rol").val();
          if (!email) {
            $.alert("Ingresa el correo electronico");
            return false;
          }
          $.post(
            "/admin/api/update_user.php",
            {
              id: idUser,
              email,
              rol: rolId,
            },
            (data, status) => {
              if (status == "success") {
                if (data.status) {
                  $.notify(
                    {
                      icon: "nc-icon nc-bell-55",
                      message: `Información <b>Actualizada</b>`,
                    },
                    {
                      type: "primary",
                      timer: 8000,
                    }
                  );
                } else {
                  $.notify(
                    {
                      icon: "nc-icon nc-bell-55",
                      message: `El correo ya esta en uso `,
                    },
                    {
                      type: "danger",
                      timer: 8000,
                    }
                  );
                }
              }
              $tableUsers.api().ajax.reload();
            }
          );
        },
      },
      cancelar: function () {
        //close
      },
    },
    onContentReady: function () {
      // bind to events
      var jc = this;
      jc.$content.find(".email-user").focus();
      this.$content.find("form").on("submit", function (e) {
        // if the user submits the form by pressing enter in the field.
        e.preventDefault();
        jc.$$formSubmit.trigger("click"); // reference the button and click it
      });
    },
  });
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
          $.notify(
            {
              icon: "nc-icon nc-bell-55",
              message: `Usuario <b>Borrado</b>`,
            },
            {
              type: "primary",
              timer: 8000,
            }
          );
        } else {
          $.notify(
            {
              icon: "nc-icon nc-bell-55",
              message: `El usuario no se ha podido borrar`,
            },
            {
              type: "danger",
              timer: 8000,
            }
          );
        }
      }
      $tableUsers.api().ajax.reload();
    }
  );
}

function clearUsersForm() {
  $("#name-user").val("");
  $("#firstname-user").val("");
  $("#lastname-user").val("");
  $("#email-user").val("");
  $("#rol-user").val("");
}
