<?php

//Creamos el JSON
$json_string = $_POST["json"];
$file = $_SERVER['DOCUMENT_ROOT']. "/app/config-general/api/salary_min.json";
file_put_contents($file, $json_string);