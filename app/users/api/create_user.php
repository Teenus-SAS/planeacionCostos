<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";

session_start();
header("Content-Type: application/json");
$response = new stdClass();
if(isset($_POST["email"]) && isset($_POST["username"])  && isset($_POST["firstname"])  && isset($_POST["lastname"]) && isset($_POST["rol"])){
  if (isset($_SESSION["user"])) {
    $user = unserialize($_SESSION["user"]);
    $userDao = new UserDao();
    $newUser = new User();

    $newUser->setEmail($_POST["email"]);
    $newUser->setUsername($_POST["username"]);
    $newUser->setFirstname($_POST["firstname"]);
    $newUser->setLastname($_POST["lastname"]);
    $password = generar_password_complejo(10);
    $newUser->setPassword(hash("sha256", $password));
    $newUser->setActive(false);
    $newUser->setCompany($user->getCompany()->getId());
    $newUser->setRolId($_POST["rol"]);
    if ($userDao->save($newUser) > 0) {
      $response->status = true;
      $ch = curl_init();
      $protocol =  isset($_SERVER["HTTPS"]) ? 'https' : 'http';
      curl_setopt($ch, CURLOPT_URL, "$protocol://" . $_SERVER["HTTP_HOST"] . "/admin/api/email_creation.php");
      curl_setopt($ch, CURLOPT_POST, TRUE);
      curl_setopt($ch, CURLOPT_POSTFIELDS, "username=" . $newUser->getUsername() . "&fisrtname=" . $newUser->getUsername() . "&lastname=" . $newUser->getUsername() . "&password=" . $password);
  
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      $remote_server_output = curl_exec($ch);
  
      curl_close($ch);
    } else {
      $response->status = false;
      $response->errorno = 1064;
    }
    echo json_encode($response);
  } else {
    http_response_code(401);
    exit;
  }
}else{
  http_response_code(400);
}



function generar_password_complejo($largo)
{
  $cadena_base =  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  $cadena_base .= '0123456789';
  $cadena_base .= '!@#%&*().<>?';

  $password = '';
  $limite = strlen($cadena_base) - 1;

  for ($i = 0; $i < $largo; $i++)
    $password .= $cadena_base[rand(0, $limite)];

  return $password;
}
