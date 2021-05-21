<?php

set_time_limit(300);

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
    $salary = $rosterJSON->salario + $rosterJSON->horasextras + $rosterJSON->transporte;
    $netSalary = $salary + ($salary * ($rosterJSON->prestaciones/100)) + $rosterJSON->otrosingresos + $rosterJSON->dotacion;
    $roster = new Roster();
    $roster->setIdCompany($user->getCompany()->getId());
    $roster->setPosition($rosterJSON->nombre);
    $roster->setProcess($processDao->findById($rosterJSON->proceso));
    $roster->setSalary($rosterJSON->salario);
    $roster->setTransporte($rosterJSON->transporte);
    $roster->setBonus($rosterJSON->otrosingresos);
    $roster->setEndowment($rosterJSON->dotacion);
    $roster->setWorkHours($rosterJSON->horas);
    $roster->setBussinesDaysMonth($rosterJSON->dias);
    $roster->setPerformaceFactor($rosterJSON->prestaciones);
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
