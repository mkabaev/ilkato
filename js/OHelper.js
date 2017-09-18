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
        }
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
    /////////////////var batches = getBatchesFromLS();
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
            sendRequest('updateOrderIdBatchAndIdStatus', 'idOrder=' + idOrder + '&idStatus=1&idBatch=' + idBatch, function (data) {
                console.log(data);
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
//    topwidget.append('Дата: <input type="text" id="datepicker"/>');
    topwidget.addClass("ui-widget ui-widget-content ui-corner-bottom");


    //localStorage.dates = ["25.10.2016", "26.10.2016", "29.10.2016"]

//    $("#datepicker").datepicker({
//        //showOn: "button",
//        //buttonImage: "images/calendar.gif",
//        //buttonImageOnly: true,
//        //buttonText: "Select date"
//        //minDate: -1,
//        //maxDate: "+1M +10D",
//        //maxDate: +3,
//        //dateFormat: "yy-mm-dd",
////        beforeShowDay: function (date) {
////            var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
////            //var string = jQuery.datepicker.formatDate('dd.mm.yy', date);
////            return [localStorage.dates.indexOf(string) != -1]
////        },
//        onSelect: function () {
//            var dt = $.datepicker.formatDate("yy-mm-dd", $(this).datepicker('getDate'));
//            selectDate(dt);
//        }
//    });

//    var fs = $('<fieldset/>', {
//        class: 'o-filter-rg'
//    });
//
//    topwidget.append(fs);
//
//    //fs.append('<legend>Фильтр: </legend>');
//    fs.append('<label for="chkP">Печерская</label>');
//    fs.append('<input type="checkbox" name="chkP" id="chkP" item_id=3 checked>');
//    fs.append('<label for="chkNS">Ново-Садовая</label>');
//    fs.append('<input type="checkbox" name="chkNS" id="chkNS" item_id=4 checked>');
//    fs.children('input').checkboxradio({
//        icon: false,
//    });
////    fs.children('input').prop('checked', true);
//
//    fs.children('input').on("change", function (e) {
//        var target = $(e.target);
//        var id = target.attr("item_id");
//        if (target.is(":checked")) {
//            $('.order[idKitchen=' + id + ']').show();
//        } else {
//            $('.order[idKitchen=' + id + ']').hide();
//        }
//
////        alert(target.attr("id"));
//    });

    var bAdd = $("<button/>", {
        //type: 'checkbox',
        id: 'bCreateOrder',
        //name: 'n' + order.id
        //class: 'orderDoneButton'
    }).appendTo($("#topwidget"));

    var bAddSXL = $("<button/>", {
        //type: 'checkbox',
        id: 'bCreateSXLOrder',
        //name: 'n' + order.id
        //class: 'orderDoneButton'
    }).appendTo($("#topwidget"));

    bAdd.button({
        icon: "ui-icon-plus",
//        iconPosition: "bottom",
//        icons: {
//            primary: "ui-icon-plus",
//            //secondary: "ui-icon-triangle-1-s"
//        },
        //text: 'false'
        label: 'ILKato'
    }
    );
//    bAdd.css({'width': '25px', 'height': '25px', })
    bAddSXL.button({
        icon: "ui-icon-plus",
        label: 'XL Суши'
    }
    );

    bAdd.click(function (event) {
////        $(event.target).parent().
//        var pnlActiveOrders = $('#o_activeOrdersPanel');
//        pnlActiveOrders.append(CreateBatchPanel());
//        var IDs = [];
//        pnlActiveOrders.find(".o_orderBatchPanel").each(function () {
//            IDs.push($(this).attr("idBatch"));
//        });
        showOrderEditor({idPricingType: 1});
//        sendRequest('getUsers', '', function (data) {
//            console.log(data);
//        });
//        var dt = $.datepicker.formatDate("yy-mm-dd", $("#datepicker").datepicker('getDate'));
        //      sendRequest('createBatch', 'date=' + dt, function (response) {
        //        console.log(response);
        //  });

        ////updateOInterface_batches(getBatchesFromLS()); ?
    });
    bAddSXL.click(function (event) {
        showOrderEditor({idPricingType: 2});
    });

//    if (localStorage.getItem("activeDate") === null || localStorage.getItem("activeDate") === "") {
//        $("#datepicker").datepicker("setDate", new Date());
//    } else {
//        $("#datepicker").datepicker("setDate", new Date(localStorage.activeDate));
//    }
//    var dt = $.datepicker.formatDate("yy-mm-dd", $("#datepicker").datepicker('getDate'));
//    selectDate(dt);    
    updateOInterface();
    /////////////////updateOInterface_batches(batches);
}

function updateOInterface() {

    //$.each(localStorage, function (key, value) {
    //    if (key.startsWith('o_') | key.startsWith('b_')) {
    //        localStorage.removeItem(key);
    //    }
    //});

    $("#o_activeOrdersPanel").empty();//right panel
    //updateOInterface_batches(data.batches);

    var pnlOrders = $("#o_ordersPanel");
    pnlOrders.empty();//left panel

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
    if (G.AllOrders !== null) {
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

        for (var id = 1; id < 8; id++) {
            var divBatchPanel = $('#b' + id);
            if (!divBatchPanel.length) {
                divBatchPanel = CreateBatchPanel(id, 1);
                activeOrdersPanel.append(divBatchPanel);
            }
            divBatchPanel.attr("QueueNo", 1);
        }

//        for (var id = 1; id < maxBatchNo + 2; id++) {
//            var divBatchPanel = $('#b' + id);
//            if (!divBatchPanel.length) {
//                divBatchPanel = CreateBatchPanel(id, 1);
//                activeOrdersPanel.append(divBatchPanel);
//            }
//            divBatchPanel.attr("QueueNo", 1);
//        }
        //    
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
            $("<div/>")
                    .orderPanel({order: o})
                    .appendTo(o.idBatch === null ? pnlOrders : $("#b" + o.idBatch + ">div.o_itemsPanel"))
                    .dblclick(function (a) {
                        //showOrderEditor($(a.currentTarget));
                        showOrderEditor(o);
                    });
            //}
            //pnlOrders.append(CreateOrder(order));
            //divOrder.effect( "bounce", { times: 3 }, "slow" );
            //divOrder.effect("bounce", "slow");
        });
    }
}


