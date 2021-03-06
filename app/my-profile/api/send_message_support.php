<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once PHPMAILER_PATH . "class.phpmailer.php";
require_once PHPMAILER_PATH . "class.smtp.php";
require_once DB_PATH . "env.php";

$response = new stdClass();
header("Content-Type: application/json");
session_start();

if (isset($_POST["subject"]) && isset($_POST["content"]) && isset($_SESSION["user"])) {
    $userDao = new UserDao();
    $user = unserialize($_SESSION["user"]);
    $mail = new PHPMailer(true);
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
    $mail->AddAddress("soporte@teenus.com.co");
    $mail->Subject = $_POST["subject"]; // Este es el titulo del email.
    $mail->Body = $_POST["content"] . "<p>Usuario: " . $user->getUsername() . "</p>
    <p>Empresa: " . $user->getCompany()->getTradename() . "</p>";
    $mail->SMTPSecure = 'tls';
    try {
        $mailSended = $mail->send();

        if ($mailSended) {
            http_response_code(200);
            $response->status = true;
            $response->message = "Se ha enviado un correo de Recuperación";
        } else {
            http_response_code(500);
            $response->message = "No se ha podido enviar el Mensaje Por Favor intentalo de nuevo";
            $response->errorEmail = $mail->ErrorInfo;    
        }
    } catch (phpmailerException $ex) {
        http_response_code(500);
        $response->message = "No se ha podido enviar el Mensaje Por Favor intentalo de nuevo";
        $response->errorEmail = $mail->ErrorInfo;
    }
} else {
    http_response_code(400);
    var_dump($_SESSION);
}
echo json_encode($response);
