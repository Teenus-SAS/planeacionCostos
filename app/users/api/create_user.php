<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");
$reponse = new stdClass();
if(isset($_POST["email"]) && isset($_POST["username"]) && isset($_POST["rol"])){
  if (isset($_SESSION["user"])) {
    $user = unserialize($_SESSION["user"]);
    $userDao = new UserDao();
    $newUser = new User();
    $newUser->setEmail($_POST["email"]);
    $newUser->setUsername($_POST["username"]);
    $password = generar_password_complejo(10);
    $newUser->setPassword(hash("sha256", $password));
    $newUser->setActive(false);
    $newUser->setCompany($user->getCompany());
    $newUser->setRolId($_POST["rol"]);
    if ($userDao->save($newUser) > 0) {
      $reponse->status = true;
  
      // abrimos la sesión cURL
      $ch = curl_init();
      $protocol =  isset($_SERVER["HTTPS"]) ? 'https' : 'http';
      // definimos la URL a la que hacemos la petición
      curl_setopt($ch, CURLOPT_URL, "$protocol://" . $_SERVER["HTTP_HOST"] . "/admin/api/email_creation.php");
      // indicamos el tipo de petición: POST
      curl_setopt($ch, CURLOPT_POST, TRUE);
      // definimos cada uno de los parámetros
      curl_setopt($ch, CURLOPT_POSTFIELDS, "username=" . $newUser->getUsername() . "&password=" . $password);
  
      // recibimos la respuesta y la guardamos en una variable
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      $remote_server_output = curl_exec($ch);
  
      // cerramos la sesión cURL
      curl_close($ch);
    } else {
      $response->status = false;
      $reponse->errorno = 1064;
    }
    echo json_encode($reponse);
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
