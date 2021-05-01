<?php


include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once MODEL_PATH . "Process.php";
require_once MODEL_PATH . "ProductProcess.php";
require_once DAO_PATH . "MachineDao.php";

class ProcessDao {
  private $db;
  private $machineDao;

  public function __construct() {
    $this->machineDao = new MachineDao();
    $this->db = new DBOperator($_ENV["db_host"], $_ENV["db_user"], $_ENV["db_name"], $_ENV["db_pass"]);
  }

  public function findById($id) {
    $this->db->connect();
    $query = "SELECT * FROM `procesos` WHERE `id_procesos` = $id";
    $processDB = $this->db->consult($query, "yes");
    if (!$processDB || count($processDB) == 0) {
      return null;
    }
    $processDB = $processDB[0];
    $process = new Process();
    $process->setId($processDB["id_procesos"]);
    $process->setName($processDB["nombre"]);
    $process->setIdCompany($processDB["empresas_id_empresa"]);
    $this->db->close();
    return $process;
  }

  public function findProductProcessById($id) {
    $this->db->connect();
    $query = "SELECT * FROM `tiempo_proceso` WHERE `id_tiempo_proceso` = $id";
    $productProcessDB = $this->db->consult($query, "yes");
    $productProcessDB = $productProcessDB[0];
    $productProcess = new ProductProcess();
    $productProcess->setId($productProcessDB["id_tiempo_proceso"]);
    $productProcess->setIdProduct($productProcessDB["productos_id_producto"]);
    $productProcess->setIdCompany($productProcessDB["productos_empresas_id_empresa"]);
    $productProcess->setMachine($this->machineDao->findById($productProcessDB["maquinas_id_maquinas"]));
    $productProcess->setTimeAlistamiento($productProcessDB["tiempo_alistamiento"]);
    $productProcess->setTimeOperacion($productProcessDB["tiempo_operacion"]);
    $productProcess->setProcess($this->findById($productProcessDB["procesos_id_procesos"]));

    /* $this->db->close(); */
    return $productProcess;
  }

  public function findProductProcessesByProductId($productId) {
    $this->db->connect();
    $query = "SELECT `id_tiempo_proceso` FROM `tiempo_proceso` WHERE `productos_id_producto` = " . $productId;
    $productProcessesDB = $this->db->consult($query, "yes");
    $productProcesses = [];
    if (count($productProcessesDB) > 0) {
      foreach ($productProcessesDB as $productProcessDB) {
        array_push($productProcesses, $this->findProductProcessById($productProcessDB["id_tiempo_proceso"]));
      }
      return $productProcesses;
    } else {
      return null;
    }
  }

  public function findOneProductProcessesByMachineId($machineId) {
    $this->db->connect();
    $query = "SELECT `id_tiempo_proceso` FROM `tiempo_proceso` WHERE `maquinas_id_maquinas` = " . $machineId;
    $productProcessesDB = $this->db->consult($query, "yes");
    if (count($productProcessesDB) > 0) {
      return $this->findProductProcessById($productProcessesDB[0]["id_tiempo_proceso"]);
    } else {
      return null;
    }
  }

  public function findOneProductProcessByProductAndMachine($product, $idProcess, $idMachine) {
    $this->db->connect();
    if ($idMachine == 'NULL') {
      $query = "SELECT `id_tiempo_proceso` FROM `tiempo_proceso` WHERE `productos_id_producto` = '" . $product->getId() . "' AND `procesos_id_procesos` = '$idProcess' AND `maquinas_id_maquinas` IS NULL";
    } else {
      $query = "SELECT `id_tiempo_proceso` FROM `tiempo_proceso` WHERE `productos_id_producto` = '" . $product->getId() . "' AND `procesos_id_procesos` = '$idProcess' AND `maquinas_id_maquinas` = '$idMachine'";
    }
    $id = $this->db->consult($query, "yes");
    if (count($id) > 0) {
      $id = $id[0]["id_tiempo_proceso"];
      return $this->findProductProcessById($id);
    } else {
      return null;
    }
  }

  public function findProductProcessesByProcessId($idProcess) {
    $this->db->connect();
    $query = "SELECT `id_tiempo_proceso` FROM `tiempo_proceso` WHERE `procesos_id_procesos` = '$idProcess'";
    $ids = $this->db->consult($query, "yes");
    $procesos = [];
    foreach ($ids as $id) {
      array_push($procesos, $this->findProductProcessById($id["id_tiempo_proceso"]));
    }

    return $procesos;
  }

  public function findByCompany($idCompany) {
    $this->db->connect();
    $query = "SELECT `id_procesos` FROM `procesos` WHERE `empresas_id_empresa` = $idCompany";
    $processesDB = $this->db->consult($query, "yes");
    if ($processesDB !== false) {
      $processes = [];
      foreach ($processesDB as $processDB) {
        array_push($processes, $this->findById($processDB["id_procesos"]));
      }
      return $processes;
    } else {
      return null;
    }
  }

  public function findByProductId($productId) {
    $this->db->connect();
    $query = "SELECT `id_procesos` FROM `procesos` WHERE `empresas_id_empresa` = $productId";
    $processesDB = $this->db->consult($query, "yes");
    if ($processesDB !== false) {
      $processes = [];
      foreach ($processesDB as $processDB) {
        array_push($processes, $this->findById($processDB["id_procesos"]));
      }
      return $processes;
    } else {
      return null;
    }
  }

