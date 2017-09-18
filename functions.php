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
    $result = [
        "status" => NULL,
        "msg" => NULL,
        "data" => NULL
    ];

    //. "SUBSTRING_INDEX( ti.comment , '|', 1 ) AS comment, "
    //. "DATE_FORMAT(mk.startCoocking, '%H:%i') start_time, "
    $db = new DB();
    $query = "SELECT * from v_orders where DDate=:date";
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':date', $date);
    //$date = date('Y.m.d');
    //$date = '2017-07-29';
    //$date = date('Y.m.d', strtotime('-1 day')); //'2015.12.27';
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC); //FETCH_ASSOC

    foreach ($items AS $key => $order) {
        $items[$key]['Client'] = json_decode($order['Client']);
        $items[$key]['Products'] = json_decode($order['Products']);
        $items[$key]['Log'] = json_decode($order['Log']);
    }
    if (!empty($items)) {
        $result['status'] = 1;
        $result['msg'] = 'найдено ' . count($items);
        $result['data'] = $items;
    } else {
        $result['status'] = 0;
        $result['msg'] = 'заказы не найдены';
        $result['data'] = NULL;
    }
    //return json_encode($orders, JSON_UNESCAPED_UNICODE); //$orders
    //return $items;
    return json_encode($result, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
}

function getOOrders() {
    $db = new DB();
    $query = "SELECT * from v_orders where idStatus<>7";
    $stmt = $db->conn->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC); //FETCH_ASSOC
    foreach ($items AS $key => $order) {
        $items[$key]['Client'] = json_decode($order['Client']);
        $items[$key]['Products'] = json_decode($order['Products']);
        $items[$key]['Log'] = json_decode($order['Log']);
    }
    //return json_encode($orders, JSON_UNESCAPED_UNICODE); //$orders
    return $items;
}

function getKOrders() {
    $db = new DB();
    $query = "SELECT * from v_orders where idStatus in (2,3,4) and idKitchen=5";
    $stmt = $db->conn->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC); //FETCH_ASSOC
    foreach ($items AS $key => $order) {
        $items[$key]['Client'] = json_decode($order['Client']);
        $items[$key]['Products'] = json_decode($order['Products']);
        $items[$key]['Log'] = json_decode($order['Log']);
    }
    //return json_encode($orders, JSON_UNESCAPED_UNICODE); //$orders
    return $items;
}

function getCOrders() {
    $db = new DB();
    $query = "SELECT * from v_orders where idStatus in (5,6)";
    $stmt = $db->conn->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC); //FETCH_ASSOC
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
//    $query = "SELECT CAST(concat('[',group_concat(Client),']') AS json) as Clients FROM v_clients";

    $query = "SELECT * from v_clients";
    $stmt = $db->conn->prepare($query);

    $stmt->execute();
//    $item = $stmt->fetch(PDO::FETCH_ASSOC); //FETCH_ASSOC

    $items = $stmt->fetchAll(PDO::FETCH_ASSOC); //FETCH_ASSOC

    //return json_encode($items, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES);
//    return $item['Clients'];
    return json_encode($items, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
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
        return '{"status":0,"msg":"client doesnt exist"}';
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
        return null;
    }
}

/**
 * Добавление\редактирование клиента. Если id присутствует, то редактируем. Проверяем, не существует ли в базе клмента с таким номером телефона.
 * @param JSON $Client
 * @return JSON
 */
