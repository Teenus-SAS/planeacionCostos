<?php

/**
 * Clase modelo de Empresa
 * 
 * 
 * @author Alexis Holguin <wholginmor@uniminunto.edu.co>
 * @github MoraHol
 * @package model
 */
class Company implements JsonSerializable
{
  /**
   * id de la empresa
   *
   * @var integer
   */
  private $id;
  /**
   * Nombre comercial de la empresa
   *
   * @var string
   */
  private $tradename;
  /**
   * Razon Comercial de la empresa
   *
   * @var string
   */
  private $bussinesReason;
  /**
   * departamento de la empresa
   *
   * @var string
   */
  private $department;
  /**
   * Ciudad de la empresa
   *
   * @var string
   */
  private $city;
  /**
   * país de la empresa
   *
   * @var string
   */
  private $country;
  /**
   * Dirección de la empresa
   *
   * @var string
   */
  private $address;
  /**
   * Telefono de la empresa
   *
   * @var string
   */
  private $phone;
  /**
   * NIT de la empresa
   *
   * @var string
   */
  private $nit;
  
  /**
   * Comisión de ventas de la empresa
   *
   * @var double
   */
  private $salesCommission;
  /**
   * Margen de rentabilidad de la empresa
   *
   * @var double
   */
  private $profitabilityMargin;
  /**
   * horas de trabajo al dia de la empresa
   *
   * @var integer
   */
  private $workHours;
  /**
   * Días de trabajo al mes de la empresa
   *
   * @var integer
   */
  private $bussinesDaysMonth;
  
  /**
   * Ruta del archivo de imagen del logo de la empresa
   *
   * @var string
   */
  private $logo;
  
  /**
   * Gastos generales del mes de la empresa
   *
   * @var double
   */
  private $totalMonthExpenses;
  /**
   * Fecha de expiracion de licencia de la empresa
   *
   * @var date
   */
  private $licenseExpiration;
  
  /**
   * Estado de la licencia
   *
   * @var boolean
   */
  private $activeLicense;
  /**
   * Número de productos con capacidad de agregar de la empresa
   *
   * @var integer
   */
  private $licensedProducts;
  /**
   * Descripcion de gastos generales de la empresa
   * Esto se da en un objeto JSON 
   * Seguiendo una estructura creada por la apliación
   *
   * @var mixed
   */
  private $expensesDescription;
  /**
   * Fecha de inicio de licencia
   *
   * @var date
   */
  private $startLicense;
  /**
   * Descripción del creador de la cuenta de la empresa
   * Esto se da en un formato JSOn
   *
   * @var mixed
   */
  private $creator;
  /**
   * BPM de la empresa es una ruta 
   * La cual contiene el archivo de imagen del BPM
   *
   * @var string
   */
  private $bpm;

  public function getId()
  {
    return $this->id;
  }

  public function setId($id)
  {
    $this->id = $id;
  }

  public function getTradename()
  {
    return $this->tradename;
  }

  public function setTradename($tradename)
  {
    $this->tradename = $tradename;
  }

  public function getBussinesReason()
  {
    return $this->bussinesReason;
  }

  public function setBussinesReason($bussinesReason)
  {
    $this->bussinesReason = $bussinesReason;
  }

  public function getDepartment()
  {
    return $this->department;
  }

  public function setDepartment($department)
  {
    $this->department = $department;
  }

  public function getCity()
  {
    return $this->city;
  }

  public function setCity($city)
  {
    $this->city = $city;
  }

  public function getCountry()
  {
    return $this->country;
  }

  public function setCountry($country)
  {
    $this->country = $country;
  }

  public function getAddress()
  {
    return $this->address;
  }

  public function setAddress($address)
  {
    $this->address = $address;
  }

  public function getPhone()
  {
    return $this->phone;
  }

  public function setPhone($phone)
  {
    $this->phone = $phone;
  }

  public function getNit()
  {
    return $this->nit;
  }

  public function setNit($nit)
  {
    $this->nit = $nit;
  }

  public function getSalesCommission()
  {
    return $this->salesCommission;
  }

  public function setSalesCommission($salesCommission)
  {
    $this->salesCommission = $salesCommission;
  }

  public function getProfitabilityMargin()
  {
    return $this->profitabilityMargin;
  }

  public function setProfitabilityMargin($profitabilityMargin)
  {
    $this->profitabilityMargin = $profitabilityMargin;
  }

  public function getWorkHours()
  {
    return $this->workHours;
  }

  public function setWorkHours($workHours)
  {
    $this->workHours = $workHours;
  }

  public function getBussinesDaysMonth()
  {
    return $this->bussinesDaysMonth;
  }

  public function setBussinesDaysMonth($bussinesDaysMonth)
  {
    $this->bussinesDaysMonth = $bussinesDaysMonth;
  }

  public function getLogo()
  {
    return $this->logo;
  }

  public function setLogo($logo)
  {
    $this->logo = $logo;
  }

  public function getTotalMonthExpenses()
  {
    return $this->totalMonthExpenses;
  }

  public function setTotalMonthExpenses($totalMonthExpenses)
  {
    $this->totalMonthExpenses = $totalMonthExpenses;
  }

  public function getLicenseExpiration()
  {
    return $this->licenseExpiration;
  }

  public function setLicenseExpiration($licenseExpiration)
  {
    $this->licenseExpiration = $licenseExpiration;
  }

  public function getActiveLicense()
  {
    return $this->activeLicense;
  }

  public function setActiveLicense($activeLicense)
  {
    $this->activeLicense = $activeLicense;
  }

  public function getLicensedProducts()
  {
    return $this->licensedProducts;
  }

  public function setLicensedProducts($licensedProducts)
  {
    $this->licensedProducts = $licensedProducts;
  }

  public function getExpensesDescription()
  {
    return $this->expensesDescription;
  }

  public function setExpensesDescription($expensesDescription)
  {
    $this->expensesDescription = $expensesDescription;
  }

  public function getStartLicense()
  {
    return $this->startLicense;
  }

  public function setStartLicense($startLicense)
  {
    $this->startLicense = $startLicense;
  }

  public function getCreator()
  {
    return $this->creator;
  }

  public function setCreator($creator)
  {
    $this->creator = $creator;
  }

  public function getBpm(){
		return $this->bpm;
	}

	public function setBpm($bpm){
		$this->bpm = $bpm;
	}

  public function jsonSerialize()
  {
    return get_object_vars($this);
  }
}
