<?php

class Admin implements JsonSerializable {

    private $id;
    private $email;
    private $password;
    private $tokenPass;

    public function getId() {
        return $this->id;
    }

    public function setId($id) {
        $this->id = $id;
    }

    public function getEmail() {
        return $this->email;
    }

    public function setEmail($email) {
        $this->email = $email;
    }

    public function getPassword() {
        return $this->password;
    }

    public function setPassword($password) {
        $this->password = $password;
    }

    public function getTokenPass() {
        return $this->tokenPass;
    }

    public function setTokenPass($tokenPass) {
        $this->tokenPass = $tokenPass;
    }

    /**
     * Convierte esta clase en un objeto JSON
     *
     * @access public
     * @return mixed
     */
    public function jsonSerialize() {
        return get_object_vars($this);
    }
}
