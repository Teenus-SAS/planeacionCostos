<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
include(PARTIALS_PATH . "verify_session.php") ?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <title>
    Parametrizacion Productos
  </title>
  <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, shrink-to-fit=no' name='viewport' />
  <!--     Fonts and icons     -->
  <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700,200" rel="stylesheet" />
  <link href="/vendor/font-awesome/font-awesome.min.css" rel="stylesheet">
  <!-- CSS Files -->
  <link href="/app/assets/css/bootstrap.min.css" rel="stylesheet" />
  <link href="/app/assets/css/paper-dashboard.css" rel="stylesheet" />
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
      width: 98%;
    }

    i.fa.fa-cog.fa-spin.fa-3x.fa-fw {
      position: fixed;
      right: 50%;
      z-index: 10000;
      bottom: 50%;
      font-size: 5rem;
    }

    i.fa.fa-cog.fa-spin.fa-3x.fa-fw.fade {
      position: fixed;
      right: 50%;
      z-index: -10000;
      bottom: 50%;
      font-size: 5rem;
    }

    input.money {
      text-align: right;
    }

    .custom-file-label::after {
      content: "Cargar";
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
      padding-right: 60px;
    }

    .product-name {
      overflow: hidden;
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
              <div class="nav-tabs-wrapper" id="tabs">
                <ul class="nav nav-tabs" data-tabs="tabs">
                  <li class="nav-item">
                    <a class="nav-link active prod" id="tab1" href="#home" data-toggle="tab">Productos</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" id="tab2" href="#updates" data-toggle="tab">Procesos</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#servicios-externos" data-toggle="tab">Servicios Externos</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#history" data-toggle="tab">Distribución de Gastos</a>
                  </li>

                  <li class="nav-item">
                    <a class="nav-link" href="#lineas" data-toggle="tab" id="nav-lienas">Líneas de Productos</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="tab-content text-center">
              <div class="tab-pane active" id="home">
                <div class="row justify-content-center">
                  <div class="col-md-5 col-sm-12 col-12 col-xs-12 mb-5">
                    <form id="form-products" novalidate>
                      <!--<div class="form-check form-check-radio form-check-inline">
                        <label class="form-check-label">
                           <input class="form-check-input" type="radio" name="optionProductos" id="inlineRadio1" value="option1"> 
                          Configurar
                           <span class="form-check-sign"></span>
                        </label>
                      </div>
                      <div class="form-check form-check-radio form-check-inline" >
                        <label class="form-check-label" id="config-color">
                          <input class="form-check-input" type="radio" name="optionProductos" id="inlineRadio2" value="option2" > Configurar
                          <span class="form-check-sign"></span>
                        </label>
                      </div> -->
                      <div class="card py-2">
                        <div class="form-group row my-2">
                          <label class="col-sm-5 col-md-4 col-12 text-left col-form-label pl-4">Referencia</label>
                          <div class="col-sm-6 col-md-7 px-0 col-10">
                            <input type="text" class="form-control" id="inputRef" name="ref">
                          </div>
                        </div>
                        <div class="form-group row my-2">
                          <label class="col-sm-5 col-md-4 col-12 text-left col-form-label pl-4">Producto</label>
                          <div class="col-md-7 col-sm-6 px-0 col-10">
                            <input type="text" class="form-control" id="inputProducto" name="producto">
                          </div>
                        </div>

                        <div class="form-group row my-2">
                          <label class="col-sm-5 col-md-4 col-12 text-left col-form-label pl-4">Rentabilidad</label>
                          <div class="col-sm-6 col-md-7 px-0 col-10">
                            <input type="text" class="form-control" id="inputRentabilidad" name="rentabilidad">
                          </div>
                        </div>

                        <div class="form-group row my-2">
                          <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">Materia</label>
                          <div class="col-md-7 px-0 col-10">
                            <select class="custom-select input-materia" id="input-materia" name="materia"></select>
                          </div>
                        </div>
                        <div class="form-group row my-3">
                          <label class="col-md-3 col-3 col-form-label px-0 ">Cantidad</label>
                          <div class="col-md-3 col-3 text-left px-0">
                            <input type="number" id="input-cantidad" min="1" class="form-control" name="cantidad" step=".01">
                          </div>
                          <label class="col-md-2 col-2 col-form-label px-0">Unidad</label>
                          <div class="col-md-3 col-3 text-left px-0">
                            <input type="text" id="input-unidad" class="form-control" name="unidad" disabled>
                          </div>
                        </div>
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
                        <a href="#" title="Descargar hoja de Excel de ejemplo" id="download-products-materials" class="pull-right btn btn-success btn-icon"><i class="fas fa-file-excel"></i></a>
                      </div>
                      <div class="custom-file">
                        <input type="file" id="fileProductsMaterials" class="custom-file-input" data-browse="Elegir" lang="es">
                        <label for="fileProducts" class="custom-file-label">importar Archivo</label>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-7 col-sm-12 col-12">
                    <div class="card">
                      <div class="card-header">
                      </div>
                      <div class="card-body">
                        <!-- <button class="btn btn-danger" id="delete-materia-prima">Eliminar</button> -->
                        <div class="table-responsive tableFixHead">
                          <table class="table" id="tableProductoMateriaPrima">
                            <thead class="text-primary">
                              <th>Materia Prima</th>
                              <th>Cantidad</th>
                              <th>Unidad</th>
                              <th>Acciones</th>
                            </thead>
                            <tbody>
                            </tbody>
                          </table>
                        </div>
                        <div class="table-responsive tableFixHead" style="display: none;">
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
              <div class="tab-pane" id="updates">
                <div class="row justify-content-center">
                  <!-- align-items-center -->
                  <div class="col-md-4 col-sm-12">
                    <!--<h3>Productos por Proceso</h3>-->
                    <form id="form-product-process">
                      <div class="card py-2">
                        <div class="form-group row my-2">
                          <label class="col-form-label col-4 text-right">Referencia</label>
                          <div class="col-7">
                            <select type="text" class="custom-select" id="inputRefProcess" name="ref">

                            </select>
                          </div>
                        </div>
                        <div class="form-group row my-2">
                          <label class="col-form-label col-4 text-right">Producto</label>
                          <div class="col-7">
                            <select type="text" class="custom-select" id="inputProductProcess" name="producto">

                            </select>
                          </div>
                        </div>
                        <div class="form-group row my-2">
                          <label class="col-form-label col-4 text-right">Proceso</label>
                          <div class="col-7">
                            <select type="text" class="custom-select" id="selectProcess" name="proceso">

                            </select>
                          </div>
                        </div>
                        <div class="form-group row my-2">
                          <label class="col-form-label col-4 text-right">Máquina</label>
                          <div class="col-7">
                            <select type="text" class="custom-select" id="selectMachines" name="maquina">

                            </select>
                          </div>
                        </div>
                        <div class="form-group row my-2">
                          <label class="col-form-label col-4 text-right">Tiempo de Alistamiento (Min)</label>
                          <!-- <label class="col-form-label col-4 text-right">Unidades Producidas Hora</label> -->
                          <div class="col-5">
                            <input type="number" min="0" class="form-control" step=".001" id="input-tiempo-alistamiento" name="tiempo-alistamiento">
                            <!-- <input type="number" class="form-control" step=".001" id="input-unidad-hora"> -->
                          </div>
                        </div>
                        <div class="form-group row my-2">
                          <label class="col-form-label col-4 text-right">Tiempo de Operación (Min)</label>
                          <!-- <label class="col-form-label col-4 text-right">Minutos * Unidad</label> -->
                          <div class="col-5">
                            <input type="number" min="0" class="form-control" id="input-tiempo-operacion" name="tiempo-operacion">
                            <!-- <input type="text" disabled class="form-control" id="tiempo-seg"> -->
                          </div>
                        </div>
                        <div class="form-group row my-2">
                          <label class="col-form-label col-4 text-right">Tiempo de Total</label>
                          <div class="col-5">
                            <input type="number" disabled class="form-control" id="input-tiempo-total" name="tiempo-total">
                          </div>
                        </div>
                      </div>
                      <div class="row mb-4">
                        <div class="col"></div>
                        <div class="col">
                          <button class="btn btn-primary" id="btnguardarproceso">Guardar</button>
                        </div>
                        <div class="col"></div>
                      </div>
                    </form>
                    <hr>
                    <div class="row mb-5 mt-4">
                      <div class="col-12">
                        <h5 class="pull-left">Importar Productos</h5>
                        <a href="#" title="Descargar Base de Datos de Productos y Procesos" id="download-products-processes" class="pull-right btn btn-success btn-icon"><i class="fas fa-file-excel"></i></a>
                      </div>
                      <div class="custom-file">
                        <input type="file" id="fileProductsProcesses" class="custom-file-input">
                        <label for="fileProductsProcesses" class="custom-file-label" data-browse="Elegir">Importar Archivo</label>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-8 col-sm-12">
                    <div class="card">
                      <div class="card-header">
                        <!--<h4 id="titleProductProcess">Procesos</h4>-->
                      </div>
                      <div class="card-body">
                        <!-- <button class="btn btn-danger" id="btn-delete-process">Eliminar</button> -->
                        <div class="table-responsive tableFixHead">
                          <table class="table" id="table-product-process">
                            <label class="text-primary" id="titleProductProcess"></label>
                            <thead class="text-primary">
                              <th>Proceso</th>
                              <th>Máquina</th>
                              <th>Tiempo Alistamiento (Min)</th>
                              <th>Tiempo Operación (Min)</th>
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

              

              <!-- Inicio Servicios Externos -->
              <div class="tab-pane" id="servicios-externos">
                <div class="row justify-content-center align-items-center">
                  <div class="col-md-4 col-sm-12">
                    <form id="form-serviciosExternos">
                      <div class="card py-2">
                        <div class="row my-2 justify-content-center">
                          <div class="col-md-10 col-10">
                            <div class="form-group">
                              <label for="cfproductos">Producto</label>
                              <input id="idServicioExterno" class="form-control" type="text" name="idServicioExterno" hidden />
                              <select name="cfproductos" id="cfproductos" class="form-control">
                              </select>
                            </div>
                          </div>
                          <div class="col-md-10 col-10">
                            <div class="form-group">
                              <label for="servicioexterno">Servicio Externo</label>
                              <input id="servicioexterno" class="form-control" type="text" name="servicioexterno" />
                            </div>
                          </div>

                        </div>
                        <div class="row justify-content-center">
                          <div class="col-md-10 col-10">
                            <div class="form-group">
                              <label for="my-input">Costo</label>
                              <input id="costoServicioExterno" class="form-control" name="costoServicioExterno" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row mb-4">
                        <div class="col"></div>
                        <div class="col"><button id="serviciosExternos-btn" class="btn btn-primary" type="submit" value="ADICIONAR">ADICIONAR</button></div>
                        <div class="col"></div>
                      </div>
                      <hr>
                      <div class="row mb-5 mt-4">
                        <div class="col-12">
                          <h5 class="pull-left">Importar Servicios Externos</h5>
                          <a href="#" id="download_serviciosExternos" title="Descargar plantilla Excel para Importar/Exportar" class="pull-right btn btn-success btn-icon"><i class="fas fa-file-excel"></i></a>
                        </div>
                        <div class="custom-file">
                          <input type="file" id="fileserviciosExternos" class="custom-file-input">
                          <label for="fileserviciosExternos" class="custom-file-label" data-browse="Elegir">Iniciar importación</label>
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
                          <table class="table table-compact table-hover" id="table-serviciosExternos">
                            <thead class="text-primary">
                              <th>Servicio</th>
                              <th>Producto</th>
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
              <!-- Fin Servicios Externos -->

              <div class="tab-pane" id="history">
                <div class="row justify-content-center align-items-center">
                  <div class="col-md-8">
                    <!--<h3>Ventas Mensuales</h3>-->
                    <form id="formGastosMensuales">
                      <div class="card py-2">
                        <div class="form-group row my-2">
                          <label class="col-form-label col-4 text-right">Referencia</label>
                          <div class="col-7">
                            <select name="ref" id="inputRefGastos" class="custom-select">

                            </select>
                          </div>
                        </div>
                        <div class="form-group row my-2">
                          <label class="col-form-label col-4 text-right">Productos</label>
                          <div class="col-7 text-left">
                            <select name="producto" id="inputProductosGastos" class="custom-select">

                            </select>
                          </div>
                        </div>
                        <div class="row pr-5 pl-4">
                          <div class="col-md-6 col-6">
                            <div class="form-group">
                              <label for="my-input">Unidades Vendidas</label>
                              <div class="input-group">
                                <div class="input-group-prepend">
                                  <span class="input-group-text">#</span>
                                </div>
                                <input type="text" class="form-control" id="inputUnidadesVendidas" name="unidades">
                              </div>
                            </div>
                          </div>
                          <div class="col-md-6 col-6">
                            <div class="form-group">
                              <label for="my-input">Volumen de Ventas</label>
                              <div class="input-group">
                                <div class="input-group-prepend">
                                  <span class="input-group-text">$</span>
                                </div>
                                <input type="text" name="volumen" class="form-control money" aria-label="Username" id="inputVolumenVentas">
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="form-group row justify-content-center">
                        <label for="inputGastosGenerales" class="col-form-label col-md-5 col-12">
                          <h6>Gastos Generales del Mes</h6>
                        </label>
                        <div class="col-md-7 col-12 col-sm-12">
                          <div class="input-group text-center">
                            <div class="input-group-prepend">
                              <span class="input-group-text">
                                $ &nbsp;&nbsp;
                              </span>
                            </div>
                            <input type="text" name="gastosGenerales" id="inputGastosGenerales" class="form-contol money">
                            <div class="input-group-append">
                              <a class="btn btn-primary my-0 nav-link" id="link-gastos" href="javascript:goGG()">></a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="row mb-4">
                        <div class="col"></div>
                        <div class="col">
                          <button class="btn btn-primary">Guardar</button>
                        </div>
                        <div class="col"></div>
                      </div>

                    </form>
                  </div>
                  <div class="col-md-12">
                    <div class="card">
                      <div class="card-header">
                        <h4>Distribución Gastos Generales</h4>
                      </div>
                      <div class="card-body">
                        <div class="table-responsive tableFixHead">
                          <table class="table table-compact table-hover" id="tableGastosMensuales">
                            <thead class="text-primary">
                              <th>Referencia</th>
                              <th>Producto</th>
                              <th>Unidades Vendidas(%)</th>
                              <th>Volumen Ventas(%)</th>
                              <th>Gastos Atribuibles</th>
                            </thead>
                            <tbody>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="row my-5">
                    <div class="col-12">
                      <h6 class="pull-left">Importar Volumenes y Ventas Mensuales</h6>
                      <a href="#" title="Descargar Base de Datos de Gastos Generales" id="download-products-expenses" class="pull-right btn btn-success btn-icon"><i class="fas fa-file-excel"></i></a>
                    </div>
                    <div class="custom-file">
                      <input type="file" id="fileProductsExpenses" class="custom-file-input">
                      <label for="fileProductsExpenses" class="custom-file-label" data-browse="Elegir">Iniciar importación</label>
                    </div>
                  </div>
                </div>
              </div>

              <!-- tab lineas -->
              <div class="tab-pane" id="lineas">
                <div class="row justify-content-center">
                  <div class="col-md-12 col-12 text-center">
                    <h3>Configuración lineas de Producción</h3>
                  </div>
                </div>
                <div class="row mb-2">
                  <div class="col-sm-5 col-12 col-sm-offset-1">
                    <div class="input-group">
                      <input type="text" id="search-product" placeholder="Buscar" class="form-control">
                      <div class="input-group-append">
                        <button class="btn m-0"><i class="fas fa-search"></i></button>
                      </div>
                    </div>
                  </div>
                  <div class="col-sm-2"></div>
                  <div class="col-sm-5 col-12 col-sm-offset-1">
                    <div class="input-group">
                      <select id="select-lineas" class="form-control"></select>
                      <input type="text" id="lineas-create" style="display: none;" placeholder="Nombre de linea" class="form-control">
                      <div class="input-group-append">
                        <a title="Agregar una linea" class="btn m-0" href="javascript:toggleCreateOrSelect();" id="btn_create_or_select_lineas"><i class="fas fa-plus"></i></a>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="row justify-content-center">
                  <div class="col-sm-5 col-12 col-sm-offset-1">
                    <div class="list-group" id="list1">
                      <a href="#" class="list-group-item active"> <span class="pull-left">Referencia</span> <span class="pull-right">Producto</span>
                        <input title="selecionar todo" type="checkbox" class="all pull-right"></a>
                    </div>
                  </div>
                  <div class="col-md-2 col-6 v-center text-canter">
                    <button title="Agregar a la lista" class="btn btn-default center-block add"><i class="nc-icon nc-minimal-right"></i></button>
                    <button title="Eliminar de la lista" class="btn btn-default center-block remove"><i class="nc-icon nc-minimal-left"></i></button>
                    <div class="col-md-2 col">
                      <button class="btn btn-primary btn-round" id="btn-guardar-lineas">Guardar</button>
                    </div>
                  </div>
                  <div class="col-sm-5 col-12">
                    <div class="list-group" id="list2">
                      <a href="#" class="list-group-item active title"><span class="pull-left">Referencia</span>
                        <input title="toggle all" type="checkbox" class="all pull-right">
                        <span class="pull-right title mar">Productos</span>
                      </a>
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
  <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
  <script src="/vendor/dataTables/jquery.dataTables.min.js"></script>
  <script src="/vendor/dataTables/dataTables.bootstrap4.min.js"></script>
  <script src="/vendor/numberFormat/jquery.number.min.js"></script>

  <script src="/vendor/jquery-validation/jquery.validate.min.js"></script>

  <script src="/vendor/xlsx-js/xlsx.full.min.js"></script>
  <script src="/vendor/file-saver/FileSaver.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"></script>
  <script src="/vendor/froala-editor/froala_editor.pkgd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/bootbox.js/5.5.2/bootbox.min.js"></script>
  <script src="/js/servicios-externos.js"></script>
  <script src="/js/toggleSidebar.js"></script>
  <script>
    if ($(window).width() < 768) {
      $('#home .card .row').addClass('justify-content-center')
    }
  </script>
  <script>
    /* Ampliar menu */
    $('#collapseParametrizar').show();
    $('.productos').css('color', '#ef8157');
    $('#collapse-herramientas').slideUp();
    $('#collapse-administrator').slideUp();
  </script>
  </script>
  <script src="/js/RedondeoDecimal.js"></script>

  <!--   <script src="/js/productos.js"></script> -->
  <script src="/js/productos-configurar.js"></script>
  <script src="/js/productos_procesos.js"></script>
  <script src="/js/gastos-generales.js"></script>
  <script src="/js/calculo_GG.js"></script>
  <script src="/js/app/xlsx/xlsx_productos_materiaprima.js"></script>
  <script src="/js/app/xlsx/xlsx_productos_procesos.js"></script>
  <script src="/js/app/xlsx/xlsx_gastos_generales.js"></script>
  <script src="/js/app/xlsx/xlsx_calculo_GG.js"></script>
  <script src="/js/app/lineas.js"></script>
</body>

</html>