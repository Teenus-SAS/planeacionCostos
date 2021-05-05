<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once MODEL_PATH . "ReporteCosteoProcesos.php";

class ReporteCosteoProcesosDao {
  private $db;

  public function __construct() {
    $this->db = new DBOperator($_ENV["db_host"], $_ENV["db_user"], $_ENV["db_name"], $_ENV["db_pass"]);
  }

  public function findByConsecutivo($consecutivo) {
    $this->db->connect();
    $query = "SELECT * FROM `reportes_productos_procesos` WHERE `consecutivo_reporte` = $consecutivo";
    $reportesDB = $this->db->consult($query, "yes");
    $reportesDB = $reportesDB[0];
    $reporteCosteoProcesos = new ReporteCosteoProcesos();
    $reporteCosteoProcesos->setConsecutivo($reportesDB["consecutivo_reporte"]);
    $reporteCosteoProcesos->setIdCompany($reportesDB["id_empresa"]);
    $reporteCosteoProcesos->setCreationDate($reportesDB["reporte_creation_date"]);
    $reporteCosteoProcesos->setCiudad($reportesDB["ciudad_reporte"]);
    $reporteCosteoProcesos->setCliente($reportesDB['cliente_reporte']);
    $reporteCosteoProcesos->setIdProducto($reportesDB['id_producto']);
    $reporteCosteoProcesos->setCantidad($reportesDB['cantidad']);
    $this->db->close();
    return $reporteCosteoProcesos;
  }

  public function findByCompany($id) {
    $this->db->connect();
    $query = "SELECT `consecutivo_reporte` FROM `reportes_productos_procesos` WHERE `id_empresa` = $id";
    $reportesDB = $this->db->consult($query, "yes");
    $reportes = [];
    if ($reportesDB !== false) {
      foreach ($reportesDB as $reporteDB) {
        array_push($reportes, $this->findByConsecutivo($reporteDB["consecutivo_reporte"]));
      }
      return $reportes;
    } else {
      return null;
    }
  }

  public function save(ReporteCosteoProcesos $reporte) {
    $saved = false;
    $this->db->connect();
    $query = "SELECT * FROM `reportes_productos_procesos`
              WHERE `id_reporte` = '" . $reporte->getId() . "'
              OR `consecutivo_reporte` = '" . $reporte->getConsecutivo() . "'";
    $reporteDB = $this->db->consult($query, "yes");

    if ($reporteDB) {
     /* $query = "UPDATE `reportes_productos_procesos` SET `consecutivo_reporte`='" . $reporte->getConsecutivo() . "', `ciudad_reporte`='" . $reporte->getCiudad() . "', `rentabilidad`='" . $reporte->getCliente() . "'  
                WHERE `id_reporte` = '" . $reporteDB[0]['id_producto'] . "' ";
                */
    } else {
      $saved = true;
      $query = "INSERT INTO `reportes_productos_procesos` (`id_reporte`, `id_empresa`, `consecutivo_reporte`, `ciudad_reporte`, `cliente_reporte`, `id_producto`, `cantidad`, `reporte_creation_date`) 
                VALUES (NULL, '" . $reporte->getIdCompany() . "', '" . $reporte->getConsecutivo() . "', '" . $reporte->getCiudad() . "', '" . $reporte->getCliente() . "', '" . $reporte->getIdProducto() . "', '" . $reporte->getCantidad() . "', '" . $reporte->getCreationDate() . "')";
    }
    $this->db->consult($query);
    return $saved;
  }

  public function delete($id) {
    $this->db->connect();
    
    $query = "DELETE FROM `reportes_productos_procesos` WHERE `reportes_productos_procesos`.`id_reporte` = $id";
    $this->db->consult($query);
    $query = "DELETE FROM `gastos_mensuales` WHERE `gastos_mensuales`.`productos_id_producto` = $id";
    $this->db->consult($query);

    return true;
  }
}