//function mapUpdate(lat, lon, zoom) { //address - адрес или lat,lon в текстовом виде
////    if (address) {//&& map_created
////        var geocode = ymaps.geocode(address);
////        geocode.then(function (res) {
////            map.geoObjects.each(function (geoObject) {
////                map.geoObjects.remove(geoObject);
////            });
////
////            var position = res.geoObjects.get(0).geometry.getCoordinates(),
////                    placemark = new ymaps.Placemark(position, {}, {});
////
////            map.geoObjects.add(placemark);
////            map.setCenter(position, zoom);
////        });
////    }
//    var lonLat = new OpenLayers.LonLat(lon, lat)
//            .transform(
//                    new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
//                    map.getProjectionObject() // to Spherical Mercator Projection
//                    );
//
//    markers.addMarker(new OpenLayers.Marker(lonLat));
//
//    map.setCenter(lonLat, zoom);
//}

function CreateBatchPanel(idBatch, QueueNo) {
    var divPanel = $('<div/>', {
        id: 'b' + idBatch,
        class: 'o_orderBatchPanel',
        attr: {'idBatch': idBatch, 'QueueNo': QueueNo}
        //html:'<div class="o_orderBatchPanelButtons">asd</div>'
    });

    var divItemsPanel = $('<div/>', {
        //id: id,
        class: 'o_itemsPanel connectedSortable ui-widget ui-state-default',
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
            //TODO: chage status to 3
            sendRequest('updateOrderIdBatchAndIdStatus', 'idOrder=' + idOrder + '&idStatus=2&idBatch=' + idBatch, function (response) {
                console.log(response);
            });

            if ($(".o_itemsPanel:empty").length === 0) { //if no empty batches then create one
                var activeOrdersPanel = $("#o_activeOrdersPanel");
                //activeOrdersPanel.append(CreateBatchPanel());
//                var dt = $.datepicker.formatDate("yy-mm-dd", $("#datepicker").datepicker('getDate'));
//                sendRequest('createBatch', 'date=' + dt, function (response) {
//                    console.log(response);
//                });
            }
        }
    }).disableSelection();
    //divPanel.append(QueueNo);

    var divButtonsPanel = $('<div/>', {
        //id: panel_id,
        class: 'o_orderBatchPanelButtons'
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
            primary: "ui-icon-play",
            //secondary: "ui-icon-triangle-1-s"
        },
        text: false
    }
    );
    bAdd.css({'width': '10px', 'height': '10px', });
    //bAdd.addClass('ui-state-disabled');

    bAdd.click(function (event) {
////        $(event.target).parent().
//        var pnlActiveOrders = $('#o_activeOrdersPanel');
//        pnlActiveOrders.append(CreateBatchPanel());
//        var IDs = [];
//        pnlActiveOrders.find(".o_orderBatchPanel").each(function () {
//            IDs.push($(this).attr("idBatch"));
//        });

//        var dt = $.datepicker.formatDate("yy-mm-dd", $("#datepicker").datepicker('getDate'));
//        sendRequest('createBatch', 'date=' + dt, function (response) {
//            console.log(response);
//        });
//
//        updateOInterface_batches(getBatchesFromLS());
    });

    return divPanel;
}

function updateOInterface_order(o) {
    var pnlOrders = $('#o_ordersPanel');
    var divOrder = $('#' + o.id);
    if (!divOrder.length) { //new order
        $("<div/>")
                .orderPanel({order: o})
                .appendTo(o.idBatch === null ? pnlOrders : $("#b" + o.idBatch + ">div.o_itemsPanel"))
                .dblclick(function () {
                    showOrderEditor(o);
                });
    } else {// update existing
        divOrder.orderPanel({order: o});
        //todo if idbatch changed
    }
    divOrder.effect("pulsate", "slow");
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

////create batch if no one
//    if (!activeOrdersPanel.children().length) {
//        // add batch on server
//        var dt = $.datepicker.formatDate("yy-mm-dd", $("#datepicker").datepicker('getDate'));
//        sendRequest('createBatch', 'date=' + dt, function (response) {
//            console.log(response);
//        });
//    }

}
