<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "AdminDao.php";

$response = new stdClass();

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["admin"])) {
  $admin = unserialize($_SESSION["admin"]);
  $adminDao = new AdminDao();
  $admin->setPassword(hash("sha256", $_POST["password"]));
  if ($adminDao->update($admin) > 0) {
    http_response_code(200);
  } else {
    http_response_code(500);
  }
} else {
  http_response_code(400);
}
