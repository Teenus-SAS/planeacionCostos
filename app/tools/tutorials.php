<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
include(PARTIALS_PATH . "verify_session.php");
$data = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/resources/youtube_tutorials.json'), true);
?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <title>
  Tutoriales | Tezlik
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
  <link rel="stylesheet" href="/vendor/owlCarousel/owl.carousel.min.css">
  <link rel="stylesheet" href="/vendor/owlCarousel/owl.theme.default.min.css">
  <style>
    .video-responsive {
      position: relative;
      padding-bottom: 56.25%;
      /* 16/9 ratio */
      padding-top: 30px;
      /* IE6 workaround*/
      height: 0;
      overflow: hidden;
    }

    .video-responsive iframe,
    .video-responsive object,
    .video-responsive embed {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
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
        <div class="row justify-content-center mb-3">
          <div class="col-1 col-md-3">
          </div>
          <div class="col-10 col-md-6" id="carousel_banner">
            <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
              <ol class="carousel-indicators">
                <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
              </ol>
              <div class="carousel-inner">
                <?php foreach ($data["banner"] as $key => $video) { ?>
                  <div class="carousel-item <?= $key == 0 ? "active" : "" ?>">
                    <div class="video-responsive">
                      <iframe src="https://www.youtube.com/embed/<?= $video ?>" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                  </div>
                <?php } ?>
              </div>
              <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                <span class="sr-only">Previous</span>
              </a>
              <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                <span class="sr-only">Next</span>
              </a>
            </div>
          </div>
          <div class="col-1 col-md-3"></div>
        </div>
        <div class="container">
          <h3>Configuración General</h3>
          <hr>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="owl-carousel owl-theme" id="config_video">
              <?php foreach ($data["config-general"] as $key => $value) { ?>
                <div>
                  <div class="video-responsive">
                    <iframe src="https://www.youtube.com/embed/<?= $value ?>" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  </div>
                </div>
              <?php
              } ?>
            </div>
          </div>
        </div>
        <div class="container">
          <h3>Configuración de Productos</h3>
          <hr>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="owl-carousel owl-theme" id="products_video">
              <?php foreach ($data["products"] as $key => $value) { ?>
                <div>
                  <div class="video-responsive">
                    <iframe src="https://www.youtube.com/embed/<?= $value ?>" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  </div>
                </div>
              <?php
              } ?>

            </div>
          </div>
        </div>
        <div class="container">
          <h3>Costear</h3>
          <hr>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="owl-carousel owl-theme" id="cost_video">
            <?php foreach ($data["cost"] as $key => $value) { ?>
                <div>
                  <div class="video-responsive">
                    <iframe src="https://www.youtube.com/embed/<?= $value ?>" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  </div>
                </div>
              <?php
              } ?>
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
  <script src="/vendor/owlCarousel/owl.carousel.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"></script>
  <script>
    $('#sidebar-parametrizar-item').removeClass('active')
    $('#sidebar-tutorial-item').addClass('active')

    $('.owl-carousel').owlCarousel({
      loop: true,
      margin: 10,
      responsiveClass: true,
      video: true,
      merge: true,
      nav: false,
      dots: true,
      responsive: {
        0: {
          items: 1,
          dots: true,
        },
        600: {
          items: 2,
          dots: true,
        },
        1000: {
          items: 3,
          dots: true,
          loop: false
        }
      }
    })
    /*
        $.get('/admin/api/get_tutorials.php', (data, status) => {
          let stringBanner = ''
          data.banner.forEach((banner, index) => {
            stringBanner += `<div class="carousel-item ${index == 0 ? '': 'active'}">
                      <div class="video-responsive">
                        <iframe src="https://www.youtube.com/embed/${banner}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                      </div>
                    </div>`
          })
          $('#carousel_banner').html(`<div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                  <ol class="carousel-indicators">
                    <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
                    <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
                  </ol>
                  <div class="carousel-inner">
                  ${stringBanner}
                  </div>
                  <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="sr-only">Previous</span>
                  </a>
                  <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="sr-only">Next</span>
                  </a>
                </div>`)


          $('#config-general').html('')
          data["config-general"].forEach((config) => {
            $('#config_video').append(`<div>
                    <div class="video-responsive">
                      <iframe src="https://www.youtube.com/embed/${config}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                  </div>`)
          })
          $('#products_video').html('')
          data.products.forEach(product => {
            $('#products_video').append(`<div>
                    <div class="video-responsive">
                      <iframe src="https://www.youtube.com/embed/${product}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                  </div>`)
          })
          $('#cost_video').html('')
          data.cost.forEach(cost => {
            $('#products_video').append(`<div>
                    <div class="video-responsive">
                      <iframe src="https://www.youtube.com/embed/${cost}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                    </div>
                  </div>`)

          })
        })*/
  </script>
</body>

</html>