<?php

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script crea o modifica un material
 * Se llama por metodo 
 * @method POST 
 * @param optionMateriaPrima Con esta opcion se decide si es una creacion o actualización
 * @param material El nombre del material en caso de creacion y de actualización llega el id del material
 * @param costo El costo del material
 * @param unidad La unidad de medida del material
 * 
 * @responsesCodes
 *  201: En caso de que se cree exitosamente el material
 *  200: En caso de que se actualize exitosamente el material
 *  500: En caso de error en el servidor
 *  501: En caso de que el costo sea menor a 0
 *  400: En caso de que no lleguen todos los parametros
 *  412: En caso de que no llegue la opcion de crear o modificar
 *  401: En caso de que no exista una session inciada
 */

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
  if (isset($_POST["material"]) && isset($_POST["costo"]) && isset($_POST["unidad"])) {
    if ($_POST["material"] != "" || $_POST["costo"] != "" || $_POST["unidad"] != "") {
      $material = new Material();
      $material->setId($_POST["idMateriaPrima"]);
      $material->setReferencia($_POST["ref_material"]);
      $material->setDescription(trim($_POST["material"]));
      $material->setIdCompany($user->getCompany()->getId());
      $material->setCost($_POST["costo"]);
      $material->setUnit($_POST["unidad"]);
      if (!$_POST["idMateriaPrima"]) {
        $materialDao->save($material);
        http_response_code(201);
      } else {
        if ($materialDao->update($material) > 0) {
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
