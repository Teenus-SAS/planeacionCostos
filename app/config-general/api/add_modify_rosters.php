<?php

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script crea o modifica una nomina
 * Se llama por metodo 
 * @method POST 
 * @param optionNomina Con esta opcion se decide si es una creacion o actualización
 * @param cargo El nombre del cargo en caso de creacion y de actualización llega el id del cargo
 * @param Numeroempleados El número de empleados de la nomina
 * @param proceso El id del proceso al que se quiere asignar esa nomina
 * @param salario El salario de esa nomina (numérico)
 * @param bonificacion La bonificacion de esa nomina (numérico)
 * @param dotacion  La dotacion de esa nomina (numérico)
 * @param horasTrabajo Las horas de trabajo de la nomina (numérico)
 * @param diasMes Los días laborados al mes (numérico)
 * @param optionFactorPrestacional Tipo de contrato si es por "nomina" o "servicios"
 * @param factorPrestacional Factor prestacional de la nomina (numérico)
 * 
 * @responsesCodes
 *  201: en caso de que se cree exitosamente el proceso
 *  200: en caso de que se actualize exitosamente el proceso
 *  500: en caso de error en el servidor
 *  400: en caso de que no lleguen todos los parametros
 *  412: en caso de que no llegue la opcion de crear o modificar
 *  401: en caso de que no exista una session inciada
 */


include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "RosterDao.php";
require_once DAO_PATH . "ProcessDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $rosterDao = new RosterDao();
  $processDao = new ProcessDao();
  /* if (isset($_POST["optionNomina"])) { */
  if (
    isset($_POST["cargo"]) && isset($_POST["proceso"])
    && isset($_POST["salario"]) && isset($_POST["bonificacion"]) && isset($_POST["dotacion"])
    && isset($_POST["horasTrabajo"]) && isset($_POST["diasMes"]) && isset($_POST["optionFactorPrestacional"])
    && isset($_POST["factorPrestacional"])
  ) {
    if (
      $_POST["cargo"] != "" || $_POST["proceso"] != ""
      || $_POST["salario"] != "" || $_POST["bonificacion"] != "" || $_POST["dotacion"] != ""
      || $_POST["horasTrabajo"] != "" || $_POST["diasMes"] != "" || $_POST["optionFactorPrestacional"] != ""
      || $_POST["factorPrestacional"] != ""
    ) {
      $salary = $_POST["salario"] + $_POST["horasExtra"] + $_POST['transporte'];
      $netSalary = $salary + ($salary * ($_POST["factorPrestacional"] / 100)) + $_POST["bonificacion"] + $_POST["dotacion"];

      if ($_POST["cargo-id"]) {
        $roster = $rosterDao->findById($_POST["cargo-id"]);
        $roster->setProcess($processDao->findById($_POST["proceso"]));
        $roster->setPosition($_POST["cargo"]);
        $roster->setSalary($_POST["salario"]);
        $roster->setTransporte($_POST['transporte']);
        $roster->setBonus($_POST["bonificacion"]);
        $roster->setEndowment($_POST["dotacion"]);
        $roster->setWorkHours($_POST["horasTrabajo"]);
        $roster->setBussinesDaysMonth($_POST["diasMes"]);
        $roster->setPerformaceFactor($_POST["factorPrestacional"]);
        $roster->setNetSalary($netSalary);
        $roster->setContract($_POST["optionFactorPrestacional"]);
        $roster->setExtraHours($_POST["horasExtra"]);
        if ($rosterDao->update($roster) > 0) {
          http_response_code(200);
        } else {
          http_response_code(500);
        }
        /* } */
      } else {

        $roster = new Roster();
        // calculo de salario neto
        $roster->setIdCompany($user->getCompany()->getId());
        $roster->setProcess($processDao->findById($_POST["proceso"]));
        $roster->setPosition($_POST["cargo"]);
        //$roster->setNumberEmployees($_POST["Numeroempleados"]);
        $roster->setSalary($_POST["salario"]);
        $roster->setTransporte($_POST['transporte']);
        $roster->setBonus($_POST["bonificacion"]);
        $roster->setEndowment($_POST["dotacion"]);
        $roster->setWorkHours($_POST["horasTrabajo"]);
        $roster->setBussinesDaysMonth($_POST["diasMes"]);
        $roster->setPerformaceFactor($_POST["factorPrestacional"]);
        $roster->setNetSalary($netSalary);
        $roster->setContract($_POST["optionFactorPrestacional"]);
        $roster->setExtraHours($_POST["horasExtra"]);
        if ($rosterDao->save($roster) > 0) {
          http_response_code(201);
        } else {
          http_response_code(500);
        }
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
