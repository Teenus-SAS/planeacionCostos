<?php
// revisar si existe session
session_start();
set_time_limit(300);
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ProcessDao.php";


header("Content-Type: application/json");
if (isset($_SESSION["user"])) {
    $user = unserialize($_SESSION["user"]);
    if (isset($_GET["id"])) {
        $Process= new ProcessDao();
        $ProcessData = $Process->findDataProcess($_GET["id"]);
        if (isset($_GET["dataTable"])) {
            $response = new stdClass();
            $response->data= $ProcessData; 
            echo json_encode($response);
        exit;
            }
        else{
            echo json_encode($Process); 
        }  
}
else {
    $response = new stdClass();
    $response->data = ["hola"];
    echo json_encode($response);
}
}