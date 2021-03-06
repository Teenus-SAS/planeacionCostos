<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
session_start();
if (isset($_SESSION["user"])) {
  $userDao = new UserDao();
  $user = unserialize($_SESSION["user"]);
  $userDao->destroySession($user);
  $_SESSION["user_aux_auth"] = $_SESSION["user"];
  unset($_SESSION["user"]);
}
if (!isset($_SESSION["user_aux_auth"])) {
  header("Location: /login");
}
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Verificación</title>
  <link href="/app/assets/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css">
</head>

<body>
<?php
  ini_set ('display_errors', 1);
  ?>
  <script src="/vendor/jquery/jquery-3.2.1.min.js"></script>
  <script src="/vendor/animsition/js/animsition.min.js"></script>
  <script src="/vendor/bootstrap/js/popper.js"></script>
  <script src="/vendor/bootstrap/js/bootstrap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"></script>
  <script>
    $(document).ready(function() {
      sendEmail(rand_code(6))
    })

    function sendEmail(code) {
      $.post('api/send_email_auth_two_steps.php', {
        code
      }, (data, status) => {
        if (status == 'success') {
          if (data.status) {
            singInCode(code)
          }
        } else {
          location.ref = '/login'
        }
      })
    }

    function singInCode(code) {
      $.confirm({
        title: 'Protección de Seguridad',
        content: '<p>Hemos enviado un código de verificación a tu correo</p>' +
          '<form action="" class="formName">' +
          '<div class="form-group">' +
          '<label>Ingresa el código</label>' +
          '<input type="text" placeholder="" class="name form-control" required />' +
          '</div>' +
          '</form>',
        autoClose: 'Cancelar|60000',
        buttons: {
          Verificar: {
            text: 'Verificar',
            action: function() {
              var codeIn = this.$content.find('.name').val()
              if (!codeIn) {
                $.alert('Ingresa el código')
                return false
              }
              if (code == codeIn) {
                let users = []
                if (localStorage.getItem('usersLogins') == null) {
                  users.push(`<?= $user->getUsername() ?>`)
                  localStorage.setItem('usersLogins',JSON.stringify(users))
                } else {
                  users = JSON.parse(localStorage.getItem('usersLogins'))
                  users.push(`<?= $user->getUsername() ?>`)
                  localStorage.setItem('usersLogins',JSON.stringify(users))
                }
                $.post('api/confirm_login.php', (data, status) => {
                  location.href = '/app'
                })
              } else {
                $.alert('El código es incorrecto')
                return false
              }
            },
            btnClass: 'btn-blue',
          },
          Cancelar: function() {
            let newCode = rand_code(6)
            $.confirm({
              title: 'Tiempo agotado',
              content: '¿Quieres intentarlo nuevamente?',
              buttons: {
                Si: function() {
                  sendEmail(newCode)
                },
                No: function() {
                  location.href = '/login'
                }
              }
            });
          }
        },
        onContentReady: function() {
          // bind to events
          var jc = this;
          this.$content.find('form').on('submit', function(e) {
            // if the user submits the form by pressing enter in the field.
            e.preventDefault();
            jc.$$formSubmit.trigger('click'); // reference the button and click it
          })
        }
      })
    }

    function rand_code(lon) {
      chars = "1234567890"
      code = "";
      for (x = 0; x < lon; x++) {
        rand = Math.floor(Math.random() * chars.length);
        code += chars.substr(rand, 1);
      }
      return code;
    }
  </script>
</body>

</html>