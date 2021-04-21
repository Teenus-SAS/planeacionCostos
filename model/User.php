<?php

require_once DAO_PATH . "CompanyDao.php";

class User implements JsonSerializable {
  private $id;
  private $username;
  private $firstname;
  private $lastname;
  private $email;
  private $password;
  private $company;
  private $tokenPass;
  private $rolId;
  private $sessionActive;
  private $createdAt;
  private $active;
  
  public function getId()
  {
    return $this->id;
  }

  /**
   *  cambia el id del usuario
   *
   * @access public
   * @param integer $id nuevo id del usuario
   * @return void
   */
  public function setId($id)
  {
    $this->id = $id;
  }

  /**
   * obtiene el nombre de usuario del usuario
   *
   * @access public
   * @return string
   */
  public function getUsername()
  {
    return $this->username;
  }

  /**
   * Cambia el nombre de usuario del usuario
   *
   * @access public
   * @param string $username nuevo nombre de usuario
   * @return void
   */
  public function setUsername($username)
  {
    $this->username = $username;
  }

  public function getFirstname()
  {
    return $this->firstname;
  }

  public function setFirstname($firstname)
  {
    $this->firstname = $firstname;
  }

  public function getLastname()
  {
    return $this->lastname;
  }

  public function setLastname($lastname)
  {
    $this->lastname = $lastname;
  }

  /**
   * obtiene el email del usuario
   *
   * @access public
   * @return string
   */
  public function getEmail()
  {
    return $this->email;
  }

  /**
   * cambia el email del usuario
   *
   * @access public
   * @param string $email nuevo email del usuario
   * @return void
   */
  public function setEmail($email)
  {
    $this->email = $email;
  }

  /**
   * obtiene la contraseña del usuario
   *
   * @access public
   * @return string
   */
  public function getPassword()
  {
    return $this->password;
  }

  /**
   * Cambia la contraseña del usuario
   *
   * @access public
   * @param string $password nueva contraseña del usuario (estará
   * codificada con sha-256)
   * @return void
   */
  public function setPassword($password)
  {
    $this->password = $password;
  }

  /**
   * obtiene la empresa a la que pertenece el usuario
   *
   * @access public
   * @return Company
   */
  public function getCompany()
  {
    return $this->company;
  }
  
  /**
   * Camabia la empresa a la que pertence el usuario
   *
   * @access public
   * @param Company $company nueva empresa de pertenecia del usuario
   * @return void
   */
  public function setCompany($companyId) {
    $companyDao = new CompanyDao();
    $this->company = $companyDao->findById($companyId);
  }

  public function getTokenPass() {
    return $this->tokenPass;
  }

  /**
   * camabia el token  de recuperacion de contraseña del usuario
   *
   * @access public
   * @param string $tokenPass token de recuperacion de contraseña
   * (este estará encriptado en sha-256)
   * @return void
   */
  public function setTokenPass($tokenPass)
  {
    $this->tokenPass = $tokenPass;
  }

  /**
   * obtiene el id del rol de usuario
   *
   * @access public
   * @return integer
   */
  public function getRolId()
  {
    return $this->rolId;
  }

  /**
   * camabia el id del rol de usuario
   *
   * @access public
   * @param integer $rolId Id del rol que va a tener el usuario
   * @return void
   */
  public function setRolId($rolId)
  {
    $this->rolId = $rolId;
  }

  /**
   * obtiene la bandera para identificar si el usuario se encuentra con una 
   * sesion activa en otro equipo
   *
   * @access public
   * @return boolean
   */
  public function getSessionActive()
  {
    return $this->sessionActive;
  }

  /**
   * Cambia la bandera de identifiacion de sesion activa en otros equipos
   *
   * @access public
   * @param boolean $sessionActive estado de la identifiacion de sesion
   * acitva
   * @return void
   */
  public function setSessionActive($sessionActive)
  {
    $this->sessionActive = $sessionActive;
  }

  /**
   * Obtiene la fecha de creacion del usuario 
   *
   * @access public
   * @return date
   */
  public function getCreatedAt()
  {
    return $this->createdAt;
  }

  /**
   * camabia la fecha ce creacion de usuario
   *
   * @access public
   * @param date $createdAt nueva fecha de cracion de usuario
   * @return void
   */
  public function setCreatedAt($createdAt)
  {
    $this->createdAt = $createdAt;
  }

  /**
   * Obtiene la bandera de identifiacion si el usuario tiene 
   * acceso a la apliacación
   *
   * @access public
   * @return boolean
   */
  public function getActive()
  {
    return $this->active;
  }

  /**
   * Cambia la bandera de indentifiacion si el usuario tiene
   * acceso a la apliacion
   *
   * @access public
   * @param boolean $active bandera de indentifiacion de acceso a la 
   * aplicación
   * @return void
   */
  public function setActive($active)
  {
    $this->active = $active;
  }

  /**
   * Covierte esta clase en un objeto JSON
   *
   * @access public
   * @return mixed
   */
  public function jsonSerialize()
  {
    return get_object_vars($this);
  }
}
