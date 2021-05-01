<?php

class Process implements JsonSerializable {
  private $id;
  private $name;
  private $idCompany;

  public function getId()
  {
    return $this->id;
  }

  /**
   * cambia el id del proceso
   *
   * @param integer $id nuevo id del proceso
   * @return void
   */
  public function setId($id)
  {
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

  /**
   * convierte esta clase en un objeto JSON
   *
   * @return mixed
   */
  public function jsonSerialize()
  {
    return get_object_vars($this);
  }
}
