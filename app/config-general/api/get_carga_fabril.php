<?php

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script obtener todos los insumos de la carga fabril
 * Se llama por metodo 
 * @method GET
 * 
 * @responsesCodes
 *  200: en caso de que el calculo sea exitoso
 *  500: en caso de error en el servidor
 *  401: en caso de que no exista una sesion iniciada
 * 
 * @structureResponse 
 *  [
 *    {
 *      "id": number,
 *      "idMachine": number,
 *      "idCompany": number,
 *      "name": string,
 *      "price": number,
 *      "pricePerMinute": number,
 *    }
 *  ]
 */

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "CargaFabrilDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $cargaFabrilDao = new CargaFabrilDao();
  $cargas = $cargaFabrilDao->findByCompanyId($user->getCompany()->getId());
  if (isset($_GET["dataTable"])) {
    $response = new  stdClass();
    $response->data = $cargas;
    echo json_encode($response);
    exit;
  } else {
    echo json_encode($cargas);
    exit;
  }
} else {
  http_response_code(401);
  exit;
}
