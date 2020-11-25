<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
include(PARTIALS_PATH . "verify_session.php") ?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <title>
    Calculadora de horas Extra | Tezlik
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
    @media (max-width: 600px) {
      #card-hours {
        font-size: 11px;
      }
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
      <!-- <div class="panel-header panel-header-lg">

  <canvas id="bigDashboardChart"></canvas>


</div> -->
      <div class="content">
        <div class="container">
          <div class="row justify-content-center align-items-center">
            <div class="col-12 col-sm-12" style="display:none" id="result-calculator-he">
              <div class="card" id="card-hours">
                <div class="card-header">
                  <h4>Resultados</h4>
                </div>
                <div class="card-body">
                  <div class="row align-items-center">
                    <div class="col-3 text-left "></div>
                    <div class="col-3"><b class="text-success">Valor Hora</b></div>
                    <div class="col-3"><b class="text-success">Número de horas</b></div>
                    <div class="col-3"><b class="text-success">Total</b></div>
                  </div>
                  <hr class="my-1">
                  <div class="row align-items-center">
                    <div class="col-3 text-left "><span class="text-primary">Hora Ordinaria</span></div>
                    <div class="col-3"><span class="text-success" id="v_ho">$ 477323.00</span></div>
                    <div class="col-3"><input type="number" class="form-control" id="i_ho"></div>
                    <div class="col-3" id="vt_ho">$ 0,00</div>
                  </div>
                  <hr class="my-1">
                  <div class="row align-items-center">
                    <div class="col-3 text-left "><span class="text-primary">Hora extra diurna</span></div>
                    <div class="col-3"><span class="text-success" id="v_hed">$ 477323.00</span></div>
                    <div class="col-3"><input type="number" class="form-control" id="i_hed"></div>
                    <div class="col-3" id="vt_hed">$ 0,00</div>
                  </div>
                  <hr class="my-1">
                  <div class="row align-items-center">
                    <div class="col-3 text-left "><span class="text-primary">Hora nocturna</span></div>
                    <div class="col-3"><span class="text-success" id="v_hn">$ 477323.00</span></div>
                    <div class="col-3"><input type="number" class="form-control" id="i_hn"></div>
                    <div class="col-3" id="vt_hn">$ 0,00</div>
                  </div>
                  <hr class="my-1">
                  <div class="row align-items-center">
                    <div class="col-3 text-left "><span class="text-primary">Hora extra nocturna</span></div>
                    <div class="col-3"><span class="text-success" id="v_hen">$ 477323.00</span></div>
                    <div class="col-3"><input type="number" class="form-control" id="i_hen"></div>
                    <div class="col-3" id="vt_hen">$ 0,00</div>
                  </div>
                  <hr class="my-1">
                  <div class="row align-items-center">
                    <div class="col-3 text-left "><span class="text-primary">Recargo nocturno</span></div>
                    <div class="col-3"><span class="text-success" id="v_rn">$ 477323.00</span></div>
                    <div class="col-3"><input type="number" class="form-control" id="i_rn"></div>
                    <div class="col-3" id="vt_rn">$ 0,00</div>
                  </div>
                  <hr class="my-1">
                  <div class="row align-items-center">
                    <div class="col-3 text-left "><span class="text-primary">Hora ordinaria domingos/festivos</span></div>
                    <div class="col-3"><span class="text-success" id="v_hod">$ 477323.00</span></div>
                    <div class="col-3"><input type="number" class="form-control" id="i_hod"></div>
                    <div class="col-3" id="vt_hod">$ 0,00</div>
                  </div>
                  <hr class="my-1">
                  <div class="row align-items-center">
                    <div class="col-3 text-left "><span class="text-primary">Hora extra diurna domingos/festivos</span></div>
                    <div class="col-3"><span class="text-success" id="v_hedd">$ 477323.00</span></div>
                    <div class="col-3"><input type="number" class="form-control" id="i_hedd"></div>
                    <div class="col-3" id="vt_hedd">$ 0,00</div>
                  </div>
                  <hr class="my-1">
                  <div class="row align-items-center">
                    <div class="col-3 text-left "><span class="text-primary">Hora nocturna domingos/festivos</span></div>
                    <div class="col-3"><span class="text-success" id="v_hnd">$ 477323.00</span></div>
                    <div class="col-3"><input type="number" class="form-control" id="i_hnd"></div>
                    <div class="col-3" id="vt_hnd">$ 0,00</div>
                  </div>
                  <hr class="my-1">
                  <div class="row align-items-center">
                    <div class="col-3 text-left "><span class="text-primary">Hora extra nocturna domingos/festivos</span></div>
                    <div class="col-3"><span class="text-success" id="v_hend">$ 477323.00</span></div>
                    <div class="col-3"><input type="number" class="form-control" id="i_hend"></div>
                    <div class="col-3" id="vt_hend">$ 0,00</div>
                  </div>
                  <hr class="my-1">
                  <br>
                  <div class="row align-items-center">
                    <div class="col-3 text-left "><b class="text-primary">Total</b></div>
                    <div class="col-3"></div>
                    <div class="col-3"></div>
                    <div class="col-3" id="v_the">$ 0,00</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-12 col-sm-6">
              <div class="card">
                <div class="card-header">
                  <h4 class="card-title">Horas extras</h4>
                </div>
                <div class="card-body">
                  <form id="form-salary-hours-extra">
                    <div class="row">
                      <div class="col"></div>
                      <div class="col">
                        <div class="form-group">
                          <label for="salary-hours-extra">Salario:</label>
                          <input type="text" class="form-control-sm" id="salary-hours-extra" required>
                        </div>
                      </div>
                      <div class="col"></div>
                    </div>

                    <div class="row">
                      <div class="col"></div>
                      <div class="col"><button type="submit" class="btn btn-primary" id="submit-salary-hours-extra">Calcular horas</button></div>
                      <div class="col"></div>
                    </div>

                  </form>
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
    $('#sidebar-calculator-item').addClass('active')
  </script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"></script>
  <script src="/vendor/numberFormat/jquery.number.min.js"></script>
  <script src="/js/horas_extra.js"> </script>
</body>

</html>