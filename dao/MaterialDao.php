<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once MODEL_PATH . "Material.php";

/**
 *  Esta clase Es el DAO(Data Access Object) para materia prima
 * @author Teenus SAS>
 * @version 1.0
 * @uses DBOperator, Material
 * @package Dao
 * 
 */
class MaterialDao
{

  /**
   * Objeto de comunicacion con la base de datos
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
   * Encuentra un material por su id
   *
   * @param integer $id id del material que se desea buscar
   * @return Material material que se buscaba
   * @access public
   */
  public function findById($id)
  {
    $this->db->connect();
    $query = "SELECT * FROM `materiales` WHERE `id_materiales` = '$id'";
    $materialDB = $this->db->consult($query, "yes");
    $materialDB = $materialDB[0];
    $material = new Material();
    $material->setId($materialDB["id_materiales"]);
    $material->setIdCompany($materialDB["empresas_id_empresa"]);
    $material->setReferencia($materialDB["referencia"]);
    $material->setDescription($materialDB["descripcion"]);
    $material->setUnit($materialDB["unidad"]);
    $material->setCost($materialDB["costo"]);
    $this->db->close();
    return $material;
  }
  /**
   * Encuentra un material por su nombre
   *
   * @access public
   * @param string $name nombre del material 
   * @param integer $idCompany id de la conmpañia donde se quiere buscar el material
   * @return Material|null material que se buscaba
   */
  public function findByName($name, $idCompany)
  {
    $this->db->connect();
    $query = "SELECT `id_materiales` FROM `materiales` WHERE `descripcion` = '$name' AND `empresas_id_empresa` = $idCompany";
    $id = $this->db->consult($query, "yes");
    if (count($id) > 0) {
      return $this->findById($id[0]["id_materiales"]);
    } else {
      return null;
    }
  }

  /**
   * Buscar todos los materiales de una empresa
   *
   * @param integer $idCompany id de la empresa
   * @return Material[]|null listado de materiales de la empresa
   */
  public function findByCompany($idCompany)
  {
    $this->db->connect();
    $query = "SELECT `id_materiales` FROM `materiales` WHERE `empresas_id_empresa` = '$idCompany'";
    $materialsDB = $this->db->consult($query, "yes");
    $materials = [];
    if ($materialsDB !== false) {
      foreach ($materialsDB as $materialDB) {
        array_push($materials, $this->findById($materialDB["id_materiales"]));
      }
      return $materials;
    } else {
      return null;
    }
  }



  /**
   * Crea un material en la base de datos
   *
   * @param Material $material material que se desea guardar
   * @return integer numero de tuplas afectadas en la base de datos
   */
  public function save($material)
  {
    $this->db->connect();
    $query = "INSERT INTO `materiales` (`id_materiales`, `empresas_id_empresa`, `referencia`, `descripcion`, `unidad`, `costo`) 
              VALUES (NULL, '" . $material->getIdCompany() . "', '" . $material->getReferencia() . "', '" . $material->getDescription() . "', '" . $material->getUnit() . "', '" . $material->getCost() . "') 
              ON DUPLICATE KEY UPDATE `referencia` = '" . $material->getReferencia() . "',`costo` = '" . $material->getCost() . "', `unidad` = '" . $material->getUnit() . "'";
    return $this->db->consult($query);
  }

  /**
   * Actuliza un material en la base de datos
   *
   * @param Material $material material que se desea actualizar
   * @return integer numero de tuplas afectadas en la base de datos
   */
  public function update($material)
  {
    $this->db->connect();
    $query = "UPDATE `materiales` SET `unidad` = '" . $material->getUnit() . "', `costo` = '" . $material->getCost() . "' , `referencia` = '" . $material->getReferencia() . "' , `descripcion` = '" . $material->getDescription() . "' WHERE `materiales`.`id_materiales` = " . $material->getId() . " AND `materiales`.`empresas_id_empresa` = " . $material->getIdCompany();
    return $this->db->consult($query);
  }

  /**
   * Borra un material por id de la base de datos
   *
   * @param integer $id id del material que se desea eliminar 
   * @return integer numero de tuplas afectadas en la base de datos
   */
  public function delete($id)
  {
    $this->db->connect();
    $query = "DELETE FROM `materiales` WHERE `materiales`.`id_materiales` = $id";
    return $this->db->consult($query);
  }
}
