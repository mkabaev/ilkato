<?php

require_once 'database.php';
header('Content-Type: application/json');

$s = filter_input(INPUT_GET, 's');
$term = filter_input(INPUT_GET, 'term');
////$actionG = filter_input(INPUT_GET, 'action');
////if ($actionG = 'getUsers') {
////    echo getUsers();
////}
function searchClients($term) {
    //. "SUBSTRING_INDEX( ti.comment , '|', 1 ) AS comment, "
    //. "DATE_FORMAT(mk.startCoocking, '%H:%i') start_time, "
    $db = new DB();
    $stmt = $db->conn->prepare("SELECT Phone as label, idClient, idPerson, Name from v_clients where Phone like '".$term."%' limit 20");
//    $stmt->bindParam(':term', $term);
    $stmt->execute();
    //$result = $stmt->fetchAll(PDO::FETCH_COLUMN);
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC); //FETCH_ASSOC
    return $result;
}

switch ($s) {
    case 'clients':
        $data=searchClients($term);
        echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
        break;
    default:
        header('Content-Type: application/json');
        echo '{"error":"no:"' . $s . '}';
        break;
}    