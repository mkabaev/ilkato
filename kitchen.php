<!doctype html>
<html lang="ru">
    <head>
        <meta charset="utf-8">
        <title>Кухня</title>
        <link rel="stylesheet" href="external/jquery/jquery-ui.css">
        <link rel="stylesheet" href="css/styles.css">
        <link rel="stylesheet" href="css/kitchen.css">
        <script src="external/jquery/jquery.js"></script>
        <script src="external/jquery/jquery-ui.js"></script>
        <script src="external/jquery.ui.touch-punch.min.js"></script>
    </head>
    <body>
        <div id='log'></div>
        <div id="dlgEdit" title="Редактирование заказа">
            <input id="inpScanner" type="text" value="" />
            <table id="tProducts" border="1" width="100%">
<!--                <caption>Продукты</caption>-->
                <thead><tr><th>Продукт</th><th>Кол-во</th><th>Цена</th></tr></thead>
                <tbody></tbody>
                <tfoot><tr><th>Всего</th><th id="totalWeight"></th><th id="totalPrice"></th></tr></tfoot>
            </table>

        </div>

        <!--        <h1 class="ui-widget-header" >Готовятся...</h1>-->

        <div id="leftpanel">
            <div>
                <ol id="menu">
                    <li class="ui-widget-content">23</li>
                    <li class="ui-widget-content">19</li>
                    <li class="ui-widget-content">33</li>
                    <li class="ui-widget-content">34</li>
                    <li class="ui-widget-content">35</li>
                    <li class="ui-widget-content">16</li>
                    <li class="ui-widget-content">22</li>
                </ol>
            </div>
        </div>
        <div id="rightpanel">
            <div id="orderinfo">
                <div id="header">
                    <div id="timer">120с</div>
                    <div id="number"><h1>Заказ 19</h1></div>
                </div>
                <ol id="products" style="border:2px solid">
                    <li>Ролл Калифорния</li>
                    <li>Ролл Филаделфия</li>
                    <li>Пицца 1</li>
                    <li>Пицца 2</li>
                    <li>Васаби 1л</li>
                    <li>Палочки 1 комплект</li>
                    <li>Соус 1л</li>
                </ol>
            </div>
        </div>


<!--        <script src="js/sound.js"></script>-->
        <script src="js/main.js"></script>
        <script src="js/edit.js"></script>
        <script src="js/KHelper.js"></script>
    </body>
</html>