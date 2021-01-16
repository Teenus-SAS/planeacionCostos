<?php
/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * @date 25/10/2019
 * 
 * Este script devuelve los datos de la compañia que tiene sesion iniciada
 */
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";

session_start();

header("Content-Type: application/json");
if (isset($_SESSION["user"])) {
  $response = new stdClass();
  $user = unserialize($_SESSION["user"]);
  $response->company = $user->getCompany();
  echo json_encode($response);
}else{
  http_response_code(401);
}