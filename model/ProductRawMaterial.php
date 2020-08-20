<?php

class ProductRawMaterial implements JsonSerializable
{
  private $id;
  private $quantity;
  private $material;
  private $idCompany;
  private $idPorduct;

  public function getId()
  {
    return $this->id;
  }

  public function setId($id)
  {
    $this->id = $id;
  }

  public function getQuantity()
  {
    return $this->quantity;
  }

  public function setQuantity($quantity)
  {
    $this->quantity = $quantity;
  }

  public function getMaterial()
  {
    return $this->material;
  }

  public function setMaterial($material)
  {
    $this->material = $material;
  }

  public function getIdCompany()
  {
    return $this->idCompany;
  }

  public function setIdCompany($idCompany)
  {
    $this->idCompany = $idCompany;
  }

  public function getIdPorduct()
  {
    return $this->idPorduct;
  }

  public function setIdPorduct($idPorduct)
  {
    $this->idPorduct = $idPorduct;
  }

  public function jsonSerialize()
  {
    return get_object_vars($this);
  }
}
