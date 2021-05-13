<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
include(PARTIALS_PATH . "verify_session.php") ?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <title>
    PDF Cotización | Tezlik
  </title>
  <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no' name='viewport' />
  <!--     Fonts and icons     -->
  <link rel="stylesheet" href="./../../node_modules/elegant-crud-datatable/build/index.css">
  <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700,200" rel="stylesheet" />
  <link href="/vendor/font-awesome/font-awesome.min.css" rel="stylesheet">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js"></script>
  <script src="https://unpkg.com/jspdf-autotable@3.2.8/dist/jspdf.plugin.autotable.js"></script>
  <!-- CSS Files -->
  <link href="/app/assets/css/bootstrap.min.css" rel="stylesheet" />
  <link href="/app/assets/css/paper-dashboard.css" rel="stylesheet" />
  <link rel="stylesheet" href="/vendor/dataTables/jquery.dataTables.min.css">
  <link rel="stylesheet" href="/vendor/dataTables/dataTables.bootstrap4.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css">
  <link rel="stylesheet" href="/vendor/froala-editor/froala_editor.pkgd.min.css">
  <style>
      #footer {
        background-image: url("./images/PiePagina.png");
        background-size: contain;
        background-repeat: no-repeat;
        height: 165px;
      }

      #mano-obra-subtitle {
        background-image: url("./images/Separadores_MO.png");
        background-size: contain;
        background-repeat: no-repeat;
        height: 55px;
      }

      #materias-primas-subtitle {
        background-image: url("./images/Separadores_MP.png");
        background-size: contain;
        background-repeat: no-repeat;
        height: 55px;
      }

      #servicios-externos-subtitle {
        background-image: url("./images/Separadores_SE.png");
        background-size: contain;
        background-repeat: no-repeat;
        height: 55px;
      }

      #consolidacion-subtitle {
        background-image: url("./images/Separadores_Cons.png");
        background-size: contain;
        background-repeat: no-repeat;
        height: 55px;
      }
    </style>
  </style>
</head>

<body>  
  <!--   Core JS Files   -->
  <script src="/app/assets/js/core/jquery.min.js"></script>
  <script src="/app/assets/js/core/popper.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/5.5.2/bootbox.min.js"></script>
  <script src="/app/assets/js/plugins/perfect-scrollbar.jquery.min.js"></script>
  <script src="/vendor/dataTables/jquery.dataTables.min.js"></script>
  <script src="/vendor/dataTables/dataTables.bootstrap4.min.js"></script>
  <script src="/vendor/numberFormat/jquery.number.min.js"></script>

  <!--  Notifications Plugin    -->
  <script src="/app/assets/js/plugins/bootstrap-notify.js"></script>
  <script src="/js/utils/html2canvas.js"></script>
  <script src="/js/ReporteProcesos/index.js" type="module"></script>
  <script src="/js/utils/loadPDFHTML.js" type="module"></script>
</body>

</html>
