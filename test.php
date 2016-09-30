<?php

// header('content-type: application/json; charset=utf-8');
// date_default_timezone_set('Europe/Moscow');
//
// define('DB_IP','127.0.0.1');
// define('DB_PORT','3306');
// define('DB_LOGIN','sxl');
// define('DB_PASSWORD','cargvidon17');
//
// $db = mysql_pconnect(DB_IP.":".DB_PORT,DB_LOGIN,DB_PASSWORD) or die("Could not connect: " . mysql_error());
// mysql_select_db("delivery") or die("Could not select database: " . mysql_error());
// mysql_query( "SET NAMES utf8", $db );
// mysql_query( "SET CHARACTER SET utf8", $db );   
//
// $sql = "SELECT * FROM auth_user;";
//
// $result = mysql_query($sql);
// $answer = null;
// while($row = mysql_fetch_array($result, MYSQL_NUM)){
//     echo $row[1];
// }


error_reporting(E_ALL);

ini_set('display_errors', 1);
require_once 'database.php';
//$db = new DB();
//$query = 'SELECT tip.product_id,
//        tip.count,
//        tip.discount,
//        tip.price,
//        tip.mark_deleted,
//        tip.comment,
//        tip.income_date_time,
//        tip.complete_date_time,
//        tp.name,
//        tp.category_id,
//        tp.price,
//        tp.weight,
//        tp.minimum_quantity,
//        tp.measure_id,
//        tp.comment ProductComment,
//        tp.picture_id FROM testform_issue_products tip LEFT JOIN testform_menu_products tp ON tip.product_id=tp.id WHERE tip.issue_id=:order_id';
//$stmt = $db->conn->prepare($query);
//$stmt->bindParam(':order_id', $order_id);
//$order_id = 34805;
////$date = '2015.12.18';
//$stmt->execute();
//$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
//echo json_encode($rows, JSON_UNESCAPED_UNICODE);
//try {