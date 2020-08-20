<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
include(PARTIALS_PATH . "verify_session.php") ?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no' name='viewport' />
  <title>
    EQUOTE
  </title>

  <!--     Fonts and icons     -->
  <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700,200" rel="stylesheet" />
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css" rel="stylesheet">
  <!-- CSS Files -->
  <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
  <link rel="stylesheet" href="/css/app.css">
</head>

<body>
  <nav class="navbar navbar-expand-lg navbar-light bg-light ">
    <div class="navbar-header">
      <a class="navbar-brand text-white" href="/app/my-profile">
        <!-- <button type="button" id="sidebarCollapse" class="btn btn-info">
    <i class="fas fa-align-left"></i>
  </button> -->
        <img src="<?= $user->getCompany()->getLogo() ?>" height="40" class="d-inline-block align-top" alt="logo de empresa">
        <?= $user->getCompany()->getTradeName() ?>
      </a>
    </div>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="nav navbar-nav mr-auto">
      </ul>
      <ul class="nav navbar-nav ">
        <li class="nav-item ">
          <a class="nav-link nav-bar-item" href="/app/config-general">Configuración</a>
        </li>
        <li class="nav-item">
          <a class="nav-link nav-bar-item" href="javascript:logout()">Cerrar Sesión</a>
        </li>
      </ul>
    </div>


  </nav>
  <div class="wrapper">

    <!-- Sidebar -->
    <nav id="sidebar">
      <div class="sidebar-card text-center ">
        <h1><?= $user->getCompany()->getProfitabilityMargin() ?> %</h1>
        <h3>Rentabilidad
        </h3>
      </div>
    </nav>
    <!-- Page Content -->
    <div id="content">

      <div class="row align-items-center" style="height: 100%;">
        <div class="col"></div>
        <div class="col-10 col-sm-6 col-md-6">
          <div style="border: 20px solid rgba(206,206,208,0.6);border-radius: 50px;">
            <a href="/app/cost" class="btn btn-primary btn-round btn-block" style="font-size: 2rem;border-radius: 50px;">Cotizar</a>
          </div>
        </div>
        <div class="col"></div>
      </div>

    </div>
  </div>


  <!-- Image and text -->
  <!-- 
 -->

  <!--   Core JS Files   -->
  <script src="/app/assets/js/core/jquery.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
  <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/malihu-custom-scrollbar-plugin/3.1.5/jquery.mCustomScrollbar.concat.min.js"></script>
  <script>
    $(document).ready(function() {

      $("#sidebar").mCustomScrollbar({
        theme: "minimal"
      });

      $('#sidebarCollapse').on('click', function() {
        // open or close navbar
        $('#sidebar').toggleClass('active');
        // close dropdowns
        $('.collapse.in').toggleClass('in');
        // and also adjust aria-expanded attributes we use for the open/closed arrows
        // in our CSS
        $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      });

    });

    function logout() {
      $.get('/login/api/logout.php', (data, status) => {
        location.href = "/login"
      })
    }
  </script>
</body>

</html>