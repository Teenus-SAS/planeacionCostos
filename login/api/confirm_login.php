<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once SESSION_PATH . "MySessionHandler.php";
require_once DAO_PATH . "UserDao.php";
session_set_save_handler(new MySessionHandler(), true);
session_start();

if (isset($_SESSION["user_aux_auth"])) {
    $_SESSION["user"] = $_SESSION["user_aux_auth"];
    unset($_SESSION["user_aux_auth"]);
}
