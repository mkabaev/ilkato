<?php

//мониторит изменения в базе и шлет их клиенту (Server Sent Events)
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive'); /////

$event = $_GET["event"];
switch ($event) {
    case 'ordUpdated':
        $i=0;
        while ($i<3) {
            $i=$i+1;
            echo "event: ordUpdated" . PHP_EOL;
            echo "data: data $i\n\n";
//echo PHP_EOL;
            ob_end_flush();
            flush();
            sleep(1);

//            echo "data: msg\n\n";
//echo PHP_EOL;
//            echo ": heartbeat\n\n";
//            ob_end_flush();
//            flush();
        }
        break;
    case 'ordCreated':
        echo getOrders($_POST["json"], "C");
        break;
    default:
        break;
}