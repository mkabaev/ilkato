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
            selectDate(dt);
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

        sendRequest('getUsers', '', function (data) {
            console.log(data);
        });
//        var dt = $.datepicker.formatDate("yy-mm-dd", $("#datepicker").datepicker('getDate'));
        //      sendRequest('createBatch', 'date=' + dt, function (response) {
        //        console.log(response);
        //  });

        ////updateOInterface_batches(getBatchesFromLS()); ?
    });

    if (localStorage.getItem("activeDate") === null || localStorage.getItem("activeDate") === "") {
        $("#datepicker").datepicker("setDate", new Date());
    } else {
        $("#datepicker").datepicker("setDate", new Date(localStorage.activeDate));
    }
    var dt = $.datepicker.formatDate("yy-mm-dd", $("#datepicker").datepicker('getDate'));
    selectDate(dt);
    /////////////////updateOInterface_batches(batches);

}

function selectDate(date) {
    localStorage.activeDate = date;
    sendRequest('getOrdersAndBatches', 'date=' + date, function (data) {
        //$.each(localStorage, function (key, value) {
        //    if (key.startsWith('o_') | key.startsWith('b_')) {
        //        localStorage.removeItem(key);
        //    }
        //});

        //save orders to LS
        //localStorage.id_session = data.id_session;
        setItemsToLS('o_', data.orders);
        setItemsToLS('b_', data.batches);
        $("#o_activeOrdersPanel").empty();//right panel
        updateOInterface_batches(data.batches);
        var pnlOrders = $("#o_ordersPanel");
        pnlOrders.empty();//left panel
        console.log("sorted orders:");
        var orders = data.orders;//getOrdersFromLS();
        orders = orders.filter(function (currentValue, index, arr) {
            return currentValue.DDate === localStorage.activeDate;
        });
        orders = $(orders).sort(function (a, b) {
            var tt = a.DTime.split(":");
            var secA = tt[0] * 3600 + tt[1] * 60;
            tt = b.DTime.split(":");
            var secB = tt[0] * 3600 + tt[1] * 60;
            return secA - secB;
        });
        console.log(orders);

        //var dt = $.datepicker.formatDate("yy-mm-dd", $("#datepicker").datepicker('getDate'));
        //if (localStorage.activeDate !== dt) {
        //    //$('#o_ordersPanel, .o_itemsPanel').empty();
        //}

        $(orders).each(function (indx, order) {
            var divOrder = CreateOrder(order, 1);

            if (order.idBatch != null) {
                divOrder.appendTo($("#b" + order.idBatch + ">div.o_itemsPanel"));
            } else {
                pnlOrders.append(divOrder);
            }
//        divOrder.tooltip({
//            //content: "Awesome title!"
//        });
            //}
            //pnlOrders.append(CreateOrder(order));
            //divOrder.effect( "bounce", { times: 3 }, "slow" );
            //divOrder.effect("bounce", "slow");
        });
    });
//            $.ajax({
//                type: "POST",
//                data: "action=getOrdersAndBatches&date=" + dt,
//                url: "helper.php?",
//                cache: false,
//                success: function (jsondata) {
//                    $("body").removeClass("ui-state-error");
//                    // remove orders from LS
//                    $.each(localStorage, function (key, value) {
//                        if (key.startsWith('o_') | key.startsWith('b_')) {
//                            localStorage.removeItem(key);
//                        }
//                    });
//
//                    //save orders to LS
//                    var data = JSON.parse(jsondata);
//                    localStorage.id_session = data.id_session;
//                    setItemsToLS('o_', data.orders);
//                    setItemsToLS('b_', data.batches);
//                    $("#o_activeOrdersPanel").empty();
//                    updateOInterface_batches(data.batches);
//                    updateInterface_orders(data.orders);
//
//                },
//                error: function (xhr, ajaxOptions, thrownError) {
//                    $("body").addClass("ui-state-error");
//                    alert("Сервер не доступен: " + xhr.status + " | " + thrownError);
//                    //$("body").addClass("ui-state-error");
////            alert(xhr.status);
////            alert(thrownError);
//                }
//            });
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
        attr: {'idKitchen': order.idKitchen, 'idBatch': order.idBatch}
    });
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

    //var dt = new Date(order.CreateDate)
    var divTime = $('<div/>', {
        class: 'time',
        //dt.getHours()+':'+dt.getMinutes() 
        //html: 'Принят в <span class="CTime">' + order.CTime + '</span><br/>Доставить к <span class="DTime">' + order.DTime + '</span><br/>'//order_time
        //html: 'Принят в <span class="startTime">' + dt.toLocaleTimeString() + '</span><br/>Готов в <span class="stopTime">' + "" + '</span><br/><br/><span class="status">' + order.idStatus + '</span>'//order_time
    });
    var coockingTime = Math.max(calcCoockingTime(order.Products, 1), calcCoockingTime(order.Products, 2));
    divTime.append('<span class="status">' + idStatusToString(order.idStatus) + '</span>');
    divTime.append('<br/><br/>Время на заказ <span class="DTime">' + coockingTime.toHHMMSS() + '</span>');
    divTime.append('<br/>Доставить к <span class="DTime">' + order.DTime + '</span>');

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
            //if (divOrder.attr("id") != order.id) {
            updateOrderViewer(order.id);
            $(".order").removeClass('selected');
            divOrder.addClass('selected');
            //TODO START TIMER?
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
        sendRequest('updateOrderKithcenID', 'idOrder=' + idOrder + '&idKitchen=' + idKitchen, function (data) {
            console.log("resul:");
            console.log(data);
            var order = JSON.parse(localStorage.getItem('o_' + idOrder));
            order.idKitchen = $(this).parent().parent().parent().attr('idKitchen');
            localStorage['o_' + idOrder] = JSON.stringify(order);
            //console.log('DONE');
//            updateInterface_orders([getOrderFromLS(idOrder)]);
        });

    });

