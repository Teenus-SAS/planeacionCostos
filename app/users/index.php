<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
include(PARTIALS_PATH . "verify_session.php") ?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <title>
    Usuarios | Tezlik
  </title>
  <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no' name='viewport' />
  <!--     Fonts and icons     -->
  <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700,200" rel="stylesheet" />
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css" rel="stylesheet">
  <!-- CSS Files -->
  <link href="/app/assets/css/bootstrap.min.css" rel="stylesheet" />
  <link href="/app/assets/css/paper-dashboard.css?v=2.0.0" rel="stylesheet" />
  <link rel="stylesheet" href="/vendor/dataTables/jquery.dataTables.min.css">
  <link rel="stylesheet" href="/vendor/dataTables/dataTables.bootstrap4.min.css">
  <!-- CSS Just for demo purpose, don't include it in your project -->
  <link href="/app/assets/demo/demo.css" rel="stylesheet" />
  <link rel="stylesheet" href="/vendor/jquery-confirm/jquery-confirm.min.css">
  <link rel="stylesheet" href="/vendor/froala-editor/froala_editor.pkgd.min.css">
  <style>
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
        <div class="row justify-content-center">
          <div class="col-12 text-center">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Nuevo Usuario</h3>
              </div>
              <div class="card-body">
                <form id="create-user">
                  <div class="row aling-items-center">
                    <div class="col-6 col-sm-4 order-2 order-md-1">
                      <div class="form-group">
                        <label for="name-user">Nombre de usuario</label>
                        <input id="name-user" class="form-control" type="text" name="username" required>
                      </div>
                    </div>
                    <div class="col-12 col-sm-4 order-1 order-md-2">
                      <div class="form-group">
                        <label for="email-user">Email</label>
                        <input id="email-user" class="form-control" type="text" name="email" required>
                      </div>
                    </div>
                    <div class="col-6 col-sm-4 order-12 order-md-5">
                      <div class="form-group">
                        <label for="rol-user">Rol</label>
                        <select id="rol-user" class="form-control" type="text" name="rol" required>
                          <option disabled>Seleccione un Rol de usuario</option>
                          <option value="1">Standard</option>
                          <option value="2">Administrador</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col"></div>
                    <div class="col"><button type="submit" class="btn btn-primary"><i class="nc-icon nc-simple-add"></i> Crear</button></div>
                    <div class="col"></div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="col-12 text-center">
            <div class="card">
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-hover tableFixHead" id="table-users">
                    <thead class="text-primary">
                      <th>Nombre de usuario</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </thead>
                  </table>
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
    $('#sidebar-users-item').addClass('active')
  </script>
  <script src="/vendor/jquery-confirm/jquery-confirm.min.js"></script>
  <script src="/vendor/dataTables/jquery.dataTables.min.js"></script>
  <script src="/vendor/dataTables/dataTables.bootstrap4.min.js"></script>
  <script src="/vendor/numberFormat/jquery.number.min.js"></script>
  <script src="/js/app/users.js"></script>
</body>

</html>