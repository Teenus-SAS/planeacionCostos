<?php

set_time_limit(300);

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "DistribucionDirectaDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $dDirectaDao = new DistribucionDirectaDao();
  $distribuciones = json_decode($_POST["distribuciones"]);
  $responses = [];
  foreach ($distribuciones as $distribucion) {
    $distribucion = new DistribucionDirecta();
    $distribucionExiste = $dDirectaDao->findOneByProcessId($user->getCompany()->getId(), $distribucion->Proceso);
    if ($distribucionExiste) {
      $distribucion = $distribucionExiste;
    }
    $distribucion->setIdEmpresa($user->getCompany()->getId());
    $distribucion->setPorcentaje($distribucion->Porcentaje);
    array_push($responses, $dDirectaDao->saveOrUpdate($distribucion));
  }
  http_response_code(200);
  echo json_encode($responses);
} else {
  http_response_code(401);
  exit;
}
