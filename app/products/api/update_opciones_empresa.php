<?php

set_time_limit(300);

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "OpcionesEmpresaDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $opcionesEmpresaDao = new OpcionesEmpresaDao();
  $opciones = new OpcionesEmpresa();
  $opciones->setIdEmpresa($user->getCompany()->getId());
  $opciones->setTipoDistribucion($_POST['tipoDistribucion']);
  if ($opcionesEmpresaDao->saveOrUpdate($opciones)) {
    http_response_code(200);
  } else {
    http_response_code(403);
  }
} else {
  http_response_code(401);
  exit;
}
