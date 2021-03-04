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
  $response->laborCost = 0;
  $response->indirectExpenses = 0;
  $response->rawMaterialExpenses = 0;
  $quantity = (int) $_GET["quantity"];
  if ($product->getProcesses() != null) {
    $response->ManoObra = [];
    foreach ($product->getProcesses() as $process) {
      $roster = $rosterDao->findByProcess($process->getProcess());
      if ($roster != null) {
        $response->laborCost += ($process->getTimeAlistamiento() + $process->getTimeOperacion() * $roster->getValueMinute());
        array_push($response->ManoObra, array("tiempo" => $process->getTimeAlistamiento() + $process->getTimeOperacion(), "valor" => $roster->getValueMinute(), "costo" => $process->getTimeAlistamiento() * $roster->getValueMinute()));
      }
      if ($process->getMachine() != null) {
        $response->indirectExpenses += $process->getTimeOperacion() * $process->getMachine()->getDepreciation();
      }
    }
  }
  foreach ($product->getMaterials() as $rawMaterial) {
    $response->rawMaterialExpenses += $rawMaterial->getQuantity() * $rawMaterial->getMaterial()->getCost();
  }
  $response->laborCost *= $quantity;
  $response->indirectExpenses *= $quantity;
  $response->rawMaterialExpenses *= $quantity;
  $response->cost = $response->indirectExpenses + $response->rawMaterialExpenses + $response->laborCost;
  $response->generalExpenses = $product->getExpenses()->getUnitAssignableExpense();
  $response->totalCost = $response->cost + $response->generalExpenses;


  if (isset($_GET["consolidated"])) {
    $response->salePrice = $response->totalCost / (1 - ($user->getCompany()->getProfitabilityMargin() / 100) - ($user->getCompany()->getSalesCommission() / 100));
    $response->profitability = ($user->getCompany()->getProfitabilityMargin() / 100) * $response->salePrice;
  } else {
    $response->salePrice = $response->totalCost / (1 - ($product->getRentabilidad() / 100) - ($user->getCompany()->getSalesCommission() / 100));
    $response->profitability = ($product->getRentabilidad() / 100) * $response->salePrice;
  }




  $response->productProfitability = $product->getRentabilidad();
  $response->profitabilityMargin = $user->getCompany()->getProfitabilityMargin();

  /* $response->salesCommission = ($user->getCompany()->getSalesCommission() / 100) * $response->salePrice; */
  $response->salesCommission = $user->getCompany()->getSalesCommission();
  echo json_encode($response);
} else {
  http_response_code(401);
  exit;
}
