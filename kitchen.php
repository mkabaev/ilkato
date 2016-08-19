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
        <div id="topmenu" class="ui-widget ui-state-focus" style="height:24px;">
            <div id="settings"><span class="ui-icon ui-icon-gear"></span>Настройки</div>
            <div id="userinfo" onclick="showSelectUserDialog()">пользователь</div>
        </div>

        <!--<audio src="http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg" autoplay>
          Your browser does not support the <code>audio</code> element.
        </audio>-->
        <div id="workplace">
        </div>
        <script>
            var sound = ss_soundbits('s1.mp3');
            //localStorage.removeItem('user_id');

            //проверяем есть ли юзер. 
            //если есть, то загружаем локальные данные
            //если нет, то авторизуемся
            doInit();
        </script>
        <!--
                <ul id="o_sortable3" class="connectedSortable">
                    <li class="ui-state-highlight">Item 1</li>
                    <li class="ui-state-highlight">Item 2</li>
                    <li class="ui-state-highlight">Item 3</li>
                    <li class="ui-state-highlight">Item 4</li>
                    <li class="ui-state-highlight">Item 5</li>
                </ul>-->
                <!--        <script>
                            var state = {'page_id': 1, 'user_id': 5};
                            var title = 'Hello World';
                            var url = 'hello-world.html';
                            history.pushState(state, title, url);
                        </script>-->

        <div id="result"></div>
    </body>
</html>
