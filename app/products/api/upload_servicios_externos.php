<?php

set_time_limit(300);

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script crea o modifica servicios externos desde un archivo excel
 * Se llama por metodo 
 * @method POST 
 * @param serviciosFJSON Un objeto json que contiene todos los datos de servicios externos subidos en el excel
 * 
 * @responsesCodes
 *  200: en caso de que se suba la información correctamente
 *  401: en caso de que no exista una session inciada
 */

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ServiciosExternosDao.php";
require_once DAO_PATH . "ProductDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $serviciosDao = new ServiciosExternosDao();
  $serviciosJSON = json_decode($_POST["serviciosExternos"]);
  $responses = [];
  foreach ($serviciosJSON as $servicioJSON) {
    $servicio = new ServicioExterno();
    $servicio->setIdEmpresa($user->getCompany()->getId());
    $servicio->setIdProducto($servicioJSON->Producto);
    $servicio->setnombreServicio($servicioJSON->Servicio);
    $servicio->setCosto($servicioJSON->Costo);
    array_push($responses, $serviciosDao->saveOrUpdate($servicio));
  }
  http_response_code(200);
  echo json_encode($responses);
} else {
  http_response_code(401);
  exit;
}
