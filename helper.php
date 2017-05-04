<?php

require_once 'database.php';
require_once 'functions.php';
//if (!isset($_SERVER['PHP_AUTH_USER'])) {
//    header("WWW-Authenticate: Basic realm=\"My Realm\"");
//    header("HTTP/1.0 401 Unauthorized");
//    echo "Текст, отправляемый в том случае,
//    если пользователь нажал кнопку Cancel\n";
//    exit;
//  } else {
//    echo "<p>Hello {$_SERVER['PHP_AUTH_USER']}.</p>";
//    echo "<p>Вы ввели пароль {$_SERVER['$PHP_AUTH_PW']}.</p>";
//  }
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
    case 'getOrder':
        $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        echo getOrder($id);
        break;
    // test echo '{"id": 923, "Org": null, "Card": "1544,", "Name": "Максим Кабаев", "Phones": [{"Phone": "9277501811", "isDefault": 1}, {"Phone": "9871528985", "isDefault": 0}], "Comment": "", "Surname": null, "Addresses": [{"Flat": null, "Floor": 1, "Address": "Владимирская ул. 43 82", "geo_lat": null, "geo_lon": null, "house_id": null, "isDefault": null}, {"Flat": null, "Floor": 0, "Address": "ленинская 149 ", "geo_lat": null, "geo_lon": null, "house_id": null, "isDefault": null}]}';
    case 'getOrders':
        $date = filter_input(INPUT_POST, 'date');
        $data = getOrders($date);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        break;
    case 'getOrdersByClient':
        $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        echo json_encode(getOrdersByClient($id), JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        break;
    case 'getOrdersAndBatches':
        $date = filter_input(INPUT_POST, 'date');
        $data = ['orders' => getOrders($date), 'batches' => getBatches($date)];
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        //, JSON_NUMERIC_CHECK
        break;
    case 'getSiteUpdates':
        $idSite = filter_input(INPUT_POST, 'idSite', FILTER_VALIDATE_INT);
        echo getSiteUpdates($idSite);
        break;
    case 'getProducts':
        echo getProducts();
        break;
    case 'getClient':
        $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        echo getClient($id);
        break;
    case 'getClientByPhone':
        $phone = filter_input(INPUT_POST, 'Phone');
        $res = getClientByPhone($phone);
        if (is_null($res)) {
            echo "NULL";
        } else {
            echo $res;
        }
        break;
    case 'getClients':
        //$idSite = filter_input(INPUT_POST, 'idSite', FILTER_VALIDATE_INT);
        $clients = getClients(); //= implode(",", getClients());
        echo $clients;
        break;

    case 'setClient':
        $c = json_decode(filter_input(INPUT_POST, 'client'), TRUE);
        $result = setClient($c);
//        if (isset($c["id"])) { //get client from db and then modify
//json_encode($client, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK) . '}';
//            $result = '{"status":1,"msg":"modified","data":' . $client . '}';
        //       } else { //create client in db
        //           $result = '{"status":2,"msg":"created","data":' . $client . '}';
        //       }
        echo $result;
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
        $result = createOrder(json_decode($json, TRUE));
        echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES);
        break;
    case 'setOrder':
        $o = json_decode(filter_input(INPUT_POST, 'order'), TRUE);
        if (isset($o["id"])) { //get order from db and then modify
            $order = getOrderObj($o["id"]);
            $result = '{"status":1,"msg":"modified","data":' . json_encode($order, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK) . '}'; // | JSON_UNESCAPED_SLASHES
        } else { //create order in db
        
            $order = createOrder($o);
            //var_dump($order);
//            $order = [
//                "id" => NULL,
//                "No" => NULL,
//                "idBranch" => NULL,
//                "idClient" => NULL,
//                "idPricingType" => NULL,
//                "idStatus" => NULL,
//                "idKitchen" => NULL,
//                "idBatch" => NULL,
//                "idCreatedBy" => NULL,
//                "Price" => NULL,
//                "Comment" => NULL,
//                "QueueNo" => NULL,
//                "DDate" => NULL,
//                "DTime" => NULL,
//                "Products" => [], //[{"id": null, "Name": null, "Count": null, "Price": null, "Weight": null, "idType": null, "isCoocked": null, "CookingTime": null}]
//                "Client" => [
//                    "id" => NULL,
//                    "Name" => NULL,
//                    "Phones" => [],
//                    "Addresses" => [],
//                    "Card" => [],
//                    "Comment" => NULL
//                ]
//            ];
//            $arr = $o["purchases"];
//            foreach ($arr as $val) {
//                $product = [
//                    "idProduct" => intval($val["product_id"]),
//                    "Count" => intval($val["amount"])
//                ];
//                array_push($order["Products"], $product);
//            }
            //array_push($order["Client"]["Phones"], ["Phone" => $o["phone"], "isDefault" => 1]);
//            if (isset($o["phone"])) {
//                if (strlen($o["phone"]) == 10) {
//                    $order["Client"] = json_decode(getClientByPhone($o["phone"]));
//                }
//            }
//            $order["Comment"] = $o["comment"];
//            $order["DDate"] = $o["DDate"];
//            $order["DTime"] = $o["DTime"];
            //$result = createOrder($order);
//        echo json_encode($order, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
            //echo json_encode($order, JSON_UNESCAPED_UNICODE);
//        echo getOrder($o["order_id"]);
            //$result = '{"status":2,"msg":"created"}';
            $result = '{"status":1,"msg":"created","data":' . json_encode($order, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK) . '}';
        }
        echo $result;
        break;
    case 'createBatch':
        $date = filter_input(INPUT_POST, 'date');
        $result = createBatch($date);
        echo json_encode($result, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        break;
    case 'setCourierCoords':
        $c = json_decode(filter_input(INPUT_POST, 'courier'), TRUE);
        $id = $c['id'];
        $lat = $c['lat'];
        $lon = $c['lon'];
//        $result = setCourierCoords($id, $lat, $lon);
        //$id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
        //$lat = filter_input(INPUT_POST, 'geo_lat', FILTER_VALIDATE_FLOAT);
        //$lon = filter_input(INPUT_POST, 'geo_lon', FILTER_VALIDATE_FLOAT);
        //echo setCourierCoords($id, $lat, $lon);
//        $result = '{"status":1,"msg":"accepted","data":' . json_encode($c, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK) . '}';

        $polygon = [
            [53.19632, 50.17889],
            [53.21437, 50.18082],
            [53.23195, 50.21318],
            [53.22537, 50.25609],
            [53.20605, 50.27154],
            [53.18198, 50.25506],
            [53.17602, 50.23],
            [53.18137, 50.19567]
        ];
        //echo $result;
        echo in_polygon([$lat,$lon], $polygon) ? '{"status":"IN"}' : '{"status":"OUT"}';
        break;

    default:
        header('Content-Type: application/json');
        echo '{"status":0,"msg":"wrong action param"}';
        break;
}    