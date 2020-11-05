<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "AdminDao.php";
require_once PHPMAILER_PATH . "class.phpmailer.php";
require_once PHPMAILER_PATH . "class.smtp.php";
require_once DB_PATH . "env.php";

$response = new stdClass();
header("Content-Type: application/json");

if (isset($_POST["username"])) {
    $userDao = new UserDao();
    $adminDao = new AdminDao();
    $user = $userDao->findByUserName($_POST["username"]);
    $admins = $adminDao->findAll();
    $mail = new PHPMailer();
    $mail->isSMTP();
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
    foreach ($admins as  $admin) {
        $mail->AddAddress($admin->getEmail());    
    }
    $mail->Subject = "Creacion de Cuenta"; // Este es el titulo del email.
    $mail->Body = "<html>
    <body>
    <p>Hola,</p>
    <p>Se ha creado un nuevo usuario para la empresa: <b>". $user->getCompany()->getTradename()." </b></p>
    <p>Nombre de usuario: <b> ".$user->getUsername()."</b> </p>
    </body>
    </html>
    ";
    $mail->SMTPSecure = 'tls';
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
