//var map;
//var markers;

//function createOrderEditor(op) { //TODO  all orders to global
//    var headerItems = ["Продукт", "Кол-во", "Цена", "Скидка", "Итого", "Бонусы"];
//    var div = $('<div/>', {
//        id: "o_ordEdit"
//                //class: 'ui-widget ui-widget-content',
//                //attr: {'order_id': '123', 'ts': timestamp}
//    });
////--------CLIENT DATA
//    var cl = G.curOrder.Client;
//    console.log("------cl");
//    console.log(cl);
//    var cgClient = $('<div/>').appendTo(div).personData({
//        value: 20,
//        //Name: "Test Name",
//        //Addresses: ["Владимирская 43, кв.82", "Партзанская 86", "новый адрес..."],
//        complete25: function (event, data) {
//            // alert("Callbacks are great!");
//        },
//        change: function (event, person) {
//            G.curOrder.Client = person;
//            if (G.curOrder.Client.id === null) {
//                $("#bOk").addClass("ui-state-disabled")
//            } else {
//                $("#bOk").removeClass("ui-state-disabled")
//            }
////            console.log("person");
////            console.log(person);
////            console.log("sel address:");
////            console.log(cgClient.personData("selectedAddress"));
//        }
//    });
//    //set options after init
//    //cgClient.personData("option", "value", 25);
//    cgClient.personData("person", cl); //OR cgClient.personData("loadClient", cl.id);
//    cgClient.personData("selectedAddress", G.curOrder.idAddress);
//
//// EXTEND PLUGIN
////    $.ctrl.personData.prototype.reset = function () {
////        this._setOption("value", 0);
////        console.log("reset fired");
////    };
////    cgClient.personData("reset");
//
////---------MENU
//    var cgMenu = $('<div/>', {class: 'ui-widget ui-widget-content controlgroup'}).appendTo(div);
//    cgMenu.css("width", 270);
//    cgMenu.append("<h1>Меню</h1>")
//    var inpFilter = $('<input class="filter">');
//    cgMenu.append(inpFilter);
//    var divMenuProducts = $('<div/>', {
//        id: "divMenuProducts",
//    }).appendTo(cgMenu);
//
//    var MenuProducts = G.AllProducts.filter(function (currentValue, index, arr) {
//        return currentValue.idPricingType === G.curOrder.idPricingType;
//    });
//    var tableItemsMenu = MenuProducts.map(function (p) {
//        var tags = p.Tags
//                .filter(function (tag) {
//                    return tag.id === 4 || tag.id === 10 || tag.id === 13 || tag.id === 17;//30cm 40cm
//                })
//                .map(function (tag) {
////                    return '<a href="#" class="ico">' + tag.Name + '</a>';
//                    return tag.id;
//                });
//        var el = $("<i></i>").text(p.Name);
//        tags.forEach(function (itm) {
//            el.addClass('ptag-' + itm);
//        });
//        var newItem = {};
//        newItem.id = p.id;
////        newItem.img = oldItem.Name;
//        newItem.Name = el[0].outerHTML;
////        newItem.Tags = tags;
////        newItem.Weight = p.Weight;
//        newItem.Price = p.Price;
//        return newItem;
//    });
//    var tMenuProducts = CreateTable('tMenuProducts', 'tMenuProducts', ['Название', 'Цена'], tableItemsMenu, undefined);//["", "", 123, 888]
//    divMenuProducts.append(tMenuProducts);
//    inpFilter.keyup(function () {
//        var rows = tMenuProducts.find("tbody tr").hide();
//        var data = this.value.split(" ");
//        $.each(data, function (i, v) {
//            rows.filter(":containsi('" + v + "')").show();
//        });
//    });
//    tMenuProducts.find("tr").click(function () {
//        var idProduct = parseInt($(this).attr("item_id"));
//        //$(this).css("font-weight", "bold");
//
//        //alert($(this).parent().attr("item_id"));
//        //var tProducts = CreateTable('tProducts', 'tProducts', headerItems, tableItems, footerItems);//["", "", 123, 888]
//        //divProducts.append(tProducts);
//        if (G.curOrder.Products !== null) {
//            var p = G.curOrder.Products.find(function (itm) {
//                return itm.id == idProduct;
//            });
//            if (p !== undefined) {//если такой продукт уже есть в заказе, то увеличиваем его count
//                p.Count = p.Count + 1;
//                var i = G.curOrder.Products.indexOf(p);
//                G.curOrder.Products[i] = p;
//            } else {//если нет, то добавим 1шт в список заказа
//                var newProduct = G.AllProducts.find(function (thisArg) {
//                    return thisArg.id === idProduct;
//                });
//                newProduct.Count = 1; //add record
//                G.curOrder.Products.push(newProduct);
//            }
//            updateOrderEditorProductsTable($("#tProducts"));
//
//        } else { //if first product
//            G.curOrder.Products = [];
//        }
//
//
////TODO update totals
////СКОПИРОВАЛ ВЫШЕ
////        if (curOrder.Products) {
////
////        } else {
////            alert("curOrder.Products is null")
////        }
////        bindEventsToTable(tProducts);
//    });
//
////3
//    var cgOrder = $('<div/>', {class: 'ui-widget ui-widget-content controlgroup'}).appendTo(div);
//    cgOrder.css("width", 550);
//    cgOrder.append('<div id="ordlog"></div>');
//    var select = $('<select/>', {
//        id: "o_selstatus",
//        name: "status",
////        class: 'ui-widget-header',
//    }).append('<label for="status">Статус</label>');
//
//    cgOrder.append(select);
//
//    //$('.ui-dialog-titlebar').first().append('<label for="rP">Печерская</label><input type="radio" name="chkPlace" id="rP" item_id=3>');
//    //$('.ui-dialog-titlebar').first().append('<label for="rNS">Ново-Садовая</label><input type="radio" name="chkPlace" id="rNS" item_id=4>');
////    $('.ui-dialog-titlebar').first().append('<label for="self">Самовывоз</label><input type="checkbox" name="self" id="self">');
//
////    $("#rP,#rNS").checkboxradio();
////    $("#self").checkboxradio();
//
////    switch (curOrder.idKitchen) {
////        case 3:
////            $("#rP").prop("checked", true);
////            $("#rP").checkboxradio('refresh');
////            break;
////        case 4:
////            $("#rNS").prop("checked", true);
////            $("#rNS").checkboxradio('refresh');
////            break;
////        default:
////            break;
////    }
//
////    $("#rP,#rNS").on("change", function (e) {
////        var target = $(e.target);
////        var id = target.attr("item_id"); //id kitchen
////        var dlg = target.parent().parent();
////        dlg.removeClass('ord-workplace-3 ord-workplace-4 ord-workplace-null');
////        dlg.addClass("ord-workplace-" + id);
////        //if (target.is(":checked")) {
////        //} else {
////        //}
//////        alert(target.attr("id"));
////    });
//
//
////    cgOrder.append(select);
//
//
//    cgOrder.append('На какое число заказ: <input type="date" id="DDate" min="' + G.today() + '" required/>');
//    cgOrder.append('<br><label for="asdasdTime">Приготовить к: </label><input type="time" name="asdasdTime" id="asdasdTime" value="' + (G.curOrder.DTime === null ? '' : G.curOrder.DTime) + '" min=10:00 max=23:00 step=900>');
//    cgOrder.append('<br><label for="DTime">Доставить к </label><input type="time" name="DTime" id="DTime" value="' + (G.curOrder.DTime === null ? '' : G.curOrder.DTime) + '" min=10:00 max=23:00 step=900>');
//
//    var divProducts = $('<div/>', {
//        id: "divProducts"
//    }).appendTo(cgOrder);
////divProducts.css("width","100%");
//    var tProducts = CreateTable('tProducts', 'tProducts', headerItems); //create empty
//    divProducts.append(tProducts);
////    updateOrderEditorProductsTable(tProducts);
//
//    //bindEventsToTable(tProducts);
//
////var s=$('<fieldset><legend><h3>Доставка</h3><label for="chD">Доставка</label><input type="checkbox" name="chD" id="chD"></legend>фывыфвБикЮ<br></fieldset>');
////s=$('<div class="slideThree"><input type="checkbox" value="None" id="roundedTwo" name="check" checked /><label for="roundedTwo"></label></div>');
////s=('<fieldset><legend><div><input type="checkbox" id="subscribeNews" name="subscribe" value="newsletter"><label for="subscribeNews">Требуется доставка</label></div></legend>asdasd as dsa ds d</fieldset>');
////    var fs = $('<fieldset/>', {
////        //class: 'o-filter-rg'
////    });
////
////    cgOrder.append(fs);
////
////    fs.append('<legend><div><input type="checkbox" id="subscribeNews" name="subscribe" value="newsletter"><label for="subscribeNews">Требуется доставка</label></div></legend>');
////    fs.append('<label for="chkP">Печерская</label>');
////    fs.append('<input type="checkbox" name="chkP" id="chkP" item_id=3 checked>');
////    fs.append('<label for="chkNS">Ново-Садовая</label>');
////    fs.append('<input type="checkbox" name="chkNS" id="chkNS" item_id=4 checked>');
////    fs.children('input').checkboxradio({
////        icon: false,
////    });
////    fs.children('input').prop('checked', true);
//
////s.find("input").checkboxradio({
//    //icon:false 
////});
//
//
//    var comment = G.curOrder.Comment === null ? "" : G.curOrder.Comment;
//    cgOrder.append('<p><input type="text" name="Comment" id="Comment" value="' + comment + '" placeholder="Комментарий" ></p>');
//    cgOrder.append('<label for="horizontal-spinner" class="ui-controlgroup-label">Кол-во персон</label><input id="horizontal-spinner" class="ui-spinner-input">');
//    cgOrder.append('<br><span id="ctime">Время приготовления заказа<span>');
//    cgOrder.append('<button>Назначить скидку [%,руб,бонусы]</button>');
//
//
////    var cgDDate = $('<div/>', {class: 'ui-widget controlgroupDDate ui-controlgroup-horizontal'}).appendTo(cgOrder);
////    cgDDate.append('Дата: <input type="date" id="DDate"/>');
////    cgDDate.append('<label for="DTime">Доставить к</label><input type="time" name="DTime" id="DTime" value="12:30">');
//
//    var today = new Date();
//    cgOrder.children("#DDate").val(today.toISOString().substr(0, 10));
////    var h = today.getHours();
////    var m = today.getMinutes();
////    if (h < 10)
////        h = '0' + h;
////    if (m < 10)
////        m = '0' + m;
////    cgOrder.children("#DTime").val(h + ':' + m);
//
//    //localStorage.dates = ["25.10.2016", "26.10.2016", "29.10.2016"]
//
////    cgDDate.children("#DDate").datepicker({
////        showOn: "button",
////        buttonImage: "images/calendar.gif",
////        buttonImageOnly: true,
////        buttonText: "Select date",
////        //minDate: -1,
////        //maxDate: "+1M +10D",
////        //maxDate: +3,
////        //dateFormat: "yy-mm-dd",
//////        beforeShowDay: function (date) {
//////            var string = jQuery.datepicker.formatDate('yy-mm-dd', date);
//////            //var string = jQuery.datepicker.formatDate('dd.mm.yy', date);
//////            return [localStorage.dates.indexOf(string) != -1]
//////        },
////        onSelect: function () {
////            var dt = $.datepicker.formatDate("yy-mm-dd", $(this).datepicker('getDate'));
////            curOrder.DDate = dt;
////            //selectDate(dt);
////        }
////    });
//
//
//    var selectPayType = $('<select/>', {
//        id: "o_paytype",
//        name: "paytype"
////        class: 'ui-widget-header',
//    }).append('<label for="paytype">Тип оплаты</label>');
//    cgOrder.append(selectPayType);
//    selectPayType.append(ArrayToOptionItems(["Ниличными", "Картой", "Онлайн"]));
////    selectPayType.selectmenu({
//////        create: function (event, ui) {
////////            $('.ui-selectmenu-menu').css({'height': '100px', 'overflow': 'auto'});
//////            $('.ui-selectmenu-menu').css({'z-index': '10000000'});
//////        },
//////        open: function (event, ui)
//////        {
//////            $('.ui-selectmenu-menu').zIndex($(‘#dialog’).zIndex() + 1);
//////        },
////        width: 140,
//////        position: {
//////            my: "left+10 top",
//////            at: "left top+20"
//////        },
//////        change: function (event, ui) {
//////            var idOrder = parseInt($('#ordViewer').attr("idOrder"));
//////            var idStatus = parseInt($(this).val()) + 1;
//////            sendRequest('updateOrderStatus', 'idOrder=' + idOrder + '&idStatus=' + idStatus, function (response) {
//////                console.log(response);
//////            });
//////        }
////    });
//    selectPayType.val(1);
//    //selectPayType.selectmenu('refresh', true);
//    //cgOrder.append('<label for="c">Количество персон</label><input name="с" id="с">');
////    cgOrder.append('<button id="bDbgCurOrder" class="ui-button ui-widget ui-corner-all">DBG curOrder</button>');
////    cgOrder.children('#bDbgCurOrder').click(function () {
////        console.log(curOrder);
////    });
//    cgOrder.append('<button id="bOk" class="ui-button ui-widget ui-corner-all">OK</button>');
//    cgOrder.children('#bOk').click(function () {
////        var client = {
////            id: 9226, //на данный момент достаточно только ID клиента. Остальную инфу сервер пока не обрабатывает.
////            //Name: 'Ванек',
////            //Surname: 'Пупкин',
////            //Phones: [{"Phone": 9277777778, "isDefault": 1}, {"Phone": 9626040203}],
////            //Addresses: [{"Floor": 6, "Address": "ул Владимирская, д 43, кв 82", "isDefault": 1}],
////            //Card: "1234",
////            //Comment: "тут коммент",
////            //Org: 'ОАО "ТяпЛяпСтрой"'
////        };
////
////        var order = {
////            id: 54336, //51979 //если передаем - то заказ редактируется. Если нет - создается
////            No: null, //номер заказа назначается сервером. Нумерация начинается с 1 каждый день
////            idBranch: 1,
////            idPricingType: null,
////            idStatus: 1,
////            idKitchen: null,
////            idBatch: null,
////            idCreatedBy: null,
////            Price: null,
////            Comment: null,
////            QueueNo: null,
////            //CDate: "17-02-03", // "yy-mm-dd" дата создания заказа. Если не передавать, то сервер установит текущую
////            //CTime: "15:00", //соответственно, время создания
////            DDate: "17-02-03", // К какому числу клиент хочет заказ
////            DTime: "15:00", // Соответственно, к какому времени
////            Products: [{"id": 774, "Count": 2}, {"id": 1319, "Count": 1}, {"id": 1319, "Count": 1, "isGift": 1}],
////            Client: client
////        };
//        G.curOrder.idBranch = 1;
//        //G.curOrder.idPricingType = 1;
//        G.curOrder.idStatus = 1;
//        G.curOrder.idKitchen = 5;
//        G.curOrder.idBatch = null;
//        G.curOrder.idCreatedBy = 1;
//        G.curOrder.Price = null;
//        G.curOrder.Comment = $("#Comment").val();
//        G.curOrder.QueueNo = null;
//        //G.curOrder.CDate= "17-02-03", // "yy-mm-dd" дата создания заказа. Если не передавать, то сервер установит текущую
//        //G.curOrder.CTime= "15:00", //соответственно, время создания
//        G.curOrder.DDate = $("#DDate").val() === "" ? null : $("#DDate").val();//"17-02-03"; // К какому числу клиент хочет заказ
//        G.curOrder.DTime = $("#DTime").val() === "" ? null : $("#DTime").val();//"15:00"; // Соотв
//        var curAdr = cgClient.personData("selectedAddress");
//        G.curOrder.idAddress = curAdr.idAddress;
//        G.curOrder.Phone = cgClient.personData("selectedPhone");
//
//        console.log('1. curOrder is:');
//        op.orderPanel({order: G.curOrder});
//        G.curOrder = prepareDataToCreateOrderOnServer(G.curOrder);
//        sendRequest("setOrder", "order=" + JSON.stringify(G.curOrder), function (data) {
//            //console.log(data);
//        });
//        $(div).parent().dialog('close');
//    });
////"Client":{"id":20914,"Code":"","Flat":27,"Name":"","Floor":8,"Phone":79376436017,"Street":"антоново овсеенко","Building":"59В","Entrance":1}
//
//    select.append(ArrayToOptionItems(["Принят", "Готовить", "Готовится", "Приготовлен", "Доставка", "В пути", "Доставлен", "Отказ"]));
////    //or like this: [{id:1,Name:"Принят"},"Готовить","Готовится","Приготовлен"]
//    $(select).selectmenu({
////        create: function (event, ui) {
//////            $('.ui-selectmenu-menu').css({'height': '100px', 'overflow': 'auto'});
////            $('.ui-selectmenu-menu').css({'z-index': '10000000'});
////        },
////        open: function (event, ui)
////        {
////            $('.ui-selectmenu-menu').zIndex($(‘#dialog’).zIndex() + 1);
////        },
//        width: 100,
////        position: {
////            my: "left+10 top",
////            at: "left top+20"
////        },
//        change: function (event, ui) {
//            G.curOrder.idStatus = parseInt($(this).val()) + 1;
//            if (G.curOrder.id !== null)//если заказ редактируется (а не создается)
//            {
////                sendRequest('updateOrderStatus', 'idOrder=' + curOrder.id + '&idStatus=' + curOrder.idStatus, function (response) {
////                    console.log(response);
////                });
//            }
//            //var idOrder = parseInt($('#ordViewer').attr("idOrder"));
//            //var idStatus = parseInt($(this).val()) + 1;
//        }
//    });
//    select.val(G.curOrder.idStatus === null ? 0 : G.curOrder.idStatus - 1);
//    select.selectmenu('refresh', true);
//
//    cgMenu.controlgroup({
////        "direction": "vertical"
//    });
//
//    return div;
//}

