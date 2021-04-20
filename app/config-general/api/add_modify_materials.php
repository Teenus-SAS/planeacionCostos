<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "MaterialDao.php";

session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $materialDao = new MaterialDao();
  if (isset($_POST["material"]) && isset($_POST["costo"]) && isset($_POST["unidad"])) {
    if ($_POST["material"] != "" || $_POST["costo"] != "" || $_POST["unidad"] != "") {
      $material = new Material();
      $material->setReferencia($_POST["ref_material"]);
      $material->setDescription(trim($_POST["material"]));
      $material->setIdCompany($user->getCompany()->getId());
      $material->setCost($_POST["costo"]);
      $material->setUnit($_POST["unidad"]);
      $id = $_POST["idMateriaPrima"];
      if (!$id) {
        $materialExiste = $materialDao->findByReference($_POST["ref_material"], $user->getCompany()->getId());
        if ($materialExiste) {
          $id = $materialExiste->getId();
        }
      }
      if (!$id) {
        $materialDao->save($material);
        http_response_code(201);
      } else {
        $material->setId($id);
        if ($materialDao->update($material)) {
          http_response_code(200);
        } else {
          http_response_code(500);
        }
      } 
    } else{
      http_response_code(400);
    }
  } else {
    http_response_code(400);
  }
} else {
  http_response_code(401);
  exit;
}
