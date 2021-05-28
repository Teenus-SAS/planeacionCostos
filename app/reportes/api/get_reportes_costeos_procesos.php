<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "ReporteCosteoProcesosDao.php";
require_once DAO_PATH . "UserDao.php";

session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $reporteCosteoProcesosDao = new ReporteCosteoProcesosDao();
  $reportes = $reporteCosteoProcesosDao->findByCompany($user->getCompany()->getId());
  if (isset($_GET["dataTable"])) {
    $response = new stdClass();
    $response->data = $reportes;
    echo json_encode($response);
    exit;
  } else {
    echo json_encode($reportes);
    exit;
  }
} else {
  http_response_code(401);
  exit;
}
