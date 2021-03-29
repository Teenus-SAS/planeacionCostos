<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
include(PARTIALS_PATH . "verify_session_admin.php") ?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <title>
    Tezlik | Admin
  </title>
  <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no' name='viewport' />
  <!--     Fonts and icons     -->
  <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700,200" rel="stylesheet" />
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css" rel="stylesheet">
  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <!-- CSS Files -->
  <link href="/app/assets/css/bootstrap.min.css" rel="stylesheet" />
  <link href="/app/assets/css/paper-dashboard.css" rel="stylesheet" />
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
          <div class="col-md-8">
            <div class="card card-user">
              <div class="card-header">
                <h5 class="card-title">Datos de la Empresa</h5>
              </div>
              <div class="card-body">
                <form id="create-company">
                  <div class="row">
                    <div class="col-md-4 pr-1">
                      <div class="form-group">
                        <label>NIT</label>
                        <input type="text" class="form-control" placeholder="NIT" required name="nit">
                      </div>
                    </div>
                    <div class="col-md-3 px-1">
                      <div class="form-group">
                        <label>Telefono</label>
                        <input type="text" class="form-control" placeholder="Telefono" required name="phone">
                      </div>
                    </div>
                    <div class="col-md-5 pl-1">
                      <div class="form-group">
                        <label for="exampleInputEmail1">Fecha de caducidad</label>
                        <input type="date" class="form-control" placeholder="Fecha de caducidad" name="license" id="datepicker1">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 pr-1">
                      <div class="form-group">
                        <label>Nombre Comercial</label>
                        <input type="text" class="form-control" placeholder="Nombre Comercial" required name="tradename">
                      </div>
                    </div>
                    <div class="col-md-6 pl-1">
                      <div class="form-group">
                        <label>Razon Social</label>
                        <input type="text" class="form-control" placeholder="Razon Social" required name="bussinesName">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label>Dirección</label>
                        <input type="text" class="form-control" placeholder="Dirección" required name="address">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-4 pr-1">
                      <div class="form-group">
                        <label>País</label>
                        <input type="text" id="country" class="form-control" placeholder="País" required name="country">
                      </div>
                    </div>
                    <div class="col-md-4 px-1">
                      <div class="form-group">
                        <label>Departamento</label>
                        <input type="text" id="department" class="form-control" placeholder="Departamento" required name="department">
                      </div>
                    </div>
                    <div class="col-md-4 pl-1">
                      <div class="form-group">
                        <label>Ciudad</label>
                        <input type="text" id="city" class="form-control" placeholder="Ciudad" required name="city">
                      </div>
                    </div>
                  </div>
                  <hr>
                  <div class="row">
                    <div class="col-md-12 text-center">
                      <h6>Usuario Administrador</h6>
                    </div>
                  </div>
                  <hr>
                  <div class="row">
                    <div class="col-md-7 pr-1">
                      <div class="form-group">
                        <label for="exampleInputEmail1">Email</label>
                        <input type="email" class="form-control" name="email" placeholder="Email" required>
                      </div>
                    </div>
                    <div class="col-md-5 pl-1">
                      <div class="form-group">
                        <label for="">Nombre de Usuario</label>
                        <input type="text" class="form-control" name="username" placeholder="Usuario" required>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-4 pr-1">
                      <div class="form-group">
                        <label for="name_creator">Nombre Completo</label>
                        <input id="name_creator" class="form-control" type="text" required placeholder="Nombre Completo">
                      </div>
                    </div>
                    <div class="col-md-4 px-1">
                      <div class="form-group">
                        <label for="cellphone_creator">Celular</label>
                        <input id="cellphone_creator" class="form-control" placeholder="Celular" type="text" required minlength="10" maxlength="10">
                      </div>
                    </div>
                    <div class="col-md-4 pl-1">
                      <div class="form-group">
                        <label for="position_creator">Cargo</label>
                        <input id="position_creator" class="form-control" type="text" placeholder="Cargo">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="update ml-auto mr-auto">
                      <button type="submit" class="btn btn-primary btn-round ">Crear Empresa</button>
                    </div>
                  </div>
                </form>
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
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"></script>
  <script>
    // autocompletado geograficamente

    $('#country').autocomplete({
      source: function(request, response) {
        $.getJSON('/resources/paises.json', (data) => {
          response(data.filter(country => country.trim().toLowerCase().includes(request.term.trim().toLowerCase())))
        })
      },
      minLength: 2,
    })

    $('#country').change(function() {
      if ($(this).val().trim().toLowerCase() == 'colombia') {
        $('#department').autocomplete({
          source: function(request, response) {
            $.getJSON('https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json', (data) => {
              let departments = data.filter(department => department.departamento.trim().toLowerCase().includes(request.term.trim().toLowerCase()))
              let departmentsString = []
              departments.forEach(department => {
                departmentsString.push(department.departamento)
              })
              response(departmentsString)
            })
          }
        })
        $('#department').change(function() {
          $('#city').autocomplete({
            source: function(request, response) {
              $.getJSON('https://raw.githubusercontent.com/marcovega/colombia-json/master/colombia.min.json', (data) => {
                let department = data.filter(department => department.departamento.trim().toLowerCase() == $('#department').val().trim().toLowerCase())[0]
                response(department.ciudades.filter(city => city.trim().toLowerCase().includes(request.term.trim().toLowerCase())))
              })
            }
          })
        })
      } else {
        $("#department").autocomplete("destroy");
        $("#city").autocomplete("destroy");
      }
    })




    $('#create-company').submit(function(e) {
      e.preventDefault()
      let stringForm = $(this).serialize()
      let creator = {
        name: $('#name_creator').val(),
        cellphone: $('#cellphone_creator').val(),
        position: $('#position_creator').val()
      }
      stringForm += `&creator=${JSON.stringify(creator)}`
      $.post('api/create_company.php', stringForm, (data, status) => {
        if (data.status) {
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: "Se ha creado la empresa"
          }, {
            type: 'success',
            timer: 8000
          })
        } else {
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: "No se ha creado la empresa"
          }, {
            type: 'danger',
            timer: 8000
          })
          if (data.errorno == 1062) {
            $.notify({
              icon: "nc-icon nc-bell-55",
              message: "El correo o nombre de usuario ya esta en uso"
            }, {
              type: 'danger',
              timer: 8000
            })
          }
        }
      })
    })
  </script>
</body>

</html>