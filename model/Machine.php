<?php

class Machine implements JsonSerializable {
  private $id;
  private $idCompany;
  private $name;
  private $price;
  private $yearsDepreciation;
  private $residualValue;
  private $depreciation;

  public function setValuesDepreciation($daysMonth, $hours, $price, $residualValue, $yearsDepreciation) {
    $this->price = $price;
    $this->residualValue = $residualValue;
    $this->yearsDepreciation = $yearsDepreciation;
    $this->calculateDepreciation($daysMonth, $hours);
  }

  public function getId() {
    return $this->id;
  }

  public function setId($id) {
    $this->id = $id;
  }

  public function getIdCompany() {
    return $this->idCompany;
  }

  public function setIdCompany($idCompany) {
    $this->idCompany = $idCompany;
  }

  public function getName() {
    return $this->name;
  }

  public function setName($name) {
    $this->name = $name;
  }

  public function getPrice() {
    return $this->price;
  }

  public function setPrice($price) {
    $this->price = $price;
  }

  public function setDepreciation($depreciation) {
    $this->depreciation = $depreciation;
  }

  public function getDepreciation() {
    return $this->depreciation;
  }

  private function calculateDepreciation($daysMonth, $hours) {
    $this->depreciation = ($this->price - $this->residualValue) / ($this->yearsDepreciation * 12) / $daysMonth / $hours / 60;
  }

  public function getYearsDepreciation() {
    return $this->yearsDepreciation;
  }

  public function setYearsDepreciation($yearsDepreciation) {
    $this->yearsDepreciation = $yearsDepreciation;
  }

  public function getResidualValue() {
    return $this->residualValue;
  }

  public function setResidualValue($residualValue) {
    $this->residualValue = $residualValue;
  }

  public function jsonSerialize() {
    return get_object_vars($this);
  }
}