//    var rCount = 0;
//    var pCount = 0;
//    if (order.Products !== null) {
//        rCount = order.Products.filter(function (currentValue, index, arr) {
//            return currentValue.idType == 1;
//        }).length;
//
//        pCount = order.Products.filter(function (currentValue, index, arr) {
//            return currentValue.idType == 2;
//        }).length;
//    }


    var log = '';
    $(order.Log).each(function (index) {
        //log += (new Date(this.ts)).toLocaleTimeString() + ": "+this.idStatus+'\n';
        log += this.ts.substr(11, 5) + ": " + idStatusToString(this.idStatus) + '\n';
    });
    divOrder.attr('title', log);

    divOrder.addClass('ord-workplace-' + order.idKitchen);

    divOrder.addClass('ord-status-' + order.idStatus);


    divOrder.append(divOrderHeader);
    divOrder.append(divOrderContent);
    return divOrder;
}

function mapUpdate(address, zoom) {
    if (address) {//&& map_created
        var geocode = ymaps.geocode(address);
        geocode.then(function (res) {
            map.geoObjects.each(function (geoObject) {
                map.geoObjects.remove(geoObject);
            });

            var position = res.geoObjects.get(0).geometry.getCoordinates(),
                    placemark = new ymaps.Placemark(position, {}, {});

            map.geoObjects.add(placemark);
            map.setCenter(position, zoom);
        });
    }
}

