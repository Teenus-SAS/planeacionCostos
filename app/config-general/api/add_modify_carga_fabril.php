<?php

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script crea una carga
 * Se llama por metodo 
 * @method POST 
 * @param insumo El nombre de la máquina en caso de creacion
 * @param price El precio de la máquina
 * @param pricePerMinute La depreciacion de la máquina
 * 
 * @responsesCodes
 *  201: en caso de que se cree exitosamente la máquina
 *  500: en caso de error en el servidor
 *  501: en caso de que el precio sea menor a 0
 *  400: en caso de que no lleguen todos los parametros
 *  401: en caso de que no exista una session inciada
 */


include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "CargaFabrilDao.php";
require_once MODEL_PATH . "CargaFabril.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $cargaFabrilDao = new CargaFabrilDao();
  if (isset($_POST["insumo"]) && isset($_POST["costoCargaFabril"]) && isset($_POST["minutoCargaFabril"])) {
    if ($_POST["insumo"] != "" || $_POST["costoCargaFabril"] != "" || $_POST["minutoCargaFabril"] != "") {
      if ($_POST["costoCargaFabril"] > 0) {
        $carga = new CargaFabril();
        $carga->setInsumo($_POST["insumo"]);
        $carga->setIdEmpresa($user->getCompany()->getId());
        $carga->setIdMaquina($_POST["cfmaquinas"]);
        $carga->setCosto($_POST["costoCargaFabril"]);
        $carga->setCostoPorMinuto($_POST["minutoCargaFabril"]);
        if ($cargaFabrilDao->saveOrUpdate($carga) > 0) {
          http_response_code(201);
        } else {
          http_response_code(500);
        }
      } else {
        http_response_code(501);
      }
    } else {
      http_response_code(400);
    }
  } else {
    http_response_code(400);
  }
} else {
  http_response_code(401);
  exit;
}
