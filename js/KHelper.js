/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global al, CreateTimer, createTimer */

function afterSelUser(sender, id, name) {
    //alert(ui.selected.id + " " + ui.selected.innerHTML);
    localStorage.app = $(sender).attr("group_id");
    localStorage.user_id = id;
    localStorage.user_name = name;
    doInit();
    //updateInterface_user();
}

function afterSelTest(id, name) {
    //var ov=$('#ordViewer');
    updateOrderViewer(id);
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
        class: 'doneButton',
        text: "Готово",
        click: function (event) {
            var divModule = $(this).parent();
            divModule.addClass('ui-state-disabled');
        },
    }).appendTo(divModule);

    bDone.button({
        icons: {
            primary: "ui-icon-check",
            //secondary: "ui-icon-triangle-1-s"
        },
    });

    var bPrint = $('<button/>', {
        id: "bPrint" + modType,
        //class: 'ui-widget-content',
        //text: "Печать",
        click: function (event) {
            printHTML('<h1>ORDER</h1>');
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

function createOrderViewer(id, _class) {
    var headerItems = $.parseJSON('["Продукт","Кол-во","Вес"]');
    var tableItems = null;

    var divOrderViewer = $('<div/>', {
        id: id,
        class: 'ui-widget ui-widget-content ' + _class,
        //attr: {'order_id': '123', 'ts': timestamp}
    });

    var divHeader = $('<div/>', {
        id: "orderheader",
        class: 'ui-widget-header',
    });
    var divNumber = $('<div/>', {
        //id: "number",
    }).append("<h3>Заказ <span id=number>" + 'No' + "</span></h3>");

    divHeader.append(divNumber);
    divOrderViewer.append(divHeader);
    divOrderViewer.append('<div id=ordercomment class="comment">' + 'comment' + '</div>');

    //var tableItems2 = $.parseJSON('[{"id":"3","name":"Пицца 1","count":"2"},{"id":"10","name":"Пицца 2","count":"2"},{"id":"11","name":"Пицца 3","count":"2"},{"id":"12","name":"Пицца 4","count":"2"},{"id":"13","name":"Пицца 5","count":"2"},{"id":"17","name":"Пицца 6","count":"2"},{"id":"19","name":"Пицца 7","count":"2"},{"id":"20","name":"Пицца 8","count":"2"}]');

    divOrderViewer.append(CreateKitchenModule('R', undefined, headerItems, tableItems));
    divOrderViewer.append(CreateKitchenModule('P', undefined, headerItems, tableItems));

    return divOrderViewer;
}

function updateOrderViewer(id) {
    localStorage.activeOrder = id;
    var order = getOrderFromLS(id);
    if (order === undefined) {
        // load from server
    } else {
        $('#number').html(order.no);
        $('#ordercomment').html('new commmen ' + order.id);

        var itemsR = order.products.filter(function (row) {
            return row.type === 'R';
        });
        itemsR = itemsR.map(function (obj) {
            var newObj = {};
            newObj.id = obj.id;
            newObj.name = obj.name;
            newObj.count = obj.count;
            newObj.weight = obj.weight;
            return newObj;
        });

        var itemsP = order.products.filter(function (row) {
            return row.type === 'P';
        });
        itemsP = itemsP.map(function (obj) {
            var newObj = {};
            newObj.id = obj.id;
            newObj.name = obj.name;
            newObj.count = obj.count;
            newObj.weight = obj.weight;
            return newObj;
        });

//            $.each(products, function (key, val) {
        //if (val.type=='R'){
//                itemsR.push(new Array(val.id, val.name, val.count, val.weight));
        //}
//                if (val.type == 'P') {
//                    itemsP.push(val);
        //localStorage.setItem('o_' + val.id, JSON.stringify(val));
//                }
//            });

        $('#tableR tbody').html(ArrayToTableItems(itemsR));
        $('#tableP tbody').html(ArrayToTableItems(itemsP));

//    $('body').append(localStorage.getItem(localStorage.key(i)));


    }
}

function createWorkplace(type) {
    stopTimer();
    $('#workplace').empty();
    $("body").disableSelection();

    switch (type) {
        case 'O':
            var oitems = getOrdersFromLS();
            oitems = oitems.map(function (obj) {
                var newObj = {};
                newObj.id = obj.id;
                newObj.name = obj.no;
                newObj.ts = obj.ts;
                return newObj;
            });
            //console.log(JSON.stringify(oitems));

            //$.parseJSON('[{"id":"3","name":"11","count":"2"},{"id":"10","name":"12","count":"2"},{"id":"11","name":"33","count":"2"},{"id":"12","name":"14","count":"2"},{"id":"13","name":"45","count":"2"}]');

            var ulOrders = $('<ul/>', {
                id: 'o_sortable1',
                class: 'connectedSortable',
                //attr: {'title': 'caption'}
            }).appendTo($('#workplace'));
            ulOrders.html(ArrayToLiItems(oitems));
            ulOrders.children('li').addClass('ui-state-default');
            ulOrders.children('li').click(function () {
                //alert($(this).attr('item_id'));
                createOrderViewer('ordViewer', 'orderViewer').appendTo($('#workplace')).fadeIn(1000);

            });

            var ritems = ArrayToLiItems($.parseJSON('[{"id":"1"},{"id":"2"},{"id":"3"},{"id":"4"},{"id":"5"}]'));
            var ulRows = createUL("o_rows", undefined, ritems).appendTo('#workplace');
            $(ulRows).children('li').addClass('ui-state-default');

            $(ulRows).children('li').html(createUL(undefined, 'o_orderlist connectedSortable', undefined)); //ritems
            $(ulRows).children('li').prepend('<div style="float:left;padding:0;margin:0;top:10px;" class="ui-icon ui-icon-grip-dotted-vertical"></div>');
//'<span class="ui-icon u ui-icon-carat-2-n-s"></span>'
//$('.o_orderlist').children('li').html('<div style="float:left; padding:0; margin:0;">dasda</div>');

            $(function () {
                $("#o_sortable1").sortable({
                    connectWith: ".connectedSortable",
                    //axis: "y",
                }).disableSelection();

                $("#o_rows").sortable({
                    //connectWith: ".connectedSortable",
                    axis: "y",
                }).disableSelection();

                $("#o_sortable3").sortable({
                    connectWith: ".connectedSortable",
                }).disableSelection();

                $(".o_orderlist").sortable({
                    connectWith: ".connectedSortable",
                    //axis: "y",
                }).disableSelection();
            });
            break;
        case 'K':
            //var tableItems = $.parseJSON(localStorage.products);
            var ov=createOrderViewer('ordViewer', 'orderViewer');
            ov.appendTo($('#workplace')).fadeIn(1000);
            createTimer('timer', 'ktimer', 10, 160).appendTo(ov);
            //$('body').append(CreateLeftPanel());

            var orders = getOrdersFromLS();
            //orders.forEach(function (order, index, array) {
            //});

            var smallOrders = orders.map(function (obj) {
                var newObj = {};
                newObj.id = obj.id;
                newObj.name = obj.no;
                //newObj.count = obj.count;
                //newObj.weight = obj.weight;
                return newObj;
            });
            //console.log('items: '+JSON.stringify(smallOrders));


            createSelectPanel('p1', 'selPanel', smallOrders, afterSelTest).appendTo('#workplace');
            $('[item_id=' + localStorage.activeOrder + ']').addClass('ui-selected');

            var divFooter = $('<div/>', {
                id: 'footer',
                //class: _class,
                attr: {'title': 'caption'}
            }).appendTo($('#ordViewer'));
            break;
        default:
            alert('select interface type');
            break;
    }

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
        //alert(data.toString());
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