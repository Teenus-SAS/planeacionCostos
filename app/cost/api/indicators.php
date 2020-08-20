<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "MachineDao.php";
require_once DAO_PATH . "ProductDao.php";
require_once DAO_PATH . "RosterDao.php";

$response = new stdClass();
// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $rosterDao = new RosterDao();
  $machineDao = new MachineDao();
  $productDao = new ProductDao();
  $rosterDao = new RosterDao();
  $product = $productDao->findById($_GET["id"], true, true, true);
  $quantity = $_GET["quantity"];
  $response->rawMaterialExpenses = 0;
  if ($product->getProcesses() != null) {
    $response->ManoObra = [];
    $response->timeProcessTotal = 0;
    $response->processes = [];
    foreach ($product->getProcesses() as $process) {
      $roster = $rosterDao->findByProcess($process->getProcess());
      $response->timeProcessTotal += $process->getTimeProcess() * $quantity;
      array_push($response->processes, array("time" => $process->getTimeProcess() * $quantity, "name" => $process->getProcess()->getName()));
      if ($roster != null) {
        array_push($response->ManoObra, array("process" => $process->getProcess()->getName(), "costo" => ($process->getTimeProcess() * $roster->getValueMinute()) / $roster->getNumberEmployees()));
      }
    }
  }
  $response->rawMaterials = [];
  foreach ($product->getMaterials() as $rawMaterial) {
    array_push($response->rawMaterials, array("material" => $rawMaterial->getMaterial()->getDescription(), "cost" => $rawMaterial->getQuantity() * $rawMaterial->getMaterial()->getCost() * $quantity));
    $response->rawMaterialExpenses += $rawMaterial->getQuantity() * $rawMaterial->getMaterial()->getCost() * $quantity;
  }
  if ($user->getCompany()->getExpensesDescription() != '') {
    $response->expensesDescription = json_decode($user->getCompany()->getExpensesDescription());
  } else {
    $response->expensesDescription = false;
    $response->totalExpenses = $user->getCompany()->getTotalMonthExpenses();
  }
  echo json_encode($response);
} else {
  http_response_code(401);
  exit;
}
