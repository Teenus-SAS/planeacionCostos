<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once SESSION_PATH . "MySessionHandler.php";
require_once DAO_PATH . "UserDao.php";
session_set_save_handler(new MySessionHandler(), true);
$userDao = new UserDao();

session_start();

$existUser = isset($_SESSION["user"]);

/* echo $existUser; */
if ($existUser) {
session_destroy();

    /* $user = unserialize($_SESSION["user"]);
    var_dump($user);
    echo $user;
     $userDao->destroySession($_SESSION["user"]);
     header("Location: /login"); */
 }
/*  else {
     echo $existUser;
 } */


/* if ($existUser) { */
    /*  $user = unserialize($_SESSION["user"]); */
/*     $user = $_SESSION["user"];
     echo $user;
 }
 else {
     echo $existUser;
 }
 */


?>