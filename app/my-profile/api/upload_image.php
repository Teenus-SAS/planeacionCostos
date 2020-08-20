<?php
/*
* Desarrollada por Alexis Holguin(github: MoraHol)
*/
$uploads_dir = $_SERVER['DOCUMENT_ROOT'] . "/upload/img";
$host = $_SERVER["HTTP_HOST"];
if (isset($_FILES["photo"])) {
	// fecha para crear timestamp
	$date = new DateTime();
	// nombre de la imagen
	$name = $_FILES["photo"]["name"];
	// sacar extencion de la imagen
	$extension = explode(".", $name);
	$ext = $extension[1]; //AQUI LA EXTENSION
	// nuevo nombre de la imagen
	$name = "IMG-" . $date->getTimestamp() . "-" . uniqid() . "." . $ext;
	// ruta temporal de subida
	$tmp_name = $_FILES["photo"]["tmp_name"];
	$url = "$uploads_dir/$name";
	if (move_uploaded_file($tmp_name, $url)) {
		header('Content-type: application/json');
		$url = new stdClass();
		$protocol =  isset($_SERVER["HTTPS"]) ? 'https' : 'http';
		$url->link =  "$protocol://$host/upload/img/$name";
		echo json_encode($url);
	} else {
		http_response_code(400);
	}
}
