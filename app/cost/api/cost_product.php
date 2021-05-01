<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "MachineDao.php";
require_once DAO_PATH . "CargaFabrilDao.php";
require_once DAO_PATH . "DistribucionDirectaDao.php";
require_once DAO_PATH . "ProductDao.php";
require_once DAO_PATH . "RosterDao.php";
require_once DAO_PATH . "ProcessDao.php";


$response = new stdClass();
// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) { 
  $user = unserialize($_SESSION["user"]);
  $rosterDao = new RosterDao();
  $machineDao = new MachineDao();
  $cargaFabrilDao = new CargaFabrilDao();
  $dDirectaDao = new DistribucionDirectaDao();
  $productDao = new ProductDao();
  $rosterDao = new RosterDao();
  $processDao = new ProcessDao();

  $product = $productDao->findById($_GET["id"], true, true, true);
  $response->laborCost = 0;
  $response->indirectExpenses = 0;
  $response->rawMaterialExpenses = 0;
  $response->generalExpenses = 0;
  $quantity = (int) $_GET["quantity"];
  if ($product->getProductProcesses() != null) {
    $response->ManoObra = [];
    foreach ($product->getProductProcesses() as $productProcess) {
      $distribucion = $dDirectaDao->findOneByProcessId($user->getCompany()->getId(),$productProcess->getProcess()->getId());
      if($distribucion)  {
        $response->generalExpenses += $distribucion->getValorAsignado();
      }
      
      $roster = $rosterDao->findByProcess($productProcess->getProcess());
      if ($roster != null) {
        $response->laborCost += ($productProcess->getTimeAlistamiento() + $productProcess->getTimeOperacion() * $roster->getValueMinute());
        array_push($response->ManoObra, array("tiempo" => $productProcess->getTimeAlistamiento() + $productProcess->getTimeOperacion(), "valor" => $roster->getValueMinute(), "costo" => $productProcess->getTimeAlistamiento() * $roster->getValueMinute()));
      }

      if ($productProcess->getMachine() != null) {
        $machineId = $productProcess->getMachine()->getId();
        
        $cargasMachine = $cargaFabrilDao->findByMachineId($machineId);
        $totalCargasMaquina = 0;

        foreach($cargasMachine as $carga) {
            $totalCargasMaquina += $carga->getCostoPorMinuto();
        }
        $response->indirectExpenses += $productProcess->getTimeOperacion() * ($productProcess->getMachine()->getDepreciation() + $totalCargasMaquina);
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
  $response->generalExpenses += $product->getExpenses()->getUnitAssignableExpense();
  
  $serviciosExternos = $product->getServiciosExternos();
  if ($serviciosExternos && count($serviciosExternos) > 0) {
    foreach ($serviciosExternos as $servicioExterno) {
      $response->generalExpenses += $servicioExterno->getCosto();
    }
  }
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
