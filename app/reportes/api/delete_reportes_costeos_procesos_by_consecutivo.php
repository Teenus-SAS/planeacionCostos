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
  $input = json_decode(file_get_contents("php://input"), true);
  if (isset($input["consecutivo"])) {
    $consecutivo = $input["consecutivo"];
    $user = unserialize($_SESSION["user"]);
    $reporteCosteoProcesosDao = new ReporteCosteoProcesosDao();
    $reporteCosteoProcesosDao->deleteByConsecutivo($consecutivo);
    http_response_code(200);
    echo json_encode(new stdClass);
    exit;
  } else {
    http_response_code(400);
    exit;
  }
} else {
  exit;
}