//function updateOrderEditorProductsTable(table) {
//    //var headerItems = ["Продукт", "Кол-во", "Вес", "Цена", "Итого"];
//    var tableItems = null;
//    var footerItems = null;
//    tableItems = G.curOrder.Products.map(function (p) {
//        if (p.Tags !== null) {
//            var tags = p.Tags
//                    .filter(function (tag) {
//                        return tag.id === 4 || tag.id === 10 || tag.id === 13 || tag.id === 17;//30cm 40cm
//                    })
//                    .map(function (tag) {
//                        return tag.id;
//                    });
//        }
//
//        var el = $("<div></div>").html(p.Name);
//        el.attr("title", "<h5>Рекомендованные прдукты</h5>" + p.RelatedProducts + '<br><hr><h5>Состав</h5>' + p.ProcCard)
//
//        tags.forEach(function (itm) {
//            el.addClass('ptag-' + itm);
//        });
//        var newItem = {};
//        newItem.id = p.id;
//        newItem.Name = el[0].outerHTML;
////        newItem.Tags = tags;
//        newItem.Count = p.Count;
////        newItem.Weight = p.Weight;
//        newItem.Price = p.Price;
//        newItem.Discount = 0;
//        newItem.TotalPrice = p.Count * p.Price;
////        newItem.CookingTime = p.CookingTime;
//        newItem.Bonus = Math.round(newItem.TotalPrice * 0.1);
//        return newItem;
//    });
////    
////    tableItems = G.curOrder.Products.map(function (oldItem) {
////        var newItem = {};
////        newItem.id = oldItem.id;
////        newItem.Name = oldItem.Name;
////        newItem.Count = oldItem.Count;
////        newItem.Weight = oldItem.Weight;
//////        newItem.TotalWeight = oldItem.Count * oldItem.Weight;
////        newItem.Price = oldItem.Price;
////        newItem.TotalPrice = oldItem.Count * oldItem.Price;
////        newItem.CookingTime = oldItem.CookingTime;
////        return newItem;
////    });
//
////    var tmpItems = curOrder.Products.map(function (oldItem) {
////        var newItem = {};
////        newItem.Count = oldItem.Count;
////        newItem.Weight = oldItem.Weight;
////        newItem.TotalWeight = oldItem.Count * oldItem.Weight;
////        newItem.Price = oldItem.Price;
////        newItem.TotalPrice = oldItem.Count * oldItem.Price;
////        return newItem;
////    });
//
//    var totalCount = 0;
//    var totalWeight = 0;
//    var totalPrice = 0;
//    var totalBonus = 0;
//    tableItems.forEach(function (itm) {
//        totalCount = totalCount + itm.Count;
//        totalWeight = totalWeight + itm.Count * itm.Weight;
//        totalPrice = totalPrice + itm.Count * itm.Price;
//        totalBonus = totalBonus + itm.Bonus;
//    });
//
//    footerItems = ["Всего", totalCount, "", "", totalPrice, totalBonus];
//
//    var coockingTimeR = calcCoockingTime(G.curOrder.Products, 1, 1);
//    var coockingTimeP = calcCoockingTime(G.curOrder.Products, 2, 1);
//    var coockingTimeR2 = calcCoockingTime(G.curOrder.Products, 1, 2);
//    var coockingTimeP2 = calcCoockingTime(G.curOrder.Products, 2, 2);
//
//    $('#ctime').text("Время приготовления: Пицца(если 1 пицер) " + coockingTimeP / 60 + "мин. Пицца(если 2 пицера) " + coockingTimeP2 / 60 + "| Роллы " + coockingTimeR / 60 + "мин.");
//
//    UpdateTableItems(table, tableItems, footerItems);
//    //table.html(tProducts.html());
//    table.tooltip({content: function () {
//            return $(this).prop('title');
//        }});
//    bindEventsToTable(table);
//}

