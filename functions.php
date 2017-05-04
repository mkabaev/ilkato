<?php

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

function getOrderObj($id) {
    /////////////Client - {"id": 10, "Org": null, "Card": "0810", "Name": null, "Phones": [{"Phone": "79297031047", "isDefault": 1}], "Comment": "", "Surname": null, "Addresses": [{"Flat": null, "Floor": 3, "Address": "Металлургов пр-кт. 74 ком.37", "geo_lat": null, "geo_lon": null, "house_id": null, "isDefault": null}, {"Flat": null, "Floor": 0, "Address": "Металлургов пр-кт. 74 37", "geo_lat": null, "geo_lon": null, "house_id": null, "isDefault": null}]}
    $db = new DB();
    $stmt = $db->conn->prepare("SET @@group_concat_max_len:=10000000");
    $stmt->execute();
    $query = "SELECT * FROM v_orders where id=:id";

    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    $item['Client'] = json_decode($item['Client']);
    $item['Products'] = json_decode($item['Products']);
    $item['Log'] = json_decode($item['Log']);
    //return json_encode($items, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES);
    return $item;
}

function getOrdersByClient($id) {
    /////////////Client - {"id": 10, "Org": null, "Card": "0810", "Name": null, "Phones": [{"Phone": "79297031047", "isDefault": 1}], "Comment": "", "Surname": null, "Addresses": [{"Flat": null, "Floor": 3, "Address": "Металлургов пр-кт. 74 ком.37", "geo_lat": null, "geo_lon": null, "house_id": null, "isDefault": null}, {"Flat": null, "Floor": 0, "Address": "Металлургов пр-кт. 74 37", "geo_lat": null, "geo_lon": null, "house_id": null, "isDefault": null}]}
    $db = new DB();
    $stmt = $db->conn->prepare("SET @@group_concat_max_len:=10000000");
    $stmt->execute();
    $query = "SELECT * FROM v_orders where idClient=:id";

    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC); //FETCH_ASSOC

    foreach ($items AS $key => $order) {
        $items[$key]['Client'] = json_decode($order['Client'], JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES);
        $items[$key]['Products'] = json_decode($order['Products']);
        $items[$key]['Log'] = json_decode($order['Log']);
    }
    return $items;
}

function getOrder($id) {
    return json_encode(getOrderObj($id), JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES);
}

function getBatches($date) {
    $db = new DB();
    $query = "SELECT * from batches where DDate=:date";
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':date', $date);
    //$date = date('Y.m.d');
    //$date = date('Y.m.d', strtotime('-1 day')); //'2015.12.27';
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC); //FETCH_ASSOC
    //return json_encode($orders, JSON_UNESCAPED_UNICODE); //$orders
    return $items;
}

function getClients() {
    $db = new DB();
    $stmt = $db->conn->prepare("SET @@group_concat_max_len:=100000000");
    $stmt->execute();
    $query = "SELECT CAST(concat('[',group_concat(Client),']') AS json) as Clients FROM v_clients";

    $stmt = $db->conn->prepare($query);

    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC); //FETCH_ASSOC
    //return json_encode($items, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES);
    return $item['Clients'];
}

function getClient($id) {
    //Client - {"id": 10, "Org": null, "Card": "0810", "Name": null, "Phones": [{"Phone": "79297031047", "isDefault": 1}], "Comment": "", "Surname": null, "Addresses": [{"Flat": null, "Floor": 3, "Address": "Металлургов пр-кт. 74 ком.37", "geo_lat": null, "geo_lon": null, "house_id": null, "isDefault": null}, {"Flat": null, "Floor": 0, "Address": "Металлургов пр-кт. 74 37", "geo_lat": null, "geo_lon": null, "house_id": null, "isDefault": null}]}
    $db = new DB();
    $stmt = $db->conn->prepare("SET @@group_concat_max_len:=10000000");
    $stmt->execute();
    $query = "SELECT Client FROM v_clients where id=:id";

    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':id', $id);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    //return json_encode($items, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES);
    return $item['Client'];
}

function getClientObj($id) {
    return json_decode(getClient($id));
}

