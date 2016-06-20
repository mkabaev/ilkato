<!doctype html>
<html lang="ru">
    <head>
        <meta charset="utf-8">
        <title>Курьер</title>
        <link rel="stylesheet" href="external/jquery/jquery-ui.css">
        <link rel="stylesheet" href="css/styles.css">
        <script src="external/jquery/jquery.js"></script>
        <script src="external/jquery/jquery-ui.js"></script>
        <script src="external/jquery.ui.touch-punch.min.js"></script>
    </head>
    <body>
        <div id='log'></div>
        <div id="dialog" title="Назначить курьера">
            <ul id="ul_couriers">
                <!--                <li class="ui-widget-header">Category 1</li>-->
                <li id="1">Пупкин Виталий</li>
                <li id="2">Сидоров Павел</li>
                <li id="3">Иванов Иван</li>
                <!--<li class="ui-widget-header">Category 2</li>-->    
                <li id="4">Петров Петр</li>
                <li id="5">Скорый</li>
            </ul>
        </div>

        <!--        <h1 class="ui-widget-header" >Готовятся...</h1>-->
        <div class="left">
            <div id="Panel1" row="1" class="ordrow ui-state-active">
                <button class="setCourierButton">К<br/>У<br/>Р<br/>Ь<br/>Е<br/>Р</button>
            </div>
            <div id="Panel2" row="2" class="ordrow ui-state-active">
                <button class="setCourierButton">К<br/>У<br/>Р<br/>Ь<br/>Е<br/>Р</button>
            </div>
            <div id="Panel3" row="3" class="ordrow ui-state-active">
                <button class="setCourierButton">К<br/>У<br/>Р<br/>Ь<br/>Е<br/>Р</button>
            </div>
            <div id="Panel4" row="4" class="ordrow ui-state-active">
                <button class="setCourierButton">К<br/>У<br/>Р<br/>Ь<br/>Е<br/>Р</button>
            </div>
                        <h1 class="ui-widget-header" >Отправлены</h1>
            <div id="Panel5" row="5" class="ordrow ui-state-disabled">
            </div>

        </div>
        <div class="right">
        </div>
        <script src="js/sound.js"></script>
        <script src="js/main.js"></script>
        <script src="js/edit.js"></script>
        <script src="js/CHelper.js"></script>
        <script>
            $(function () {
                $("body").disableSelection();
                $(".setCourierButton").button().css('border-radius', '0px 12px 12px 0px');
//                $(".setCourierButton").click(function () {
//                    $("#divcurier").animate({width: '300px'}, 500);
//                });
//                $("#menu_drivers").selectmenu();
                $("#dialog").dialog({
                    width: "900px",
                    autoOpen: false,
                    modal: true,
                    resizable: false,
                    show: {
                        effect: "blind",
                        duration: 300
                    },
                    hide: {
                        effect: "explode",
                        duration: 300
                    },
                    open: function () {
                        $('.ui-widget-overlay').bind('click', function () {
                            $('#dialog').dialog('close');
                        })
                    },
                    dialogClass: "noclose"
                });
                $(".setCourierButton").click(function () {
                    //alert($(this).attr("id"));
                    //alert($(this).parent().attr("id"));
                    $("#dialog").attr("row", $(this).parent().attr("row"));
                    $("#dialog").dialog("open");
                });
            });
        </script>
    </body>
</html>