function showOrderEditor(o) {
    //order = createOrderObj(op.orderPanel("option","order"));
    //console.log(op);
    G.curOrder = createOrderObj(o); //for padding products with RelatedProducts and ProcCard
    //G.curOrder = order;
    var ordNo = G.curOrder.id === null ? " - Новый заказ" : G.curOrder.No;


    var dlg = CreateDialog('dlgE', 'Заказ ' + ordNo, 'o_orderEditDlg', false);
//    $(dlg).append('<div class="logo"><span class="ico-' + op.orderPanel("option", "order").idPricingType + '"></span></div>');
//dlgV.dialog( "option", "resizable", true );
//    dlg.dialog("option", "height", $(window).height()); //$(window).height()
//    dlg.dialog("option", "width", $(window).width());
//    
//$("#DlgID").parent().css('height', $(window).height());
//    dlg.dialog("option", "dialogClass", 'noclose ord-workplace-' + G.curOrder.idKitchen);
//console.log(order);
//    var editor = createOrderEditor(op);
//    dlg.append(editor.fadeIn(1000));

    dlg.dialogExtend({
//        "closable": true,
//        "maximizable": true,
        "minimizable": true,
//        "collapsable": true,
        "dblclick": "maximize",
        //"titlebar": "transparent",
        "minimizeLocation": "right",
        "icons": {
            "close": "ui-icon-circle-close",
//            "maximize": "ui-icon-circle-plus",
            "minimize": "ui-icon-circle-minus",
//            "collapse": "ui-icon-triangle-1-s",
//            "restore": "ui-icon-bullet"
        },
//        "load": function (evt, dlg) {
//            alert(evt.type);
//        },
//        "beforeCollapse": function (evt, dlg) {
//            alert(evt.type);
//        },
//        "beforeMaximize": function (evt, dlg) {
//            alert(evt.type);
//        },
//        "beforeMinimize": function (evt, dlg) {
//            alert(evt.type);
//        },
//        "beforeRestore": function (evt, dlg) {
//            alert(evt.type);
//        },
//        "collapse": function (evt, dlg) {
//            alert(evt.type);
//        },
//        "maximize": function (evt, dlg) {
//            alert(evt.type);
//        },
//        "minimize": function (evt, dlg) {
//            alert(evt.type);
//        },
//        "restore": function (evt, dlg) {
//            alert(evt.type);
//        }
    });



    //dlg.dialog('open');
    dlg.dialogExtend("maximize");

    $("<div/>").appendTo(dlg).orderEditor({order: G.curOrder});
//    updateOrderEditorProductsTable($("#tProducts"));
}

