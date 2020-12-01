<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ProductDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $productDao = new ProductDao();
  if (isset($_POST["optionProductos"])) {
    if (isset($_POST["ref"]) && isset($_POST["producto"]) && isset($_POST["rentabilidad"])) {
      if ($_POST["ref"] != "" || $_POST["producto"] != "") {
        if ($productDao->findNumberProductsByCompany($user->getCompany()->getId()) <= $user->getCompany()->getLicensedProducts()) {
          if ($_POST["optionProductos"] == "option1") {
            $product = new Product();
            $product->setName($_POST["producto"]);
            $product->setRef($_POST["ref"]);
            if(empty($_POST["rentabilidad"])){
              $product->setRentabilidad($user->getCompany()->getProfitabilityMargin());
            } else {
              $product->setRentabilidad($_POST["rentabilidad"]);
            }
            $product->setIdCompany($user->getCompany()->getId());
            if ($productDao->save($product) > 0) {
              http_response_code(201);
            } else {
              http_response_code(500);
            }
          } else {
            $product = $productDao->findById($_POST["producto"]);
            if ($productDao->saveOrUpdateRawMaterial($product, $_POST["materia"], $_POST["cantidad"]) > 0) {
              http_response_code(200);
            } else {
              http_response_code(500);
            }
          }
        }else{
          http_response_code(403);
        }
      } else {
        http_response_code(400);
      }
    } else {
      http_response_code(400);
    }
  } else {
    http_response_code(412);
  }
} else {
  http_response_code(401);
  exit;
}
