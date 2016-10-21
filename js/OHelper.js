function createOperatorInterface() {
    var pnlOrders = $('<div/>', {
        id: 'o_ordersPanel',
        class: 'connectedSortable',
        //attr: {'title': 'caption'}
    });
    pnlOrders.appendTo($('#workplace'));

    console.log("--загружаем из LS заказы со всеми статусами кроме Доставлен");
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

// placeholder for batches
    var pnlActiveOrders = $('<div/>', {
        id: 'o_activeOrdersPanel',
        //class: 'connectedSortable',
        //attr: {'title': 'caption'}
    });
    pnlActiveOrders.sortable({
        //connectWith: ".connectedSortable",
        axis: "y",
        update: function( event, ui ) {
            //console.log("Changed" + ui.sender.attr("id"));// + " to " + ui.item.parent().attr("id"));
            console.log("id:"+ui.item.attr("idBatch")+" QueueNo:"+ui.item.attr("QueueNo"));// + " to " + ui.item.parent().attr("id"));
        },
//        change: function( event, ui ) {
//            //console.log("Changed" + ui.sender.attr("id"));// + " to " + ui.item.parent().attr("id"));
//            console.log("Changed" + ui );// + " to " + ui.item.parent().attr("id"));
//        },
//        receive: function (event, ui) {
//            console.log("HEYY.." + ui.sender.attr("id") + " to " + ui.item.parent().attr("id"));
//        }
    }).disableSelection();
    //var pnlActiveOrders = CreateGroupPanel();
    pnlActiveOrders.appendTo($('#workplace'));

//            var ritems = ArrayToLiItems($.parseJSON('[{"id":"1"},{"id":"2"},{"id":"3"},{"id":"4"},{"id":"5"}]'));
//            var ulRows = createUL("o_rows", undefined, ritems).appendTo('#workplace');
//            $(ulRows).children('li').addClass('ui-state-default');

//            $(ulRows).children('li').html(createUL(undefined, 'o_orderlist connectedSortable', undefined)); //ritems
//            $(ulRows).children('li').prepend('<div style="float:left;padding:0;margin:0;top:10px;" class="ui-icon ui-icon-grip-dotted-vertical"></div>');
////'<span class="ui-icon u ui-icon-carat-2-n-s"></span>'
////$('.o_orderlist').children('li').html('<div style="float:left; padding:0; margin:0;">dasda</div>');
    var batches = getBatchesFromLS();
    //pnlActiveOrders.append(CreateBatchPanel(132));

    updateOInterface_batches(batches);
    updateOInterface_orders(orders);
    $("#o_ordersPanel").sortable({
        connectWith: ".connectedSortable",
        //axis: "y",
        //handle: ".order-header, .order-content",
        //cancel: ".order-toggle",
        //placeholder: "order-placeholder ui-corner-all",
        //helper: "clone"
        //opacity: 0.8,
        //revert:true
        cursor: "move",
        //disabled: true
        //delay: 150,
        //revert: 150,



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
            console.log("HEYY..Moved from " + ui.sender.attr("id") + " to " + ui.item.parent().attr("id"));
        }

    }).disableSelection();


    var fs = $('<fieldset/>', {
        class: 'rg-kplace'
    }).prependTo($('#topwidget'));
    //fs.append('<legend>Фильтр: </legend>');
    fs.append('<label for="chkP">Печерская</label>');
    fs.append('<input type="checkbox" name="chkP" id="chkP">');
    fs.append('<label for="chkNS">Ново-Садовая</label>');
    fs.append('<input type="checkbox" name="chkNS" id="chkNS">');
    fs.children('input').checkboxradio({
        icon: false
    });

}

/**
 * Create order object
 * @param order {Object} Order Object
 * @return {Object} div order
 */
