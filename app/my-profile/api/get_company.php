<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "CompanyDao.php";

session_start();

header("Content-Type: application/json");
if (isset($_SESSION["user"])) {
  $response = new stdClass();
  $user = unserialize($_SESSION["user"]);
  $companyDao = new CompanyDao();
  $response->company = $companyDao->findById($user->getCompany()->getId());
  echo json_encode($response);
}else{
  http_response_code(401);
}