function getClientByPhone($Phone) {
    //Client - {"id": 10, "Org": null, "Card": "0810", "Name": null, "Phones": [{"Phone": "79297031047", "isDefault": 1}], "Comment": "", "Surname": null, "Addresses": [{"Flat": null, "Floor": 3, "Address": "Металлургов пр-кт. 74 ком.37", "geo_lat": null, "geo_lon": null, "house_id": null, "isDefault": null}, {"Flat": null, "Floor": 0, "Address": "Металлургов пр-кт. 74 37", "geo_lat": null, "geo_lon": null, "house_id": null, "isDefault": null}]}
    $db = new DB();
    //$query = "SELECT Client FROM person_phones pp left JOIN v_clients c ON pp.idPerson=c.id WHERE pp.Phone LIKE '%".$Phone."%' AND pp.isDefault=1";
    $query = "SELECT idPerson FROM person_phones pp WHERE pp.Phone LIKE '%" . $Phone . "%' AND pp.isDefault=1";
    $stmt = $db->conn->prepare($query);
    //$stmt->bindParam(':idClient', $idClient);
    $res = $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($stmt->rowCount() > 0) {
        $idClient = $item['idPerson'];
        return getClient($idClient);
    } else {
        return NULL;
    }
}

function getClientObjByPhone($Phone) {
    $db = new DB();
    $query = "SELECT idPerson FROM person_phones pp WHERE pp.Phone LIKE '%" . $Phone . "%' AND pp.isDefault=1";
    $stmt = $db->conn->prepare($query);
    $res = $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($stmt->rowCount() > 0) {
        $idClient = $item['idPerson'];
        return getClientObj($idClient);
    } else {
        return NULL;
    }
}

/**
 * Добавление\редактирование клиента. Если id присутствует, то редактируем. Проверяем, не существует ли в базе клмента с таким номером телефона.
 * @param json $Client
 * @return type
 */
function setClient($Client) {
    //Client - 
    //{"id": 10, "Org": null, "Card": "0810", "Name": null,
    //"Phones": [{"Phone": "79297031047", "isDefault": 1}],
    //"Comment": "", "Surname": null,
    //"Addresses": [{"Flat": null, "Floor": 3, "Address": "Металлургов пр-кт. 74 ком.37", "geo_lat": null, "geo_lon": null, "house_id": null, "isDefault": null}, 
    //              {"Flat": null, "Floor": 0, "Address": "Металлургов пр-кт. 74 37", "geo_lat": null, "geo_lon": null, "house_id": null, "isDefault": null}]}
    $db = new DB();
    $clientByPhone = null;
    //$Phone=null;
    //определяем есть ли в базе клиент с таким номером
    if (isset($Client["Phones"])) {
        foreach ($Client['Phones'] as $p) {
            $Phone = $p['Phone'];
            $isDefault = isset($p['isDefault']) ? intval($p['isDefault']) : 0;
            if ($isDefault == 1) {
                $clientByPhone = getClientObjByPhone($Phone);
                break;
            }
        }
    }

    // если есть id, то редактируем клиента
    if (isset($Client["id"])) { //modify client
        if ($clientByPhone !== null & $clientByPhone->id !== $Client["id"]) {
            return '{"status":0,"msg":"error: phone already exists on server","data":' . json_encode($clientByPhone, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES) . '}';
        }

        $id = $Client["id"];
        $Org = isset($Client['Org']) ? $Client['Org'] : null;
        $Card = isset($Client['Card']) ? $Client['Card'] : null;
        $Comment = isset($Client['Comment']) ? $Client['Comment'] : null;
        $Name = isset($Client['Name']) ? $Client['Name'] : null;
        $Surname = isset($Client['Surname']) ? $Client['Surname'] : null;

        $query = 'UPDATE clients SET Org=:Org,Card=:Card,Comment=:Comment WHERE idPerson=:id';
        $stmt = $db->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':Org', $Org, PDO::PARAM_STR);
        $stmt->bindParam(':Card', $Card, PDO::PARAM_STR);
        $stmt->bindParam(':Comment', $Comment, PDO::PARAM_STR);
        $stmt->execute();
        //$result=$stmt->rowCount() . " records UPDATED successfully";

        $query = 'UPDATE persons SET `Name`=:Name,Surname=:Surname WHERE id=:id';
        $stmt = $db->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':Name', $Name, PDO::PARAM_STR);
        $stmt->bindParam(':Surname', $Surname, PDO::PARAM_STR);
        $stmt->execute();

