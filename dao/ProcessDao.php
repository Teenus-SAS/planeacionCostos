<?php


include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once MODEL_PATH . "Process.php";
require_once MODEL_PATH . "ProductProcess.php";
require_once DAO_PATH . "MachineDao.php";

/**
 * Esta clase Es el DAO(Data Access Object) para procesos
 * 
 * 
 * @author Teenus SAS <info@teenus.com.co>
 * @version 1.0
 * @uses DBOperator, MachineDao, Process, ProductProcess
 * @package Dao
 * 
 */
class ProcessDao
{

  /**
   * Objeto de comuniacion con la base de datos
   *
   * @access private
   * @var DBOperator
   */
  private $db;

  /**
   * inicialización de la comunicacion con la base de datos
   * y el dao para máquinas
   */
  public function __construct()
  {
    $this->db = new DBOperator($_ENV["db_host"], $_ENV["db_user"], $_ENV["db_name"], $_ENV["db_pass"]);
    $this->machineDao = new MachineDao();
  }

  /**
   * Buscar un proceso por id en la base de datos
   *
   * @param integer $id id del proceso
   * @return Process
   */
  public function findById($id)
  {
    $this->db->connect();
    $query = "SELECT * FROM `procesos` WHERE `id_procesos` = $id";
    $processDB = $this->db->consult($query, "yes");
    $processDB = $processDB[0];
    $process = new Process();
    $process->setId($processDB["id_procesos"]);
    $process->setName($processDB["nombre"]);
    $process->setIdCompany($processDB["empresas_id_empresa"]);
    $this->db->close();
    return $process;
  }

  /**
   * Encontrar un proceso de un producto por id 
   *
   * @param integer $id id del proceso de un producto que se desa buscar
   * @return ProductProcess
   */
  public function findProductProcessById($id)
  {
    $this->db->connect();
    $query = "SELECT * FROM `tiempo_proceso` WHERE `id_tiempo_proceso` = $id";
    $productProcessDB = $this->db->consult($query, "yes");

    $productProcessDB = $productProcessDB[0];
    $productProcess = new ProductProcess();
    $productProcess->setId($productProcessDB["id_tiempo_proceso"]);
    $productProcess->setIdProduct($productProcessDB["productos_id_producto"]);
    $productProcess->setIdCompany($productProcessDB["productos_empresas_id_empresa"]);
    $productProcess->setMachine($this->machineDao->findById($productProcessDB["maquinas_id_maquinas"]));
    $productProcess->setTimeProcess($productProcessDB["tiempo_proceso"]);
    $productProcess->setProcess($this->findById($productProcessDB["procesos_id_procesos"]));

    /* $this->db->close(); */
    return $productProcess;
  }

  /**
   * Retorna todos los procesos asignados a un producto
   *
   * @param Product $product objeto producto
   * @return ProductProcess[]|null
   */
  public function findProductProcessesByProduct($product)
  {
    $this->db->connect();
    $query = "SELECT `id_tiempo_proceso` FROM `tiempo_proceso` WHERE `productos_id_producto` = " . $product->getId();
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

  /**
   * Guarda o actualiza un proceso de un producto
   *
   * @param Product $product producto al que se quiere actualizar o dar nuevos proceso
   * @param integer $idMachine id de la maquina que se desea asignar
   * @param integer $idProcess id del proceso que se desea asignar
   * @param double $timeProcess tiempo que lleva este proceso en el producto
   * @return mixed un objeto con el numero de tuplas afectadas 
   * y un mensaje si fue actualizaado o creado el proceso del producto
   */
  public function saveOrUpdateProductProcess($product, $idMachine, $idProcess, $timeProcess)
  {

    $productProcess = $this->findOneProductProcessByProduct($product, $idProcess);
    if ($productProcess == null) {
      $this->db->connect();
      $query = "INSERT INTO `tiempo_proceso` (`id_tiempo_proceso`, `productos_id_producto`,
      `productos_empresas_id_empresa`, `procesos_id_procesos`, `maquinas_id_maquinas`, `tiempo_proceso`) 
      VALUES (NULL, '" . $product->getId() . "', '" . $product->getIdCompany() . "', '$idProcess', $idMachine, '$timeProcess')";
      $reponse = new stdClass();
      $reponse->status = $this->db->consult($query);
      $reponse->mode = "created";
      return $reponse;
    } else {
      $this->db->connect();
      $query = "UPDATE `tiempo_proceso` SET `tiempo_proceso` = '$timeProcess', `maquinas_id_maquinas` = $idMachine WHERE `tiempo_proceso`.`id_tiempo_proceso` = " . $productProcess->getId();
      $reponse = new stdClass();
      $reponse->status = $this->db->consult($query);
      $reponse->mode = "updated";
      return $reponse;
    }
  }


  /**
   * Encuentra un proceso de un producto
   *
   * @param Product $product producto en el cual se quiere buscar
   * @param integer $idProcess id del proceso que se quiere buscar
   * @return ProductProcess|null El proceso del producto que se busca
   */
  public function findOneProductProcessByProduct($product, $idProcess)
  {
    $this->db->connect();
    $query = "SELECT `id_tiempo_proceso` FROM `tiempo_proceso` WHERE `productos_id_producto` = " . $product->getId() . " AND `procesos_id_procesos` = $idProcess";
    $id = $this->db->consult($query, "yes");
    if (count($id) > 0) {
      $id = $id[0]["id_tiempo_proceso"];
      return $this->findProductProcessById($id);
    } else {
      return null;
    }
  }

  /**
   * Encuentra todos los procesos creados por una empresa
   *
   * @param integer $idCompany id de la empresa 
   * @return Process[]|null listado de procesos de la empresa
   */
  public function findByCompany($idCompany)
  {
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

  /**
   * Crea un proceso en la base de datos
   *
   * @param Process $process proceso que se desea crear
   * @return integer número de tuplas afectadas
   */
  public function save($process)
  {
    $this->db->connect();
    $query = "INSERT INTO `procesos` (`id_procesos`, `nombre`, `empresas_id_empresa`)
     VALUES (NULL, '" . $process->getName() . "', '" . $process->getIdCompany() . "')";
    return $this->db->consult($query);
  }

  /**
   * Actualiza un proceso en al base de datos
   *
   * @param Process $process proceso qeu se quiere actualizar
   * @return integer número de tuplas afectadas
   */
  public function update($process)
  {
    $this->db->connect();
    $query = "UPDATE `procesos` SET `nombre` = '" . $process->getName() . "' 
    WHERE `procesos`.`id_procesos` = " . $process->getId();
    return $this->db->consult($query);
  }

  /**
   * borra un proceso de la base de datos por su id
   *
   * @param integer $id id del proceso que se desea borrar
   * @return integer número de tuplas afectadas
   */
  public function delete($id)
  {
    $this->db->connect();
    $query = "DELETE FROM `procesos` WHERE `procesos`.`id_procesos` = $id";
    return $this->db->consult($query);
  }

  /**
   * borra un proceso de un producto por su id
   *
   * @param integer $id id del proceso del producto que se desea borrar
   * @return integer número de tuplas afectadas
   */
  public function deleteProductProcess($id)
  {
    $this->db->connect();
    $query = "DELETE FROM `tiempo_proceso` WHERE `tiempo_proceso`.`id_tiempo_proceso` = $id";
    return $this->db->consult($query);
  }

  /**
   * Funcion creada por EstebanGomezR
   * Busca los datos de un proceso
   * 
   * 
   */
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
  /**
   * Funcion creada por EstebanGomezR
   * agrega los datos de un proceso a la base de datos
   * 
   * 
   */
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
