<?php
/**
 * Clase modelo de administrador
 * 
 * 
 * @author Alexis Holguin <wholginmor@uniminunto.edu.co>
 * @github MoraHol
 * @package model 
 * 
 */
class Admin implements JsonSerializable
{
    /**
     * id del aministrador
     *
     * @access private
     * @var integer
     */
    private $id;
    /**
     * Email del administrador
     *
     * @access private
     * @var string
     */
    private $email;
    /**
     * Contraseña encriptada del administrador
     *
     * @access private
     * @var string
     */
    private $password;
    /**
     * token de recuperacion de contraseña del adminstrador
     *
     * @access private
     * @var string
     */
    private $tokenPass;

    /**
     * Obtiene el id del administrador
     * 
     * @access public
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Cambia el id del adminsitrador
     *
     * @access public
     * @param integer $id nuevo id del administrador
     * @return void
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * Obtiene el email del administrador
     *
     * @access public
     * @return string
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * cambia el email del adminsitrador
     *
     * @access public
     * @param string $email nuevo email del administrador
     * @return void
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    /**
     * Obtiene la contraseña del administrador
     *
     * @access public
     * @return string
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * Cambia la contraseña del administrador
     *
     * @access public
     * @param string $password nueva contraseña
     * @return void
     */
    public function setPassword($password)
    {
        $this->password = $password;
    }

    /**
     * Obtiene el token de recuperacion de contraseña del administrador
     *
     * @access public
     * @return string
     */
    public function getTokenPass()
    {
        return $this->tokenPass;
    }

    /**
     * Cambia el token de recuperación de contraseña del administrador
     *
     * @access public
     * @param string $tokenPass nuevo token de recuperación
     * @return void
     */
    public function setTokenPass($tokenPass)
    {
        $this->tokenPass = $tokenPass;
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