//first clear phones
        $count = $db->conn->exec("DELETE FROM person_phones WHERE idPerson=" . $id);

//then insert new phones
        $query = 'INSERT INTO person_phones (idPerson,Phone,isDefault) VALUES(:id,:Phone,:isDefault)';
        $stmt = $db->conn->prepare($query);
        $Phone = 1;
        $isDefault = 1;
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':Phone', $Phone, PDO::PARAM_STR);
        $stmt->bindParam(':isDefault', $isDefault, PDO::PARAM_INT);

        foreach ($Client['Phones'] as $p) {
            $Phone = $p['Phone'];
            $isDefault = isset($p['isDefault']) ? intval($p['isDefault']) : 0;
            $res = $stmt->execute();
        }
        return '{"status":1,"msg":"modified","data":' . getClient($id) . '}';
    } else { //create client
        if ($clientByPhone !== null) {
            return '{"status":0,"msg":"error: client phone already exists on server","data":' . json_encode($clientByPhone, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES) . '}';
        }

        $Org = isset($Client['Org']) ? $Client['Org'] : null;
        $Card = isset($Client['Card']) ? $Client['Card'] : null;
        $Comment = isset($Client['Comment']) ? $Client['Comment'] : null;
        $Name = isset($Client['Name']) ? $Client['Name'] : null;
        $Surname = isset($Client['Surname']) ? $Client['Surname'] : null;

        $query = 'INSERT INTO persons (Name,Surname) VALUES(:Name,:Surname)';
        $stmt = $db->conn->prepare($query);
        $stmt->bindParam(':Name', $Name, PDO::PARAM_STR);
        $stmt->bindParam(':Surname', $Surname, PDO::PARAM_STR);
        $stmt->execute();
        $id = $db->conn->lastInsertId();

        $query = 'INSERT INTO clients (idPerson,Org,Card,Comment) VALUES(:id,:Org,:Card,:Comment)';
        $stmt = $db->conn->prepare($query);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':Org', $Org, PDO::PARAM_STR);
        $stmt->bindParam(':Card', $Card, PDO::PARAM_STR);
        $stmt->bindParam(':Comment', $Comment, PDO::PARAM_STR);
        $stmt->execute();
        //$result=$stmt->rowCount() . " records UPDATED successfully";
        //first clear phones
        $count = $db->conn->exec("DELETE FROM person_phones WHERE idPerson=" . $id);
        //then insert new phones

        $query = 'INSERT INTO person_phones (idPerson,Phone,isDefault) VALUES(:id,:Phone,:isDefault)';
        $stmt = $db->conn->prepare($query);
        $Phone = 1;
        $isDefault = 1;
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->bindParam(':Phone', $Phone, PDO::PARAM_STR);
        $stmt->bindParam(':isDefault', $isDefault, PDO::PARAM_INT);

        foreach ($Client['Phones'] as $p) {
            $Phone = $p['Phone'];
            $isDefault = isset($p['isDefault']) ? intval($p['isDefault']) : 0;
            $res = $stmt->execute();
        }
        return '{"status":2,"msg":"created","data":' . getClient($id) . '}';
    }
    //$stmt = $db->conn->prepare("SET @@group_concat_max_len:=10000000");
    //$stmt->execute();
    //return json_encode($items, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES);
//    return getClient($id);
}

