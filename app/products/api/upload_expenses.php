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
  $productsExpenses = json_decode($_POST["productsExpenses"]);
  $responses = [];
  foreach ($productsExpenses as $productExpenses) {
    $product = $productDao->findByRef($productExpenses->referencia, $user->getCompany()->getId(), true);
    $product->getExpenses()->setSoldUnits($productExpenses->unidadesvendidas);
    $product->getExpenses()->setTurnOver($productExpenses->volumendeventas);
    $productDao->updateExpensesByProduct($product);
    array_push($responses, true);
  }
  http_response_code(200);
  echo json_encode($responses);
} else {
  http_response_code(401);
  exit;
}
