<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once SESSION_PATH . "MySessionHandler.php";
require_once DAO_PATH . "UserDao.php";

$handler = new MySessionHandler();
/* session_set_save_handler($handler, false); */
session_set_save_handler($handler, true);
$userDao = new UserDao();


if (!isset($_SESSION)) {
    session_start();
    if (!isset($_SESSION["user"])) {
        header("Location: /login");
    }
    else {
        $user = unserialize($_SESSION["user"]);
        $userDao->activeSession($user);

        if(isset($_SESSION["timeout"])) {
            $max_inactivity = 86400;
            $current_inactivity = time() - $_SESSION["timeout"];

            if($current_inactivity > $max_inactivity) {
                $userDao->destroySession($user);
                session_destroy();
                header("Location: /login");
            }
            else {
                $_SESSION["timeout"] = time();
            }  
        }
    }
} 

