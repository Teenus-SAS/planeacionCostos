<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "AdminDao.php";
require_once PHPMAILER_PATH . "class.phpmailer.php";
require_once PHPMAILER_PATH . "class.smtp.php";
require_once DB_PATH . "env.php";

$response = new stdClass();
header("Content-Type: application/json");
// token que se le asignara al usuario para el reestablecimineto de cuenta
$token = bin2hex(openssl_random_pseudo_bytes(128));

if (isset($_POST["email"])) {
  $adminDao = new AdminDao();
  // buscar al usuario por nombre de usuario
  $admin = $adminDao->findByEmail($_POST["email"]);
  if ($admin != null) {
    $admin->setTokenPass($token);
    $adminDao->update($admin);
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
    $mail->AddAddress($admin->getEmail());
    $mail->Subject = "Recordar Contraseña"; // Este es el titulo del email.
    $protocol = isset($_SERVER["HTTPS"]) ? 'https' : 'http';
    $mail->Body = "<html>
    <body>
    <img src='$protocol://" . $_SERVER["HTTP_HOST"] . "/img/logo_tezlik.png' width='150'>
    <p>Hola,</p>
    <p>Recientemente solicitaste recordar tu contraseña por lo que, para mayor seguridad te recomendamos 
    crear nueva contraseña para ingresar a Tezlik con el correo <b>" . $admin->getEmail() . "</b></p>

    <p>Si deseas cambiarla 
    <a href='https://" . $_SERVER["HTTP_HOST"] . "/admin/recover_pass.php?id=" . $admin->getId() . "&token=" . $token . "'>Haga clic aquí </a> 
    para crear tu nueva contraseña</p>
    <p>Si solicitaste una nueva contraseña puedes estar tranquilo que es segura. 
    Las contraseñas generadas a través de nuestro sitio web solo se envían al correo electrónico 
    del contacto de la cuenta. Si te preocupa tu seguridad! o sospechas que alguien está intentando 
    obtener acceso no autorizado a tu cuenta, continúa y restablece tu contraseña, 
    o ponte en contacto con <a href='mailto:soporte@teenus.com.co'>soporte@teenus.com.co</a> y te daremos toda la
    ayuda que necesites.</p>
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
      $response->status = true;
      $response->message = "Se ha enviado un correo de Recuperación";
    }
  } else {
    $response->status = false;
    $response->typeError = "email";
    $response->message = "El correo no existe";
  }
} else {
  http_response_code(400);
}
echo json_encode($response);
