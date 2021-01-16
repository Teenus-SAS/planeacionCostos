<?php

set_time_limit(300);

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script crea o modifica procesos desde un archivo excel
 * Se llama por metodo 
 * @method POST 
 * @param processesJSON Un objeto json que contiene todos los datos de procesos subidas en el excel
 * 
 * @responsesCodes
 *  200: en caso de que se suba la información correctamente
 *  401: en caso de que no exista una session inciada
 */

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ProcessDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $processDao = new processDao();
  $processesJSON = json_decode($_POST["processes"]);
  $responses = [];
  foreach ($processesJSON as $processJSON) {
    $process = new Process();
    $process->setIdCompany($user->getCompany()->getId());
    $process->setName($processJSON->Proceso);
    array_push($responses, $processDao->save($process) > 0 ? true : false);
  }
  http_response_code(200);
  echo json_encode($responses);
} else {
  http_response_code(401);
  exit;
}
