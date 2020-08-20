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
        <div class="card">
          <div class="card-headaer">
            <h4 class="card-title">
              Banner
            </h4>
          </div>
          <div class="card-body">
            <div class="row justify-content-center container_video" id="video_banner">
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label for="my-input">Video</label>
                  <input id="my-input" class="form-control" type="text" name="">
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label for="my-input">Video</label>
                  <input id="my-input" class="form-control" type="text" name="">
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label for="my-input">Video</label>
                  <input id="my-input" class="form-control" type="text" name="">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-headaer">
            <h4 class="card-title">
              Configuracion General
            </h4>
          </div>
          <div class="card-body">
            <div class="row justify-content-center container_video" id="video_config">
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label for="my-input">Video</label>
                  <input id="my-input" class="form-control" type="text" name="">
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label for="my-input">Video</label>
                  <input id="my-input" class="form-control" type="text" name="">
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label for="my-input">Video</label>
                  <input id="my-input" class="form-control" type="text" name="">
                </div>
              </div>
            </div>
            <div class="row justify-content-center text-center">
              <div class="col"></div>
              <div class="col"><button class="btn btn-primary add_video"><i class="fas fa-plus"></i></button></div>
              <div class="col"></div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-headaer">
            <h4 class="card-title">
              Productos
            </h4>
          </div>
          <div class="card-body">
            <div class="row justify-content-center container_video" id="product_video">
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label for="my-input">Video</label>
                  <input id="my-input" class="form-control" type="text" name="">
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label for="my-input">Video</label>
                  <input id="my-input" class="form-control" type="text" name="">
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label for="my-input">Video</label>
                  <input id="my-input" class="form-control" type="text" name="">
                </div>
              </div>
            </div>
            <div class="row justify-content-center text-center">
              <div class="col"></div>
              <div class="col"><button class="btn btn-primary add_video" ><i class="fas fa-plus"></i></button></div>
              <div class="col"></div>
            </div>
          </div>
        </div>
        <div class="card">
          <div class="card-headaer">
            <h4 class="card-title">
              Costos
            </h4>
          </div>
          <div class="card-body">
            <div class="row justify-content-center container_video" id="cost_video">
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label for="my-input">Video</label>
                  <input id="my-input" class="form-control" type="text" name="">
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label for="my-input">Video</label>
                  <input id="my-input" class="form-control" type="text" name="">
                </div>
              </div>
              <div class="col-12 col-md-4">
                <div class="form-group">
                  <label for="my-input">Video</label>
                  <input id="my-input" class="form-control" type="text" name="">
                </div>
              </div>
            </div>
            <div class="row justify-content-center text-center">
              <div class="col"></div>
              <div class="col"><button class="btn btn-primary add_video" ><i class="fas fa-plus"></i></button></div>
              <div class="col"></div>
            </div>
          </div>
        </div>
        <div class="row justify-content-center text-center">
          <div class="col"></div>
          <div class="col"><button class="btn btn-primary" id="btn_save_videos">Guardar</button></div>
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

  <script>
    $('#sidebar-parametrizar-item').removeClass('active')
    $('#sidebar-youtube-item').addClass('acitve')
  </script>
  <script src="/js/admin/youtube.js"></script>
</body>

</html>