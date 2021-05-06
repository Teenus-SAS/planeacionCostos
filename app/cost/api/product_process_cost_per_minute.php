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

  $quantity = (int) $_GET["quantity"];
  $processesCostPerMinute = [];
  $productProcesses = $processDao->findProductProcessesByProductId($_GET["idProducto"]);
  if ($productProcesses) {
    foreach ($productProcesses as $process) {
      $costo = 0;
      $distribucion = $dDirectaDao->findOneByProcessId($user->getCompany()->getId(),$process->getProcess()->getId());
      if($distribucion)  {
          $costo += $distribucion->getValorAsignado();
      }
      
      $roster = $rosterDao->findByProcess($process->getProcess());
      if ($roster != null) {
          $costo += $roster->getValueMinute();
      }
  
      if ($process->getMachine() != null) {
          $machineId = $process->getMachine()->getId();
          
          $cargasMachine = $cargaFabrilDao->findByMachineId($machineId);
          $totalCargasMaquina = 0;
  
          foreach($cargasMachine as $carga) {
              $totalCargasMaquina += $carga->getCostoPorMinuto();
          }
          $costo += ($process->getMachine()->getDepreciation() + $totalCargasMaquina);
      }
      array_push($processesCostPerMinute, [$process->getId(), $costo * $quantity]);
    }
  }

  echo json_encode($processesCostPerMinute);
  http_response_code(200);
} else {
  http_response_code(401);
  exit;
}