function setClient($Client) {
    $result = [
        "status" => NULL,
        "msg" => NULL,
        "data" => NULL
    ];
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
    if (!empty($Client["Phones"])) {
        foreach ($Client['Phones'] as $p) {
            $Phone = $p['Phone'];

            //eliminate every char except 0-9
            $justNums = preg_replace("/[^0-9]/", '', $Phone);
            //eliminate leading 7 if its there
            if (strlen($justNums) == 11)
                $justNums = preg_replace("/^7/", '', $justNums);
            //if we have 10 digits left, it's probably valid.
            if (strlen($justNums) == 10) {
                ///(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:(\s*([2-9]1[02-9]|[2-9][02-8]‌​1|[2-9][02-8][02-9])‌​\s*)|([2-9]1[02-9]|[‌​2-9][02-8]1|[2-9][02‌​-8][02-9]))\s*(?:[.-‌​]\s*)?)([2-9]1[02-9]‌​|[2-9][02-9]1|[2-9][‌​02-9]{2})\s*(?:[.-]\‌​s*)?([0-9]{4})/
                $Phone = $justNums;
            } else {
                return '{"status":0,"msg":"error: wrong phone number","data":"' . $Phone . '"}';
            }

            $isDefault = !empty($p['isDefault']) ? intval($p['isDefault']) : 0;
            if ($isDefault == 1) {
                $clientByPhone = getClientObjByPhone($Phone);
                break;
            }
        }
    }


    if (!empty($Client["id"])) {
//MODIFY
        if ($clientByPhone !== null && $clientByPhone->id !== $Client["id"]) {
            return '{"status":0,"msg":"error: phone already exists on server","data":' . json_encode($clientByPhone, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES) . '}';
        }

        $id = $Client["id"];
        $Org = !empty($Client['Org']) ? $Client['Org'] : null;
        $Card = !empty($Client['Card']) ? $Client['Card'] : null;
        $Comment = !empty($Client['Comment']) ? $Client['Comment'] : null;
        $Name = !empty($Client['Name']) ? $Client['Name'] : null;
        $Surname = !empty($Client['Surname']) ? $Client['Surname'] : null;

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

        if (!empty($Client["Phones"])) {
            $result["debug"]["phones"] = setClientPhones($id, $Client["Phones"]);
        }
        if (!empty($Client["Addresses"])) {
            $result["debug"]["addresses"] = setClientAddresess($id, $Client["Addresses"]);
        }
        $result["status"] = 2;
        $result["msg"] = "modified";
    } else {
//CREATE
        if ($clientByPhone !== null) {
            return '{"status":0,"msg":"error: client phone already exists on server","data":' . json_encode($clientByPhone, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES) . '}';
        }

        $Org = !empty($Client['Org']) ? $Client['Org'] : null;
        $Card = !empty($Client['Card']) ? $Client['Card'] : null;
        $Comment = !empty($Client['Comment']) ? $Client['Comment'] : null;
        $Name = !empty($Client['Name']) ? $Client['Name'] : null;
        $Surname = !empty($Client['Surname']) ? $Client['Surname'] : null;

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

        if (!empty($Client["Phones"])) {
            $result["debug"]["phones"] = setClientPhones($id, $Client["Phones"]);
        }
        if (!empty($Client["Addresses"])) {
            $result["debug"]["addresses"] = setClientAddresess($id, $Client["Addresses"]);
        }
        $result["status"] = 1;
        $result["msg"] = "created";
    }
    $result["data"] = getClientObj($id);
    return json_encode($result, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
    //$stmt = $db->conn->prepare("SET @@group_concat_max_len:=10000000");
    //$stmt->execute();
    //return json_encode($items, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK | JSON_UNESCAPED_SLASHES);
}

function setClientAddresess($idClient, $addresses) {
    $db = new DB();

//если в базе есть ненужные адреса, то удаляем их
    $ids = [];
    foreach ($addresses as $a) {
        if (!empty($a['id'])) {
            $ids[] = $a['id']; //add to arr
        }
    }
    $len = count($ids);
    if ($len > 0) {
        //$qMarks = str_repeat('?,', count($ids) - 1) . '?';
        //echo "len=$len and marks=$qMarks";
        $inQuery = implode(",", $ids);
        //echo('DELETE FROM addresses WHERE id IN(SELECT idAddress FROM person_addresses WHERE idPerson=' . $id . ' AND NOT idAddress IN(' . $inQuery . '))');
        $db->conn->exec('DELETE FROM person_addresses WHERE idPerson=' . $idClient . ' AND NOT idAddress IN(' . $inQuery . ')');
        $db->conn->exec('DELETE FROM addresses WHERE id IN(SELECT idAddress FROM person_addresses WHERE idPerson=' . $idClient . ' AND NOT idAddress IN(' . $inQuery . '))');
    }
//--------
//            $count = $db->conn->exec("DELETE FROM person_addresses WHERE idPerson=" . $id);
    //$query = "insert INTO addresses (id, flat, floor, Address, geo_lat, geo_lon) VALUES (:id, :flat, :floor, :address, :lat, :lon) ON DUPLICATE KEY UPDATE flat=:flat, floor=:floor, address=:address, geo_lat=:lat, geo_lon=:lon";
    $stmtAdrIns = $db->conn->prepare("insert INTO addresses (house_id,flat, floor, Address, geo_lat, geo_lon) VALUES (:house_id, :flat, :floor, :address, :lat, :lon)");
    $stmtAdrUpd = $db->conn->prepare("UPDATE addresses SET house_id=:house_id, flat=:flat, floor=:floor, Address=:address, geo_lat=:lat, geo_lon=:lon where id=:id");
    $idAddress = NULL;
    $house_id = NULL;
    $flat = NULL;
    $floor = NULL;
    $address = NULL;
    $lat = NULL;
    $lon = NULL;

    $stmtAdrIns->bindParam(':house_id', $house_id, PDO::PARAM_STR);
    $stmtAdrIns->bindParam(':flat', $flat, PDO::PARAM_INT);
    $stmtAdrIns->bindParam(':floor', $floor, PDO::PARAM_INT);
    $stmtAdrIns->bindParam(':address', $address, PDO::PARAM_STR);
    $stmtAdrIns->bindParam(':lat', $lat, PDO::PARAM_STR);
    $stmtAdrIns->bindParam(':lon', $lon, PDO::PARAM_STR);

    $stmtAdrUpd->bindParam(':id', $idAddress, PDO::PARAM_INT);
    $stmtAdrUpd->bindParam(':house_id', $house_id, PDO::PARAM_STR);
    $stmtAdrUpd->bindParam(':flat', $flat, PDO::PARAM_INT);
    $stmtAdrUpd->bindParam(':floor', $floor, PDO::PARAM_INT);
    $stmtAdrUpd->bindParam(':address', $address, PDO::PARAM_STR);
    $stmtAdrUpd->bindParam(':lat', $lat, PDO::PARAM_STR);
    $stmtAdrUpd->bindParam(':lon', $lon, PDO::PARAM_STR);

    //$query = "insert INTO person_addresses (idPerson, idAddress, isDefault) VALUES (:idPerson, :idAddress, :isDefault) ON DUPLICATE KEY UPDATE isDefault=:isDefault";
//            $query = "insert INTO person_addresses (idPerson, flat, floor, Address, geo_lat, geo_lon, isDefault) VALUES (:id, :flat, :floor, :address, :lat, :lon, :isDefault)";
    $stmtPAIns = $db->conn->prepare("insert INTO person_addresses (idPerson, idAddress, isDefault) VALUES (:idPerson, :idAddress, :isDefault)");
    $stmtPAUpd = $db->conn->prepare("UPDATE person_addresses SET isDefault=:isDefault where idPerson=:idPerson and idAddress=:idAddress");
    $isDefault = 1;

    $stmtPAIns->bindParam(':idPerson', $idClient, PDO::PARAM_INT);
    $stmtPAIns->bindParam(':idAddress', $idAddress, PDO::PARAM_INT);
    $stmtPAIns->bindParam(':isDefault', $isDefault, PDO::PARAM_INT);

    $stmtPAUpd->bindParam(':idPerson', $idClient, PDO::PARAM_INT);
    $stmtPAUpd->bindParam(':idAddress', $idAddress, PDO::PARAM_INT);
    $stmtPAUpd->bindParam(':isDefault', $isDefault, PDO::PARAM_INT);

    $result = [];
    foreach ($addresses as $a) {
        $idAddress = NULL;
        $house_id = empty($a['house_id']) ? NULL : $a['house_id'];
        $flat = empty($a['Flat']) ? NULL : $a['Flat'];
        $floor = empty($a['Floor']) ? NULL : $a['Floor'];
        $address = empty($a['Address']) ? NULL : $a['Address'];
        $lat = empty($a['geo_lat']) ? NULL : $a['geo_lat'];
        $lon = empty($a['geo_lon']) ? NULL : $a['geo_lon'];

        $c = count($addresses);
        $isDefault = empty($a['isDefault']) ? ($c == 1 ? 1 : 0) : intval($a['isDefault']);

        if (empty($a['id'])) {//add new addr
            $r1 = $stmtAdrIns->execute();
            $idAddress = $db->conn->lastInsertId();
            $r2 = $stmtPAIns->execute();
            $result[] = ["address" => $a["Address"], "addressInsertStatus" => $r1, "person_addressInsertStatus" => $r2, "rowsAffected" => $stmtPAIns->rowCount()];
        } else {
            $idAddress = $a['id'];
            //$addrExists = $db->conn->query("select count(*) from addresses where id=" . $idAddress)->fetchColumn() > 0;
            $paExists = $db->conn->query("select count(*) from person_addresses where idPerson=" . $idClient . " and idAddress=" . $idAddress)->fetchColumn() > 0;

            //echo $addrExists;
            //echo $paExists;
            if ($paExists) {
                $result[] = ["address" => $a["Address"], "addressUpdateStatus" => $stmtAdrUpd->execute(), "person_addressUpdateStatus" => $stmtPAUpd->execute(), "rowsAffected" => $stmtPAIns->rowCount()];
            } else {
                $r2 = $stmtPAIns->execute();
                $result[] = ["address" => $a["Address"], "failed" => "в безе не существует адреса с id=$idAddress"];
                $result["status"] = 0;
                $result["msg"] = "в безе не существует адреса с id=$idAddress";
            }
        }
    }
    return $result;
}

function setClientPhones($idClient, $phones) {
    $db = new DB();
//удаляем ненужные телефоны, если они есть
    $result = [];
    $nums = [];
    foreach ($phones as $p) {
        if (!empty($p['Phone'])) {
            $nums[] = $p['Phone'];
        }
    }
    $len = count($nums);

    if ($len > 0) {
        $inQuery = implode(",", $nums);
        //echo('DELETE FROM addresses WHERE id IN(SELECT idAddress FROM person_addresses WHERE idPerson=' . $id . ' AND NOT idAddress IN(' . $inQuery . '))');
        $r1 = $db->conn->exec('DELETE FROM person_phones WHERE idPerson=' . $idClient . ' AND NOT Phone IN(' . $inQuery . ')');
        $result["deleted"] = $r1;
    }

    $query = 'INSERT INTO person_phones (idPerson,Phone,isDefault) VALUES(:id,:Phone,:isDefault) on duplicate key update isDefault=:isDefault';
    $stmt = $db->conn->prepare($query);
    $Phone = 1;
    $isDefault = 1;
    $stmt->bindParam(':id', $idClient, PDO::PARAM_INT);
    $stmt->bindParam(':Phone', $Phone, PDO::PARAM_STR);
    $stmt->bindParam(':isDefault', $isDefault, PDO::PARAM_INT);
    $c = count($phones);

    foreach ($phones as $p) {
        //eliminate every char except 0-9
        $justNums = preg_replace("/[^0-9]/", '', $p['Phone']);
        //eliminate leading 7 if its there
        $justNums = preg_replace("/^7/", '', $justNums);
        $Phone = $justNums;
        $isDefault = empty($p['isDefault']) ? ($c == 1 ? 1 : 0) : intval($p['isDefault']);
        $r2 = $stmt->execute();
        $result[] = ["Phone" => $p["Phone"], "person_phonesStatus" => $r2, "rowsAffected" => $stmt->rowCount()];
    }
    return $result;
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
    $query = "SELECT e.idPerson, e.Name, e.idWorkplace, wp.idType FROM employees e left join workplaces wp on e.idWorkplace=wp.id WHERE e.isActive=1";
    $stmt = $db->conn->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    return json_encode($items, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
}

function getCouriers() {
    $db = new DB();
    $query = "SELECT e.idPerson, e.Name, e.idWorkplace, wp.idType FROM employees e left join workplaces wp on e.idWorkplace=wp.id WHERE e.idPost=4";
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

function updateUserStatus($idPerson, $isActive) {
//    $db = new DB();
//    $query = "UPDATE employees SET isOnline=:isOnline WHERE idPerson=:idPerson";
//    //$query = "UPDATE employees SET isOnline=true WHERE id=3";
//    //UPDATE module_kitchen SET `stopCoocking`=NOW() WHERE id=$id
//    $stmt = $db->conn->prepare($query);
//    $stmt->bindParam(':idPerson', $idPerson);
//    $stmt->bindParam(':isActive', $isActive);
//    $res = $stmt->execute();
//    return $res;
}

function updateOrderKitchenID($idOrder, $idKitchen) {
    $db = new DB();
    $query = "UPDATE orders SET idKitchen=:idKitchen WHERE id=:idOrder";
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
    $query = "UPDATE orders SET idStatus=:idStatus WHERE id=:idOrder";
    //$query = "UPDATE employees SET isOnline=true WHERE id=3";
    //UPDATE module_kitchen SET `stopCoocking`=NOW() WHERE id=$id
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':idOrder', $idOrder);
    $stmt->bindParam(':idStatus', $idStatus);
    $res = $stmt->execute();
    copyOrderToSessionData($idOrder);
    return $res;
}

function updateOrderProductsIsCookedStatus($idOrder, $Products) {
    $db = new DB();
    $query = "UPDATE orders_products SET isCooked=:isCooked WHERE idOrder=:idOrder and idProduct=:idProduct";
    //$query = "UPDATE employees SET isOnline=true WHERE id=3";
    //UPDATE module_kitchen SET `stopCoocking`=NOW() WHERE id=$id
    $stmt = $db->conn->prepare($query);
    $idProduct = 0;
    $isCooked = 0;
    $stmt->bindParam(':idOrder', $idOrder);
    $stmt->bindParam(':idProduct', $idProduct);
    $stmt->bindParam(':isCooked', $isCooked);

    $allIsCooked = 1;

    foreach ($Products as $p) {
        $idProduct = intval($p['id']);
        $isCooked = empty($p['isCooked']) ? 0 : intval($p['isCooked']);
        if ($isCooked == 0) {
            $allIsCooked = 0;
        }
        $res = $stmt->execute();
    }

    $result = [
        "status" => 1,
        "msg" => NULL,
        "data" => NULL
    ];

    if ($allIsCooked == 1) {//если весь заказ приготовлен, то меняем статус заказа
        updateOrderStatus($idOrder, 4); //приготовлен
        $result['msg'] = 'status set to 4 (приготовлен)';
    }

    copyOrderToSessionData($idOrder);
    // TODO copyBatch///
    return json_encode($result, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
}

function updateOrderIdBatchAndIdStatus($idOrder, $idBatch, $idStatus) {
    $db = new DB();
    $query = "UPDATE orders SET idBatch=:idBatch, idStatus=:idStatus, idKitchen=5 WHERE id=:idOrder";
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':idOrder', $idOrder, PDO::PARAM_INT);
    $stmt->bindParam(':idBatch', $idBatch, PDO::PARAM_INT);
    $stmt->bindParam(':idStatus', $idStatus, PDO::PARAM_INT);
    //bindValue(":null", null, PDO::PARAM_NULL);;
    $result = [
        "status" => NULL,
        "msg" => NULL,
        "data" => NULL
    ];
    $res = $stmt->execute();
    if ($res == 1) {
        $result["status"] = 1;
        //$result["msg"] = "success";
    } else {
        $result["status"] = 0;
        //$result["msg"] = "modified";
    }
    copyOrderToSessionData($idOrder);

    return json_encode($result, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
}

function updateBatch($id, $idCourier, $QueueNo) {
    $db = new DB();
    $query = "UPDATE batches SET idCourier=:idCourier, QueueNo=:QueueNo WHERE id=:id";
    //$query = "UPDATE employees SET isOnline=true WHERE id=3";
    //UPDATE module_kitchen SET `stopCoocking`=NOW() WHERE id=$id
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(':id', $id, PDO::PARAM_INT);
    $stmt->bindParam(':idCourier', $idCourier, PDO::PARAM_INT);
    $stmt->bindParam(':QueueNo', $QueueNo, PDO::PARAM_INT);
    $res = $stmt->execute();
    return $res;
}

/**
 * Добавление\редактирование заказа. Если id присутствует, то редактируем.
 * @param JSON $order
 * @return JSON
 */
function setOrder($order) {
    //var_dump($order);
    $result = [
        "status" => NULL,
        "msg" => NULL,
        "data" => NULL
    ];


//$result = '{"status":1,"msg":"created","data":' . json_encode($order, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK) . '}';
    $queryIns = "INSERT INTO orders (idBranch,idClient,idPricingType,idStatus,idKitchen,idBatch,idCreatedBy,Price,Comment,QueueNo,CDate,CTime,DDate,DTime,Phone,idAddress) VALUES (:idBranch,:idClient,:idPricingType,:idStatus,:idKitchen,:idBatch,:idCreatedBy,:Price,:Comment,:QueueNo,:CDate,:CTime,:DDate,:DTime,:Phone,:idAddress)";
    $queryUpd = "UPDATE orders SET idBranch=:idBranch,idClient=:idClient,idPricingType=:idPricingType,idStatus=:idStatus,idKitchen=:idKitchen,idBatch=:idBatch,idCreatedBy=:idCreatedBy,Price=:Price,Comment=:Comment,QueueNo=:QueueNo,DDate=:DDate,DTime=:DTime,Phone=:Phone,idAddress=:idAddress WHERE id=:id";
    $idStatus = empty($order["idStatus"]) ? 1 : $order["idStatus"];
    $isNew = empty($order["id"]); // если id задан, то заказ создается, иначе редактируется

    $db = new DB();

//SELECT MAX(No)+1 from orders WHERE DDate='2016-11-27'

    $stmt = $db->conn->prepare($isNew ? $queryIns : $queryUpd);
    if ($isNew) {
        $result["status"] = 1;
        $result["msg"] = "created";
    } else {
        $result["status"] = 2;
        $result["msg"] = "modified";
        $db->conn->exec('DELETE from orders_products WHERE idOrder=' . $order["id"]); //очистим список продуктов
        $stmt->bindParam(':id', $order['id'], PDO::PARAM_INT);
    }
    if ($order['idBranch'] == null) {
        $order['idBranch'] = 1;
    }
    $stmt->bindParam(':idBranch', $order['idBranch'], PDO::PARAM_INT);
    $stmt->bindParam(':idClient', $order['Client']['id'], PDO::PARAM_INT); //);
//$order['Client']['id']
//$order['Products'][1]['id']

    if ($order['idPricingType'] == null) {
        $order['idPricingType'] = 1;
    }
    $stmt->bindParam(':idPricingType', $order['idPricingType'], PDO::PARAM_INT);
    $stmt->bindParam(':idStatus', $idStatus, PDO::PARAM_INT);
    $stmt->bindParam(':idKitchen', $order['idKitchen'], PDO::PARAM_INT);
    $stmt->bindParam(':idBatch', $order['idBatch'], PDO::PARAM_INT);
    $stmt->bindParam(':idCreatedBy', $order['idCreatedBy'], PDO::PARAM_INT);
//No
    $stmt->bindParam(':Price', $order['Price'], PDO::PARAM_STR);
//ts
    $stmt->bindParam(':Comment', $order['Comment']);
    $stmt->bindParam(':QueueNo', $order['QueueNo']);
    $stmt->bindParam(':DDate', $order['DDate']);
    $stmt->bindParam(':DTime', $order['DTime']);
    $stmt->bindParam(':Phone', $order['Phone']);
    $stmt->bindParam(':idAddress', $order['idAddress']);
    if ($isNew) {
        $stmt->bindParam(':CDate', $order['CDate']);
        $stmt->bindParam(':CTime', $order['CTime']);
        if (empty($order['CDate'])) {
            $order['CDate'] = date('Y.m.d'); //set curent
        }
        if (empty($order['CTime'])) {
            $order['CTime'] = date('H:i:s'); //set curent
        }
    }
    $res = $stmt->execute();

    if ($isNew) {
        $order["id"] = $db->conn->lastInsertId();
    }
    $idOrder = null;
    $idProduct = NULL;
    $isCooked = NULL;
    $isGift = NULL;
    $Price = NULL;
    $Count = NULL;
    $Weight = NULL;
    $Comment = NULL;


    //$stmt = $db->conn->prepare("INSERT INTO orders_products (idOrder,idProduct,isGift,Count,Comment) VALUES (54360,774,0,2,null)");
    $stmt = $db->conn->prepare("INSERT INTO orders_products (idOrder,idProduct,isCooked,isGift,Price,Count,Weight,Comment) VALUES (:idOrder,:idProduct,:isCooked,:isGift,:Price,:Count,:Weight,:Comment)");
    $stmt->bindParam(':idOrder', $idOrder, PDO::PARAM_INT);
    $stmt->bindParam(':idProduct', $idProduct, PDO::PARAM_INT);
    $stmt->bindParam(':isCooked', $isCooked);
    $stmt->bindParam(':isGift', $isGift);
    $stmt->bindParam(':Price', $Price);
    $stmt->bindParam(':Count', $Count, PDO::PARAM_INT);
    $stmt->bindParam(':Weight', $Weight);
    $stmt->bindParam(':Comment', $Comment);

    foreach ($order['Products'] as $p) {
        //{"id": 774, "Count": 2}, {"id": 1319, "Count": 1}, {"id": 1319, "Coun
        $idOrder = $order["id"];
        $idProduct = intval($p['id']);
        $isCooked = empty($p['isCooked']) ? 0 : intval($p['isCooked']);
        $isGift = empty($p['isGift']) ? 0 : intval($p['isGift']);
        $Price = empty($p['Price']) ? 0 : $p['Price'];
        //$Price = empty($p['Price']) ? 0 : intval($p['Price']);
        $Count = empty($p['Count']) ? 1 : intval($p['Count']);
        $Weight = empty($p['Weight']) ? 0 : intval($p['Weight']);
        $Comment = empty($p['Comment']) ? null : $p['Comment'];
        $res = $stmt->execute();
    }

//    $a = array('phone' => 111111111, 'image' => "sadasdasd43eadasdad");
//    $db->insertArray('user', $a);
//    // This will asume your table has a 'id' column, id: 1 will be updated in the example below:
//    $db->updateArray('user', 1, $a);
    $result["data"] = getOrderObj($order["id"]);
    copyOrderToSessionData($order["id"]);
    return json_encode($result, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
}

function copyOrderToSessionData($idOrder) {
    /* Вызов хранимой процедуры с INOUT параметром */
    $db = new DB();
    $query = "CALL copyOrderToSessionData(?)";
    $stmt = $db->conn->prepare($query);
    $stmt->bindParam(1, $idOrder, PDO::PARAM_INT);
//$sth->bindParam(1, $colour, PDO::PARAM_STR|PDO::PARAM_INPUT_OUTPUT, 12);
    $stmt->execute();
//print("After pureeing fruit, the colour is: $colour");
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

    $query = "UPDATE batches SET QueueNo=? WHERE id=?";
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
    $stmt->bindParam(':uid', $uid, PDO::PARAM_INT);
    $stmt->bindParam(':wid', $wid, PDO::PARAM_INT);
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
