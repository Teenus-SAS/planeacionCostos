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
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js"></script>
  <script src="https://unpkg.com/jspdf-autotable@3.2.8/dist/jspdf.plugin.autotable.js"></script>
  <!-- CSS Files -->
  <link href="/app/assets/css/bootstrap.min.css" rel="stylesheet" />
  <link href="/app/assets/css/paper-dashboard.css" rel="stylesheet" />
  <link rel="stylesheet" href="/vendor/dataTables/jquery.dataTables.min.css">
  <link rel="stylesheet" href="/vendor/dataTables/dataTables.bootstrap4.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css">
  <link rel="stylesheet" href="/vendor/froala-editor/froala_editor.pkgd.min.css">
  <link rel="stylesheet" href="./../../node_modules/elegant-crud-datatable/build/index.css">
  <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
  <style>
    
    html {
      scroll-behavior: smooth;
    }
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
      <?php include(PARTIALS_PATH . "navbar.php") ?>
      <div class="content"  id="main-panel-content">
        <div id="crud-content" class="row">
          <h1 class="text-xl text-center mb-1 w-full col-12">Reportes</h1>
          <div id="new-reporte-proceso" class="col-4 my-3">      
            <div class="card px-5 py-2">
              <h1 class="text-normal text-xl text-center mb-4 mt-2">Nuevo reporte</h1>
              <form>
                <div class="row align-items-end py-2  justify-content-center">
                  <div class="col-12">
                    <div class="form-group">
                      <label class="w-full text-center col-form-label">Producto</label>
                      <select class="custom-select" id="select-producto-reporte" name="producto">
                      </select>
                    </div>
                  </div>
                  <div class="col-12">
                    <div class="form-group">
                      <label class="w-full text-center col-form-label">Cantidad</label>
                      <input class="form-control" id="input-cantidad-producto-reporte" name="cantidad" type="number"/>
                    </div>
                  </div>
                  <div class="col-12">
                    <button id="new-reporte-procesos-button" class="w-full btn btn-primary" type="submit" title="Ver Reporte">Reporte</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div id="reportes-table" class="col-8 card-body">
            <div class="table-responsive tableFixHead">
              <table class="table" id="reportes-jquery-datatable">
                <thead class="text-primary">
                  <th>Consecutivo</th>
                  <th>Cliente</th>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th></th>
                </thead>
                <tbody>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div id="reporte-procesos-content" class="col-12 card relative" hidden="true">
          <div id="close-button" class="mt-2 absolute cursor-pointer">
            <i class="nc-icon nc-simple-remove text-2xl"></i>
          </div>
          <div class="row align-items-around">
            <div id="generate-reporte-pdf" class="col-12 pt-5">
              <div id="form-datos-reporte-procesos">
                <form>
                <option id="option-id-producto-reporte" hidden="true" value=""></option>
                  <div class="card py-2">
                    <div class="row my-2 justify-content-center">
                      <div class="col-md-11 col-11">
                        <div class="form-group">
                          <input id="input-consecutivo-reporte" class="form-control " type="text" name="consecutivo" placeholder="N° Consecutivo">
                        </div>
                      </div>
                      <div class="col-md-11 col-11">
                        <div class="form-group">
                          <input id="input-cliente-reporte" class="form-control" type="text" name="cliente" placeholder="Cliente">
                        </div>
                      </div>
                      <div class="col-md-11 col-11">
                        <div class="form-group">
                          <input id="input-ciudad-reporte" class="form-control" type="text" name="ciudad" placeholder="Ciudad"/>
                        </div>
                      </div>
                      <div class="col-11">
                        <button id="generar-pdf-reporte-procesos" class="btn btn-primary" type="submit">Generar PDF y guardar reporte</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div id="individual-reporte-procesos" class="col-12 pr-5 mt-4">
              <h2 class="text-2xl text-center font-normal py-3">Procesos</h2>
              <div id="reporte-procesos-table">
              </div>
              <h2 class="text-2xl text-center font-ligth">Materia Prima</h2>
              <div id="materias-reporte-procesos-table"></div>
              <h2 class="text-2xl text-center font-ligth">Servicios Externos</h2>
              <div id="servicios-externos-reporte-procesos-table"></div>
              <h2 class="text-2xl text-center font-ligth">Costeo</h2>
              <div id="costeo-reporte-procesos-table"></div>
            </div>
          </div>
        </div>
        <?php include(PARTIALS_PATH . "footer.html") ?>
      </div>
    </div>
  </div>
  <!--   Core JS Files   -->
  <script src="/app/assets/js/core/jquery.min.js"></script>
  <script src="/app/assets/js/core/popper.min.js"></script>
  <script src="/app/assets/js/core/bootstrap.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/5.5.2/bootbox.min.js"></script>
  <script src="/app/assets/js/plugins/perfect-scrollbar.jquery.min.js"></script>
  <script src="/vendor/dataTables/jquery.dataTables.min.js"></script>
  <script src="/vendor/dataTables/dataTables.bootstrap4.min.js"></script>
  <script src="/vendor/numberFormat/jquery.number.min.js"></script>
  <!-- Chart JS -->
  <script src="/app/assets/js/plugins/chartjs.min.js"></script>
  <!--  Notifications Plugin    -->
  <script src="/app/assets/js/plugins/bootstrap-notify.js"></script>
  <!-- Control Center for Now Ui Dashboard: parallax effects, scripts for the example pages etc -->
  <script src="/app/assets/js/paper-dashboard.min.js?v=2.0.0" type="text/javascript"></script>
  <script src="/vendor/numberFormat/jquery.number.min.js"></script>
  <script src="/js/toggleSidebar.js"></script>
  <script src="/js/utils/PriceParser.js"></script>
  <script src="/js/utils/fillSelect.js" type="module"></script>
  <script src="/js/ReporteProcesos/index.js" type="module"></script>
</body>

</html>