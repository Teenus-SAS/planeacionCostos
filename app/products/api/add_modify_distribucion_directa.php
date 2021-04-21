<?php

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script crea o actualiza una distribucion directa
 * Se llama por metodo 
 * @method POST 
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
require_once DAO_PATH . "DistribucionDirectaDao.php";
require_once DAO_PATH . "ProcessDao.php";
require_once MODEL_PATH . "DistribucionDirecta.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $distribucionDirectaDao = new DistribucionDirectaDao();
  $processDao = new ProcessDao();
  if (isset($_POST["proceso"]) && isset($_POST["porcentaje"])) {
    if ($_POST["proceso"] != "" || $_POST["porcentaje"] != "") {
      if ($_POST["porcentaje"] > 0) {
        $procesos = $processDao->findProductProcessesByProcessId($_POST["proceso"]);
        $tiempoProceso = 0;
        foreach ($procesos as $proceso) {
          $tiempoProceso += $proceso->getTimeOperacion() + $proceso->getTimeAlistamiento();
        }
        $gastosGenerales = floatval($_POST["gastosGenerales"]);
        $porcentaje = floatval($_POST["porcentaje"])/100;
        $valorProceso = $porcentaje*$gastosGenerales;
        
        $distribucion = new DistribucionDirecta();
        $distribucion->setId($_POST["idDistribucionDirecta"]);
        $distribucion->setIdEmpresa($user->getCompany()->getId());
        $distribucion->setIdProceso($_POST["proceso"]);
        $distribucion->set($porcentaje, $user->getCompany(), $tiempoProceso);
        if(null==($distribucion->getId())) {
          $existsDistribucion = $distribucionDirectaDao->findOneByProcessId($user->getCompany()->getId(), $_POST["proceso"]);
          if (!$existsDistribucion) {
            $distribucionDirectaDao->save($distribucion);
            http_response_code(201);
            exit;
          }
          $distribucion->setId($existsDistribucion->getId());
        }
        $distribucionDirectaDao->update($distribucion);
        http_response_code(200);
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