function CreateOrder(order) {
    //var js_date_str = d.substr(0,10)+'T'+d.substr(11,8);
    var divOrder = $('<div/>', {
        id: order.id,
        class: 'order ui-widget ui-widget-content ui-helper-clearfix ui-corner-top',
        //attr: {'idKitchen': order.idKitchen, 'ts': timestamp}
    });
//    if (order.idKitchen) {
//        divOrder.attr('idKitchen', order.idKitchen);
//        divOrder.addClass('ord-workplace-' + order.idKitchen);
//    }

//    if (order.idStatus == 4) {
//        divOrder.addClass('ui-state-disabled');
//    }
//    if (status_id == 5) {
//        divOrder.addClass('ui-state-default');
//    }

    var divOrderHeader = $('<div/>', {
        //id: order_id,
        class: 'order-header ui-widget-header ui-corner-top',
        html: order.No //+'<div class="imgRoll"/>'
    });


//    if (stop_time == null) {
//        stop_time = '-'
//    };

//var selectHTML='<select name="menu_drivers" id="menu_drivers" style="width: 100%;"><option selected disabled>Назначить курьера</option><option>Пупкин</option><option>Сидоров</option><!--<option selected="selected">Medium</option>--><option>Иванов</option><option>Петров</option></select>';
    var strAddress = 'адрес не указан';
    if (order.Client) {
        strAddress = order.Client.Street + ', ' + order.Client.Building;
    }
    var divOrderContent = $('<div/>', {
        //id: "content_"+order_id,
        class: 'order-content',
        //html: '<div class="products"><ul id="ulProducts_' + order.id + '"></ul><span class=comment>' + order.Comment + '</span><hr/>' + order.Client.Street + ', ' + order.Client.Building + '</div>'
        html: '<div><span class=comment>' + order.Comment + '</span><hr/>' + strAddress + '</div>'
    });

    //var curDate = new Date();
    var dt = new Date(order.CreateDate)
    var divTime = $('<div/>', {
        class: 'time',
        //dt.getHours()+':'+dt.getMinutes() 
        html: 'Принят в <span class="startTime">' + dt.toLocaleTimeString() + '</span><br/>Готов в <span class="stopTime">' + "" + '</span><br/><br/><span class="status">' + order.idStatus + '</span>'//order_time
    });
    divOrderHeader.append(divTime);


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
    divOrder.dblclick(function (event) {
        showOrderDialog(order);
        //showSelectUserDialog();
    });


    var tt = $('<div/>', {
        class: 'kplace',
        html: '<button idKitchen=3 class="ui-button ui-widget bGreen">П</button><button idKitchen=4 class="ui-button ui-widget bOrange">НС</button>'
    }).appendTo(divOrderContent);
    tt.children('button').click(function () {
        var idOrder = $(this).parent().parent().parent().attr('id');
        var idKitchen = $(this).attr('idKitchen');
//        change order.idKitchen on Server
        $.ajax({
            type: "POST",
            data: "action=updateOrderKithcenID&idOrder=" + idOrder + "&idKitchen=" + idKitchen,
            url: "helper.php?",
            cache: false,
            success: function (data) {
                //$(".ordrow").removeClass("ui-state-error");
                //setOrderstoLS($.parseJSON(jsondata));
                var order = $.parseJSON(localStorage.getItem('o_' + idOrder));
                order.idKitchen = $(this).parent().parent().parent().attr('idKitchen');
                localStorage['o_' + idOrder] = JSON.stringify(order);
                //console.log('DONE');
                updateOInterface_orders([getOrderFromLS(idOrder)]);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log("ERROR: " + xhr.status + " | " + thrownError);
                //$(".ordrow").addClass("ui-state-error");
            }
        });

    });

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

    divOrder.append(divOrderHeader);
    divOrder.append(divOrderContent);
    return divOrder;
}

function showOrderDialog(order) {

    //var dlgV=$('#dlgV');
    //if (!dlgV.length) {
    var dlgV = CreateDialog('dlgV', 'Заказ ' + order.No, 'o_orderViewerDlg');
    //dlgV.dialog( "option", "resizable", true );
    dlgV.dialog("option", "height", 600);
    dlgV.dialog("option", "width", 1100);

    var ov = createOrderViewer('ordViewer', 'orderViewer');
    //ov.addClass('ul_selec');
    dlgV.append(ov.fadeIn(1000));
    //}
    updateOrderViewer(order.id);
    dlgV.dialog('open');

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



//    var dlg = $('#dlg_selUsers');
//    if (!dlg.length) {
//        dlg = CreateSelectDialog('SelUsers', 'Авторизация', undefined, undefined, afterSelUser);
//    }
//    $.ajax({
//        type: "POST",
//        data: "action=getUsers",
//        url: "helper.php",
//        cache: false,
//        success: function (jsondata) {
//            //console.log('dialog ' + id + ' found on page. items');
//            console.log('users loaded from server: ' + jsondata);
//            $('#workplace').removeClass("ui-state-error");
//            $('ul.ul_selectItems').html(ArrayToLiItems($.parseJSON(jsondata)));
//            //dlg.dialog('open');
//        },
//        error: function (xhr, ajaxOptions, thrownError) {
//            console.log("status: " + xhr.status + " | " + thrownError);
//            $("#workplace").addClass("ui-state-error");
//            //$("body").addClass("ui-state-error");
////            alert(xhr.status);
////            alert(thrownError);
//        }
//    });
}

