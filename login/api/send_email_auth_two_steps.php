<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once PHPMAILER_PATH . "class.phpmailer.php";
require_once PHPMAILER_PATH . "class.smtp.php";
require_once DB_PATH . "env.php";

session_start();
$response = new stdClass();
header("Content-Type: application/json");
// token que se le asignara al usuario para el reestablecimineto de cuenta

if (isset($_POST["code"]) && isset($_SESSION["user_aux_auth"])) {
  $user = unserialize($_SESSION["user_aux_auth"]);
  $mail = new PHPMailer();
  $mail->isSMTP();  
   $mail->smtpConnect([
      'ssl' => [
           'verify_peer' => false,
           'verify_peer_name' => false,
           'allow_self_signed' => true
       ]
       ]);
  $mail->SMTPAuth = true;
  $mail->Port = $_ENV["smtpPort"];
  $mail->IsHTML(true);
  $mail->CharSet = "utf-8";
  // VALORES A MODIFICAR //
  $mail->Host = $_ENV["smtpHost"];
  $mail->Username = $_ENV["smtpEmail"];
  $mail->Password = $_ENV["smtpPass"];
  $mail->From = $_ENV["smtpEmail"]; // Email desde donde envio el correo.
  $mail->FromName = 'Tezlik';
  $mail->AddAddress($user->getEmail());
  $mail->Subject = "Protección de Cuenta"; // Este es el titulo del email.
  $protocol = isset($_SERVER["HTTPS"]) ? 'https' : 'http';
  $mail->Body = "<html>
    <body>
    <img src='$protocol://" . $_SERVER["HTTP_HOST"] . "upload/img/logo_tezlik.png' width='150'>
    <p>Hola, ¿Quieres Iniciar Sesion?
    </p>

    <p>Ingresa el siguiente código: " . $_POST["code"] . "</p>
     <p>Esperamos que disfrute usando Tezlik.</p>

     <p>Saludos,</p>
     
     <p>El Equipo de Teenus</p>
    </body>
    </html>
    ";
  $mail->SMTPSecure = 'ssl';
  if (!$mail->send()) {
    http_response_code(500);
    $response->message = "No se ha podido enviar el Mensaje Por Favor intentalo de nuevo";
    $response->errorEmail = $mail->ErrorInfo;
  } else {
    http_response_code(200);
    $response->email = $user->getEmail();
    $response->status = true;
    $response->message = "Se ha enviado un correo de Recuperación";
  }
} else {
  http_response_code(400);
}
echo json_encode($response);
