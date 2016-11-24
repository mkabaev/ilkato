<?php

//мониторит изменения в базе и шлет их в браузер (Server Sent Events)
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');
$id_session = filter_input(INPUT_GET, 'id_session'); // isset($_GET['uid']) ? (int) $_GET['uid'] : null;
// установить в базе статус онлайн для этого юзера
require_once 'functions.php';
//updateUserStatus($uid, true);
//$i = 0;

while (true) { //$i < 3
    $updates = getSessionUpdates($id_session);

    foreach ($updates as $update) {
        echo "event: " . $update['event'] . PHP_EOL;
        // TODO: send changed orders only
        //$json = $update['data'];
        //if (count($updates) > 0) {
        $data = $update['data'];
        if ($data == NULL) {
            echo "data: " . 'null' . "\n\n";
            //echo "data: " . "[" . 'null' . "]" . "\n\n";
        } else {
            echo "data: " . $data . "\n\n";
            //echo "data: " . "[" . $data . "]" . "\n\n";
        }
        //}
        //echo "data: msg\n\n";
//echo PHP_EOL;
        ob_end_flush();
        flush();
    }
    sleep(2);

    //$i = $i + 1;
//            echo "data: msg\n\n";
//echo PHP_EOL;
//            echo ": heartbeat\n\n";
//            ob_end_flush();
//            flush();
}
        
        
        
//$event='ordUpdate';        
//switch ($event) {
//    case 'ordUpdate':
//        $i = 0;
//        while ($i < 3) {
//            $i = $i + 1;
//            echo "event: ordUpdate" . PHP_EOL;
//            echo "data: data $i\n\n";
////echo PHP_EOL;
//            ob_end_flush();
//            flush();
//            sleep(1);
//
//
////            echo "data: msg\n\n";
////echo PHP_EOL;
////            echo ": heartbeat\n\n";
////            ob_end_flush();
////            flush();
//        }
//        break;
//    case 'ordCreate':
//        echo getOrders($_POST["json"], "C");
//        break;
//    default:
//        break;
//}