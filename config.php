<?php
define('DB_HOSTNAME', '192.168.0.10'); //LOCALHOST на 39 компе доступ запрещен к mysql       192.168.0.39 213.178.54.5
define('DB_USERNAME', 'ilkato');
define('DB_PASSWORD', 'Skorpions');
define('DB_DATABASE', 'ilkato');
define('DB_PORT', 3306);

//
//define('STATUS_ID_RECEIVED', 1); //Оформлен ОНЛАЙН
//define('STATUS_ID_ORDER', 2); //Принят

// оператор выставляет
define('STATUS_ID_TODO', 3); //готовить 27
// повар выставляет
define('STATUS_ID_DONE', 4); //приготовлен 28
define('STATUS_ID_DELIVERY', 5); //доставка 29
