<?php
define('DB_HOSTNAME', '127.0.0.1'); //LOCALHOST на 39 компе доступ запрещен к mysql       192.168.0.39 213.178.54.5
define('DB_USERNAME', 'sxl');
define('DB_PASSWORD', 'cargvidon17');
define('DB_DATABASE', 'delivery');
define('DB_PORT', 3306);

//
//define('STATUS_ID_RECEIVED', 1); //Оформлен ОНЛАЙН
//define('STATUS_ID_ORDER', 2); //Принят

// оператор выставляет
define('STATUS_ID_TODO', 3); //готовить
//
// повар выставляет
define('STATUS_ID_DELIVERY', 5); //Доставка
define('STATUS_ID_DONE', 4); //приготовлен