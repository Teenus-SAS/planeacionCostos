<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
include(PARTIALS_PATH . "verify_session.php") ?>
<!DOCTYPE html>
<html lang="es">

<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
  <title>
    Optimizacion | Tezlik
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
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.css" />
  <link rel="stylesheet" href="/vendor/froala-editor/froala_editor.pkgd.min.css">
  

  <style>
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
<div class="wrapper"id="estorbo">
    <?php include(PARTIALS_PATH . "sidebar.php") ?>
    <div class="main-panel" >
      <!-- Navbar -->
      <?php include(PARTIALS_PATH . "navbar.html") ?>
      <!-- End Navbar -->

      <div class="content">
        <div class="card card-nav-tabs card-plain">
          <div class="card-header card-header-primary">
            <!-- colors: "header-primary", "header-info", "header-success", "header-warning", "header-danger" -->
            <div class="nav-tabs-navigation">
              <div class="nav-tabs-wrapper">
                <ul class="nav nav-tabs" data-tabs="tabs">
                  <li class="nav-item">
                    <a class="nav-link active" href="#home" data-toggle="tab">Materia prima</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#updates" data-toggle="tab">Procesos</a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" href="#uMes" data-toggle="tab">Unidades Mes</a>
                  </li>
                  
                </ul>
              </div>
            </div>
          </div>
          <div class="card-body">
            <div class="tab-content text-center">
              <div class="tab-pane active" id="home">
              <div class = "row">
                <div class="col-md-10 col-sm-12 col-12 col-xs-12 mb-5">
                  <div class="card py-2">
                      <div class="form-group row my-2">
                      <label class="col-sm-5 col-md-2 col-12 text-left col-form-label pl-4">Producto</label>
                      <div class="col-md-3 col-sm-6 px-0 col-10"><select class="custom-select" id="input-productoA" name="materia"></select></div>
                      <label class="col-md-2 col-3 col-form-label px-0  ml-2">Cantidad Orden de Pedido</label>
                      <div class="col-md-3 col-3 text-left px-0 ml-4"><input type="number" id="input-cantidadOP" class="form-control" name="cantidad" step=".01" value=""></div>
                      </div>
                        <div class="row mb-4">
                          <div class="col"></div>
                            <div class="col">
                              <button class="btn btn-primary" id="btnValidar">Cargar</button>
                            </div>
                          <div class="col"></div>
                        </div>      
                       </div>
                          
                        </div>
                        <!--<div class="col-md-5 col-sm-12 col-12 col-xs-12 mb-5" id="cargaValor">
                        </div>-->
                  </div>
                  <div class="col-md-10 col-sm-12 col-12 col-xs-12 mb-5">
                  <div class="card py-2">
                  <h3 class="card-title bg-primary text-white text-left" style="padding:2% " id="Titulo">Carga</h5>
                  <table class="table" id="tableAnalisisMateriaPrima">
                            <thead class="text-primary">
                              <th>Materia Prima</th>
                              <th>Cantidad</th>
                              <th> Vlr Unidad</th>
                              <th>Consumo Op</th>
                              <th>Vlr Total</th>
                              <th>% participación</th>
                              </br>
                            </thead>
                            <tr>
                            </tr>
                            <tbody>
                            </tbody>
                            <tfoot> 
                                <tr> 
                                  <th>Total:</th> 
                                  <th></th>
                                  <th></th>
                                  <th></th>
                                  <th></th>
                                </tr> 
                            </tfoot> 

                          </table>
                          <div class="form-group row my-2">
                            <label class="col-sm-4 col-md-7 col-12 text-left col-form-label pl-4"><Strong><h6>Costos Totales materias primas para la orden de produccion</h6></Strong></label>
                            <div class="col-md-3 col-3 text-left px-0 "><input type="text" readonly id="Costo_total" class="form-control"></div>  
                          </div>
                  </div>

                </div>
                <hr>
                
                <!--<div class="col-md-5 col-sm-12 col-12 col-xs-12 mb-5">
                <h3 >Unidades fabricadas al mes</h3>
                  <div class="card py-2">
                    <div class="form-group row my-2">
                      <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">Peso Lote</label>
                      <div class="col-md-5 col-3 text-left px-0 "><input type="number" id="input-pesoLote" class="form-control" name="cantidad" step=".01" value="0"></div>  
                    </div>
                    <div class="form-group row my-2">
                      <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">Unidades lote</label>
                      <div class="col-md-5 col-3 text-left px-0 "><input type="number" id="input-valorLote" class="form-control" name="cantidad" step=".01" value ="0"></div>  
                    </div>
                    <div class="row mb-4">
                        <div class="col"></div>
                          <div class="col">
                            <button class="btn btn-primary" id="btnValidarMes">Validar</button>
                          </div>
                        <div class="col"></div>
                      </div>
                  </div>
                </div>
                <table class="table" id="tableAnalisisMateriaPrimaMes">
                            <thead class="text-primary">
                              <th>Descripcion</th>
                              <th>Cantidad</th>
                              <th>Costo Total</th>
                              <th>Valor Unidad Mes</th>
                              <th>%participacion</th>

                              </br>
                            </thead>
                            <tr>
                            </tr>
                            <tbody>
                            </tbody>
                            <tfoot> 
                                <tr> 
                                  <th>Total:</th> 
                                  <th></th>
                                  <th></th>
                                  <th></th>
                                </tr> 
                            </tfoot> 

                          </table>
                          <hr>-->
              <div class = "row">           
              <div class="col-md-10 col-sm-12 col-12 col-xs-12 mb-5">
                <h3 >Escenario de ahorro</h3>
                  <div class="card py-2">
                    <div class="form-group row my-2">
                      <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">Unidades fabricadas al mes</label>
                      <div class="col-md-5 col-3 text-left px-0 "><input type="number" id="input-UnidadesFMes" class="form-control" name="cantidad" value="100" ></div>  
                    </div>
                   
                 </div>
                 
                </div>
                <!--<div class="col-md-5 col-sm-12 col-12 col-xs-12 mb-5" id="cargaAhorro"></div>-->
              </div>
                  <div class="col-md-10 col-sm-12 col-12 col-xs-12 mb-5">
                  <div class="card py-2">
                  <h3 class="card-title bg-primary text-white text-left" style="padding:2% " >Ahorro</h5>
                 <table class="table" id="tableAnalisisMateriaPrimaAM">
                            <thead class="text-primary">
                              <th>Materia Prima</th>
                              <th>Precio Actual</th>
                              <th>Precio a Negociar</th>
                              <th>Costo total</th>
                              <th>Costo mes </th>
                              <th>Costo proyectado </th>

                              </br>
                            </thead>
                            <tr>
                            </tr>
                            <tbody>
                           
                            </tbody>
                            <tfoot> 
                                <tr> 
                                  <th>Total:</th> 
                                  <th></th>
                                  <th></th>
                                  <th></th>
                                </tr> 
                            </tfoot> 

                          </table>
                      <div style="display:grid; justify-content:center;">
                          <button class="btn btn-primary" id="btnValidarNuevoPrecio">Calcular</button>
                      </div>
                  </div>
                  </div>
                  <div class="col-md-10 col-sm-12 col-12 col-xs-12 mb-5">
                  <div class="card py-2">
                    <div class="form-group row my-2">
                      <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">Ahorro mes</label>
                      <div class="col-md-5 col-3 text-left px-0 "><input type="text" id="input-AhorroMes" class="form-control" readonly></div>  
                    </div>
                    <div class="form-group row my-2">
                      <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">Ahorro Año</label>
                      <div class="col-md-5 col-3 text-left px-0 "><input type="text" id="input-AhorroAño" class="form-control" readonly></div>  
                    </div>
                 </div>
                </div>

            
              </div>
              <div class="tab-pane" id="updates">
                <div class="col-md-5 col-sm-12 col-12 col-xs-12 mb-5">
                  <div class="card py-2">
                    <div class="form-group row my-2">
                      <label class="col-sm-5 col-md-4 col-12 text-left col-form-label pl-4">Procesos</label>
                      <div class="col-md-7 col-sm-6 px-0 col-10" id="pppp"><select class="custom-select" id="input-procesosA" name="materia"></select></div>
                    </div>
                  </div>
                </div>
                <div id="cargaTabla">
                </div>
                <div id="modal2" class="mt-10"style="display:none">
                  <div id="title2"></div>
                  <div class="form-group row my-2">
                      <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">Veces al dia</label>
                      <div class="col-md-5 col-3 text-left px-0 "><input type="number" id="veces_dia" class="form-control" name="tiempo_aislamiento"  ></div>  
                  </div>
                  <div class="form-group row my-2">
                      <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">Tiempo de espera</label>
                      <div class="col-md-5 col-3 text-left px-0 "><input type="number" id="tiempo_espera" class="form-control" name="tiempo_aislamiento"  ></div>  
                  </div>
                  <div class="form-group row my-2">
                      <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">Turnos al dia</label>
                      <div class="col-md-5 col-3 text-left px-0 "><input type="number" id="turnos_dia" class="form-control" name="tiempo_aislamiento"  ></div>  
                  </div>
                  <div class="form-group row my-2">
                      <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">Costo minuto operario</label>
                      <div class="col-md-5 col-3 text-left px-0 "><input type="number" id="costo_minuto" class="form-control" name="tiempo_aislamiento"  ></div>  
                  </div>
                  <div class="row mb-4">
                    <div class="col"></div>
                      <div class="col">
                        <button class="btn btn-primary" id="btnValidarDatos">Validar</button>
                        <button class="btn btn-danger" id="btnCancelar">Cancelar</button>
                      </div>
                    <div class="col"></div>
                  </div>
                </div>
                <div id="modal" class="mt-10"style="display:none">
                  <div id="title"></div>
                  <form id="form-data-process">
                  <div class="form-group row my-2">
                    <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">tiempo de aislamiento</label>
                    <div class="col-md-5 col-3 text-left px-0 "><input type="number" id="tiempo_aislamiento" class="form-control" name="tiempo_aislamiento"  ></div>  
                  </div>
                  <div class="form-group row my-2">
                    <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">tiempo de operacion</label>
                    <div class="col-md-5 col-3 text-left px-0 "><input type="number" id="tiempo_operacion" class="form-control" name="tiempo_operacion"  ></div>  
                  </div>
                  <div class="form-group row my-2">
                    <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">numero de maquinas</label>
                    <div class="col-md-5 col-3 text-left px-0 "><input type="number" id="numero_maquinas" class="form-control" name="numero_maquinas"  ></div>  
                  </div>
                  <div class="form-group row my-2">
                    <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">Porcentaje de rechazo</label>
                    <div class="col-md-5 col-3 text-left px-0 "><input type="number" id="porcentaje_rechazo" class="form-control" name="porcentaje_rechazo"  ></div>  
                  </div>
                  <div class="form-group row my-2">
                    <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">numero de turnos</label>
                    <div class="col-md-5 col-3 text-left px-0 "><input type="number" id="numero_turnos" class="form-control" name="numero_turnos"  ></div>  
                  </div>
                  <div class="form-group row my-2">
                    <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">distancia</label>
                    <div class="col-md-5 col-3 text-left px-0 "><input type="number" id="distancia" class="form-control" name="distancia"  ></div>  
                  </div>
                  <div class="form-group row my-2">
                    <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">disponibilidad</label>
                    <div class="col-md-5 col-3 text-left px-0 "><input type="number" id="disponibilidad" class="form-control" name="disponibilidad"  ></div>  
                  </div>
                  <div class="form-group row my-2">
                    <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">mantenimiento correctivo</label>
                    <div class="col-md-5 col-3 text-left px-0 "><input type="number" id="mantenimiento_correctivo" class="form-control" name="mantenimiento_correctivo"  ></div>  
                  </div>
                  <div class="form-group row my-2">
                    <label class="col-sm-4 col-md-4 col-12 text-left col-form-label pl-4">paradas menores</label>
                    <div class="col-md-5 col-3 text-left px-0 "><input type="number" id="paradas_menores" class="form-control" name="paradas_menores"  ></div>  
                  </div>
                  <div class="row mb-4">
                        <div class="col"></div>
                          <div class="col">
                            <button class="btn btn-primary" id="btnGuardarDatosP">Guardar</button>
                          </div>
                        <div class="col"></div>
                      </div>
                      </form>
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
  <script src="https://cdn.datatables.net/plug-ins/1.10.19/api/sum().js"></script>
  <script src="/vendor/numberFormat/jquery.number.min.js"></script>
  <script src="/vendor/xlsx-js/xlsx.full.min.js"></script>
  <script src="/vendor/file-saver/FileSaver.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-confirm/3.3.2/jquery-confirm.min.js"></script>
  <script src="/vendor/froala-editor/froala_editor.pkgd.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery-modal/0.9.1/jquery.modal.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/jquery-tabledit@1.0.0/jquery.tabledit.min.js"></script>
  <script>
    if($(window).width() < 768){
      $('#home .card .row').addClass('justify-content-center')
    }
  </script>
  <script>
    $('#sidebar-parametrizar-item').removeClass('active')
    $('#sidebar-costear-item').removeClass('active')
    $('#sidebar-analisis-item').addClass('active')

  </script>
  <script src="/js/analisisMateriasPrimas.js"></script>
  <script src="/js/analisisProcesos.js"></script>
  <!--<script src="/js/AnalisisXMaterial.js"></script>
  <script src="/js/analisisMPrimaMes.js"></script>-->
</body>

</html>
