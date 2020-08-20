<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
include(PARTIALS_PATH . "verify_session_admin.php") ?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <title>
    EQUOTE | Admin
  </title>
  <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no' name='viewport' />
  <!--     Fonts and icons     -->
  <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700,200" rel="stylesheet" />
  <link href="/vendor/font-awesome/font-awesome.min.css" rel="stylesheet">
  <!-- CSS Files -->
  <link href="/app/assets/css/bootstrap.min.css" rel="stylesheet" />
  <link href="/app/assets/css/paper-dashboard.css?v=2.0.0" rel="stylesheet" />
  <!-- CSS Just for demo purpose, don't include it in your project -->
  <link href="/app/assets/demo/demo.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css">
</head>

<body class="">
  <div class="wrapper ">
    <?php include(PARTIALS_PATH . "sidebar_admin.php") ?>
    <div class="main-panel">
      <!-- Navbar -->
      <?php include(PARTIALS_PATH . "navbar_admin.html") ?>
      <!-- End Navbar -->
      <div class="content">
        <div class="row justify-content-center">
          <div class="col-6 text-center">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title">Salario Minimo</h5>
              </div>
              <div class="card-body">
                <div class="form-group">
                  <!-- <label for="input-salary-min">Salario minimo</label> -->
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text">$</div>
                    </div>
                    <input id="input-salary-min" class="form-control money" type="text">
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div class="col-6 text-center">
            <div class="card">
              <div class="card-header">
                <h5 class="card-title">Subsidio de transporte</h5>
              </div>
              <div class="card-body">
                <div class="form-group">
                  <!-- <label for="input-transport">Subsidio de transporte</label> -->
                  <div class="input-group">
                    <div class="input-group-prepend">
                      <div class="input-group-text">$</div>
                    </div>
                    <input id="input-transport" class="form-control money" type="text">
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row justify-content-center align-content-center">
          <div class="col"></div>
          <div class="col"><button class="btn btn-primary btn-round" id="saveParameters"> <i class="fas fa-save"></i>  Guardar Datos</button></div>
          <div class="col"></div>
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
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"></script>
  <script src="/vendor/numberFormat/jquery.number.min.js"></script>
  <script>
    $('#sidebar-parametrizar-item').removeClass('active')
    $('#sidebar-paremeters-item').addClass('active')
  </script>
  <script src="/js/admin/parameters.js"></script>
</body>

</html>