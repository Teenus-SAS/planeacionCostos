<?php

class ServicioExterno implements JsonSerializable
{
    private $id;
    private $nombreServicio;
    private $costo;
    private $idProducto;
    private $nombreProducto;
    private $idEmpresa;

    public function setId($id)
    {
        $this->id = $id;
    }

    public function getId()
    {
        return $this->id;
    }

    public function setCosto($costo)
    {
        $this->costo = $costo;
    }

    public function getCosto()
    {
        return $this->costo;
    }

    public function setIdProducto($idProducto)
    {
        $this->idProducto = $idProducto;
    }

    public function setnombreServicio($nombreServicio)
    {
        $this->nombreServicio = $nombreServicio;
    }

    public function getnombreServicio()
    {
        return $this->nombreServicio;
    }

    public function getIdProducto()
    {
        return $this->idProducto;
    }

    public function setnombreProducto($nombreProducto)
    {
        $this->nombreProducto = $nombreProducto;
    }

    public function getnombreProducto()
    {
        return $this->nombreProducto;
    }

    public function setIdEmpresa($idEmpresa)
    {
        $this->idEmpresa = $idEmpresa;
    }

    public function getIdEmpresa()
    {
        return $this->idEmpresa;
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
