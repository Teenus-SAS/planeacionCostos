<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once MODEL_PATH . "Product.php";
require_once MODEL_PATH . "ProductRawMaterial.php";
require_once DAO_PATH . "MaterialDao.php";
require_once DAO_PATH . "CompanyDao.php";
require_once DAO_PATH . "ProcessDao.php";
require_once DAO_PATH . "ServiciosExternosDao.php";
require_once MODEL_PATH . "MonthlyExpenses.php";
class ProductDao {
  private $db;

  public function __construct() {
    $this->db = new DBOperator($_ENV["db_host"], $_ENV["db_user"], $_ENV["db_name"], $_ENV["db_pass"]);
    $this->materialDao = new MaterialDao();
    $this->processDao = new ProcessDao();
    $this->companyDao = new CompanyDao();
    $this->serviciosExternosDao = new ServiciosExternosDao();
  }

  public function findById($id, $expenses = false, $processes = false, $materials = false) {
    $this->db->connect();
    $query1 = "SELECT * FROM `productos` LEFT JOIN `gastos_mensuales` ON `productos`.`id_producto` = `gastos_mensuales`.`productos_id_producto` WHERE `productos`.`id_producto` = $id";
    $productDB = $this->db->consult($query1, "yes");
    $productDB = $productDB[0];
    $product = new Product();
    $query2 = "SELECT SUM(`unidades_vendidas`) AS total_unidades_vendidas, SUM(`volumen_ventas`) AS total_volumen_ventas FROM `gastos_mensuales` WHERE `productos_empresas_id_empresa` = " . $productDB["empresas_id_empresa"];
    $totalExpenses = $this->db->consult($query2, "yes");
    $totalExpenses = $totalExpenses[0];
    $product->setId($productDB["id_producto"]);
    $product->setIdCompany($productDB["empresas_id_empresa"]);
    $product->setName($productDB["nombre"]);
    $product->setRef($productDB["ref"]);
    $product->setRentabilidad($productDB['rentabilidad']);
    if ($materials) {
      $product->setMaterials($this->findRawMaterialsByProduct($product));
    }
    if ($processes) {
      $product->setProcesses($this->processDao->findProductProcessesByProduct($product));
    }
    if ($expenses) {
      $product->setExpenses(new MonthlyExpenses(
        $productDB["id_gastos_mensuales"],
        $productDB["unidades_vendidas"],
        $productDB["volumen_ventas"],
        $totalExpenses["total_unidades_vendidas"],
        $totalExpenses["total_volumen_ventas"],
        $this->companyDao->findById($product->getIdCompany())->getTotalMonthExpenses()
      ));
    }
    $this->db->close();
    return $product;
  }

  public function findByRef($ref, $idCompany, $expenses = false, $processes = false, $materials = false) {
    $this->db->connect();
    $query = "SELECT `id_producto` FROM `productos` WHERE `ref` = '$ref' AND `empresas_id_empresa` = $idCompany";
    $id = $this->db->consult($query, "yes");
    if (count($id) > 0) {
      return $this->findById($id[0]["id_producto"], $expenses, $processes, $materials);
    } else {
      return null;
    }
  }

  public function findRawMaterialsByProduct($product) {
    $this->db->connect();
    $query = "SELECT * FROM `materiales_has_productos` WHERE `productos_id_producto` = " . $product->getId();
    $productRawMaterialsDB = $this->db->consult($query, "yes");
    $productRawMaterials = [];
    if ($productRawMaterialsDB !== false) {
      foreach ($productRawMaterialsDB as $productRawMaterialDB) {
        $productRawMaterial = new ProductRawMaterial();
        $productRawMaterial->setId($productRawMaterialDB["materiales_has_productos_id"]);
        $productRawMaterial->setIdCompany($product->getIdCompany());
        $productRawMaterial->setMaterial($this->materialDao->findById($productRawMaterialDB["materiales_id_materiales"]));
        $productRawMaterial->setQuantity($productRawMaterialDB["cantidad"]);
        $productRawMaterial->setIdPorduct($product->getId());
        array_push($productRawMaterials, $productRawMaterial);
      }
      return $productRawMaterials;
    } else {
      return null;
    }
  }

  public function deleteRawMaterialsByProduct($product) {
    $this->db->connect();
    $query = "DELETE FROM `materiales_has_productos` WHERE `productos_id_producto` = '" . $product->getId() . "'";
    return $this->db->consult($query);
  }

