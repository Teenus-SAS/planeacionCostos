<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ServiciosExternosDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $serviciosExternosDao = new ServiciosExternosDao();
  $servicios = $serviciosExternosDao->findByCompanyId($user->getCompany()->getId());
  if (isset($_GET["dataTable"])) {
    $response = new stdClass();
    $response->data = $servicios;
    echo json_encode($response);
    exit;
  } else {
    echo json_encode($servicios);
    exit;
  }
} else {
  http_response_code(401);
  exit;
}
