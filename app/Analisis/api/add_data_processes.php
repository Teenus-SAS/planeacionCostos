<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ProductDao.php";
require_once DAO_PATH . "ProcessDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");
if (isset($_SESSION["user"])) {
    $processDao = new ProcessDao();
    isset($_POST["tiempo_aislamiento"]);
    isset($_POST["tiempo_operacion"]);
    isset($_POST["numero_maquinas"]);
    isset($_POST["porcentaje_rechazo"]);
    isset($_POST["numero_turnos"]);
    isset($_POST["distancia"]);
    isset($_POST["disponibilidad"]);
    isset($_POST["mantenimiento_correctivo"]);
    isset($_POST["paradas_menores"]);
    $resquest = $processDao->saveDataProcess($_POST['id_proceso'],$_POST['tiempo_aislamiento'],$_POST["tiempo_operacion"], $_POST["numero_maquinas"],$_POST["porcentaje_rechazo"],$_POST["numero_turnos"],$_POST["distancia"],$_POST["disponibilidad"],$_POST["mantenimiento_correctivo"],$_POST["paradas_menores"]); 
}