function createKitchenInterface() {
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
    }).appendTo(divHeader).append('<span class="ui-icon ui-icon-person"></span>Повара').css({"float": "right", "padding": "5px"});

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