var clientsCache = [];
//var map = null,
//        map_created = false;
function createOrderEditor(order) {
    var headerItems = ["Продукт", "Кол-во", "Вес", "Цена", "T"];
    var tableItems = null;
    var footerItems = null;

    if (order.Products) {
        var itemsR = order.Products.filter(function (row) {
            return row.idType === 1;
        });
        var itemsP = order.Products.filter(function (row) {
            return row.idType === 2;
        });
        var coockingTimeR = calcCoockingTime(itemsR, 1);
        var coockingTimeP = calcCoockingTime(itemsP, 2);
//TODO: check func speed
//var sum = itemsR.reduce(function(pv, cv) {return pv + cv.CoockingTime;}, 0);
        var totalSummR = 0;
        var totalWeightR = 0;
        $.each(itemsR, function (key, val) {
            totalSummR += val.Price;
            totalWeightR += val.Weight;
        });
        var totalSummP = 0;
        var totalWeightP = 0;
        $.each(itemsP, function (key, val) {
            totalSummP += val.Price;
            totalWeightP += val.Weight;
        });

        itemsR = itemsR.map(function (oldItem) {
            var newItem = {};
            newItem.id = oldItem.id;
            newItem.Name = oldItem.Name;
            newItem.Count = oldItem.Count;
            newItem.Weight = oldItem.Weight;
            newItem.Price = oldItem.Price;
            newItem.Time = oldItem.CookingTime;
            return newItem;
        });

        tableItems = order.Products.map(function (oldItem) {
            var newItem = {};
            newItem.id = oldItem.id;
            newItem.Name = oldItem.Name;
            newItem.Count = oldItem.Count;
            newItem.Weight = oldItem.Weight;
            newItem.Price = oldItem.Price;
            newItem.Time = oldItem.CookingTime;
            return newItem;
        });

        itemsP = itemsP.map(function (oldItem) {
            var newItem = {};
            newItem.id = oldItem.id;
            newItem.Name = oldItem.Name;
            newItem.Count = oldItem.Count;
            newItem.Weight = oldItem.Weight;
            newItem.Price = oldItem.Price;
            newItem.Time = oldItem.CookingTime;
            return newItem;
        });
        //$('#tableP tbody').html(ArrayToTableItems(itemsP));
        //$('#tableP tfoot').html(ArrayToTableFooter(["", "Всего", totalWeightP, totalSummP]));
        footerItems = ["", "Всего", totalWeightP, totalSummP];
    }

    var div = $('<div/>', {
        id: "o_ordEdit",
        //class: 'ui-widget ui-widget-content',
        //attr: {'order_id': '123', 'ts': timestamp}
    }).append('<div class="pricingPic"></div>');

//    var fs = $('<fieldset/>', {
//        //id: "cgClient",
//        //class: 'ui-widget ui-widget-content',
//        //class: 'controlgroup',
////attr: {'order_id': '123', 'ts': timestamp}
//    }).append('<legend>Клиент</legend>').appendTo(div);

    var cgClient = $('<div/>', {class: 'ui-widget ui-widget-content controlgroup'}).appendTo(div);
    cgClient.append('+7<input id="phone" placeholder="Телефон">');
    cgClient.append('<input id="name" placeholder="Имя">');
    cgClient.append('<input id="address" name="address" type="text" placeholder="Адрес">');
    cgClient.append('<input id="kv" placeholder="кв.">');
    cgClient.append('<input id="et" placeholder="этаж">');
    cgClient.append('<input id="info" placeholder="Доп. инфориация">');
    cgClient.append('<div id="map" class="panel-map"></div>');
    var $address = cgClient.find('#address');
    $address.suggestions({
        serviceUrl: "https://suggestions.dadata.ru/suggestions/api/4_1/rs",
        token: "eab53cb4ce6873e6346bd24d131331c637ca23bf",
        type: "ADDRESS",
        constraints: {
            label: "Самара",
            // ограничиваем поиск Новосибирском
            locations: {
                region: "Самарская",
                city: "Самара"
            },
            // даем пользователю возможность снять ограничение
            deletable: false
        },
        // в списке подсказок не показываем область и город
        restrict_value: true,
        //count: 5,
        /* Вызывается, когда пользователь выбирает одну из подсказок */
        onSelect: function (suggestion) {
            console.log(suggestion);
            mapUpdate(suggestion.value, 16);
        }
    });

    ymaps.ready(function () {
        map = new ymaps.Map('map', {
            center: [53.204552, 50.224026],
            zoom: 12,
            controls: []
        }, {
            //searchControlProvider: 'yandex#search'
        });

        map.geoObjects.add(new ymaps.Placemark([53.188384, 50.141830], {
            balloonContent: 'клиент <strong>вип</strong>'
        }, {
            preset: 'islands#icon',
            iconColor: '#0095b6'
        }));

// Создаем геообъект с типом геометрии "Точка".
        ILKatoGeoObject = new ymaps.GeoObject({
            // Описание геометрии.
            geometry: {
                type: "Point",
                coordinates: [53.204552, 50.224026]
            },
            // Свойства.
            properties: {
                // Контент метки.
                iconContent: 'IL-Kato',
                hintContent: 'наша кухня'
            }
        }, {
            // Опции.
            // Иконка метки будет растягиваться под размер ее содержимого.
            preset: 'islands#blackStretchyIcon',
            // Метку можно перемещать.
            //draggable: true
        });
        map.geoObjects.add(ILKatoGeoObject);

    });
//    ymaps.ready(function () {
////        if (map_created)
////           return;
////        map_created = true;
//        map = new ymaps.Map('map', {
//            center: [55.76, 37.64],
//            zoom: 12,
//            controls: []
//        });
//        map.controls.add('zoomControl', {
//            position: {
//                right: 10,
//                top: 10
//            }
//        });
//        mapUpdate('г.Самара', 12);
//    });
//    div.find("#phone").autocomplete({
//        source: clientsCache
//    });
    cgClient.find("#phone").autocomplete({
        minLength: 4,
//       source: clientsCache,
        source: function (request, response) {
            var term = request.term;
            if (term in clientsCache) {
                console.log("from cache");
                response(clientsCache[term]);
                return;
            }
            $.getJSON("search.php?s=clients", request, function (data, status, xhr) {
                clientsCache[term] = data;
                console.log("from server:");
                console.log(data);
                response(data);
            });
        },
        focus: function (event, ui) {
            console.log(ui.item.idPerson);
            //return false;
        },
        select: function (event, ui) {
            console.log(ui.item);
            $("#name").val(ui.item.idClient);
            //return false;
        }
    });

    var cgOrder = $('<div/>', {class: 'ui-widget controlgroup'}).appendTo(div);
    cgOrder.css("width", 560);
    cgOrder.append('<div id="ordlog"></div>');
    var select = $('<select/>', {
        id: "selstatus",
        name: "status",
//        class: 'ui-widget-header',
    }).append('<label for="status">Статус</label>');
    cgOrder.append(select);
    cgOrder.append('<input type="text" name="comment" id="comment" value="' + order.Comment + '" placeholder="Комментарий" >');
    cgOrder.append('<label for="insurance">Савмовывоз</label><input type="checkbox" name="insurance" id="insurance">');
    //cgOrder.append('<label for="horizontal-spinner" class="ui-controlgroup-label"> of cars</label><input id="horizontal-spinner" class="ui-spinner-input">');
    cgOrder.append('<label for="rP">Печерская</label><input type="radio" name="chkPlace" id="rP">');
    cgOrder.append('<label for="rNS">Ново-Садовая</label><input type="radio" name="chkPlace" id="rNS">');
    //cgOrder.append('<button>Тынц</button>');

    var tProducts = CreateTable('table', 'tProducts0', headerItems, tableItems, footerItems);//["", "", 123, 888]
    $('#table').filterTable({
        inputSelector: '#name'
    });
    cgOrder.append(tProducts);
//$('#table tbody').html(ArrayToTableItems(itemsAll));
    //$('#table tfoot').html(ArrayToTableFooter(["", "Всего", totalWeightR, totalSummR]));




//    var divHeader = $('<div/>', {
//        id: "orderheader",
//        class: 'ui-widget-header',
//    });
//    var divNumber = $('<div/>', {
//        //id: "number",
//    }).append("<h3>Заказ <span id=number>" + 'No' + "</span></h3>");
//    div.append(divHeader);

    //var tableItems2 = $.parseJSON('[{"id":"3","name":"Пицца 1","count":"2"},{"id":"10","name":"Пицца 2","count":"2"},{"id":"11","name":"Пицца 3","count":"2"},{"id":"12","name":"Пицца 4","count":"2"},{"id":"13","name":"Пицца 5","count":"2"},{"id":"17","name":"Пицца 6","count":"2"},{"id":"19","name":"Пицца 7","count":"2"},{"id":"20","name":"Пицца 8","count":"2"}]');


    select.append(ArrayToOptionItems(["Принят", "Готовить", "Готовится", "Приготовлен", "Доставка", "В пути", "Доставлен", "Отказ"]));
    //or like this: [{id:1,Name:"Принят"},"Готовить","Готовится","Приготовлен"]

    $(select).selectmenu({
//        create: function (event, ui) {
////            $('.ui-selectmenu-menu').css({'height': '100px', 'overflow': 'auto'});
//            $('.ui-selectmenu-menu').css({'z-index': '10000000'});
//        },
//        open: function (event, ui)
//        {
//            $('.ui-selectmenu-menu').zIndex($(‘#dialog’).zIndex() + 1);
//        },
        width: 140,
//        position: {
//            my: "left+10 top",
//            at: "left top+20"
//        },
        change: function (event, ui) {
            var idOrder = parseInt($('#ordViewer').attr("idOrder"));
            var idStatus = parseInt($(this).val()) + 1;
            sendRequest('updateOrderStatus', 'idOrder=' + idOrder + '&idStatus=' + idStatus, function (response) {
                console.log(response);
            });
        }
    });

    cgClient.controlgroup({
        "direction": "vertical"
    });
    cgOrder.controlgroup({
        //"direction": "vertical"
    });
    return div;
}

