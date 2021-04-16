<?php

set_time_limit(300);

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ProcessDao.php";
require_once DAO_PATH . "ProductDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $productDao = new ProductDao();
  $processDao = new ProcessDao();
  $productsProcessesJSON = json_decode($_POST["productsProcess"]);
  $responses = [];
  foreach ($productsProcessesJSON as $productProcessJSON) {
    $product = $productDao->findByRef($productProcessJSON->referencia, $user->getCompany()->getId());
    array_push($responses, $processDao->saveOrUpdateProductProcess(
      $product,
      $productProcessJSON->maquina,
      $productProcessJSON->proceso,
      $productProcessJSON->tiempoalistamiento,
      $productProcessJSON->tiempooperacion,
    )->mode == "updated" ? true : false);
  }
  http_response_code(200);
  echo json_encode($responses);
} else {
  http_response_code(401);
  exit;
}
