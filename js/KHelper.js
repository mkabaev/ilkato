function createKitchenInterface() {
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
    var orders = getOrdersFromLS().filter(function (currentValue, index, arr) {
        return currentValue.idKitchen == localStorage.wp_id && currentValue.idStatus > 1 && currentValue.idStatus < 8;//5
//1	Принят
//2	Готовить
//3	Готовится
//4	Приготовлен
//5	Доставка
//6	В пути
//7	Доставлен
//8	Отказ

    });
    updateInterface_orders(orders);
    var ov = createOrderViewer('ordViewer', 'orderViewer');
    ov.appendTo($('#workplace')).fadeIn(1000);
    $(".order").first().click();
}

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

    divModule.append(CreateTable('table' + modType, 'tProducts', headerItems, tableItems, ["", "", 123, 888]));

    var bDone = $('<button/>', {
        id: "bDone" + modType,
        class: 'doneButton',
        text: "Готово",
        click: function (event) {
            var divModule = $(this).parent();
            divModule.addClass('ui-state-disabled');
            if ($("#divR").hasClass('ui-state-disabled') && $("#divP").hasClass('ui-state-disabled')) {
                
            localStorage.removeItem("check");
            //if (localStorage.getItem("chktemplate") === null) {
            $.ajaxSetup({cache: false});
            $.get("check.html", function (data) {
                localStorage.check = data;
                //alert(data);
                //printHTML(localStorage.chktemplate, getOrderFromLS(localStorage.activeOrder));
                printHTML(data, getOrderFromLS(localStorage.activeOrder));
            });
            
            
            
                var idOrder = parseInt($('#ordViewer').attr("idOrder"));
                sendRequest('updateOrderStatus', 'idOrder=' + localStorage.activeOrder + '&idStatus=4', function (response) {
                    console.log(response);
                });
            }
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
            localStorage.removeItem("chktemplate");
            //if (localStorage.getItem("chktemplate") === null) {
            $.ajaxSetup({cache: false});
            $.get("chktemplate.html", function (data) {
                localStorage.chktemplate = data;
                //alert(data);
                //printHTML(localStorage.chktemplate, getOrderFromLS(localStorage.activeOrder));
                //printHTML(data, getOrderFromLS(localStorage.activeOrder));
                printHTML(data, getOrdersFromLS()[0]);
            });
            //} else {
            //    printHTML(localStorage.chktemplate, getOrderFromLS(localStorage.activeOrder));
            //}

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
    }).appendTo(divHeader).append('<span class="ui-icon ui-icon-person"></span>Повара').css({"float": "right", "padding": "5px"});

    return divModule;
}

function createOrderViewer(id, _class) {
    var headerItems = ["Продукт", "Кол-во", "Вес", "Цена", "T"];
    var tableItems = null;

    var divOrderViewer = $('<div/>', {
        id: id,
        class: 'ui-widget ui-widget-content ' + _class,
        //attr: {'order_id': '123', 'ts': timestamp}
    }).append('<div class="pricingPic"></div>');

    var select = $('<select/>', {
        id: "selstatus",
        name: "status",
//        class: 'ui-widget-header',
    }).append('<label for="status">Статус</label>').appendTo(divOrderViewer);

    var divHeader = $('<div/>', {
        id: "orderheader",
        class: 'ui-widget-header',
    });
    var divNumber = $('<div/>', {
        //id: "number",
    }).append("<h3>Заказ <span id=number>" + 'No' + "</span></h3>");



    divOrderViewer.append(divHeader);
    divOrderViewer.append('<div id=ordlog></div><div id=ordercomment class="comment">' + 'comment' + '</div>');

    //var tableItems2 = $.parseJSON('[{"id":"3","name":"Пицца 1","count":"2"},{"id":"10","name":"Пицца 2","count":"2"},{"id":"11","name":"Пицца 3","count":"2"},{"id":"12","name":"Пицца 4","count":"2"},{"id":"13","name":"Пицца 5","count":"2"},{"id":"17","name":"Пицца 6","count":"2"},{"id":"19","name":"Пицца 7","count":"2"},{"id":"20","name":"Пицца 8","count":"2"}]');

    divOrderViewer.append(CreateKitchenModule('R', undefined, headerItems, tableItems));
    divOrderViewer.append(CreateKitchenModule('P', undefined, headerItems, tableItems));
    divOrderViewer.append('<div id="ordlog"></div>');

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
    return divOrderViewer;
}

