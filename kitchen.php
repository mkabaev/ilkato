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
        <script src="external/easy-pie-chart.js"></script>
    </head>
    <body>
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
                    <li class="ui-widget-content ui-selected">23</li>
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

            <div id="orderinfo" class="ui-widget ui-accordion-content">
                <div id="header">
                    <div id="number"><h1>Заказ 23</h1></div>

                    <div id="timer" class="chart">
                        <span class="digit"></span>
                    </div>

                </div>

                <table id="products" border="1" width="100%">
<!--                <caption>Продукты</caption>-->
                    <thead><tr><th>Продукт</th><th>Кол-во</th></tr></thead>
                    <tbody>
                        <tr><td>Ролл Калифорния</td><td>1</td></tr>
                        <tr><td>Ролл Филаделфия</td><td>2</td></tr>
                        <tr><td>Ролл сет Обжорка</td><td>1</td></tr>
                        <tr><td>Палочки</td><td>5</td></tr>
                        <tr><td>Васаби</td><td>1л</td></tr>
                        <tr><td>Имбирь</td><td>1</td></tr>
                    </tbody>
                </table>
                <div id="comment">Приготовить как для себя</div>
                <div id="footer">
                    <button id="bJapanDone">Готово - Япония</button>
                    <button id="bItalyDone">Готово - Италия</button>
                    <button id="bPrint">Печать</button>
                </div>
            </div>
        </div>


<!--        <script src="js/sound.js"></script>-->
        <script src="js/main.js"></script>
        <script src="js/edit.js"></script>
        <script src="js/KHelper.js"></script>
        <script src="js/timer.js"></script>
    </body>
</html>
