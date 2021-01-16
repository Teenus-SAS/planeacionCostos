<?php

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script obtener todos los procesos de la empresa 
 * Se llama por metodo 
 * @method GET
 * 
 * @responsesCodes
 *  200: en caso de que el calculo sea exitoso
 *  500: en caso de error en el servidor
 *  401: en caso de que no exista una sesion iniciada
 * 
 * @structureRepsonse 
 *    [
 *      {
 *        "id": number,
 *        "name": string,
 *        "idCompany": number
 *      },
 *      {
 *        "id": number,
 *        "name": string,
 *        "idCompany": number
 *      }
 *    ]
 */


include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ProcessDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $processDao = new ProcessDao();
  $processes = $processDao->findByCompany($user->getCompany()->getId());
  if (isset($_GET["dataTable"])) {
    $response = new  stdClass();
    $response->data = $processes;
    echo json_encode($response);
    exit;
  } else {
    echo json_encode($processes);
    exit;
  }
} else {
  http_response_code(401);
  exit;
}
