<!doctype html>
<html lang="ru">
    <head>
        <meta charset="utf-8">
        <title>Кухня</title>
        <!--        <link rel="stylesheet" href="external/jquery/jquery-ui.css">-->
        <!--        <link rel="stylesheet" href="js-ext/jquery-ui-1.12.0.custom/jquery-ui.css">-->
        <link rel="stylesheet" href="js-ext/jquery-ui-1.12.1.custom/jquery-ui.css">
        <link rel="stylesheet" href="css/styles.css">
        <link rel="stylesheet" href="css/operator.css">
        <link rel="stylesheet" href="css/kitchen.css">

        <!--<script src="js-ext/jquery-ui-1.12.1.custom/external/jquery/jquery.js"></script>-->
        <script src="js-ext/jquery-3.2.1.min.js"></script>
        <script src="js-ext/jquery-ui-1.12.1.custom/jquery-ui.js"></script>
<!--        <script src="js-ext/jquery-ui-1.12.0.custom/external/jquery/jquery.js"></script>
        <script src="js-ext/jquery-ui-1.12.0.custom/jquery-ui.js"></script>-->
        <script src="js-ext/jquery.ui.touch-punch.min.js"></script>
        <script src="js-ext/jquery.scannerdetection.js"></script>
        <script src="js-ext/easy-pie-chart.js"></script>

        <!--Yandex maps-->
        <!--<script src="http://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>

        <!--Google maps-->
        <!--<script async defer
                src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCkIHkx8lFZFjbmqTfFqFANF6OFeRCWSnc&callback=initMap">
        </script>-->
        <!--<script async defer
                src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCkIHkx8lFZFjbmqTfFqFANF6OFeRCWSnc">
        </script>-->

        <!--OpenStreetMap-->
        <!--<script src="https://openlayers.org/en/v4.1.0/build/ol.js"></script>-->
        <!--<script src="http://www.openlayers.org/api/OpenLayers.js"></script>-->
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.0.3/dist/leaflet.css"
              integrity="sha512-07I2e+7D8p6he1SIM+1twR5TIrhUQn9+I6yjqD53JQjFiMf8EtC93ty0/5vJTZGF8aAocvHYNEDJajGdNx1IsQ=="
              crossorigin=""/>
        <script src="https://unpkg.com/leaflet@1.0.3/dist/leaflet.js"
                integrity="sha512-A7vV8IFfih/D732iSSKi20u/ooOfj/AGehOKq0f4vLT1Zr2Y+RX7C+w8A1gaSasGtRUZpF/NZgzSAu4/Gc41Lg=="
        crossorigin=""></script>
        <!--SUGGESTIONS-->
        <link href="https://cdn.jsdelivr.net/jquery.suggestions/16.10/css/suggestions.css" type="text/css" rel="stylesheet" />
        <script type="text/javascript" src="https://cdn.jsdelivr.net/jquery.suggestions/16.10/js/jquery.suggestions.min.js"></script>

        <!--jsGrid plugin-->
        <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid.min.css" />
        <link type="text/css" rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid-theme.min.css" />
        <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jsgrid/1.5.3/jsgrid.min.js"></script>

        <!--Person data plugin-->
        <link rel="stylesheet" href="js/jquery.ctrl.persondata.css">
        <script src="js/jquery.ctrl.persondata.js"></script>

        <script src="js/main.js"></script>
        <script src="js/services.js"></script>
        <script src="js/AdmHelper.js"></script>
        <script src="js/KHelper.js"></script>
        <script src="js/OHelper.js"></script>
        <script src="js/orderEditor.js"></script>
        <script src="js/timer.js"></script>
    </head>
    <body>
        <div id="topmenu" class="ui-widget ui-state-focus" style="height:42px;">
            <div id="userinfo" onclick="showSelectUserDialog()">пользователь</div>
            <div id="settings" title="Please provide your firstname." ><span class="ui-icon ui-icon-gear"></span>Настройки</div>
        </div>
        <div id="progressbar"></div>

        <!--<audio src="http://developer.mozilla.org/@api/deki/files/2926/=AudioTest_(1).ogg" autoplay>
          Your browser does not support the <code>audio</code> element.
        </audio>-->
        <div id="workplace"></div>
        <script>

            //get uid's,wpid's, [orders?]
            //sent uid (via SSE(uid)

            //в таблицу с юзерами добавить колонку статус (logged in/out)
            //в таблицу евентов вносим все изменения по базе для онлайн юзеров

            //uid   |   event       |   data
            //123   |   ordUpdate   |   {...}
            //123   |   ordUpdate   |   {...}
            function createWorkplace(type) {
                stopTimer();
//                $("#topmenu").append('<div class="ui-widget"><label for="phone">Телефон:</label><input type="text" name="phone" id="phone"></div>');
//                $("#phone").autocomplete({
//                    source: clientsCache
//                });
                $('#workplace').empty();
                $('#topwidget').remove();
                $('#workplace').removeClass('wp-2');
                $('#workplace').removeClass('wp-3');
                $("body").disableSelection();
                //console.log(document.attributes);
                $('#workplace').addClass('wp-' + type);
                switch (type) {
                    case '1':
                        createAdmInterface();
                        break;
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

            var audio = new Audio('s1.mp3');
            //localStorage.removeItem('user_id');
            $(document).ajaxComplete(function () {
                $('#settings').fadeOut().fadeIn();
            });

//
            $('#settings').click(function () {
                audio.play();
////                //console.log(eventSource);
//                //eventSource.close();
//                eventSource.removeEventListener('ordUpdate', afterOrdUpdate, false);
            });
            //проверяем есть ли юзер. 
            //если есть, то загружаем локальные данные
            //если нет, то авторизуемся
            //addEventListeners(); // with session id
            //var date = (new Date()).toISOString().substring(0, 10);
            $("#progressbar").progressbar({value: false});
            doInit(function () {
                $("#progressbar").progressbar("destroy");
            });
            //    if (eventSource!==undefined) {
//        eventSource.close();
//        alert('es closed');
//    }

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
