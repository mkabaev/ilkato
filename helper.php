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

function getOrders($date) {
    //. "SUBSTRING_INDEX( ti.comment , '|', 1 ) AS comment, "
    //. "DATE_FORMAT(mk.startCoocking, '%H:%i') start_time, "
    $db = new DB();
//    $query = "SELECT "
//            . "o.id, "
//            . "o.`idClient`, "
//            . "o.`no`, "
//            . "o.`idPricingType`, "
//            . "o.`idStatus`, "
//            . "o.`idCreatedBy`, "
//            . "o.`createDate`, "
//            . "o.`price`, "
//            . "o.`timestamp` as ts "
//            . "FROM orders o WHERE o.`idStatus`=" . 1 . " or o.`idStatus`=" . 2 . " limit 100";
    //$query = "SELECT * from v_orders where idStatus<7";
    $query = "SELECT * from v_orders where DDate=:date";
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':date', $date);
    //$date = date('Y.m.d');
    //$date = '2016-10-25';
    //$date = date('Y.m.d', strtotime('-1 day')); //'2015.12.27';
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC); //FETCH_ASSOC
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
    //echo $orders[1]['client'];
//    echo '<pre>';
//    var_dump( $orders);
//    echo '</pre>';

    foreach ($items AS $key => $order) {
        $items[$key]['Client'] = json_decode($order['Client']);
        $items[$key]['Products'] = json_decode($order['Products']);
        $items[$key]['Log'] = json_decode($order['Log']);
    }
    //return json_encode($orders, JSON_UNESCAPED_UNICODE); //$orders
    return $items;
}

function getActiveBatches() {
    $db = new DB();
    $query = "SELECT * from batches where isActive=1";
    $stmt = $db->conn->prepare($query);
    //$stmt->bindParam(':date', $date);
    //$date = date('Y.m.d');
    //$date = date('Y.m.d', strtotime('-1 day')); //'2015.12.27';
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC); //FETCH_ASSOC
    //return json_encode($orders, JSON_UNESCAPED_UNICODE); //$orders
    return $items;
}

function getSessionUpdates($id_session) {
    //. "SUBSTRING_INDEX( ti.comment , '|', 1 ) AS comment, "
    //. "DATE_FORMAT(mk.startCoocking, '%H:%i') start_time, "
    $db = new DB();
    
    $stmt = $db->conn->prepare("SELECT * from app_sessiondata where id_session=:id_session");
    $stmt->bindParam(':id_session', $id_session);
    //$date = date('Y.m.d');
    //$date = date('Y.m.d', strtotime('-1 day')); //'2015.12.27';
    $stmt->execute();
    $updates = $stmt->fetchAll(PDO::FETCH_ASSOC); //FETCH_ASSOC

    $stmt = $db->conn->prepare("DELETE from app_sessiondata where id_session=:id_session");
    $stmt->bindParam(':id_session', $id_session);
    //$date = date('Y.m.d');
    //$date = date('Y.m.d', strtotime('-1 day')); //'2015.12.27';
    $res = $stmt->execute();

    //foreach ($orders AS $key => $order) {
    //    $orders[$key]['client'] = json_decode($order['client']);
    //    $orders[$key]['products'] = json_decode($order['products']);
    //}
    //return json_encode($orders, JSON_UNESCAPED_UNICODE); //$orders
    return $updates;
}

function getUsers() {
    $db = new DB();
    $query = "SELECT e.idPerson, e.Name, e.idWorkplace, wp.idType FROM employees e left join workplaces wp on e.idWorkplace=wp.id";
    $stmt = $db->conn->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return json_encode($items, JSON_UNESCAPED_UNICODE|JSON_NUMERIC_CHECK);
}

