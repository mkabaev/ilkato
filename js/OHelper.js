function createOperatorInterface() {
    var pnlOrders = $('<div/>', {
        id: 'o_ordersPanel',
        class: 'connectedSortable',
        //attr: {'title': 'caption'}
    });
    pnlOrders.appendTo($('#workplace'));

//    var filterdate = (new Date()).toISOString().substring(0, 10);
    //console.log("--загружаем из LS заказы со всеми статусами кроме Доставлен и датой " + filterdate);
    //var orders = getOrdersFromLS().filter(function (order, index, arr) {
    //return order.idStatus >= 1 && order.idStatus <= 6 && order.DDate == filterdate;
    //return order.DDate == filterdate;
    var orders = getOrdersFromLS();
//    });

    //var dt=Date.parse(orders[1].DDate);
    //var dt = new Date(orders[1].DDate);
    //var today = new Date();

    //alert(dt.toLocaleDateString());
    //alert(today.toLocaleDateString());
// placeholder for batches
    var pnlActiveOrders = $('<div/>', {
        id: 'o_activeOrdersPanel',
        //class: 'connectedSortable',
        //attr: {'title': 'caption'}
    });
    pnlActiveOrders.sortable({
        //connectWith: ".connectedSortable",
        axis: "y",
        update: function (event, ui) {
            var IDs = [];
            pnlActiveOrders.find(".o_orderBatchPanel").each(function () {
                IDs.push($(this).attr("idBatch"));
            });
            sendRequest('updateBatchesQueue', 'ids=' + JSON.stringify(IDs), function (response) {
                console.log(response);
            });
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
            idOrder = parseInt(ui.item.attr("id"));
            idBatch = "NULL";
            console.log("set idBatch=null in order");
            sendRequest('updateOrderIdBatch', 'idOrder=' + idOrder + '&idBatch=' + idBatch, function (response) {
                console.log(response);
            });
        }

    }).disableSelection();

//FILTER
    var topwidget = $('<div/>', {
        id: 'topwidget',
        //class: 'o_orderBatchPanel',
        //attr: {'idBatch': idBatch, 'QueueNo': QueueNo}
        //html:'<div class="o_orderBatchPanelButtons">asd</div>'
    }).appendTo("#topmenu");
    topwidget.append('Дата: <input type="text" id="datepicker"/>');
    topwidget.addClass("ui-widget ui-widget-content ui-corner-bottom");


    //localStorage.dates = ["25.10.2016", "26.10.2016", "29.10.2016"]

    $("#datepicker").datepicker({
        //showOn: "button",
        //buttonImage: "images/calendar.gif",
        //buttonImageOnly: true,
        //buttonText: "Select date"
        //minDate: -1,
        //maxDate: "+1M +10D",
        //maxDate: +3,
        //dateFormat: "yy-mm-dd",
//        beforeShowDay: function (date) {
//            var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
//            //var string = jQuery.datepicker.formatDate('dd.mm.yy', date);
//            return [localStorage.dates.indexOf(string) != -1]
//        },
        onSelect: function () {
            var dt = $.datepicker.formatDate("yy-mm-dd", $(this).datepicker('getDate'));
            $.ajax({
                type: "POST",
                data: "action=getOrdersAndBatches&date=" + dt,
                url: "helper.php?",
                cache: false,
                success: function (jsondata) {
                    $("body").removeClass("ui-state-error");
                    // remove orders from LS
                    $.each(localStorage, function (key, value) {
                        if (key.startsWith('o_') | key.startsWith('b_')) {
                            localStorage.removeItem(key);
                        }
                    });

                    //save orders to LS
                    var data = JSON.parse(jsondata);
                    localStorage.id_session = data.id_session;
                    setItemsToLS('o_', data.orders);
                    setItemsToLS('b_', data.batches);
                    $("#o_activeOrdersPanel").empty();
                    updateOInterface_batches(data.batches);
                    updateInterface_orders(data.orders);

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $("body").addClass("ui-state-error");
                    alert("Сервер не доступен: " + xhr.status + " | " + thrownError);
                    //$("body").addClass("ui-state-error");
//            alert(xhr.status);
//            alert(thrownError);
                }
            });

        }
    });

//        var date = new Date();
//    date.setDate(date.getDate() - 1);
//
//    $("#datepicker").datepicker({
//        dateFormat: "yy-mm-dd",
//        defaultDate: date,
//        onSelect: function () {
//            selectedDate = $.datepicker.formatDate("yy-mm-dd", $(this).datepicker('getDate'));
//        }
//    });

    $("#datepicker").datepicker("setDate", new Date());

    var fs = $('<fieldset/>', {
        class: 'o-filter-rg'
    });

    topwidget.append(fs);

    //fs.append('<legend>Фильтр: </legend>');
    fs.append('<label for="chkP">Печерская</label>');
    fs.append('<input type="checkbox" name="chkP" id="chkP" item_id=3 checked>');
    fs.append('<label for="chkNS">Ново-Садовая</label>');
    fs.append('<input type="checkbox" name="chkNS" id="chkNS" item_id=4 checked>');
    fs.children('input').checkboxradio({
        icon: false,
    });
//    fs.children('input').prop('checked', true);

    fs.children('input').on("change", function (e) {
        var target = $(e.target);
        var id = target.attr("item_id");
        if (target.is(":checked")) {
            $('.order[idKitchen=' + id + ']').show();
        } else {
            $('.order[idKitchen=' + id + ']').hide();
        }

//        alert(target.attr("id"));
    });

    var bAdd = $("<button/>", {
        //type: 'checkbox',
        id: 'bAddBatch',
        //name: 'n' + order.id
        //class: 'orderDoneButton'
    }).appendTo(topwidget);

    bAdd.button({
        icons: {
            primary: "ui-icon-plus",
            //secondary: "ui-icon-triangle-1-s"
        },
        text: false
    }
    );
//    bAdd.css({'width': '25px', 'height': '25px', })

    bAdd.click(function (event) {
////        $(event.target).parent().
//        var pnlActiveOrders = $('#o_activeOrdersPanel');
//        pnlActiveOrders.append(CreateBatchPanel());
//        var IDs = [];
//        pnlActiveOrders.find(".o_orderBatchPanel").each(function () {
//            IDs.push($(this).attr("idBatch"));
//        });
        var dt = $.datepicker.formatDate("yy-mm-dd", $("#datepicker").datepicker('getDate'));
        sendRequest('createBatch', 'date=' + dt, function (response) {
            console.log(response);
        });

        //updateOInterface_batches(getBatchesFromLS()); ?
    });

    updateOInterface_batches(batches);
    updateInterface_orders(orders);

}

