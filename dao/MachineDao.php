<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once MODEL_PATH . "Machine.php";
/**
 * Esta clase Es el DAO(Data Access Object) para máquinas
 * 
 * @author Teenus SAS>
 * @version 1.0
 * @uses DBOperator, Machine
 * @package Dao
 * 
 */
class MachineDao
{

  /**
   * Objeto de comuniacion con la base de datos
   *
   * @access private
   * @var DBOperator
   */
  private $db;

  public function __construct()
  {
    $this->db = new DBOperator($_ENV["db_host"], $_ENV["db_user"], $_ENV["db_name"], $_ENV["db_pass"]);
  }

  /**
   * Encuentra la máquina por id
   *
   * @param integer $id El id de la máquina que se quiere consultar
   * @return Machine|null
   */
  public function findById($id)
  {
    $this->db->connect();
    $query = "SELECT * FROM `maquinas` WHERE `id_maquinas` = $id";
    $machineDB = $this->db->consult($query, "yes");
    if (count($machineDB) > 0) {
      $machineDB = $machineDB[0];
      $machine = new Machine();
      $machine->setId($machineDB["id_maquinas"]);
      $machine->setIdCompany($machineDB["empresas_id_empresa"]);
      $machine->setName($machineDB["nombre"]);
      $machine->setPrice($machineDB["precio"]);
      $machine->setDepreciation($machineDB["depreciacion_minuto"]);
      $machine->setYearsDepreciation($machineDB["years_depreciation"]);
      $machine->setResidualValue($machineDB["residual_value"]);
      $this->db->close();
      return $machine;
    } else {
      $this->db->close();
      return null;
    }
  }

  public function findByCompany($idCompany) {
    $this->db->connect();
    $query = "SELECT `id_maquinas` FROM `maquinas` WHERE `empresas_id_empresa` = '$idCompany'";
    $machinesDB = $this->db->consult($query, "yes");
    $machines = [];
    if ($machinesDB !== false) {
      foreach ($machinesDB as $machineDB) {
        array_push($machines, $this->findById($machineDB["id_maquinas"]));
      }
      return $machines;
    } else {
      return null;
    }
  }

  public function findOneByName($idCompany, $name) {
    $this->db->connect();
    $query = "SELECT `id_maquinas` FROM `maquinas` WHERE `empresas_id_empresa` = '$idCompany' AND `nombre` = '$name'";
    $machinesDB = $this->db->consult($query, "yes");
    if ($machinesDB !== false && count($machinesDB) > 0) {
      $machineDB = $machinesDB[0];
      return $this->findById($machineDB["id_maquinas"]);
    } else {
      return null;
    }
  }

  public function saveOrUpdate(Machine $machine) {
    $update = false;
    if ($this->findById($machine->getId()) || $this->findOneByName($machine->getIdCompany(), $machine->getName())) {
      $update = true;
      $this->update($machine);
    } else {
      $this->save($machine);
    }
    return $update;
  }

  public function save($machine) {
    $this->db->connect();
    $query = "INSERT INTO `maquinas` (`id_maquinas`, `empresas_id_empresa`, `nombre`,
    `precio`, `depreciacion_minuto`, `years_depreciation`,`residual_value`) VALUES (NULL, '" . $machine->getIdCompany() . "', '" . $machine->getName() . "',
    '" . $machine->getPrice() . "', '" . $machine->getDepreciation() . "','" . $machine->getYearsDepreciation() . "','" . $machine->getResidualValue() . "') 
    ON DUPLICATE KEY UPDATE `precio` = '" . $machine->getPrice() . "',
    `depreciacion_minuto` = '" . $machine->getDepreciation() . "' ,
    `years_depreciation` = '" . $machine->getYearsDepreciation() . "',
    `residual_value` ='" . $machine->getResidualValue() . "'";
    return  $this->db->consult($query);
  }

  public function update($machine)  {
    $this->db->connect();
    $query = "UPDATE `maquinas` SET `nombre` = '" . $machine->getName() . "', 
    `precio` = '" . $machine->getPrice() . "', 
    `depreciacion_minuto` = '" . $machine->getDepreciation() . "' , 
    `years_depreciation` = '" . $machine->getYearsDepreciation() . "', 
    `residual_value` = '" . $machine->getResidualValue() . "'
    WHERE `maquinas`.`id_maquinas` = '" . $machine->getId() . "'
    AND `maquinas`.`empresas_id_empresa` = '" . $machine->getIdCompany() . "'";
    return  $this->db->consult($query);
  }

  public function delete($id)  {
    $this->db->connect();
    $query = "DELETE FROM `maquinas` WHERE `maquinas`.`id_maquinas` = $id";
    return  $this->db->consult($query);
  }
}