//function getCouriers() {
//    $db = new DB_delivery();
//    $query = "SELECT id, name FROM testform_courier limit 20";
//    $stmt = $db->conn->prepare($query);
//    $stmt->execute();
//    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
//    return json_encode($items, JSON_UNESCAPED_UNICODE);
//}
//function getOrderProducts($order_id) {
//    $db = new DB_delivery();
//    $query = 'SELECT tip.product_id,
//        tip.count,
//        tip.price,
//        tip.comment,
//        tip.income_date_time,
//        tp.name,
//        tp.comment ProductComment,
//        tp.picture_id FROM testform_issue_products tip LEFT JOIN testform_menu_products tp ON tip.product_id=tp.id WHERE tip.issue_id=:order_id';
//    $stmt = $db->conn->prepare($query);
//    $stmt->bindParam(':order_id', $order_id);
//    //$date = '2015.12.18';
//    $stmt->execute();
//    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
//    return json_encode($rows, JSON_UNESCAPED_UNICODE);
//}

function updateUserStatus($idPerson, $isOnline) {
    $db = new DB();
    $query = "UPDATE employees SET isOnline=:isOnline WHERE idPerson=:idPerson";
    //$query = "UPDATE employees SET isOnline=true WHERE id=3";
    //UPDATE module_kitchen SET `stopCoocking`=NOW() WHERE id=$id
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':idPerson', $idPerson);
    $stmt->bindParam(':isOnline', $isOnline);
    $res = $stmt->execute();
    return $res;
}

function updateOrderKithcenID($idOrder, $idKitchen) {
    $db = new DB();
    $query = "UPDATE ilkato.orders SET idKitchen=:idKitchen WHERE id=:idOrder";
    //$query = "UPDATE employees SET isOnline=true WHERE id=3";
    //UPDATE module_kitchen SET `stopCoocking`=NOW() WHERE id=$id
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':idOrder', $idOrder);
    $stmt->bindParam(':idKitchen', $idKitchen);
    $res = $stmt->execute();
    return $res;
}

function updateOrderStatus($idOrder, $idStatus) {
    $db = new DB();
    $query = "UPDATE ilkato.orders SET idStatus=:idStatus WHERE id=:idOrder";
    //$query = "UPDATE employees SET isOnline=true WHERE id=3";
    //UPDATE module_kitchen SET `stopCoocking`=NOW() WHERE id=$id
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':idOrder', $idOrder);
    $stmt->bindParam(':idStatus', $idStatus);
    $res = $stmt->execute();
    return $res;
}

function updateOrderIdBatch($idOrder, $idBatch) {
    $db = new DB();
    $query = "UPDATE ilkato.orders SET idBatch=:idBatch WHERE id=:idOrder";
    //$query = "UPDATE employees SET isOnline=true WHERE id=3";
    //UPDATE module_kitchen SET `stopCoocking`=NOW() WHERE id=$id
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':idOrder', $idOrder);
    $stmt->bindParam(':idBatch', $idBatch, PDO::PARAM_INT);
    //bindValue(":null", null, PDO::PARAM_NULL);;
    $res = $stmt->execute();
    return $res;
}

function updateBatch($id, $idCourier, $QueueNo) {
    $db = new DB();
    $query = "UPDATE ilkato.batches SET idCourier=:idCourier, QueueNo=:QueueNo WHERE id=:id";
    //$query = "UPDATE employees SET isOnline=true WHERE id=3";
    //UPDATE module_kitchen SET `stopCoocking`=NOW() WHERE id=$id
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->bindParam(':idCourier', $idCourier);
    $stmt->bindParam(':QueueNo', $QueueNo);
    $res = $stmt->execute();
    return $res;
}

function createBatch() {
    $db = new DB();
    $query = "INSERT INTO batches(isActive) VALUES (1)";
    $stmt = $db->conn->prepare($query);
    $res = $stmt->execute();
    return $res;
}

function updateBatchesQueue($ids) {
    $db = new DB();

    $query = "UPDATE ilkato.batches SET QueueNo=? WHERE id=?";
    //$query = ";
    //$query = "UPDATE employees SET isOnline=true WHERE id=3";
    //UPDATE module_kitchen SET `stopCoocking`=NOW() WHERE id=$id
    $stmt = $db->conn->prepare($query);

    $queue = 0;
    foreach ($ids as $id) {
        $queue = $queue + 1;
        $res = $stmt->execute(array($queue, $id));
    }
    return $res;
}