/**
 * Create order object
 * @param order {Object} Order Object
 * @return {Object} div order
 */
function CreateOrder(order, isOperator) {
    //var js_date_str = d.substr(0,10)+'T'+d.substr(11,8);
    var divOrder = $('<div/>', {
        id: order.id,
        class: 'order ui-widget ui-widget-content ui-helper-clearfix ui-corner-top',
        attr: {'idKitchen': order.idKitchen}
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
    var comments = order.Comment.split('|');
    var divOrderContent = $('<div/>', {
        //id: "content_"+order_id,
        class: 'order-content',
        //html: '<div class="products"><ul id="ulProducts_' + order.id + '"></ul><span class=comment>' + order.Comment + '</span><hr/>' + order.Client.Street + ', ' + order.Client.Building + '</div>'
        html: '<div><span class=comment>' + comments[0] + '</span><hr/>' + strAddress + '</div>'
    });

    var dt = new Date(order.CreateDate)
    var divTime = $('<div/>', {
        class: 'time',
        //dt.getHours()+':'+dt.getMinutes() 
        html: 'Принят в <span class="CTime"></span><br/>Доставить к <span class="DTime"></span><br/><br/><span class="status"></span>'//order_time
                //html: 'Принят в <span class="startTime">' + dt.toLocaleTimeString() + '</span><br/>Готов в <span class="stopTime">' + "" + '</span><br/><br/><span class="status">' + order.idStatus + '</span>'//order_time
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
//  }).appendTo(divOrderContent);
    if (isOperator) {
        divOrder.dblclick(function (event) {
            showOrderDialog(order);
        });
    } else {
        divOrder.click(function (event) {
            //if (localStorage.activeOrder != order.id) {
                updateOrderViewer(order.id);
                $(".order").removeClass('selected');
                divOrder.addClass('selected');
            //}
        });

    }


    var tt = $('<div/>', {
        class: 'kplace',
        html: '<button idKitchen=3 class="ui-button ui-widget bGreen">П</button><button idKitchen=4 class="ui-button ui-widget bOrange">НС</button>'
    }).appendTo(divOrderContent);
    tt.children('button').click(function () {
        var idOrder = $(this).parent().parent().parent().attr('id');
        var idKitchen = $(this).attr('idKitchen');
        console.log("updating idKitchen in order");
        sendRequest('updateOrderKithcenID', 'idOrder=' + idOrder + '&idKitchen=' + idKitchen, function (response) {
            console.log(response)
            var order = $.parseJSON(localStorage.getItem('o_' + idOrder));
            order.idKitchen = $(this).parent().parent().parent().attr('idKitchen');
            localStorage['o_' + idOrder] = JSON.stringify(order);
            //console.log('DONE');
            updateInterface_orders([getOrderFromLS(idOrder)]);
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
//    $("#selstatus").on('selectmenuopen', function (event, ui)
//    {
//        alert($(dlgV).zIndex());
//        $('.ui-selectmenu-menu').zIndex($(dlgV).zIndex() + 100);
//    });


    dlgV.dialog('open');
//var dialogZindex = $('.ui-dialog').css('z-index');
//alert(dialogZindex);
//alert($('.ui-selectmenu-menu').css('z-index'));
//$('.ui-selectmenu-menu').css('z-index', dialogZindex+2);


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
        id: 'b' + idBatch,
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
    bAdd.css({'width': '25px', 'height': '25px', });
    //bAdd.addClass('ui-state-disabled');

    bAdd.click(function (event) {
////        $(event.target).parent().
//        var pnlActiveOrders = $('#o_activeOrdersPanel');
//        pnlActiveOrders.append(CreateBatchPanel());
//        var IDs = [];
//        pnlActiveOrders.find(".o_orderBatchPanel").each(function () {
//            IDs.push($(this).attr("idBatch"));
//        });
        var dt = $.datepicker.formatDate("yy-mm-dd", $("#datepicker").datepicker('getDate'));
        sendRequest('createBatch', 'date=' + dt, function (response) {
            console.log(response);
        });

        updateOInterface_batches(getBatchesFromLS());
    });

    var divItemsPanel = $('<div/>', {
        //id: id,
        class: 'o_itemsPanel connectedSortable ui-state-hover',
        //attr: {'idBatch': idBatch, 'QueueNo': QueueNo}
        //html:'<h3>asd</h3>'
    }).appendTo(divPanel);

    divItemsPanel.sortable({
        connectWith: ".connectedSortable",
        update: function (event, ui) {
            console.log("Update Queue: " + ui.item.attr("id") + " to " + ui.item.parent().parent().attr("id") + "  index: " + $(ui.item).index());

        },
        receive: function (event, ui) {
            idOrder = parseInt(ui.item.attr("id"));
            idBatch = parseInt(ui.item.parent().parent().attr("idBatch"));
            console.log("updating idBatch in order");
            sendRequest('updateOrderIdBatch', 'idOrder=' + idOrder + '&idBatch=' + idBatch, function (response) {
                console.log(response);
            });
        }
    }).disableSelection();
    //divPanel.append(QueueNo);
    return divPanel;
}

function updateInterface_orders(orders) {
    var ordersPanel = $('#o_ordersPanel');
    if (localStorage.wp_type === "2") {
        var dt = $.datepicker.formatDate("yy-mm-dd", $("#datepicker").datepicker('getDate'));
        if (localStorage.activeDate !== dt) {
            $('#o_ordersPanel, .o_itemsPanel').empty();
        }

    }
    $(orders).each(function (indx, order) {
        var divOrder = $('#' + order.id);
        if (!divOrder.length) {
            if (localStorage.wp_type === "2") {
                divOrder = CreateOrder(order, 1);
            } else {
                divOrder = CreateOrder(order);

            }
        }
        //alert(order.idBatch)
        if (order.idBatch != null) {
            divOrder.appendTo($("#b" + order.idBatch + ">div.o_itemsPanel"));
        } else {
            ordersPanel.append(divOrder);
        }
        var log = '';
        $(order.Log).each(function (index) {

            //log += (new Date(this.ts)).toLocaleTimeString() + ": "+this.idStatus+'\n';
            log += this.ts.substr(11, 5) + ": " + idStatusToString(this.idStatus) + '\n';
        });
        divOrder.attr('title', log);
        divOrder.find('span.CTime').text(order.CTime);
        divOrder.find('span.DTime').text(order.DTime);

        //if (divOrder) {
        divOrder.removeClass('ord-workplace-3 ord-workplace-4');
        divOrder.addClass('ord-workplace-' + order.idKitchen);

        divOrder.removeClass('ord-status-1 ord-status-2 ord-status-3 ord-status-4 ord-status-5 ord-status-6 ord-status-7 ord-status-8');
        divOrder.addClass('ord-status-' + order.idStatus);
        //console.log('try: '+order.id);
        switch (order.idStatus) {
            case 1://Принят
                //divOrder.addClass('ui-state-disabled');
                divOrder.find("span.status").text("Принят");
                break;
            case 2://Готовить
                divOrder.find("span.status").text("Готовить");
                break;
            case 3://Готовится
                divOrder.find("span.status").text("Готовится");
                break;
            case 4://Приготовлен
                divOrder.find("span.status").text("Приготовлен");
                break;
            case 5://Доставка
                divOrder.find("span.status").text("Доставка");
                break;
            case 6://В пути
                divOrder.find("span.status").text("В пути");
                break;
            case 7://Доставлен
                divOrder.find("span.status").text("Доставлен");
                break;
            default:
                //alert( 'Я таких значений не знаю' );
        }

//        divOrder.tooltip({
//            //content: "Awesome title!"
//        });
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
            divBatchPanel = CreateBatchPanel(batch.id, batch.QueueNo);
            activeOrdersPanel.append(divBatchPanel);
        }
        divBatchPanel.attr("QueueNo", batch.QueueNo);
        //divItemsPanel.effect("bounce", "slow");
    });

    activeOrdersPanel.find('.o_orderBatchPanel').sort(function (a, b) {
        return $(a).attr('QueueNo') - $(b).attr('QueueNo');
    }).appendTo(activeOrdersPanel);

//create batch if no one
    if (!activeOrdersPanel.children().length) {
        // add batch on server
        var dt = $.datepicker.formatDate("yy-mm-dd", $("#datepicker").datepicker('getDate'));
        sendRequest('createBatch', 'date=' + dt, function (response) {
            console.log(response);
        });
    }

}