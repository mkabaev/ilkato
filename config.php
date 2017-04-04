<?php
define('DB_HOSTNAME', 'localhost');
define('DB_USERNAME', 'DBUSER');
define('DB_PASSWORD', 'DBPASS');
define('DB_DATABASE', 'DBNAME');
define('DB_PORT', 3306);

//
//define('STATUS_ID_RECEIVED', 1); //Оформлен ОНЛАЙН
//define('STATUS_ID_ORDER', 2); //Принят

// оператор выставляет
define('STATUS_ID_TODO', 3); //готовить 27
// повар выставляет
define('STATUS_ID_DONE', 4); //приготовлен 28
define('STATUS_ID_DELIVERY', 5); //доставка 29
