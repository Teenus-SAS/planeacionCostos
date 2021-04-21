<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "CompanyDao.php";
require_once DAO_PATH . "MachineDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

$user = unserialize($_SESSION["user"]);

if (
  isset($_POST["workHours"]) && isset($_POST["BussinesDayMonth"])
  && isset($_POST["SalesCommission"]) && isset($_POST["ProfitabilityMargin"])
) {
  $companyDao = new CompanyDao();
  $machineDao = new MachineDao();
  $company = $user->getCompany();
  $company->setWorkHours($_POST["workHours"]);
  $company->setBussinesDaysMonth($_POST["BussinesDayMonth"]);
  $company->setSalesCommission($_POST["SalesCommission"]);
  $company->setProfitabilityMargin($_POST["ProfitabilityMargin"]);
  if ($companyDao->update($company) > 0) {
    $user->setCompany($company->getId());
    $_SESSION["user"] = serialize($user);
    $machines = $machineDao->findByCompany($user->getCompany()->getId());
    $status = 0;
    foreach ($machines as $machine) {
      $company = $user->getCompany();
      $machine->setValuesDepreciation($company->getBussinesDaysMonth(), $company->getWorkHours(), $machine->getPrice(), $machine->getResidualValue(), $machine->getYearsDepreciation());
      $status += $machineDao->update($machine);
    }
    http_response_code(200);
  } else {
    http_response_code(500);
  }
} else {
  http_response_code(400);
}
