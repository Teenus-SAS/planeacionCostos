<?php

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script crea o actualiza un servicio externo
 * Se llama por metodo 
 * @method POST 
 * @param nombre El nombre del insumo en caso de creación
 * @param costo El costo del servicio externo
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
require_once DAO_PATH . "ServiciosExternosDao.php";
require_once MODEL_PATH . "ServicioExterno.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $serviciosExternosDao = new ServiciosExternosDao();
  if (isset($_POST["servicioexterno"]) && isset($_POST["costoServicioExterno"])) {
    if ($_POST["servicioexterno"] != "" || $_POST["costoServicioExterno"] != "") {
      if ($_POST["costoServicioExterno"] > 0) {
        $servicio = new ServicioExterno();
        $servicio->setId($_POST["idServicioExterno"]);
        $servicio->setnombreServicio($_POST["servicioexterno"]);
        $servicio->setIdEmpresa($user->getCompany()->getId());
        $servicio->setIdProducto($_POST["cfproductos"]);
        $servicio->setCosto($_POST["costoServicioExterno"]);
        if ($serviciosExternosDao->saveOrUpdate($servicio)) {
          http_response_code(200);
        } else {
          http_response_code(201);
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
