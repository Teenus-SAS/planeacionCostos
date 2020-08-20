<?php

//Creamos el JSON
$json_string = $_POST["json"];
$file = $_SERVER['DOCUMENT_ROOT']. "/resources/youtube_tutorials.json";
file_put_contents($file, $json_string);