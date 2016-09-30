function createOperatorInterface() {
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
    pnlActiveOrders.append(CreateBatchPanel());
    pnlActiveOrders.append(CreateBatchPanel());
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
            console.log("Moved from " + ui.sender.attr("id") + " to " + ui.item.parent().attr("id"));
        }



    }).disableSelection();

    $(".o_itemsPanel").sortable({
        connectWith: ".connectedSortable",
        receive: function (event, ui) {
            console.log("Moved from " + ui.sender.attr("id") + " to " + ui.item.parent().attr("id"));
        }
    }).disableSelection();

    $("#o_activeOrdersPanel").sortable({
        //connectWith: ".connectedSortable",
        axis: "y",
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
    if (order.idKitchen) {
        divOrder.attr('idKitchen', order.idKitchen);
        divOrder.addClass('ord-workplace-' + order.idKitchen);
    }

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
        html: 'Принят в <span class="startTime">' + dt.toLocaleTimeString() + '</span><br/>Готов в <span class="stopTime">' + "" + '</span>'//order_time
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
        createOrderViewer('ordViewer', 'orderViewer').appendTo($('#workplace')).fadeIn(1000);
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

function CreateBatchPanel() {
    var divPanel = $('<div/>', {
        //id: panel_id,
        class: 'o_orderBatchPanel',
        //attr: {'row': row, 'bla': 'blllaa'}
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
    bAdd.css({'width' : '25px', 'height':'25px',})

    bAdd.click(function (event) {
//        $(event.target).parent().
        $('#o_activeOrdersPanel').append(CreateBatchPanel());

    });






    var divItemsPanel = $('<div/>', {
        //id: panel_id,
        class: 'o_itemsPanel connectedSortable ui-state-hover',
        //attr: {'row': row, 'bla': 'blllaa'}
        //html:'<h3>asd</h3>'
    }).appendTo(divPanel);
    return divPanel;
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

//    var mappedOrders = orders.map(function (obj) {
//        var newObj = {};
//        newObj.id = obj.id;
//        newObj.Name = obj.No;
////                newObj.ts = obj.ts;
//        newObj.Price = obj.Price;
//        return newObj;
//    });

    var pnlOrders = $('#o_ordersPanel');
    pnlOrders.empty();
    //var items = ArrayToLiItems(mappedOrders);

    var pnlOrder;
    $(orders).each(function (indx, order) {
        pnlOrders.append(CreateOrder(order));
    });
}

function updateOInterface_orders(orders) {
    $(orders).each(function (indx, order) {
        var divOrder = $('#' + order.id);
        if (divOrder) {
            divOrder.removeClass('ord-workplace-3 ord-workplace-4');
            divOrder.addClass('ord-workplace-' + order.idKitchen);
            //console.log('try: '+order.id);
        }
        //pnlOrders.append(CreateOrder(order));
    });
}