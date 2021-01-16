<?php

set_time_limit(300);


/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script crea o modifica materiales desde un archivo excel
 * Se llama por metodo 
 * @method POST 
 * @param materialsJSON Un objeto json que contiene todos los datos de materiales subidas en el excel
 * 
 * @responsesCodes
 *  200: en caso de que se suba la información correctamente
 *  401: en caso de que no exista una session inciada
 */

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "MaterialDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $materialDao = new MaterialDao();
  $materialsJSON = json_decode($_POST["materials"]);
  $responses = [];
  foreach ($materialsJSON as $materialJSON) {
    $material = new Material();
    $material->setCost($materialJSON->Costo);
    $material->setDescription(trim($materialJSON->Descripcion));
    $material->setIdCompany($user->getCompany()->getId());
    $material->setUnit($materialJSON->Unidad);
    array_push($responses, $materialDao->save($material) > 0 ? true : false);
  }
  http_response_code(200);
  echo json_encode($responses);
} else {
  http_response_code(401);
  exit;
}