function registerNewSession($uid, $wid) {
    $db = new DB();

    $stmt = $db->conn->prepare("DELETE FROM app_activesessions WHERE id=:old_sid");
    $stmt->bindParam(':old_sid', $old_sid);
    $old_sid = filter_input(INPUT_POST, 'old_sid');
    $stmt->execute();

    $query = "INSERT INTO app_activesessions (id_employee, id_workplace) values(:uid, :wid)";
    //$query = "UPDATE employees SET isOnline=true WHERE id=3";
    //UPDATE module_kitchen SET `stopCoocking`=NOW() WHERE id=$id
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':uid', $uid);
    $stmt->bindParam(':wid', $wid);
    $stmt->execute();
    return $db->conn->lastInsertId();
}

//function updateOrderStatus($id, $status_id) {
//    $db = new DB_delivery();
//    $query = "UPDATE testform_issues SET status_id=:status_id WHERE id=:id";
//    //UPDATE module_kitchen SET `stopCoocking`=NOW() WHERE id=$id
//    $stmt = $db->conn->prepare($query);
//    $stmt->bindParam(':id', $id);
//    $stmt->bindParam(':status_id', $status_id);
//    //$id = '2015.12.18';
//    $stmt->execute();
//    //$db->conn->query("UPDATE module_kitchen SET `stopCoocking`=NOW() WHERE id=$id");
//    //$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
//    return 1; //json_encode($rows, JSON_UNESCAPED_UNICODE);
//}
//function SetCourierToOrders($orders_json, $courier_id) {
//    $db = new DB_delivery();
// date('Y-m-d H:i:s');
//    $query = "UPDATE testform_issues SET status_id=:status_id, courier_id=:courier_id WHERE id=:order_id";
//    $stmt = $db->conn->prepare($query);
//    $status_id = STATUS_ID_DELIVERY;
//    $order_id = NULL;
//    $stmt->bindParam(':status_id', $status_id);
//    $stmt->bindParam(':courier_id', $courier_id);
//    $stmt->bindParam(':order_id', $order_id);
////    //$id = '2015.12.18';
//    $array = json_decode($orders_json, true);
//    $ar_timestamps = array();
//    foreach ($array as $value) {
//        $order_id = $value;
//        $stmt->execute();
//        $sel_stmt = $db->conn->prepare("SELECT `timestamp` FROM module_kitchen WHERE id_issue=$order_id");
//        $sel_stmt->execute();
//        $res = $sel_stmt->fetch(PDO::FETCH_COLUMN, 0);
//        $ar_timestamps[$order_id] = $res;
//    }
//    $db->conn->query("call RecalcOrdersPosition()");
////$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
//    return json_encode($ar_timestamps, JSON_UNESCAPED_UNICODE);
//}
//function SetOrderPosition($issue_id, $x, $y) {
//   $db = new DB_delivery();
//    $upd_stmt = $db->conn->prepare("UPDATE module_kitchen SET x=$x, y=$y WHERE id_issue=$issue_id");
////    $upd_stmt->bindParam(':id_issue', $id);
////    $upd_stmt->bindParam(':x', $x);
////    $upd_stmt->bindParam(':y', $y);
//    $upd_stmt->execute();
//    $sel_stmt = $db->conn->prepare("SELECT `timestamp` FROM module_kitchen WHERE id_issue=$issue_id");
//    $sel_stmt->execute();
//    $res = $sel_stmt->fetch(PDO::FETCH_COLUMN, 0);
//    //$res['timestamp']
//    return $res; //json_encode($rows, JSON_UNESCAPED_UNICODE);
//}
//function SetOrderProducts($issue_id, $weightR, $weightP) {
//    $db = new DB_delivery();
////1271	ВЕС ПИЦЦА
////1272	ВЕС РОЛЛЫ count=1.69   price=794.3
////1273	ВЕС ОБЩИЙ
//    //CALL InsertOrUpdateProduct (34847,1272,'12123','3121');
//    if ($weightR > 0) {
//        $sel_stmt = $db->conn->prepare("SELECT price FROM testform_menu_products WHERE id=1272");
//        $sel_stmt->execute();
//        $priceR = $sel_stmt->fetch(PDO::FETCH_COLUMN, 0);
//        $totalR = $weightR * $priceR;
//        $upd_stmt = $db->conn->query("CALL InsertOrUpdateProduct ($issue_id,1272,$weightR,$totalR)");
//        $upd_stmt->execute();
//    }
//    if ($weightP > 0) {
//        $sel_stmt = $db->conn->prepare("SELECT price FROM testform_menu_products WHERE id=1271");
//        $sel_stmt->execute();
//        $priceP = $sel_stmt->fetch(PDO::FETCH_COLUMN, 0);
//        $totalP = $weightP * $priceP;
//        $upd_stmt = $db->conn->query("CALL InsertOrUpdateProduct ($issue_id,1271,$weightP,$totalP)");
//        $upd_stmt->execute();
//    }
//    return 1; //json_encode($rows, JSON_UNESCAPED_UNICODE);
//}
////checkdb();
$action = filter_input(INPUT_POST, 'action');
////$actionG = filter_input(INPUT_GET, 'action');
////if ($actionG = 'getUsers') {
////    echo getUsers();
////}

