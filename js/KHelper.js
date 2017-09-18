function createKitchenInterface() {
    var pnlOrders = $('<div/>', {
        id: 'o_ordersPanel',
        class: 'connectedSortable',
        //attr: {'title': 'caption'}
    });
    pnlOrders.appendTo($('#workplace'));

//    console.log("sorted orders:");
//    orders = $(orders).sort(function (a, b) {
//        var tt = a.DTime.split(":");
//        var secA = tt[0] * 3600 + tt[1] * 60;
//
//        tt = b.DTime.split(":");
//        var secB = tt[0] * 3600 + tt[1] * 60;
//
//        return secA - secB;
//    });
//    console.log(orders);
    if (G.AllOrders !== null) {
        //find idBatch for cooking
        var idBatch = null;
        $(G.AllOrders).each(function (indx, order) {
            if (order.idStatus === 2 || order.idStatus === 3) { //готовить\готовится
                idBatch = order.idBatch;
                G.curOrder = order;
                return false;
            }
        });

        localStorage.activeOrder = G.curOrder.id;

        window.mk1 = $('<div/>').appendTo($('#workplace')).modKitchen({
            type: 1
        });
        window.mk2 = $('<div/>').appendTo($('#workplace')).modKitchen({
            type: 2
        });


        $(G.AllOrders).each(function (indx, o) {
            if (G.curOrder.idBatch === idBatch) {
                $("<div/>")
                        .orderPanel({order: o})
                        .appendTo(pnlOrders)
                        .click(function () {
                            localStorage.activeOrder = o.id;
                            G.curOrder = createOrderObj(o);
                            window.mk1.modKitchen({
                                order: G.curOrder,
                                type: 1
                            });
                            window.mk2.modKitchen({
                                order: G.curOrder,
                                type: 2
                            });
                        });
            }
        });

//        var ov = createOrderViewer('ordViewer', 'orderViewer', G.curOrder);
//        ov.appendTo($('#workplace')).fadeIn(1000);

        //$(".order").first().click();
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
            audio.play();

        },
        onComplete: function (barcode, qty) {
            console.log("barcode:" + barcode);
            console.log("qty:" + qty);
            //2200003014129 roll
            //2200001012985 pizza
            if (barcode.length == 13) {
                var s = barcode;
                var type = s.substr(1, 6);
                var weight = s.substr(7, 5);
                weight = parseInt(weight);
                switch (type) {
                    case "200003": //roll
                        //var inttt=parseInt(weight);
                        //$('#tProducts').append('<tr><td>my data</td><td>more data</td></tr>');
                        //items.push("<tr id='" + val.product_id + "'><td>" + val.name + "</td><td id='scanp'>" + val.count + "</td><td>" + val.price + "</td></tr>");
                        weightR = weight / 1000;
                        alert(weightR);
                        //$("#scanr").attr('weight', weightP);
                        break;
                    case "200001":
                        weightP = weight / 1000;
                        alert(weightP);
                        //$("#scanp").attr('weight', weightR);
                        break;
                }
                //$("#weight").text((weightP + weightR));
                alert("SetOrderProductsOnServer");
                //SetOrderProductsOnServer($("#dlgEdit").attr("order_id"), weightR, weightP);
            }
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
}

//считает время приготовления продуктов. idType - если задан, то считает только необходимые продукты
function calcCoockingTime(products, idType, cookCount) {
    var totalCookingTime = 0;
    if (products && products.length > 0 && products[0] !== undefined) {

//        var itemsR = G.curOrder.Products.filter(function (row) {
//            return row.idType === 1;
//        });
//        var itemsP = G.curOrder.Products.filter(function (row) {
//            return row.idType === 2;
//        });


        var items = products;
        if (idType !== undefined) {
            items = products.filter(function (row) {
                return row.idType === idType;
            });
        }

//TODO: check func speed
//var sum =.reduce(function(pv, cv) {return pv + cv.CoockingTime;}, 0);
        switch (idType) {
            case 1: //R
                $.each(items, function (key, val) {
                    //totalSumm += val.Price;
                    totalCookingTime += val.CookingTime;
                });
                break;
            case 2: //P
//вмещает
//1б 1м - 600с
//2б - 600с
//3м - 600с
//
//4м - 1200
//5 - 1200
//6 - 1200
//7 - 1800
//
//
//1---------
//поваров = 2
//колво загрузок = ОКРУГЛ(колвоПицц/2)
//Время = колво загрузок*600/поваров
//
//2---------
//поваров = 2
//колво загрузок = ОКРУГЛ(колвоПицц/3)
//Время = колво загрузок*600/поваров

                items = items.map(function (p) {
                    if (p.Tags !== undefined) {
                        var tags = p.Tags
                                .filter(function (tag) {
                                    return tag.id === 10 || tag.id === 17;//30cm 40cm
                                })
                                .map(function (tag) {
//                    return '<a href="#" class="ico">' + tag.Name + '</a>';
                                    return tag.id;
                                });
                        var newItem = {};
                        newItem.Name = p.Name;
                        newItem.CookingTime = p.CookingTime;
                        newItem.Tag = tags[0];
                        newItem.Price = p.Price;
                        newItem.Count = p.Count;
                        return newItem;
                    } else {
                        console.log(p.Name + ": Tags undefined");
                    }
                });

                var _cookCount = cookCount === undefined ? 1 : cookCount;
                //var ctP = 0;
//                var ct30cm = 0;
                var count30 = 0;
//                var ct40cm = 0;
                var count40 = 0;
                //var totalSumm = 0;
                $.each(items, function (key, val) {
                    if (val !== undefined) {
                        //totalSumm += val.Price;
                        if (val.Tag !== undefined) {
                            switch (val.Tag) {
                                case 10: //30cm
                                    count30 = count30 + val.Count;
                                    //ct30cm = Math.max(ct30cm, val.CookingTime);
                                    break;
                                case 17: //40cm
                                    count40 = count40 + val.Count;
                                    //ct40cm = Math.max(ct40cm, val.CookingTime);
                                    break;

                                default:

                                    break;
                            }

                            //console.log("P:" + val.Name + " - " + val.CookingTime);
                        } else {
                            console.log(val.Name + "tags undefined");
                        }
                    }
                });


//                var loadCount30 = Math.ceil(count30 / 3);
//                ct30cm = ct30cm * loadCount30 / _cookCount;

                var loadCount30 = 0; //сколько целых загрузок
                var mod30 = count30 % 3; //остаток пиц
                switch (mod30) {
                    case 0:
                        loadCount30 = count30 / 3;
                        break;
                    case 1://!
                        loadCount30 = Math.floor(count30 / 3);
                        break;
                    case 2:
                        loadCount30 = Math.ceil(count30 / 3);
                        break;
                }
                //ct30cm = ct30cm * loadCount30 / _cookCount;
                //console.log("Время30:" + ct30cm + " | остаток " + mod30 + " пицц");

                var loadCount40 = 0; //сколько целых загрузок
                var mod40 = count40 % 2; //остаток пиц
                switch (mod40) {
                    case 0:
                        loadCount40 = count40 / 2;
                        break;
                    case 1://!
                        loadCount40 = Math.floor(count40 / 2);
                        break;
                }
//                ct40cm = ct40cm * loadCount40 / _cookCount;
//                console.log("Время40:" + ct40cm + " | остаток " + mod40 + " пицц");

                var totalLoads = loadCount30 + loadCount40;
                if (mod30 !== 0 || mod40 !== 0) {
                    totalLoads++;
                }

                totalLoads = Math.ceil(totalLoads / _cookCount);
                totalCookingTime = Math.max(totalLoads * 600, 600);
                console.log("totalLoads:" + totalLoads);
                break;
            default:
                alert("TODO calc total CoockingTime");
                break;
        }
    }
    return totalCookingTime;
}

function updateKInterface_SelPanel() {
    alert("upd");
    console.log("--обновляем боковую панель");
    var orders = getOrdersFromLS().filter(function (currentValue, index, arr) {
//        return currentValue.idKitchen == localStorage.wp_id && currentValue.idStatus > 1 && currentValue.idStatus < 5;
        return currentValue.idKitchen == localStorage.wp_id && currentValue.idStatus > 1 && currentValue.idStatus < 4;
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

function updateKInterface_order(order) {
    var ordersPanel = $('#o_ordersPanel');
    var divOrder = $('#' + order.id);

    if (!divOrder.length) {
        divOrder = CreateOrder(order);
        ordersPanel.append(divOrder);
    }//TODO сделать чтоб добавлялся только заказ с нужным idBatch
    divOrder.replaceWith(CreateOrder(order));


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