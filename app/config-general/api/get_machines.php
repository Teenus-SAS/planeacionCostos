<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "MachineDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $machineDao = new MachineDao();
  $machines = $machineDao->findByCompany($user->getCompany()->getId());
  if (isset($_GET["dataTable"])) {
    $response = new stdClass();
    $response->data = $machines;
    echo json_encode($response);
    exit;
  } else {
    echo json_encode($machines);
    exit;
  }
} else {
  http_response_code(401);
  exit;
}
