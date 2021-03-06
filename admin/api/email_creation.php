<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once PHPMAILER_PATH . "class.phpmailer.php";
require_once PHPMAILER_PATH . "class.smtp.php";
require_once DB_PATH . "env.php";

$response = new stdClass();
header("Content-Type: application/json");

if (isset($_POST["username"]) && $_POST["password"]) {
    $userDao = new UserDao();
    $user = $userDao->findByUserName($_POST["username"]);
    $name;
    if (isset($_POST["creator"])) {
        $name = ucfirst(explode(" ",$_POST["creator"])[0]);
    } else {
        $name = $user->getUsername();
    }
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
    $mail->Subject = "Creacion de Cuenta"; // Este es el titulo del email.
    $protocol = isset($_SERVER["HTTPS"]) ? 'https' : 'http';
    $mail->Body = "<html>
    <body>
    <img src='$protocol://" . $_SERVER["HTTP_HOST"] . "/upload/img/logo_tezlik.png' width='150'>
    <p>Hola " . $name . ",</p>
    <p>Es un gusto saludarte y esperamos que estés de maravilla. Recientemente solicitaste crear una nueva cuenta en Tezlik por lo que generamos el siguiente usuario y contraseña para tu ingreso:</p>
    <p>Usuario: <b>" . $user->getUsername() . "</b></p>
    <p>Contraseña: <b>" . $_POST["password"] . "</b></p>
    <p><a href='https://" . $_SERVER["HTTP_HOST"] . "/login/'>Haz clic aquí </a> para ingresar a tu cuenta</p>
    
    <p>Nota: Puedes estar seguro de que tu contraseña es segura. 
    Las contraseñas generadas a través de nuestro sitio web solo se envían al 
    correo electrónico de contacto de la cuenta. 
    Si te preocupa la seguridad de tu cuenta o sospechas que alguien está intentando obtener 
    acceso no autorizado, continúa y restablece tu contraseña,
     o ponte en contacto con nosotros en <a href='mailto:soporte@teenus.com.co'>soporte@teenus.com.co</a> y te daremos toda la ayuda que necesites.</p>
     <p>Esperamos que disfrutes usando Tezlik.</p>

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
    http_response_code(400);
}
echo json_encode($response);
