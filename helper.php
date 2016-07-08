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

//function checkdb() {
//    $db = new DB();
//    $query = "CREATE TABLE module_kitchen (
//          id_issue int(11) NOT NULL,
//            timestamp timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
//            json tinytext DEFAULT NULL,
//            x tinyint(3) UNSIGNED DEFAULT NULL,
//            y tinyint(3) UNSIGNED DEFAULT NULL,
//            startCoocking DATETIME DEFAULT NULL,
//            stopCoocking DATETIME DEFAULT NULL,
//            setCourier DATETIME DEFAULT NULL,
//            PRIMARY KEY (id_issue)
//        )
//        ENGINE = INNODB
//        CHARACTER SET utf8
//        COLLATE utf8_general_ci
//        COMMENT = 'autocreated by kitchen module';
//        CREATE 
//	DEFINER = 'sxl'@'%'
//TRIGGER delivery.trigger_issue_upd
//	AFTER UPDATE
//	ON delivery.testform_issues
//	FOR EACH ROW
//BEGIN
//    insert into module_kitchen (id_issue, timestamp) values (new.id, CURRENT_TIMESTAMP) ON DUPLICATE KEY UPDATE timestamp=CURRENT_TIMESTAMP;
//  CASE new.status_id
//      WHEN 3 THEN UPDATE module_kitchen set timestamp=CURRENT_TIMESTAMP, startCoocking=CURRENT_TIMESTAMP, stopCoocking=null where id_issue=new.id;
//      WHEN 4 THEN UPDATE module_kitchen set timestamp=CURRENT_TIMESTAMP, stopCoocking=CURRENT_TIMESTAMP where id_issue=new.id;
//      ELSE
//        BEGIN
//          UPDATE module_kitchen set timestamp=CURRENT_TIMESTAMP where id_issue=new.id;
//        END;
//    END CASE;
//END";
//
//    if ($db->conn->query("SHOW TABLES LIKE 'module_kitchen'")->rowCount() > 0 or die($db->conn->exec($query))) {
//        //echo "exist";
//    }
//    $db->conn = null;
//}

