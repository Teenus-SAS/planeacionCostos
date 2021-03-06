<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "ReporteCosteoProcesosDao.php";
require_once DAO_PATH . "UserDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $reporteCosteoProcesosDao = new ReporteCosteoProcesosDao();
  $reporte = $reporteCosteoProcesosDao->findByConsecutivo($user->getCompany()->getId(), $_GET["consecutivo"]);
  echo json_encode($reporte);
  exit;
} else {
  http_response_code(401);
  exit;
}