function updateOrderViewer(id) {
    var order = getOrderFromLS(id);
    if (order === undefined) {
        // load from server
        console.log('ord undef');
        $('#ordViewer').hide();
    } else {
        var divOrder=$('#ordViewer');
        divOrder.show();
        divOrder.children(".mk").removeClass('ui-state-disabled');
        divOrder.attr("idOrder", order.id);
        //console.log('ordViewer updating ' + order.comment);
        //$('#ordlog').html(createUL('asd',undefined,order.Log));
        $('#number').html(order.No);
        $('#ordercomment').html(order.Comment);

        $("#selstatus").val(order.idStatus - 1);
        $("#selstatus").selectmenu('refresh', true);
        if (order.Products) {
            var itemsR = order.Products.filter(function (row) {
                return row.idType === 1;
            });

            var itemsP = order.Products.filter(function (row) {
                return row.idType === 2;
            });

//TODO: check func speed
//var sum = itemsR.reduce(function(pv, cv) {return pv + cv.CoockingTime;}, 0);
            var ctR = 0;
            var totalSummR = 0;
            $.each(itemsR, function (key, val) {
                totalSummR += val.Price;
                ctR = ctR + val.CookingTime;
                //console.log("R:" + val.CookingTime);
            });

            var ctP = 0;
            var ct30cm = 0;
            var count30 = 0;

            var ct40cm = 0;
            var count40 = 0;
            var totalSummP = 0;
            $.each(itemsP, function (key, val) {
                totalSummP += val.Price;
                if (val.Name.indexOf("30 см") > -1) {
                    count30++;
                    ct30cm = Math.max(ct30cm, val.CookingTime);
                } else
                if (val.Name.indexOf("40 см") > -1) {
                    count40++;
                    ct40cm = Math.max(ct40cm, val.CookingTime);
                }
                //console.log("P:" + val.Name + " - " + val.CookingTime);
            });
            var floor30 = Math.floor(count30 / 4);
            var mod30 = count30 % 4;
            if (mod30 > 0) {
                ct30cm = ct30cm * floor30 + ct30cm;
            } else {
                ct30cm = ct30cm * floor30;
            }

            var floor40 = Math.floor(count40 / 3);
            var mod40 = count40 % 3;
            if (mod40 > 0) {
                ct40cm = ct40cm * floor40 + ct40cm;
            } else {
                ct40cm = ct40cm * floor40;
            }
            ctP = Math.max(ct30cm, ct40cm);


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
            $('#tableR tbody').html(ArrayToTableItems(itemsR));
            $('#tableR tfoot').html(ArrayToTableFooter(["", "", "", totalSummR]));
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
            $('#tableP tbody').html(ArrayToTableItems(itemsP));
            $('#tableP tfoot').html(ArrayToTableFooter(["", "", "", totalSummP]));

            if (localStorage.wp_type === "3") {//trick for operator upfateInterface
                if (localStorage.activeOrder != id) {//reset timer
                    localStorage.activeOrder = id;
                    stopTimer();
                    $("#timer").hide();
                    var ct = Math.max(ctR, ctP);
                    if (ct > 0) {
                        if (!startTimer(ct)) {
                            //createTimer('timer', 'ktimer', ct, 140).appendTo($('#workplace'));
                            createTimer('timer', 'ktimer', ct, 340).appendTo($('#workplace'));

                        }
                        $("#timer").show();
                    }
                }
            } else {
                localStorage.removeItem("activeOrder");
            }

//    $('body').append(localStorage.getItem(localStorage.key(i))); 
        } else {
            $('#tableP tbody,#tableR tbody').empty();
            console.log("ERROR: Заказ " + order.No + " не содержит продуктов");
        }

        var divOrderViewer = $("#ordViewer");
        //divOrder.find('span.CTime').text(order.CTime);
        //divOrder.find('span.DTime').text(order.DTime);

        //if (divOrder) {
        divOrderViewer.removeClass('ord-pricingType-1 ord-pricingType-2');
        divOrderViewer.addClass('ord-pricingType-' + order.idPricingType);
    }
}

