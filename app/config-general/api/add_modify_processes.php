<?php

include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DB_PATH . "DBOperator.php";
require_once DB_PATH . "env.php";
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ProcessDao.php";

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $processDao = new ProcessDao();
  if (isset($_POST["optionProceso"])) {
    if (isset($_POST["proceso"])) {
      if ($_POST["proceso"] != "") {
        if ($_POST["optionProceso"] == "option1") {
          $process = new Process();
          $process->setIdCompany($user->getCompany()->getId());
          $process->setName($_POST["proceso"]);
          if ($processDao->save($process) > 0) {
            http_response_code(201);
          } else {
            http_response_code(500);
          }
        } else {
          if (isset($_POST['proceso-id'])) {
            $process = $processDao->findById($_POST["proceso-id"]);
            $process->setName($_POST["proceso"]);
            if ($processDao->update($process) > 0) {
              http_response_code(200);
            } else {
              http_response_code(500);
            }
          }
        }
      } else {
        http_response_code(400);
      }
    } else {
      http_response_code(400);
    }
  } else {
    http_response_code(412);
  }
} else {
  http_response_code(401);
  exit;
}
