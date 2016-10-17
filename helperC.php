<?php

$post_action = filter_input(INPUT_POST, 'action');
$get_action = filter_input(INPUT_GET, 'action');

$action=null;

//страничку можно вызвать либо с параметрами ГЕТ либо ПОСТ. Одновременно нельзя 'by design'


//проверим есть ли ПОСТ параметры
if ($post_action!=NULL) {
    $action = $post_action;
}

//проверим есть ли ГЕТ параметры
if ($get_action!=NULL) {
    $action = $get_action;
}

switch ($action) {
    case NULL: //если форма без параметров вызвана и action остался null
        echo 'Э, а где параметры?';
        break;
    case 'getText':
        echo 'Это не закодированный в JSON текст';
        break;
    case 'getOneObject':
        echo funcGetObject();
        break;
    case 'getObjectWithOneObjElement':
        echo funcGetObject2();
        break;
    case 'getArrayOfObjects':
        echo funcGetArrayOfObjects();
        break;
    default: //не описанные параметры
        echo 'э бля, чето я не знаю такого параметра';
        break;
}

//возвращает JSON строку в виде объекта {..,..,..}
function funcGetObject() {
    $arr = [
        "Name" => "Вася",
        "CoordY" => 2593,
        "CoordX" => 1777,
        "Comment" => "Быстрый курьер. Знает город воще пепец как",
    ];
    return json_encode($arr, JSON_UNESCAPED_UNICODE);
}

//возвращает JSON строку в виде объекта, один из элементов представляект собой массив {..,[..]..,..}
function funcGetObject2() {
    $arrCoords1 = ["x" => 123, "y" => 674];
    $arr = [
        "Name" => "Вася",
        "Coords" => $arrCoords1,
        "Comment" => "Быстрый курьер. Знает город воще пепец как",
    ];
    return json_encode($arr, JSON_UNESCAPED_UNICODE);
}

//возвращает JSON строку в виде массива из объектов [{..,[..]..,..}, {..,[..]..,..}, {..,[..]..,..}]
function funcGetArrayOfObjects() {
    $arrCoords1 = ["x" => 123, "y" => 674];
    $arr1 = [
        "Name" => "Вася",
        "Coords" => $arrCoords1,
        "Comment" => "Быстрый курьер. Знает город воще пепец как",
    ];


    $arrCoords2 = ["x" => 333, "y" => 467];
    $arr2 = [
        "Name" => "Петя",
        "Coords" => $arrCoords2,
        "Comment" => "Тормозной курьер из Мухосранска",
    ];



    $arr = [$arr1, $arr2];

    return json_encode($arr, JSON_UNESCAPED_UNICODE);
}
