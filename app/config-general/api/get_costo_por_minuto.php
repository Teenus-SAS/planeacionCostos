<?php

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script obtener el costo por minuto de una carga fabril
 * Se llama por metodo 
 * @method GET
 * @param price El precio de la carga
 * 
 * @responsesCodes
 *  200: en caso de que el calculo sea exitoso
 *  500: en caso de error en el servidor
 *  401: en caso de que no exista una sesion iniciada
 * 
 * @structureRepsonse 
 *  {
 *    costoPorMinuto: number
 *  }
 */

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "CargaFabrilDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
    $user = unserialize($_SESSION["user"]);
    $costoPorMinuto = ($_GET["price"]/$user->getCompany()->getBussinesDaysMonth()/$user->getCompany()->getWorkHours() / 60);
    $response = new stdClass();
    $response->costoPorMinuto = $costoPorMinuto;
    echo json_encode($response);
    exit;
} else {
    http_response_code(401);
    exit;
}
