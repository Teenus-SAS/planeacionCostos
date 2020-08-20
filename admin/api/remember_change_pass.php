<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "AdminDao.php";

$response = new stdClass();
header("Content-Type: application/json");

if (isset($_POST["id"]) && isset($_POST["password"])) {
  if ($_POST["password"] != '') {
    $adminDao = new AdminDao();
    $admin = $adminDao->findById($_POST["id"]);
    $admin->setPassword(hash("sha256", $_POST["password"]));
    $token = bin2hex(openssl_random_pseudo_bytes(128));
    $admin->setTokenPass($token);
    if ($adminDao->update($admin) > 0) {
      http_response_code(200);
    } else {
      http_response_code(500);
    }
  } else {
    http_response_code(400);
  }
} else {
  http_response_code(400);
}
