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
  $productsJSON = json_decode($_POST["products"]);
  $responses = [];
  if (count($productsJSON) <= $user->getCompany()->getLicensedProducts()) {
    foreach ($productsJSON as $productJSON) {
      $product = new Product();
      $product->setRef($productJSON->referencia);
      $product->setName($productJSON->producto);
      $rentabilidad = $productJSON->rentabilidad;
      if (!$rentabilidad || $rentabilidad == '') {
        $product->setRentabilidad($user->getCompany()->getProfitabilityMargin());
      } else {
        $product->setRentabilidad($productJSON->rentabilidad);
      }
      $product->setIdCompany($user->getCompany()->getId());
      array_push($responses, $productDao->saveOrUpdate($product));
    }
    http_response_code(200);
    echo json_encode($responses);
  } else {
    http_response_code(403);
  }
} else {
  http_response_code(401);
  exit;
}
