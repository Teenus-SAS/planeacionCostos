<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Registrate a Tezlik</title>
  <link href="/app/assets/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="/css/register/register.css">
  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css">
</head>
<body>
  <div class="container-fluid register">
    <div class="row align-items-center justify-content-center">
      <div class="col-md-3 register-left ">
        <!--<img src="https://image.ibb.co/n7oTvU/logo_white.png" alt="" />-->
        <img src="../upload/img/logo_tezlik2.png" alt="" style="width: 90%;" />
        <h3>Registrate y Disfruta de Tezlik</h3>
        <h5 class="mt-5">Completa el formulario y empieza a fijar precios, analizar costos, fijar tu rentabilidad objetivo de manera profesional</h5>
      </div>
      <div class="col-md-9 register-right">
        <div class="tab-content" id="myTabContent">
          <form id="form-register">
            <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
              <h3 class="register-heading">Tezlik te ayuda a fijar tus precios y ahorro para tu empresa</h3>
              <div class="row register-form" style="padding-bottom: 1%;">
                <div class="col-md-12">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <input type="text" class="form-control" placeholder="NIT *" required name="nit" pattern="^[0-9]+$" />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <input type="text" minlength="7" maxlength="10" class="form-control" placeholder="Teléfono *" required name="phone" pattern="^[0-9]+$"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <input type="text" minlength="3" title="El nombre comercial debe contener minimo 3 caracteres" class="form-control" placeholder="Nombre Comercial *" required name="tradename" />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <input type="text" minlength="3" title="La razón social debe contener minimo 3 caracteres" class="form-control" placeholder="Razón Social *" required name="bussinesName" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <input type="text" class="form-control" placeholder="Dirección *" required name="address" />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group ui-widget">
                        <input type="text" class="form-control" id="country" placeholder="País *" required name="country" pattern="^[a-zA-ZÀ-ÿ\s\u00f1\u00d1]+$" />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <input type="text" id="department" placeholder="Departamento *" class="form-control" required name="department" pattern="^[a-zA-ZÀ-ÿ\s\u00f1\u00d1]+$">
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <input type="text" class="form-control" id="city" placeholder="Ciudad *" required name="city" pattern="^[a-zA-ZÀ-ÿ\s\u00f1\u00d1]+$" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row register-form" style="padding-top: 0; margin-top: 0;">
                <div class="col-12 col-md-12">
                  <hr>
                  <h3 class="text-center">Crea tu usuario</h3>
                  <hr>
                </div>
                <div class="col-md-12">
                  <div class="row">
                    <div class="col-md-6">
                      <div class="form-group">
                        <input type="email" class="form-control" placeholder="Email *" required name="email" />
                      </div>
                    </div>
                    <div class="col-md-6">
                      <div class="form-group">
                        <input type="text" class="form-control" placeholder="Nombre de Usuario *" required name="username"/>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="row">
                    <div class="col-md-4">
                      <div class="form-group">
                        <input type="text" class="form-control"  id="name_creator" placeholder="Nombres *"
                        pattern="^[a-zA-ZÀ-ÿ\s\u00f1\u00d1]+$" required />
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <input type="text" class="form-control"  id="lastname_creator" placeholder="Apellidos *" pattern="^[a-zA-ZÀ-ÿ\s\u00f1\u00d1]+$" required />
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <input type="text" class="form-control" id="cellphone_creator" placeholder="Celular *" minlength="10" maxlength="10" required pattern="^[0-9]+$" />
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-group">
                        <input type="text" id="position_creator" class="form-control" placeholder="Cargo " pattern="^[a-zA-ZÀ-ÿ\s\u00f1\u00d1]+$"  />
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-md-12">
                  <div class="row">
                    <div class="col-md-6"></div>
                    <div class="col-md-6"><input type="submit" class="btnRegister" value="Iniciar" /></div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
  <script src="/app/assets/js/core/jquery.min.js"></script>
  <script src="/app/assets/js/core/popper.min.js"></script>
  <script src="/app/assets/js/core/bootstrap.min.js"></script>
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"></script>
  <script src="/js/register/register.js"></script>
</body>
</html>
