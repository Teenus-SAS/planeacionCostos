<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "DistribucionDirectaDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_POST["id"])) {
  $distribucionDirectaDao = new DistribucionDirectaDao();
  if ($distribucionDirectaDao->delete($_POST["id"]) > 0) {
    http_response_code(200);
  }else{
    http_response_code(500);
  }
} else {
  http_response_code(400);
}
