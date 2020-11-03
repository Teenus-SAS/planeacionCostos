<?php
    include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
    require_once SESSION_PATH . "MySessionHandler.php";
    require_once DAO_PATH . "UserDao.php";

    $userDao = new UserDao();

    $username = $_POST['lastUser'];

    if (isset($username)) {
        
        $userDao->destroySessionByUsername($username);
    }

?>