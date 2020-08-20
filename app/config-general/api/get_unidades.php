<?php

/**
 * @author Alexis Holguin <wholguinmor@uniminuto.edu.co>
 * @github MoraHol
 * Este Script obtener todos las unidades creadas por la empresa 
 * Se llama por metodo 
 * @method GET
 * 
 * @responsesCodes
 *  200: en caso de que el calculo sea exitoso
 *  500: en caso de error en el servidor
 *  401: en caso de que no exista una sesion iniciada
 * 
 * 
 */

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";

$db = new DBOperator($_ENV["db_host"], $_ENV["db_user"], $_ENV["db_name"], $_ENV["db_pass"]);

$db->connect();
$query = "SELECT `unidad` FROM `materiales` GROUP BY `unidad`";
$unitsDB = $db->consult($query, "yes");
$units = [];
foreach ($unitsDB as  $unitDB) {
    array_push($units, $unitDB["unidad"]);
}
header("Content-Type: application/json");
echo json_encode($units);
