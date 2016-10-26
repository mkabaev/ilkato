<!doctype html>
<html lang="ru">
    <head>
        <meta charset="utf-8">
        <title>Кухня</title>
        <!--        <link rel="stylesheet" href="external/jquery/jquery-ui.css">-->
        <link rel="stylesheet" href="js-ext/jquery-ui-1.12.0.custom/jquery-ui.css">
        <link rel="stylesheet" href="css/styles.css">
        <link rel="stylesheet" href="css/operator.css">
        <link rel="stylesheet" href="css/kitchen.css">

        <script src="js-ext/jquery-ui-1.12.0.custom/external/jquery/jquery.js"></script>
        <script src="js-ext/jquery-ui-1.12.0.custom/jquery-ui.js"></script>
        <script src="js-ext/jquery.ui.touch-punch.min.js"></script>

        <script src="js-ext/sound.js"></script>
        <script src="js-ext/easy-pie-chart.js"></script>

        <script src="js/main.js"></script>
        <script src="js/services.js"></script>
        <script src="js/KHelper.js"></script>
        <script src="js/OHelper.js"></script>
        <script src="js/timer.js"></script>
    </head>
    <body>
        <div id="topmenu" class="ui-widget ui-state-focus" style="height:24px;">
            <div id="topwidget"></div>
            <div id="userinfo" onclick="showSelectUserDialog()">пользователь</div>
            <div id="settings" title="Please provide your firstname." ><span class="ui-icon ui-icon-gear"></span>Настройки</div>
        </div>
        <div id="progressbar"></div>

        <!--<audio src="http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg" autoplay>
          Your browser does not support the <code>audio</code> element.
        </audio>-->
        <div id="workplace"/>
        <script>

            $("#progressbar").progressbar({value: false});
            //get uid's,wpid's, [orders?]
            //sent uid (via SSE(uid)

            //в таблицу с юзерами добавить колонку статус (logged in/out)
            //в таблицу евентов вносим все изменения по базе для онлайн юзеров

            //uid   |   event       |   data
            //123   |   ordUpdate   |   {...}
            //123   |   ordUpdate   |   {...}
            function createWorkplace(type) {
                stopTimer();
                $('#workplace').empty();
                $('#topwidget').empty();
                $("body").disableSelection();
                //console.log(document.attributes);
                switch (type) {
                    case '2':
                        createOperatorInterface();
                        break;
                    case '3':
                        createKitchenInterface();
                        break;
                    default:
                        alert('select interface type');
                        break;
                }
            }

            var sound = ss_soundbits('s1.mp3');
            //localStorage.removeItem('user_id');
            $(document).ajaxComplete(function () {
                $('#settings').fadeOut().fadeIn();
            });

//
//            $('#settings').click(function () {
//                //console.log(eventSource);
//                //eventSource.close();
//                eventSource.removeEventListener('ordUpdate', afterOrdUpdate, false);
//            });
            //проверяем есть ли юзер. 
            //если есть, то загружаем локальные данные
            //если нет, то авторизуемся
            //addEventListeners(); // with session id
            //var date = (new Date()).toISOString().substring(0, 10);
            doInit(function () {
                $("#progressbar").progressbar("destroy");

            });
            //    if (eventSource!==undefined) {
//        eventSource.close();
//        alert('es closed');
//    }

            //wp.
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
