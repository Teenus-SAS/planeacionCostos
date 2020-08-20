<?php
/**
 * Ruta de la raiz de la apliación
 */
define('ROOT_PATH', $_SERVER['DOCUMENT_ROOT'] . '/');

/**
 * Ruta de las clases modelos de la app
 */
define('MODEL_PATH', ROOT_PATH . 'model/');
/**
 * Ruta de los DAOS de la app
 */
define('DAO_PATH', ROOT_PATH . 'dao/');
/**
 * Ruta de los partials de la app
 */
define('PARTIALS_PATH', ROOT_PATH . 'partials/');
/**
 * ruta de la todo lo que tiene que ver con la base de datos
 */
define('DB_PATH', ROOT_PATH . 'db/');
/**
 * Ruta de clases de session
 */
define('SESSION_PATH', ROOT_PATH . "session/");
/**
 * Ruta del modulo PHPMailer
 */
define('PHPMAILER_PATH',ROOT_PATH."vendor/PHPMailer/");