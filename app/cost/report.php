<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
include(PARTIALS_PATH . "verify_session.php") ?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <title>
    Reporte General | Tezlik
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
    .tableFixHead {
      overflow-y: auto;
      height: 400px;
    }

    .tableFixHead thead th {
      position: sticky;
      top: 0;
    }

    /* Just common table stuff. Really. */
    table {
      border-collapse: collapse;
      width: 100%;
    }

    th,
    td {
      padding: 8px 16px;
    }

    th {
      background: #eee;
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

    .quantity {
      padding-right: 30px;
    }

    #reporte-numeros input {
      text-align: right;
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
        <div class="row">
          <div class="col-md-12 text-center">
            <h3>Reporte General</h3>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6">
            <div class="row">
              <div class="col-md-12 col-sm-12">
                <div class="card ">
                  <div class="card-header ">
                    <h5 class="card-title">Costos</h5>
                  </div>
                  <div class="card-body ">
                    <canvas id="chartCost" height="200"></canvas>
                    <canvas id="chartCostPdf" height="200" style="display:none"></canvas>
                    <canvas id="chartProcess" height="200" style="display:none"></canvas>
                    <canvas id="chartLaborCost" height="200" style="display:none"></canvas>
                    <canvas id="chartExpensesGeneral" height="200" style="display:none"></canvas>
                    <canvas id="chartRawMaterialsCost" height="200" style="display:none"></canvas>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12">
                <div class="card" style="height: 400px;">
                  <div class="card-body">
                    <div class="table-responsive tableFixHead" style="height: 380px;">
                      <table class="table" id="tableProducts">
                        <thead class="text-primary">
                          <th>Referencia</th>
                          <th>Producto</th>
                          <th>Cantidad</th>
                        </thead>
                        <tbody>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-6" id="reporte-numeros">
            <div class="form-group row justify-content-center">
              <label for="select-product" class="col-form-label col-md-6 text-center text-primary"><b>Producto Cotizado</b></label>
              <div class="col-md-6">
                <select id="select-product" class="custom-select"></select>
              </div>
            </div>
            <br>
            <div class="row">
              <div class="col-12 text-uppercase text-center text-success">
                <b id="title-product"></b>

              </div>
              <div class="col-12 text-uppercase text-center ">
                <a class="btn-product" id="link-indicators" target="_blank"></a>
                <a class="btn-product" id="link-simulation" href="javascript:simulationCost()"></a>
              </div>
            </div>
            <br>
            <div class="row my-2 mb-4 align-items-center">
              <div class="col-md-5 col-5 col-sm-5 col-xs-5 text-primary">
                <strong>Cantidad</strong>
              </div>
              <div class="col-md-4 col-4 col-sm-4 col-xs-4">
                <input type="number" class="form-control quantity-product" readonly>
              </div>
              <div class="col-md-3 col-3 col-sm-3 col-xs-3">
                <input type="number" class="form-control  quantity-product" readonly>
              </div>
            </div>
            <div class="row my-2 align-items-center">
              <div class="col-md-5 col-sm-5 col-5 text-center text-primary">
                <strong>Detalle</strong>
              </div>
              <div class="col-md-4 col-sm-4 col-4 text-primary text-center">
                <strong>COP</strong>
              </div>
              <div class="col-md-3 col-sm-3 col-3 text-primary text-center">
                <strong>%Participacion</strong>
              </div>
            </div>

            <div class="row my-2 align-items-center">
              <div class="col-md-5 col-5 text-primary">
                <strong>Precio de Venta</strong>
              </div>
              <div class="col-md-4 col-4">
                <input type="text" class="form-control number" readonly id="precioVentaCOP">
              </div>
              <div class="col-md-3 col-3">
                <input type="text" class="form-control" readonly id="precioVentaUSD">
              </div>
            </div>
            <div class="row my-2 align-items-center">
              <div class="col-md-5 col-5 text-primary">
                <strong>Total Costos</strong>
              </div>
              <div class="col-md-4 col-4">
                <input type="text" class="form-control number" readonly id="totalCostosCOP">
              </div>
              <div class="col-md-3 col-3">
                <input type="text" class="form-control" readonly id="totalCostosUSD">
              </div>
            </div>
            <div class="row my-2 align-items-center">
              <div class="col-md-5 col-5 text-primary">
                <strong>Costos</strong>
              </div>
              <div class="col-md-4 col-4">
                <input type="text" class="form-control number" readonly id="CostoCOP">
              </div>
              <div class="col-md-3 col-3">
                <input type="text" class="form-control" readonly id="CostoUSD">
              </div>
            </div>
            <div class="row my-2 align-items-center">
              <div class="col-md-5 col-5 pl-5">
                Materia Prima
              </div>
              <div class="col-md-4 col-4">
                <input type="text" class="form-control number" readonly id="materiaPrimaCOP">
              </div>
              <div class="col-md-3 col-3">
                <input type="text" class="form-control" readonly id="materiaPrimaUSD">
              </div>
            </div>
            <div class="row my-2 align-items-center">
              <div class="col-md-5 col-5 pl-5">
                Mano de obra
              </div>
              <div class="col-md-4 col-4">
                <input type="text" class="form-control number" readonly id="manoObraCOP">
              </div>
              <div class="col-md-3 col-3">
                <input type="text" class="form-control" readonly id="manoObraUSD">
              </div>
            </div>
            <div class="row my-2 align-items-center">
              <div class="col-md-5 col-5 pl-5">
                Costos indirectos de Fabricación
              </div>
              <div class="col-md-4 col-4">
                <input type="text" class="form-control number" readonly id="costosIndirectosCOP">
              </div>
              <div class="col-md-3 col-3">
                <input type="text" class="form-control" readonly id="costosIndirectosUSD">
              </div>
            </div>
            <div class="row my-2 align-items-center">
              <div class="col-md-5 col-5 text-primary">
                <strong>Gastos</strong>
              </div>
              <div class="col-md-4 col-4">
                <input type="text" class="form-control number" readonly id="gastosCOP">
              </div>
              <div class="col-md-3 col-3">
                <input type="text" class="form-control" readonly id="gastosUSD">
              </div>
            </div>
            <div class="row my-2 align-items-center">
              <div class="col-md-5 col-5 pl-5">
                Gastos Generales
              </div>
              <div class="col-md-4 col-4">
                <input type="text" class="form-control number" readonly id="gastosGeneralesCOP">
              </div>
              <div class="col-md-3 col-3">
                <input type="text" class="form-control" readonly id="gastosGeneralesUSD">
              </div>
            </div>
            <div class="row my-2 align-items-center">
              <div class="col-md-5 col-5 pl-5">
                Comision de Ventas
              </div>
              <div class="col-md-4 col-4">
                <input type="text" class="form-control number" readonly id="comisionCOP">
              </div>
              <div class="col-md-3 col-3">
                <input type="text" class="form-control" readonly id="comisionUSD">
              </div>
            </div>
            <div class="row my-2 align-items-center">
              <div class="col-md-5 col-5 text-primary">
                <strong>Rentabilidad</strong>
              </div>
              <div class="col-md-4 col-4">
                <input type="text" class="form-control number" readonly id="rentabilidadCOP">
              </div>
              <div class="col-md-3 col-3">
                <input type="text" class="form-control" readonly id="rentabilidadUSD">
              </div>
            </div>
            <div style="text-align:center; margin-top:10%">
              <button class="btn btn-primary" id="downloaad-pdf">Generar Reporte</button>
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
  <script src="/vendor/numberFormat/jquery.number.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/mathjs/6.2.1/math.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.5.3/jspdf.debug.js"></script>
  <script src="https://unpkg.com/jspdf-autotable@3.2.8/dist/jspdf.plugin.autotable.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>
  <script src="/vendor/base64/base64.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/crypto-js@3.1.9-1/index.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/crypto-js@3.1.9-1/aes.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/crypto-js@3.1.9-1/core.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/crypto-js@3.1.9-1/crypto-js.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/crypto-js@3.1.9-1/enc-base64.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/crypto-js@3.1.9-1/enc-hex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/crypto-js@3.1.9-1/enc-latin1.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/crypto-js@3.1.9-1/cipher-core.min.js"></script>
  <script>
    $('#sidebar-parametrizar-item').removeClass('active')
    $('#sidebar-costear-item').addClass('active')

    
  </script>
  <script src="/js/RedondeoDecimal.js"></script>
  <script src="/js/reporte.js"></script>
  <script src="/js/app/indicators_report.js"></script>
  <script src="/js/app/reportPdf.js"></script>
</body>

</html>
