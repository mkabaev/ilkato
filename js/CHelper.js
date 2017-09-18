function createCourierInterface() {
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
//////////////////////    var orders = getOrdersFromLS();
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

    //var pnlActiveOrders = CreateGroupPanel();
    pnlActiveOrders.appendTo($('#workplace'));

//            var ritems = ArrayToLiItems($.parseJSON('[{"id":"1"},{"id":"2"},{"id":"3"},{"id":"4"},{"id":"5"}]'));
//            var ulRows = createUL("o_rows", undefined, ritems).appendTo('#workplace');
//            $(ulRows).children('li').addClass('ui-state-default');

//            $(ulRows).children('li').html(createUL(undefined, 'o_orderlist connectedSortable', undefined)); //ritems
//            $(ulRows).children('li').prepend('<div style="float:left;padding:0;margin:0;top:10px;" class="ui-icon ui-icon-grip-dotted-vertical"></div>');
////'<span class="ui-icon u ui-icon-carat-2-n-s"></span>'
////$('.o_orderlist').children('li').html('<div style="float:left; padding:0; margin:0;">dasda</div>');
    /////////////////var batches = getBatchesFromLS();
    //pnlActiveOrders.append(CreateBatchPanel(132));

//    selectDate(G.today);
    updateCInterface()
//    var date = new Date().toLocaleDateString("en-US");
////Also, you can call method toLocaleDateString with two parameters:
//alert(date);

//    date = new Date().toLocaleDateString("en-US", {
//        "year": "numeric",
//        "month": "2-digit",
//        "day": "2-digit"
//    });
//    alert(date);
}

function updateCInterface() {

    //$.each(localStorage, function (key, value) {
    //    if (key.startsWith('o_') | key.startsWith('b_')) {
    //        localStorage.removeItem(key);
    //    }
    //});

    $("#o_activeOrdersPanel").empty();//right panel
    //updateOInterface_batches(data.batches);


//        //sort orders
//        var orders = G.AllOrders;
//        orders = orders.filter(function (o, index, arr) {
//            return o.DDate === G.today;
//        });
//        orders = $(orders).sort(function (a, b) {
//            if (a.DTime && b.DTime) {
//                var tt = a.DTime.split(":");
//                var secA = tt[0] * 3600 + tt[1] * 60;
//                tt = b.DTime.split(":");
//                var secB = tt[0] * 3600 + tt[1] * 60;
//                return secA - secB;
//            }
//        });

    //var dt = $.datepicker.formatDate("yy-mm-dd", $("#datepicker").datepicker('getDate'));
    //if (localStorage.activeDate !== dt) {
    //    //$('#o_ordersPanel, .o_itemsPanel').empty();
    //}

//uniq batch nums
    if (G.AllOrders!==null) {
        var batches = G.AllOrders.map(function (item, i, arr) {
            var newObj = {};
            newObj.idBatch = item.idBatch;
            return newObj;
        }).filter(function (item, i, arr) {
            return item.idBatch !== null
        });
        var a = [];
        batches.forEach(function (itm) {
            a.push(itm.idBatch);
        });
        //a = remove_duplicates_es6(a);
//---

        var activeOrdersPanel = $("#o_activeOrdersPanel");
        var maxBatchNo = Math.max.apply(null, a);

        for (var id = 1; id < maxBatchNo + 2; id++) {
            var divBatchPanel = $('#b' + id);
            if (!divBatchPanel.length) {
                divBatchPanel = CreateCBatchPanel(id, 1);
                activeOrdersPanel.append(divBatchPanel);
            }
            divBatchPanel.attr("QueueNo", 1);
        }

//    a.forEach(function (id) {
//        var divBatchPanel = $('#b' + id);
//        if (!divBatchPanel.length) {
//            divBatchPanel = CreateBatchPanel(id, 1);
//            activeOrdersPanel.append(divBatchPanel);
//        }
//        divBatchPanel.attr("QueueNo", 1);
//        //divItemsPanel.effect("bounce", "slow");
//    });


        $(G.AllOrders).each(function (indx, o) {
            var divOrder = CreateOrder(o, 0);
            if (o.idBatch == null) {
                //pnlOrders.append(divOrder);
            } else {
                divOrder.appendTo($("#b" + o.idBatch + ">div.o_itemsPanel"));
            }
//        divOrder.tooltip({
//            //content: "Awesome title!"
//        });
            //}
            //pnlOrders.append(CreateOrder(order));
            //divOrder.effect( "bounce", { times: 3 }, "slow" );
            //divOrder.effect("bounce", "slow");
        });
    }
}