function CreateBatchPanel(idBatch, QueueNo) {
    var divPanel = $('<div/>', {
        id: 'b'+idBatch,
        class: 'o_orderBatchPanel',
        attr: {'idBatch': idBatch, 'QueueNo': QueueNo}
        //html:'<div class="o_orderBatchPanelButtons">asd</div>'
    });

    var divButtonsPanel = $('<div/>', {
        //id: panel_id,
        class: 'o_orderBatchPanelButtons',
        //attr: {'row': row, 'bla': 'blllaa'}
        //html:'<span class="ui-icon ui-icon-grip-dotted-vertical"></span>'
    }).appendTo(divPanel);

    var bAdd = $("<button/>", {
        //type: 'checkbox',
        //id: 'bAdd' + order.id,
        //name: 'n' + order.id
        //class: 'orderDoneButton'
    }).appendTo(divButtonsPanel);

    bAdd.button({
        icons: {
            primary: "ui-icon-plus",
            //secondary: "ui-icon-triangle-1-s"
        },
        text: false
    }
    );
    bAdd.css({'width': '25px', 'height': '25px', })

    bAdd.click(function (event) {
//        $(event.target).parent().
        $('#o_activeOrdersPanel').append(CreateBatchPanel());

    });

    var divItemsPanel = $('<div/>', {
        //id: id,
        class: 'o_itemsPanel connectedSortable ui-state-hover',
        //attr: {'idBatch': idBatch, 'QueueNo': QueueNo}
        //html:'<h3>asd</h3>'
    }).appendTo(divPanel);

    divItemsPanel.sortable({
        connectWith: ".connectedSortable",
        receive: function (event, ui) {
            console.log("Moved from " + ui.sender.attr("id") + " to " + ui.item.parent().attr("id"));
        }
    }).disableSelection();
divPanel.append(QueueNo);
    return divPanel;
}

function updateOInterface_orders(orders) {
    var ordersPanel = $('#o_ordersPanel');
    $(orders).each(function (indx, order) {
        var divOrder = $('#' + order.id);
        if (!divOrder.length) {
            divOrder = CreateOrder(order);
            ordersPanel.append(divOrder);
        }

        //if (divOrder) {
        divOrder.removeClass('ord-workplace-3 ord-workplace-4');
        divOrder.addClass('ord-workplace-' + order.idKitchen);
        //console.log('try: '+order.id);
        switch (order.idStatus) {
            case "1"://Принят
                //divOrder.addClass('ui-state-disabled');
                divOrder.find("span.status").text("Принят");
                break;
            case "2"://Готовить
                divOrder.find("span.status").text("Готовить");
                break;
            case "3"://Готовится
                divOrder.find("span.status").text("Готовится");
                break;
            case "4"://Приготовлен
                divOrder.find("span.status").text("Приготовлен");
                break;
            case "5"://Доставка
                divOrder.find("span.status").text("Доставка");
                break;
            case "6"://В пути
                divOrder.find("span.status").text("В пути");
                break;
            case "7"://Доставлен
                divOrder.find("span.status").text("Доставлен");
                break;
            default:
                //alert( 'Я таких значений не знаю' );
        }


        //}
        //pnlOrders.append(CreateOrder(order));
        divOrder.effect("bounce", "slow");
    });
}

function updateOInterface_batches(batches) {
    var activeOrdersPanel = $("#o_activeOrdersPanel");
    $(batches).each(function (indx, batch) {
        var divBatchPanel = $('#b' + batch.id);
        if (!divBatchPanel.length) {
            divBatchPanel = CreateBatchPanel(batch.id,batch.QueueNo);
            activeOrdersPanel.append(divBatchPanel);
        }
        divBatchPanel.attr("QueueNo",batch.QueueNo);
        //divItemsPanel.effect("bounce", "slow");
    });

activeOrdersPanel.find('.o_orderBatchPanel').sort(function (a, b) {
   return $(a).attr('QueueNo') - $(b).attr('QueueNo');
})
.appendTo(activeOrdersPanel);

}