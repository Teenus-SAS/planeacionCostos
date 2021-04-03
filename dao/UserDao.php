<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once MODEL_PATH . "User.php";
require_once DAO_PATH . "CompanyDao.php";

/**
 * Esta clase Es el DAO(Data Access Object) para usuarios
 * 
 * @author Teenus SAS>
 * @version 1.0
 * @uses DBOperator, User, CompanyDao
 * @package Dao
 * 
 */
class UserDao
{

  /**
   * Objeto de comunicacion con la base de datos
   *
   * @access private
   * @var DBOperator
   */
  private $db;

  public function __construct()
  {
    $this->db = new DBOperator($_ENV["db_host"], $_ENV["db_user"], $_ENV["db_name"], $_ENV["db_pass"]);
    $this->companyDao = new CompanyDao();
  }

  /**
   * Encuentra un usuario por id
   *
   * @param integer $id id del usuario
   * @return User usuario buscado
   */
  public function findById($id)
  {
    $this->db->connect();
    $query = "SELECT * FROM `users` WHERE `id_user` = $id";
    $userDB = $this->db->consult($query, "yes");
    if (count($userDB) > 0) {
      $userDB = $userDB[0];
    } else {
      return null;
    }
    $user = new User();
    $user->setId($userDB["id_user"]);
    $user->setUsername($userDB["username"]);
    $user->setFirstname($userDB["firstname"]);
    $user->setLastname($userDB["lastname"]);
    $user->setEmail($userDB["email"]);
    $user->setPassword($userDB["password"]);
    $user->setCompany($this->companyDao->findById($userDB["empresas_id_empresa"]));
    $user->setTokenPass($userDB["token_pass"]);
    $user->setRolId($userDB["roles_users_idroles_users"]);
    $user->setSessionActive((bool) $userDB["session_active"]);
    $user->setActive((bool) $userDB["active"]);
    $user->setCreatedAt(date('Y-m-d', strtotime($userDB["created_at"])));
    $this->db->close();
    return $user;
  }

  /**
   * Encuentra todos los usuarios de una empresa
   *
   * @param integer $idCompany id de la empresa
   * @return User[] listado de usuarios de la empresa
   */
  public function findByCompany($idCompany)
  {
    $this->db->connect();
    $query = "SELECT `id_user` FROM `users` WHERE  `empresas_id_empresa` = $idCompany";
    $usersDB = $this->db->consult($query, "yes");
    $users = [];
    if (count($usersDB) > 0) {
      foreach ($usersDB as  $userDB) {
        array_push($users, $this->findById($userDB["id_user"]));
      }
    }
    return $users;
  }

  /**
   * Encuentra un usuario por su nombre de usuario
   *
   * @param string $username nombre de usuario
   * @return User|null usuario buscado
   */
  public function findByUserName($username)
  {
    $this->db->connect();
    $query = "SELECT `id_user`  FROM `users` WHERE `username`= '$username'";
    $id = $this->db->consult($query, "yes");
    if (count($id) > 0) {
      $id = $id[0]["id_user"];
      return $this->findById($id);
    } else {
      return null;
    }
  }

  /**
   * Encuentra un usuario por su email
   *
   * @param string $email email del usuario
   * @return User|null usuario buscado
   */
  public function findByEmail($email)
  {
    $this->db->connect();
    $query = "SELECT `id_user`  FROM `users` WHERE `email`= '$email'";
    $id = $this->db->consult($query, "yes");
    if (count($id) > 0) {
      $id = $id[0]["id_user"];
      return $this->findById($id);
    } else {
      return null;
    }
  }

  /**
   * Actualiza un usuario en la base de datos
   *
   * @param User $user usuario que se desea actualizar
   * @return integer numero de tuplas afectadas
   */
  public function update($user)
  {
    $this->db->connect();
    $query = "UPDATE `users` SET `email` = '" . $user->getEmail() . "', `firstname` = '" . $user->getFirstName() . "', `lastname` = '" . $user->getLastname() . "', `password` = '" . $user->getPassword() . "',
      `token_pass` = '" . $user->getTokenPass() . "', 
      `roles_users_idroles_users` = '" . $user->getRolId() . "',
      `active` = '" . (int) $user->getActive() . "'
      WHERE `users`.`id_user` = " . $user->getId() . " AND 
      `users`.`empresas_id_empresa` = " . $user->getCompany()->getId();
    return $this->db->consult($query);
  }

  /**
   * Crea un usuario en la base de datos
   *
   * @param User $user usuario que se desea crear
   * @return integer  numero de tuplas afectadas
   */
  public function save($user)
  {
    $this->db->connect();
    $query = "INSERT INTO `users` (`id_user`, `username`, `firstname`, `lastname`, `email`, `password`,
      `created_at`, `empresas_id_empresa`, `token_pass`, 
      `roles_users_idroles_users`, `session_active`, `active`) 
      VALUES (NULL, '" . $user->getUsername() . "', '" . $user->getFirstname() . "',
      '" . $user->getLastname() . "', '" . $user->getEmail() . "',
      '" . $user->getPassword() . "', current_timestamp(),
      '" . $user->getCompany()->getId() . "', 'asasas', '" . $user->getRolId() . "',
      '0', '" . $user->getActive() . "')";
    $status = $this->db->consult($query);
    $this->db->close();
    return $status;
  }

  /**
   * Cambiar la bandera de sesion de un usuario a activa
   *
   * @param User $user usuario al que se quiere cambiar la bandera
   * @return integer numero de tuplas afectadas
   */
  public function activeSession($user)
  {
    $this->db->connect();
    $query = "UPDATE `users` SET `session_active` = '1' WHERE `users`.`id_user` = " . $user->getId();
    $user->setSessionActive(true);
    return $this->db->consult($query);
  }

  /**
   * Cambiar la bandera de sesion de un usuario a descativa
   *
   * @param User $user usuario al que se quiere cambiar la bandera
   * @return integer numero de tuplas afectadas
   */
  public function destroySession($user)
  {
    $this->db->connect();
    $query = "UPDATE `users` SET `session_active` = '0' WHERE `users`.`id_user` = " . $user->getId();
    $user->setSessionActive(false);
    return $this->db->consult($query);
  }

  public function delete($id){
    $this->db->connect();
    $query = "DELETE FROM `users` WHERE `users`.`id_user` = $id";
    return $this->db->consult($query);
  }

  public function destroySessionByUsername($username)
  {
    $this->db->connect();
    /* $query = "UPDATE `users` SET `session_active` = '0' WHERE `users`.`username` = " . '$username'; */
    $query = "UPDATE `users` SET `session_active` = '0' WHERE `username` = '$username'";
 /*    $query = "SELECT `id_user`  FROM `users` WHERE `username`= '$username'"; */
/*     $user->setSessionActive(false); */
    return $this->db->consult($query);
  }
}
