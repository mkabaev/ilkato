<!doctype html>
<html lang="ru">
    <head>
        <meta charset="utf-8">
        <title>Кухня</title>
        <!--        <link rel="stylesheet" href="external/jquery/jquery-ui.css">-->
        <link rel="stylesheet" href="jquery-ui-1.12.0/jquery-ui.css">
        <link rel="stylesheet" href="css/styles.css">
        <link rel="stylesheet" href="css/kitchen.css">

<!--        <script src="external/jquery/jquery.js"></script>
<script src="external/jquery/jquery-ui.js"></script>-->


        <script src="jquery-ui-1.12.0/external/jquery/jquery.js"></script>
        <script src="jquery-ui-1.12.0/jquery-ui.js"></script>
        <script src="js-ext/jquery.ui.touch-punch.min.js"></script>



        <script src="js-ext/easy-pie-chart.js"></script>
        <script src="js-ext/jquery.printPage.js"></script>

        <script src="js/main.js"></script>
        <script src="js/services.js"></script>
        <script src="js/KHelper.js"></script>
        <script src="js/timer.js"></script>

    </head>
    <body>
        <!--        <h1 class="ui-widget-header" >Готовятся...</h1>-->
        <div id="userinfo"></div>

        <script>
            $('body').append(CreateLeftPanel());
            $('body').append(CreateOrderViewer());
        </script>

        <div id="footer">
            <button id="bJapanDone">Готово - Япония</button>
            <button id="bItalyDone">Готово - Италия</button>
            <button id="bPrint">Печать</button>
            <script>
                $("#bPrint").printPage({
                    url: "check.html",
                    attr: "href",
                    message: "Печатаю..."
                })
            </script>
        </div>



<!--        <script src="js/sound.js"></script>-->

<!--        <script>
            window.addEventListener('popstate', function (e) {
                // код обработчика события
                alert(e.toString());
            });

            var state = {'page_id': 1, 'user_id': 5};
            var title = 'Hello World';
            var url = 'hello-world.html';
            history.pushState(state, title, url);
        </script>-->
        <script>
//                    $(window).bind('storage', function (e) {
//                        console.log(e.originalEvent.key, e.originalEvent.newValue);
//                        alert('fired');
//                    });



            if (typeof (EventSource) !== "undefined") {
                var source = new EventSource("events.php?event=ordUpdated");

//                source.onmessage = function (event) {
//                    document.getElementById("result").innerHTML += event.data + "<br>";
//                };
//
//                source.myevent = function (event) {
//                    document.getElementById("result").innerHTML += event.data + "<br>";
//                };
//                source.addEventListener('message', function (e) {
//                    document.getElementById("result").innerHTML += e.data + "<br>";
//                }, false);

                source.addEventListener('message', function (e) {
                    document.getElementById("result").innerHTML += "msg:" + e.data + "<br>";
                }, false);

                source.addEventListener('onopen', function (e) {
                    document.getElementById("result").innerHTML += "open:" + e.data + "<br>";
                }, false);

                source.addEventListener('onerror', function (e) {
                    document.getElementById("result").innerHTML += "ERR:" + e.data + "<br>";
                }, false);
                source.addEventListener('ordUpdated', function (e) {
                    localStorage.user = 'Повар 1' + e.data;
                    $("#userinfo").text(localStorage.user);

                }, false);

            } else {
                document.getElementById("result").innerHTML = "Sorry, your browser does not support server-sent events...";
            }
        </script>
        <div id="result"></div>
    </body>
</html>
