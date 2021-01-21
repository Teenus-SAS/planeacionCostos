<?php
// revisar si existe session
session_start();
set_time_limit(300);
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ProductDao.php";


header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
    $user = unserialize($_SESSION["user"]);
    $productDao = new ProductDao();
    if (isset($_GET["id"])) {
        $product = $productDao->findById($_GET["id"], false, false, true);
        if (isset($_GET["dataTable"])) {
            $response = new stdClass();
            $response->data = $product->getMaterials();
            echo json_encode($response);
            exit;
        } else {
            echo json_encode($product->getMaterials());
            exit;
        }
    } else {
        $response = new  stdClass();
        $response->data = ["hola"];
        echo json_encode($response);
    }
} else {
    http_response_code(401);
    exit;
}