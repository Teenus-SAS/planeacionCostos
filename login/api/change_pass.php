<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";

$response = new stdClass();
header("Content-Type: application/json");

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $userDao = new UserDao();
  $user->setPassword(hash("sha256", $_POST["password"]));
  if ($userDao->update($user) > 0) {
    http_response_code(200);
  } else {
    http_response_code(500);
  }
} else {
  http_response_code(400);
}
