<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once SESSION_PATH . "MySessionHandler.php";
require_once DAO_PATH . "UserDao.php";

session_start();

$existUser = isset($_SESSION["user"]);

if ($existUser) {
   /*  $user = unserialize($_SESSION["user"]); */
   $user = $_SESSION["user"];
    echo $user;
}
else {
    echo $existUser;
}
?>