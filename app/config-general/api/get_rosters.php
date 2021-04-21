<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "RosterDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $rosterDao = new RosterDao();
  $rosters = $rosterDao->findByCompany($user->getCompany()->getId());
  if (isset($_GET["dataTable"])) {
    $response = new  stdClass();
    $response->data = $rosters;
    echo json_encode($response);
    exit;
  } else {
    echo json_encode($rosters);
    exit;
  }
} else {
  http_response_code(401);
  exit;
}
