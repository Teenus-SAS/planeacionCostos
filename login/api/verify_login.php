<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once SESSION_PATH . "MySessionHandler.php";
require_once DAO_PATH . "UserDao.php";
session_set_save_handler(new MySessionHandler(), true);
$response = new stdClass();
header("Content-Type: application/json");

if (isset($_POST["username"]) && isset($_POST["password"])) {
  $userDao = new UserDao();
  $user = $userDao->findByUserName($_POST["username"]);
  if ($user != null) {
    $now = time();
    $expirationDate = strtotime($user->getCompany()->getLicenseExpiration());
    if (time() >= $expirationDate) {
      $user->getCompany()->setActiveLicense(false);
    } else {
      $user->getCompany()->setActiveLicense(true);
    }
    if ($user->getCompany()->getActiveLicense()) {
      if ($user->getActive()) {
        if ($user->getPassword() == hash("sha256", $_POST["password"])) {
          if ($user->getSessionActive()) {
            $response->status = false;
            $response->typeError = "userActive";
            $response->message = "Ya existe una sesión iniciada con este usuario en otro equipo";
          } else {
            session_start();
            $response->status = true;
            $_SESSION["user"] = serialize($user);
            $_SESSION["timeout"] = time();
            $userDao->activeSession($user);
            if (isset($_POST["remember-me"])) {
              setcookie("username_remember_me", $_POST["username"], time() + (60 * 60 * 24 * 365), "/", $_SERVER["HTTP_HOST"]);
            }
          }
        } else {
          $response->status = false;
          $response->typeError = "password";
          $response->message = "Usuario y/o contraseña incorrectos";
        }
      } else {
        $response->status = false;
        $response->typeError = "license";
        $response->message = "Este usuario esta inactivo";
      }
    } else {
      $response->status = false;
      $response->typeError = "license";
      $response->message = "La licencia de la empresa ha caducado";
    }
  } else {
    $response->status = false;
    $response->typeError = "user";
    $response->message = "Usuario y/o contraseña incorrectos";
  }
} else {
  http_response_code(400);
}
echo json_encode($response);
