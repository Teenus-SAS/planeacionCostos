<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ReporteCosteoProcesosDao.php";
require_once DAO_PATH . "ProductDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $reportesProcesosDao = new ReporteCosteoProcesosDao();
  $productDao = new ProductDao();
  $reporte = new ReporteCosteoProcesos();
  $reporte->setConsecutivo($_POST['consecutivo']);
  $reporte->setCliente($_POST['cliente']);
  $reporte->setCiudad($_POST['ciudad']);
  $reporte->setProductos($_POST['productos']);
  $reporte->setPdfData($_POST['pdfdata']);
  $reporte->setIdCompany($user->getCompany()->getId());
  if (!$reportesProcesosDao->save($reporte)) {
    http_response_code(411);
    exit;
  } else {
    http_response_code(200);
    exit;
  }
} else {
  http_response_code(401);
  exit;
}
