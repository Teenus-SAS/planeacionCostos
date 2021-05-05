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
  $reportes = $reporteCosteoProcesosDao->findByCompany($user->getCompany()->getId());
  echo json_encode($reportes);
} else {
  http_response_code(401);
  exit;
}
