/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global al, CreateTimer */

function afterSel(id, name) {
    //alert(ui.selected.id + " " + ui.selected.innerHTML);
    localStorage.user_id = id;
    localStorage.user_name = name;
    updateInterface_user();
}

function afterSelTest(id, name) {
    alert(id + " | " + name);
}

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

/**
 * Create module with table and buttons
 * @param modType {string} "R" for Roll and "P" for Pizza
 * @param _class {string} add class
 * @param headerItems {Array} array of li items
 * @param tableItems {Array} array of li items
 * @param callback function(id,name)
 * @return {Object} div
 */
function CreateKitchenModule(modType, _class, headerItems, tableItems) {
    var divModule = $('<div/>', {
        id: 'div' + modType,
        class: 'mk ui-widget ui-widget-content',
    }).css('border', '1px solid #d34d17')

    var divHeader = $('<div/>', {
        id: 'divHeader' + modType,
        //class: 'ui-widget-',
    }).appendTo(divModule).css('padding-left', '30px')

    divModule.append(CreateTable('table' + modType, 'tProducts', headerItems, tableItems));

    var bDone = $('<button/>', {
        id: "bDone" + modType,
        //class: 'ui-widget-content',
        text: "Готово",
        click: function (event) {
            alert('event.target')
        },
    }).appendTo(divHeader);

    bDone.button({
        icons: {
            primary: "ui-icon-check",
            //secondary: "ui-icon-triangle-1-s"
        },
    });

    var bPrint = $('<button/>', {
        id: "bPrint" + modType,
        //class: 'ui-widget-content',
        text: "Печать",
        click: function (event) {
            CreatePrintArea().appendTo($('body'));
            window.print();
        },
    }).appendTo(divHeader);

    //divFooter.append(CreateTimer('timer2',null,30));

    bPrint.button({
        icons: {
            primary: "ui-icon-print",
            //secondary: "ui-icon-triangle-1-s"
        },
    });

    //var json='[{"id":"3","name":"Илья"},{"id":"10","name":"Дима 12ка"}]';
    var divChefs = $('<div/>', {
        id: 'divChefs' + modType,
        //class: 'ui-widget-',
    }).appendTo(divHeader).append('<span class="ui-icon ui-icon-person"></span>Илья | Егор | Василий').css({"float": "right", "padding": "5px"});

    return divModule;
}
function CreateOrderViewer(id, _class, No, comment) {
    var headerItems = $.parseJSON('["Продукт","Кол-во","Вес"]');
    var tableItems = null;

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

    divOrderViewer.append(CreateKitchenModule('R', undefined, headerItems, tableItems));
    divOrderViewer.append(CreateKitchenModule('P', undefined, headerItems, tableItems));

    return divOrderViewer;
}


function createInterface() {
    $("body").disableSelection();
    //var tableItems = $.parseJSON(localStorage.products);
    CreateOrderViewer('ordViewer', 'orderViewer', 111, 'Приготовить как для себя').appendTo($('body')).fadeIn(1000);
    CreateTimer('timer', null, 60).appendTo($('#ordViewer'));
    //$('body').append(CreateLeftPanel());

    var items = $.parseJSON('[{"id":"3","name":"11","count":"2"},{"id":"10","name":"12","count":"2"},{"id":"11","name":"33","count":"2"},{"id":"12","name":"14","count":"2"},{"id":"13","name":"45","count":"2"}]');
    CreateSelectPanel('p1', 'selPanel', items, afterSelTest).appendTo('body');

    var divFooter = $('<div/>', {
        id: 'footer',
        //class: _class,
        attr: {'title': 'caption'}
    }).appendTo($('#ordViewer'));
}

function clearStorage() {
    var user_id = localStorage.user_id;
    var user_name = localStorage.user_name;
    var app = localStorage.app;

    localStorage.clear();

    localStorage.user_id = user_id;
    localStorage.user_name = user_name;
    localStorage.app = app;
    //updateInterface_user();
}

function loadDataToStorage() {
    $.getJSON("./orderJSON.json", function (data) {
        var items = [];
        alert(data.toString());
        $.each(data, function (key, val) {
            items.push("<li id='" + key + "'>" + val + "</li>");

        });
localStorage.setItem('o124', data);
//        $("<ul/>", {
//            "class": "my-new-list",
//            html: items.join("")
//        }).appendTo("body");

    });

    var o123 = '{"id":123,"no":9,"comment":"Как для себя"}';
    var o123_products = '[{"id":"10","type":"R","name":"Ролл 2","count":"2","weight":"250"},{"id":"11","type":"R","name":"Ролл 4","count":"1","weight":"150"},{"id":"17","type":"P","name":"Пицца 2","count":"1","weight":"500"}]';
    localStorage.setItem('o123', o123);
    localStorage.setItem('o123_products', o123_products);
}

$(document).ready(function () {
    //K_RequestServer();
    //LoadCouriers();
    //setInterval('K_RequestServer()', 3000);
    //$(".left").append(MakePanelHTML('pane12', 12));
    ////$('#mainRange').append(DrawOrderCartHTML(3,123,6));

});