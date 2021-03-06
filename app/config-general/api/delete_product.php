<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ProductDao.php";
require_once DAO_PATH . "ServiciosExternosDao.php";
require_once DAO_PATH . "ProcessDao.php";

session_start();
header("Content-Type: application/json");

if (isset($_POST["id"])) {
  $productDao = new ProductDao();
  $serviciosExternosDao = new ServiciosExternosDao();
  $processDao = new ProcessDao();
  $lines = $productDao->findProductLinesByProductId($_POST["id"]);
  $rawMaterials = $productDao->findRawMaterialsByProductId($_POST["id"]);
  $serviciosExternos = $serviciosExternosDao->findByProductId($_POST["id"]);
  $procesos = $processDao->findProductProcessesByProductId($_POST["id"]);
  if ($lines && count($lines) > 0) {
    http_response_code(400);
    exit;
  }
  if ($rawMaterials && count($rawMaterials) > 0) {
    http_response_code(400);
    exit;
  }
  if ($serviciosExternos && count($serviciosExternos) > 0) {
    http_response_code(400);
    exit;
  }
  if ($procesos && count($procesos) > 0) {
    http_response_code(400);
    exit;
  }
  if ($productDao->delete($_POST["id"]) > 0) {
    http_response_code(200);
  }else{
    http_response_code(500);
  }
} else {
  http_response_code(400);
}
