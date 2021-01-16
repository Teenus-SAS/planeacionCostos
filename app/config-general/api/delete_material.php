<?php

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script Eliminar un material
 * Se llama por metodo 
 * @method POST 
 * @param id El id del material que se desea eliminar
 * 
 * @responsesCodes
 *  200: En caso de que se borre exitosamente la material
 *  500: En caso de error en el servidor
 *  400: En caso de que no lleguen todos los parametros
 */

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "MaterialDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");



if (isset($_POST["id"])) {
  $materialDao = new MaterialDao();
  if ($materialDao->delete($_POST["id"]) > 0) {
    http_response_code(200);
  }else{
    http_response_code(500);
  }
} else {
  http_response_code(400);
}
