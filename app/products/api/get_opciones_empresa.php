<?php

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
