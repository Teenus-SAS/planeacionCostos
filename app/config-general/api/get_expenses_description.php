<?php
set_time_limit(300);
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ProductDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);

  echo $user->getCompany()->getExpensesDescription()  == ""? "null" : $user->getCompany()->getExpensesDescription();
} else {
  http_response_code(401);
  exit;
}

