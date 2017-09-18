<?php
error_reporting(E_ALL);

ini_set('display_errors', 1);

if (version_compare(PHP_VERSION, '5.6.0') <= 0) {
    define('JSON_UNESCAPED_UNICODE', 256);
}
date_default_timezone_set('Europe/Samara');
error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once 'database.php';


echo 'db init...';
    $db = new DB();
	echo 'done<br/>';

    $query = "SELECT * FROM employees";
    $stmt = $db->conn->prepare($query);
    $stmt->execute();
    $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($items, JSON_UNESCAPED_UNICODE);
