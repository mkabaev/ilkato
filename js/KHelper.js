/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global al, CreateTimer */

function K_RequestServer()
//send orders timestamps to server and recive changes
{

    var ar = [];
    //var y = parseInt(panel.attr("row"));
    $(".order").each(function (index) {
        //$(this).attr("status_id")
        //var x = index;
        ar.push(new Array(parseInt($(this).attr("id")), $(this).attr("ts")));
        //ar.push(order_id);
    });
    var json_orders = JSON.stringify(ar);
    //console.log('send to server: '+json_orders);

    $.ajax({
        type: "POST",
        data: "action=getKOrders&json=" + json_orders,
        url: "helper.php",
        cache: false,
        success: function (jsondata) {
            $(".ordrow").removeClass("ui-state-error");
            ProcessOrders(jsondata);    //append(jsondata); 
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("status: " + xhr.status + " | " + thrownError);
            $(".ordrow").addClass("ui-state-error");
            //$("body").addClass("ui-state-error");
//            alert(xhr.status);
//            alert(thrownError);
        }
    });
}

$(function () {
    $("#rightpanel").sortable({
        connectWith: "#rightpanel",
        axis: "y",
        handle: ".order-header, .order-content",
        cancel: ".order-toggle",
        placeholder: "order-placeholder ui-corner-all",
        //helper: "clone"
        //opacity: 0.8,
        //revert:true
        cursor: "move",
        //disabled: true
        delay: 150,
        revert: 150,
//                    start: function (event, ui) {
//                        var currPos1 = ui.item.index();
//                    },
//                    change: function (event, ui) {
//                        var currPos2 = ui.item.index();
//                        //alert("done");
//                    },

//                    update: function (event, ui) {
//                        //$('#sortable li').removeClass('highlights');
//
//                        if (ui.sender) {
//                        //ui.item.attr("status_id");
//                            $("#log").append("<br/>Done" + ui.sender)
//                        }
//
//                    }

        receive: function (event, ui) {
            //$("#log").append("<br/>Moved from " + ui.sender.attr("id") + " to " + ui.item.parent().attr("id"));
//                        switch (ui.item.parent().attr("id")) {
//                            case "mainPanel":
//                                ui.item.attr("status_id", 2);
//                                UpdateOrderStatusOnServer(ui.item.attr("id"), 2);
//                                break;
//                            case "donePanel":
//                                ui.item.attr("status_id", 5);
//                                UpdateOrderStatusOnServer(ui.item.attr("id"), 5);
//                                break;
//                        }
            //console.log(("order "+ui.item.attr("id")+" to row"+ui.item.parent().attr("row")));
            var newrow = ui.item.parent().attr("row");
            var newstatus;
            if (newrow == 5) {
                newstatus = 5;
            } else {
                newstatus = 3;
            }
            SetOrderPositionOnServer(ui.item.attr("id"), 1, ui.item.parent().attr("row"));
            UpdateOrderStatusOnServer(ui.item.attr("id"), newstatus);
            ui.item.fadeOut(200);
            ui.item.fadeIn(600);
        }

    });
});

function CreateLeftPanel() {
    var divPanel = $('<div/>', {
        id: "leftpanel",
        //class: 'order ui-widget ui-widget-content ui-helper-clearfix ui-corner-top',
        //attr: {'status_id': status_id, 'ts': timestamp}
    });

    var olMenu = $('<ol/>', {
        id: "menu",
    });
    olMenu.append('<li class="ui-widget-content ui-selected">23</li>');
    olMenu.append('<li class="ui-widget-content">19</li>');
    olMenu.append('<li class="ui-widget-content">33</li>');
    olMenu.append('<li class="ui-widget-content">34</li>');
    olMenu.append('<li class="ui-widget-content">38</li>');

    divPanel.append(olMenu);
    return divPanel;
}

