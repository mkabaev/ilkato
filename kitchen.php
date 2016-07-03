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
                    <!--                    <div id="timer">120с</div>-->
<!--                    <div id="timer" class="chart" data-percent="100" data-scale-color="#ffb400"></div>-->
<div id="timer" class="chart" data-percent="73"><span>73</span>z</div>
                    <script>
                        $(function () {
                            //create instance
                            $('.chart').easyPieChart({
                                animate: 500,
                                scaleColor: 'red',
                                lineWidth: 12,
                                lineCap: 'butt', //butt round square
                                size: 160,
                                trackColor: 'orange',
                                barColor: 'red'
                            });
                            //update instance after 5 sec
                            var sec=60;
                            setInterval(function () {
                                sec=sec-1;
                                $('.chart').data('easyPieChart').update(sec);
                                $('span', $('.chart')).text(sec);
                            }, 1000);
                        });

                    </script>
                    <div id="number"><h1>Заказ 19</h1></div>
                </div>
                <ol id="products" style="border:2px solid">
                    <li>Ролл Калифорния - среднее время приготовлегия 3 мин</li>
                    <li>Ролл Филаделфия - среднее время приготовлегия 3 мин</li>
                    <li>Пицца 1 - среднее время приготовлегия 5 мин</li>
                    <li>Пицца 2 - среднее время приготовлегия 7 мин</li>
                    <li>Васаби 1л - среднее время приготовлегия 20сек</li>
                    <li>Палочки 1 комплект - среднее время приготовлегия 20сек</li>
                    <li>Соус 1л - среднее время приготовлегия 20сек</li>
                </ol>
            </div>
        </div>


<!--        <script src="js/sound.js"></script>-->
        <script src="js/main.js"></script>
        <script src="js/edit.js"></script>
        <script src="js/KHelper.js"></script>
    </body>
</html>
