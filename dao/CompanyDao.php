<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once MODEL_PATH . "Company.php";

class CompanyDao {
  private $db;

  public function __construct() {
    $this->db = new DBOperator($_ENV["db_host"], $_ENV["db_user"], $_ENV["db_name"], $_ENV["db_pass"]);
  }

  public function findById($id) {
    $this->db->connect();
    $query = "SELECT * FROM `empresas` WHERE `id_empresa` = $id";
    $companyDB = $this->db->consult($query, "yes");
    if (count($companyDB) > 0) {
      $companyDB = $companyDB[0];
    } else {
      return null;
    }

    $company = new Company();
    $company->setId($companyDB["id_empresa"]);
    $company->setTradename($companyDB["nombre_comercial"]);
    $company->setBussinesReason($companyDB["razon_social"]);
    $company->setDepartment($companyDB["departamento"]);
    $company->setCity($companyDB["ciudad"]);
    $company->setCountry($companyDB["pais"]);
    $company->setAddress($companyDB["direccion"]);
    $company->setPhone($companyDB["telefono"]);
    $company->setNit($companyDB["nit"]);
    $company->setSalesCommission($companyDB["comision_ventas"]);
    $company->setProfitabilityMargin($companyDB["margen_rentabilidad"]);
    $company->setWorkHours($companyDB["horas_trabajo"]);
    $company->setBussinesDaysMonth($companyDB["dia_mes"]);
    $company->setLogo($companyDB["logo"]);
    $company->setTotalMonthExpenses($companyDB["gastos_totales_mes"]);
    $company->setActiveLicense((bool) $companyDB["licencia_activa"]);
    $company->setLicenseExpiration(date("Y-m-d", strtotime($companyDB["expiracion_licencia"])));
    $company->setLicensedProducts($companyDB["productos_licenciados"]);
    $company->setExpensesDescription($companyDB["gastos_especificos"]);
    $company->setStartLicense(date("Y-m-d", strtotime($companyDB["inicio_licencia"])));
    $company->setCreator($companyDB["creador"]);
    $company->setBpm($companyDB["bpm"]);
    $this->db->close();
    return $company;
  }

  /**
   * Actualizar una compañia en la base de datos
   *
   * @param Company $company Objeto que se desea actualizar
   * @return Integer numero de tuplas afectadas por la actualizacion
   */
  public function update($company)
  {
    $this->db->connect();
    $query = "UPDATE `empresas` SET `nombre_comercial` = '" . $company->getTradeName() . "',
    `razon_social` = '" . $company->getBussinesReason() . "', `departamento` = '" . $company->getDepartment() . "',
    `ciudad` = '" . $company->getCity() . "', `pais` = '" . $company->getCountry() . "',
    `direccion` = '" . $company->getAddress() . "', `telefono` = '" . $company->getPhone() . "',
    `nit` = '" . $company->getNit() . "',
    `comision_ventas` = '" . $company->getSalesCommission() . "', `margen_rentabilidad` = '" . $company->getProfitabilityMargin() . "',
    `horas_trabajo` = '" . $company->getWorkHours() . "', `dia_mes` = '" . $company->getBussinesDaysMonth() . "',
    `logo` = '" . $company->getLogo() . "', `gastos_totales_mes` = '" . $company->getTotalMonthExpenses() . "', 
    `gastos_especificos` = '" . $company->getExpensesDescription() . "', `productos_licenciados` = '" . $company->getLicensedProducts() . "',
    `expiracion_licencia` = '" . $company->getLicenseExpiration() . "', `inicio_licencia` = '" . $company->getStartLicense() . "',
     `bpm` = '" . $company->getBpm() . "'
    WHERE `empresas`.`id_empresa` = " . $company->getId();
    return $this->db->consult($query);
  }

  /**
   * Guardar una compañia o crearla en la base de datos
   *
   * @param Company $company Objeto de empresa que se desea crear
   * @param User $user Objeto usuario con el que se va crear la empresa
   * @return StdClass Objeto con el número de tuplas afectadas, en caso de error 
   * El codigo de error, la lista de error
   */
  public function save($company, $user)
  {
    $response = new stdClass();
    // se efectuara la creacion de la empresa con transacciones
    $this->db->connect();
    $this->db->autocommit(false);
    // creacion de empresa
    $query = "INSERT INTO `empresas` (`id_empresa`, `nombre_comercial`,
     `razon_social`, `departamento`, `ciudad`, `pais`, `direccion`,
      `telefono`, `nit`, `comision_ventas`, `margen_rentabilidad`,
      `horas_trabajo`, `dia_mes`, `logo`, `gastos_totales_mes`,
      `expiracion_licencia`, `licencia_activa`, `productos_licenciados`,
      `gastos_especificos`,`inicio_licencia`,`creador`,`bpm`) VALUES 
      (NULL, '" . $company->getTradename() . "', '" . $company->getBussinesReason() . "',
      '" . $company->getDepartment() . "', '" . $company->getCity() . "',
      '" . $company->getCountry() . "', '" . $company->getAddress() . "',
      '" . $company->getPhone() . "', '" . $company->getNit() . "',
      '0', '0', '0','0', NULL, '0', '" . $company->getLicenseExpiration() . "', '1', '3', '','" . $company->getStartLicense() . "','" . $company->getCreator() . "','/img/img.jpg')";
    $response->status = $this->db->consult($query);
    if ($response->status > 0) {
      $companyId = $this->db->lastInsertId();
      // creación de usuario para la empresa
      $query = "INSERT INTO `users` (`id_user`, `username`, `email`, `password`,
       `created_at`, `empresas_id_empresa`, `token_pass`,
       `roles_users_idroles_users`, `session_active`,`active`) VALUES 
       (NULL, '" . $user->getUsername() . "', '" . $user->getEmail() . "', '" . $user->getPassword() . "', CURRENT_TIMESTAMP, '$companyId', 'addas', '2', '0','" . (int) $user->getActive() . "')";
      $response->status = $this->db->consult($query);
      if ($response->status > 0) {
        $this->db->commit();
        return $response;
      } else {
        $response->errorno = $this->db->errorno();
        $response->errorList = $this->db->errorList();
        $response->error = $this->db->lastError();
        $this->db->rollback();
        $response->status = 0;
        return $response;
      }
    } else {
      $response->errorno = $this->db->errorno();
      $response->errorList = $this->db->errorList();
      $response->error = $this->db->lastError();
      $this->db->rollback();
      $response->status = 0;
      return $response;
    }
    $this->db->autocommit(false);
  }

  /**
   * Encuentra todas las empresas de la aplicación
   *
   * @return Company[]
   */
  public function findAll()
  {
    $this->db->connect();
    $query = "SELECT `id_empresa` FROM `empresas`";
    $companiesDB = $this->db->consult($query, "yes");
    $companies = [];
    if (count($companiesDB) > 0) {
      foreach ($companiesDB as  $companyDB) {
        array_push($companies, $this->findById($companyDB["id_empresa"]));
      }
    }
    return $companies;
  }
}
