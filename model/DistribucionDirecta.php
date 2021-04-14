<?php

class DistribucionDirecta implements JsonSerializable {

    private $id;
    private $idProceso;
    private $nombreProceso;
    private $idEmpresa;
    private $porcentaje;
    private $valorProceso;
    private $valorMinuto;
    private $valorAsignado;

    public function setId($id) {
        $this->id = $id;
    }

    public function getId() {
        return $this->id;
    }

    public function setIdProceso($idProceso) {
        $this->idProceso = $idProceso;
    }

    public function getNombreProceso() {
        return $this->nombreProceso;
    }

    public function setNombreProceso($nombreProceso) {
        $this->nombreProceso = $nombreProceso;
    }

    public function getIdProceso() {
        return $this->idProceso;
    }

    public function setIdEmpresa($idEmpresa) {
        $this->idEmpresa = $idEmpresa;
    }

    public function getIdEmpresa() {
        return $this->idEmpresa;
    }

    public function setValorProceso($valorProceso) {
        $this->valorProceso = $valorProceso;
    }

    public function setValorProcesoMinutoAsignado($valorProceso, $businessDaysMonth, $workHours, $tiempoProceso) {
        $this->valorProceso = $valorProceso;
        $valorMinuto = $valorProceso/$businessDaysMonth/$workHours/60;
        $this->valorMinuto = $valorMinuto;
        $this->valorAsignado = $valorMinuto*$tiempoProceso;
    }

    public function getValorProceso() {
        return $this->valorProceso;
    }

    public function setValorMinuto($valorMinuto) {
        $this->valorMinuto = $valorMinuto;
    }

    public function getValorMinuto() {
        return $this->valorMinuto;
    }

    public function setValorAsignado($valorAsignado) {
        $this->valorAsignado = $valorAsignado;
    }

    public function getValorAsignado() {
        return $this->valorAsignado;
    }

    public function set($porcentaje, Company $company, $tiempoProceso) {
        $this->setPorcentaje($porcentaje);
        $valorProceso = floatval($company->getTotalMonthExpenses()) * $porcentaje;
        $this->setValorProcesoMinutoAsignado($valorProceso, floatval($company->getBussinesDaysMonth()), floatval($company->getWorkHours()), $tiempoProceso);
    }

    public function setPorcentaje($porcentaje) {
        $this->porcentaje = $porcentaje;
    }

    public function getPorcentaje() {
        return $this->porcentaje;
    }

    public function jsonSerialize() {
        return get_object_vars($this);
    }
}