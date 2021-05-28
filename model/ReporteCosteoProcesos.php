<?php

class ReporteCosteoProcesos implements JsonSerializable {
  private $id;
  private $consecutivo;
  private $creationDate;
  private $idCompany;
  private $ciudad;
  private $cliente;
  private $productos;
  private $pdfData;

  public function getId() {
    return $this->id;
  }

  public function setId($id) {
    $this->id = $id;
  }

  public function getConsecutivo() {
    return $this->consecutivo;
  }

  public function setConsecutivo($consecutivo) {
    $this->consecutivo = $consecutivo;
  }

  public function getCreationDate() {
    return $this->creationDate;
  }

  public function setCreationDate($creationDate) {
    $this->creationDate = $creationDate;
  }

  public function getIdCompany() {
    return $this->idCompany;
  }

  public function setIdCompany($idCompany) {
    $this->idCompany = $idCompany;
  }

  public function getCiudad() {
    return $this->ciudad;
  }

  public function setCiudad($ciudad) {
    $this->ciudad = $ciudad;
  }

  public function getCliente() {
    return $this->cliente;
  }

  public function setCliente($cliente) {
    $this->cliente = $cliente;
  }

  public function getProductos() {
    return $this->productos;
  }

  public function setProductos($productos) {
    $this->productos = $productos;
  }

  public function getPdfData() {
    return $this->pdfData;
  }

  public function setPdfData($pdfData) {
    $this->pdfData = $pdfData;
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
