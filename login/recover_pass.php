<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
if (isset($_GET["id"]) && isset($_GET["token"])) {
  $userDao = new UserDao();
  $user = $userDao->findById($_GET["id"]);
  if ($user->getTokenPass() == $_GET["token"]) {
  } else {
    header("Location: error_token.html");
  }
} else {
  header("Location: error_token.html");
}
?>

<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Recuperación de Contraseña</title>

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
    }
  </style>
</head>

<body>
  <div class="limiter">
    <div class="container-login100">
      <div class="" style="width: 365px;">
        <div class="login100-form-title" style="background-image: url();">
          <span class="login100-form-title-1">
            <img src="../upload/img/logo_tezlik.png" width="50%" alt="tezlik">
            <div>
              <img src="../upload/img/cyber-security.png" width="20%" alt="tezlik">

            </div>
          </span>
        </div>

        <form class="  validate-form" id="form-login">

          <div class="validate-input m-b-18 m-l-15" data-validate="Contraseña es necesaria">
            <span class="labeltz">Contraseña</span>
            <input class="form-control input-correo" type="password" id="pass" name="password" data-toggle="password">
            <span class="focus-input100"></span>
          </div>

          <div class="labeltz validate-input m-b-18 m-l-15" data-validate="Repite tu contraseña">
            <span class="">Repetir Contraseña</span>
            <input class="form-control input-correo" type="password" name="repeat_password" data-toggle="password">
            <span class="focus-input100"></span>
          </div>

          <div class="container-login100-form-btn">
            <button class="btn btn-info">Cambiar Contraseña</button>
          </div>

        </form>
        <footer class="copyright">
          ©2021 Teenus SAS, Todos los derechos reservados.
        </footer>
      </div>
      <div class="container-fluid">
        <img class="" src="../upload/img/logo-teenus.png" width="180" alt="logo teenus">
      </div>
    </div>
  </div>
  <div class="alert alert-info container-fluid img-teenus" style="font-size: 14px;" role="alert">
    <span><b>Contraseñas Seguras:</b></span>
    <span><b>*</b> Usa al menos ocho caracteres</span>
    <span><b>*</b> Usa un carácter en minúscula</span>
    <span><b>*</b> Usa un carácter en mayúscula</span>
    <span><b>*</b> Usa un número, símbolo o carácter de espacio en blanco</span>
  </div>

  <script src="https://kit.fontawesome.com/58e9d196f8.js"></script>

  <script src="/vendor/jquery/jquery-3.2.1.min.js"></script>
  <script src="/vendor/animsition/js/animsition.min.js"></script>
  <script src="/vendor/bootstrap/js/popper.js"></script>
  <script src="/vendor/bootstrap/js/bootstrap.min.js"></script>
  <script src="/vendor/select2/select2.min.js"></script>
  <script src="/vendor/daterangepicker/moment.min.js"></script>
  <script src="/vendor/daterangepicker/daterangepicker.js"></script>
  <script src="/vendor/countdowntime/countdowntime.js"></script>
  <script src="/js/main.js"></script>
  <script src="https://unpkg.com/bootstrap-show-password@1.2.1/dist/bootstrap-show-password.min.js"></script>
  <script>
    $('#form-login').submit(function(e) {
      e.preventDefault()
      let request = $(this).serialize()
      let params = new URLSearchParams(location.search)
      request += `&id=${params.get('id')}`
      $.post('api/remember_change_pass.php', request, (data, status) => {
          if (status == 'success') {
            location.href = "success_recover_pass.html"
          }
        })
        .always((xhr) => {
          if (xhr.status == 200) {
            location.href = "success_recover_pass.html"
          }
        })
    })
  </script>
</body>

</html>