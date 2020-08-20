<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
include(PARTIALS_PATH . "verify_session.php") ?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <title>
    Conversor de unidades | EQUOTE
  </title>
  <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no' name='viewport' />
  <!--     Fonts and icons     -->
  <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700,200" rel="stylesheet" />
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css" rel="stylesheet">
  <!-- CSS Files -->
  <link href="/app/assets/css/bootstrap.min.css" rel="stylesheet" />
  <link href="/app/assets/css/paper-dashboard.css?v=2.0.0" rel="stylesheet" />
  <!-- CSS Just for demo purpose, don't include it in your project -->
  <link href="/app/assets/demo/demo.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css">
  <link rel="stylesheet" href="/vendor/froala-editor/froala_editor.pkgd.min.css">
  <style>
    .simbol {
      font-size: 4rem;
      font-weight: bold;
    }
  </style>
</head>

<body class="">
  <div class="wrapper ">
    <?php include(PARTIALS_PATH . "sidebar.php") ?>
    <div class="main-panel">
      <!-- Navbar -->
      <?php include(PARTIALS_PATH . "navbar.html") ?>
      <!-- End Navbar -->

      <div class="content">
        <div class="card">
          <div class="card-header text-center text-capitalize">
            <h4 class="header-title">Conversor</h4>
          </div>
          <div class="card-body">
            <div class="row justify-content-center align-items-center">
              <div class="col-12">
                <div class="form-group">
                  <label for="select-type-conversor">Tipo de conversion</label>
                  <select id="select-type-conversor" class="custom-select">
                    <option value="longuitud">Longitud</option>
                    <option value="masa">Masa</option>
                    <option value="volumen">Volumen</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="row justify-content-center align-items-center">
              <div class="col-5">
                <div class="row">
                  <div class="col-12">
                    <div class="form-group mb-0">
                      <input type="number" id="unit-1" class="form-control input-unit" placeholder="" aria-describedby="helpId">
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-group">
                      <select class="custom-select units" id="select-unit-1">
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div class="col-2 text-center text-gray simbol">
                =
              </div>
              <div class="col-5">
                <div class="row">
                  <div class="col-12">
                    <div class="form-group mb-0">
                      <input type="number" id="unit-2" class="form-control input-unit" placeholder="" aria-describedby="helpId">
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-group">
                      <select class="custom-select units" id="select-unit-2">

                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
      <!-- footer -->
      <?php include(PARTIALS_PATH . "footer.html") ?>
      <!-- end footer -->
    </div>
  </div>
  <!--   Core JS Files   -->
  <script src="/app/assets/js/core/jquery.min.js"></script>
  <script src="/app/assets/js/core/jquery.min.js"></script>
  <script src="/app/assets/js/core/popper.min.js"></script>
  <script src="/app/assets/js/core/bootstrap.min.js"></script>
  <script src="/app/assets/js/plugins/perfect-scrollbar.jquery.min.js"></script>
  <!-- Chart JS -->
  <script src="/app/assets/js/plugins/chartjs.min.js"></script>
  <!--  Notifications Plugin    -->
  <script src="/app/assets/js/plugins/bootstrap-notify.js"></script>
  <!-- Control Center for Now Ui Dashboard: parallax effects, scripts for the example pages etc -->
  <script src="/app/assets/js/paper-dashboard.min.js?v=2.0.0" type="text/javascript"></script>
  <!-- Paper Dashboard DEMO methods, don't include it in your project! -->
  <script src="/app/assets/demo/demo.js"></script>
  <script>
    $('#sidebar-parametrizar-item').removeClass('active')
    $('#sidebar-conversor-item').addClass('active')
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/6.2.1/math.min.js"></script>
  <script src="/js/conversor.js"></script>
</body>

</html>