function bindEventsToTable(table) {
    table.find("tbody tr").hover(
            function () {
//                $(this).children().last().append('<div><span id="bRem" class="ui-icon ui-icon-close rowButton"></span></div>');
                $(this).children().last().append('<span id="bRem" class="ui-icon ui-icon-close rowButton"></span>');
                $("#bRem").click(function () {
                    //alert($(this).parent().parent().attr("item_id"));
                    //console.log(curOrder);

                    var idProduct = parseInt($(this).parent().parent().attr("item_id"));
                    G.curOrder.Products = G.curOrder.Products.filter(function (currentValue, index, arr) {
                        return currentValue.id !== idProduct;
                    });

                    $(this).parent().parent().remove();
                    return false;
                });
                //jQuery( this ).css("opacity","0.5");
            }, function () {
        //$(this).find("div:last").remove();
        $(this).find("span:last").remove();
        //jQuery( this ).css("opacity","1");
    }
    );

    table.find("tbody tr").dblclick(function () {
        //$(this).children().last().append('<div><span id="bRem" class="ui-icon ui-icon-close rowButton"></span></div>');
        //$("#bRem").click(function () {
        //alert($(this).attr("item_id"));
        //    return false;
        //})
    });

    table.find("tbody tr").click(function () {
        //$(this).children().last().append('<div><span id="bRem" class="ui-icon ui-icon-close rowButton"></span></div>');
        //$("#bRem").click(function () {
        //$(this).empty();

//alert($(this).attr("item_id"));
        //    return false;
        //})
    });
}