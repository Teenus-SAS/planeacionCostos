<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
include(PARTIALS_PATH . "verify_session.php");

?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>
    Configuración General | Tezlik
  </title>
  <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no' name='viewport' />
  <!--     Fonts and icons     -->
  <link href="https://unpkg.com/tailwindcss@^2/dist/tailwind.min.css" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700,200" rel="stylesheet" />
  <link href="/vendor/font-awesome/font-awesome.min.css" rel="stylesheet">
  <link href="/app/assets/css/bootstrap.min.css" rel="stylesheet" />
  <link href="/app/assets/css/paper-dashboard.css" rel="stylesheet" />
  <link rel="stylesheet" href="../../css/conf-general/conf-general.css">
  <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
  <link rel="stylesheet" href="/vendor/dataTables/jquery.dataTables.min.css">
  <link rel="stylesheet" href="/vendor/dataTables/dataTables.bootstrap4.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css">
  <link rel="stylesheet" href="/vendor/froala-editor/froala_editor.pkgd.min.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.4.1/font/bootstrap-icons.css">

  <style>
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
                    <a class="nav-link active" id="tabGenerales" href="#Generales" data-toggle="tab">Datos Generales</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" id="tabProductos" href="#products" data-toggle="tab">Productos</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#materia_prima" data-toggle="tab">Materia Prima</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" id='tabMaquinas' href="#maquinas" data-toggle="tab">Máquinas</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" id="tabCargaFabril" href="#carga-fabril" data-toggle="tab">Carga Fabril</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#process" data-toggle="tab">Procesos</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" id="tabNomina" href="#nomina-nav" data-toggle="tab">Nómina</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" id="tabGastosGenerales" href="#gastos" data-toggle="tab" id="nav-gastos">Gastos Generales</a>
                  </li>
                  <!-- <li class="nav-item">
                    <a href="#bpm-nav" data-toggle="tab" class="nav-link">BPM</a>
                  </li> -->
                </ul>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="tab-content text-center">
              <div class="tab-pane active" id="Generales">
                <form id="form-factor-prestacional">
                <option id="configNecesaria" value="false" hidden></option>
                  <div class="row">
                    <div class="col-md-6 col-sm-12">
                      <div class="card">
                        <div class="card-header">Tiempo de Máquina</div>
                        <div class="card-body">
                          <div class="form-group row">
                            <label class="col-md-5 col-sm-12 col-form-label col-6" for="my-input">Horas de Trabajo por Dia</label>
                            <input id="my-input-wh" class="col-md-6 form-control col-sm-10 col-5" type="number" name="workHours" value="0">
                          </div>
                          <div class="form-group row">
                            <label class="col-md-5 col-sm-12 col-form-label col-6" for="my-input">Dias Laborales del Mes</label>
                            <input id="my-input-dl" class="col-md-6 form-control col-sm-8 col-5" type="number" name="BussinesDayMonth" value="0" required>
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
                              <input id="my-input-sc" class="form-control" type="number" name="SalesCommission" value="0">
                              <div class="input-group-append">
                                <span class="input-group-text">%</span>
                              </div>
                            </div>
                          </div>
                          <div class="form-group row align-items-center mb-0">
                            <label class="col-md-4 col-form-label col-sm-12 col-6 " for="my-input">Margen De rentabilidad</label>
                            <div class="input-group col-md-7 col-sm-10 col-5 mb-0">
                              <input id="my-input-mr" class="form-control " type="number" name="ProfitabilityMargin" value="0" required>
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
              <div class="tab-pane" id="materia_prima">
                <div class="row">
                  <div class="col-md-4 col-sm-12">
                    <form id="form-materia-prima">
                      <input type="text" name="idMateriaPrima" id="idMateriaPrima" hidden>
                      <div hidden class="form-check form-check-radio form-check-inline">
                        <label>
                          <input type="radio" name="optionMateriaPrima" id="inlineRadio2" value="option2"> Modificar
                        </label>
                      </div>
                      <div class="card py-2">
                        <div class="row my-4 justify-content-center">
                          <div class="col-md-10 col-10">
                            <div class="form-group">
                              <label for="ref-materia-prima">Referencia</label>
                              <input id="ref-materia-prima" class="form-control mb-3" type="text" name="ref_material">
                              <label for="input-materia-prima">Materia Prima</label>
                              <input id="input-materia-prima" class="form-control" type="text" name="material">
                              <input type="hidden" name="material-description" id="material-description">
                              <input type="hidden" name="material-firstname" id="material-firstname">
                            </div>
                          </div>
                        </div>
                        <div class="row justify-content-center">
                          <div class="col-md-5 col-5">
                            <div class="form-group">
                              <label for="my-input">Unidad</label>
                              <input id="input-unidad" class="form-control" type="text" name="unidad">
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
                        <div class="col">
                          <input id="material-btn" type="submit" class="btn btn-primary" value="Adicionar">

                        </div>
                        <div class="col"></div>
                      </div>
                      <hr>
                      <div class="flex flex-wrap mb-5 mt-4">
                        <div class="w-full">
                          <h5 class="">Importar Materia Prima</h5>
                          <a href="#" id="download_materia_prima" title="Descargar plantilla Excel para Importar/Exportar" class="btn btn-success btn-icon"><i class="fas fa-file-excel"></i></a>
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
                      </div>
                      <div class="card-body">
                        <div class="table-responsive tableFixHead">
                          <table class="table table-hover" id="table-materia-prima">
                            <thead class="text-primary">
                              <th>Referencia</th>
                              <th>Materia Prima</th>
                              <th>Unidad</th>
                              <th>Costo</th>
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
              <!-- Fin  Materia Prima -->

              <!-- Inicio Maquina -->
              <div class="tab-pane" id="maquinas">
                <div class="row justify-content-center"> 
                  <div class="col-md-4 col-sm-12">
                    <form id="form-maquinas">
                      <!--<h3>Máquinas</h3>-->
                      <div hidden class="form-check form-check-radio form-check-inline">
                        <label class="form-check-label">
                          <input class="form-check-input" type="radio" name="optionMaquinas" id="inlineRadio1M" value="option1"> Adicionar
                          <span class="form-check-sign"></span>
                        </label>
                      </div>
                      <div hidden class="form-check form-check-radio form-check-inline">
                        <label class="form-check-label">
                          <input class="form-check-input" type="radio" name="optionMaquinas" id="inlineRadio2M" value="option2"> Modificar
                          <span class="form-check-sign"></span>
                        </label>
                      </div>
                      <div class="card py-2">
                        <div class="row my-2 justify-content-center">
                          <div class="col-md-10 col-10">
                            <div class="form-group">
                              <label for="input-maquinas">Nombre</label>
                              <input id="input-maquinas" class="form-control" type="text" name="machine">
                              <input type="hidden" id="machine-id" name="machine-id"></input>
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
                                <a href="#" data-toggle="tooltip" data-html="true" title="Es el monto que la entidad podría obtener en el momento presente por disponer de un activo de largo plazo, una vez alcanzada su vida útil.">
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
                              <label for="my-input">Depreciación por Minuto </label>
                              <input style="text-align: center" id="input-depreciation-machine" class="form-control disabled" type="number" disabled name="depreciation" step=".01">
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row mb-4">
                        <div class="col"></div>
                        <div class="col"><button id="maquinas-btn" class="btn btn-primary" type="submit" value="ADICIONAR">ADICIONAR</button></div>
                        <div class="col"></div>
                      </div>
                      <hr>
                      <div class="flex flex-wrap mb-5 mt-4">
                        <div class="w-full">
                          <h5 class="">Importar Máquinas</h5>
                          <a href="#" id="download_maquinas" title="Descargar plantilla Excel para Importar/Exportar" class="btn btn-success btn-icon"><i class="fas fa-file-excel"></i></a>
                        </div>
                        <div class="custom-file">
                          <input type="file" id="fileMachines" class="custom-file-input">
                          <label for="fileMachines" class="custom-file-label" data-browse="Elegir">Iniciar importación</label>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="col-md-8 col-sm-12">
                    <div class="card">
                      <div class="card-header">
                        <!--<h4>Máquinas</h4>-->
                      </div>
                      <div class="card-body">
                        <div class="table-responsive tableFixHead">
                          <table class="table table-compact table-hover" id="table-maquinas">
                            <thead class="text-primary">
                              <th>Máquina</th>
                              <th>P. Compra</th>
                              <th>Depreciación*Min</th>
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
              <!-- Fin Maquinas -->

              <!-- Inicio Carga Fabril -->
              <div class="tab-pane" id="carga-fabril">
                <div class="row justify-content-center">
                  <div class="col-md-4 col-sm-12">
                    <form id="form-cargafabril">
                      <div class="card py-2">
                        <div class="row my-2 justify-content-center">
                          <div class="col-md-10 col-10">
                            <div class="form-group">
                              <label for="cfmaquina">Máquina</label>
                              <input id="idCargaFabril" class="form-control" type="text" name="idCargaFabril" hidden />
                              <select name="cfmaquinas" id="cfmaquinas" class="form-control">
                              </select>
                            </div>
                          </div>
                          <div class="col-md-10 col-10">
                            <div class="form-group">
                              <label for="my-input">Carga Fabril</label>
                              <input id="mantenimiento" class="form-control" type="text" name="mantenimiento" />
                            </div>
                          </div>

                        </div>
                        <div class="row justify-content-center">
                          <div class="col-md-5 col-6">
                            <div class="form-group">
                              <label for="my-input">Costo</label>
                              <input id="costoCargaFabril" class="form-control" name="costoCargaFabril" value="0"/>
                            </div>
                          </div>
                          <div class="col-md-5 col-5">
                            <div class="form-group">
                              <label for="my-input">Costo por Minuto </label>
                              <input style="text-align: center" id="minutoCargaFabril" class="form-control disabled" type="number" readonly name="minutoCargaFabril" value="0">
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row mb-4">
                        <div class="col"></div>
                        <div class="col"><button id="cargaFabril-btn" class="btn btn-primary" type="submit" value="ADICIONAR">ADICIONAR</button></div>
                        <div class="col"></div>
                      </div>
                      <hr>
                      <div class="flex flex-wrap mb-5 mt-4">
                        <div class="w-full">
                          <h5 class="">Importar Carga Fabril</h5>
                          <a href="#" id="download_cargaFabril" title="Descargar plantilla Excel para Importar/Exportar" class="btn btn-success btn-icon"><i class="fas fa-file-excel"></i></a>
                        </div>
                        <div class="custom-file">
                          <input type="file" id="filecargaFabril" class="custom-file-input">
                          <label for="filecargaFabril" class="custom-file-label" data-browse="Elegir">Iniciar importación</label>
                        </div>
                      </div>
                    </form>
                  </div>
                  <div class="col-md-8 col-sm-12">
                    <div class="card">
                      <div class="card-header">
                      </div>
                      <div class="card-body">
                        <div class="table-responsive tableFixHead">
                          <table class="table table-compact table-hover" id="table-cargaFabril">
                            <thead class="text-primary">
                              <th>Máquina</th>
                              <th>Mantenimiento</th>
                              <th>Costo</th>
                              <th>Costo*Min</th>
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
              <!-- Fin Carga Fabril -->

              <!-- Incio Proceso -->
              <div class="tab-pane" id="process">
                <div class="row justify-content-center">
                  <div class="col-md-4 col-sm-12">
                    <!--<h3>Procesos</h3>-->
                    <form id="form-procesos">
                      <div hidden class="form-check form-check-radio form-check-inline">
                        <label class="form-check-label">
                          <input class="form-check-input" type="radio" name="optionProceso" id="inlineRadioProc1" value="option1"> Adicionar
                          <span class="form-check-sign"></span>
                        </label>
                      </div>
                      <div hidden class="form-check form-check-radio form-check-inline">
                        <label class="form-check-label">
                          <input class="form-check-input" type="radio" name="optionProceso" id="inlineRadioProc2" value="option2"> Modificar
                          <span class="form-check-sign"></span>
                        </label>
                      </div>
                      <div class="card py-2">
                        <div class="row my-4 justify-content-center">
                          <div class="col-md-10 col-10">
                            <div class="form-group">
                              <label for="input-proceso">Proceso</label>
                              <input id="input-proceso" class="form-control" type="text" name="proceso">
                              <input type="hidden" id="proceso-id" name="proceso-id">
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row justify-content-center mb-4">
                        <div class="col"></div>
                        <div class="col"><input id="btn-procesos" type="submit" class="btn btn-primary" value="Adicionar"></div>
                        <div class="col"></div>
                      </div>
                      <hr>
                      <div class="mb-5 mt-4">
                        <div class="w-full">
                          <h5 class="">Importar Procesos</h5>
                          <a id="btnDownloadProcesosExcel" title="Descargar plantilla Excel para Importar/Exportar" class="btn btn-success btn-icon"><i class="fas fa-file-excel"></i></a>
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

                        <div class="table-responsive tableFixHead">
                          <table class="table table-compact table-hover" id="table-procesos">
                            <thead class="text-primary">
                              <th>Procesos</th>
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
              <!-- FIn procesos -->

              <!-- Inicio BPM -->
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
              <!-- Fin BPM -->

              <!-- Incio Nomina -->
              <div class="tab-pane" id="nomina-nav">
                <div style="display: flex; justify-content:flex-end">
                  <button class="button btn btn-primary ml-4" id="btnCrearNomina"><i class="fa fa-plus" aria-hidden="true"></i></button>
                  <button class="button btn btn-info ml-2" id="btnImportarNomina"><i class="fa fa-download" aria-hidden="true"></i></button>
                </div>
                <div class="row my-5" id="panelImportarNomina">
                  <div class="card col-6">
                    <!-- <h5 class="pull-left">Importar Nomina</h5> -->
                    <div class="mt-3 mb-3" style="display:flex">
                      <a href="#" id="download_nomina" title="Descargar plantilla Excel para Importar/Exportar">1. Descargar plantilla Excel para Importar/Exportar</a> <!-- <i class="fas fa-file-excel"></i> -->
                    </div>
                    <div class="custom-file mb-5 col-10">
                      <input type="file" id="fileRosters" class="custom-file-input">
                      <label for="fileRosters" class="custom-file-label" data-browse="Elegir">Importar Nómina</label>
                    </div>
                  </div>
                </div>
                <div class="row justify-content-center align-items-center">
                  <div class="col-md-11 mb-3" id="panelCrearNomina">
                    <!--<h4>Nómina</h4>-->
                    <form id="form-nomina">
                      <div class="card my-1">
                        <div class="mt-3 tituloId">
                          <p style="margin-top: 0px;margin-bottom:0px;padding:5px">Descripción</p>
                        </div>
                        <div class="mt-3" id="identificacionNomina">
                          <input id="cargo-id" type="hidden" name="cargo-id">

                          <div class="form-group" class="">
                            <div class="input-group">
                              <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fa fa-user" aria-hidden="true"></i></span>
                              </div>
                              <input type="text" name="cargo" class="form-control" id="input-cargo" placeholder="Nombres" required>
                            </div>
                          </div>

                          <div class="form-group" class="">
                            <div class="input-group">
                              <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fa fa-cog" aria-hidden="true"></i></span>
                              </div>
                              <select class="custom-select" id="select-proceso" name="proceso">
                                <option value="0" selected="true" disabled>Seleccione un proceso</option>
                                <!-- <option selected disabled>Seleccione el proceso</option> -->
                              </select>
                            </div>
                          </div>

                        </div>
                        <div class="titulo mt-3">
                          <p class="captionTitulo">Devengado</p>
                          <p class="captionTitulo">Jornada</pss=>
                        </div>
                        <div class="form-group row align-items-center mt-3" id="contenedor-devengado">
                          <div class="form-group">
                            <label for="input-salario">Salario</label>
                            <div class="input-group">
                              <div class="input-group-prepend">
                                <span class="input-group-text">$</span>
                              </div>
                              <input type="text" class="form-control derecha" id="input-salario" name="salario" value="0" required>
                            </div>
                          </div>
                          <div class="form-group" class="">
                            <label for="input-transporte">Transporte</label>
                            <div class="input-group">
                              <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fa fa-bus" aria-hidden="true"></i></span>
                              </div>
                              <input type="text" class="form-control derecha" id="input-transporte" name="transporte" value="0" required>
                            </div>
                          </div>

                          <div class="form-group jornada" id="horasTrabajo">
                            <label for="inputPassword">Horas de Trabajo x Día</label>
                            <div class="input-group">
                              <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fa fa-clock" aria-hidden="true"></i></span>
                              </div>
                              <input type="text" class="form-control centrado" id="inputHorasTrabajo" name="horasTrabajo" min="1" max="18">
                            </div>
                          </div>
                        </div>

                        <div id="contenedor-jornada" class="mb-3">
                          <div class="form-group">
                            <label for="inputPassword">Otros Ingresos</label>
                            <div class="input-group">
                              <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fa fa-trophy" aria-hidden="true"></i></span>
                              </div>
                              <input type="text" class="form-control derecha" id="input-bonificacion" name="bonificacion" value="0">
                            </div>
                          </div>
                          <div class="form-group">
                            <label for="input-dotacion">Dotación</label>
                            <div class="input-group">
                              <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fa fa-male" aria-hidden="true"></i></span>
                              </div>
                              <input type="text" class="form-control derecha" id="input-dotacion" name="dotacion" value="0">
                            </div>
                          </div>

                          <div class="form-group">
                            <label for="input-horas-extra">Horas Extra</label>
                            <div class="input-group">
                              <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fa fa-sun" aria-hidden="true"></i></span>
                              </div>
                              <input type="text" class="form-control derecha" id="input-horas-extra" name="horasExtra" value="0">
                            </div>
                          </div>

                          <div class="form-group jornada" id="diasLaborales">
                            <label for="inputDiasMes">Dias laborales/Mes</label>
                            <div class="input-group">
                              <div class="input-group-prepend">
                                <span class="input-group-text"><i class="fa fa-calendar" aria-hidden="true"></i></span>
                              </div>
                              <input type="number" class="form-control centrado" id="inputDiasMes" name="diasMes" min="1" max="31">
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="card my-1">
                        <div class="mt-3 tituloId">
                          <p style="margin-top: 0px;margin-bottom:0px;padding:5px">Factor Prestacional</p>
                        </div>

                        <div id="factor">
                          <div class="form-check" id="fpNominas">
                            <label class="form-check-label" for="fpNomina" style="padding-right: 35px;">Nómina</label>
                            <input class="form-check-input" type="radio" name="fpRadioB" id="fpNomina">
                          </div>
                          <div class="form-check">
                            <label class="form-check-label" for="fpServicios" style="padding-right: 35px;">Servicios</label>
                            <input class="form-check-input" type="radio" name="fpRadioB" id="fpServicios">
                          </div>

                          <div class="form-check">
                            <label class="form-check-label" for="fpManual" style="padding-right: 35px;">Manual</label>
                            <input class="form-check-input" type="radio" name="fpRadioB" id="fpManual">
                          </div>
                          <input type="text" class="form-control" id="optionFactorPrestacional" name="optionFactorPrestacional" hidden>
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
                            <button class="btn btn-info" type="button" data-toggle="modal" data-target="#modalFactorPrestacional"></button>
                          </div>
                        </div>

                      </div>

                      <div class="row justify-content-center">
                        <div class="col"></div>
                        <div class="col"><input id="nomina-btn" type="submit" class="btn btn-primary" value="Adicionar"></div>
                        <div class="col"></div>
                      </div>
                    </form>
                  </div>

                  <div class="col-md-12">
                    <div class="card">
                      <div class="card-header">
                        <h4>Costos de Nómina</h4>
                      </div>
                      <div class="card-body">
                        <div class="table-responsive table-hover tableFixHead">
                          <table class="table" id="tableNominas">
                            <thead class="text-primary">
                              <th>Nombres</th>
                              <th>Proceso</th>
                              <th>Salario</th>
                              <th>Salario Neto</th>
                              <th>Minuto</th>
                              <th>Acciones</th>
                            </thead>
                            <tbody>

                            </tbody>
                            <tfoot>
                              <tr>
                                <th colspan="4" style="text-align:right">Total Nómina:</th>
                                <th></th>
                                <th></th>
                                <th></th>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>


              <div class="tab-pane" id="gastos">
              <div id="gastosGeneralesTable"></div>
              <div class="row align-content-center text-primary">
                    <div class="col-2"><b>51</b></div>
                    <div class="col-8"><b>Gastos Operacionales de Administración</b></div>
                    <div class="col-2" id="sum-51">$ 0.00</div>
                  </div>
                  <div class="container" id="container-51">

                  </div>
                  <div class="row align-content-center justify-content-center">
                    <div class="col"></div>
                    <div class="col text-center">
                      <button class="btn btn-primary btn-round btn-icon" id="btn_add_51"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="col"></div>
                  </div>
                  <!-- siguiendo grupo de cuenta -->
                  <div class="row align-content-center text-primary">
                    <div class="col-2"><b>52</b></div>
                    <div class="col-8"><b>Gastos Operacionales de Ventas</b></div>
                    <div class="col-2" id="sum-52">$ 0.00</div>
                  </div>
                  <div class="container" id="container-52">

                  </div>
                  <div class="row align-content-center justify-content-center">
                    <div class="col"></div>
                    <div class="col text-center">
                      <button class="btn btn-primary btn-round btn-icon" id="btn_add_52"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="col"></div>
                  </div>
                  <!-- siguiendo grupo de cuenta -->
                  <div class="row align-content-center text-primary">
                    <div class="col-2"><b>53</b></div>
                    <div class="col-8"><b>Gastos No operacionales</b></div>
                    <div class="col-2" id="sum-53">$ 0.00</div>
                  </div>
                  <div class="container" id="container-53">

                  </div>
                  <div class="row align-content-center justify-content-center">
                    <div class="col"></div>
                    <div class="col text-center">
                      <button class="btn btn-primary btn-round btn-icon" id="btn_add_53"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="col"></div>
                  </div>
                  <!-- siguiendo grupo de cuenta -->
                  <div class="row align-content-center text-primary">
                    <div class="col-2"><b>73</b></div>
                    <div class="col-8"><b>Costos indirectos de fabricación</b></div>
                    <div class="col-2" id="sum-73">$ 0.00</div>
                  </div>
                  <div class="container" id="container-73">

                  </div>
                  <div class="row align-content-center justify-content-center">
                    <div class="col"></div>
                    <div class="col text-center">
                      <button class="btn btn-primary btn-round btn-icon" id="btn_add_73"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="col"></div>
                  </div>
                  <!-- siguiendo grupo de cuenta -->
                  <div class="row align-content-center text-primary">
                    <div class="col-2"><b>74</b></div>
                    <div class="col-8"><b>Contrato de servicios</b></div>
                    <div class="col-2" id="sum-74">$ 0.00</div>
                  </div>
                  <div class="container" id="container-74">

                  </div>
                  <div class="row align-content-center justify-content-center">
                    <div class="col"></div>
                    <div class="col text-center">
                      <button class="btn btn-primary btn-round btn-icon" id="btn_add_74"><i class="fas fa-plus"></i></button>
                    </div>
                    <div class="col"></div>
                  </div>
                <div class="container mt-2" style="width:950px;">
                  <div class="row align-content-center text-primary mb-2">
                    <div class="col-10"><b>Total Gastos</b></div>
                    <div class="col-2 sum-total" id="sum-total">$ 0.00</div>
                  </div>
                  <hr>
                  <div class="row align-content-center justify-content-center">
                    <div class="col"></div>
                    <div class="col"></div>
                    <div class="col text-right">
                      <button class="btn btn-success" id="btn_submit_GE"><i class="fas fa-save"></i>
                        Guardar
                      </button>
                    </div>
                  </div>
                  <hr>
                </div>
                <div class="flex flex-wrap mb-5">
                  <div class="w-full">
                    <h6 class="">Importar Gastos Generales</h6>
                    <a href="#" title="Descargar Archivo Gastos Generales ejemplo" id="download-description-expenses" class="btn btn-success btn-icon"><i class="fas fa-file-excel"></i></a>
                  </div>
                  <div class="custom-file">
                    <input type="file" id="fileExpensesDescription" class="custom-file-input">
                    <label for="fileExpensesDescription" class="custom-file-label" data-browse="Elegir">Iniciar Importación</label>
                  </div>
                </div>
              </div>

              <div class="tab-pane" id="products">
                <div class="row justify-content-center">
                  <div class="col-md-5 col-sm-12 col-12 col-xs-12 mb-5">
                    <form id="form-products" novalidate>
                      <div class="card py-2 flex justify-center items-center">
                        <div class="form-group w-5/6 mx-auto">
                          <label class="text-left col-form-label pl-4">Referencia</label>
                          <input type="text" class="form-control" id="inputRef" name="ref" />
                        </div>
                        <div class="form-group w-5/6 mx-auto">
                          <label class="text-left col-form-label pl-4">Producto</label>
                          <input type="text" class="form-control" id="inputProducto" name="producto" />
                        </div>
                        <div class="form-group w-5/6 mx-auto">
                          <label class="text-left col-form-label pl-4">Rentabilidad</label>
                          <input type="text" class="form-control" id="inputRentabilidad" name="rentabilidad" />
                        </div>
                      </div>
                      <div class="row mb-4">
                        <div class="col"></div>
                        <div class="col">
                          <input type="hidden" id="prodId" name="prodId" value="">
                          <button id="form-product-btn" class="btn btn-primary">Guardar</button>
                        </div>
                        <div class="col"></div>
                      </div>
                    </form>
                    <hr>
                    <div class="flex flex-wrap my-4">
                      <div class="w-full">
                        <h5 class="">Importar Productos</h5>
                        <a href="#" title="Descargar plantilla Excel para Importar/Exportar" id="download-products" class="btn btn-success btn-icon"><i class="fas fa-file-excel"></i></a>
                      </div>
                      <div class="custom-file w-full">
                        <input type="file" id="fileProducts" class="custom-file-input" data-browse="Elegir" lang="es">
                        <label for="fileProducts" class="custom-file-label">importar Archivo</label>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-7 col-sm-12 col-12">
                    <div class="card">
                      <div class="card-header">
                      </div>
                      <div class="card-body w-full">
                        <div class="tableFixHead">
                          <table class="table w-full" id="tableProductos">
                            <thead class="text-primary w-full">
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
  <script src="/js/utils/watch-unwatch-jquery.js"></script>
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
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/5.5.2/bootbox.min.js"></script>

  <script src="/js/utils/PriceParser.js"></script>
  <script src="/js/app/xlsx/SubidaExcel.js" type="module"></script>
  <script src="/js/RedondeoDecimal.js"></script>

  <script src="/js/productos-adicionar.js" type="module"></script>

  <!--<script src="/js/GastosGenerales/index.js" type="module"></script>-->
  <script src="/js/gastos-generales.js" type="module"></script>

  <script src="/js/materia-prima.js" type="module"></script>
  <script src="/js/factor-prestacional.js"></script>
  <script src="/js/maquinas.js" type="module"></script>
  <script src="/js/carga-fabril.js" type="module"></script>
  <script src="/js/procesos.js" type="module"></script>
  <script src="/js/nomina.js"></script>
  <script src="/js/app/xlsx/xlsx_gastos_generales.js" type="module"></script>
  <script src="/js/app/xlsx/xlsx_productos.js" type="module"></script>
  <script src="/js/app/xlsx/xlsx_procesos.js" type="module"></script>
  <script src="/js/app/xlsx/xlsx_materia_prima.js" type="module"></script>
  <script src="/js/app/xlsx/xlsx_carga_fabril.js" type="module"></script>
  <script src="/js/app/xlsx/xlsx_maquinas.js" type="module"></script>
  <script src="/js/app/xlsx/xlsx_nomina.js" type="module"></script>
  <script src="/js/horas_extra.js"> </script>
  <script src="/js/app/bpm.js"></script>
  <script src="/js/toggleSidebar.js"></script>
  <!-- <script src="/js/menu.js"></script> -->

  </script>
  <script>

    $(function() {
      $('[data-toggle="tooltip"]').tooltip({
        html: true
      })
    })
  </script>
  <script>
    /* Ampliar menu */
    $('#collapseParametrizar').show();
    $('.general').css('color', '#ef8157');
    $('#collapse-herramientas').slideUp();
    $('#collapse-administrator').slideUp();
  </script>
</body>

</html>