switch ($action) {
    case 'login':
        $uid = filter_input(INPUT_POST, 'uid');
        $wid = filter_input(INPUT_POST, 'wid');
        updateUserStatus($uid, true);
        $id_session = registerNewSession($uid, $wid);

        $data = ['id_session' => $id_session, 'orders' => getOrders(date("Y-m-d")), 'batches' => getActiveBatches()];
        echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_NUMERIC_CHECK);
        //, JSON_NUMERIC_CHECK
        break;
    case 'getOrders':
        $date = filter_input(INPUT_POST, 'date');
        $data = getOrders($date);
        echo json_encode($data, JSON_UNESCAPED_UNICODE|JSON_NUMERIC_CHECK);
        break;
//    case 'getKOrders':
//        echo getOrders($_POST["json"], "K");
//        break;
//    case 'getCOrders':
//        echo getOrders($_POST["json"], "C");
//        break;
    case 'getOrderProducts':
        echo getOrderProducts($_POST["order_id"]);
        break;
    case 'updateOrderStatus':
        $idOrder = filter_input(INPUT_POST, 'idOrder',FILTER_VALIDATE_INT);
        $idStatus = filter_input(INPUT_POST, 'idStatus',FILTER_VALIDATE_INT);
        echo updateOrderStatus($idOrder, $idStatus);
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
    case 'updateOrderKithcenID':
        $idOrder = filter_input(INPUT_POST, 'idOrder');
        $idKitchen = filter_input(INPUT_POST, 'idKitchen');
        echo updateOrderKithcenID($idOrder, $idKitchen);
        break;
    case 'updateOrderIdBatch':
        $idOrder = filter_input(INPUT_POST, 'idOrder');
        $idBatch = filter_input(INPUT_POST, 'idBatch');
        if ($idBatch == 'NULL') {
            $idBatch = null;
        }
        echo updateOrderIdBatch($idOrder, $idBatch);
        break;
    case 'updateBatch':
        $id = filter_input(INPUT_POST, 'id');
        $idCourier = filter_input(INPUT_POST, 'idCourier');
        $QueueNo = filter_input(INPUT_POST, 'QueueNo');
        $result = updateBatch($id, $idCourier, $QueueNo);
        echo json_encode($result, JSON_UNESCAPED_UNICODE|JSON_NUMERIC_CHECK);
        break;
    case 'updateBatchQueueNo':
        $id = filter_input(INPUT_POST, 'id');
        $QueueNo = filter_input(INPUT_POST, 'QueueNo');
        $result = updateBatchQueueNo($id, $QueueNo);
        echo json_encode($result, JSON_UNESCAPED_UNICODE|JSON_NUMERIC_CHECK);
        break;
    case 'updateBatchesQueue':
        $ids = filter_input(INPUT_POST, 'ids');        
        $result = updateBatchesQueue(json_decode($ids));
        echo json_encode($result, JSON_UNESCAPED_UNICODE|JSON_NUMERIC_CHECK);
        break;
    case 'createBatch':
        $result = createBatch();
        echo json_encode($result, JSON_UNESCAPED_UNICODE|JSON_NUMERIC_CHECK);
        break;
    default:
        break;
}    