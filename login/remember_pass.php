<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Recordar Contraseña</title>

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
    <?php
    ini_set('display_errors', 1);
    ?>
    <div class="limiter">
        <div class="container-login100">
            <div class="" style="width:425px">
                <div class="login100-form-title" style="background-image: url();">
                    <span class="login100-form-title-1 mb-5">
                        <img src="../upload/img/logo_tezlik.png" width="50%" alt="logo costos Tezlik">
                        <img src="../upload/img/cyber-security-clave1.png" width="20%" alt="seguridad">
                    </span>
                </div>
                <div>

                </div>

                <form class="validate-form" id="form-login">
                    <h4 class="titulo_pass mb-3">Restablece tu contraseña</h4><br>
                    <p style="text-align:center;color:#14223b;">Ingresa la dirección de correo electrónico en la que deseas recibir la información para restablecer la contraseña.</p>
                    <label for="username-input" class="label-pass mt-3 mb-1">Dirección de correo o Usuario</label>
                    <!-- <span class="label-input100">Correo Electronico</span> -->
                    <div class="validate-input" data-validate="Nombre de Usuario es necesario">
                        <input class="form-control input-correo" type="text" id="username-input" name="username" value="<?= isset($_COOKIE["username_remember_me"]) ? $_COOKIE["username_remember_me"] : "" ?>">
                        <!-- <span class="focus-input100"></span> -->
                    </div>
                    <div class="container-login100-form-btn mt-4">
                        <button class="btn btn-info" style="width: inherit;">Restablece tu Contraseña</button>
                    </div>
                    <div class="titulo-volver">
                        <span>volver a </span><a href="/index.php"><b style="font-weight:100; color:#17a2b8;">tezliksoftware.com.co</b></a>
                    </div>
                    <div id="alert">
                    </div>

                </form>
                <footer class="copyright">
                    ©2021 Teenus SAS, Todos los derechos reservados.
                </footer>
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