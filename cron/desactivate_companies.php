<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";

$db = new DBOperator($_ENV["db_host"], $_ENV["db_user"], $_ENV["db_name"], $_ENV["db_pass"]);

$db->connect();
$db->consult("UPDATE `empresas` SET `licencia_activa` = 0 WHERE DATEDIFF(NOW(), `expiracion_licencia`) >= 0");
$db->close();
