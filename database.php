<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

require_once 'config.php';

class DBS {

    public $conn;

    function __construct() {
        try {
            $this->conn = new PDO('mysql:host=' . DBS_HOSTNAME . ';dbname=' . DBS_DATABASE . ';port=' . DBS_PORT . ';charset=utf8', DBS_USERNAME, DBS_PASSWORD, array(
                    //PDO::ATTR_PERSISTENT => true - постоянное подключение, кэшируется
            ));
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            print "Error!: " . $e->getMessage() . "<br/>";
            die();
        }
    }

}

class DB {

    public $conn; //protected

    function __construct() {
        try {
            $this->conn = new PDO('mysql:host=' . DB_HOSTNAME . ';dbname=' . DB_DATABASE . ';port=' . DB_PORT . ';charset=utf8', DB_USERNAME, DB_PASSWORD, array(
                    //PDO::ATTR_PERSISTENT => true - постоянное подключение, кэшируется
            ));
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            print "Error!: " . $e->getMessage() . "<br/>";
            die();
        }
    }

    function insertArray($table, $array) {
        $fields = array_keys($array);
        $values = array_values($array);
        $fieldlist = implode(',', $fields);
        $qs = str_repeat("?,", count($fields) - 1);

        $sql = "INSERT INTO `" . $table . "` (" . $fieldlist . ") VALUES (${qs}?)";

        $q = $this->conn->prepare($sql);
        return $q->execute($values);
    }

    function updateArray($table, $id, $array) {
        $fields = array_keys($array);
        $values = array_values($array);
        $fieldlist = implode(',', $fields);
        $qs = str_repeat("?,", count($fields) - 1);
        $firstfield = true;

        $sql = "UPDATE `" . $table . "` SET";
        for ($i = 0; $i < count($fields); $i++) {
            if (!$firstfield) {
                $sql .= ", ";
            }
            $sql .= " " . $fields[$i] . "=?";
            $firstfield = false;
        }
        $sql .= " WHERE `id` =?";

        $sth = $this->conn->prepare($sql);
        $values[] = $id;
        return $sth->execute($values);
    }

    //public function printtest() {
    //    foreach ($this->dbh->query('SELECT * from cls_boats') as $row) {
    //        print_r($row);
    //    }
    //}
}

//try {
//    $dbh = new PDO('mysql:host='.DB_HOSTNAME.';dbname='.DB_DATABASE, DB_USERNAME, DB_PASSWORD);
//    foreach($dbh->query('SELECT * from cls_boats') as $row) {
//        print_r($row);
//    }
//    $dbh = null;
//} catch (PDOException $e) {
//    print "Error!: " . $e->getMessage() . "<br/>";
//    die();
//}