<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Recordar Contraseña</title>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

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
<?php
  ini_set ('display_errors', 1);
  ?>
    <div class="limiter">
        <div class="container-login100">
            <div class="wrap-login100">
            <div class="login100-form-title" style="background-image: url();">
                    <span class="login100-form-title-1">
                        <img src="../upload/img/logo_nombre_equote.png" alt="logo costos equote">
                    </span>
                </div>

                <form class="login100-form validate-form" id="form-login">
                    <h4 class="titulo"><strong>Restablece tu contraseña</strong></h4><br>
                    <p>Ingresa la dirección de correo electrónico a la que deseas que se le envíe la información de restablecimiento de contraseña.</p>
                    <div class="wrap-input100 validate-input m-b-26" data-validate="Nombre de Usuario es necesario">
                        <!--<span class="label-input100">Correo Electronico</span>-->
                        <input class="input100" type="text" id="username-input" name="username"
                            placeholder="Dirección de Correo"
                            value="<?= isset($_COOKIE["username_remember_me"]) ? $_COOKIE["username_remember_me"] : "" ?>">
                        <span class="focus-input100"></span>
                    </div>


                    <div class="container-login100-form-btn">
                        <button class="login100-form-btn">
                            Restablece tu Contraseña
                        </button>
                    </div>
                    <div id="alert">

                    </div>

                </form>

            </div>
            <div class="container-fluid img-teenus">
                <img class="" src="../upload/img/logo-teenus.png" width="180" alt="logo teenus">
            </div>
        </div>
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
    <script>
    $('#form-login').submit(function(e) {
        e.preventDefault()
        $.post('api/generate_token_pass.php',
            $(this).serialize(),
            (data, status) => {
                if (status == 'success') {
                    if (data.status) {
                        $('#alert').html(`<div class="alert alert-success alert-dismissible fade show" role="alert" style="display:none" id="alert-user-active">
            <span id="alert-user-active-message"></span>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>`)
                        $('#alert-user-active-message').text(data.message)
                        $('#alert-user-active').fadeIn()
                    } else {
                        if (data.typeError == 'user') {
                            $('#username-input').parent().attr('data-validate', data.message)
                            showValidate($('#username-input'))
                        }
                    }
                } else {
                    $('#alert').html(`<div class="alert alert-data alert-dismissible fade show" role="alert" style="display:none" id="alert-user-active">
            <span id="alert-user-active-message"></span>
            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>`)
                    $('#alert-user-active-message').text(data.message)
                    $('#alert-user-active').fadeIn()
                }
            })
    })
    </script>
</body>

</html>