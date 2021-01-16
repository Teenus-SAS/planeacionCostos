<?php

/**
 * @author Teenus SAS>
 * @github Teenus SAS
 * Este Script subir el archivo de imagen del bpm
 * Se llama por metodo 
 * @method POST FILE
 * @param bpm Archivo de imagen para montar como bpm
 * 
 *
 */

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";

session_start();
$return = array('ok' => TRUE);
$nombre_archivo = $_FILES['bpm']['name'];
$tipo_archivo = $_FILES['bpm']['type'];
$tamano_archivo = $_FILES['bpm']['size'];
$tmp_archivo = $_FILES['bpm']['tmp_name'];
$archivador = $_SERVER['DOCUMENT_ROOT'] . '/upload/img/' . $nombre_archivo;
$ruta = "http://" . $_SERVER["HTTP_HOST"] . "/upload/img/" . $nombre_archivo;
if (!move_uploaded_file($tmp_archivo, $archivador)) {
    $return = array('ok' => FALSE, 'msg' => "Ocurrio un error al subir el archivo. " . $nombre_archivo . " No pudo guardarse.", 'status' => 'error');
}
if ($return["ok"]) {
    $user = unserialize($_SESSION["user"]);
    $companyDao = new CompanyDao();
    $company = $user->getCompany();
    $company->setBpm($ruta);
    if ($companyDao->update($company) > 0) {
        $user->setCompany($company);
        $_SESSION["user"] = serialize($user);
        $return = array('ok' => TRUE);
    } else {
        $return = array('ok' => FALSE, 'msg' => "Ocurrio un error al subir el archivo. " . $nombre_archivo . " No pudo guardarse.", 'status' => 'error');
    }
}
header('Content-Type: application/json');
echo json_encode($return);