function getOrders($json_orders, $query_type) {
    $db = new DB();
    $queryK = "SELECT "
            . "ti.id, "
            . "ti.courier_id, "
            . "ti.`number`, "
            . "ti.status_id, "
            . "SUBSTRING_INDEX( ti.comment , '|', 1 ) AS comment, "
            . "DATE_FORMAT(mk.startCoocking, '%H:%i') start_time, "
            . "DATE_FORMAT(mk.stopCoocking, '%H:%i') stop_time, "
            . "mk.timestamp ts, "
            . "mk.x, "
            . "mk.y, "
            . "ti.client_id, "
            . "ts.name AS street, "
            . "tp.building, "
            . "tp.flat, "
            . "tp.entrance, "
            . "tp.floor, "
            . "tp.code "
            . "FROM testform_issues ti LEFT JOIN module_kitchen mk on mk.id_issue=ti.id left join testform_person tp on tp.id=ti.client_id LEFT JOIN testform_street ts ON tp.street_id=ts.id WHERE ti.status_id=" . STATUS_ID_TODO . " or ti.status_id=" . STATUS_ID_DONE . " or ti.status_id=" . STATUS_ID_DELIVERY . " limit 80";
//select tp.client_id, ts.name AS street, tp.building, tp.flat, tp.entrance, tp.floor, tp.code from testform_person tp LEFT JOIN testform_street ts ON tp.street_id=ts.id WHERE tp.client_id=12692;    
//$query = "SELECT ti.id, ti.courier_id, ti.`number`, ti.client_id, ti.comment Comment, ti.status_id, DATE_FORMAT(ti.order_time, '%H:%i') order_time, tc.phone, tc.cell, tc.comment clientComment FROM testform_issues ti LEFT JOIN testform_client tc ON ti.client_id=tc.id WHERE ti.date=:date and (ti.status_id=" . STATUS_ID_ORDER . " or ti.status_id=" . STATUS_ID_DELIVERY . " or ti.status_id=" . STATUS_ID_DONE . ") limit 30";
    $queryC = "SELECT "
            . "ti.id, "
            . "ti.courier_id, "
            . "ti.`number`, "
            . "ti.status_id, "
            . "SUBSTRING_INDEX( ti.comment , '|', 1 ) AS comment, "
            . "DATE_FORMAT(mk.startCoocking, '%H:%i') start_time, "
            . "DATE_FORMAT(mk.stopCoocking, '%H:%i') stop_time, "
            . "mk.timestamp ts, "
            . "mk.x, "
            . "mk.y, "
            . "ti.client_id, "
            . "ts.name AS street, "
            . "tp.building, "
            . "tp.flat, "
            . "tp.entrance, "
            . "tp.floor, "
            . "tp.code "
            . "FROM testform_issues ti LEFT JOIN module_kitchen mk on mk.id_issue=ti.id left join testform_person tp on tp.id=ti.client_id LEFT JOIN testform_street ts ON tp.street_id=ts.id WHERE ti.status_id=" . STATUS_ID_DONE . " or ti.status_id=" . STATUS_ID_DELIVERY . " limit 80";
    switch ($query_type) {
        case "K":
            $query = $queryK;
            break;
        case "C":
            $query = $queryC;
            break;
        default:
            $query = $queryK;
            break;
    }
    $stmt = $db->conn->prepare($query);
    //$stmt->bindParam(':date', $date);
    //$date = date('Y.m.d');
    //$date = date('Y.m.d', strtotime('-1 day')); //'2015.12.27';
    $stmt->execute();
    $db_orders = $stmt->fetchAll(PDO::FETCH_ASSOC);


    // если json_orders не пустой, то сравниваем timestamp'ы клиента и сервера. 
    //      Если timestamp клиента больше серверного, то обнавляем заказ в базе и удаляем заказ из ответа клиенту
    //      Если timestamp клиента меньше серверного, то оставляем заказ в ответе клиенту

    $result_orders = array();
    if ($json_orders == "[]") {
        // если json_orders пустой (первый запрос к серверу либо нет заказов), то выбираем из базы все заказы и отправляем клиенту
        $result_orders = $db_orders;
    } else { // если от клиента что-то есть сравниваем таймы
        $cl_orders = json_decode($json_orders, true);
        foreach ($db_orders as $db_order) {
            $db_id = $db_order['id']; //34850 
            $db_ts = strtotime($db_order['ts']); //2016-01-19 14:57:12
            $flag_found = 0;
            foreach ($cl_orders as $cl_order) {
                $cl_id = $cl_order[0]; //id
                $cl_ts = strtotime($cl_order[1]); //ts
                if ($cl_id == $db_id) { //найден. сравнивайм таймы
                    $flag_found = 1;
                    if ($cl_ts < $db_ts) {
                        array_push($result_orders, $db_order);
                    } else {
                        
                    }
                    //unset($cl_order);
                } else {
                    
                }
                //$stmt->execute();
                //$db->conn->query("UPDATE module_kitchen SET `setCourier`=NOW() WHERE id_issue=$order_id");
            }
            if ($flag_found == 0) {
                array_push($result_orders, $db_order);
            }
        }
    }




//    $query = 'SELECT tip.product_id,
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
//    $stmt = $db->conn->prepare($query);
//    $stmt->bindParam(':order_id', $order_id);
//    //$date = '2015.12.18';
//    $stmt->execute();
//    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return json_encode($result_orders, JSON_UNESCAPED_UNICODE); //$orders
}

function getCouriers() {
    $db = new DB();
    $query = "SELECT id, name FROM testform_courier limit 20";
    $stmt = $db->conn->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return json_encode($items, JSON_UNESCAPED_UNICODE);
}

function getOrderProducts($order_id) {
    $db = new DB();
    $query = 'SELECT tip.product_id,
        tip.count,
        tip.price,
        tip.comment,
        tip.income_date_time,
        tp.name,
        tp.comment ProductComment,
        tp.picture_id FROM testform_issue_products tip LEFT JOIN testform_menu_products tp ON tip.product_id=tp.id WHERE tip.issue_id=:order_id';
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':order_id', $order_id);
    //$date = '2015.12.18';
    $stmt->execute();
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return json_encode($rows, JSON_UNESCAPED_UNICODE);
}

