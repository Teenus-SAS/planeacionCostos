<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $companyDao = new CompanyDao();
  $user = unserialize($_SESSION["user"]);
  $company = $user->getCompany();
  $company->setNit($_POST["nit"]);
  $company->setPhone($_POST["phone"]);
  $company->setTradename($_POST["tradename"]);
  $company->setBussinesReason($_POST["bussinesName"]);
  $company->setAddress($_POST["address"]);
  $company->setCity($_POST["city"]);
  $company->setCountry($_POST["country"]);
  $company->setDepartment($_POST["department"]);
  if ($companyDao->update($company) > 0) {
    http_response_code(200);
    $user->setCompany($company);
    $_SESSION["user"] = serialize($user);
  } else {
    http_response_code(500);
  }
}
