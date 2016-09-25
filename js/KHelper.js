/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global al, CreateTimer, createTimer, createSelectPanel */

function afterSelUser(sender, id, name) {
    //alert(ui.selected.id + " " + ui.selected.innerHTML);
    //localStorage.clear();
    localStorage.wp_id = $(sender).attr("idWorkplace");
    localStorage.wp_type = $(sender).attr("idWorkplace");
    localStorage.uid = id;
    localStorage.user_name = name;
    doInit();
    //updateInterface_user();
}

function afterSelTest(id, name) {
    //var ov=$('#ordViewer');
    //stopTimer();
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
    if (order == undefined) {
        // load from server
        console.log('ord undef');
    } else {
        //console.log('ordViewer updating ' + order.comment);
        $('#number').html(order.No);
        $('#ordercomment').html(order.Comment);
        if (order.Products) {
            var itemsR = order.Products.filter(function (row) {
                return row.idType === 1;
            });
            itemsR = itemsR.map(function (obj) {
                var newObj = {};
                newObj.id = obj.id;
                newObj.Name = obj.Name;
                newObj.Count = obj.Count;
                newObj.Weight = obj.Weight;
                return newObj;
            });

            var itemsP = order.Products.filter(function (row) {
                return row.idType === 2;
            });
            itemsP = itemsP.map(function (obj) {
                var newObj = {};
                newObj.id = obj.id;
                newObj.Name = obj.Name;
                newObj.Count = obj.Count;
                newObj.Weight = obj.Weight;
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
        } else {
            console.log("ERROR: Заказ " + order.No + " не содержит продуктов");
        }



    }
}

function createWorkplace(type) {
    stopTimer();
    $('#workplace').empty();
    $("body").disableSelection();
    //console.log(document.attributes);

    switch (type) {
        case '2'://O

//            //console.log(JSON.stringify(oitems));
//
//            //$.parseJSON('[{"id":"3","name":"11","count":"2"},{"id":"10","name":"12","count":"2"},{"id":"11","name":"33","count":"2"},{"id":"12","name":"14","count":"2"},{"id":"13","name":"45","count":"2"}]');

//            var ulOrders = $('<ul/>', {
//                id: 'o_ordersPanel',
//                class: 'connectedSortable',
//                //attr: {'title': 'caption'}
//            }).appendTo($('#workplace'));

            var pnlOrders = $('<div/>', {
                id: 'o_ordersPanel',
                class: 'connectedSortable',
                //attr: {'title': 'caption'}
            });
            pnlOrders.appendTo($('#workplace'))
            updateOInterface_ordersPanel();

            var pnlActiveOrders = $('<div/>', {
                id: 'o_activeOrdersPanel',
                //class: 'connectedSortable',
                //attr: {'title': 'caption'}
            });
            //var pnlActiveOrders = CreateGroupPanel();
            pnlActiveOrders.appendTo($('#workplace'));
            pnlActiveOrders.append(CreateGroupPanel());
            pnlActiveOrders.append(CreateGroupPanel());
//            var ritems = ArrayToLiItems($.parseJSON('[{"id":"1"},{"id":"2"},{"id":"3"},{"id":"4"},{"id":"5"}]'));
//            var ulRows = createUL("o_rows", undefined, ritems).appendTo('#workplace');
//            $(ulRows).children('li').addClass('ui-state-default');

//            $(ulRows).children('li').html(createUL(undefined, 'o_orderlist connectedSortable', undefined)); //ritems
//            $(ulRows).children('li').prepend('<div style="float:left;padding:0;margin:0;top:10px;" class="ui-icon ui-icon-grip-dotted-vertical"></div>');
////'<span class="ui-icon u ui-icon-carat-2-n-s"></span>'
////$('.o_orderlist').children('li').html('<div style="float:left; padding:0; margin:0;">dasda</div>');

            $("#o_ordersPanel").sortable({
                connectWith: ".connectedSortable",
                //axis: "y",
            }).disableSelection();

            $(".o_orderGroupPanel").sortable({
                connectWith: ".connectedSortable",
                //axis: "y",
            }).disableSelection();

            $("#o_activeOrdersPanel").sortable({
                //connectWith: ".connectedSortable",
                axis: "y",
            }).disableSelection();


            break;
        case '3'://K
            //var tableItems = $.parseJSON(localStorage.products);
            var ov = createOrderViewer('ordViewer', 'orderViewer');
            ov.appendTo($('#workplace')).fadeIn(1000);
            createTimer('timer', 'ktimer', 10, 160).appendTo(ov);
            //$('body').append(CreateLeftPanel());


            createSelectPanel('p1', 'selPanel', undefined, afterSelTest).appendTo('#workplace');
            updateOrderViewer(localStorage.activeOrder);
            updateKInterface_SelPanel();
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

function updateKInterface_SelPanel() {

    console.log("--загружаем из LS заказы со статусом Готовить, Готовится, Приготовлен");
    var orders = getOrdersFromLS().filter(function (currentValue, index, arr) {
        return currentValue.idStatus == 2 || currentValue.idStatus == 3 || currentValue.idStatus == 4;
//1	Принят
//2	Готовить
//3	Готовится
//4	Приготовлен
//5	Доставка
//6	В пути
//7	Доставлен
//8	Отказ

    });

    //orders.forEach(function (order, index, array) {
    //});

    var mappedOrders = orders.map(function (obj) {
        var newObj = {};
        newObj.id = obj.id;
        newObj.Name = obj.No;
        //newObj.count = obj.count;
        //newObj.weight = obj.weight;
        return newObj;
    });
    //console.log('items: '+JSON.stringify(smallOrders));
    var list = $('#p1 ul');
    var items = ArrayToLiItems(mappedOrders);

    var li;
    $(orders).each(function (indx, order) {
        var rCount = 0;
        var pCount = 0;
        if (order.Products !== null) {
            rCount = order.Products.filter(function (currentValue, index, arr) {
                return currentValue.idType == 1;
            }).length;

            pCount = order.Products.filter(function (currentValue, index, arr) {
                return currentValue.idType == 2;
            }).length;
        }

        li = $(items[indx]);
//        console.log('R:'+rCount);
//        console.log('P:'+pCount);
        li.html(order.no); //'<div class="imgRoll"/>'
        items[indx] = li;
    });


    list.html(items);
    $(list.children('li')).addClass('ui-widget-content');

    //divDialog.attr("user_id", $(this).parent().attr("item_id"));
    list.selectable({
        //tolerance: "fit",
        selected:
                function (event, ui) {
                    afterSelTest($(ui.selected).attr("item_id"), ui.selected.innerHTML);
                }

    });



    $('[item_id=' + localStorage.activeOrder + ']').addClass('ui-selected');
}

function updateOInterface_ordersPanel() {
    console.log("--загружаем из LS заказы со всеми статусами кроме Доставлен");
//        console.log(getOrdersFromLS());
    var orders = getOrdersFromLS().filter(function (currentValue, index, arr) {
        return currentValue.idStatus >= 1 && currentValue.idStatus <= 6;
//1	Принят
//2	Готовить
//3	Готовится
//4	Приготовлен
//5	Доставка
//6	В пути
//7	Доставлен
//8	Отказ
    });

    var mappedOrders = orders.map(function (obj) {
        var newObj = {};
        newObj.id = obj.id;
        newObj.Name = obj.No;
//                newObj.ts = obj.ts;
        newObj.Price = obj.Price;
        return newObj;
    });

    var pnlOrders = $('#o_ordersPanel');
    pnlOrders.empty();
    //var items = ArrayToLiItems(mappedOrders);

    var pnlOrder;
    $(orders).each(function (indx, order) {
        var rCount = 0;
        var pCount = 0;
        if (order.Products !== null) {
            rCount = order.Products.filter(function (currentValue, index, arr) {
                return currentValue.idType == 1;
            }).length;

            pCount = order.Products.filter(function (currentValue, index, arr) {
                return currentValue.idType == 2;
            }).length;
        }

        pnlOrder = $('<div/>', {
            id: order.id,
            class: 'order ui-state-default',
            //attr: {'status_id': status_id, 'ts': timestamp}
        });
        pnlOrder.html(order.No + '<div class=o_price>' + order.Price + '</div>'); //'<div class="imgRoll"/>'
        pnlOrders.append(CreateOrder(order));

    });
    //list.html(items);



    //list.children('li').addClass('ui-state-default');
    //list.children('li').click(function () {
    //    //alert($(this).attr('item_id'));
    //    createOrderViewer('ordViewer', 'orderViewer').appendTo($('#workplace')).fadeIn(1000);
    //});
}

function clearStorage() {
    var uid = localStorage.uid;
    var user_name = localStorage.user_name;

    localStorage.clear();

    localStorage.uid = uid;
    localStorage.user_name = user_name;
    //updateInterface_user();
}

//copy data to LS and update interface if needed
function setOrderstoLS(data) {
    $.each(data, function (key, val) {
        console.log('saving order to LS:' + JSON.stringify(val));
        localStorage.setItem('o_' + val.id, JSON.stringify(val));

//then update interface
        switch (localStorage.wp_type) {
            case '1'://adm
                break;
            case '2'://operator
                break;
            case '3'://kitch
                if (val.id === localStorage.activeOrder) {
                    updateOrderViewer(localStorage.activeOrder);
                    updateKInterface_SelPanel();
                }
                break;
        }
    });
}

/**
 * Create order object
 * @param order {Object} Order Object
 * @return {Object} div order
 */
function CreateOrder(order) {
//order_id, number, status_id, Comment, start_time, stop_time, timestamp, address
    //var js_date_str = d.substr(0,10)+'T'+d.substr(11,8);
    var divOrder = $('<div/>', {
        id: order.id,
        class: 'order ui-widget ui-widget-content ui-helper-clearfix ui-corner-top id-workplace-1',
        //attr: {'status_id': status_id, 'ts': timestamp}
    });

//    if (order.idStatus == 4) {
//        divOrder.addClass('ui-state-disabled');
//    }
//    if (status_id == 5) {
//        divOrder.addClass('ui-state-default');
//    }

    var divOrderHeader = $('<div/>', {
        //id: order_id,
        class: 'order-header ui-widget-header ui-corner-top',
        text: order.No
    });


//    if (stop_time == null) {
//        stop_time = '-'
//    };
    //var curDate = new Date();
    var dt = new Date(order.CreateDate)
    var divTime = $('<div/>', {
        class: 'time ui-corner-tr',
        //dt.getHours()+':'+dt.getMinutes() 
        html: 'Принят в <span class="startTime">' + dt.toLocaleTimeString() + '</span><br/>Готов в <span class="stopTime">' + "" + '</span>'//order_time
    });
    divOrderHeader.append(divTime);


//var selectHTML='<select name="menu_drivers" id="menu_drivers" style="width: 100%;"><option selected disabled>Назначить курьера</option><option>Пупкин</option><option>Сидоров</option><!--<option selected="selected">Medium</option>--><option>Иванов</option><option>Петров</option></select>';
    var strAddress = 'адрес не указан';
    if (order.Client) {
        order.Client.Street + ', ' + order.Client.Building;
    }
    var divOrderContent = $('<div/>', {
        //id: "content_"+order_id,
        class: 'order-content',
        //html: '<div class="products"><ul id="ulProducts_' + order.id + '"></ul><span class=comment>' + order.Comment + '</span><hr/>' + order.Client.Street + ', ' + order.Client.Building + '</div>'
        html: '<div><span class=comment>' + order.Comment + '</span><hr/>' + strAddress + '</div>'
    });

//    $('<label for="' + 'chkDone' + order.id + '">Готов</label>').appendTo(divOrderContent);
//    var chkDone = $("<input/>", {
//        type: 'checkbox',
//        id: 'chkDone' + order.id,
//        name: 'n' + order.id,
//        class: 'orderDoneButton'
//    });
////    SetOrderProducts(order_id);
//    $(chkDone).appendTo(divOrderContent);
//    $(chkDone).button({
//        icons: {
//            primary: "ui-icon-check",
//            //secondary: "ui-icon-triangle-1-s"
//        },
//        text: false
//    }
//    );
//    $(chkDone).click(function (event) {
//        var order = $(event.target).parent().parent();
//        order.toggleClass('ui-state-disabled');
//
//        order.attr('status_id', function (index, attr) {
//            return attr == 3 ? 4 : 3;
//        });
////        UpdateOrderStatusOnServer(order.attr("id"), order.attr("status_id"));
//
//
//        //$("#log").append("<br/>Moved from " + ui.sender.attr("id") + " to " + ui.item.parent().attr("id"));
////                        switch (ui.item.parent().attr("id")) {
////                            case "mainPanel":
////                                ui.item.attr("status_id", 2);
////                                UpdateOrderStatusOnServer(ui.item.attr("id"), 2);
////                                break;
////                            case "donePanel":
////                                ui.item.attr("status_id", 5);
////                                UpdateOrderStatusOnServer(ui.item.attr("id"), 5);
////                                break;
////                        }
//        order.fadeOut(200);
//        order.fadeIn(400);
//    });

//$("<button>Редактор</button>").button({
//      icons: {
//        primary: "ui-icon-locked"
//      },
//      text: false
//  }).appendTo(divOrderContent);;


    //$('<label for="' + 'bEdit' + order.id + '">Редактор</label>').appendTo(divOrderContent);
    var bEdit = $("<button/>", {
        type: 'checkbox',
        id: 'bEdit' + order.id,
        name: 'n' + order.id
                //class: 'orderDoneButton'
    });

//    SetOrderProducts(order_id);
    $(bEdit).appendTo(divOrderContent);
    $(bEdit).button({
        icons: {
            primary: "ui-icon-pencil",
            //secondary: "ui-icon-triangle-1-s"
        },
        text: false
    }
    );

    $(bEdit).click(function (event) {
        alert('в разработке...');
//        //var order = $(event.target).parent().parent();
//        //$("#dlgEdit").attr("order_id", $(this).parent().attr("id"));
//        var order_id = $(event.target).parent().parent().attr("id");
////        $("#scanr").text("");
////        $("#scanp").text("");
////        $("#weight").text("");
//        weightR = 0;
//        weightP = 0;
//        //LoadOrderProducts(order_id);
//        $("#dlgEdit").attr("order_id", order_id);
//        $("#dlgEdit").dialog("open");
    });
    //divOrderContent.append(btnDone);

//    $('<button/>')
//            .text('Test')
//            .click(function () {
//                alert('hi');
//            }).appendTo(divOrderContent);

    divOrder.append(divOrderHeader);
    divOrder.append(divOrderContent);
    return divOrder;
}

$(document).ready(function () {
    //K_RequestServer();
    //LoadCouriers();
    //setInterval('K_RequestServer()', 3000);
    //$(".left").append(MakePanelHTML('pane12', 12));
    ////$('#mainRange').append(DrawOrderCartHTML(3,123,6));

});