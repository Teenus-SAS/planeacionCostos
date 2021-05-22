<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "MaterialDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $materialDao = new MaterialDao();
  $materialsJSON = json_decode($_POST["materials"]);

  $responses = [];
  foreach ($materialsJSON as $materialJSON) {
    $material = new Material();
    $material->setIdCompany($user->getCompany()->getId());
    $material->setReferencia($materialJSON->referencia);
    $material->setDescription(trim($materialJSON->materiaprima));
    $material->setUnit($materialJSON->unidad);
    $material->setCost($materialJSON->costo);
    
    array_push($responses, $materialDao->saveOrUpdate($material));
  }

  http_response_code(200);
  echo json_encode($responses);
} else {
  http_response_code(401);
  exit;
}
