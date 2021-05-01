<?php

class ProductProcess implements JsonSerializable {

  private $id;
  private $idProduct;
  private $idCompany;
  private $machine;
  private $timeAlistamiento;
  private $timeOperacion;
  private $process;

  // --------------------------------------------------------------------------
  //    Metodos Getters y Setters
  // --------------------------------------------------------------------------

  /**
   * Obtiene el id del proceso de un producto
   *
   * @return integer
   */
  public function getId()
  {
    return $this->id;
  }

  /**
   * Cambia el id del proceso de un producto
   *
   * @param integer $id nuevo id del proceso de un producto
   * @return void
   */
  public function setId($id)
  {
    $this->id = $id;
  }

  /**
   * obtiene el id del producto
   *
   * @return integer
   */
  public function getIdProduct()
  {
    return $this->idProduct;
  }

  /**
   * camabia el id del producto
   *
   * @param integer $idProduct nuevo id del producto
   * @return void
   */
  public function setIdProduct($idProduct)
  {
    $this->idProduct = $idProduct;
  }

  /**
   * Obtiene el id de la empresa
   *
   * @return integer
   */
  public function getIdCompany()
  {
    return $this->idCompany;
  }

  /**
   * Cambia el id de la empresa
   *
   * @param integer $idCompany nuevo id de la empresa
   * @return void
   */
  public function setIdCompany($idCompany)
  {
    $this->idCompany = $idCompany;
  }

  /**
   * Obtiene la maquina asignada al proceso del producto
   *
   * @return Machine
   */
  public function getMachine()
  {
    return $this->machine;
  }

  /**
   * Cambia la maquina asociada al proceso del  producto
   *
   * @param Machine $machine maquina que sera asignada
   * @return void
   */
  public function setMachine($machine)
  {
    $this->machine = $machine;
  }

  /**
   * obtiene el tiempo del proceso
   *
   * @return float
   */
  public function getTimeAlistamiento()
  {
    return $this->timeAlistamiento;
  }

  /**
   * Cambia el tiempo del proceso de un producto
   *
   * @param float $timeAlistamiento nuevo tiempo del proceso para el producto
   * @return void
   */
  public function setTimeAlistamiento($timeAlistamiento)
  {
    $this->timeAlistamiento = $timeAlistamiento;
  }

  public function getTimeOperacion()
  {
    return $this->timeOperacion;
  }

  /**
   * Cambia el tiempo del proceso de un producto
   *
   * @param float $timeOperacion nuevo tiempo del proceso para el producto
   * @return void
   */
  public function setTimeOperacion($timeOperacion)
  {
    $this->timeOperacion = $timeOperacion;
  }


  /**
   * Obtiene el proceso asignado
   *
   * @return Process
   */
  public function getProcess()
  {
    return $this->process;
  }

  /**
   * Cambia el proceso asignado
   *
   * @param Process $process Proceso que se desea asignar
   * @return void
   */
  public function setProcess($process)
  {
    $this->process = $process;
  }

  /**
   * convierte esta clas en un objeto JSON
   *
   * @return mixed
   */
  public function jsonSerialize()
  {
    return get_object_vars($this);
  }
}
