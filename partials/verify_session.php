<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once SESSION_PATH . "MySessionHandler.php";
require_once DAO_PATH . "UserDao.php";

$handler = new MySessionHandler();
session_set_save_handler($handler, false);
$userDao = new UserDao();


if (!isset($_SESSION)) {
    session_start();
    if (!isset($_SESSION["user"])) {
        header("Location: /login");
    } else {
        $user = unserialize($_SESSION["user"]);
        $userDao->activeSession($user);
    }
}