  public function findByCompany($id, $expenses = false, $processes = false, $materials = false)
  {
    $this->db->connect();
    $query = "SELECT `id_producto` FROM `productos` WHERE `empresas_id_empresa` = $id";
    $productsDB = $this->db->consult($query, "yes");
    $products = [];
    if ($productsDB !== false) {
      foreach ($productsDB as $productDB) {
        array_push($products, $this->findById($productDB["id_producto"], $expenses, $processes, $materials));
      }
      return $products;
    } else {
      return null;
    }
  }

  public function findNumberProductsByCompany($idCompany) {
    $this->db->connect();
    $query = "SELECT count(*) as n_productos FROM `productos` WHERE `empresas_id_empresa` = $idCompany";
    $count = $this->db->consult($query, "yes");
    $this->db->close();
    return $count[0]["n_productos"];
  }

  public function save($product) {
    $this->db->connect();
    $query = "INSERT INTO `productos` (`id_producto`, `empresas_id_empresa`, `ref`, `nombre`, `rentabilidad`) 
              VALUES (NULL, '" . $product->getIdCompany() . "', '" . $product->getRef() . "', '" . $product->getName() . "','" . $product->getRentabilidad() . "') 
              ON DUPLICATE KEY UPDATE `rentabilidad` = '" . $product->getRentabilidad() . "',`nombre` = '" . $product->getName() . "'";

    return $this->db->consult($query);
  }

  public function saveOrUpdate(Product $product) {
    $update = false;
    $this->db->connect();
    $query = "SELECT * FROM `productos`
              WHERE `id_producto` = '" . $product->getId() . "'
              OR `ref` = '" . $product->getRef() . "'";
    $productDB = $this->db->consult($query, "yes");

    if ($productDB) {
      $query = "UPDATE `productos` SET `ref`='" . $product->getRef() . "', `nombre`='" . $product->getName() . "', `rentabilidad`='" . $product->getRentabilidad() . "'  
                WHERE `id_producto` = '" . $productDB[0]['id_producto'] . "' ";
                $update = true;
    } else {
      $query = "INSERT INTO `productos` (`id_producto`, `empresas_id_empresa`, `ref`, `nombre`, `rentabilidad`) 
                VALUES (NULL, '" . $product->getIdCompany() . "', '" . $product->getRef() . "', '" . $product->getName() . "', '" . $product->getRentabilidad() . "')";
    }
    $this->db->consult($query);
    return $update;
  }

  public function update($product) {
    $this->db->connect();
    $query = "UPDATE `productos` SET `ref` = '" . $product->getRef() . "', `nombre` = '" . $product->getName() . "', `rentabilidad` = '" . $product->getRentabilidad() . "' WHERE `productos`.`id_producto` = " . $product->getId();
    $this->db->consult($query);
    return true;
  }

  public function delete($id) {
    $this->db->connect();
    $product = $this->findById($id, true, true, true);
    $this->deleteExpensesByProduct($product);
    $this->deleteLinesByProduct($product);
    $this->deleteRawMaterialsByProduct($product);
    $this->serviciosExternosDao->deleteByProduct($product->getId());
    $this->processDao->deleteProductProcessByProduct($product->getId());
    
    $query = "DELETE FROM `productos` WHERE `productos`.`id_producto` = $id";
    $this->db->consult($query);

    return true;
  }

  public function deleteRawMaterial($id) {
    $this->db->connect();
    $query = "DELETE FROM `materiales_has_productos` WHERE `materiales_has_productos`.`materiales_has_productos_id` = $id";
    return $this->db->consult($query);
  }

  public function findOneRawMaterialByProduct($product, $idMaterial) {
    $this->db->connect();
    if (!$product) {
      return null;
    }
    $query = "SELECT * FROM `materiales_has_productos` WHERE `productos_id_producto` = " . $product->getId() . " AND `materiales_id_materiales` = $idMaterial";
    $productRawMaterialDB = $this->db->consult($query, "yes");
    if (count($productRawMaterialDB) > 0) {
      $productRawMaterialDB = $productRawMaterialDB[0];
      $productRawMaterial = new ProductRawMaterial();
      $productRawMaterial->setId($productRawMaterialDB["materiales_has_productos_id"]);
      $productRawMaterial->setIdPorduct($product->getId());
      $productRawMaterial->setIdCompany($product->getIdCompany());
      $productRawMaterial->setMaterial($this->materialDao->findById($productRawMaterialDB["materiales_id_materiales"]));
      $productRawMaterial->setQuantity($productRawMaterialDB["cantidad"]);
      return $productRawMaterial;
    } else {
      return null;
    }
  }

