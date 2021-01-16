<?php


include_once($_SERVER['DOCUMENT_ROOT'] . '/dirs.php');
require_once DAO_PATH . "UserDao.php";
require_once DAO_PATH . "ProductDao.php";
require_once DAO_PATH . "CompanyDao.php";

/**
 * Script para modificar los gastos de un producto 
 * Con la empresa que tiene iniciada la sesion
 * 
 * @author Teenus SAS>
 * @github Teenus SAS
 * 
 * @param string $ref Referencia del producto
 * @param double $unidades Unidades vendidas del producto al mes
 * @param double $volumen Volumen de ventas del producto al mes
 * @param double $gastosGenerales Gastos denerales de la empresa al mes
 * 
 * @responses
 *  200: La actulización de gastos fue exitosa
 *  400: Faltan parametros 
 *  401: No se encuantra una sesion uniciada
 *  500: Error en el servidor
 */

// revisar si existe session
session_start();
header("Content-Type: application/json");

if (isset($_SESSION["user"])) {
  $user = unserialize($_SESSION["user"]);
  $productDao = new ProductDao();
  $companyDao = new CompanyDao();
  if (
    isset($_POST["ref"]) && isset($_POST["unidades"]) && isset($_POST["volumen"])
    && isset($_POST["gastosGenerales"])
  ) {
    if (
      $_POST["ref"] != "" || $_POST["unidades"] != "" || $_POST["volumen"] != ""
      || $_POST["gastosGenerales"] != ""
    ) {
      $product = $productDao->findById($_POST["producto"], true);
      $product->getExpenses()->setSoldUnits($_POST["unidades"]);
      $product->getExpenses()->setTurnOver($_POST["volumen"]);
      $resquest = $productDao->updateExpensesByProduct($product);
      if ($resquest > 0) {
        $user->getCompany()->setTotalMonthExpenses($_POST["gastosGenerales"]);
        if ($companyDao->update($user->getCompany())) {
          http_response_code(200);
        } else {
          http_response_code(500);
        }
      } else {
        http_response_code(500);
      }
    }
  } else {
    http_response_code(400);
  }
} else {
  http_response_code(401);
  exit;
}
