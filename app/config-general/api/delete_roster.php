<?php

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script Eliminar una nomina
 * Se llama por metodo 
 * @method POST 
 * @param id El id de la nomimna que se desea eliminar
 * 
 * @responsesCodes
 *  200: en caso de que se borre exitosamente la nomina
 *  500: en caso de error en el servidor
 *  400: en caso de que no lleguen todos los parametros
 */

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "RosterDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");



if (isset($_POST["id"])) {
  $rosterDao = new RosterDao();
  if ($rosterDao->delete($_POST["id"]) > 0) {
    http_response_code(200);
  }else{
    http_response_code(500);
  }
} else {
  http_response_code(400);
}
