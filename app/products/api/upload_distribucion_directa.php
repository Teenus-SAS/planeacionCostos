<?php

set_time_limit(300);

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "DistribucionDirectaDao.php";
require_once DAO_PATH . "ProcessDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $dDirectaDao = new DistribucionDirectaDao();
  $processDao = new ProcessDao();
  $distribuciones = json_decode($_POST["distribuciones"]);
  $responses = [];
  foreach ($distribuciones as $dist) {
    $distribucion = new DistribucionDirecta();
    $distribucionExiste = $dDirectaDao->findOneByProcessId($user->getCompany()->getId(), $dist->proceso);
    $tiempos = $processDao->findProductProcessesByProcessId($dist->proceso);
    $tiempoProceso = 0;
    foreach ($tiempos as $proceso) {
      $tiempoProceso += $proceso->getTimeOperacion() + $proceso->getTimeAlistamiento();
    }
    if ($distribucionExiste) {
      $distribucion = $distribucionExiste;
    } else {
      $distribucion->setIdProceso($dist->proceso);
    }
    $distribucion->set($dist->porcentaje, $user->getCompany(), $tiempoProceso);
    $distribucion->setIdEmpresa($user->getCompany()->getId());
    
    array_push($responses, $dDirectaDao->saveOrUpdate($distribucion));
  }
  http_response_code(200);
  echo json_encode($responses);
} else {
  http_response_code(401);
  exit;
}
