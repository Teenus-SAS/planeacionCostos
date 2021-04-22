<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "AdminDao.php";
$response = new stdClass();
header("Content-Type: application/json");

if (isset($_POST["email"]) && isset($_POST["password"])) {
  $adminDao = new AdminDao();
  $admin = $adminDao->findByEmail($_POST["email"]);
  if ($admin != null) {
    if ($admin->getPassword() == hash("sha256", $_POST["password"])) {
      session_start();
      $response->status = true;
      $_SESSION["admin"] = serialize($admin);
    } else {
      $response->status = false;
      $response->message = "El usuario o contraseña no son correctos";
    }
  } else {
    $response->status = false;
    $response->message = "El usuario o contraseña no son correctos";
  }
} else {
  http_response_code(400);
}
echo json_encode($response);
