<!doctype html>
<html lang="ru">
    <head>
        <meta charset="utf-8">
        <title>Кухня</title>
        <!--        <link rel="stylesheet" href="external/jquery/jquery-ui.css">-->
        <link rel="stylesheet" href="js-ext/jquery-ui-1.12.0.custom/jquery-ui.css">
        <link rel="stylesheet" href="css/styles.css">
        <link rel="stylesheet" href="css/kitchen.css">

        <script src="js-ext/jquery-ui-1.12.0.custom/external/jquery/jquery.js"></script>
        <script src="js-ext/jquery-ui-1.12.0.custom/jquery-ui.js"></script>
        <script src="js-ext/jquery.ui.touch-punch.min.js"></script>

        <script src="js-ext/sound.js"></script>
        <script src="js-ext/easy-pie-chart.js"></script>

        <script src="js/main.js"></script>
        <script src="js/services.js"></script>
        <script src="js/KHelper.js"></script>
        <script src="js/timer.js"></script>

    </head>
    <body>
        <!--        <h1 class="ui-widget-header" >Готовятся...</h1>-->
        <div id="settings"><span class="ui-icon ui-icon-gear"></span>Настройки</div>
        <div id="userinfo"></div>
        <script>
//            $(document).ajaxComplete(function () {
//                alert("ajaxComplete");
//            });

            $("#userinfo").on("click", function ()
            {
                showSelectDialog('SelUsers', 'Авторизация', afterSel);
                //CreateDialogWithItems('Авторизация', null).dialog('open');
            });
            //localStorage.removeItem('user_id');
            var sound = ss_soundbits('s1.mp3');
            //localStorage.removeItem('user_id');

            //проверяем есть ли юзер. 
            //если есть, то загружаем локальные данные
            //если нет, то авторизуемся
            doInit();

        </script>

        <style>
            #sortable1, #sortable2, #sortable3{
                border: 1px solid #eee;
                width: 142px;
                min-height: 20px;
                list-style-type: none;
                margin: 0;
                padding: 5px 0 0 0;
                float: left;
                margin-right: 10px;
            }
            #sortable1 li, #sortable2 li, #sortable3 li {
                margin: 0 5px 5px 5px;
                padding: 5px;
                font-size: 1.2em;
                width: 120px;
            }
        </style>
        <script>
            $(function () {
                $("#sortable1, #sortable2, #sortable3").sortable({
                    connectWith: ".connectedSortable"
                }).disableSelection();
            });
        </script>

        <ul id="sortable1" class="connectedSortable">
            <li class="ui-state-default">11</li>
            <li class="ui-state-default">12</li>
            <li class="ui-state-default">13</li>
            <li class="ui-state-default">14</li>
            <li class="ui-state-default">15</li>
            <li class="ui-state-default">16</li>
            <li class="ui-state-default">17</li>
        </ul>

        <ul id="sortable2" class="connectedSortable">
            <li class="ui-state-highlight">Item 1</li>
            <li class="ui-state-highlight">Item 2</li>
            <li class="ui-state-highlight">Item 3</li>
            <li class="ui-state-highlight">Item 4</li>
            <li class="ui-state-highlight">Item 5</li>
        </ul>

        <ul id="sortable3" class="connectedSortable">
            <li class="ui-state-highlight">Item 1</li>
            <li class="ui-state-highlight">Item 2</li>
            <li class="ui-state-highlight">Item 3</li>
            <li class="ui-state-highlight">Item 4</li>
            <li class="ui-state-highlight">Item 5</li>
        </ul>
        <!--        <script>
                    var state = {'page_id': 1, 'user_id': 5};
                    var title = 'Hello World';
                    var url = 'hello-world.html';
                    history.pushState(state, title, url);
                </script>-->

        <div id="result"></div>
    </body>
</html>
