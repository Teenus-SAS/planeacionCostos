<?php
if (!isset($_SESSION)) {
  session_start();
  if (isset($_SESSION["user"])) {
    header("Location: /app");
  }
}

?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Inicia Sesión</title>

  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

  <link rel="stylesheet" href="/css/login/main.css">
  <link rel="stylesheet" href="/css/login/util.css">

  <link rel="stylesheet" type="text/css" href="/fonts/font-awesome-4.7.0/css/font-awesome.min.css">
  <link rel="stylesheet" type="text/css" href="/fonts/Linearicons-Free-v1.0.0/icon-font.min.css">
  <link rel="stylesheet" type="text/css" href="/vendor/animate/animate.css">
  <link rel="stylesheet" type="text/css" href="/vendor/css-hamburgers/hamburgers.min.css">
  <link rel="stylesheet" type="text/css" href="/vendor/animsition/css/animsition.min.css">
  <link rel="stylesheet" type="text/css" href="/vendor/select2/select2.min.css">
  <link rel="stylesheet" type="text/css" href="/vendor/daterangepicker/daterangepicker.css">
  <style>
    .link {
      color: #212529;
      font-size: 16px;
      font-family: Poppins-Regular, sans-serif;
      color: #808080;
    }
  </style>
</head>

<body>
  <div class="limiter">
    <div class="container-login100">
      <div class="wrap-login100">
        <div class="login100-form-title" style="background-image: url();">
          <span class="login100-form-title-1">
            <img src="../upload/img/logo_nombre_equote.png" alt="">
          </span>
        </div>

        <form class="login100-form validate-form" id="form-login">
          <div class="wrap-input100 validate-input m-b-26" data-validate="Ingresa tu usuario">
            <span class="label-input100"></span>
            <input class="input100" type="text" id="username-input" name="username" placeholder="Usuario" value="<?= isset($_COOKIE["username_remember_me"]) ? $_COOKIE["username_remember_me"] : "" ?>">
            <span class="focus-input100"></span>
          </div>

          <div class="wrap-input100 validate-input m-b-18" data-validate="Ingresa tu contraseña">
            <span class="label-input100"></span>
            <input class="input100" type="password" id="pass" name="password" placeholder="Contraseña">
            <span class="focus-input100"></span>
          </div>

          <div class="flex-sb-m w-full p-b-30">
            <div class="contact100-form-checkbox">
              <input class="input-checkbox100" id="ckb1" type="checkbox" name="remember-me">
              <label class="label-checkbox100" for="ckb1">
                Recordarme
              </label>
            </div>

            <div class="pull-right">
              <a href="remember_pass.php" id="text-recover-pass" class="txt1 pull-right">
                ¿Olvidaste tu usuario o contraseña?
              </a>
            </div>
          </div>

          <div class="container-login100-form-btn">
            <button class="login100-form-btn">
              Ingresar
            </button>
          </div>
          <br>
          <div id="alert">

          </div>

        </form>
      </div>
      <div class="container-fluid img-teenus">
        <img class="" src="../upload/img/logo-teenus.png" width="180" alt="logo teenus">
      </div>
    </div>

  </div>

  <script src="/vendor/jquery/jquery-3.2.1.min.js"></script>
  <script src="/vendor/animsition/js/animsition.min.js"></script>
  <script src="/vendor/bootstrap/js/popper.js"></script>
  <script src="/vendor/bootstrap/js/bootstrap.min.js"></script>
  <script src="/vendor/select2/select2.min.js"></script>
  <script src="/vendor/daterangepicker/moment.min.js"></script>
  <script src="/vendor/daterangepicker/daterangepicker.js"></script>
  <script src="/vendor/countdowntime/countdowntime.js"></script>
  <script src="/js/main.js"></script>
  <script>
    $('#form-login').submit(function(e) {
      e.preventDefault()
      $.post('api/verify_login.php',
        $(this).serialize(),
        (data, status) => {
          if (status == 'success') {
            if (data.status) {
              if (localStorage.getItem('usersLogins') != null) {
                let users = JSON.parse(localStorage.getItem('usersLogins'))
                if (users.filter(user => user == $('#username-input').val())[0] != undefined) {
                  location = '/app'
                } else {
                  location = '/login/auth.php'
                }
              } else {
                location = '/login/auth.php'
              }

            } else {
              if (data.typeError == 'user') {
                $('#username-input').parent().attr('data-validate', data.message)
                showValidate($('#username-input'))
              } else if (data.typeError == 'password') {
                $('#pass').parent().attr('data-validate', data.message)
                showValidate($('#pass'))
              } else {
                $('#alert').html(`<div class="alert alert-danger alert-dismissible fade show" role="alert" style="display:none" id="alert-user-active">
            <span id="alert-user-active-message"></span>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>`)
                $('#alert-user-active-message').text(data.message)
                $('#alert-user-active').fadeIn()
              }
            }
          }
        })
    })
  </script>
</body>

</html>