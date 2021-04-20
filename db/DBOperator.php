<?php

/****************************************************************************************************************
/*Esta clase permite consultar, guardar, actualizar y eliminar campos en tablas de una base de datos usando MySQL
/*Desarrollada por frimost(Armandux)
/*Para englinx.net
/*Ultima actualizacion 03/02/2016
/****************************************************************************************************************/
class DBOperator {
  private $host;
  private $dbName;
  private $userName;
  private $password;
  private $mysqliObj;
  private $charset;
  function __construct($host = "localhost", $userName = "root", $dbName = "", $password = "", $charset = "utf8") {
    $this->host = $host;
    $this->dbName = $dbName;
    $this->userName = $userName;
    $this->password = $password;
    $this->mysqliObj = new mysqli($this->host, $this->userName, $this->password, $this->dbName);
    $this->charset = $charset;
    $this->mysqliObj->query("SET NAMES '" . $this->charset . "'");
    $this->flagConn = true;
  }
  //fin Constructor
  //gets y sets-----------------------
  function setHost($host = "")
  {
    $this->host = $host;
  }
  function setDbName($dbName = "")
  {
    $this->dbName = $dbName;
  }
  function setUserName($userName = "")
  {
    $this->userName = $userName;
  }
  function setPassword($password = "")
  {
    $this->password = $password;
  }
  function setCharset($charset = "")
  {
    $this->charset = $charset;
  }
  function getHost()
  {
    return $this->host;
  }
  function getDbName()
  {
    return $this->dbName;
  }
  function getUserName()
  {
    return $this->userName;
  }
  function getPassword()
  {
    return $this->password;
  }
  function getCharset()
  {
    return $this->charset;
  }
  //Fin Gets y Sets-------------------
  function consult($mySqlOrder = "", $capture = "no")
  {
    $consult = $this->mysqliObj->query($mySqlOrder);
    //Si se desea capturar datos desde la base de datos
    if ($capture == "yes") {
      $rowValues = array();
      if ($consult === false) {
        return $rowValues;
      }
      while ($linea = mysqli_fetch_array($consult, MYSQLI_ASSOC)) {
        $rowValues[] = $linea;
      }
      //Reiniciar el objeto mySqli para garantizar su uso en varias consultas simultáneas :D----
      /* $this->mysqliObj = new mysqli($this->host, $this->userName, $this->password, $this->dbName);
      $this->mysqliObj->query("SET NAMES '" . $this->charset . "'"); */
      //----------------------------------------------------------------------------------------
      return $rowValues;
    } else {
      /* $this->mysqliObj = new mysqli($this->host, $this->userName, $this->password, $this->dbName);
      $this->mysqliObj->query("SET NAMES '" . $this->charset . "'"); */
      return $consult;
    }
  }
  function close()
  {
    if ($this->flagConn) {
      $this->mysqliObj->close();
      $this->flagConn = false;
    }
  }
  function connect()
  {
    if (!$this->flagConn) {
      $this->mysqliObj = new mysqli($this->host, $this->userName, $this->password, $this->dbName);
      $this->mysqliObj->query("SET NAMES '" . $this->charset . "'");
      $this->flagConn = true;
    }
  }
  function lastError()
  {
    return $this->mysqliObj->error;
  }

  function errorList(){
    return $this->mysqliObj->error_list;
  }
  function begin_transaction()
  {
    return $this->mysqliObj->begin_transaction(MYSQLI_TRANS_START_READ_WRITE);
  }
  function autocommit($flag)
  {
    return $this->mysqliObj->autocommit($flag);
  }
  function commit()
  {
    return $this->mysqliObj->commit();
  }
  function rollback()
  {
    return $this->mysqliObj->rollback();
  }
  function lastInsertId()
  {
    return $this->mysqliObj->insert_id;
  }
  function errorno(){
    return $this->mysqliObj->errno;
  }
}
