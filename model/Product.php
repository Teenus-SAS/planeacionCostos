<?php

/**
 * Modelo de un producto de una empresa
 * 
 * @author Alexis Holguin <wholguinmor@uniminuto.edu.co>
 * @github MoraHol
 * @package model
 */
class Product implements JsonSerializable
{
  /**
   * id del producto
   *
   * @access private
   * @var integer
   */
  private $id;
  /**
   * nombre del producto
   *
   * @access private
   * @var string
   */
  private $name;
  /**
   * id de la empresa creadora del producto
   *
   * @access private
   * @var integer
   */
  private $idCompany;
  /**
   * Referencia del producto
   *
   * @access private
   * @var string
   */
  private $ref;
    /**
   * Rentabilidad del producto o en su defecto la rentabilidad general
   *
   * @access private
   * @var decimal
   */
  private $rentabilidad;
  /**
   * materiales Del producto
   *
   * @access private
   * @var ProductRawMaterial[]
   */
  private $materials;
  /**
   * procesos Asociados al producto
   *
   * @access private
   * @var ProductProcess[]
   */
  private $processes;
  /**
   * Gastos mensuales del producto
   *
   * @access private
   * @var MonthlyExpenses
   */
  private $expenses;

  /**
   * obtiene el id del producto
   *
   * @access public
   * @return integer
   */
  public function getId()
  {
    return $this->id;
  }

  /**
   * cambia el id del producto
   *
   * @access public
   * @param integer $id nuevo id del producto
   * @return void
   */
  public function setId($id)
  {
    $this->id = $id;
  }

  /**
   * obtiene el nombre del producto
   *
   * @access public
   * @return string
   */
  public function getName()
  {
    return $this->name;
  }

  /**
   * Cambia el nombre del producto
   *
   * @access public
   * @param string $name nombre del producto
   * @return void
   */
  public function setName($name)
  {
    $this->name = $name;
  }

  /**
   * obtiene el id de la empresa creadora del producto
   *
   * @access public
   * @return integer
   */
  public function getIdCompany()
  {
    return $this->idCompany;
  }

  /**
   * Cambia el id de la empresa creadora del producto
   *
   * @access public
   * @param integer $idCompany nuevo id de la empresa
   * @return void
   */
  public function setIdCompany($idCompany)
  {
    $this->idCompany = $idCompany;
  }

  /**
   * obtiene la referencia del producto
   *
   * @access public
   * @return string
   */
  public function getRef()
  {
    return $this->ref;
  }

  /**
   * cambia la referencia del producto
   *
   * @access public
   * @param string $ref nueva referencia del producto
   * @return void
   */
  public function setRef($ref)
  {
    $this->ref = $ref;
  }

  /**
   * obtiene la rentabilidad del producto o en su defecto la rentablidad general
   *
   * @access public
   * @return decimal
   */
  public function getRentabilidad()
  {
    return $this->rentabilidad;
  }

    /**
   * cambia el valor de la rentabilidad del producto
   *
   * @access public
   * @param string $rentabilidad nueva rentabilidad del producto
   * @return void
   */
  public function setRentabilidad($rentabilidad)
  {
    $this->rentabilidad = $rentabilidad;
  }

  /**
   * obtiene la lista de materiales que contiene el porducto
   *
   * @access public
   * @return ProductRawMaterial[]
   */
  public function getMaterials()
  {
    return $this->materials;
  }

  /**
   * Cambia el listado de materiales que  contiene el producto
   *
   * @access public
   * @param ProductRawMaterial[] $materials listado de materiales que va a contener el producto
   * @return void
   */
  public function setMaterials($materials)
  {
    $this->materials = $materials;
  }

  /**
   * obtiene el listado de procesos que tiene el producto
   *
   * @access public
   * @return ProductProcess[]
   */
  public function getProcesses()
  {
    return $this->processes;
  }

  /**
   * cambia el listado de procesos que tiene el producto
   *
   * @access public
   * @param ProductProcess[] $processes listado de procesos
   * @return void
   */
  public function setProcesses($processes)
  {
    $this->processes = $processes;
  }

  /**
   * obtiene los gastos mesuales del producto
   *
   * @access public
   * @return MonthlyExpenses
   */
  public function getExpenses()
  {
    return $this->expenses;
  }

  /**
   * Cambia los gastos mensuales del producto
   *
   * @access public
   * @param MonthlyExpenses $expenses gastos mensuales del producto
   * @return void
   */
  public function setExpenses($expenses)
  {
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
