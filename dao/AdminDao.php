<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once MODEL_PATH . "Admin.php";


class AdminDao
{
  private $db;


  public function __construct()
  {
    $this->db = new DBOperator($_ENV["db_host"], $_ENV["db_user"], $_ENV["db_name"], $_ENV["db_pass"]);
  }

  public function findById($id)
  {
    $this->db->connect();
    $query = "SELECT * FROM `admins` WHERE `id_admin` = $id";
    $adminDB = $this->db->consult($query, "yes");
    $adminDB = $adminDB[0];
    $admin = new Admin();
    $admin->setId($adminDB["id_admin"]);
    $admin->setEmail($adminDB["email"]);
    $admin->setPassword($adminDB["password"]);
    $admin->setTokenPass($adminDB["token_pass"]);
    $this->db->close();
    return $admin;
  }
  /**
   * Encontrar un usuario por si email
   *
   * @param string $email El email por el cual se desea buscar el administrador
   * @return Admin|null
   */
  public function findByEmail($email)
  {
    $this->db->connect();
    $query = "SELECT  `id_admin` FROM `admins` WHERE `email` = '$email'";
    $adminDB = $this->db->consult($query, "yes");
    if (count($adminDB) > 0) {
      return $this->findById($adminDB[0]["id_admin"]);
    } else {
      return null;
    }
  }

  /**
   * Actulizar la infromacion de un Administrador
   *
   * @param Admin $admin Objeto Admin que se desea actualizar
   * @return Integer numero de tuplas afecatadas en la actualización
   */
  public function update($admin)
  {
    $this->db->connect();
    $query = "UPDATE `admins` SET `password` = '" . $admin->getPassword() . "',
    `token_pass` = '" . $admin->getTokenPass() . "' 
    WHERE `admins`.`id_admin` = " . $admin->getId();
    return $this->db->consult($query);
  }

  /**
   * Encuentra todos los administradores de la aplicación
   *
   * @return Admin[]
   */
  public function findAll()
  {
    $this->db->connect();
    $query = "SELECT  `id_admin` FROM `admins`";
    $adminsDB = $this->db->consult($query, "yes");
    $admins = [];
    if (count($adminsDB) > 0) {
      foreach ($adminsDB as $adminDB) {
        array_push($admins, $this->findById($adminDB["id_admin"]));
      }
    }
    return $admins;
  }
}
