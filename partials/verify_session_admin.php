<?php
include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once SESSION_PATH . "MySessionHandler.php";
require_once DAO_PATH . "AdminDao.php";

if (!isset($_SESSION)) {
  session_start();
  if (!isset($_SESSION["admin"])) {
    header("Location: /admin");
  } else {
    $admin = unserialize($_SESSION["admin"]);
  }
}
