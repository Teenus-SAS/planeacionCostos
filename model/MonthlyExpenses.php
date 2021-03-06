<?php
/**
 * Clase que contiene los gastos mensuales de un producto
 * 
 * @author Teenus SAS>
 * @github Teenus SAS
 * @package model
 */
class MonthlyExpenses implements JsonSerializable
{
  /**
   * Id del gasto mensual
   * @access private
   * @var integer
   */
  private $id;
  /**
   * Unidades vendidas del producto en  el mes
   *
   * @access private
   * @var integer
   */
  private $soldUnits;
  /**
   * 
   * @access private
   * @var double
   */
  private $turnOver;
  /**
   * El porcentaje del volumen de ventas
   *
   * @access private
   * @var double
   */
  private $salesVolumePercentage;
  /**
   * promedio de los gastos mensuales del mes
   *
   * @access private
   * @var double
   */
  private $average;
  /**
   * Gasto asignable por unidad del producto
   *
   * @access private
   * @var double
   */
  private $unitAssignableExpense;
  /**
   * porcentaje de unidades vendidas del producto
   *
   * @access private
   * @var double
   */
  private $soldUnitsPercentage;
  /**
   * Gastos indirectos del producto
   *
   * @access private
   * @var double
   */
  private $indirectExpenses;

  /**
   * Constrcutor de la clase se inicializan todas sus varibales
   *
   * @access public
   * @param integer $id id del producto
   * @param integer $soldUnits unidades vendidas al mes del producto
   * @param double $turnOver Volumen de ventas del prducto al mes
   * @param double $totalSoldUnits total de todas las unidades vendidas al mes por la empresa
   * @param double $totalSalesVolume total de volumen de ventas al mes por la empresa
   * @param double $totalMonthExpenses Total de gastos mensuales de la empresa
   */
  public function __construct($id, $soldUnits, $turnOver, $totalSoldUnits, $totalSalesVolume, $totalMonthExpenses)
  {
    $this->id = $id;
    $this->soldUnits = (int) $soldUnits;
    $this->turnOver = (float) $turnOver;
    $this->salesVolumePercentage = $totalSalesVolume == 0 ? 0 : (($turnOver / $totalSalesVolume) * 100);
    $this->soldUnitsPercentage = $totalSoldUnits == 0 ? 0 : ($soldUnits / $totalSoldUnits) * 100;
    $this->average = ($this->salesVolumePercentage + $this->soldUnitsPercentage) / 2;
    $this->indirectExpenses = ($this->average / 100) * $totalMonthExpenses;
    $this->unitAssignableExpense = $this->indirectExpenses == 0 || $this->soldUnits == 0? 0 : $this->indirectExpenses / $this->soldUnits;
  }

  /**
   * Obtiene id del gasto mensual
   *
   * @access public
   * @return integer
   */
  public function getId()
  {
    return $this->id;
  }

  /**
   * Cambia el id del gasto mensual
   *
   * @access public
   * @param integer $id id que se le quiere dar al gasto mensual
   * @return void
   */
  public function setId($id)
  {
    $this->id = $id;
  }

  /**
   * Obtiene las unidades vendidas
   *
   * @access public
   * @return integer
   */
  public function getSoldUnits()
  {
    return $this->soldUnits;
  }

  /**
   * cambia las ubnidades vendias
   *
   * @access public
   * @param integer $soldUnits unidades vendidas al mes del producto
   * @return void
   */
  public function setSoldUnits($soldUnits)
  {
    $this->soldUnits = $soldUnits;
  }

  /**
   * obtiene el volumen de ventas
   *
   * @access public
   * @return double
   */
  public function getTurnOver()
  {
    return $this->turnOver;
  }
  
  /**
   * Cambia el volumen de ventas
   *
   * @access public
   * @param double $turnOver El volumen de ventas al que se quiere cambiar
   * @return void
   */
  public function setTurnOver($turnOver)
  {
    $this->turnOver = $turnOver;
  }
  
  /**
   * Obtiene el porcentaje del volumen de ventas
   *
   * @access public
   * @return double
   */
  public function getSalesVolumePercentage()
  {
    return $this->salesVolumePercentage;
  }

  /**
   * Cambia el procentaje del volumen de ventas 
   *
   * @access public
   * @param double $salesVolumePercentage porcentaje del volumen de ventas nuevo
   * @return void
   */
  public function setSalesVolumePercentage($salesVolumePercentage)
  {
    $this->salesVolumePercentage = $salesVolumePercentage;
  }

  /**
   * Obtiene el promedio 
   * 
   * @access public
   * @return double
   */
  public function getAverage()
  {
    return $this->average;
  }

  /**
   * Cambia el promedio
   *
   * @access public
   * @param double $average Promedio nuevo
   * @return void
   */
  public function setAverage($average)
  {
    $this->average = $average;
  }

  /**
   * obtiene el costo asignable por unidad del producto
   *
   * @access public
   * @return double
   */
  public function getUnitAssignableExpense()
  {
    return $this->unitAssignableExpense;
  }

  /**
   * cambia el consto asignable por unidad del producto
   *
   * @access public
   * @param double $unitAssignableExpense Costo asignable por unidad nuevo
   * @return void
   */
  public function setUnitAssignableExpense($unitAssignableExpense)
  {
    $this->unitAssignableExpense = $unitAssignableExpense;
  }

  /**
   * Obtiene el porcentaje de unidades vendidas del producto
   *
   * @access public
   * @return double
   */
  public function getSoldUnitsPercentage()
  {
    return $this->soldUnitsPercentage;
  }

  /**
   * Cambia el porcentaje de unidades vendidas del producto
   *
   * @access public
   * @param double $soldUnitsPercentage Porcentaje de unidades vendidas nuevo
   * @return void
   */
  public function setSoldUnitsPercentage($soldUnitsPercentage)
  {
    $this->soldUnitsPercentage = $soldUnitsPercentage;
  }

  /**
   * Obtiene los gastos indirectos del producto
   *
   * @access public
   * @return double
   */
  public function getIndirectExpenses()
  {
    return $this->indirectExpenses;
  }

  /**
   * Cambia el valor de los gastos indirectos
   *
   * @access public
   * @param double $indirectExpenses Gastos indirectos nuevos
   * @return void
   */
  public function setIndirectExpenses($indirectExpenses)
  {
    $this->indirectExpenses = $indirectExpenses;
  }

  /**
   * Comvierte esta clase en un objeto json
   *
   * @access public
   * @return mixed
   */
  public function jsonSerialize()
  {
    return get_object_vars($this);
  }
}
