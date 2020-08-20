<?php
header('Content-Type: application/json');
$data = file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/resources/youtube_tutorials.json');
echo $data;