  public function saveOrUpdateRawMaterial($product, $idMaterial, $quantity) {
    $productRawMaterial = $this->findOneRawMaterialByProduct($product, $idMaterial);
    $update = false;

    $this->db->connect();
    if ($productRawMaterial == null) {
      $query = "INSERT INTO `materiales_has_productos` (`materiales_has_productos_id`, `materiales_id_materiales`,
       `materiales_empresas_id_empresa`, `productos_id_producto`, `cantidad`)
       VALUES (NULL, '$idMaterial', '" . $product->getIdCompany() . "', '" . $product->getId() . "', '$quantity')";
    } else {
      $query = "UPDATE `materiales_has_productos` SET `cantidad` = '$quantity' 
      WHERE `materiales_has_productos`.`materiales_has_productos_id` = " . $productRawMaterial->getId() . " AND
       `materiales_has_productos`.`materiales_id_materiales` = '" . $productRawMaterial->getMaterial()->getId() . "' AND
      `materiales_has_productos`.`materiales_empresas_id_empresa` = '" . $productRawMaterial->getIdCompany() . "' AND
      `materiales_has_productos`.`productos_id_producto` = '" . $product->getId() . "'";
      $update = true;
    }
    $this->db->consult($query);
    return $update;
  }

  public function updateExpensesByProduct($product) {
    $this->db->connect();
    $query = "UPDATE `gastos_mensuales` SET `unidades_vendidas` = '" . $product->getExpenses()->getSoldUnits() . "', `volumen_ventas` = '" . $product->getExpenses()->getTurnOver() . "' WHERE `gastos_mensuales`.`id_gastos_mensuales` = " . $product->getExpenses()->getId();
    return $this->db->consult($query);
  }

  public function deleteExpensesByProduct($product) {
    $this->db->connect();
    $query = "DELETE FROM `gastos_mensuales` WHERE `gastos_mensuales`.`id_gastos_mensuales` = " . $product->getExpenses()->getId();
    return $this->db->consult($query);
  }

  public function findByLine($idLine) {
    $this->db->connect();
    $query = "SELECT `id_producto` FROM `linea_producto` WHERE `id_linea` = $idLine";
    $productsDB = $this->db->consult($query, "yes");
    $products = [];
    if (count($productsDB) > 0) {
      foreach ($productsDB as  $productDB) {
        array_push($products, $this->findById($productDB["id_producto"]));
      }
      return $products;
    }
    return $products;
  }

  public function saveLine($name, $idCompany) {
    $this->db->connect();
    $query = "INSERT INTO `lineas` (`id`, `nombre`, `id_empresa`) VALUES (NULL, '$name', '$idCompany')";
    return $this->db->consult($query);
  }

  public function saveProductLine($idLine, $idProduct) {
    $this->db->connect();
    $query = "INSERT INTO `linea_producto` (`id`, `id_linea`, `id_producto`) VALUES (NULL, '$idLine', '$idProduct')";
    return $this->db->consult($query);
  }

  public function findLineByName($name, $idCompany) {
    $this->db->connect();
    $query = "SELECT * FROM `lineas` WHERE `nombre` = '$name' AND `id_empresa` = '$idCompany'";
    $lineDB = $this->db->consult($query, "yes");
    $lineDB = $lineDB[0];
    $line = new stdClass();
    $line->id = $lineDB["id"];
    $line->name = $lineDB["nombre"];
    $this->db->close();
    return $line;
  }

  public function deleteProductLine($idLine, $idProduct) {
    $this->db->connect();
    $query = "DELETE FROM `linea_producto` WHERE `linea_producto`.`id_linea` = $idLine AND `linea_producto`.`id_producto` = $idProduct";
    return $this->db->consult($query);
  }

  public function deleteLinesByProduct(Product $product) {
    $this->db->connect();
    $query = "DELETE FROM `linea_producto` WHERE `linea_producto`.`id_producto` = '$product->getId()'";
    return $this->db->consult($query);
  }

  public function findLinesByCompany($idCompany) {
    $this->db->connect();
    $query = "SELECT * FROM `lineas` WHERE `id_empresa` = $idCompany";
    $linesDB = $this->db->consult($query, "yes");
    $lines = [];
    if (count($linesDB) > 0) {
      foreach ($linesDB as  $lineDB) {
        $line = new stdClass();
        $line->id = $lineDB["id"];
        $line->name = $lineDB["nombre"];
        array_push($lines, $line);
      }
    }
    return $lines;
  }
}
