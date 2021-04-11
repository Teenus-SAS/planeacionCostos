<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once MODEL_PATH . "ServicioExterno.php";
/**
 * Esta clase Es el DAO(Data Access Object) para los servicios externos de los productos
 * 
 * @author Teenus SAS>
 * @version 1.0
 * @uses DBOperator, ServicioExterno
 * @package Dao
 * 
 */

class ServiciosExternosDao
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
   * Encuentra el servicio externo por id
   *
   * @param integer $id El id del servicio a consultar
   * @return ServicioExterno|null
   */
  public function findById($id)
  {
    $this->db->connect();
    $query = "SELECT servicios_externos.id_servicio, servicios_externos.nombre_servicio, servicios_externos.costo, servicios_externos.id_producto, productos.nombre, servicios_externos.id_empresa 
              FROM `servicios_externos` INNER JOIN productos ON servicios_externos.id_producto = productos.id_producto 
              WHERE `id_servicio` = $id";
    $serviciosExternosDB = $this->db->consult($query, "yes");
    if (count($serviciosExternosDB) > 0) {
      $serviciosExternosDB = $serviciosExternosDB[0];
      $servicio = new ServicioExterno();
      $servicio->setId($serviciosExternosDB["id_servicio"]);
      $servicio->setnombreServicio($serviciosExternosDB["nombre_servicio"]);
      $servicio->setCosto($serviciosExternosDB["costo"]);
      $servicio->setIdProducto($serviciosExternosDB["id_producto"]);
      $servicio->setnombreProducto($serviciosExternosDB["nombre"]);
      $servicio->setIdEmpresa($serviciosExternosDB["id_empresa"]);
      $this->db->close();
      return $servicio;
    } else {
      $this->db->close();
      return null;
    }
  }

  /**
   * Encuentra todas los servicios externos de una empresa
   *
   * @param integer $idCompany Id de la empresa
   * @return ServicioExterno[]|null
   */

  public function findByCompanyId($idCompany)
  {
    $this->db->connect();
    $query = "SELECT `id_servicio` FROM `servicios_externos` WHERE `id_empresa` = '$idCompany'";
    $serviciosDB = $this->db->consult($query, "yes");
    $servicios = [];
    if ($serviciosDB !== false) {
      foreach ($serviciosDB as $servicioDB) {
        array_push($servicios, $this->findById($servicioDB["id_servicio"]));
      }
      return $servicios;
    } else {
      return null;
    }
  }

  /**
   * Encuentra todos los servicios externos relacionadas a un producto
   *
   * @param integer $idProducto Id del producto
   * @return ServicioExterno[]|null
   */

  public function findByProductId($idProducto)
  {
    $this->db->connect();
    $query = "SELECT `id_servicio` FROM `servicios_externos` WHERE `id_producto` = '$idProducto'";
    $serviciosDB = $this->db->consult($query, "yes");
    $servicios = [];
    if ($serviciosDB !== false) {
      foreach ($serviciosDB as $servicioDB) {
        array_push($servicios, $this->findById($servicioDB["id_servicio"]));
      }
      return $servicios;
    } else {
      return null;
    }
  }

  /**
   * Crear o guardar un servicio en la base de datos
   *
   * @param ServicioExterno $servicio servicio que se quiere guardar
   * @return integer número de tuplas afectadas 
   */
  
  public function saveOrUpdate($servicio)
  {
    $this->db->connect();
    $query = "SELECT * FROM `servicios_externos`
              WHERE `id_servicio` = '" . $servicio->getId() . "' OR `nombre_servicio` = '" . $servicio->getnombreServicio() . "'";
    $serviciosDB = $this->db->consult($query, "yes");
    $update = false;

    if ($serviciosDB) {
      $servicioDB = $serviciosDB[0];
      $query = "UPDATE `servicios_externos` SET `costo` = '" . $servicio->getCosto() . "'                
      WHERE `id_servicio` = '" . $servicioDB['id_servicio'] . "' ";
      $update = true;
    } else {
      $query = "INSERT INTO `servicios_externos` (`id_servicio`, `nombre_servicio`, `costo`, `id_producto`, `id_empresa`)
                VALUES (NULL, '" . $servicio->getnombreServicio() . "', '" . $servicio->getCosto() . "', '" . $servicio->getIdProducto() . "', '" . $servicio->getIdEmpresa() . "')";
    }
    $this->db->consult($query);
    return $update;
  }

  /**
   * Borra el servicio externo de la base de datos
   *
   * @param integer $id Id del servicio externo que se desea eliminar
   * @return integer Número de tuplas afectadas
   */
  public function delete($id)
  {
    $this->db->connect();
    $query = "DELETE FROM `servicios_externos` WHERE `servicios_externos`.`id_servicio` = $id";
    return  $this->db->consult($query);
  }
}
