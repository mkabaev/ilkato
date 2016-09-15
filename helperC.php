<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
if (version_compare(PHP_VERSION, '5.6.0') <= 0) {
    define('JSON_UNESCAPED_UNICODE', 256);
}
date_default_timezone_set('Europe/Samara');
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'database.php';

function getCouriers() {
    $db = new DB_delivery();
    $query = "SELECT id, name FROM testform_courier limit 20";
    $stmt = $db->conn->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return json_encode($items, JSON_UNESCAPED_UNICODE);
}

function DBLog($data) {
    $db = new DB();
    $query = "INSERT into log (`data`, data2) VALUES (:d,:d2)";
    //$query = "UPDATE employees SET isOnline=true WHERE id=3";
    //UPDATE module_kitchen SET `stopCoocking`=NOW() WHERE id=$id
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':d', $data);
    $stmt->bindParam(':d2', $data);
    $stmt->execute();
    return 1;
}

//checkdb();
$action = filter_input(INPUT_POST, 'action');
//$actionG = filter_input(INPUT_GET, 'action');
//if ($actionG = 'getUsers') {
//    echo getUsers();
//}



switch ($action) {
    case 'setCouriers':
        var_dump($_POST);
        DBLog(json_encode($_POST));
        break;
    case 'getKOrders':
        echo getOrders($_POST["json"], "K");
        break;
    case 'getCOrders':
        echo getOrders($_POST["json"], "C");
        break;
    case 'getOrderProducts':
        echo getOrderProducts($_POST["order_id"]);
        break;
    case 'updateOrderStatus':
        echo updateOrderStatus($_POST["id"], $_POST["status_id"]);
        break;
    case 'SetCourierToOrders':
        echo SetCourierToOrders($_POST["json"], $_POST["courier_id"]);
        break;
    case 'getCouriers':
        echo getCouriers();
        break;
    case 'getUsers':
        echo getUsers();
        break;
    case 'SetOrderPosition':
        echo SetOrderPosition($_POST["issue_id"], $_POST["x"], $_POST["y"]);
        break;
    case 'SetOrderProducts':
        echo SetOrderProducts($_POST["issue_id"], $_POST["weightR"], $_POST["weightP"]);
        break;
    default:
        break;
}