<?php

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script permite obtener las opciones de una empresa
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
require_once DAO_PATH . "OpcionesEmpresaDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $opcionesEmpresaDao = new OpcionesEmpresaDao();
  $opciones = $opcionesEmpresaDao->findByCompanyId($user->getCompany()->getId());
  echo json_encode($opciones);
}
