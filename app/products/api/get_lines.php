<?php
set_time_limit(300);
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ProductDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $productDao = new ProductDao();
  $lines = $productDao->findLinesByCompany($user->getCompany()->getId());
  if (isset($_GET["dataTable"])) {
    $response = new  stdClass();
    $response->data = $lines;
    echo json_encode($response);
    exit;
  } else {
    echo json_encode($lines);
    exit;
  }
} else {
  http_response_code(401);
  exit;
}
