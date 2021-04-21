<?php

set_time_limit(300);

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "MachineDao.php";

session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $machineDao = new MachineDao();
  $machinesJSON = json_decode($_POST["machines"]);
  $responses = [];
  foreach ($machinesJSON as $machineJSON) {
    $machine = new Machine();
    $machine->setIdCompany($user->getCompany()->getId());
    $machine->setName($machineJSON->maquina);
    $machine->setValuesDepreciation($user->getCompany()->getBussinesDaysMonth(), $user->getCompany()->getWorkHours(), $machineJSON->precio, $machineJSON->valorresidual, $machineJSON->anos);
    array_push($responses, $machineDao->saveOrUpdate($machine));
  }
  http_response_code(200);
  echo json_encode($responses);
} else {
  http_response_code(401);
  exit;
}
