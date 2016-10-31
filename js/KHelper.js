function createKitchenInterface() {
    //var tableItems = $.parseJSON(localStorage.products);
    var ov = createOrderViewer('ordViewer', 'orderViewer');
    ov.appendTo($('#workplace')).fadeIn(1000);

    //$('body').append(CreateLeftPanel());


    var selPanel = createSelectPanel('p1', 'selPanel', undefined, afterSelTest).appendTo('#workplace');

    var divFooter = $('<div/>', {
        id: 'footer',
        //class: _class,
        attr: {'title': 'caption'}
    }).appendTo($('#ordViewer'));
    updateKInterface_SelPanel();
    localStorage.activeOrder = $("#p1").find("li").first().attr("item_id");
    updateKInterface_SelPanel();
    updateOrderViewer(localStorage.activeOrder);
}


function afterSelTest(id, name) {
    //var ov=$('#ordViewer');
    //stopTimer();
    updateOrderViewer(id);
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
            localStorage.removeItem("chktemplate");
            if (localStorage.getItem("chktemplate") === null) {
                $.get("chktemplate.html", function (data) {
                    localStorage.chktemplate = data;
                    printHTML(localStorage.chktemplate, getOrderFromLS(localStorage.activeOrder));
                });
            } else {
                printHTML(localStorage.chktemplate, getOrderFromLS(localStorage.activeOrder));

            }

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
    var headerItems = ["Продукт", "Кол-во", "Вес", "Цена"];
    var tableItems = null;

    var divOrderViewer = $('<div/>', {
        id: id,
        class: 'ui-widget ui-widget-content ' + _class,
        //attr: {'order_id': '123', 'ts': timestamp}
    }).append('<div class="pricingPic"></div>');

    var divHeader = $('<div/>', {
        id: "orderheader",
        class: 'ui-widget-header',
    });
    var divNumber = $('<div/>', {
        //id: "number",
    }).append("<h3>Заказ <span id=number>" + 'No' + "</span></h3>");

    divHeader.append(divNumber);
    divOrderViewer.append(divHeader);
    divOrderViewer.append('<div id=ordlog></div><div id=ordercomment class="comment">' + 'comment' + '</div>');

    //var tableItems2 = $.parseJSON('[{"id":"3","name":"Пицца 1","count":"2"},{"id":"10","name":"Пицца 2","count":"2"},{"id":"11","name":"Пицца 3","count":"2"},{"id":"12","name":"Пицца 4","count":"2"},{"id":"13","name":"Пицца 5","count":"2"},{"id":"17","name":"Пицца 6","count":"2"},{"id":"19","name":"Пицца 7","count":"2"},{"id":"20","name":"Пицца 8","count":"2"}]');

    divOrderViewer.append(CreateKitchenModule('R', undefined, headerItems, tableItems));
    divOrderViewer.append(CreateKitchenModule('P', undefined, headerItems, tableItems));
    divOrderViewer.append('<div id="ordlog"></div>');
    return divOrderViewer;
}

function updateOrderViewer(id) {
    var order = getOrderFromLS(id);
    if (order === undefined) {
        // load from server
        console.log('ord undef');
    } else {
        //console.log('ordViewer updating ' + order.comment);
        //$('#ordlog').html(createUL('asd',undefined,order.Log));
        $('#number').html(order.No);
        $('#ordercomment').html(order.Comment);

        if (order.Products) {
            var itemsR = order.Products.filter(function (row) {
                return row.idType === 1;
            });

            var itemsP = order.Products.filter(function (row) {
                return row.idType === 2;
            });

            var ctR = 0;
            $.each(itemsR, function (key, val) {
                ctR = ctR + val.CookingTime;
                console.log("R:" + val.CookingTime);
            });

            var ctP = 0;
            $.each(itemsP, function (key, val) {
                ctP = ctP + val.CookingTime;
                console.log("P:" + val.CookingTime);
            });

            itemsR = itemsR.map(function (oldItem) {
                var newItem = {};
                newItem.id = oldItem.id;
                newItem.Name = oldItem.Name;
                newItem.Count = oldItem.Count;
                newItem.Weight = oldItem.Weight;
                newItem.Price = oldItem.Price;

                return newItem;
            });
            $('#tableR tbody').html(ArrayToTableItems(itemsR));
            itemsP = itemsP.map(function (oldItem) {
                var newItem = {};
                newItem.id = oldItem.id;
                newItem.Name = oldItem.Name;
                newItem.Count = oldItem.Count;
                newItem.Weight = oldItem.Weight;
                newItem.Price = oldItem.Price;

                return newItem;
            });
            $('#tableP tbody').html(ArrayToTableItems(itemsP));

            if (localStorage.wp_type === "3") {//trick for operator upfateInterface
                if (localStorage.activeOrder != id) {//reset timer
                    localStorage.activeOrder = id;
                    stopTimer();
                    var ct = Math.max(ctR, ctP);
                    if (ct > 0) {
                        if (!startTimer(ct)) {
                            //createTimer('timer', 'ktimer', ct, 140).appendTo($('#workplace'));
                            createTimer('timer', 'ktimer', ct, 340).appendTo($('#workplace'));
                        }
                    }
                }
            } else {
                localStorage.removeItem("activeOrder");
            }

//    $('body').append(localStorage.getItem(localStorage.key(i))); 
        } else {
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

    console.log("--загружаем из LS заказы со статусом Готовить, Готовится, Приготовлен");
    var orders = getOrdersFromLS().filter(function (currentValue, index, arr) {
        return currentValue.idStatus > 1 && currentValue.idStatus < 8;
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


//function ProcessScanner()
//{
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
//}


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
	onKeyDetect: function(event){console.log(event.which); return false;}
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