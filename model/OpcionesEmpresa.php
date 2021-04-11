<?php

class OpcionesEmpresa implements JsonSerializable {
    
    private $idEmpresa;
    // 0 - directa
    // 1 - volumen
    private $tipoDistribucion;

    public function setIdEmpresa($id) {
        $this->idEmpresa = $id;
    }

    public function getIdEmpresa() {
        return $this->idEmpresa;
    }

    public function setTipoDistribucion($dist) {
        $this->tipoDistribucion = $dist;
    }

    public function getTipoDistribucion() {
        return $this->tipoDistribucion;
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