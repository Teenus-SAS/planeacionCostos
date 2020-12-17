<?php

/**
 * @author Alexis Holguin <wholguinmor@uniminuto.edu.co>
 * @github MoraHol
 * Este Script crea o modifica un proceso
 * Se llama por metodo 
 * @method POST 
 * @param optionProceso Con esta opcion se decide si es una creacion o actualización
 * @param proceso El nombre del proceso en caso de creacion y de actualización llega el id del proceso
 * @param name_proceso (opcional) El nuevo nombre del proceso en caso de una actualizacion
 * 
 * @responsesCodes
 *  201: En caso de que se cree exitosamente el proceso
 *  200: En caso de que se actualize exitosamente el proceso
 *  500: En caso de error en el servidor
 *  400: En caso de que no lleguen todos los parametros
 *  412: En caso de que no llegue la opcion de crear o modificar
 *  401: En caso de que no exista una session inciada
 */


include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ProcessDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $processDao = new ProcessDao();
  if (isset($_POST["optionProceso"])) {
    if (isset($_POST["proceso"])) {
      if ($_POST["proceso"] != "") {
        if ($_POST["optionProceso"] == "option1") {
          $process = new Process();
          $process->setIdCompany($user->getCompany()->getId());
          $process->setName($_POST["proceso"]);
          if ($processDao->save($process) > 0) {
            http_response_code(201);
          } else {
            http_response_code(500);
          }
        } else {
          if (isset($_POST['proceso-id'])) {
            $process = $processDao->findById($_POST["proceso-id"]);
            $process->setName($_POST["proceso"]);
            if ($processDao->update($process) > 0) {
              http_response_code(200);
            } else {
              http_response_code(500);
            }
          }
        }
      } else {
        http_response_code(400);
      }
    } else {
      http_response_code(400);
    }
  } else {
    http_response_code(412);
  }
} else {
  http_response_code(401);
  exit;
}
