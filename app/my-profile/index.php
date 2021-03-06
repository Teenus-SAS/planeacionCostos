<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
include(PARTIALS_PATH . "verify_session.php") ?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <title>
    Mi perfil | Tezlik
  </title>
  <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no' name='viewport' />
  <!--     Fonts and icons     -->
  <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700,200" rel="stylesheet" />
  <link href="https://maxcdn.bootstrapcdn.com/font-awesome/latest/css/font-awesome.min.css" rel="stylesheet">
  <!-- CSS Files -->
  <link href="/app/assets/css/bootstrap.min.css" rel="stylesheet" />
  <link href="/app/assets/css/paper-dashboard.css" rel="stylesheet" />
  <!-- CSS Just for demo purpose, don't include it in your project -->
  <link href="/app/assets/demo/demo.css" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css">
  <link rel="stylesheet" href="/vendor/froala-editor/froala_editor.pkgd.min.css">
  <style>
    .custom-file-label::after {
      content: "Cargar";
    }

    i.fa.fa-cog.fa-spin.fa-3x.fa-fw.fade {
      position: fixed;
      right: 10px;
      z-index: 10000;
      bottom: 10px;
    }

    i.fa.fa-cog.fa-spin.fa-3x.fa-fw {
      position: fixed;
      right: 10px;
      z-index: 10000;
      bottom: 10px;
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
          <div class="col-md-4">
            <div class="card card-user">
              <div class="image">
                <img src="../assets/img/damir-bosnjak.jpg" alt="...">
              </div>
              <div class="card-body">
                <div class="author">
                  <a href="#">
                    <img class="avatar border-gray" id="img-logo-company" src="<?= $user->getCompany()->getLogo() ?>" alt="...">
                    <h5 class="title"><?= $user->getCompany()->getTradeName() ?></h5>
                  </a>
                  <p class="description">
                    <?= $user->getCompany()->getBussinesReason() ?>
                  </p>
                </div>
                <p class="description text-center">
                  <?= $user->getEmail() ?>
                  <br>
                  <?= $user->getCompany()->getPhone() ?>
                  <br>
                  <?= $user->getCompany()->getNit() ?>
                </p>
              </div>
              <div class="card-footer">
                <hr>
                <div class="button-container">
                  <div class="row">
                    <div class="col-lg-12 col-md-6 col-6 ml-auto mr-auto">
                      <a href="javascript:$('#changeLogoModal').modal()" class="btn btn-primary btn-round <?= $user->getRolId() != 2 ? "disabled" : "" ?>"><i class="nc-icon nc-image"></i> Cambiar Logo</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-8">
            <div class="card card-user">
              <div class="card-header">
                <h5 class="card-title">Mi Perfil Empresarial</h5>
              </div>
              <div class="card-body">
                <form id="update-profile">
                  <div class="row">
                    <div class="col-md-4 pr-1">
                      <div class="form-group">
                        <label>NIT</label>
                        <input type="text" class="form-control" placeholder="Company" value="<?= $user->getCompany()->getNit() ?>" <?= $user->getRolId() != 2 ? "disabled" : "" ?> required name="nit">
                      </div>
                    </div>
                    <div class="col-md-3 px-1">
                      <div class="form-group">
                        <label>Telefono</label>
                        <input type="text" class="form-control" placeholder="Telefono" value="<?= $user->getCompany()->getPhone() ?>" <?= $user->getRolId() != 2 ? "disabled" : "" ?> required name="phone">
                      </div>
                    </div>
                    <div class="col-md-5 pl-1">
                      <div class="form-group">
                        <label for="exampleInputEmail1">Email</label>
                        <input type="email" class="form-control" placeholder="Email" value="<?= $user->getEmail() ?>" disabled>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-6 pr-1">
                      <div class="form-group">
                        <label>Nombre Comercial</label>
                        <input type="text" class="form-control" placeholder="Nombre Comercial" value="<?= $user->getCompany()->getTradeName() ?>" <?= $user->getRolId() != 2 ? "disabled" : "" ?> required name="tradename">
                      </div>
                    </div>
                    <div class="col-md-6 pl-1">
                      <div class="form-group">
                        <label>Razon Social</label>
                        <input type="text" class="form-control" placeholder="Razon Social" value="<?= $user->getCompany()->getBussinesReason() ?>" <?= $user->getRolId() != 2 ? "disabled" : "" ?> required name="bussinesName">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-12">
                      <div class="form-group">
                        <label>Dirección</label>
                        <input type="text" class="form-control" placeholder="Dirección" value="<?= $user->getCompany()->getAddress() ?>" <?= $user->getRolId() != 2 ? "disabled" : "" ?> required name="address">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-md-4 pr-1">
                      <div class="form-group">
                        <label>Ciudad</label>
                        <input type="text" class="form-control" placeholder="Ciudad" value="<?= $user->getCompany()->getCity() ?>" <?= $user->getRolId() != 2 ? "disabled" : "" ?> required name="city">
                      </div>
                    </div>
                    <div class="col-md-4 px-1">
                      <div class="form-group">
                        <label>País</label>
                        <input type="text" class="form-control" placeholder="País" value="<?= $user->getCompany()->getCountry() ?>" <?= $user->getRolId() != 2 ? "disabled" : "" ?> required name="country">
                      </div>
                    </div>
                    <div class="col-md-4 pl-1">
                      <div class="form-group">
                        <label>Departamento</label>
                        <input type="text" class="form-control" placeholder="Departamento" value="<?= $user->getCompany()->getDepartment() ?>" <?= $user->getRolId() != 2 ? "disabled" : "" ?> required name="department">
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="update ml-auto mr-auto">
                      <button type="submit" class="btn btn-primary btn-round <?= $user->getRolId() != 2 ? "disabled" : "" ?>">Actualizar Perfil</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <i class="fa fa-cog fa-spin fa-3x fa-fw fade" id="spinnerAjax"></i>
      <!-- footer -->
      <?php include(PARTIALS_PATH . "footer.html") ?>
      <!-- end footer -->
    </div>
  </div>

  <!-- Modal Cambio de logo-->
  <div class="modal fade" id="changeLogoModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLongTitle">Cambiar Logo</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="container">
            <div class="row">
              <div class="col"></div>
              <div class="col-6"><img id="preview-image-logo" src="<?= $user->getCompany()->getLogo() ?>" alt="Logo Empresa"></div>
              <div class="col"></div>
            </div>
          </div>
          <div class="row mt-3">
            <div class="col"></div>
            <div class="col-10">
              <div class="custom-file">
                <input id="input-file-logo" class="custom-file-input" type="file" name="" accept=".gif,.jpg,.png,.svg,.jpeg">
                <label for="my-input" class="custom-file-label">Subir imagen</label>
              </div>
            </div>
            <div class="col"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
          <button type="button" class="btn btn-primary" id="btn-change-logo">Cambiar logo</button>
        </div>
      </div>
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
    $('#update-profile').submit(function(e) {
      e.preventDefault()
      $.post('api/update-profile.php', $(this).serialize(), (data, status) => {}).always((xhr) => {
        if (xhr.status == 200) {
          $.notify({
            icon: "nc-icon nc-bell-55",
            message: `Informacion <b>Actualizada</b>`
          }, {
            type: 'primary',
            timer: 8000
          })
        }
      })
    })

    $('#input-file-logo').change(function() {
      let file = this.files[0]
      $(this).siblings('label').text(file.name)
      var reader = new FileReader();
      reader.onload = function(e) {
        let src = e.target.result
        $('#preview-image-logo').attr('src', src)
        $('#btn-change-logo').click(() => {
          $('#spinnerAjax').removeClass('fade')
          let formData = new FormData()
          formData.append('logo', file)
          $.ajax({
            url: 'api/upload_logo.php',
            type: 'POST',
            contentType: false,
            data: formData,
            processData: false,
            cache: false,
            success: (data, status, xhr) => {
              $('#spinnerAjax').addClass('fade')
              if (data.ok) {
                $.notify({
                  icon: "nc-icon nc-bell-55",
                  message: `Logo <b>Actualizado</b>`
                }, {
                  type: 'primary',
                  timer: 8000
                })
                $('#img-logo-company').attr('src', src)
                $('#img-logo-company-sidebar').attr('src', src)
              } else {
                $.notify({
                  icon: "nc-icon nc-bell-55",
                  message: data.msg
                }, {
                  type: 'danger',
                  timer: 8000
                })
              }
            }
          })
        })
      }
      reader.readAsDataURL(file);
    })
  </script>

</body>

</html>