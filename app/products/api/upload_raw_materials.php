<?php

set_time_limit(300);

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "MaterialDao.php";
require_once DAO_PATH . "ProductDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $materialDao = new MaterialDao();
  $productDao = new ProductDao();
  $materialsJSON = json_decode($_POST["rawMaterials"]);
  $responses = [];
  foreach ($materialsJSON as $materialJSON) {
    $material = $materialDao->findByName(trim($materialJSON->Material), $user->getCompany()->getId());
    $product = $productDao->findByRef($materialJSON->Referencia, $user->getCompany()->getId());
    array_push($responses, $productDao->saveOrUpdateRawMaterial($product, $material->getId(), $materialJSON->Cantidad) > 0 ? true : false);
  }
  http_response_code(200);
  echo json_encode($responses);
} else {
  http_response_code(401);
  exit;
}
