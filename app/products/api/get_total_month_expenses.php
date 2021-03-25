<?php
set_time_limit(300);
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
    $userDao = new UserDao();
    $user = unserialize($_SESSION["user"]);
    $response = new  stdClass();
    $user = $userDao->findById($user->getId());
    $_SESSION["user"] = serialize($user);
    $response->totalMonthExpenses = $user->getCompany()->getTotalMonthExpenses();
    echo json_encode($response);
    exit;
} else {
    http_response_code(401);
    exit;
}
