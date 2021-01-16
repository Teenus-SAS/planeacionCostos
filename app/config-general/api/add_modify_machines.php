<?php
/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script crea o modifica una máquina
 * Se llama por metodo 
 * @method POST 
 * @param optionMaquinas Con esta opcion se decide si es una creacion o actualización
 * @param machine El nombre de la máquina en caso de creacion y de actualización llega el id de la maquina
 * @param price El precio de la máquina
 * @param depreciation La depreciacion de la máquina
 * 
 * @responsesCodes
 *  201: en caso de que se cree exitosamente la máquina
 *  200: en caso de que se actualize exitosamente la máquina
 *  500: en caso de error en el servidor
 *  501: en caso de que el precio sea menor a 0
 *  400: en caso de que no lleguen todos los parametros
 *  412: en caso de que no llegue la opcion de crear o modificar
 *  401: en caso de que no exista una session inciada
 */


include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "MachineDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $machineDao = new MachineDao();
  if (isset($_POST["optionMaquinas"])) {
    if (isset($_POST["machine"]) && isset($_POST["price"]) && isset($_POST["depreciation"]) && isset($_POST["machine-id"])) {
      if ($_POST["machine"] != "" || $_POST["price"] != "" || $_POST["depreciation"] != "") {
        if ($_POST["price"] > 0) {
          if ($_POST["optionMaquinas"] == "option1") {
            $machine = new Machine();
            $machine->setName($_POST["machine"]);
            $machine->setIdCompany($user->getCompany()->getId());
            $machine->setPrice($_POST["price"]);
            $machine->setDepreciation($_POST["depreciation"]);
            $machine->setYearsDepreciation($_POST["years"]);
            $machine->setResidualValue($_POST["valor-residual"]);
            if ($machineDao->save($machine) > 0) {
              http_response_code(201);
            } else {
              http_response_code(500);
            }
          } else {
            if ($_POST["machine-id"] != "") {
            $machine = $machineDao->findById($_POST["machine-id"]);
            $machine->setName($_POST["machine"]);
            $machine->setPrice($_POST["price"]);
            $machine->setDepreciation($_POST["depreciation"]);
            $machine->setYearsDepreciation($_POST["years"]);
            $machine->setResidualValue($_POST["valor-residual"]);
            echo var_dump($machine);
            if ($machineDao->update($machine) > 0) {
              http_response_code(200);
            } else {
              http_response_code(500);
            }
          }
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
    http_response_code(412);
  }
} else {
  http_response_code(401);
  exit;
}
