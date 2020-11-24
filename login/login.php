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
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.css">
  <style>
    .link {
      color: #212529;
      font-size: 16px;
      font-family: Poppins-Regular, sans-serif;
      color: #808080;
      
    }
    .login,
      .image {
           min-height: 100vh;
    }

    .bg-image {
        /**background-image: url('https://res.cloudinary.com/mhmd/image/upload/v1555917661/art-colorful-contemporary-2047905_dxtao7.jpg');**/
        background-image: url('../upload/img/consulting_teenus.jpg');
        background-size: cover;
        background-position: center center;
    }
  </style>
</head>

<body>
<div class="container-fluid">
            <div class="row no-gutter">
                <!-- The image half -->
                <div class="col-md-6 d-none d-md-flex bg-image"></div>
                <!-- The content half -->
                <div class="col-md-6" style="background:white;">
                    <div class="login d-flex align-items-center py-5">
        
                        <!-- Demo content-->
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-10 col-xl-7 mx-auto">
                                <div class="login100-form-title mb-3" style="background-image: url();">
                                    <span class="login100-form-title-1 ">
                                      <img src="../upload/img/logo_tezlik.png" alt="logo tezlik" style="width:70%">
                                    </span>
                                    </div>
                                    <form id="form-login">
                                        <div class="form-group mb-3">
                                          <span class="label-input100"></span>
                                          <input class="input100" type="text" id="username-input" name="username" placeholder="Usuario" style="background: ghostwhite;" value="<?= isset($_COOKIE["username_remember_me"]) ? $_COOKIE["username_remember_me"] : "" ?>">
                                          <span class="focus-input100"></span>
                                        </div>
                                        <div class="form-group mb-3">
                                          <span class="label-input100"></span>
                                          <input class="input100" type="password" id="pass" name="password" placeholder="Contraseña" style="background: ghostwhite;">
                                        <span class="focus-input100"></span>
                                        </div>
                                        <div class="custom-control custom-checkbox mb-3">
                                            <input id="ckb1" type="checkbox" checked class="custom-control-input">
                                            <label for="ckb1" class="custom-control-label" style="font-size: 13px; font-family: 'Poppins-Regular';">Recordarme</label>
                                        </div>
                                        <button type="submit" class="btn btn-primary btn-block text-uppercase mb-2 rounded-pill shadow-sm">Ingresar</button>
                                        <div class="text-center d-flex justify-content-between mt-4"> <a href="remember_pass.php" id="text-recover-pass" class="txt1 pull-right">
                                          ¿Olvidaste tu usuario o contraseña?
                                        </a> </div>
                                        
                                        <div id="alert">

                                        </div>
                                        <div class="mt-5">
                                        <p style="text-align: center;">Un producto de <strong>Teenus SAS</strong></p>    
                                    </div>
                                    </form>
                                </div>
                            </div>
                        </div><!-- End -->
                    </div>
                </div><!-- End -->
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
  <script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/latest/toastr.min.js" ></script>
  <script src="/js/main.js"></script>
  <script>

if(localStorage.getItem('usersLogins')) {
  const storedUsers = JSON.parse(localStorage.getItem('usersLogins'));
    
    const lastLoggedUser = storedUsers[storedUsers.length - 1];

    $.ajax({
      url: '/partials/DeactivateUser.php',
      type: 'POST',
      data: { lastUser: lastLoggedUser },
      success: function(data, status) {
      }
    });
}



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
                //showValidate($('#username-input'))
               toastr.error(data.message, 'Error de login',{
                 "progressBar":true
                
               })
              } else if (data.typeError == 'password') {
                $('#pass').parent().attr('data-validate', data.message)
                //showValidate($('#pass'))
                toastr.error(data.message, 'Error de login',{
                  "progressBar":true
                })
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
