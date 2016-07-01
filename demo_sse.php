<?php
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive'); /////

while (1) {
$time = date('r');
echo "event: myevent" . PHP_EOL;
echo "data: The server time is: {$time}\n\n";
//echo PHP_EOL;
  ob_end_flush();
  flush();
  sleep(1);
  
echo "data: msg\n\n";
//echo PHP_EOL;
echo ": heartbeat\n\n";
  ob_end_flush();
  flush();
}
