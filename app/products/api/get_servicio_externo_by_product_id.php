<?php
// revisar si existe session
session_start();
set_time_limit(300);
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ServiciosExternosDao.php";
require_once DAO_PATH . "ProductDao.php";

header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
    $user = unserialize($_SESSION["user"]);

    $productsDao = new ProductDao();
    $serviciosExternosDao = new ServiciosExternosDao();
    if (isset($_GET["id"])) {
        $product = $productsDao->findById($_GET["id"]);
        if (isset($product)) {
            $servicios = $serviciosExternosDao->findByProductId($_GET["id"]);
            if (isset($_GET["dataTable"])) {
                $response = new stdClass();
                $response->data = $servicios;
                echo json_encode($response);
                exit;
            } else {
                echo json_encode($servicios);
                exit;
            }
        }
    }
    $response = new stdClass();
    $response->data = [];
    echo json_encode($response);
} else {
    http_response_code(401);
    exit;
}
