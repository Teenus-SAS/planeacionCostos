<?php

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script obtener la depreciación de una maquina
 * Se llama por metodo 
 * @method GET
 * @param price El precio de la maquina
 * @param residualValue El valor residual de la máquina
 * @param years Los años a los que se quiere depreciar esa máquina
 * 
 * @responsesCodes
 *  200: en caso de que el calculo sea exitoso
 *  500: en caso de error en el servidor
 *  401: en caso de que no exista una sesion iniciada
 * 
 * @structureRepsonse 
 *  {
 *    depreciation: number
 *  }
 */

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "MachineDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
    $user = unserialize($_SESSION["user"]);
    $depreciation = ($_GET["price"] - $_GET["residualValue"]) / ($_GET["years"] * 12) / $user->getCompany()->getWorkHours() / $user->getCompany()->getBussinesDaysMonth() / 60;
    $response = new stdClass();
    $response->depreciation = $depreciation;
    echo json_encode($response);
    exit;
} else {
    http_response_code(401);
    exit;
}