  public function findOneByProcessName($idCompany, $processName) {
    $this->db->connect();
    $query = "SELECT `id_procesos` FROM `procesos` WHERE `empresas_id_empresa` = '$idCompany' AND `nombre` = '$processName'";
    $processesDB = $this->db->consult($query, "yes");
    if ($processesDB && count($processesDB) > 0) {
      return $this->findById($processesDB[0]["id_procesos"]);;
    } else {
      return null;
    }
  }

  public function saveOrUpdateProductProcess($product, $idMachine, $idProcess, $tiempoAlistamiento, $tiempoOperacion ) {
    if (!$idMachine) {
      $idMachine = 'NULL';
    }
    $productProcess = $this->findOneProductProcessByProductAndMachine($product, $idProcess, $idMachine);
    if ($productProcess == null) {
      $this->db->connect();
      $query = "INSERT INTO `tiempo_proceso` (`id_tiempo_proceso`, `productos_id_producto`,
      `productos_empresas_id_empresa`, `procesos_id_procesos`, `maquinas_id_maquinas`, `tiempo_alistamiento`, `tiempo_operacion`) 
      VALUES (NULL, '" . $product->getId() . "', '" . $product->getIdCompany() . "', '$idProcess', $idMachine, '$tiempoAlistamiento', '$tiempoOperacion')";
      $reponse = new stdClass();
      $this->db->consult($query);
      $reponse->mode = "created";
      return $reponse;
    } else {
      $this->db->connect();
      $query = "UPDATE `tiempo_proceso` SET `tiempo_alistamiento` = $tiempoAlistamiento, `tiempo_operacion` = $tiempoOperacion WHERE `id_tiempo_proceso` = '" . $productProcess->getId() . "'";
      $reponse = new stdClass();
      $this->db->consult($query);
      $reponse->mode = "updated";
      return $reponse;
    }
  }

  public function save($process) {
    $this->db->connect();
    $query = "INSERT INTO `procesos` (`id_procesos`, `nombre`, `empresas_id_empresa`)
     VALUES (NULL, '" . $process->getName() . "', '" . $process->getIdCompany() . "')";
    return $this->db->consult($query);
  }

  public function update($process) {
    $this->db->connect();
    $query = "UPDATE `procesos` SET `nombre` = '" . $process->getName() . "' 
    WHERE `procesos`.`id_procesos` = " . $process->getId();
    return $this->db->consult($query);
  }

  public function delete($id) {
    $this->db->connect();
    $query = "DELETE FROM `procesos` WHERE `procesos`.`id_procesos` = $id";
    return $this->db->consult($query);
  }

  public function deleteProductProcess($id) {
    $this->db->connect();
    $query = "DELETE FROM `tiempo_proceso` WHERE `tiempo_proceso`.`id_tiempo_proceso` = $id";
    return $this->db->consult($query);
  }

  public function deleteProductProcessByProduct($idProduct) {
    $this->db->connect();
    $query = "DELETE FROM `tiempo_proceso` WHERE `tiempo_proceso`.`productos_id_producto` = $idProduct";
    return $this->db->consult($query);
  }

  public function findDataProcess($id){
    $this->db->connect();
    $query ="SELECT * FROM `datos_proceso` WHERE `fk_id_proceso`=$id";
    $procesos = $this->db->consult($query,"yes");
    //procesos=$procesos[0];
    $proces=[];
    if(!empty($procesos)){
      array_push($proces,$procesos[0]);
      return($proces);
      }
      else{
      return null;
    } 
  }

  public function saveDataProcess($idProceso,$tAislamiento,$tOperacion,$nMaquinas,$pRechazo,$nTurnos,$distancia,$disponibilidad,$mCorrectivo,$pMenores){
    $dataProcess = $this->findDataProcess($idProceso);
    if($dataProcess == null){
    $this->db->connect();
    $query = "INSERT INTO `datos_proceso`(`fk_id_proceso`,`tiempo_aislamiento`,`tiempo_operacion`,`numero_maquinas`,`porcentaje_rechazo`,`numero_turnos`,`distancia`,`disponibilidad`,`mantenimiento_correctivo`,`paradas_menores`,`eficiencia_proceso`) 
    VALUES ('".$idProceso."','".$tAislamiento."','".$tOperacion."','".$nMaquinas."','".$pRechazo."','".$nTurnos."','".$distancia."','".$disponibilidad."','".$mCorrectivo."','".$pMenores."','".$pMenores."')";
    return $this->db->consult($query);
    }
    else{
      $query="UPDATE `datos_proceso` SET `tiempo_aislamiento`='$tAislamiento',`tiempo_operacion`='$tOperacion',
      `numero_maquinas`='$nMaquinas',`porcentaje_rechazo`='$pRechazo',`numero_turnos`='$nTurnos',`distancia`='$distancia',
      `disponibilidad`='$disponibilidad',`mantenimiento_correctivo`='$mCorrectivo',`paradas_menores`='$pMenores',`eficiencia_proceso`='$pMenores' WHERE `fk_id_proceso` = '$idProceso' ";
    return $this->db->consult($query);
    }
  }
}
