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
    $d = get_object_vars($d);
  }
  if (is_array($d)) {
    return array_map(__FUNCTION__, $d);
  } else {
    return $d;
  }
}

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $rosterDao = new RosterDao();
  $processDao = new ProcessDao();
  $rostersJSON = json_decode($_POST["rosters"]);

  $responses = [];
  foreach ($rostersJSON as $rosterJSON) {
    $salary = $rosterJSON->salario + $rosterJSON->horasextras;
    $netSalary = $salary + ($salary * ($rosterJSON->prestaciones)) + $rosterJSON->bonificaciones + $rosterJSON->dotacion;
    $roster = new Roster();
    $roster->setIdCompany($user->getCompany()->getId());
    $roster->setPosition($rosterJSON->cargo);
    $roster->setProcess($processDao->findById($rosterJSON->proceso));
    $roster->setNumberEmployees($rosterJSON->cantidad);
    $roster->setSalary($rosterJSON->salario);
    $roster->setBonus($rosterJSON->bonificaciones);
    $roster->setEndowment($rosterJSON->dotacion);
    $roster->setWorkHours($rosterJSON->horas);
    $roster->setBussinesDaysMonth($rosterJSON->dias);
    $roster->setPerformaceFactor($rosterJSON->prestaciones * 100);
    $roster->setNetSalary($netSalary);
    $roster->setContract($rosterJSON->tipodecontrato);
    $roster->setExtraHours($rosterJSON->horasextras);

    $id = $rosterDao->findId($roster);
    if ($id) {
      $roster->setId($id);
      $rosterDao->update($roster);
      array_push($responses, true);
      continue;
    } 
    $rosterDao->save($roster);
    array_push($responses, false);
  }
  http_response_code(200);
  echo json_encode($responses);
} else {
  http_response_code(401);
  exit;
}
