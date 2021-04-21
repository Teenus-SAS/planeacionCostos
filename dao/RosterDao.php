<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once MODEL_PATH . "Roster.php";
require_once DAO_PATH . "ProcessDao.php";

class RosterDao {
  private $db;

  public function __construct() {
    $this->db = new DBOperator($_ENV["db_host"], $_ENV["db_user"], $_ENV["db_name"], $_ENV["db_pass"]);
    $this->processDao = new ProcessDao();
  }

  public function findById($id) {
    $this->db->connect();
    $query = "SELECT * FROM `nominas` WHERE `id_nominas` = $id";
    $rosterDB = $this->db->consult($query, "yes");
    if (!$rosterDB || count($rosterDB) == 0) {
      return null;
    }
    $rosterDB = $rosterDB[0];
    $roster = new Roster();
    $roster->setId($rosterDB["id_nominas"]);
    $roster->setIdCompany($rosterDB["empresas_id_empresa"]);
    $roster->setProcess($this->processDao->findById($rosterDB["procesos_id_procesos"]));
    $roster->setPosition($rosterDB["cargo"]);
    $roster->setNumberEmployees($rosterDB["n_empleados"]);
    $roster->setSalary($rosterDB["salario"]);
    $roster->setTransporte($rosterDB["transporte"]);
    $roster->setBonus($rosterDB["bonificacion"]);
    $roster->setEndowment($rosterDB["dotacion"]);
    $roster->setWorkHours($rosterDB["horas_dia"]);
    $roster->setBussinesDaysMonth($rosterDB["dias_trabajo_mes"]);
    $roster->setPerformaceFactor($rosterDB["factor_prestacional"]);
    $roster->setNetSalary($rosterDB["salario_neto"]);
    $roster->setContract($rosterDB["contrato"]);
    $roster->setExtraHours($rosterDB["horas_extra"]);
    $this->db->close();
    return $roster;
  }

  public function findByProcess($process) {
    $this->db->connect();
    $query = "SELECT `id_nominas` FROM `nominas` WHERE `procesos_id_procesos` = " . $process->getId();
    $rosterDB = $this->db->consult($query, "yes");
    if (count($rosterDB) > 0) {
      $rosterDB = $rosterDB[0];
      return $this->findById($rosterDB["id_nominas"]);
    } else {
      return null;
    }
  }

  public function findByProcessId($processId) {
    $this->db->connect();
    $query = "SELECT `id_nominas` FROM `nominas` WHERE `procesos_id_procesos` = " . $processId;
    $rosterDB = $this->db->consult($query, "yes");
    if (count($rosterDB) > 0) {
      $rosterDB = $rosterDB[0];
      return $this->findById($rosterDB["id_nominas"]);
    } else {
      return null;
    }
  }

  public function findByCompany($idCompany) {
    $this->db->connect();
    $query = "SELECT `id_nominas` FROM `nominas` WHERE `empresas_id_empresa` = $idCompany";
    $rostersDB = $this->db->consult($query, "yes");
    if ($rostersDB !== false) {
      $rosters = [];
      foreach ($rostersDB as $rosterDB) {
        array_push($rosters, $this->findById($rosterDB["id_nominas"]));
      }
      return $rosters;
    } else {
      return null;
    }
  }

  public function findId($roster) {
    $this->db->connect();
    $query = "SELECT * FROM `nominas` WHERE `empresas_id_empresa` = '" . $roster->getIdCompany() . "' 
    AND `cargo` = '" . $roster->getPosition() . "' 
    AND `procesos_id_procesos` = '" . $roster->getProcess()->getId() . "'";
    $id = $this->db->consult($query, "yes");
    if (count($id) > 0) {
      return $id[0]['id_nominas'];
    } else {
      return null;
    }
  }

  public function save($roster) {
    $this->db->connect();
    $query = "INSERT INTO `nominas` (`id_nominas`, `empresas_id_empresa`, `cargo`,
      `procesos_id_procesos`, `n_empleados`, `salario`, `transporte`,`bonificacion`, `dotacion`,
      `dias_trabajo_mes`, `horas_dia`, `factor_prestacional`, `salario_neto`,`contrato`,`horas_extra`) 
    VALUES (NULL, '" . $roster->getIdCompany() . "', '" . $roster->getPosition() . "',
      '" . $roster->getProcess()->getId() . "', '" . $roster->getNumberEmployees() . "',
      '" . $roster->getSalary() . "', '" . $roster->getTransporte() . "','" . $roster->getBonus() . "',
      '" . $roster->getEndowment() . "', '" . $roster->getBussinesDaysMonth() . "',
      '" . $roster->getWorkHours() . "', '" . $roster->getPerformaceFactor() . "',
      '" . $roster->getNetSalary() . "', '" . $roster->getContract() . "','" . $roster->getExtraHours() . "')";
    return $this->db->consult($query);
  }

  public function update($roster) {
    $this->db->connect();
    $query = "UPDATE `nominas` 
            SET `cargo` = '" . $roster->getPosition() . "',
            `procesos_id_procesos` = '" . $roster->getProcess()->getId() . "',
            `n_empleados` = '" . $roster->getNumberEmployees() . "', 
            `salario` = '" . $roster->getSalary() . "',
            `transporte` = '" . $roster->getTransporte() . "',
            `bonificacion` = '" . $roster->getBonus() . "', 
            `dotacion` = '" . $roster->getEndowment() . "',
            `dias_trabajo_mes` = '" . $roster->getBussinesDaysMonth() . "',
            `horas_dia` = '" . $roster->getWorkHours() . "',
            `factor_prestacional` = '" . $roster->getPerformaceFactor() . "',
            `salario_neto` = '" . $roster->getNetSalary() . "',
            `contrato` = '" . $roster->getContract() . "', `horas_extra` = '" . $roster->getExtraHours() . "'
            WHERE `nominas`.`id_nominas` = " . $roster->getId();
    return $this->db->consult($query);
  }

  public function delete($id) {
    $this->db->connect();
    $query = "DELETE FROM `nominas` WHERE `nominas`.`id_nominas` = $id";
    return $this->db->consult($query);
  }
}
