<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once MODEL_PATH . "DistribucionDirecta.php";
/**
 * Esta clase Es el DAO(Data Access Object) para ditribución directa
 * 
 * @author Teenus SAS>
 * @version 1.0
 * @uses DBOperator
 * @package Dao
 * 
 */
class DistribucionDirectaDao
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
   * @param integer $id El id de la distribución directa que se quiere consultar
   * @return DistribucionDirecta|null
   */
  public function findById($id)
  {
    $this->db->connect();
    $query = "SELECT * FROM `distribucion_directa` WHERE `id_distribucion` = $id";
    $distribucionDirectaDB = $this->db->consult($query, "yes");
    if (count($distribucionDirectaDB) > 0) {
      $distribucionDirectaDB = $distribucionDirectaDB[0];
      $ditribucion = new DistribucionDirecta();
      $ditribucion->setId($distribucionDirectaDB["id_distribucion"]);
      $ditribucion->setIdProceso($distribucionDirectaDB["id_proceso"]);
      $ditribucion->setIdEmpresa($distribucionDirectaDB["id_empresa"]);
      $ditribucion->setPorcentaje($distribucionDirectaDB["porcentaje"]);
      $ditribucion->setValorProceso($distribucionDirectaDB["valor_proceso"]);
      $ditribucion->setValorMinuto($distribucionDirectaDB["valor_minuto"]);
      $ditribucion->setValorAsignado($distribucionDirectaDB["valor_asignado"]);
      $this->db->close();
      return $ditribucion;
    } else {
      $this->db->close();
      return null;
    }
  }

  /**
   * Encuentra todas las distribuciones directas de una empresa
   *
   * @param integer $idCompany Id de la empresa
   * @return DistribucionDirecta[]|null
   */
  public function findByCompany($idCompany)
  {
    $this->db->connect();
    $query = "SELECT `id_distribucion` FROM `distribucion_directa` WHERE `id_empresa` = '$idCompany'";
    $ditribucionesDB = $this->db->consult($query, "yes");
    $ditribuciones = [];
    if ($ditribucionesDB !== false) {
      foreach ($ditribucionesDB as $distribucionDirectaDB) {
        array_push($ditribuciones, $this->findById($distribucionDirectaDB["id_distribucion"]));
      }
      return $ditribuciones;
    } else {
      return null;
    }
  }

  /**
   * Crear o guardar una distribucion en la base de datos
   *
   * @param DistribucionDirecta $ditribucion Distribución que se quiere guardar
   * @return integer número de tuplas afectadas 
   */
  public function save($ditribucion)
  {
    $this->db->connect();
    $query = "INSERT INTO `distribucion_directa` (`id_distribucion`, `id_proceso`, `id_empresa`, `porcentaje`,
    `valor_proceso`, `valor_minuto`,`valor_asignado`) VALUES (NULL, '" . $ditribucion->getIdProceso() . "', '" . $ditribucion->getIdEmpresa() . "', '" . $ditribucion->getPorcentaje() . "',
    '" . $ditribucion->getValorProceso() . "', '" . $ditribucion->getValorMinuto() . "','" . $ditribucion->getValorAsignado() . "') 
    ON DUPLICATE KEY UPDATE `porcentaje` = '" . $ditribucion->getPorcentaje() . "',
    `valor_minuto` = '" . $ditribucion->getValorMinuto() . "' ,
    `valor_proceso` = '" . $ditribucion->getValorProceso() . "',
    `valor_asignado` ='" . $ditribucion->getValorAsignado() . "'";
    return  $this->db->consult($query);
  }

  /**
   * Actualiza la información de una distriución
   *
   * @param DistribucionDirecta $ditribucion  que se desea actualizar
   * @return Integer Número de tuplas que se afectaron
   */
  public function update($ditribucion)
  {
    $this->db->connect();
    $query = "UPDATE `distribucion_directa` SET `porcentaje` = '" . $ditribucion->getPorcentaje() . "', 
    `valor_proceso` = '" . $ditribucion->getValorProceso() . "', 
    `valor_minuto` = '" . $ditribucion->getValorMinuto() . "' , 
    `valor_asignado` = '" . $ditribucion->getValorAsignado() . "'
    WHERE `distribucion_directa`.`id_distribucion` = " . $ditribucion->getId() . "
    AND `distribucion_directa`.`id_empresa` = " . $ditribucion->getIdEmpresa();
    return  $this->db->consult($query);
  }

  /**
   * Borra una distribución de la base de datos
   *
   * @param integer $id Id de la distribución que se desea eliminar
   * @return integer Número de tuplas afectadas
   */
  public function delete($id)
  {
    $this->db->connect();
    $query = "DELETE FROM `distribucion_directa` WHERE `distribucion_directa`.`id_distribucion` = $id";
    return  $this->db->consult($query);
  }
}
