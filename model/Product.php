<?php

class Product implements JsonSerializable {
  private $id;
  private $name;
  private $idCompany;
  private $ref;
  private $rentabilidad;
  private $materials;
  private $processes;
  private $productProcesses;
  private $expenses;
  private $serviciosExternos;

  public function getServiciosExternos() {
    return $this->serviciosExternos;
  }

  public function setServiciosExternos($serviciosExternos) {
    $this->serviciosExternos = $serviciosExternos;
  }

  public function getId() {
    return $this->id;
  }

  public function setId($id) {
    $this->id = $id;
  }

  public function getName() {
    return $this->name;
  }

  public function setName($name) {
    $this->name = $name;
  }

  public function getIdCompany() {
    return $this->idCompany;
  }

  public function setIdCompany($idCompany) {
    $this->idCompany = $idCompany;
  }

  public function getRef() {
    return $this->ref;
  }

  public function setRef($ref) {
    $this->ref = $ref;
  }

  public function getRentabilidad() {
    return $this->rentabilidad;
  }

  public function setRentabilidad($rentabilidad) {
    $this->rentabilidad = $rentabilidad;
  }

  public function getMaterials() {
    return $this->materials;
  }

  public function setMaterials($materials) {
    $this->materials = $materials;
  }

  public function getProductProcesses() {
    return $this->productProcesses;
  }

  public function setProductProcesses($productProcesses) {
    $this->productProcesses = $productProcesses;
  }

  public function getProcesses() {
    return $this->processes;
  }

  public function setProcesses($processes) {
    $this->processes = $processes;
  }

  public function getExpenses() {
    return $this->expenses;
  }

  public function setExpenses($expenses) {
    $this->expenses = $expenses;
  }

  /**
   * Convierte esta calse en un objeto JSON
   *
   * @access public
   * @return mixed
   */
  public function jsonSerialize()
  {
    return get_object_vars($this);
  }
}
