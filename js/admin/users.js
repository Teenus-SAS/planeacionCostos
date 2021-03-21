/* 
* @Author: Teenus SAS
* @github: Teenus-SAS
* 
* funcionalidad de usuarios
*/

// obtener el id de la empresa
let params = new URLSearchParams(location.search);
var idCompany = params.get('id');


// inicializacion de datatable de usuarios
var $tableUsers = $('#table-users').dataTable({
  language: {
    url: "/vendor/dataTables/Spanish.json"
  },
  ajax: {
    url: 'api/get_users.php?dataTable=true&id=' + idCompany,
    dataSrc: 'data'
  },
  columns: [
    {
      data: 'username'
    },
    {
      data: 'email'
    },
    {
      data: 'createdAt'
    },
    {
      data: 'rolId',
      render: (data, type, row) => {
        return data == 2 ? 'Administrador' : 'Standard'
      }
    },
    {
      data: 'active',
      render: (data, type, row) => {
        return data ? '<span class="text-success">Activo</span>' : '<span class="text-danger">Inactivo</span>'
      }
    }, {
      data: 'id',
      render: (data, type, row) => {
        return `<a href="javascript:toggleActivation(${data})" title="${row.active ? 'Desactivar Usuario' : 'Activar Usuario'}"><i class="nc-icon nc-${row.active ? 'simple-remove text-danger' : 'check-2 text-success'}"></i></a>
        <a href="javascript:updateDetailsUser(${data})" title="Actualizar información"><i class="nc-icon nc-refresh-69"></i></a>
        <a href="javascript:deleteUser(${data})" title="Eliminar Usuario"><i class="nc-icon nc-simple-delete text-danger"></i></a>`
      }
    }
  ],
  responsive: true
})
$tableUsers.width('100%')

function toggleActivation(idUser) {
  let user = $tableUsers.api().rows().data().filter(data => data.id == idUser)[0]
  $.post('api/toggle_active_user.php', {
    id: idUser
  }, (data, status) => {
    if (status == 'success') {
      if (data.status) {
        if (user.active) {
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `Usuario <b>Desactivado</b>`
          }, {
            type: 'warning',
            timer: 8000
          })
        } else {
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `Usuario <b>Activado</b>`
          }, {
            type: 'success',
            timer: 8000
          })
        }
      }
    }
    $tableUsers.api().ajax.reload()
  })

}

function updateDetailsUser(idUser){
  let user = $tableUsers.api().rows().data().filter(data => data.id == idUser)[0]
  $.confirm({
    title: 'Actualizar Licenciamiento',
    content: '' +
      '<form action="" class="formName">' +
      '<div class="form-group">' +
      '<label>Correo</label>' +
      '<input type="email" placeholder="Email" class="email-user form-control" required value="' + user.email + '" />' +
      '</div>' +
      '</form>',
    buttons: {
      formSubmit: {
        text: 'Actualizar',
        btnClass: 'btn-blue',
        action: function () {
          var email = this.$content.find('.email-user').val();
          
          if (!email) {
            $.alert('Ingresa el correo electronico');
            return false;
          }
          $.post('api/update_user.php', {
            id: idUser,
            email,
            rol: user.rolId
          }, (data, status) => {
            if (status == 'success') {
              if (data.status) {
                $.notify({
                  icon: "nc-icon nc-bell-55",
                  message: `Información <b>Actualizada</b>`
                }, {
                  type: 'primary',
                  timer: 8000
                })
              } else {
                $.notify({
                  icon: "nc-icon nc-bell-55",
                  message: `El correo ya esta en uso `
                }, {
                  type: 'danger',
                  timer: 8000
                })
              }
            }
            $tableUsers.api().ajax.reload()
          })
        }
      },
      cancelar: function () {
        //close
      },
    },
    onContentReady: function () {
      // bind to events
      var jc = this;
      jc.$content.find('.email-user').focus()
      this.$content.find('form').on('submit', function (e) {

        // if the user submits the form by pressing enter in the field.
        e.preventDefault();
        jc.$$formSubmit.trigger('click'); // reference the button and click it
      });
    }
  });
}
function deleteUser(idUser){
  $.post('api/delete_user.php',{
    id: idUser
  },(data,status)=>{
    if (status == 'success') {
      if (data.status) {
        $.notify({
          icon: "nc-icon nc-bell-55",
          message: `Usuario <b>Borrado</b>`
        }, {
          type: 'primary',
          timer: 8000
        })
      } else {
        $.notify({
          icon: "nc-icon nc-bell-55",
          message: `El usuario no se ha podido borrar`
        }, {
          type: 'danger',
          timer: 8000
        })
      }
    }
    $tableUsers.api().ajax.reload()
  })
}