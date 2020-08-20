<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";

header("Content-Type: application/json");

$response = new stdClass();

if (isset($_POST["id"])) {
  $userDao = new UserDao();
  $user = $userDao->findById($_POST["id"]);
  $user->setActive(!$user->getActive());
  if ($userDao->update($user) > 0) {
    $response->status = true;
  } else {
    $response->status = false;
  }
  echo json_encode($response);
} else {
  http_response_code(400);
}