function updateOrderStatus($id, $status_id) {
    $db = new DB();
    $query = "UPDATE testform_issues SET status_id=:status_id WHERE id=:id";
    //UPDATE module_kitchen SET `stopCoocking`=NOW() WHERE id=$id
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':status_id', $status_id);
    //$id = '2015.12.18';
    $stmt->execute();
    //$db->conn->query("UPDATE module_kitchen SET `stopCoocking`=NOW() WHERE id=$id");
    //$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return 1; //json_encode($rows, JSON_UNESCAPED_UNICODE);
}

function SetCourierToOrders($orders_json, $courier_id) {
    $db = new DB();
// date('Y-m-d H:i:s');

    $query = "UPDATE testform_issues SET status_id=:status_id, courier_id=:courier_id WHERE id=:order_id";
    $stmt = $db->conn->prepare($query);
    $status_id = STATUS_ID_DELIVERY;
    $order_id = NULL;
    $stmt->bindParam(':status_id', $status_id);
    $stmt->bindParam(':courier_id', $courier_id);
    $stmt->bindParam(':order_id', $order_id);
//    //$id = '2015.12.18';

    $array = json_decode($orders_json, true);
    $ar_timestamps = array();
    foreach ($array as $value) {
        $order_id = $value;
        $stmt->execute();

        $sel_stmt = $db->conn->prepare("SELECT `timestamp` FROM module_kitchen WHERE id_issue=$order_id");
        $sel_stmt->execute();
        $res = $sel_stmt->fetch(PDO::FETCH_COLUMN, 0);
        $ar_timestamps[$order_id] = $res;
    }
    $db->conn->query("call RecalcOrdersPosition()");
//$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);


    return json_encode($ar_timestamps, JSON_UNESCAPED_UNICODE);
}

function SetOrderPosition($issue_id, $x, $y) {
    $db = new DB();
    $upd_stmt = $db->conn->prepare("UPDATE module_kitchen SET x=$x, y=$y WHERE id_issue=$issue_id");
//    $upd_stmt->bindParam(':id_issue', $id);
//    $upd_stmt->bindParam(':x', $x);
//    $upd_stmt->bindParam(':y', $y);
    $upd_stmt->execute();

    $sel_stmt = $db->conn->prepare("SELECT `timestamp` FROM module_kitchen WHERE id_issue=$issue_id");
    $sel_stmt->execute();

    $res = $sel_stmt->fetch(PDO::FETCH_COLUMN, 0);
    //$res['timestamp']
    return $res; //json_encode($rows, JSON_UNESCAPED_UNICODE);
}

function SetOrderProducts($issue_id, $weightR, $weightP) {
    $db = new DB();
//1271	ВЕС ПИЦЦА
//1272	ВЕС РОЛЛЫ count=1.69   price=794.3
//1273	ВЕС ОБЩИЙ
    //CALL InsertOrUpdateProduct (34847,1272,'12123','3121');
    if ($weightR > 0) {
        $sel_stmt = $db->conn->prepare("SELECT price FROM testform_menu_products WHERE id=1272");
        $sel_stmt->execute();
        $priceR = $sel_stmt->fetch(PDO::FETCH_COLUMN, 0);
        $totalR = $weightR * $priceR;
        $upd_stmt = $db->conn->query("CALL InsertOrUpdateProduct ($issue_id,1272,$weightR,$totalR)");
        $upd_stmt->execute();
    }
    if ($weightP > 0) {
        $sel_stmt = $db->conn->prepare("SELECT price FROM testform_menu_products WHERE id=1271");
        $sel_stmt->execute();
        $priceP = $sel_stmt->fetch(PDO::FETCH_COLUMN, 0);
        $totalP = $weightP * $priceP;
        $upd_stmt = $db->conn->query("CALL InsertOrUpdateProduct ($issue_id,1271,$weightP,$totalP)");
        $upd_stmt->execute();
    }
    return 1; //json_encode($rows, JSON_UNESCAPED_UNICODE);
}

//checkdb();
$action = $_POST["action"];
switch ($action) {
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
    case 'SetOrderPosition':
        echo SetOrderPosition($_POST["issue_id"], $_POST["x"], $_POST["y"]);
        break;
    case 'SetOrderProducts':
        echo SetOrderProducts($_POST["issue_id"], $_POST["weightR"], $_POST["weightP"]);
        break;
    default:
        break;
}
