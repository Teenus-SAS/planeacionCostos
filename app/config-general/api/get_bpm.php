<?php

/**
 * @author Alexis Holguin <wholguinmor@uniminuto.edu.co>
 * @github MoraHol
 * Este Script obtener la imagen bpm de la empresa
 * Se llama por metodo 
 * @method GET 
 * 
 * @responsesCodes
 *  200: en caso de que encientre la imagen del bpm
 * 
 * @structureRepsonse 
 *  {
 *    bpm: 'ruta de image'
 *  }
 */

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";

session_start();

header("Content-Type: application/json");
if (isset($_SESSION["user"])) {
  $response = new stdClass();
  $user = unserialize($_SESSION["user"]);
  $response->bpm = $user->getCompany()->getBpm();
  echo json_encode($response);
}else{
  http_response_code(401);
}
