<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once MODEL_PATH . "Machine.php";
/**
 * Esta clase Es el DAO(Data Access Object) para la carga fabril de las máquinas
 * 
 * @author Teenus SAS>
 * @version 1.0
 * @uses DBOperator, Machine
 * @package Dao
 * 
 */

class CargaFabrilDao {
  /**
   * Objeto de comuniacion con la base de datos
   *
   * @access private
   * @var DBOperator
   */
  private $db;

  public function __construct() {
    $this->db = new DBOperator($_ENV["db_host"], $_ENV["db_user"], $_ENV["db_name"], $_ENV["db_pass"]);
  }


  /**
   * Encuentra las cargas de la compañía por id
   *
   * @param integer $id El id de la empresa que se quiere consultar
   * @return Machine|null
   */
  public function findById($id)
  { 
    $this->db->connect();
    $query = "SELECT * FROM `carga_fabril` WHERE `id_empresa` = $id";
    $cargaFabrilDB = $this->db->consult($query, "yes");
    if (count($cargaFabrilDB) > 0) {
      $cargaFabrilDB = $cargaFabrilDB[0];
      $cargaFabril = new CargaFabril();
      $cargaFabril->setId($cargaFabrilDB["id_carga"]);
      $cargaFabril->setIdMaquina($cargaFabrilDB["id_maquina"]);
      $cargaFabril->setIdEmpresa($cargaFabrilDB["id_empresa"]);
      $cargaFabril->setInsumo($cargaFabrilDB["insumo"]);
      $cargaFabril->setCosto($cargaFabrilDB["costo"]);
      $cargaFabril->setCostoPorMinuto($cargaFabrilDB["costo_por_minuto"]);
      $this->db->close();
      return $cargaFabril;
    } else {
      $this->db->close();
      return null;
    }
  }
  public function findByCompanyId($idCompany) {
            $this->db->connect();
            $query = "SELECT `id_carga` FROM `carga_fabril` WHERE `id_empresa` = '$idCompany'";
            $cargasDB = $this->db->consult($query, "yes");
            $cargas = [];
            if ($cargasDB !== false) {
                foreach ($cargasDB as $cargaDB) {
                    array_push($cargas, $this->findById($cargaDB["id_carga"]));
                }
                return $cargas;
            } else {
                    return null;
            }
    }

    /**
     * Crear o guardar una carga en la base de datos
     *
     * @param CargaFabril $carga Carga que se quiere guardar
     * @return integer número de tuplas afectadas 
     */
    public function save($carga)
    {
      $this->db->connect();
      $query = "INSERT INTO `carga_fabril` (`id_carga`, `id_maquina`, `id_empresa`, `insumo`,
      `costo`, `costo_por_minuto`) VALUES (NULL, '" . $carga->getIdMaquina() . "', '" . $carga->getIdEmpresa() . "',
      '" . $carga->getInsumo() . "', '" . $carga->getCosto() . "','" . $carga->getCostoPorMinuto() . "')";
      return  $this->db->consult($query);
    }
}