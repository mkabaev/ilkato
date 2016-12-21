var clientsCache = [];//сюда кэшируем клиентов для поиска по номеру телефона
var AllProducts = []; //справочник продуктов
var curOrder = {};
//var map = null,
//        map_created = false;
function createOrderEditor() { //TODO  all orders to global
    if (curOrder.Products) {
        var itemsR = curOrder.Products.filter(function (row) {
            return row.idType === 1;
        });
        var itemsP = curOrder.Products.filter(function (row) {
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

        var headerItems = ["Продукт", "Кол-во", "Вес", "Цена", "T"];
        var tableItems = null;
        var footerItems = null;
        tableItems = curOrder.Products.map(function (oldItem) {
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

//1
    var cgClient = $('<div/>', {class: 'ui-widget ui-widget-content controlgroup'}).appendTo(div);
    cgClient.append('+7<input id="phone" placeholder="Телефон">');
    cgClient.append('+7<input id="phone2" placeholder="Телефон">');
    cgClient.append('<input id="card" placeholder="№ карты">');
    cgClient.append('<input id="name" placeholder="Имя">');
    cgClient.append('<input id="info" placeholder="Доп. инфориация">');

    cgClient.append('<input id="address" name="address" type="text" placeholder="Адрес">');
    cgClient.append('<input id="floor" placeholder="этаж">');
    cgClient.append('<div id="map" class="panel-map"></div>');
    var $address = cgClient.find('#address');
    $address.suggestions({
        serviceUrl: "https://suggestions.dadata.ru/suggestions/api/4_1/rs",
        token: "eab53cb4ce6873e6346bd24d131331c637ca23bf",
        type: "ADDRESS",
        constraints: {
            label: "Самара",
            // ограничиваем поиск Самарой
            locations: {
                region: "Самарская",
                city: "Самара"
            },
            // не даем пользователю возможность снять ограничение
            deletable: false
        },
        // в списке подсказок не показываем область и город
        restrict_value: true,
        count: 5, //Максимальное количество подсказок в выпадающем списке. Не может быть больше 20.
        autoSelectFirst: true,
        /* Вызывается, когда пользователь выбирает одну из подсказок */
        onSelect: function (suggestion) {
            //console.log(suggestion.data.house_fias_id);
            console.log(suggestion.data);
            //mapUpdate(suggestion.value, 16);
            mapUpdate(suggestion.data.geo_lat + ',' + suggestion.data.geo_lon, 16);
        },
//        onSuggestionsFetch:function (suggestions) {
//            console.log(suggestions);
//        }
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
    cgClient.find("#phone, #phone2").autocomplete({
        minLength: 5,
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
            $(this).val(ui.item.label);
            console.log(ui.item.idPerson);
            return false;
        },
        select: function (event, ui) {
            //return false;
        },
        change: function (event, ui) {
            //console.log(ui.item);
            sendRequest('getClient', 'idClient=' + ui.item.idClient, function (response) {
                //console.log(curOrder.Client);
                curOrder.Client = response;
                //console.log(curOrder.Client);
                updateEditorClient(curOrder.Client);
                $($address).suggestions().setOptions({hint: "Исправить адрес на:"});
                //$($address).suggestions().update(); //показывает подсказки и не скрывает пока не выберешь
                $($address).focus();
            });
            //if (!ui.item) {
            //    console.log('new client');
            //    curOrder.Client.Phones=$(this).val();
            //}
            //$("#name").val(ui.item.idClient);
        },
    })
            .autocomplete("instance")._renderItem = function (ul, item) {
        var nm = "";
        if (item.Name !== "") {
            nm = '<br>' + item.Name;
        }
        var cm = "";
        if (item.Comment !== "") {
            cm = '<br>' + item.Comment;
        }
        return $("<li>")
                .append('<div style="margin-left:20px;"><img style="position:absolute; left:-18px;" src="images/user16.png">' + item.label + '<i>' + nm + cm + '</i></div>')
                .appendTo(ul);
    };

//2
    var cgMenu = $('<div/>', {class: 'ui-widget ui-widget-content controlgroup'}).appendTo(div);
    cgMenu.css("width", 270);
    cgMenu.append("<h1>Меню</h1>")
    var inpFilter = $('<input class="filter">');
    cgMenu.append(inpFilter);
    var divMenuProducts = $('<div/>', {
        id: "divMenuProducts",
    }).appendTo(cgMenu);

    var tableItemsMenu = AllProducts.map(function (oldItem) {
        var newItem = {};
        newItem.id = oldItem.id;
        newItem.Name = oldItem.Name;
        newItem.Weight = oldItem.Weight;
        newItem.Price = oldItem.Price;
        return newItem;
    });
    var tMenuProducts = CreateTable('tMenuProducts', 'tMenuProducts', ['Название', 'Вес', 'Цена'], tableItemsMenu, undefined);//["", "", 123, 888]
    divMenuProducts.append(tMenuProducts);
    inpFilter.keyup(function () {
        var rows = tMenuProducts.find("tbody tr").hide();
        var data = this.value.split(" ");
        $.each(data, function (i, v) {
            rows.filter(":containsi('" + v + "')").show();
        });
    });
    tMenuProducts.find("tr").click(function () {
        var idProduct = parseInt($(this).attr("item_id"));
        //$(this).css("font-weight", "bold");

        //alert($(this).parent().attr("item_id"));
        //var tProducts = CreateTable('tProducts', 'tProducts', headerItems, tableItems, footerItems);//["", "", 123, 888]
        //divProducts.append(tProducts);
        var newProduct = AllProducts.find(function (thisArg) {
            return thisArg.id === idProduct;
        });
        newProduct.Count = 1; //add record
        curOrder.Products.push(newProduct);
        //var Products = [];
        //Products = order.Products;
        //Products.push(newProduct);
        console.log(curOrder.Products);
        //order.Products = Products;
        tableItems = curOrder.Products.map(function (oldItem) {
            var newItem = {};
            newItem.id = oldItem.id;
            newItem.Name = oldItem.Name;
            newItem.Count = oldItem.Count;
            newItem.Weight = oldItem.Weight;
            newItem.Price = oldItem.Price;
            newItem.Time = oldItem.CookingTime;
            return newItem;
        });
        UpdateTableItems(tProducts, tableItems);
        bindEventsToTable(tProducts);


    });

//3
    var cgOrder = $('<div/>', {class: 'ui-widget ui-widget-content controlgroup'}).appendTo(div);
    cgOrder.css("width", 460);
    cgOrder.append('<div id="ordlog"></div>');
    var select = $('<select/>', {
        id: "o_selstatus",
        name: "status",
//        class: 'ui-widget-header',
    }).append('<label for="status">Статус</label>');
    $('.ui-dialog-titlebar').append(select);
    $('.ui-dialog-titlebar').append('<label for="rP">Печерская</label><input type="radio" name="chkPlace" id="rP" item_id=3>');
    $('.ui-dialog-titlebar').append('<label for="rNS">Ново-Садовая</label><input type="radio" name="chkPlace" id="rNS" item_id=4>');
    $('.ui-dialog-titlebar').append('<label for="self">Савмовывоз</label><input type="checkbox" name="self" id="self">');

    $("#rP,#rNS").checkboxradio();
    $("#self").checkboxradio();

    switch (curOrder.idKitchen) {
        case 3:
            $("#rP").prop("checked", true);
            $("#rP").checkboxradio('refresh');
            break;
        case 4:
            $("#rNS").prop("checked", true);
            $("#rNS").checkboxradio('refresh');
            break;
        default:
            break;
    }

    $("#rP,#rNS").on("change", function (e) {
        var target = $(e.target);
        var id = target.attr("item_id"); //id kitchen
        var dlg = target.parent().parent();
        dlg.removeClass('ord-workplace-3 ord-workplace-4 ord-workplace-null');
        dlg.addClass("ord-workplace-" + id);
        //if (target.is(":checked")) {
        //} else {
        //}
//        alert(target.attr("id"));
    });

    var cgDDate = $('<div/>', {class: 'ui-widget controlgroupDDate ui-controlgroup-horizontal'}).appendTo(cgOrder);
    cgDDate.append('Дата: <input type="text" id="DDate"/>');
    cgDDate.append('<label for="DTime">Доставить к</label><input name="DTime" id="DTime" value="12:30">');
    //localStorage.dates = ["25.10.2016", "26.10.2016", "29.10.2016"]

    cgDDate.children("#DDate").datepicker({
        showOn: "button",
        buttonImage: "images/calendar.gif",
        buttonImageOnly: true,
        buttonText: "Select date",
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
            curOrder.DDate = dt;
            //selectDate(dt);
        }
    });
//    cgOrder.append(select);
    cgOrder.append('<input type="text" name="comment" id="comment" value="' + curOrder.Comment + '" placeholder="Комментарий" >');
    //cgOrder.append('<label for="horizontal-spinner" class="ui-controlgroup-label"> of cars</label><input id="horizontal-spinner" class="ui-spinner-input">');

    var divProducts = $('<div/>', {
        id: "divProducts",
    }).appendTo(cgOrder);
//divProducts.css("width","100%");

    var tProducts = CreateTable('tProducts', 'tProducts', headerItems, tableItems, footerItems);//["", "", 123, 888]
    divProducts.append(tProducts);

    bindEventsToTable(tProducts);

    var selectPayType = $('<select/>', {
        id: "o_paytype",
        name: "paytype",
//        class: 'ui-widget-header',
    }).append('<label for="paytype">Тип оплаты</label>');
    cgOrder.append(selectPayType);
    selectPayType.append(ArrayToOptionItems(["Ниличными", "Картой", "Онлайн"]));
    selectPayType.selectmenu({
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
//        change: function (event, ui) {
//            var idOrder = parseInt($('#ordViewer').attr("idOrder"));
//            var idStatus = parseInt($(this).val()) + 1;
//            sendRequest('updateOrderStatus', 'idOrder=' + idOrder + '&idStatus=' + idStatus, function (response) {
//                console.log(response);
//            });
//        }
    });
    selectPayType.val(1);
    selectPayType.selectmenu('refresh', true);
    //cgOrder.append('<label for="c">Количество персон</label><input name="с" id="с">');
    cgOrder.append('<button id="bOk" class="ui-button ui-widget ui-corner-all">OK</button>');
    cgOrder.children('#bOk').click(function () {
        console.log(curOrder);
        $(div).parent().dialog('close');
//        var json;
//        sendRequest('CreateOrder', 'order=' + json, function (response) {
//            console.log(response);
//        });

    });
//"Client":{"id":20914,"Code":"","Flat":27,"Name":"","Floor":8,"Phone":79376436017,"Street":"антоново овсеенко","Building":"59В","Entrance":1}

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
            curOrder.idStatus = parseInt($(this).val()) + 1;
            if (curOrder.id !== null)//если заказ редактируется (а не создается)
            {
                sendRequest('updateOrderStatus', 'idOrder=' + curOrder.id + '&idStatus=' + curOrder.idStatus, function (response) {
                    console.log(response);
                });

            }
            //var idOrder = parseInt($('#ordViewer').attr("idOrder"));
            //var idStatus = parseInt($(this).val()) + 1;
        }
    });
    select.val(curOrder.idStatus === null ? 0 : curOrder.idStatus - 1);
    select.selectmenu('refresh', true);

    cgClient.controlgroup({
//        "direction": "vertical"
    });
    cgMenu.controlgroup({
//        "direction": "vertical"
    });
    cgOrder.controlgroup({
//        "direction": "vertical"
    });
    return div;
}

function showOrderEditor(order) {
    curOrder = createOrderObj(order);

    console.log('curOrder');
    console.log(curOrder);
    var ordNo = curOrder.id === null ? " - Новый заказ" : curOrder.No;
    var dlg = CreateDialog('dlgE', 'Заказ ' + ordNo, 'o_orderEditDlg', false);
    //dlgV.dialog( "option", "resizable", true );
    dlg.dialog("option", "height", 700);
    dlg.dialog("option", "width", 1280);
    dlg.dialog("option", "dialogClass", 'noclose ord-workplace-' + curOrder.idKitchen);
    //console.log(order);
    var editor = createOrderEditor(curOrder);
    dlg.append(editor.fadeIn(1000));
    dlg.dialog('open');
}

function bindEventsToTable(table) {
    table.find("tbody tr").hover(
            function () {
//                $(this).children().last().append('<div><span id="bRem" class="ui-icon ui-icon-close rowButton"></span></div>');
                $(this).children().last().append('<span id="bRem" class="ui-icon ui-icon-close rowButton"></span>');
                $("#bRem").click(function () {
                    //alert($(this).parent().parent().attr("item_id"));
                    //console.log(curOrder);
                    console.log(curOrder.Products);
                    var idProduct = parseInt($(this).parent().parent().attr("item_id"));
                    curOrder.Products = curOrder.Products.filter(function (currentValue, index, arr) {
                        return currentValue.id !== idProduct;
                    });
                    console.log(curOrder.Products);
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

function updateEditorClient(client) {
    if (client.id === null) {

    } else {
        $('#phone').val(client.Phones[0]);
        $('#phone2').val(client.Phones[0]);
        $('#address').val(client.Street + ', ' + client.Building + ' ' + client.Flat);
        $("#card").val(client.Card);
        $("#name").val(client.Name);
        $("#floor").val(client.Floor);
        $("#info").val(client.Comment);
//                var e = jQuery.Event("keypress");
//                e.which = 13; //choose the one you want
//                e.keyCode = 13;
//                $($address).trigger(e);

        //if (!ui.item) {
        //    console.log('new client');
        //    curOrder.Client.Phones=$(this).val();
        //}
        //$("#name").val(ui.item.idClient);

    }
}