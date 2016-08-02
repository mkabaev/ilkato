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




<!--        <script>
            var state = {'page_id': 1, 'user_id': 5};
            var title = 'Hello World';
            var url = 'hello-world.html';
            history.pushState(state, title, url);
        </script>-->

        <div id="result"></div>
    </body>
</html>
