<?php

require_once 'database.php';
require_once 'functions.php';
header('Content-Type: application/json');

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
        $data = ['id_session' => $id_session, 'orders' => getOrders(date("Y-m-d")), 'batches' => getBatches(date("Y-m-d"))];
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        //, JSON_NUMERIC_CHECK
        break;
    case 'getOrders':
        $date = filter_input(INPUT_POST, 'date');
        $data = getOrders($date);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        break;
//    case 'getKOrders':
//        echo getOrders($_POST["json"], "K");
//        break;
//    case 'getCOrders':
//        echo getOrders($_POST["json"], "C");
//        break;
    case 'getOrdersAndBatches':
        $date = filter_input(INPUT_POST, 'date');
        $data = ['orders' => getOrders($date), 'batches' => getBatches($date)];
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        //, JSON_NUMERIC_CHECK
        break;
    case 'getProducts':
        echo getProducts();
        break;
    case 'getClient':
        $idClient = filter_input(INPUT_POST, 'idClient', FILTER_VALIDATE_INT);
        echo getClient($idClient);
        break;
    case 'updateOrderStatus':
        $idOrder = filter_input(INPUT_POST, 'idOrder', FILTER_VALIDATE_INT);
        $idStatus = filter_input(INPUT_POST, 'idStatus', FILTER_VALIDATE_INT);
        echo updateOrderStatus($idOrder, $idStatus);
        break;
    case 'getUsers':
        echo getUsers();
        break;
    case 'updateOrderKitchenID':
        $idOrder = filter_input(INPUT_POST, 'idOrder', FILTER_VALIDATE_INT);
        $idKitchen = filter_input(INPUT_POST, 'idKitchen', FILTER_VALIDATE_INT);
        echo updateOrderKitchenID($idOrder, $idKitchen);
        break;
    case 'updateOrderIdBatch':
        $idOrder = filter_input(INPUT_POST, 'idOrder', FILTER_VALIDATE_INT);
        $idBatch = filter_input(INPUT_POST, 'idBatch'); //can be null
        if ($idBatch == 'NULL') {
            $idBatch = null;
        }
        echo updateOrderIdBatch($idOrder, $idBatch);
        break;
    case 'updateOrderIdBatchAndIdStatus':
        $idOrder = filter_input(INPUT_POST, 'idOrder', FILTER_VALIDATE_INT);
        $idBatch = filter_input(INPUT_POST, 'idBatch');  //can be null
        $idStatus = filter_input(INPUT_POST, 'idStatus', FILTER_VALIDATE_INT);
        if ($idBatch == 'NULL') {
            $idBatch = null;
        }
        echo updateOrderIdBatchAndIdStatus($idOrder, $idBatch, $idStatus);
        break;

    case 'updateBatch':
        $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        $idCourier = filter_input(INPUT_POST, 'idCourier', FILTER_VALIDATE_INT);
        $QueueNo = filter_input(INPUT_POST, 'QueueNo', FILTER_VALIDATE_INT);
        $result = updateBatch($id, $idCourier, $QueueNo);
        echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        break;
    case 'updateBatchQueueNo':
        $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        $QueueNo = filter_input(INPUT_POST, 'QueueNo', FILTER_VALIDATE_INT);
        $result = updateBatchQueueNo($id, $QueueNo);
        echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        break;
    case 'updateBatchesQueue':
        $ids = filter_input(INPUT_POST, 'ids');
        $result = updateBatchesQueue(json_decode($ids));
        echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        break;
    case 'createOrder':
        $json = filter_input(INPUT_POST, 'order');
        $result = createOrder(json_decode($json,TRUE));
        echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        break;
    case 'createBatch':
        $date = filter_input(INPUT_POST, 'date');
        $result = createBatch($date);
        echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        break;
    default:
        header('Content-Type: application/json');
        echo '{"error":"no action:"' . $action . '}';
        break;
}    