<?php

set_time_limit(300);

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script crea o modifica cargas fabriles desde un archivo excel
 * Se llama por metodo 
 * @method POST 
 * @param cargasFJSON Un objeto json que contiene todos los datos de cargas fabriles subidas en el excel
 * 
 * @responsesCodes
 *  200: en caso de que se suba la información correctamente
 *  401: en caso de que no exista una session inciada
 */

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "CargaFabrilDao.php";
require_once DAO_PATH . "MachineDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $cargasFDao = new CargaFabrilDao();
  $maquinasDao = new MachineDao();
  $cargasFJSON = json_decode($_POST["cargasFabriles"]);
  $responses = [];
  foreach ($cargasFJSON as $cargaJSON) {
    $carga = new CargaFabril();
    $carga->setIdEmpresa($user->getCompany()->getId());
    $carga->setIdMaquina($cargaJSON->Maquina);
    $carga->setInsumo($cargaJSON->Insumo);
    $carga->setCosto($cargaJSON->Costo);
    $costoPorMinuto = ($cargaJSON->Costo/$user->getCompany()->getBussinesDaysMonth()/$user->getCompany()->getWorkHours() / 60);
    $carga->setCostoPorMinuto($costoPorMinuto);
    array_push($responses, $cargasFDao->saveOrUpdate($carga));
  }
  http_response_code(200);
  echo json_encode($responses);
} else {
  http_response_code(401);
  exit;
}
