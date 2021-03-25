<?php
set_time_limit(300);
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "CompanyDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
    $user = unserialize($_SESSION["user"]);
    $companyDao = new CompanyDao();
    $company = $user->getCompany();
    $company->setExpensesDescription($_POST["expensesDescription"]);
    $company->setTotalMonthExpenses($_POST["totalExpenses"]);
    $companyDao->update($company);
    $user->setCompany($company);
    $_SESSION["user"] = serialize($user);
} else {
    http_response_code(401);
    exit;
}
