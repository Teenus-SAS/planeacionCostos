<?php

$uri = $_SERVER["REQUEST_URI"];


if (!isset($_SESSION)) {
  session_start();
  if (!isset($_SESSION["admin"])) {
    include "login.php";
  } else {
    include "admin.php";
  }
}
