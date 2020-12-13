<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
include(PARTIALS_PATH . "verify_session.php") ?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <title>
    Parametrización General | Tezlik
  </title>
  <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no' name='viewport' />
  <!--     Fonts and icons     -->
  <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700,200" rel="stylesheet" />
  <link href="/vendor/font-awesome/font-awesome.min.css" rel="stylesheet">
  <!-- CSS Files -->
  <link href="/app/assets/css/bootstrap.min.css" rel="stylesheet" />
  <link href="/app/assets/css/paper-dashboard.css?v=2.0.0" rel="stylesheet" />
  <!-- CSS Just for demo purpose, don't include it in your project -->
  <link href="/app/assets/demo/demo.css" rel="stylesheet" />
  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <link rel="stylesheet" href="/vendor/dataTables/jquery.dataTables.min.css">
  <link rel="stylesheet" href="/vendor/dataTables/dataTables.bootstrap4.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css">
  <link rel="stylesheet" href="/vendor/froala-editor/froala_editor.pkgd.min.css">
  <style>
    .tableFixHead {
      overflow-y: auto;
      /* height: 400px; */
    }

    .custom-file-label::after {
      content: "Cargar";
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

    .dataTables_wrapper,
    .dt-bootstrap4,
    .no-footer {
      width: 96%;
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

    #form-salary-employees label {
      font-size: 0.7em;
      margin-bottom: 5px;
      color: #9A9A9A;
    }

    #form-salary-employees input {
      font-size: 0.8em;
    }

    #modalFactorPrestacional input {
      text-align: center;
    }

    #modalFactorPrestacional .input-group .form-control {
      padding: 6px;
      height: 32px;
    }

    #modalFactorPrestacional .input-group .form-control+.input-group-append .input-group-text {
      padding: 6px;
      height: 32px;
    }

    #home input {
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
        <div class="card card-nav-tabs card-plain">
          <div class="card-header card-header-primary">
            <!-- colors: "header-primary", "header-info", "header-success", "header-warning", "header-danger" -->
            <div class="nav-tabs-navigation">
              <div class="nav-tabs-wrapper">
                <ul class="nav nav-tabs" data-tabs="tabs">
                  <li class="nav-item">
                    <a class="nav-link active" href="#home" data-toggle="tab">Datos Generales</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#products" data-toggle="tab">Productos</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#updates" data-toggle="tab">Materia Prima</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#history" data-toggle="tab">Máquinas</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#process" data-toggle="tab">Procesos</a>
                  </li>
                  <li class="nav-item">
                    <a href="#bpm-nav" data-toggle="tab" class="nav-link">BPM</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#nomina-nav" data-toggle="tab">Nómina</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="tab-content text-center">
              <div class="tab-pane active" id="home">
                <form id="form-factor-prestacional">
                  <div class="row">
                    <div class="col-md-6 col-sm-12">
                      <div class="card">
                        <div class="card-header">Tiempo de Máquina</div>
                        <div class="card-body">
                          <div class="form-group row">
                            <label class="col-md-5 col-sm-12 col-form-label col-6" for="my-input">Horas de Trabajo por Dia</label>
                            <input id="my-input-wh" class="col-md-6 form-control col-sm-10 col-5" type="text" name="workHours" value="<?= $user->getCompany()->getWorkHours() ?>">
                          </div>
                          <div class="form-group row">
                            <label class="col-md-5 col-sm-12 col-form-label col-6" for="my-input">Dias Laborales del Mes</label>
                            <input id="my-input-dl" class="col-md-6 form-control col-sm-8 col-5" type="number" name="BussinesDayMonth" value="<?= $user->getCompany()->getBussinesDaysMonth() ?>" required>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="col-md-6 col-sm-12">
                      <div class="card">
                        <div class="card-header">Ventas</div>
                        <div class="card-body">
                          <div class="form-group row align-items-center">
                            <label class="col-md-4 col-sm-12 col-form-label col-6" for="my-input">Comisión de Ventas</label>
                            <div class="input-group col-md-7 col-sm-10 col-5 mb-0">
                              <input id="my-input-sc" class="form-control" type="text" name="SalesCommission" value="<?= $user->getCompany()->getSalesCommission() ?>">
                              <div class="input-group-append">
                                <span class="input-group-text">%</span>
                              </div>
                            </div>
                          </div>
                          <div class="form-group row align-items-center mb-0">
                            <label class="col-md-4 col-form-label col-sm-12 col-6 " for="my-input">Margen De rentabilidad</label>
                            <div class="input-group col-md-7 col-sm-10 col-5 mb-0">
                              <input id="my-input-mr" class="form-control " type="number" name="ProfitabilityMargin" value="<?= $user->getCompany()->getProfitabilityMargin() ?>" required>
                              <div class="input-group-append">
                                <span class="input-group-text">%</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="row">
                    <div class="col"></div>
                    <div class="col"><button class="btn btn-primary"><i class="nc-icon nc-refresh-69"></i>Guardar</button></div>
                    <div class="col"></div>
                  </div>
                </form>
              </div>
              <div class="tab-pane" id="updates">
                <div class="row justify-content-center align-items-center">
                  <div class="col-md-4 col-sm-12">
                    <!--<h3>Materia Prima</h3>-->
                    <form id="form-materia-prima">
                      <div class="form-check form-check-radio form-check-inline">
                        <label class="form-check-label">
                          <input class="form-check-input" type="radio" name="optionMateriaPrima" id="inlineRadio1" value="option1"> Adicionar
                          <span class="form-check-sign"></span>
                        </label>
                      </div>
                      <div class="form-check form-check-radio form-check-inline">
                        <label class="form-check-label">
                          <input class="form-check-input" type="radio" name="optionMateriaPrima" id="inlineRadio2" value="option2"> Modificar
                          <span class="form-check-sign"></span>
                        </label>
                      </div>
                      <div class="card py-2">
                        <div class="row my-4 justify-content-center">
                          <div class="col-md-10 col-10">
                            <div class="form-group">
                              <label for="input-materia-prima">Materia Prima</label>
                              <input id="input-materia-prima" class="form-control" type="text" name="material">
                            </div>
                          </div>
                        </div>
                        <div class="row justify-content-center">
                          <div class="col-md-5 col-5">
                            <div class="form-group">
                              <label for="my-input">Unidad</label>
                              <input id="input-unidad" class="form-control" type="text" name="unidad" >
                            </div>
                          </div>
                          <div class="col-md-5 col-5">
                            <div class="form-group">
                              <label for="my-input">Costo</label>
                              <input id="input-costo" class="form-control" type="text" name="costo" step=".01">
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row justify-content-center mb-4">
                        <div class="col"></div>
                        <div class="col"><input type="submit" class="btn btn-primary" value="Guardar Datos"></div>
                        <div class="col"></div>
                      </div>
                      <hr>
                      <div class="row mb-5 mt-4">
                        <div class="col-12">
                          <h5 class="pull-left">Importar Materia Prima</h5>
                          <a href="#" id="download_materia_prima" title="Descargar hoja de Excel de ejemplo" class="pull-right btn btn-success btn-icon"><i class="fas fa-file-excel"></i></a>
                        </div>
                        <div class="custom-file">
                          <input type="file" id="fileRawMaterial" class="custom-file-input">
                          <label for="fileRawMaterial" class="custom-file-label" data-browse="Elegir">Iniciar importación</label>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="col-md-8 col-sm-12">
                    <div class="card">
                      <div class="card-header">
                        <!--<h4>Materia Prima</h4>-->
                      </div>
                      <div class="card-body">
                        <button class="btn btn-danger" id="delete-materials">Eliminar</button>
                        <div class="table-responsive tableFixHead">
                          <table class="table table-hover" id="table-materia-prima">
                            <thead class="text-primary">
                              <th>Materia Prima</th>
                              <th>Unidad</th>
                              <th>Costo</th>
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
              <div class="tab-pane" id="history">
                <div class="row justify-content-center align-items-center">
                  <div class="col-md-5 col-sm-12">
                    <form id="form-maquinas">
                      <!--<h3>Máquinas</h3>-->
                      <div class="form-check form-check-radio form-check-inline">
                        <label class="form-check-label">
                          <input class="form-check-input" type="radio" name="optionMaquinas" id="inlineRadio1" value="option1"> Adicionar
                          <span class="form-check-sign"></span>
                        </label>
                      </div>
                      <div class="form-check form-check-radio form-check-inline">
                        <label class="form-check-label">
                          <input class="form-check-input" type="radio" name="optionMaquinas" id="inlineRadio2" value="option2"> Modificar
                          <span class="form-check-sign"></span>
                        </label>
                      </div>
                      <div class="card py-2">
                        <div class="row my-2 justify-content-center">
                          <div class="col-md-10 col-10">
                            <div class="form-group">
                              <label for="input-maquinas">Nombre</label>
                              <input id="input-maquinas" class="form-control" type="text" name="machine">
                            </div>
                          </div>
                          <div class="col-md-5 col-6">
                            <div class="form-group">
                              <label for="my-input">Precio</label>
                              <input id="input-price-machine" class="form-control" type="text" name="price" value="0" />
                            </div>
                          </div>
                          <div class="col-md-5 col-5">
                            <div class="form-group">
                              <label for="my-input">
                                <a href="#" data-toggle="tooltip"  data-html="true" title="Es el monto que la entidad podría obtener en el momento presente por disponer de un activo de largo plazo, una vez alcanzada su vida útil.">
                                Valor Residual
                              </a>
                              </label>
                              <input id="input-valor-residual" class="form-control " type="text" name="valor-residual" value="0">
                            </div>
                          </div>
                        </div>
                        <div class="row justify-content-center">
                          <div class="col-md-5 col-6">
                            <div class="form-group">
                              <label for="my-input">Años de Depreciación</label>
                              <input id="input-years-depreciation" class="form-control" type="number" name="years" value="5" />
                            </div>
                          </div>
                          <div class="col-md-5 col-5">
                            <div class="form-group">
                              <label for="my-input">Depreciación/Min</label>
                              <input style="text-align: center" id="input-depreciation-machine" class="form-control disabled" type="number" disabled name="depreciation" step=".01">
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row mb-4">
                        <div class="col"></div>
                        <div class="col"><button class="btn btn-primary">Guardar</button></div>
                        <div class="col"></div>
                      </div>
                      <hr>
                      <div class="row mb-5 mt-4">
                        <div class="col-12">
                          <h5 class="pull-left">Importar Máquinas</h5>
                          <a href="#" id="download_maquinas" title="Descargar hoja de Excel de ejemplo" class="pull-right btn btn-success btn-icon"><i class="fas fa-file-excel"></i></a>
                        </div>
                        <div class="custom-file">
                          <input type="file" id="fileMachines" class="custom-file-input">
                          <label for="fileMachines" class="custom-file-label" data-browse="Elegir">Iniciar importación</label>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="col-md-7 col-sm-12">
                    <div class="card">
                      <div class="card-header">
                        <!--<h4>Máquinas</h4>-->
                      </div>
                      <div class="card-body">
                        <button class="btn btn-danger" id="delete-maquinas">Eliminar</button>
                        <div class="table-responsive tableFixHead">
                          <table class="table table-compact table-hover" id="table-maquinas">
                            <thead class="text-primary">
                              <th>Máquinas</th>
                              <th>P. Compra</th>
                              <th>Depreciación*Min</th>
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
              <div class="tab-pane" id="process">
                <div class="row justify-content-center">
                  <div class="col-md-4 col-sm-12">
                    <!--<h3>Procesos</h3>-->
                    <form id="form-procesos">
                      <div class="form-check form-check-radio form-check-inline">
                        <label class="form-check-label">
                          <input class="form-check-input" type="radio" name="optionProceso" id="inlineRadio1" value="option1"> Adicionar
                          <span class="form-check-sign"></span>
                        </label>
                      </div>
                      <div class="form-check form-check-radio form-check-inline">
                        <label class="form-check-label">
                          <input class="form-check-input" type="radio" name="optionProceso" id="inlineRadio2" value="option2"> Modificar
                          <span class="form-check-sign"></span>
                        </label>
                      </div>
                      <div class="card py-2">
                        <div class="row my-4 justify-content-center">
                          <div class="col-md-10 col-10">
                            <div class="form-group">
                              <label for="input-proceso">Proceso</label>
                              <input id="input-proceso" class="form-control" type="text" name="proceso">
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row justify-content-center mb-4">
                        <div class="col"></div>
                        <div class="col"><input type="submit" class="btn btn-primary" value="Guardar"></div>
                        <div class="col"></div>
                      </div>
                      <hr>
                      <div class="row mb-5 mt-4">
                        <div class="col-12">
                          <h5 class="pull-left">Importar Procesos</h5>
                          <a href="javascript:generateFileProcesses()" title="Descargar hoja de Excel de ejemplo" class="pull-right btn btn-success btn-icon"><i class="fas fa-file-excel"></i></a>
                        </div>
                        <div class="custom-file">
                          <input type="file" id="fileProcess" class="custom-file-input">
                          <label for="fileProcess" class="custom-file-label" data-browse="Elegir">Iniciar importación</label>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="col-md-8 col-sm-12">
                    <div class="card">
                      <div class="card-header">
                        <!--<h4>Procesos</h4>-->
                      </div>
                      <div class="card-body">
                        <button class="btn btn-danger" id="delete-process">Eliminar</button>
                        <div class="table-responsive tableFixHead">
                          <table class="table table-compact table-hover" id="table-procesos">
                            <thead class="text-primary">
                              <th>Procesos</th>
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
              <div class="tab-pane" id="bpm-nav">
                <div class="row">
                  <div class="col-12"><img src="/img/img.jpg" id="img-proccess"></div>
                </div>
                <div class="row">
                  <div class="col"></div>
                  <div class="col"><input type="file" id="input-file-img-bpm" class="btn btn-primary btn-round" accept="image/*"></div>
                  <div class="col"></div>
                </div>
              </div>
              <div class="tab-pane" id="nomina-nav">
                <div class="row justify-content-center align-items-center">
                  <div class="col-md-6 mb-3">
                    <!--<h4>Nómina</h4>-->
                    <form id="form-nomina">
                      <div class="form-check form-check-radio form-check-inline">
                        <label class="form-check-label">
                          <input class="form-check-input" type="radio" name="optionNomina" id="inlineRadio1" value="option1"> Adicionar
                          <span class="form-check-sign"></span>
                        </label>
                      </div>
                      <div class="form-check form-check-radio form-check-inline">
                        <label class="form-check-label">
                          <input class="form-check-input" type="radio" name="optionNomina" id="inlineRadio2" value="option2"> Modificar
                          <span class="form-check-sign"></span>
                        </label>
                      </div>
                      <div class="card my-1">
                        <div class="form-group row mt-2">
                          <label for="input-cargo" class="col-sm-3 col-3 col-form-label">Cargo</label>
                          <div class="col-sm-8 col-8">
                            <input type="text" name="cargo" class="form-control" id="input-cargo">
                          </div>
                        </div>
                        <div class="form-group row">
                          <label for="select-proceso" class="col-sm-3 col-3 col-form-label">Proceso</label>
                          <div class="col-sm-8 col-8">
                            <select class="custom-select" id="select-proceso" name="proceso">
                              <option selected disabled>Seleccione el proceso</option>
                            </select>
                          </div>
                        </div>
                        <div class="form-group row align-items-center">
                          <label for="input-quantity-employees" class="col-md-3 col-4 col-sm-3 col-form-label ">N° Empleados</label>
                          <div class="col-md-2 col-sm-2 col-7 pr-0 my-2">
                            <input type="number" class="form-control" id="input-quantity-employees" name="Numeroempleados">
                          </div>

                          <label for="input-salario" class="col-md-2 col-sm-2 col-4 col-form-label">Salario</label>
                          <div class="col-sm-4 col-7 col-md-4 pl-0 mt-2">
                            <div class="input-group">
                              <div class="input-group-prepend">
                                <span class="input-group-text">$</span>
                              </div>
                              <input type="text" class="form-control" id="input-salario" name="salario" value="0">
                            </div>

                          </div>
                        </div>
                        <div class="form-group row mb-2">
                          <label for="inputPassword" class="col-sm-3 col-4 col-form-label">Bonificación</label>
                          <div class="col-sm-8 col-7 input-group mb-0">
                            <div class="input-group-prepend">
                              <span class="input-group-text">$</span>
                            </div>
                            <input type="text" class="form-control" id="input-bonificacion" name="bonificacion" value="0">
                          </div>
                        </div>
                        <div class="form-group row mb-2">
                          <label for="inputPassword" class="col-sm-3 col-4 col-form-label">Dotación</label>
                          <div class="col-sm-8 col-7 input-group mb-0">
                            <div class="input-group-prepend">
                              <span class="input-group-text">$</span>
                            </div>
                            <input type="text" class="form-control" id="input-dotacion" name="dotacion" value="0">
                          </div>
                        </div>
                        <div class="form-group row mb-2">
                          <label for="inputPassword" class="col-sm-3 col-4 col-form-label">Horas Extras</label>
                          <div class="col-sm-8 col-7 input-group mb-0">
                            <div class="input-group-prepend">
                              <span class="input-group-text">$</span>
                            </div>
                            <input type="text" class="form-control" id="input-horas-extra" name="horasExtra" value="0">
                          </div>
                        </div>
                        <div class="form-group row">
                          <label for="inputPassword" class="col-sm-5 col-5 col-form-label">Horas de Trabajo dia / empleado</label>
                          <div class="col-sm-6 col-6">
                            <input type="text" class="form-control" id="inputHorasTrabajo" name="horasTrabajo" min="1" max="18">
                          </div>
                        </div>
                        <div class="form-group row">
                          <label for="inputPassword" class="col-sm-5 col-5 col-form-label">Dias laborales/Mes</label>
                          <div class="col-sm-6 col-6">
                            <input type="number" class="form-control" id="inputDiasMes" name="diasMes" min="1" max="31">
                          </div>
                        </div>
                      </div>
                      <div class="card my-1">
                        <div class="row">
                          <div class="col-md-12 text-left px-5 py-2">
                            <div class="form-check">
                              <label class="form-check-label">
                                <input class="form-check-input" type="checkbox" value="" id="checkboxCalculadoManualFP">
                                Calcular Factor Prestacional Manualmente
                                <span class="form-check-sign">
                                  <span class="check"></span>
                                </span>
                              </label>
                            </div>
                          </div>
                        </div>
                        <div class="form-group row">
                          <label class="col-form-label col-md-5" for="optionFactorPrestacional">Tipo de Contrato:</label>
                          <div class="col-md-6">
                            <div class="form-check form-check-radio form-check-inline">
                              <label class="form-check-label">
                                <input class="form-check-input" type="radio" name="optionFactorPrestacional" id="inlineRadio1" value="nomina"> Nomina
                                <span class="form-check-sign"></span>
                              </label>
                            </div>
                            <div class="form-check form-check-radio form-check-inline">
                              <label class="form-check-label">
                                <input class="form-check-input" type="radio" name="optionFactorPrestacional" id="inlineRadio2" value="servicios"> Servicios
                                <span class="form-check-sign"></span>
                              </label>
                            </div>
                          </div>
                        </div>

                        <div class="form-group row align-items-center justify-content-center">
                          <label for="factor-prestacional" class="col-form-label col-md-5 col-5">Factor Prestacional</label>
                          <div class="input-group col-md-4 col-4">
                            <input type="number" step=".01" id="inputFP" class="form-control" aria-describedby="btn-factor-prestacional" name="factorPrestacional">
                            <div class="inpput-group-append" id="btn-factor-prestacional">
                              <span class="input-group-text">%</span>
                            </div>
                          </div>
                          <div class="col-md-2 col-2">
                            <button class="btn btn-info" type="button" data-toggle="modal" data-target="#modalFactorPrestacional">></button>
                          </div>
                        </div>
                      </div>
                      <div class="row justify-content-center">
                        <div class="col"></div>
                        <div class="col"><input type="submit" class="btn btn-primary" value="Guardar"></div>
                        <div class="col"></div>
                      </div>
                    </form>
                  </div>
                  <div class="col-md-12">
                    <div class="card">
                      <div class="card-header">
                        <h4>Nómina</h4>
                      </div>
                      <div class="card-body">
                        <button class="btn btn-danger" id="delete-nomina">Eliminar</button>
                        <div class="table-responsive table-hover tableFixHead">
                          <table class="table" id="tableNominas">
                            <thead class="text-primary">
                              <th>Cargo</th>
                              <th>Proceso</th>
                              <th>Cantidad</th>
                           <!--    <th>Contrato</th> -->
                              <th>Salario</th>
                              <th>Salario Neto</th>
                              <th>Valor/Minuto</th>
                            </thead>
                            <tbody>

                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row my-5">
                  <div class="col-12">
                    <h5 class="pull-left">Importar Nomina</h5>
                    <a href="#" id="download_nomina" title="Descargar hoja de Excel de ejemplo" class="pull-right btn btn-success btn-icon"><i class="fas fa-file-excel"></i></a>
                  </div>
                  <div class="custom-file">
                    <input type="file" id="fileRosters" class="custom-file-input">
                    <label for="fileRosters" class="custom-file-label" data-browse="Elegir">Iniciar importación</label>
                  </div>
                </div>
              </div>


              <div class="tab-pane" id="products">
                <div class="row justify-content-center" >
                  <div class="col-md-5 col-sm-12 col-12 col-xs-12 mb-5">
                    <!--<h3>Productos</h3>-->
                    <form id="form-products" novalidate>
                      <div class="form-check form-check-radio form-check-inline">
                        <label class="form-check-label">
                       <!--    <input class="form-check-input" type="radio" name="optionProductos" id="inlineRadio1" value="option1">  -->
                          Adicionar
                       <!--    <span class="form-check-sign"></span> -->
                        </label>
                      </div>
                  <!--     <div class="form-check form-check-radio form-check-inline" >
                        <label class="form-check-label" id="config-color">
                          <input class="form-check-input" type="radio" name="optionProductos" id="inlineRadio2" value="option2" > Configurar
                          <span class="form-check-sign"></span>
                        </label>
                      </div> -->
                      <div class="card py-2">
                        <div class="form-group row my-2">
                          <label class="col-sm-5 col-md-4 col-12 text-left col-form-label pl-4">Referencia</label>
                          <div class="col-sm-6 col-md-7 px-0 col-10"><input type="text" class="form-control" id="inputRef" name="ref"></div>
                        </div>
                        <div class="form-group row my-2">
                          <label class="col-sm-5 col-md-4 col-12 text-left col-form-label pl-4">Producto</label>
                          <div class="col-md-7 col-sm-6 px-0 col-10"><input type="text" class="form-control" id="inputProducto" name="producto"></div>
                        </div>

                        <div class="form-group row my-2">
                          <label class="col-sm-5 col-md-4 col-12 text-left col-form-label pl-4">Rentabilidad</label>
                          <div class="col-sm-6 col-md-7 px-0 col-10"><input type="text" class="form-control" id="inputRentabilidad" name="rentabilidad"></div>
                        </div>
