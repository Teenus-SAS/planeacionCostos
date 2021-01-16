<?php

set_time_limit(300);

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script crea o modifica máquinas desde un archivo excel
 * Se llama por metodo 
 * @method POST 
 * @param machinesJSON Un objeto json que contiene todos los datos de maquinas subidas en el excel
 * 
 * @responsesCodes
 *  200: en caso de que se suba la información correctamente
 *  401: en caso de que no exista una session inciada
 */

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "MachineDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $machineDao = new MachineDao();
  $machinesJSON = json_decode($_POST["machines"]);
  $responses = [];
  foreach ($machinesJSON as $machineJSON) {
    $machine = new Machine();
    $machine->setIdCompany($user->getCompany()->getId());
    $machine->setName($machineJSON->Maquina);
    $machine->setPrice($machineJSON->Precio);
    $machine->setYearsDepreciation($machineJSON->years);
    $machine->setResidualValue($machineJSON->residualValue);
    $machine->setDepreciation(($machineJSON->Precio - $machineJSON->residualValue) / ($machineJSON->years * 12) / $user->getCompany()->getWorkHours() / $user->getCompany()->getBussinesDaysMonth() / 60);
    array_push($responses, $machineDao->save($machine) > 0 ? true : false);
  }
  http_response_code(200);
  echo json_encode($responses);
} else {
  http_response_code(401);
  exit;
}
