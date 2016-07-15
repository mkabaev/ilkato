<!doctype html>
<html lang="ru">
    <head>
        <meta charset="utf-8">
        <title>Кухня</title>
        <link rel="stylesheet" href="js-ext/jquery/jquery-ui.css">
        <link rel="stylesheet" href="css/styles.css">
        <script src="js-ext/jquery/jquery.js"></script>
        <script src="js-ext/jquery/jquery-ui.js"></script>
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
        <div class="left">
            <h1 class="ui-widget-header" >ЗАКАЗ</h1>
            <div id="Panel5" row="5" class="ordrow ui-state-active">
            </div>
        </div>
        <div class="right">
        </div>

        <script src="js/sound.js"></script>
        <script src="js/main.js"></script>
        <script src="js/edit.js"></script>
        <script src="js/KHelper.js"></script>
    </body>
</html>