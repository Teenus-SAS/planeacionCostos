<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $userDao = new UserDao();
  $user = unserialize($_SESSION["user"]);
  $users = $userDao->findByCompany($user->getCompany()->getId());
  if (isset($_GET["dataTable"])) {
    $response = new  stdClass();
    $response->data = $users;
    echo json_encode($response);
    exit;
  } else {
    echo json_encode($users);
    exit;
  }
} else {
  http_response_code(401);
  exit;
}
