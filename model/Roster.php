<?php
class Roster implements JsonSerializable
{
  private $id;
  private $idCompany;
  private $position;
  private $process;
  private $numberEmployees;
  private $salary;
  private $transporte;
  private $bonus;
  private $endowment;
  private $workHours;
  private $bussinesDaysMonth;
  private $performaceFactor;
  private $netSalary;
  private $contract;
  private $minuteValue;
  private $extraHours;

  public function getId()
  {
    return $this->id;
  }

  public function setId($id)
  {
    $this->id = $id;
  }

  public function getIdCompany()
  {
    return $this->idCompany;
  }

  public function setIdCompany($idCompany)
  {
    $this->idCompany = $idCompany;
  }

  public function getPosition()
  {
    return $this->position;
  }

  public function setPosition($position)
  {
    $this->position = $position;
  }

  public function getProcess()
  {
    return $this->process;
  }

  public function setProcess($process)
  {
    $this->process = $process;
  }

  public function getNumberEmployees()
  {
    return $this->numberEmployees;
  }

  public function setNumberEmployees($numberEmployees)
  {
    $this->numberEmployees = $numberEmployees;
  }

  public function getSalary()
  {
    return $this->salary;
  }

  public function setSalary($salary)
  {
    $this->salary = $salary;
  }

  public function getTransporte()
  {
    return $this->transporte;
  }

  public function setTransporte($transporte)
  {
    $this->transporte = $transporte;
  }

  public function getBonus()
  {
    return $this->bonus;
  }

  public function setBonus($bonus)
  {
    $this->bonus = $bonus;
  }

  public function getEndowment()
  {
    return $this->endowment;
  }

  public function setEndowment($endowment)
  {
    $this->endowment = $endowment;
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

  public function getPerformaceFactor()
  {
    return $this->performaceFactor;
  }


  public function setValueMinute($valueMinute)
  {
    $this->minuteValue = $valueMinute;
  }

  public function getValueMinute()
  {
    return $this->minuteValue;
  }
  public function setPerformaceFactor($performaceFactor)
  {
    $this->performaceFactor = $performaceFactor;
  }

  public function getNetSalary()
  {
    return $this->netSalary;
  }

  public function setNetSalary($netSalary)
  {
    $this->netSalary = $netSalary;
    $this->minuteValue = ($this->netSalary / $this->bussinesDaysMonth / $this->workHours / 60)/* /$this->numberEmployees */;
  }

  public function getContract()
  {
    return $this->contract;
  }

  public function setContract($contract)
  {
    $this->contract = $contract;
  }

  public function getExtraHours()
  {
    return $this->extraHours;
  }

  public function setExtraHours($extraHours)
  {
    $this->extraHours = $extraHours;
  }

  public function jsonSerialize()
  {
    return get_object_vars($this);
  }
}
