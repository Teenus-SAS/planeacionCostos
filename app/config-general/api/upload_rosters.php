<?php

set_time_limit(300);

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script crea o modifica nominas desde un archivo excel
 * Se llama por metodo 
 * @method POST 
 * @param rostersJSON Un objeto json que contiene todos los datos de nominas subidas en el excel
 * 
 * @responsesCodes
 *  200: en caso de que se suba la información correctamente
 *  401: en caso de que no exista una session inciada
 */

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "RosterDao.php";
require_once DAO_PATH . "ProcessDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

function objectToArray($d)
{
  if (is_object($d)) {
    // Gets the properties of the given object
    // with get_object_vars function
    $d = get_object_vars($d);
  }

  if (is_array($d)) {
    /*
      * Return array converted to object
      * Using __FUNCTION__ (Magic constant)
      * for recursive call
      */
    return array_map(__FUNCTION__, $d);
  } else {
    // Return array
    return $d;
  }
}


if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $rosterDao = new RosterDao();
  $processDao = new ProcessDao();
  $rostersJSON = objectToArray(json_decode($_POST["rosters"]));

  $responses = [];
  foreach ($rostersJSON as $rosterJSON) {
    $salary = $rosterJSON["Salario"] + $rosterJSON["Horas Extras"];
    $netSalary = $salary + ($salary * ($rosterJSON["Prestaciones"])) + $rosterJSON["Bonificaciones"] + $rosterJSON["Dotacion"];
    $roster = new Roster();
    $roster->setIdCompany($user->getCompany()->getId());
    $roster->setPosition($rosterJSON["Cargo"]);
    $roster->setProcess($processDao->findById($rosterJSON["Proceso"]));
    $roster->setNumberEmployees($rosterJSON["Cantidad"]);
    $roster->setSalary($rosterJSON["Salario"]);
    $roster->setBonus($rosterJSON["Bonificaciones"]);
    $roster->setEndowment($rosterJSON["Dotacion"]);
    $roster->setWorkHours($rosterJSON["Horas"]);
    $roster->setBussinesDaysMonth($rosterJSON["Dias"]);
    $roster->setPerformaceFactor($rosterJSON["Prestaciones"] * 100);
    $roster->setNetSalary($netSalary);
    $roster->setContract($rosterJSON["Tipo de contrato"]);
    $roster->setExtraHours($rosterJSON["Horas Extras"]);

    if ($rosterDao->save($roster) > 0) {
      array_push($responses, true);
    } else {
      $roster->setId($rosterDao->findId($roster));
      if ($rosterDao->update($roster) > 0) {
        array_push($responses, true);
      } else {
        array_push($responses, false);
      }
    }
  }
  http_response_code(200);
  echo json_encode($responses);
} else {
  http_response_code(401);
  exit;
}
