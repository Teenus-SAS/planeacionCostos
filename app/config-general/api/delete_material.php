<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "MaterialDao.php";
require_once DAO_PATH . "ProductDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_POST["id"])) {
  $materialDao = new MaterialDao();
  $productDao = new ProductDao();
  $rawMaterials = $productDao->findRawMaterialsByMaterialId($_POST["id"]);
  if ($rawMaterials && count($rawMaterials) > 0) {
    http_response_code(511);
    exit;
  }
  if ($materialDao->delete($_POST["id"]) > 0) {
    http_response_code(200);
  }else{
    http_response_code(500);
  }
} else {
  http_response_code(400);
}
