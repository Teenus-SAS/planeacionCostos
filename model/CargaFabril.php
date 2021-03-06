<?php

class CargaFabril implements JsonSerializable
{
    // Id de la carga fabril
    private $id;
    // Id de la maquina
    private $idMaquina;
    // nombre de la maquina
    private $nombreMaquina;
    // id de la empresa
    private $idEmpresa;
    // mantenimiento
    private $mantenimiento;
    // Costo del mantenimiento
    private $costo;
    // Costo del mantenimiento por minuto
    private $costoPorMinuto;

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setIdMaquina($idMaquina)
    {
        $this->idMaquina = $idMaquina;
    }

    public function getIdMaquina()
    {
        return $this->idMaquina;
    }

    public function setnombreMaquina($nombreMaquina)
    {
        $this->nombreMaquina = $nombreMaquina;
    }

    public function getnombreMaquina()
    {
        return $this->nombreMaquina;
    }

    public function setIdEmpresa($idEmpresa)
    {
        $this->idEmpresa = $idEmpresa;
    }

    public function getIdEmpresa()
    {
        return $this->idEmpresa;
    }

    public function getMantenimiento()
    {
        return $this->mantenimiento;
    }

    public function setMantenimiento($mantenimiento)
    {
        $this->mantenimiento = $mantenimiento;
    }

    public function getCosto()
    {
        return $this->costo;
    }

    public function setCosto($costo)
    {
        $this->costo = $costo;
    }

    public function getCostoPorMinuto()
    {
        return $this->costoPorMinuto;
    }

    public function setCostoPorMinuto($costoPorMinuto)
    {
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