function getSessionUpdates($id_session) {
    //. "SUBSTRING_INDEX( ti.comment , '|', 1 ) AS comment, "
    //. "DATE_FORMAT(mk.startCoocking, '%H:%i') start_time, "
    $db = new DB();
//$db->conn->beginTransaction();

    $stmt = $db->conn->prepare("SELECT * from app_sessiondata where id_session=:id_session");

    $stmt->bindParam(':id_session', $id_session);
    //$date = date('Y.m.d');
    //$date = date('Y.m.d', strtotime('-1 day')); //'2015.12.27';
    $stmt->execute();
    $updates = $stmt->fetchAll(PDO::FETCH_ASSOC); //FETCH_ASSOC
    //$updates = json_decode($updates, true);
    //$updates = json_encode($updates, JSON_HEX_QUOT);

    $stmt = $db->conn->prepare("DELETE from app_sessiondata where id_session=:id_session");
    $stmt->bindParam(':id_session', $id_session);
    //$date = date('Y.m.d');
    //$date = date('Y.m.d', strtotime('-1 day')); //'2015.12.27';
    $res = $stmt->execute();
//$db->conn->commit();
    //foreach ($orders AS $key => $order) {
    //    $orders[$key]['client'] = json_decode($order['client']);
    //    $orders[$key]['products'] = json_decode($order['products']);
    //}
    //return json_encode($orders, JSON_UNESCAPED_UNICODE); //$orders
    //  $updates["data"]=preg_replace("!\r?\n!", "BLAH", $updates["data"]);
    return $updates;
}

function getSiteUpdates($idSite) {
    $db = new DB();
    $stmt = $db->conn->prepare("SET @@group_concat_max_len:=100000000");
    $stmt->execute();
    if ($idSite != 1) {
        $stmt = $db->conn->prepare("INSERT INTO app_siteupdates (idSite, event, data) SELECT 1,'updClient', Client FROM v_clients");
        $stmt->execute();
        $stmt = $db->conn->prepare("INSERT INTO app_siteupdates (idSite, event, data) SELECT 1,'updProduct', Product FROM v_products");
        $stmt->execute();
    }
    $idSite = 1;
    $stmt = $db->conn->prepare("SELECT concat('[',GROUP_CONCAT(json_object('event',event,'data',data)),']') as Updates from app_siteupdates where idSite=:idSite");
    $stmt->bindParam(':idSite', $idSite);
    $stmt->execute();
    $updates = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $res = '{"Status":0}';
    if ($updates[0]['Updates'] != '') {
        $res = '{"Status":1,"Updates":' . $updates[0]['Updates'] . '}';
    }
    $stmt = $db->conn->prepare("DELETE from app_siteupdates where idSite=:idSite");
    $stmt->bindParam(':idSite', $idSite);
    $stmt->execute();

    return $res;
}

