<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once MODEL_PATH . "OpcionesEmpresa.php";
/**
 * Esta clase Es el DAO(Data Access Object) para las opciones de la empresa
 * 
 * @author Teenus SAS>
 * @version 1.0
 * @uses DBOperator, OpcionesEmpresa
 * @package Dao
 * 
 */

class OpcionesEmpresaDao
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
   * Encuentra las opciones de una empresa
   *
   * @param integer $idCompany Id de la empresa
   * @return OpcionesEmpresa|null
   */

  public function findByCompanyId($idCompany)
  {
    $this->db->connect();
    $query = "SELECT * FROM `opciones_empresa` WHERE `id_empresa` = '$idCompany'";
    $opcionesDB = $this->db->consult($query, "yes");
    if ($opcionesDB !== false) {
      $opcionDB = $opcionesDB[0];
      $opcionesEmpresa = new OpcionesEmpresa();
      $opcionesEmpresa->setIdEmpresa($opcionDB['id_empresa']);
      $opcionesEmpresa->setTipoDistribucion($opcionDB['tipo_distribucion']);
      return $opcionesEmpresa;
    } else {
      return null;
    }
  }

  /**
   * Crear o guardar opciones empresa en la base de datos
   *
   * @param OpcionesEmpresa $opciones Opciones que se quieren guardar
   * @return integer número de tuplas afectadas 
   */
  
  public function saveOrUpdate($opciones)
  {
    $update = false;
    $this->db->connect();
    $query = "SELECT * FROM `opciones_empresa`
              WHERE `id_empresa` = '" . $opciones->getIdEmpresa() . "' ";
    $opcionesDB = $this->db->consult($query, "yes");

    if ($opcionesDB) {
      $query = "UPDATE `opciones_empresa` SET `tipo_distribucion`='" . $opciones->getTipoDistribucion() . "' 
                WHERE `id_empresa` = '" . $opciones->getIdEmpresa() . "' ";
                $update = true;
    } else {
      $query = "INSERT INTO `opciones_empresa` (`id_empresa`, `tipo_distribucion`) 
                VALUES ('" . $opciones->getIdEmpresa() . "', '" . $opciones->getTipoDistribucion() . "')";
    }
    $this->db->consult($query);
    return $update;
  }

  /**
   * Borra la carga Fabril de la base de datos
   *
   * @param integer $id Id de la carga Fabril que se desea eliminar
   * @return integer Número de tuplas afectadas
   */
  public function delete($id)
  {
    $this->db->connect();
    $query = "DELETE FROM `opciones_empresa` WHERE `opciones_empresa`.`id_empresa` = $id";
    return  $this->db->consult($query);
  }
}
