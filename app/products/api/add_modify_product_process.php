<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ProductDao.php";
require_once DAO_PATH . "ProcessDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $productDao = new ProductDao();
  $processDao = new ProcessDao();
  if (
    isset($_POST["ref"]) && isset($_POST["producto"]) && isset($_POST["proceso"])
    && isset($_POST["maquina"]) /* && isset($_POST["timeProcess"]) */ && isset($_POST["tiempo-alistamiento"]) && isset($_POST["tiempo-operacion"])
  ) {
    if (
      ($_POST["ref"] != "" || $_POST["producto"] != "" || $_POST["proceso"] != ""
      || $_POST["maquina"] != "" /* || $_POST["timeProcess"] != "" */ || $_POST["tiempo-alistamiento"] != "" || $_POST["tiempo-operacion"] != "")
    ) {
      if (floatval($_POST["tiempo-alistamiento"]) + floatval($_POST["tiempo-operacion"] != 0)) {
        $product = $productDao->findById($_POST["producto"]);
        $resquest = $processDao->saveOrUpdateProductProcess($product, $_POST["maquina"], $_POST["proceso"], /* $_POST["timeProcess"] */ $_POST["tiempo-alistamiento"], $_POST["tiempo-operacion"]);
        if ($resquest->status > 0) {
          if ($resquest->mode == "created") {
            http_response_code(201);
          } else {
            http_response_code(200);
          }
        } else {
          http_response_code(500);
        }
      } else {
        http_response_code(400);
      }
    }
  } else {
    http_response_code(400);
  }
} else {
  http_response_code(401);
  exit;
}