<!-- 
                        <div class="form-group row my-2">
                          <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">Materia</label>
                          <div class="col-md-7 px-0 col-10"><select class="custom-select" id="input-materia" name="materia">
                            </select></div>
                        </div>
                        <div class="form-group row my-3">
                          <label class="col-md-3 col-3 col-form-label px-0 ">Cantidad</label>
                          <div class="col-md-3 col-3 text-left px-0"><input type="number" id="input-cantidad" class="form-control" name="cantidad" step=".01"></div>
                          <label class="col-md-2 col-2 col-form-label px-0">Unidad</label>
                          <div class="col-md-3 col-3 text-left px-0"><input type="text" id="input-unidad" class="form-control" name="unidad" disabled></div>
                        </div> -->
                      </div>
                      <div class="row mb-4">
                        <div class="col"></div>
                        <div class="col">
                          <input type="hidden" id="formOption" name="formOption" value="0">
                          <input type="hidden" id="prodId" name="prodId" value="-1">
                          <button id="form-product-btn" class="btn btn-primary">Guardar</button>
                        </div>
                        <div class="col"></div>
                      </div>
                    </form>
                    <hr>
                    <div class="row my-4">
                      <div class="col-12">
                        <h5 class="pull-left">Importar Productos</h5>
                        <a href="#" title="Descargar hoja de Excel de ejemplo" id="download-products" class="pull-right btn btn-success btn-icon"><i class="fas fa-file-excel"></i></a>
                      </div>
                      <div class="custom-file">
                        <input type="file" id="fileProducts" class="custom-file-input" data-browse="Elegir" lang="es">
                        <label for="fileProducts" class="custom-file-label">importar Archivo</label>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-7 col-sm-12 col-12">
                    <div class="card">
                      <div class="card-header">
                      </div>
                      <div class="card-body">
               <!--          <button class="btn btn-danger" id="delete-materia-prima">Eliminar</button>
                        <div class="table-responsive tableFixHead">
                          <table class="table" id="tableProductoMateriaPrima">
                            <thead class="text-primary">
                              <th>Materia</th>
                              <th>Cantidad</th>
                              <th>Unidad</th>
                            </thead>
                            <tbody>
                            </tbody>
                          </table>
                        </div> -->
                        <div class="table-responsive tableFixHead">
                          <table class="table compact" id="tableProductos">
                            <thead class="text-primary">
                              <th>Ref</th>
                              <th>Producto</th>
                              <th>Rentabilidad</th>
                              <th>Acciones</th>
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
  <div class="modal fade" id="modalSalaryEmployees" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <form id="form-salary-employees-form">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Salario de Empleados</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div id="form-salary-employees">

            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
            <button type="submit" class="btn btn-primary" id="btn-calculate-salary">Calcular Salario</button>
          </div>
        </form>
      </div>
    </div>
  </div>

  <div class="modal fade" id="modalFactorPrestacional" tabindex="-1" role="dialog" aria-labelledby="modalLabelFactorPrestacional" aria-hidden="true">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="modalLabelFactorPrestacional">Factor Prestacional</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="container">
            <!-- costos  para las empresas -->
            <div class="row">
              <div class="col-5">
              </div>
              <div class="col-7">
                <h6 class="text-primary text-center">Costo para la Empresa</h6>
              </div>
            </div>
            <div class="row">
              <div class="col-5">
              </div>
              <div class="col-3">
                <h6 class="text-primary text-center"> &gt; 10 SMLV</h6>
              </div>
              <div class="col-3">
                <h6 class="text-primary text-center"> &lt; 10 SMLV</h6>
              </div>
            </div>
            <div class="row">
              <div class="col-5">
                <h6 class="text-primary text-left"> Seguridad Social</h6>
              </div>
            </div>
            <div class="row">
              <div class="col-1"></div>
              <div class="col-4">
                <span class="text-secondary">Pensión (16%)</span>
              </div>
              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="12" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="12" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-1"></div>
              <div class="col-4">
                <span class="text-secondary">Salud (12.5%)</span>
              </div>
              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="8.5" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>

              </div>
              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="0" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>

              </div>
            </div>
            <div class="row">
              <div class="col-1"></div>
              <div class="col-4">
                <span class="text-secondary">Riesgos (0.522% - 6.960%)</span>
              </div>
              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="0.52" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>
              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="0.52" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- parafiscales -->
            <div class="row">
              <div class="col-5">
                <h6 class="text-primary text-left">Parafiscales</h6>
              </div>

            </div>
            <div class="row">
              <div class="col-1"></div>
              <div class="col-4">
                <span class="text-secondary">Caja de Compensación Familiar</span>
              </div>
              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="4" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>

              </div>
              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="4" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>

              </div>
            </div>
            <!-- Prestamos Sociales -->
            <div class="row">
              <div class="col-5">
                <h6 class="text-primary text-left"> Seguridad Social</h6>
              </div>

            </div>
            <div class="row">
              <div class="col-1"></div>
              <div class="col-4">
                <span class="text-secondary">Prima</span>
              </div>
              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="8.33" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>

              </div>

              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="8.33" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-1"></div>
              <div class="col-4">
                <span class="text-secondary">Cesantias</span>
              </div>

              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="8.33" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>

              </div>
              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="8.33" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>

              </div>
            </div>
            <div class="row">
              <div class="col-1"></div>
              <div class="col-4">
                <span class="text-secondary">Intereses de Cesantias</span>
              </div>
              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="1" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>

              </div>
              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="1" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>

              </div>
            </div>
            <div class="row">
              <div class="col-1"></div>
              <div class="col-4">
                <span class="text-secondary">Vacaciones</span>
              </div>
              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="4.17" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>

              </div>
              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="4.17" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>

              </div>
            </div>

            <div class="row mt-5">
              <div class="col-5">
                <h6 class="text-black">Total Factor Pestacional</h6>
              </div>
              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="46.85" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>

              </div>
              <div class="col-3">
                <div class="input-group">
                  <input type="number" class="form-control" value="38.35" step=".01">
                  <div class="input-group-append">
                    <span class="input-group-text">%</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer text-center justify-content-center">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Cerrar</button>
          <!-- <input type="submit" class="btn btn-primary" id="btn-calculate-salary" value="Modificar"> -->
        </div>
      </div>
    </div>
  </div>
  <!--   Core JS Files   -->
  <script src="/app/assets/js/core/jquery.min.js"></script>
  <script src="/app/assets/js/core/popper.min.js"></script>
  <script src="/app/assets/js/core/bootstrap.min.js"></script>
  <script src="/app/assets/js/plugins/perfect-scrollbar.jquery.min.js"></script>
  <script src="/vendor/jquery-validation/jquery.validate.min.js"></script>
  <!-- Chart JS -->
  <script src="/app/assets/js/plugins/chartjs.min.js"></script>
  <!--  Notifications Plugin    -->
  <script src="/app/assets/js/plugins/bootstrap-notify.js"></script>
  <!-- Control Center for Now Ui Dashboard: parallax effects, scripts for the example pages etc -->
  <script src="/app/assets/js/paper-dashboard.min.js?v=2.0.0" type="text/javascript"></script>
  <!-- Paper Dashboard DEMO methods, don't include it in your project! -->
  <script src="/app/assets/demo/demo.js"></script>
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
  <script src="/vendor/dataTables/jquery.dataTables.min.js"></script>
  <script src="/vendor/dataTables/dataTables.bootstrap4.min.js"></script>
  <script src="/vendor/numberFormat/jquery.number.min.js"></script>
  <script src="/vendor/xlsx-js/xlsx.full.min.js"></script>
  <script src="/vendor/file-saver/FileSaver.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"></script>

  <script src="/js/RedondeoDecimal.js"></script>

<!--   <script src="/js/productos.js"></script>  -->
    <script src="/js/productos-adicionar.js"></script>


  <script src="/js/gastos-generales.js"></script>
  <script src="/js/productos_procesos.js"></script>
  <script src="/js/app/xlsx/xlsx_productos_procesos.js"></script>
  <script src="/js/app/xlsx/xlsx_gastos_generales.js"></script>

  <script src="/js/materia-prima.js"></script>
  <script src="/js/factor-prestacional.js"></script>
  <script src="/js/maquinas.js"></script>
  <script src="/js/procesos.js"></script>
  <script src="/js/nomina.js"></script>
  <script src="/js/app/xlsx/xlsx_productos.js"></script>
  <script src="/js/app/xlsx/xlsx_procesos.js"></script>
  <script src="/js/app/xlsx/xlsx_materia_prima.js"></script>
  <script src="/js/app/xlsx/xlsx_maquinas.js"></script>
  <script src="/js/app/xlsx/xlsx_nomina.js"></script>
  <script src="/js/horas_extra.js"> </script>
  <script src="/js/app/bpm.js">

  </script>
  <script>
    $(function() {
      $('[data-toggle="tooltip"]').tooltip({
        html: true
      })
    })
  </script>
</body>

</html>