function getUsers() {
    $db = new DB();
    $query = "SELECT e.idPerson, e.Name, e.idWorkplace, wp.idType FROM employees e left join workplaces wp on e.idWorkplace=wp.id";
    $stmt = $db->conn->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return json_encode($items, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
}

function getProducts() {
    $db = new DB();

    $stmt = $db->conn->prepare("SET @@group_concat_max_len:=10000000");
    $stmt->execute();

    //$query = "SELECT concat('\"Products\":[',group_concat(JSON_object('id',p.id, 'idType',p.idType, 'idPicture',p.idPicture, 'Name',p.Name, 'idGroup',p.idGroup, 'Weight',p.Weight, 'CookingTime',p.CookingTime, 'Comment',p.comment, 'idPricingType',bp.idPricingType, 'Price',bp.Price)),']') as Products FROM branches_products bp left join products p ON bp.idProduct=p.id WHERE bp.isActive=1 AND bp.idBranch=1";
    $query = "SELECT concat('[',group_concat(Product),']') as Products FROM v_products WHERE isActive=1 AND idBranch=1";
    $stmt = $db->conn->prepare($query);
    $stmt->execute();
    //$items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    //return json_encode($items, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
    $item = $stmt->fetch(PDO::FETCH_ASSOC);
//    return json_encode($items, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
    return $item['Products'];
}

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

function updateOrderKitchenID($idOrder, $idKitchen) {
    $db = new DB();
    $query = "UPDATE ilkato.orders SET idKitchen=:idKitchen WHERE id=:idOrder";
    //$query = "UPDATE employees SET isOnline=true WHERE id=3";
    //UPDATE module_kitchen SET `stopCoocking`=NOW() WHERE id=$id
//$db->conn->beginTransaction();
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':idOrder', $idOrder);
    $stmt->bindParam(':idKitchen', $idKitchen);
    $res = $stmt->execute();
//$db->conn->commit();
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

function updateOrderIdBatchAndIdStatus($idOrder, $idBatch, $idStatus) {
    $db = new DB();
    $query = "UPDATE ilkato.orders SET idBatch=:idBatch, idStatus=:idStatus WHERE id=:idOrder";
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':idOrder', $idOrder);
    $stmt->bindParam(':idBatch', $idBatch, PDO::PARAM_INT);
    $stmt->bindParam(':idStatus', $idStatus, PDO::PARAM_INT);
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

function createOrder($order) {
    $db = new DB();
    //SELECT MAX(No)+1 from orders WHERE DDate='2016-11-27'
    $query = "INSERT INTO orders (idBranch,idClient,idPricingType,idStatus,idKitchen,idBatch,idCreatedBy,Price,Comment,QueueNo,CDate,CTime,DDate,DTime) VALUES (:idBranch,:idClient,:idPricingType,1,:idKitchen,:idBatch,:idCreatedBy,:Price,:Comment,:QueueNo,:CDate,:CTime,:DDate,:DTime)";
//    $query = "INSERT INTO orders (idBranch,idClient,idPricingType,idStatus,idKitchen,idBatch,idCreatedBy,Price,Comment,QueueNo,DDate,DTime,No) VALUES (:idBranch,:idClient,:idPricingType,:idStatus,:idKitchen,:idBatch,:idCreatedBy,:Price,:Comment,:QueueNo,:DDate,:DTime,(SELECT MAX(No)+1 from orders WHERE DDate='".$order['DDate']."'))";
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':idBranch', $order['idBranch']);
    $stmt->bindParam(':idClient', $order['Client']['id']); //);
    //$order['Client']['id']
    //$order['Products'][1]['id']
    $stmt->bindParam(':idPricingType', $order['idPricingType']);
    //$stmt->bindParam(':idStatus', $order['idStatus']);
    $stmt->bindParam(':idKitchen', $order['idKitchen']);
    $stmt->bindParam(':idBatch', $order['idBatch']);
    $stmt->bindParam(':idCreatedBy', $order['idCreatedBy']);
//No
    $stmt->bindParam(':Price', $order['Price']);
//ts
    $stmt->bindParam(':Comment', $order['Comment']);
    $stmt->bindParam(':QueueNo', $order['QueueNo']);
    $stmt->bindParam(':CDate', $order['CDate']);
    $stmt->bindParam(':CTime', $order['CTime']);
    $stmt->bindParam(':DDate', $order['DDate']);
    $stmt->bindParam(':DTime', $order['DTime']);
    
    if (!isset($order['CDate'])) {
        $order['CDate'] = date('Y.m.d'); //set curent
    }
    if (!isset($order['CTime'])) {
        $order['CTime'] = date('H:i:s'); //set curent
    }
//echo 'try create from';
//    var_dump($order);
//    $order['Client']['id'];
//    return;
    $res = $stmt->execute();

    $id = $db->conn->lastInsertId();
    $idProduct = 1;
    $isGift = 1;
    $Count = 1;
    $Comment = 1;

    $query = "INSERT INTO orders_products (idOrder,idProduct,isGift,Count,Comment) VALUES (:idOrder,:idProduct,:isGift,:Count,:Comment)";
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':idOrder', $id);
    $stmt->bindParam(':idProduct', $idProduct);
    $stmt->bindParam(':isGift', $isGift);
    $stmt->bindParam(':Count', $Count);
    $stmt->bindParam(':Comment', $Comment);



    foreach ($order['Products'] as $p) {
        $idProduct = intval($p['id']);
        $isGift = isset($p['isGift']) ? intval($p['isGift']) : 0;
        $Count = isset($p['Count']) ? intval($p['Count']) : 1;
        $Comment = isset($p['Comment']) ? $p['Comment'] : null;
        //$res = $stmt->execute();
    }

//    $a = array('phone' => 111111111, 'image' => "sadasdasd43eadasdad");
//    $db->insertArray('user', $a);
//    // This will asume your table has a 'id' column, id: 1 will be updated in the example below:
//    $db->updateArray('user', 1, $a);

    return getOrderObj($id);
}

