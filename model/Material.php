<?php
class Material implements JsonSerializable
{
  private $id;
  private $IdCompany;
  private $referencia;
  private $description;
  private $cost;
  private $unit;

  public function getId() {
    return $this->id;
  }

  /**
   * cambia el id del material
   *
   * @access public
   * @param integer $id nuevo id
   * @return void
   */
  public function setId($id)
  {
    $this->id = $id;
  }

  /**
   * obtiene el id de la empresa que creo el material
   *
   * @access public
   * @return integer
   */
  public function getIdCompany()
  {
    return $this->IdCompany;
  }

  /**
   * Cambia el id de la empresa que creo el material
   *
   * @access public
   * @param integer $IdCompany nuevo id de la empresa
   * @return void
   */
  public function setIdCompany($IdCompany)
  {
    $this->IdCompany = $IdCompany;
  }

  /**
   * Obtiene la refencia del material
   *
   * @access public
   * @return string
   */
  public function getReferencia()
  {
    return $this->referencia;
  }

  /**
   * Cambia la referencia del material
   *
   * @access public
   * @param string $referencia del nuevo nombre del material
   * @return void
   */
  public function setReferencia($referencia)
  {
    $this->referencia = $referencia;
  }



  /**
   * Obtiene el nombre del material
   *
   * @access public
   * @return string
   */
  public function getDescription()
  {
    return $this->description;
  }

  /**
   * Cambia el nombre del material
   *
   * @access public
   * @param string $description nuevo nombre del material
   * @return void
   */
  public function setDescription($description)
  {
    $this->description = $description;
  }

  /**
   * Obtiene el costo del material
   *
   * @access public
   * @return double
   */
  public function getCost()
  {
    return $this->cost;
  }

  /**
   * Cambia el costo del material
   *
   * @access public
   * @param double $cost nuevo costo del material
   * @return void
   */
  public function setCost($cost)
  {
    $this->cost = $cost;
  }

  /**
   * Obtiene la unidad de medida del material
   *
   * @access public
   * @return string
   */
  public function getUnit()
  {
    return $this->unit;
  }

  /**
   * Cambia la unidad de medida del material
   *
   * @access public
   * @param string $unit nueva unidad de medida
   * @return void
   */
  public function setUnit($unit)
  {
    $this->unit = $unit;
  }

  /**
   * Convierte a un objeto JSON esta clase
   *
   * @access public
   * @return mixed
   */
  public function jsonSerialize()
  {
    return get_object_vars($this);
  }
}
