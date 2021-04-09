<?php

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script permite obtener todas las distribuciones directas de una empresa
 * Se llama por metodo 
 * @method GET
 * 
 * @responsesCodes
 *  200: en caso de que el calculo sea exitoso
 *  500: en caso de error en el servidor
 *  401: en caso de que no exista una sesion iniciada
 * 
 * @structureRepsonse 
 *  [
 *    {
 *    }
 *  ]
 */

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "DistribucionDirectaDao.php";
require_once DAO_PATH . "ProcessDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $dDirectaDao = new DistribucionDirectaDao();
  $processDao = new ProcessDao();
  $distribuciones = $dDirectaDao->findByCompany($user->getCompany()->getId());
  foreach($distribuciones as $distribucion) {
    $distribucion->setNombreProceso($processDao->findById($distribucion->getIdProceso())->getName());
  }
  if (isset($_GET["dataTable"])) {
    $response = new stdClass();
    $response->data = $distribuciones;
    echo json_encode($response);
    exit;
  } else {
    echo json_encode($distribuciones);
    exit;
  }
} else {
  http_response_code(401);
  exit;
}
