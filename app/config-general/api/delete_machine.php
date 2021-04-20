<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "MachineDao.php";
require_once DAO_PATH . "CargaFabrilDao.php";
require_once DAO_PATH . "ProcessDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_POST["id"])) {
  $cargaFabrilDao = new CargaFabrilDao();
  $processesDao = new ProcessDao();
  $machineDao = new MachineDao();
  $tiempoProceso = $processesDao->findOneProductProcessesByMachineId($_POST["id"]);
  $cargas = $cargaFabrilDao->findByMachineId($_POST["id"]);
  if ($tiempoProceso) {
    http_response_code(500);
    exit;
  }
  if ($cargas && count($cargas) > 0) {
    http_response_code(500);
    exit;
  }
  if ($machineDao->delete($_POST["id"])) {
    http_response_code(200);
  }else{
    http_response_code(500);
  }
} else {
  http_response_code(400);
}
