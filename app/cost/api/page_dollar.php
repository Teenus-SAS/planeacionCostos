<?php
$cliente = curl_init();
curl_setopt($cliente, CURLOPT_URL, "https://themoneyconverter.com/ES/USD/COP");
curl_setopt($cliente, CURLOPT_HEADER, 0);
curl_setopt($cliente, CURLOPT_RETURNTRANSFER, true); 

$contenido = curl_exec($cliente);
echo $contenido;
curl_close($cliente);