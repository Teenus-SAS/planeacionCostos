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
  $input = json_decode(file_get_contents("php://input"), true);
  $consecutivo = $input["consecutivo"];
  $cliente = $input["cliente"];
  $ciudad = $input["ciudad"];
  $productos = $input["productos"];
  $pdfdata = $input["pdfdata"];
  $user = unserialize($_SESSION["user"]);
  $reportesProcesosDao = new ReporteCosteoProcesosDao();
  $productDao = new ProductDao();
  $reporte = new ReporteCosteoProcesos();
  $reporte->setConsecutivo($consecutivo);
  $reporte->setCliente($cliente);
  $reporte->setCiudad($ciudad);
  $reporte->setProductos($productos);
  $reporte->setPdfData($pdfdata);
  $reporte->setIdCompany($user->getCompany()->getId());
  if (!$reportesProcesosDao->save($reporte)) {
    http_response_code(411);
    exit;
  } else {
    http_response_code(200);
    echo json_encode(new stdClass);
    exit;
  }
} else {
  http_response_code(401);
  exit;
}