function CreateCBatchPanel(idBatch, QueueNo) {
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
            primary: "person"
            //secondary: "ui-icon-triangle-1-s"
        },
        text: false
    }
    );
    bAdd.css({'width': '100%', 'height': '100%'});
    //bAdd.addClass(b'ui-state-disabled');

    bAdd.click(function (event) {
        showSelectCourierDialog();
////        $(event.target).parent().
//        var pnlActiveOrders = $('#o_activeOrdersPanel');
//        pnlActiveOrders.append(CreateBatchPanel());
//        var IDs = [];
//        pnlActiveOrders.find(".o_orderBatchPanel").each(function () {
//            IDs.push($(this).attr("idBatch"));
//        });


//        updateOInterface_batches(getBatchesFromLS());
    });

    var divItemsPanel = $('<div/>', {
        //id: id,
        class: 'o_itemsPanel connectedSortable ui-state-default'
                //attr: {'idBatch': idBatch, 'QueueNo': QueueNo}
                //html:'<h3>asd</h3>'
    }).appendTo(divPanel);

    divItemsPanel.disableSelection();
    //divPanel.append(QueueNo);
    return divPanel;
}

function showSelectCourierDialog() {
    var dlg = $('#SelUser');
    if (!dlg.length) {
        sendRequest('getCouriers', '', function (data) {
            //console.log('dialog ' + id + ' found on page. items');
            console.log('couriers loaded from server:');
            console.log(data);
            dlg = CreateSelectDialog('SelUser', 'Назначение курьера', undefined, data, afterSelCourier);
            dlg.dialog("option", {width: 400, height: 200});
//$('ul.ul_selectItems').html(ArrayToLiItems(data));
            //$('#authSel').append(ArrayToOptionItems(["U1", "U2", "U3"]));
            dlg.dialog('open');
        });
    }
}

function afterSelCourier(sender) {
    //callback(ui.selected, $(ui.selected).attr("item_id"), ui.selected.innerHTML);
    //alert(ui.selected.id + " " + ui.selected.innerHTML);

    //$(sender).attr("idPerson");
    alert($(sender).text());

}


function updateCInterface_batches(batches) {
    var activeOrdersPanel = $("#o_activeOrdersPanel");
    $(batches).each(function (indx, batch) {
        var divBatchPanel = $('#b' + batch.id);
        if (!divBatchPanel.length) {
            divBatchPanel = CreateCBatchPanel(batch.id, batch.QueueNo);
            activeOrdersPanel.append(divBatchPanel);
        }
        divBatchPanel.attr("QueueNo", batch.QueueNo);
        //divItemsPanel.effect("bounce", "slow");
    });

    activeOrdersPanel.find('.o_orderBatchPanel').sort(function (a, b) {
        return $(a).attr('QueueNo') - $(b).attr('QueueNo');
    }).appendTo(activeOrdersPanel);

//create batch if no one
//    if (!activeOrdersPanel.children().length) {
//        // add batch on server
//        var dt = $.datepicker.formatDate("yy-mm-dd", $("#datepicker").datepicker('getDate'));
//        sendRequest('createBatch', 'date=' + dt, function (response) {
//            console.log(response);
//        });
//    }

}
