<?php

class CargaFabril implements JsonSerializable {
    // Id de la carga fabril
    private $id;
    // Id de la maquina
    private $idMaquina;
    // Id de la empresa
    private $idEmpresa;
    // Insumo
    private $insumo;
    // Costo del insumo
    private $costo;
    // Costo del insumo por minuto
    private $costoPorMinuto;

    public function setId($id) {
        $this->id = $id;
    }

    public function getId() {
        return $this->id;
    }

    public function setIdMaquina($idMaquina) {
        $this->idMaquina = $idMaquina;
    }

    public function getIdMaquina() {
        return $this->idMaquina;
    }

    public function setIdEmpresa($idEmpresa) {
        $this->idEmpresa = $idEmpresa;
    }

    public function getIdEmpresa() {
        return $this->idEmpresa;
    }

    public function getInsumo() {
        return $this->insumo;
    }

    public function setInsumo($insumo) {
        $this->insumo = $insumo;
    }

    public function getCosto() {
        return $this->costo;
    }

    public function setCosto($costo) {
        $this->costo = $costo;
    }

    public function getCostoPorMinuto() {
        return $this->costoPorMinuto;
    }

    public function setCostoPorMinuto($costoPorMinuto) {
        $this->costoPorMinuto = $costoPorMinuto;
    }


    /**
     * Convierte esta clase en un objeto JSON
     *
     * @access public
     * @return mixed
     */
    public function jsonSerialize()
    {
        return get_object_vars($this);
    }
}