<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ProcessDao.php";
require_once DAO_PATH . "RosterDao.php";
require_once DAO_PATH . "DistribucionDirectaDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_POST["id"])) {
  $user = unserialize($_SESSION["user"]);
  $companyId = $user->getCompany()->getId();
  $processDao = new ProcessDao();
  $nominasDao = new RosterDao();
  $distribucionDirectaDao = new DistribucionDirectaDao();
  $distribuciones = $distribucionDirectaDao->findOneByProcessId($companyId, isset($_POST["id"]));
  $nominas = $nominasDao->findByProcessId($_POST["id"]);
  $tiemposProcesos = $processDao->findProductProcessesByProcessId($_POST["id"]);
  if ($distribuciones && count($distribuciones) > 0) {
    http_response_code(511);
    exit;
  }
  if ($nominas && count($nominas) > 0) {
    http_response_code(512);
    exit;
  }
  if ($tiemposProcesos && count($tiemposProcesos) > 0) {
    http_response_code(513);
    exit;
  }
  if ($processDao->delete($_POST["id"]) > 0) {
    http_response_code(200);
  }else{
    http_response_code(500);
  }
} else {
  http_response_code(400);
}
