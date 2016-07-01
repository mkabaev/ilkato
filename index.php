<!doctype html>
<html lang="ru">
    <head>
        <meta charset="utf-8">
        <title>ILKATO</title>
        <link rel="stylesheet" href="external/jquery/jquery-ui.css">
        <link rel="stylesheet" href="css/styles.css">
        <script src="external/jquery/jquery.js"></script>
        <script src="external/jquery/jquery-ui.js"></script>
        <script src="external/jquery.ui.touch-punch.min.js"></script>

        <script>
            if (typeof (EventSource) !== "undefined") {
                var source = new EventSource("demo_sse.php");

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

                //source.addEventListener('message', function (e) {
                //    document.getElementById("result").innerHTML += "msg:" + e.data + "<br>";
                //}, false);

                source.addEventListener('onopen', function (e) {
                    document.getElementById("result").innerHTML += "open:" + e.data + "<br>";
                }, false);

                source.addEventListener('onerror', function (e) {
                    document.getElementById("result").innerHTML += "ERR:" + e.data + "<br>";
                }, false);
                source.addEventListener('myevent', function (e) {
                    document.getElementById("result").innerHTML += "myevent:" + e.data + "<br>";
                }, false);

            } else {
                document.getElementById("result").innerHTML = "Sorry, your browser does not support server-sent events...";
            }
        </script>

    </head>
    <body>
        <?php
//        if (isset($_GET["workplace"])) {
//            $wp = $_GET["workplace"];
//        }
//        switch ($wp) {
//            case 'operator':
//                break;
//
//            default:
//                //require_once 'newhtml.html';
//                break;
//        }
        ?>
        <style type="text/css">
            div {
                position: fixed;
                left:40%;
                text-align: center;
            }
        </style>
        <div>
            <h1><a href="operator.php">ОПЕРАТОР</a></h1>
            <h1><a href="kitchen.php">КУХНЯ</a></h1>
            <h1><a href="courier.php">КУРЬЕР</a></h1>
        </div>
        <script>
            $(function () {
                //$(".dlgEdit").disableSelection();
                $("body").disableSelection();
                $("a").button();
                //db = openDatabase("ToDo", "0.1", "A list of to do items.", 200000);
                //if(!db){alert("Failed to connect to database.");}
            });
        </script>

        <div id="result"></div>
    </body>
</html>