function showOrderDialog(order) {

    //var dlgV=$('#dlgV');
    //if (!dlgV.length) {
    var dlgV = CreateDialog('dlgV', 'Заказ ' + order.No, 'o_orderViewerDlg');
    //dlgV.dialog( "option", "resizable", true );
    dlgV.dialog("option", "height", 600);
    dlgV.dialog("option", "width", 1100);
    console.log(order);
    var ov = createOrderEditor(order);
    //ov.addClass('ul_selec');
    dlgV.append(ov.fadeIn(1000));

    //}
//    updateOrderViewer(order.id);
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
            //TODO: chage status to 3
            sendRequest('updateOrderIdBatchAndIdStatus', 'idOrder=' + idOrder + '&idStatus=2&idBatch=' + idBatch, function (response) {
                console.log(response);
            });

            if ($(".o_itemsPanel:empty").length === 0) { //if no empty batches then create one
                var dt = $.datepicker.formatDate("yy-mm-dd", $("#datepicker").datepicker('getDate'));
                sendRequest('createBatch', 'date=' + dt, function (response) {
                    console.log(response);
                });
            }
        }
    }).disableSelection();
    //divPanel.append(QueueNo);
    return divPanel;
}

function updateInterface_order(order) {
    var ordersPanel = $('#o_ordersPanel');
    var divOrder = $('#' + order.id);

    switch (localStorage.wp_type) {
        case "2"://O
            if (!divOrder.length) { //new order
                divOrder = CreateOrder(order, 1);
                if (order.idBatch != null) {
                    divOrder.appendTo($("#b" + order.idBatch + ">div.o_itemsPanel"));
                } else {
                    ordersPanel.append(divOrder);
                }
            } else {// update existing
                if (order.idBatch != divOrder.attr("idBatch")) {
                    divOrder.appendTo($("#b" + order.idBatch + ">div.o_itemsPanel"));
                }
                divOrder.replaceWith(CreateOrder(order, 1));
                //todo if idbatch changed

//                if (order.idBatch != null) {
//                    divOrder.appendTo($("#b" + order.idBatch + ">div.o_itemsPanel"));
//                } else {
//                    divOrder.replaceWith(CreateOrder(order, 1));
//                    //ordersPanel.append(divOrder);
//                }
            }

            break;
        case "3"://K
            if (!divOrder.length) {
                divOrder = CreateOrder(order);
                ordersPanel.append(divOrder);
            }//TODO сделать чтоб добавлялся только заказ с нужным idBatch
            divOrder.replaceWith(CreateOrder(order));
            break;
    }
//    if (localStorage.wp_type === "2") {//O
//        var dt = $.datepicker.formatDate("yy-mm-dd", $("#datepicker").datepicker('getDate'));
//        if (localStorage.activeDate !== dt) {
//            //$('#o_ordersPanel, .o_itemsPanel').empty();
//        }
//    }


    var log = '';
    $(order.Log).each(function (index) {
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


    divOrder.find("span.status").text(idStatusToString(order.idStatus));

    divOrder.effect("bounce", "slow");

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