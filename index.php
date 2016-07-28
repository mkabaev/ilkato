<!doctype html>
<html lang="ru">
    <head>
        <meta charset="utf-8">
        <title>ILKATO</title>
        <link rel="stylesheet" href="js-ext/jquery/jquery-ui.css">
        <link rel="stylesheet" href="css/styles.css">
        <script src="js-ext/jquery/jquery.js"></script>
        <script src="js-ext/jquery/jquery-ui.js"></script>
        <script src="external/jquery.ui.touch-punch.min.js"></script>
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
        
        
        
//        $array = array(
//            1 => "a",
//            1/3=> "b",
//        );
//        var_dump($array);
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
    </body>
</html>