function createBatch($date = null) {
    $db = new DB();
    $query = "INSERT INTO batches(isActive,DDate) VALUES (1,:date)";
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':date', $date);
    if (!isset($date)) {
        $date = date('Y.m.d'); //set curent
    }
    $res = $stmt->execute();
    //return $res;

    $query = "SELECT * from batches where DDate=:date";
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':date', $date);
    //$date = date('Y.m.d');
    //$date = date('Y.m.d', strtotime('-1 day')); //'2015.12.27';
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC); //FETCH_ASSOC
    //return json_encode($orders, JSON_UNESCAPED_UNICODE); //$orders
    return $items;
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

function fillApp_site($idSite) {
    $db = new DB();
    $stmt = $db->conn->prepare("SET @@group_concat_max_len:=10000000");
    $stmt->execute();
    $query = "SELECT p.id,
        JSON_OBJECT(
        'id',p.id,
        'Name',p.Name,
        'Surname',p.Surname,
        'Org',c.Org,
        'Comment',c.Comment,
        'Card',c.Card,
        'Addresses',(select cast(concat('[',group_concat(json_object('Address',pa.Address,'house_id',pa.house_id,'Flat',pa.flat,'Floor',pa.floor,'geo_lat',pa.geo_lat,'geo_lon',pa.geo_lon,'isDefault',pa.isDefault) separator ','),']') as json)
           from person_addresses pa where (pa.idPerson = c.idPerson)),
        'Phones',(select cast(concat('[',group_concat(json_object('Phone',pp.Phone,'isDefault',pp.isDefault) separator ','),']') as json)
           from person_phones pp where (pp.idPerson = c.idPerson))
        ) AS Client
        FROM clients c LEFT JOIN persons p ON c.idPerson = p.id where c.idPerson=:idClient";

    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':idClient', $idClient);
    $stmt->execute();
    $item = $stmt->fetch(PDO::FETCH_ASSOC); //FETCH_ASSOC
    //return json_encode($items, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES);
    return $item['Client'];
}

/**
 * Определяет находится ли точка в многоугольнике
 * @param array $point Точка [x,y]
 * @param array $polygon Координаты многоугольника [[x,y],[x,y]...]
 * @return boolean
 */
function in_polygon($point, $polygon) {
    if ($polygon[0] != $polygon[count($polygon) - 1])
        $polygon[count($polygon)] = $polygon[0];
    $j = 0;
    $oddNodes = false;
    $x = $point[1];
    $y = $point[0];
    $n = count($polygon);
    for ($i = 0; $i < $n; $i++) {
        $j++;
        if ($j == $n) {
            $j = 0;
        }
        if ((($polygon[$i][0] < $y) && ($polygon[$j][0] >= $y)) || (($polygon[$j][0] < $y) && ($polygon[$i][0] >= $y))) {
            if ($polygon[$i][1] + ($y - $polygon[$i][0]) / ($polygon[$j][0] - $polygon[$i][0]) * ($polygon[$j][1] -
                    $polygon[$i][1]) < $x) {
                $oddNodes = !$oddNodes;
            }
        }
    }
    return $oddNodes;
}

/**
 * Анализирует местоположение курьера и назначает ему заказы, если нужно
 * @param type $id id курьера
 * @param type $lat GPS координаты курьера
 * @param type $lon GPS координаты курьера
 * @return int
 */
function setCourierCoords($id, $lat, $lon) {
    return 1;
}

// Parameters:
// Table: Name of table to update
// Data: array of $field->$value with new values
// Id Field: Name of field to use as ID field
// Id Value: Value of ID field
FUNCTION mysql_update_array($table, $data, $id_field, $id_value) {
    FOREACH ($data AS $field => $value) {
        $fields[] = SPRINTF("`%s` = '%s'", $field, MYSQL_REAL_ESCAPE_STRING($value));
    }
    $field_list = JOIN(',', $fields);

    $query = SPRINTF("UPDATE `%s` SET %s WHERE `%s` = %s", $table, $field_list, $id_field, INTVAL($id_value));

    RETURN $query;
}
