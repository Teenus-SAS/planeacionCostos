<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
class MySessionHandler extends \SessionHandler
{
  public function __construct()
  {
    $this->userDao = new UserDao();
  }
  public function open($save_path, $session_name)
  {
    if (isset($_SESSION["user"])) {
      $user = unserialize($_SESSION["user"]);
      $this->userDao->activeSession($user);
    }
    return parent::open($save_path, $session_name);
  }
  public function read($session_id)
  {
    if (isset($_SESSION["user"])) {
      $user = unserialize($_SESSION["user"]);
      $this->userDao->activeSession($user);
    }
    return parent::read($session_id);
  }
  /* Métodos */
  /* public function close()
  {
    if (isset($_SESSION["user"])) {
      $user = unserialize($_SESSION["user"]);
      $this->userDao->destroySession($user);
    }
    return parent::close();
  } */
  public function destroy($session_id)
  {
    if (isset($_SESSION["user"])) {
      $user = unserialize($_SESSION["user"]);
      $this->userDao->destroySession($user);
    }
    return parent::destroy($session_id);
  }
}

