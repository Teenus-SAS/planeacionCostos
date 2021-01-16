<?php
/**
 * Modelo de un proceso de una empresa
 * 
 * @author Teenus SAS>
 * @github Teenus SAS
 * @package model
 */
class Process implements JsonSerializable
{
  /**
   * Id del proceso
   *
   * @access private
   * @var integer
   */
  private $id;
  /**
   * nombre del proceso
   *
   * @access private
   * @var string
   */
  private $name;
  /**
   * id de la compañia creadora del proceso
   *
   * @access private
   * @var integer
   */
  private $idCompany;

  /**
   * obtiene el id del proceso
   *
   * @return integer
   */
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

  /**
   * obtiene el nombre del proceso
   *
   * @return string
   */
  public function getName()
  {
    return $this->name;
  }

  /**
   * Cambia el nombre del proceso
   *
   * @param string $name nuevo nombre del proceso
   * @return void
   */
  public function setName($name)
  {
    $this->name = $name;
  }

  /**
   * obtiene le id de la empresa creadora del proceso
   *
   * @return integer
   */
  public function getIdCompany()
  {
    return $this->idCompany;
  }

  /**
   * cambia el id de la empresa creadora del porceso
   *
   * @param integer $idCompany nuevo id de la empresa
   * @return void
   */
  public function setIdCompany($idCompany)
  {
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
