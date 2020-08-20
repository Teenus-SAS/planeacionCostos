<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ProductDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");
$response = new stdClass();
if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $productDao = new ProductDao();
  if (isset($_POST["create"])) {
    $create =  $_POST["create"] === "true" ? true : false;
    $products = json_decode($_POST["products"]);
    if ($create) {
      $productDao->saveLine($_POST["name"], $user->getCompany()->getId());
      $line = $productDao->findLineByName($_POST["name"], $user->getCompany()->getId());
      foreach ($products as $product) {
        $productDao->saveProductLine($line->id, $product->id);
      }
      $response->status = true;
    } else {
      $idLine = $_POST["id"];
      $productsInDB = $productDao->findByLine($idLine);
      // borrar loss productos que ya exiten
      for ($i = 0; $i < count($products); $i++) {
        for ($j = 0; $j < count($productsInDB); $j++) {
          if ($products[$i]->id == $productsInDB[$j]->getId()) {
            array_splice($products, $i, 1);
            array_splice($productsInDB, $j, 1);
          }
        }
      }
      // borrar elemento de la base de datos que se sacaron de la lista
      foreach ($productsInDB as $productInDB) {
        $productDao->deleteProductLine($idLine, $productInDB->getId());
      }
      // agregar nuevos productos a la linea
      foreach ($products as  $product) {
        $productDao->saveProductLine($idLine, $product->id);
      }
      $response->status = true;
    }
    echo json_encode($response);
  } else {
    http_response_code(400);
  }
} else {
  http_response_code(401);
  exit;
}
