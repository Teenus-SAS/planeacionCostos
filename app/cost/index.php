<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
include(PARTIALS_PATH . "verify_session.php") ?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <title>
    Analisis de Costos | Tezlik
  </title>
  <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no' name='viewport' />
  <!--     Fonts and icons     -->
  <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700,200" rel="stylesheet" />
  <link href="/vendor/font-awesome/font-awesome.min.css" rel="stylesheet">
  <!-- CSS Files -->
  <link href="/app/assets/css/bootstrap.min.css" rel="stylesheet" />
  <link href="/app/assets/css/paper-dashboard.css" rel="stylesheet" />
  <!-- CSS Just for demo purpose, don't include it in your project -->
  <link href="/app/assets/demo/demo.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css">
  <link rel="stylesheet" href="/vendor/froala-editor/froala_editor.pkgd.min.css">

  <style>
    .v-center {
      min-height: 200px;
      display: flex;
      justify-content: center;
      flex-flow: column wrap;
    }

    .id-product {
      display: none;
    }


    .list-group {
      height: 600px;
      overflow-y: auto;
    }

    #list1 .title.mar,
    .quantity,
    #list2 .title.mar {
      padding-right: 30px;
    }

    .ref-product {
      width: 90px;
    }

    .product-name {
      overflow: hidden;
      max-width: 80px;
    }
  </style>
</head>

<body class="">
  <div class="wrapper ">
    <?php include(PARTIALS_PATH . "sidebar.php") ?>
    <div class="main-panel">
      <!-- Navbar -->
      <?php include(PARTIALS_PATH . "navbar.php") ?>
      <!-- End Navbar -->

      <div class="content">
        <div class="row justify-content-center">
          <div class="col-md-12 col-12 text-center">
            <h3>Selección De Productos</h3>
          </div>

        </div>
        <div class="row mb-2">
          <div class="col-sm-5 col-12 col-sm-offset-1">
            <div class="form-group">
              <select class="form-control" id="select-lineas">
              </select>
            </div>
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-sm-5 col-12 col-sm-offset-1">
            <div class="input-group">
              <input type="text" id="search-product" placeholder="Buscar" class="form-control">
              <div class="input-group-append">
                <button class="btn m-0"><i class="fas fa-search"></i></button>
              </div>
            </div>
          </div>
        </div>

        <div class="row justify-content-center">
          <div class="col-sm-5 col-12 col-sm-offset-1">
            <div class="list-group" id="list1">
              <a href="#" class="list-group-item active" style="background:#51cbce;"> <span class="pull-left">Referencia</span> <span class="pull-right">Seleccion De Productos</span> <input title="toggle all" type="checkbox" class="all pull-right"></a>
            </div>
          </div>
          <div class="col-md-2 col-6 v-center text-canter">
            <button title="Agregar a la lista" class="btn btn-default center-block add" style="background:#51cbce;"><i class="nc-icon nc-minimal-right"></i></button>
            <button title="Quitar de la lista" class="btn btn-default center-block remove" style="background:#51cbce;"><i class="nc-icon nc-minimal-left"></i></button>
            <div class="col-md-2 col">
              <button class="btn btn-primary btn-round" id="btn-procesar">Procesar</button>
            </div>
          </div>
          <div class="col-sm-5 col-12">
            <div class="list-group" id="list2">
              <a href="#" class="list-group-item active title" style="background:#51cbce;"><span class="pull-left">Referencia</span>
                <input title="toggle all" type="checkbox" class="all pull-right"><span class="pull-right quantity">Cantidad</span><span class="pull-right title mar">Productos</span></a>
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
    $('#sidebar-analisis-item').removeClass('active')
    $('#sidebar-costear-item').addClass('active')
  </script>
  <script src="/js/costeo_productos.js"></script>
</body>

</html>