function CreateOrderViewer(id, _class, No, comment, headerItems, tableItems) {
    var divOrderViewer = $('<div/>', {
        id: id,
        class: _class,
        //attr: {'order_id': '123', 'ts': timestamp}
    });

    var divHeader = $('<div/>', {
        //id: "orderheader",
        //class: 'ui-widget-content',
    });
    var divNumber = $('<div/>', {
        //id: "number",
    }).append("<h1>Заказ " + No + "</h1>");

    divHeader.append(divNumber);
    divHeader.append('<div id="comment">' + comment + '</div>');
    divOrderViewer.append(divHeader);

    //var tableItems2 = $.parseJSON('[{"id":"3","name":"Пицца 1","count":"2"},{"id":"10","name":"Пицца 2","count":"2"},{"id":"11","name":"Пицца 3","count":"2"},{"id":"12","name":"Пицца 4","count":"2"},{"id":"13","name":"Пицца 5","count":"2"},{"id":"17","name":"Пицца 6","count":"2"},{"id":"19","name":"Пицца 7","count":"2"},{"id":"20","name":"Пицца 8","count":"2"}]');

    var divR = $('<div/>', {
        id: 'divR',
        //class: 'ui-widget-content',
    }).append(CreateTable('tableR', 'tProducts', headerItems, tableItems)).appendTo(divOrderViewer);
    var bPrint = $('<button/>', {
        id: "bPrintR",
        //class: 'ui-widget-content',
        text: "Печать",
        click: function (event) {
            CreatePrintArea().appendTo($('body'));
            window.print();
        },
    }).appendTo(divR);

    //divFooter.append(CreateTimer('timer2',null,30));

    bPrint.button({
        icons: {
            primary: "ui-icon-print",
            //secondary: "ui-icon-triangle-1-s"
        },
    });



    var divP = $('<div/>', {
        id: 'divP',
        //class: 'ui-widget-content',
    }).append(CreateTable('tableP', 'tProducts', headerItems, tableItems)).appendTo(divOrderViewer);
    var bPrint = $('<button/>', {
        id: "bPrintP",
        //class: 'ui-widget-content',
        text: "Печать",
        click: function (event) {
            CreatePrintArea().appendTo($('body'));
            window.print();
        },
    }).appendTo(divP);

    //divFooter.append(CreateTimer('timer2',null,30));

    bPrint.button({
        icons: {
            primary: "ui-icon-print",
            //secondary: "ui-icon-triangle-1-s"
        },
    });

    var bDoneR = $('<button/>', {
        id: "bDoneR",
        //class: 'ui-widget-content',
        text: "Готово",
        click: function (event) {
            alert('event.target')
        },
    }).appendTo(divR);
    //divOrderViewer.append('<button id="bDone'+id+'">Готово</button>');

    bDoneR.button({
        icons: {
            primary: "ui-icon-check",
            //secondary: "ui-icon-triangle-1-s"
        },
    });


    var bDoneP = $('<button/>', {
        id: "bDoneP",
        //class: 'ui-widget-content',
        text: "Готово",
        click: function (event) {
            alert('event.target')
        },
    }).appendTo(divP);
    //divOrderViewer.append('<button id="bDone'+id+'">Готово</button>');

    bDoneP.button({
        icons: {
            primary: "ui-icon-check",
            //secondary: "ui-icon-triangle-1-s"
        },
    });

    return divOrderViewer;
}

$(function () {
    //$(".ordrow").disableSelection();
    //$(".order").disableSelection();
    //$(".dialog").disableSelection();
    //$(".dlgEdit").disableSelection();
    $("body").disableSelection();
//                $(".setCourierButton").click(function () {
//                    $("#divcurier").animate({width: '300px'}, 500);
//                });
//                $("#menu_drivers").selectmenu();
    $("#dlgEdit").dialog({
        width: "500px",
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
        buttons: {
//                        "ЗАКРЫТЬ": function () {
////                            var order_id = $("#dlgEdit").attr("order_id");
//                            //var weightP=$("#scanp").attr("weight");
//                            //var weightR=$("#scanr").attr("weight");
//                            //console.log(weightP);
////                            SetOrderProductsOnServer(order_id, weightR, weightP);
//                            weightR = 0;
//                            weightP = 0;
//                            //console.log("response is "+res);
//                            //alert( $(this).children("#scanp").text());
//                            $(this).dialog("close");
//                        }
        },
        open: function () {
            $('.ui-widget-overlay').bind('click', function () {
                weightR = 0;
                weightP = 0;
                $('#dlgEdit').dialog('close');
            })
        },
        dialogClass: "noclose"
    });
//                $(function () {
//                    $("#menu").menu({
//                        items: "> :not(.ui-widget-header)"
//                    });
//                });
    $("#menu").selectable({
        selected: function (event, ui) {}
    });
//                $("#inpScanner").change(function () {
//                    alert("called.");
//                });


    $("#bPrint").button();

    var ScannerTimerId;
    $("#inpScanner").focusin(function () {
        ScannerTimerId = setInterval('ProcessScanner()', 100);
        //console.log("scannerTimer: "+ScannerTimerId);
    });
    $("#inpScanner").focusout(function () {
        clearInterval(ScannerTimerId);
        //console.log("scannerTimer: "+ScannerTimerId);
    });
});

function createInterface() {
    var headerItems = $.parseJSON('["Продукт","Кол-во"]');
    //var tableItems = $.parseJSON(localStorage.products);
    CreateOrderViewer('ordViewer', 'orderViewer', 111, 'Приготовить как для себя', headerItems, null).appendTo($('body')).fadeIn(1000);
    CreateTimer('timer', null, 60).appendTo($('#ordViewer'));
    //$('body').append(CreateLeftPanel());

    var divFooter = $('<div/>', {
        id: 'footer',
        //class: _class,
        attr: {'title': 'caption'}
    }).appendTo($('#ordViewer'));


}

$(document).ready(function () {
    //K_RequestServer();
    //LoadCouriers();
    //setInterval('K_RequestServer()', 3000);
    //$(".left").append(MakePanelHTML('pane12', 12));
    ////$('#mainRange').append(DrawOrderCartHTML(3,123,6));

});