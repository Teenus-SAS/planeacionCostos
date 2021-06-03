<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";

header("Content-Type: application/json");

$response = new stdClass();

if (isset($_POST["id"]) && isset($_POST["email"]) && isset($_POST["rol"]) && isset($_POST["firstname"]) && isset($_POST["lastname"]) && isset($_POST["username"])) {
  $userDao = new UserDao();
  $user = $userDao->findById($_POST["id"]);
  $user->setEmail($_POST["email"]);
  $user->setRolId($_POST["rol"]);
  $user->setFirstname($_POST["firstname"]);
  $user->setLastname($_POST["lastname"]);
  $user->setUsername($_POST["username"]);
  if ($userDao->update($user) > 0) {
    $response->status = true;
  } else {
    $response->status = false;
  }
  echo json_encode($response);
} else {
  http_response_code(400);
}