function updateKInterface_SelPanel() {

    console.log("--обновляем боковую панель");
    var orders = getOrdersFromLS().filter(function (currentValue, index, arr) {
        return currentValue.idKitchen == localStorage.wp_id && currentValue.idStatus > 1 && currentValue.idStatus < 5;
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

//    var li;
//    $(orders).each(function (indx, order) {
//        var rCount = 0;
//        var pCount = 0;
//        if (order.Products !== null) {
//            rCount = order.Products.filter(function (currentValue, index, arr) {
//                return currentValue.idType == 1;
//            }).length;
//
//            pCount = order.Products.filter(function (currentValue, index, arr) {
//                return currentValue.idType == 2;
//            }).length;
//        }
//
//        li = $(items[indx]);
////        console.log('R:'+rCount);
////        console.log('P:'+pCount);
//        li.html(order.no); //'<div class="imgRoll"/>'
//        items[indx] = li;
//    });


    list.html(items);
    $(list.children('li')).addClass('ui-widget-content');

    //divDialog.attr("user_id", $(this).parent().attr("item_id"));
    list.selectable({
        //tolerance: "fit",
        selected:
                function (event, ui) {
                    updateOrderViewer($(ui.selected).attr("item_id"));
                }

    });
    $('[item_id=' + localStorage.activeOrder + ']').addClass('ui-selected');
}


//$(document).scannerDetection({
//	timeBeforeScanTest: 200, // wait for the next character for upto 200ms
//	endChar: [13], // be sure the scan is complete if key 13 (enter) is detected
//	avgTimeByChar: 40, // it's not a barcode if a character takes longer than 40ms
//	ignoreIfFocusOn: 'input', // turn off scanner detection if an input has focus
//	onComplete: function(barcode, qty){ ... }, // main callback function
//	scanButtonKeyCode: 116, // the hardware scan button acts as key 116 (F5)
//	scanButtonLongPressThreshold: 5, // assume a long press if 5 or more events come in sequence
//	onScanButtonLongPressed: showKeyPad, // callback for long pressing the scan button
//	onError: function(string){alert('Error ' + string);}
//});

$(document).scannerDetection({
    //...
    onKeyDetect: function (event) {
        console.log("key detect:" + event.which);
        //return false;
    },
    onComplete: function (barcode, qty) {
        console.log("barcode:" + barcode);
        console.log("qty:" + qty);
//    //2200003014129 roll
//    //2200001012985 pizza
//    if (inp.val().length == 13) {
//        var s = inp.val();
//        var type = s.substr(1, 6);
//        var weight = s.substr(7, 5);
//        weight = parseInt(weight);
//        switch (type) {
//            case "200003": //roll
//                //var inttt=parseInt(weight);
//
//                //$('#tProducts').append('<tr><td>my data</td><td>more data</td></tr>');
//                //items.push("<tr id='" + val.product_id + "'><td>" + val.name + "</td><td id='scanp'>" + val.count + "</td><td>" + val.price + "</td></tr>");
//
//                weightR = weight / 1000;
//                $("#scanr").text(weightR);
//                //$("#scanr").attr('weight', weightP);
//                break;
//            case "200001":
//                weightP = weight / 1000;
//                $("#scanp").text(weightP);
//                //$("#scanp").attr('weight', weightR);
//                break;
//        }
//        inp.val("");
//        //$("#weight").text((weightP + weightR));
//        SetOrderProductsOnServer($("#dlgEdit").attr("order_id"), weightR, weightP);
//    }
    }
    //...
});

//$(document).on('pageshow', '#pageId', function(){
//	$(document).scannerDetection({
//		avgTimeByChar: 40,
//		onComplete: function(barcode, qty){ ... },
//		onError: function(string){alert('Error ' + string);}
//	});
//});
//$(document).on('pagehide', '#pageId', function(){
//	$(document).scannerDetection(false);
//});