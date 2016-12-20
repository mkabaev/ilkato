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
    cgClient.append('<input id="address" name="address" type="text" placeholder="Адрес">');
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
                console.log(curOrder.Client);
                curOrder.Client=response;
                console.log(curOrder.Client);
                $address.val(response.Street + ', ' + response.Building + ' ' + response.Flat);
                $($address).suggestions().setOptions({hint: "Исправить адрес на:"});
                $($address).suggestions().update(); //показывает подсказки и не скрывает пока не выберешь
                $("#card").val(curOrder.Client.Card);
                //var e = jQuery.Event("keypress");
                //e.which = 13; //choose the one you want
                //e.keyCode = 13;
                //$($address).trigger(e);
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




!function (a) {
    "use strict";
    "function" == typeof define && define.amd ? define(["jquery"], a) : a(jQuery)
}(function (a) {
    "use strict";
    function b(b, c) {
        var d = this;
        d.element = b, d.el = a(b), d.suggestions = [], d.badQueries = [], d.selectedIndex = -1, d.currentValue = d.element.value, d.intervalId = 0, d.cachedResponse = {}, d.enrichmentCache = {}, d.currentRequest = null, d.inputPhase = a.Deferred(), d.fetchPhase = a.Deferred(), d.enrichPhase = a.Deferred(), d.onChangeTimeout = null, d.triggering = {}, d.$wrapper = null, d.options = a.extend({}, k, c), d.classes = {hint: "suggestions-hint", mobile: "suggestions-mobile", nowrap: "suggestions-nowrap", selected: "suggestions-selected", suggestion: "suggestions-suggestion", subtext: "suggestions-subtext", subtext_inline: "suggestions-subtext suggestions-subtext_inline", subtext_delimiter: "suggestions-subtext-delimiter", subtext_label: "suggestions-subtext suggestions-subtext_label", removeConstraint: "suggestions-remove", value: "suggestions-value"}, d.disabled = !1, d.selection = null, d.$viewport = a(window), d.$body = a(document.body), d.type = null, d.status = {}, d.setupElement(), d.initializer = a.Deferred(), d.el.is(":visible") ? d.initializer.resolve() : d.deferInitialization(), d.initializer.done(a.proxy(d.initialize, d))
    }
    var c = {ENTER: 13, ESC: 27, TAB: 9, SPACE: 32, UP: 38, DOWN: 40}, d = {}, e = ".suggestions", f = "suggestions", g = "\\s\"'~\\*\\.,:\\|\\[\\]\\(\\)\\{\\}<>№", h = new RegExp("[" + g + "]+", "g"), i = "\\-\\+\\/\\\\\\?!@#$%^&", j = new RegExp("[" + i + "]+", "g"), k = {autoSelectFirst: !1, serviceUrl: null, onSearchStart: a.noop, onSearchComplete: a.noop, onSearchError: a.noop, onSuggestionsFetch: null, onSelect: null, onSelectNothing: null, onInvalidateSelection: null, minChars: 1, deferRequestBy: 100, params: {}, paramName: "query", timeout: 3e3, formatResult: null, formatSelected: null, noCache: !1, containerClass: "suggestions-suggestions", tabDisabled: !1, triggerSelectOnSpace: !1, triggerSelectOnEnter: !0, triggerSelectOnBlur: !0, preventBadQueries: !1, hint: "Выберите вариант или продолжите ввод", type: null, requestMode: "suggest", count: 5, $helpers: null, headers: null, scrollOnFocus: !0, mobileWidth: 980, initializeInterval: 100}, l = {chains: {}, on: function (a, b) {
            return this.get(a).push(b), this
        }, get: function (a) {
            var b = this.chains;
            return b[a] || (b[a] = [])
        }}, m = function () {
        var b = 0;
        return{escapeRegExChars: function (a) {
                return a.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&")
            }, escapeHtml: function (b) {
                var c = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#x27;", "/": "&#x2F;"};
                return b && a.each(c, function (a, c) {
                    b = b.replace(new RegExp(a, "g"), c)
                }), b
            }, getDefaultType: function () {
                return a.support.cors ? "POST" : "GET"
            }, getDefaultContentType: function () {
                return a.support.cors ? "application/json" : "application/x-www-form-urlencoded"
            }, fixURLProtocol: function (b) {
                return a.support.cors ? b : b.replace(/^https?:/, location.protocol)
            }, addUrlParams: function (b, c) {
                return b + (/\?/.test(b) ? "&" : "?") + a.param(c)
            }, serialize: function (b) {
                return a.support.cors ? JSON.stringify(b, function (a, b) {
                    return null === b ? void 0 : b
                }) : a.param(b, !0)
            }, compact: function (b) {
                return a.grep(b, function (a) {
                    return!!a
                })
            }, delay: function (a, b) {
                return setTimeout(a, b || 0)
            }, uniqueId: function (a) {
                return(a || "") + ++b
            }, slice: function (a, b) {
                return Array.prototype.slice.call(a, b)
            }, indexBy: function (b, c, d) {
                var e = {};
                return a.each(b, function (b, f) {
                    var g = f[c], h = {};
                    d && (h[d] = b), e[g] = a.extend(!0, h, f)
                }), e
            }, areSame: function c(b, d) {
                var e = !0;
                return typeof b != typeof d ? !1 : "object" == typeof b && null != b && null != d ? (a.each(b, function (a, b) {
                    return e = c(b, d[a])
                }), e) : b === d
            }, arrayMinus: function (b, c) {
                return c ? a.grep(b, function (b, d) {
                    return-1 === a.inArray(b, c)
                }) : b
            }, arrayMinusWithPartialMatching: function (b, c) {
                return c ? a.grep(b, function (a, b) {
                    return!c.some(function (b) {
                        return 0 === b.indexOf(a)
                    })
                }) : b
            }, getWords: function (a, b) {
                a = a.replace(/(\d+)([а-яА-ЯёЁ]{2,})/g, "$1 $2").replace(/([а-яА-ЯёЁ]+)(\d+)/g, "$1 $2");
                var c = this.compact(a.split(h)), d = c.pop(), e = this.arrayMinus(c, b);
                return e.push(d), e
            }, normalize: function (a, b) {
                var c = this;
                return c.getWords(a, b).join(" ")
            }, stringEncloses: function (a, b) {
                return a.length > b.length && -1 !== a.indexOf(b)
            }, fieldsNotEmpty: function (b, c) {
                if (!a.isPlainObject(b))
                    return!1;
                var d = !0;
                return a.each(c, function (a, c) {
                    return d = !!b[c]
                }), d
            }, getDeepValue: function d(a, b) {
                var c = b.split("."), e = c.shift();
                return a && (c.length ? d(a[e], c.join(".")) : a[e])
            }, reWordExtractor: function () {
                return new RegExp("([^" + g + "]*)([" + g + "]*)", "g")
            }, formatToken: function (a) {
                return a && a.toLowerCase().replace(/[ёЁ]/g, "е")
            }, withSubTokens: function (b) {
                var c = [];
                return a.each(b, function (a, b) {
                    var d = b.split(j);
                    c.push(b), d.length > 1 && (c = c.concat(m.compact(d)))
                }), c
            }}
    }(), n = function () {
        function b(b) {
            return function (c) {
                if (0 === c.length)
                    return!1;
                if (1 === c.length)
                    return!0;
                var d = b(c[0].value), e = a.grep(c, function (a) {
                    return 0 === b(a.value).indexOf(d)
                }, !0);
                return 0 === e.length
            }
        }
        var c = b(function (a) {
            return a
        }), d = b(function (a) {
            return a.replace(/, (?:д|вл|двлд|к) .+$/, "")
        });
        return{matchByNormalizedQuery: function (b, c) {
                var d = b.toLowerCase(), e = this && this.stopwords, f = m.normalize(d, e), g = [];
                return a.each(c, function (a, b) {
                    var c = b.value.toLowerCase();
                    return m.stringEncloses(d, c) ? !1 : c.indexOf(f) > 0 ? !1 : void(f === m.normalize(c, e) && g.push(a))
                }), 1 === g.length ? g[0] : -1
            }, matchByWords: function (b, d) {
                var e, f = this && this.stopwords, g = b.toLowerCase(), h = [];
                return c(d) && (e = m.withSubTokens(m.getWords(g, f)), a.each(d, function (a, b) {
                    var c = b.value.toLowerCase();
                    if (m.stringEncloses(g, c))
                        return!1;
                    var d = m.withSubTokens(m.getWords(c, f));
                    0 === m.arrayMinus(e, d).length && h.push(a)
                })), 1 === h.length ? h[0] : -1
            }, matchByWordsAddress: function (b, c) {
                var e, f = this && this.stopwords, g = b.toLowerCase(), h = -1;
                return d(c) && (e = m.withSubTokens(m.getWords(g, f)), a.each(c, function (a, b) {
                    var c = b.value.toLowerCase();
                    if (m.stringEncloses(g, c))
                        return!1;
                    var d = m.withSubTokens(m.getWords(c, f));
                    return 0 === m.arrayMinus(e, d).length ? (h = a, !1) : void 0
                })), h
            }, matchByFields: function (b, c) {
                var d = this && this.stopwords, e = this && this.fieldsStopwords, f = m.withSubTokens(m.getWords(b.toLowerCase(), d)), g = [];
                return 1 === c.length && (e && a.each(e, function (a, b) {
                    var d = m.getDeepValue(c[0], a), e = d && m.withSubTokens(m.getWords(d.toLowerCase(), b));
                    e && e.length && (g = g.concat(e))
                }), 0 === m.arrayMinusWithPartialMatching(f, g).length) ? 0 : -1
            }}
    }();
    !function () {
        function b(a, b) {
            var c = a.data && a.data[b];
            return c && new RegExp("^" + m.escapeRegExChars(c) + "([" + g + "]|$)", "i").test(a.value)
        }
        function c(a, b) {
            return i.test(b) && !i.test(a) ? b : a
        }
        function e(a, b, d, e, f) {
            var g = this, h = g.highlightMatches(a, d, e, f), i = g.highlightMatches(b, d, e, f);
            return c(h, i)
        }
        var f = ["ао", "аобл", "дом", "респ", "а/я", "аал", "автодорога", "аллея", "арбан", "аул", "б-р", "берег", "бугор", "вал", "вл", "волость", "въезд", "высел", "г", "городок", "гск", "д", "двлд", "днп", "дор", "дп", "ж/д_будка", "ж/д_казарм", "ж/д_оп", "ж/д_платф", "ж/д_пост", "ж/д_рзд", "ж/д_ст", "жилзона", "жилрайон", "жт", "заезд", "заимка", "зона", "к", "казарма", "канал", "кв", "кв-л", "км", "кольцо", "комн", "кордон", "коса", "кп", "край", "линия", "лпх", "м", "массив", "местность", "мкр", "мост", "н/п", "наб", "нп", "обл", "округ", "остров", "оф", "п", "п/о", "п/р", "п/ст", "парк", "пгт", "пер", "переезд", "пл", "пл-ка", "платф", "погост", "полустанок", "починок", "пр-кт", "проезд", "промзона", "просек", "просека", "проселок", "проток", "протока", "проулок", "р-н", "рзд", "россия", "рп", "ряды", "с", "с/а", "с/мо", "с/о", "с/п", "с/с", "сад", "сквер", "сл", "снт", "спуск", "ст", "ст-ца", "стр", "тер", "тракт", "туп", "у", "ул", "уч-к", "ф/х", "ферма", "х", "ш", "бульвар", "владение", "выселки", "гаражно-строительный", "город", "деревня", "домовладение", "дорога", "квартал", "километр", "комната", "корпус", "литер", "леспромхоз", "местечко", "микрорайон", "набережная", "область", "переулок", "платформа", "площадка", "площадь", "поселение", "поселок", "проспект", "разъезд", "район", "республика", "село", "сельсовет", "слобода", "сооружение", "станица", "станция", "строение", "территория", "тупик", "улица", "улус", "участок", "хутор", "шоссе"], h = [{id: "kladr_id", fields: ["kladr_id"], forBounds: !1, forLocations: !0}, {id: "postal_code", fields: ["postal_code"], forBounds: !1, forLocations: !0}, {id: "country", fields: ["country"], forBounds: !1, forLocations: !0}, {id: "region", fields: ["region", "region_type", "region_type_full", "region_with_type"], forBounds: !0, forLocations: !0, kladrFormat: {digits: 2, zeros: 11}}, {id: "area", fields: ["area", "area_type", "area_type_full", "area_with_type"], forBounds: !0, forLocations: !0, kladrFormat: {digits: 5, zeros: 8}}, {id: "city", fields: ["city", "city_type", "city_type_full", "city_with_type"], forBounds: !0, forLocations: !0, kladrFormat: {digits: 8, zeros: 5}}, {id: "city_district", fields: ["city_district", "city_district_type", "city_district_type_full", "city_district_with_type"], forBounds: !1, forLocations: !1}, {id: "settlement", fields: ["settlement", "settlement_type", "settlement_type_full", "settlement_with_type"], forBounds: !0, forLocations: !0, kladrFormat: {digits: 11, zeros: 2}}, {id: "street", fields: ["street", "street_type", "street_type_full", "street_with_type"], forBounds: !0, forLocations: !0, kladrFormat: {digits: 15, zeros: 2}}, {id: "house", fields: ["house", "house_type", "house_type_full", "block", "block_type"], forBounds: !0, forLocations: !1, kladrFormat: {digits: 19}}], i = /<strong>/, j = {LEGAL: [2, 2, 5, 1], INDIVIDUAL: [2, 2, 6, 2]};
        d.NAME = {urlSuffix: "fio", matchers: [n.matchByNormalizedQuery, n.matchByWords], fieldNames: {surname: "фамилия", name: "имя", patronymic: "отчество"}, alwaysContinueSelecting: !0, isDataComplete: function (c) {
                var d, e = this, f = e.options.params, g = c.data;
                return a.isFunction(f) && (f = f.call(e.element, c.value)), f && f.parts ? d = a.map(f.parts, function (a) {
                    return a.toLowerCase()
                }) : (d = ["surname", "name"], b(c, "surname") && d.push("patronymic")), m.fieldsNotEmpty(g, d)
            }, composeValue: function (a) {
                return m.compact([a.surname, a.name, a.patronymic]).join(" ")
            }}, d.ADDRESS = {urlSuffix: "address", matchers: [a.proxy(n.matchByNormalizedQuery, {stopwords: f}), a.proxy(n.matchByWordsAddress, {stopwords: f})], dataComponents: h, dataComponentsById: m.indexBy(h, "id", "index"), unformattableTokens: f, enrichmentEnabled: !0, geoEnabled: !0, isDataComplete: function (b) {
                var c = [this.bounds.to || "flat"], d = b.data;
                return!a.isPlainObject(d) || m.fieldsNotEmpty(d, c)
            }, composeValue: function (b, c) {
                return m.compact([b.region_with_type || m.compact([b.region, b.region_type]).join(" "), b.area_with_type || m.compact([b.area_type, b.area]).join(" "), b.city_with_type || m.compact([b.city_type, b.city]).join(" "), a.inArray("city_district", c) >= 0 && (b.city_district_with_type || m.compact([b.city_district_type, b.city_district]).join(" ")), b.settlement_with_type || m.compact([b.settlement_type, b.settlement]).join(" "), b.street_with_type || m.compact([b.street_type, b.street]).join(" "), m.compact([b.house_type, b.house, b.block_type, b.block]).join(" "), m.compact([b.flat_type, b.flat]).join(" "), b.postal_box && "а/я " + b.postal_box]).join(", ")
            }, formatResult: function () {
                var b = [], c = !1;
                return a.each(h, function () {
                    c && b.push(this.id), "city_district" === this.id && (c = !0)
                }), function (c, d, e, f) {
                    var g = this, h = e.data && e.data.city_district_with_type;
                    return c = g.highlightMatches(c, d, e, f), c = g.wrapFormattedValue(c, e), h && (!g.bounds.own.length || g.bounds.own.indexOf("street") >= 0) && !a.isEmptyObject(g.copyDataComponents(e.data, b)) && (c += '<div class="' + g.classes.subtext + '">' + g.highlightMatches(h, d, e) + "</div>"), c
                }
            }()}, d.PARTY = {urlSuffix: "party", matchers: [a.proxy(n.matchByFields, {fieldsStopwords: {value: null, "data.address.value": f, "data.inn": null, "data.ogrn": null}})], dataComponents: h, geoEnabled: !0, formatResult: function (a, b, d, h) {
                var i = this, j = i.type.formatResultInn.call(i, d, b), k = i.highlightMatches(m.getDeepValue(d.data, "ogrn"), b, d), l = c(j, k), n = i.highlightMatches(m.getDeepValue(d.data, "management.name"), b, d), o = m.getDeepValue(d.data, "address.value") || "";
                return i.isMobile && ((h || (h = {})).maxLength = 50), a = e.call(i, a, m.getDeepValue(d.data, "name.latin"), b, d, h), a = i.wrapFormattedValue(a, d), o && (o = o.replace(/^(\d{6}?\s+|Россия,\s+)/i, ""), o = i.isMobile ? o.replace(new RegExp("^([^" + g + "]+[" + g + "]+[^" + g + "]+).*"), "$1") : i.highlightMatches(o, b, d, {unformattableTokens: f})), (l || o || n) && (a += '<div class="' + i.classes.subtext + '"><span class="' + i.classes.subtext_inline + '">' + (l || "") + "</span>" + (c(o, n) || "") + "</div>"), a
            }, formatResultInn: function (b, c) {
                var d, e, f = this, g = b.data && b.data.inn, h = j[b.data && b.data.type], i = /\d/;
                return g ? (e = f.highlightMatches(g, c, b), h && (e = e.split(""), d = a.map(h, function (a) {
                    for (var b, c = ""; a && (b = e.shift()); )
                        c += b, i.test(b) && a--;
                    return c
                }), e = d.join('<span class="' + f.classes.subtext_delimiter + '"></span>') + e.join("")), e) : void 0
            }}, d.EMAIL = {urlSuffix: "email", matchers: [n.matchByNormalizedQuery], isQueryRequestable: function (a) {
                return this.options.suggest_local || a.indexOf("@") >= 0
            }}, d.BANK = {urlSuffix: "bank", matchers: [a.proxy(n.matchByFields, {fieldsStopwords: {value: null, "data.bic": null, "data.swift": null}})], formatResult: function (a, b, c, d) {
                var e = this, h = e.highlightMatches(m.getDeepValue(c.data, "bic"), b, c), i = m.getDeepValue(c.data, "address.value") || "";
                return a = e.highlightMatches(a, b, c, d), a = e.wrapFormattedValue(a, c), i && (i = i.replace(/^\d{6}( РОССИЯ)?, /i, ""), i = e.isMobile ? i.replace(new RegExp("^([^" + g + "]+[" + g + "]+[^" + g + "]+).*"), "$1") : e.highlightMatches(i, b, c, {unformattableTokens: f})), (h || i) && (a += '<div class="' + e.classes.subtext + '"><span class="' + e.classes.subtext_inline + '">' + h + "</span>" + i + "</div>"), a
            }, formatSelected: function (a) {
                return m.getDeepValue(a, "data.name.payment")
            }}, a.extend(k, {suggest_local: !0})
    }();
    var o = {suggest: {defaultParams: {type: m.getDefaultType(), dataType: "json", contentType: m.getDefaultContentType()}, addTypeInUrl: !0}, detectAddressByIp: {defaultParams: {type: "GET", dataType: "json"}, addTypeInUrl: !1}, status: {defaultParams: {type: "GET", dataType: "json"}, addTypeInUrl: !0}, findById: {defaultParams: {type: m.getDefaultType(), dataType: "json", contentType: m.getDefaultContentType()}, addTypeInUrl: !0}}, p = {suggest: {method: "suggest", userSelect: !0, updateValue: !0, enrichmentEnabled: !0}, findById: {method: "findById", userSelect: !1, updateValue: !1, enrichmentEnabled: !1}};
    b.utils = m, b.defaultOptions = k, b.version = "16.8.9", a.Suggestions = b, b.prototype = {initialize: function () {
            var a = this;
            a.uniqueId = m.uniqueId("i"), a.createWrapper(), a.notify("initialize"), a.bindWindowEvents(), a.setOptions(), a.fixPosition()
        }, deferInitialization: function () {
            var a, b = this, c = "mouseover focus keydown", d = function () {
                b.initializer.resolve(), b.enable()
            };
            b.initializer.always(function () {
                b.el.off(c, d), clearInterval(a)
            }), b.disabled = !0, b.el.on(c, d), a = setInterval(function () {
                b.el.is(":visible") && d()
            }, b.options.initializeInterval)
        }, isInitialized: function () {
            return"resolved" === this.initializer.state()
        }, dispose: function () {
            var a = this;
            a.initializer.reject(), a.notify("dispose"), a.el.removeData(f).removeClass("suggestions-input"), a.unbindWindowEvents(), a.removeWrapper(), a.el.trigger("suggestions-dispose")
        }, notify: function (b) {
            var c = this, d = m.slice(arguments, 1);
            return a.map(l.get(b), function (a) {
                return a.apply(c, d)
            })
        }, createWrapper: function () {
            var b = this;
            b.$wrapper = a('<div class="suggestions-wrapper"/>'), b.el.after(b.$wrapper), b.$wrapper.on("mousedown" + e, a.proxy(b.onMousedown, b))
        }, removeWrapper: function () {
            var b = this;
            b.$wrapper && b.$wrapper.remove(), a(b.options.$helpers).off(e)
        }, onMousedown: function (b) {
            var c = this;
            b.preventDefault(), c.cancelBlur = !0, m.delay(function () {
                delete c.cancelBlur
            }), 0 == a(b.target).closest(".ui-menu-item").length && m.delay(function () {
                a(document).one("mousedown", function (b) {
                    var d = c.el.add(c.$wrapper).add(c.options.$helpers);
                    c.options.floating && (d = d.add(c.$container)), d = d.filter(function () {
                        return this === b.target || a.contains(this, b.target)
                    }), d.length || c.hide()
                })
            })
        }, bindWindowEvents: function () {
            var b = this, c = a.proxy(b.fixPosition, b);
            b.$viewport.on("resize" + e + b.uniqueId, c).on("scroll" + e + b.uniqueId, c)
        }, unbindWindowEvents: function () {
            this.$viewport.off("resize" + e + this.uniqueId).off("scroll" + e + this.uniqueId)
        }, scrollToTop: function () {
            var b = this, c = b.options.scrollOnFocus;
            c === !0 && (c = b.el), c instanceof a && c.length > 0 && a("body,html").animate({scrollTop: c.offset().top}, "fast")
        }, setOptions: function (b) {
            var c = this;
            a.extend(c.options, b), a.each({type: d, requestMode: p}, function (b, d) {
                if (c[b] = d[c.options[b]], !c[b])
                    throw c.disable(), "`" + b + "` option is incorrect! Must be one of: " + a.map(d, function (a, b) {
                        return'"' + b + '"'
                    }).join(", ")
            }), a(c.options.$helpers).off(e).on("mousedown" + e, a.proxy(c.onMousedown, c)), c.isInitialized() && c.notify("setOptions")
        }, fixPosition: function (b) {
            var c, d, e = this, f = {};
            e.isMobile = e.$viewport.width() <= e.options.mobileWidth, e.isInitialized() && (!b || "scroll" != b.type || e.options.floating || e.isMobile) && (e.$container.appendTo(e.options.floating ? e.$body : e.$wrapper), e.notify("resetPosition"), e.el.css("paddingLeft", ""), e.el.css("paddingRight", ""), f.paddingLeft = parseFloat(e.el.css("paddingLeft")), f.paddingRight = parseFloat(e.el.css("paddingRight")), a.extend(f, e.el.offset()), f.borderTop = "none" == e.el.css("border-top-style") ? 0 : parseFloat(e.el.css("border-top-width")), f.borderLeft = "none" == e.el.css("border-left-style") ? 0 : parseFloat(e.el.css("border-left-width")), f.innerHeight = e.el.innerHeight(), f.innerWidth = e.el.innerWidth(), f.outerHeight = e.el.outerHeight(), f.componentsLeft = 0, f.componentsRight = 0, c = e.$wrapper.offset(), d = {top: f.top - c.top, left: f.left - c.left}, e.notify("fixPosition", d, f), f.componentsLeft > f.paddingLeft && e.el.css("paddingLeft", f.componentsLeft + "px"), f.componentsRight > f.paddingRight && e.el.css("paddingRight", f.componentsRight + "px"))
        }, clearCache: function () {
            this.cachedResponse = {}, this.enrichmentCache = {}, this.badQueries = []
        }, clear: function () {
            var a = this;
            a.isInitialized() && (a.clearCache(), a.currentValue = "", a.selection = null, a.hide(), a.suggestions = [], a.el.val(""), a.el.trigger("suggestions-clear"), a.notify("clear"))
        }, disable: function () {
            var a = this;
            a.disabled = !0, a.abortRequest(), a.visible && a.hide()
        }, enable: function () {
            this.disabled = !1
        }, isUnavailable: function () {
            return this.disabled
        }, update: function () {
            var a = this, b = a.el.val();
            a.isInitialized() && (a.currentValue = b, a.isQueryRequestable(b) ? a.updateSuggestions(b) : a.hide())
        }, setSuggestion: function (b) {
            var c, d, e = this;
            a.isPlainObject(b) && a.isPlainObject(b.data) && (b = a.extend(!0, {}, b), e.bounds.own.length && (e.checkValueBounds(b), c = e.copyDataComponents(b.data, e.bounds.all), b.data.kladr_id && (c.kladr_id = e.getBoundedKladrId(b.data.kladr_id, e.bounds.all)), b.data = c), e.selection = b, e.suggestions = [b], d = e.getSuggestionValue(b) || "", e.currentValue = d, e.el.val(d), e.abortRequest(), e.el.trigger("suggestions-set"))
        }, fixData: function () {
            var b = this, c = b.extendedCurrentValue(), d = b.el.val(), e = a.Deferred();
            e.done(function (a) {
                b.selectSuggestion(a, 0, d, {hasBeenEnriched: !0}), b.el.trigger("suggestions-fixdata", a)
            }).fail(function () {
                b.selection = null, b.currentValue = "", b.el.val(b.currentValue), b.el.trigger("suggestions-fixdata")
            }), b.isQueryRequestable(c) ? (b.currentValue = c, b.getSuggestions(c, {count: 1, from_bound: null, to_bound: null}).done(function (a) {
                var b = a[0];
                b ? e.resolve(b) : e.reject()
            }).fail(function () {
                e.reject()
            })) : e.reject()
        }, extendedCurrentValue: function () {
            var b = this, c = b.getParentInstance(), d = c && c.extendedCurrentValue(), e = a.trim(b.el.val());
            return m.compact([d, e]).join(" ")
        }, getAjaxParams: function (c, d) {
            var e = this, f = a.trim(e.options.token), g = a.trim(e.options.partner), h = e.options.serviceUrl, i = o[c], j = a.extend({timeout: e.options.timeout}, i.defaultParams), k = {};
            return/\/$/.test(h) || (h += "/"), h += c, i.addTypeInUrl && (h += "/" + e.type.urlSuffix), h = m.fixURLProtocol(h), a.support.cors ? (f && (k.Authorization = "Token " + f), g && (k["X-Partner"] = g), k["X-Version"] = b.version, j.headers || (j.headers = {}), a.extend(j.headers, e.options.headers, k)) : (f && (k.token = f), g && (k.partner = g), k.version = b.version, h = m.addUrlParams(h, k)), j.url = h, a.extend(j, d)
        }, isQueryRequestable: function (a) {
            var b, c = this;
            return b = a.length >= c.options.minChars, b && c.type.isQueryRequestable && (b = c.type.isQueryRequestable.call(c, a)), b
        }, constructRequestParams: function (b, c) {
            var d = this, e = d.options, f = a.isFunction(e.params) ? e.params.call(d.element, b) : a.extend({}, e.params);
            return d.type.constructRequestParams && a.extend(f, d.type.constructRequestParams.call(d)), a.each(d.notify("requestParams"), function (b, c) {
                a.extend(f, c)
            }), f[e.paramName] = b, a.isNumeric(e.count) && e.count > 0 && (f.count = e.count), a.extend(f, c)
        }, updateSuggestions: function (a) {
            var b = this;
            b.fetchPhase = b.getSuggestions(a).done(function (c) {
                b.assignSuggestions(c, a)
            })
        }, getSuggestions: function (b, c, d) {
            var e, f = this, g = f.options, h = d && d.noCallbacks, i = d && d.useEnrichmentCache, j = f.constructRequestParams(b, c), k = a.param(j || {}), l = a.Deferred();
            return e = f.cachedResponse[k], e && a.isArray(e.suggestions) ? l.resolve(e.suggestions) : f.isBadQuery(b) ? l.reject() : h || g.onSearchStart.call(f.element, j) !== !1 ? f.doGetSuggestions(j).done(function (a) {
                f.processResponse(a) && b == f.currentValue ? (g.noCache || (i ? f.enrichmentCache[b] = a.suggestions[0] : (f.enrichResponse(a, b), f.cachedResponse[k] = a, g.preventBadQueries && 0 === a.suggestions.length && f.badQueries.push(b))), l.resolve(a.suggestions)) : l.reject(), h || g.onSearchComplete.call(f.element, b, a.suggestions)
            }).fail(function (a, c, d) {
                l.reject(), h || "abort" === c || g.onSearchError.call(f.element, b, a, c, d)
            }) : l.reject(), l
        }, doGetSuggestions: function (b) {
            var c = this, d = a.ajax(c.getAjaxParams(c.requestMode.method, {data: m.serialize(b)}));
            return c.abortRequest(), c.currentRequest = d, c.notify("request"), d.always(function () {
                c.currentRequest = null, c.notify("request")
            }), d
        }, isBadQuery: function (b) {
            if (!this.options.preventBadQueries)
                return!1;
            var c = !1;
            return a.each(this.badQueries, function (a, d) {
                return!(c = 0 === b.indexOf(d))
            }), c
        }, abortRequest: function () {
            var a = this;
            a.currentRequest && a.currentRequest.abort()
        }, processResponse: function (b) {
            var c, d = this;
            return b && a.isArray(b.suggestions) ? (d.verifySuggestionsFormat(b.suggestions), d.setUnrestrictedValues(b.suggestions), a.isFunction(d.options.onSuggestionsFetch) && (c = d.options.onSuggestionsFetch.call(d.element, b.suggestions), a.isArray(c) && (b.suggestions = c)), !0) : !1
        }, verifySuggestionsFormat: function (b) {
            "string" == typeof b[0] && a.each(b, function (a, c) {
                b[a] = {value: c, data: null}
            })
        }, getSuggestionValue: function (b, c) {
            var d, e = this, f = e.options.formatSelected || e.type.formatSelected, g = c && c.hasSameValues, h = c && c.hasBeenEnriched;
            return a.isFunction(f) && (d = f.call(e, b)), ("string" != typeof d || 0 == d.length) && (d = b.value, e.type.composeValue && (h ? e.options.restrict_value ? d = e.type.composeValue(e.getUnrestrictedData(b.data), g && ["city_district"]) : e.bounds.own.indexOf("street") >= 0 && (d = e.type.composeValue(e.copyDataComponents(b.data, e.bounds.own.concat(["city_district"])), g && ["city_district"])) : g && (d = e.options.restrict_value ? e.type.composeValue(e.getUnrestrictedData(b.data), ["city_district"]) : e.bounds.own.indexOf("street") >= 0 ? e.type.composeValue(e.copyDataComponents(b.data, e.bounds.own.concat(["city_district"])), ["city_district"]) : b.unrestricted_value))), d
        }, hasSameValues: function (b) {
            var c = !1;
            return a.each(this.suggestions, function (a, d) {
                return d.value === b.value && d !== b ? (c = !0, !1) : void 0
            }), c
        }, assignSuggestions: function (a, b) {
            var c = this;
            c.suggestions = a, c.notify("assignSuggestions", b)
        }, shouldRestrictValues: function () {
            var a = this;
            return a.options.restrict_value && a.constraints && 1 == Object.keys(a.constraints).length
        }, setUnrestrictedValues: function (b) {
            var c = this, d = c.shouldRestrictValues(), e = c.getFirstConstraintLabel();
            a.each(b, function (a, b) {
                b.unrestricted_value || (b.unrestricted_value = d ? e + ", " + b.value : b.value)
            })
        }, areSuggestionsSame: function (a, b) {
            return a && b && a.value === b.value && m.areSame(a.data, b.data)
        }}, function () {
        var d = {setupElement: function () {
                this.el.attr("autocomplete", "off").addClass("suggestions-input").css("box-sizing", "border-box")
            }, bindElementEvents: function () {
                var b = this;
                b.el.on("keydown" + e, a.proxy(b.onElementKeyDown, b)), b.el.on(["keyup" + e, "cut" + e, "paste" + e, "input" + e].join(" "), a.proxy(b.onElementKeyUp, b)), b.el.on("blur" + e, a.proxy(b.onElementBlur, b)), b.el.on("focus" + e, a.proxy(b.onElementFocus, b))
            }, unbindElementEvents: function () {
                this.el.off(e)
            }, onElementBlur: function () {
                var a = this;
                return a.cancelBlur ? void(a.cancelBlur = !1) : (a.options.triggerSelectOnBlur ? a.isUnavailable() || a.selectCurrentValue({noSpace: !0}).always(function () {
                    a.hide()
                }) : a.hide(), void(a.fetchPhase.abort && a.fetchPhase.abort()))
            }, onElementFocus: function () {
                var b = this;
                b.cancelFocus || m.delay(a.proxy(b.completeOnFocus, b)), b.cancelFocus = !1
            }, onElementKeyDown: function (a) {
                var b = this;
                if (!b.isUnavailable())
                    if (b.visible) {
                        switch (a.which) {
                            case c.ESC:
                                b.el.val(b.currentValue), b.hide(), b.abortRequest();
                                break;
                                case c.TAB:
                                if (b.options.tabDisabled === !1)
                                    return;
                                break;
                                case c.ENTER:
                                b.options.triggerSelectOnEnter && b.selectCurrentValue();
                                break;
                                case c.SPACE:
                                return void(b.options.triggerSelectOnSpace && b.isCursorAtEnd() && (a.preventDefault(), b.selectCurrentValue({continueSelecting: !0, dontEnrich: !0}).fail(function () {
                                    b.currentValue += " ", b.el.val(b.currentValue), b.proceedChangedValue()
                                })));
                                case c.UP:
                                b.moveUp();
                                break;
                                case c.DOWN:
                                b.moveDown();
                                break;
                                default:
                                return
                            }
                        a.stopImmediatePropagation(), a.preventDefault()
                    } else
                        switch (a.which) {
                            case c.DOWN:
                                b.suggest();
                                break;
                                case c.ENTER:
                                b.options.triggerSelectOnEnter && b.triggerOnSelectNothing()
                                }
            }, onElementKeyUp: function (a) {
                var b = this;
                if (!b.isUnavailable()) {
                    switch (a.which) {
                        case c.UP:
                        case c.DOWN:
                        case c.ENTER:
                            return
                        }
                    clearTimeout(b.onChangeTimeout), b.inputPhase.reject(), b.currentValue !== b.el.val() && b.proceedChangedValue()
                }
            }, proceedChangedValue: function () {
                var b = this;
                b.abortRequest(), b.inputPhase = a.Deferred().done(a.proxy(b.onValueChange, b)), b.options.deferRequestBy > 0 ? b.onChangeTimeout = m.delay(function () {
                    b.inputPhase.resolve()
                }, b.options.deferRequestBy) : b.inputPhase.resolve()
            }, onValueChange: function () {
                var a, b = this;
                b.selection && (a = b.selection, b.selection = null, b.trigger("InvalidateSelection", a)), b.selectedIndex = -1, b.update(), b.notify("valueChange")
            }, completeOnFocus: function () {
                var a = this;
                a.isUnavailable() || a.isElementFocused() && (a.fixPosition(), a.update(), a.isMobile && (a.setCursorAtEnd(), a.scrollToTop()))
            }, isElementFocused: function () {
                return document.activeElement === this.element
            }, isCursorAtEnd: function () {
                var a, b, c = this, d = c.el.val().length;
                try {
                    if (a = c.element.selectionStart, "number" == typeof a)
                        return a === d
                } catch (e) {
                }
                return document.selection ? (b = document.selection.createRange(), b.moveStart("character", -d), d === b.text.length) : !0
            }, setCursorAtEnd: function () {
                var a = this.element;
                try {
                    a.selectionEnd = a.selectionStart = a.value.length, a.scrollLeft = a.scrollWidth
                } catch (b) {
                    a.value = a.value
                }
            }};
        a.extend(b.prototype, d), l.on("initialize", d.bindElementEvents).on("dispose", d.unbindElementEvents)
    }(), function () {
        function c() {
            a.each(d, function () {
                this.abort()
            }), d = {}
        }
        var d = {};
        c();
        var e = {checkStatus: function () {
                function b(b) {
                    a.isFunction(c.options.onSearchError) && c.options.onSearchError.call(c.element, null, g, "error", b)
                }
                var c = this, e = a.trim(c.options.token), f = c.options.type + e, g = d[f];
                g || (g = d[f] = a.ajax(c.getAjaxParams("status"))), g.done(function (d) {
                    d.search ? a.extend(c.status, d) : b("Service Unavailable")
                }).fail(function () {
                    b(g.statusText)
                })
            }};
        b.resetTokens = c, a.extend(b.prototype, e), l.on("setOptions", e.checkStatus)
    }(), function () {
        function c() {
            d = null, b.defaultOptions.geoLocation = e
        }
        if ("GET" != m.getDefaultType()) {
            var d, e = !0, f = {checkLocation: function () {
                    var b = this, c = b.options.geoLocation;
                    b.type.geoEnabled && c && (b.geoLocation = a.Deferred(), a.isPlainObject(c) || a.isArray(c) ? b.geoLocation.resolve(c) : (d || (d = a.ajax(b.getAjaxParams("detectAddressByIp"))), d.done(function (a) {
                        var c = a && a.location && a.location.data;
                        c && c.kladr_id ? b.geoLocation.resolve(c) : b.geoLocation.reject()
                    }).fail(function () {
                        b.geoLocation.reject()
                    })))
                }, getGeoLocation: function () {
                    return this.geoLocation
                }, constructParams: function () {
                    var b = this, c = {};
                    return b.geoLocation && a.isFunction(b.geoLocation.promise) && "resolved" == b.geoLocation.state() && b.geoLocation.done(function (b) {
                        c.locations_boost = a.makeArray(b)
                    }), c
                }};
            a.extend(k, {geoLocation: e}), a.extend(b, {resetLocation: c}), a.extend(b.prototype, {getGeoLocation: f.getGeoLocation}), l.on("setOptions", f.checkLocation).on("requestParams", f.constructParams)
        }
    }(), function () {
        var c = {enrichSuggestion: function (b, c) {
                var d = this, e = a.Deferred();
                return!d.status.enrich || !d.type.enrichmentEnabled || !d.requestMode.enrichmentEnabled || c && c.dontEnrich ? e.resolve(b) : b.data && null != b.data.qc ? e.resolve(b) : (d.disableDropdown(), d.currentValue = b.unrestricted_value, d.enrichPhase = d.getSuggestions(b.unrestricted_value, {count: 1, locations: null, locations_boost: null, from_bound: null, to_bound: null}, {noCallbacks: !0, useEnrichmentCache: !0}).always(function () {
                    d.enableDropdown()
                }).done(function (a) {
                    var c = a && a[0];
                    e.resolve(c || b, !!c)
                }).fail(function () {
                    e.resolve(b)
                }), e)
            }, enrichResponse: function (b, c) {
                var d = this, e = d.enrichmentCache[c];
                e && a.each(b.suggestions, function (a, d) {
                    return d.value === c ? (b.suggestions[a] = e, !1) : void 0
                })
            }};
        a.extend(b.prototype, c)
    }(), function () {
        function c(b) {
            return a.map(b, function (a) {
                var b = m.escapeHtml(a.text);
                return b && a.matched && (b = "<strong>" + b + "</strong>"), b
            }).join("")
        }
        function d(b, c) {
            var d = b.split(", ");
            return 1 === d.length ? b : a.map(d, function (a) {
                return'<span class="' + c + '">' + a + "</span>"
            }).join(", ")
        }
        function f(b, c) {
            var d = !1;
            return a.each(b, function (a, b) {
                return d = b.value == c.value && b != c, d ? !1 : void 0
            }), d
        }
        var g = {width: "auto", floating: !1}, j = {createContainer: function () {
                var b = this, c = "." + b.classes.suggestion, d = b.options, f = a("<div/>").addClass(d.containerClass).css({position: "absolute", display: "none"});
                b.$container = f, f.on("click" + e, c, a.proxy(b.onSuggestionClick, b))
            }, removeContainer: function () {
                var a = this;
                a.options.floating && a.$container.remove()
            }, setContainerOptions: function () {
                var b = this, c = "mousedown" + e;
                b.$container.off(c), b.options.floating && b.$container.on(c, a.proxy(b.onMousedown, b))
            }, onSuggestionClick: function (b) {
                var c, d = this, e = a(b.target);
                if (!d.dropdownDisabled) {
                    for (d.cancelFocus = !0, d.el.focus(); e.length && !(c = e.attr("data-index")); )
                        e = e.closest("." + d.classes.suggestion);
                    c && !isNaN(c) && d.select(+c)
                }
            }, setDropdownPosition: function (a, b) {
                var c, d = this, e = d.$viewport.scrollLeft();
                d.isMobile ? (c = d.options.floating ? {left: e + "px", top: b.top + b.outerHeight + "px"} : {left: a.left - b.left + e + "px", top: a.top + b.outerHeight + "px"}, c.width = d.$viewport.width() + "px") : (c = d.options.floating ? {left: b.left + "px", top: b.top + b.borderTop + b.innerHeight + "px"} : {left: a.left + "px", top: a.top + b.borderTop + b.innerHeight + "px"}, m.delay(function () {
                    var a = d.options.width;
                    "auto" === a && (a = d.el.outerWidth()), d.$container.outerWidth(a)
                })), d.$container.toggleClass(d.classes.mobile, d.isMobile).css(c), d.containerItemsPadding = b.left + b.borderLeft + b.paddingLeft - e
            }, setItemsPositions: function () {
                var a = this, b = a.getSuggestionsItems();
                b.css("paddingLeft", a.isMobile ? a.containerItemsPadding + "px" : "")
            }, getSuggestionsItems: function () {
                return this.$container.children("." + this.classes.suggestion)
            }, toggleDropdownEnabling: function (a) {
                this.dropdownDisabled = !a, this.$container.attr("disabled", !a)
            }, disableDropdown: function () {
                this.toggleDropdownEnabling(!1)
            }, enableDropdown: function () {
                this.toggleDropdownEnabling(!0)
            }, hasSuggestionsToChoose: function () {
                var b = this;
                return b.suggestions.length > 1 || 1 === b.suggestions.length && (!b.selection || a.trim(b.suggestions[0].value) !== a.trim(b.selection.value))
            }, suggest: function () {
                var b, c, d = this, e = d.options;
                if (d.requestMode.userSelect) {
                    if (!d.hasSuggestionsToChoose())
                        return void d.hide();
                    b = e.formatResult || d.type.formatResult || d.formatResult, c = [], !d.isMobile && e.hint && d.suggestions.length && c.push('<div class="' + d.classes.hint + '">' + e.hint + "</div>"), d.selectedIndex = -1, a.each(d.suggestions, function (a, e) {
                        var f = d.makeSuggestionLabel(d.suggestions, e);
                        e == d.selection && (d.selectedIndex = a), c.push('<div class="' + d.classes.suggestion + '" data-index="' + a + '">'), c.push(b.call(d, e.value, d.currentValue, e, {unformattableTokens: d.type.unformattableTokens})), f && c.push('<span class="' + d.classes.subtext_label + '">' + m.escapeHtml(f) + "</span>"), c.push("</div>")
                    }), d.$container.html(c.join("")), e.autoSelectFirst && -1 === d.selectedIndex && (d.selectedIndex = 0), -1 !== d.selectedIndex && d.getSuggestionsItems().eq(d.selectedIndex).addClass(d.classes.selected), a.isFunction(e.beforeRender) && e.beforeRender.call(d.element, d.$container), d.$container.show(), d.visible = !0, d.fixPosition(), d.setItemsPositions()
                }
            }, wrapFormattedValue: function (a, b) {
                var c = this, d = m.getDeepValue(b.data, "state.status");
                return'<span class="' + c.classes.value + '"' + (d ? ' data-suggestion-status="' + d + '"' : "") + ">" + a + "</span>"
            }, formatResult: function (a, b, c, d) {
                var e = this;
                return a = e.highlightMatches(a, b, c, d), e.wrapFormattedValue(a, c)
            }, highlightMatches: function (b, e, f, g) {
                var j, k, l, n, o, p, q, r, s = this, t = [], u = g && g.unformattableTokens, v = g && g.maxLength, w = m.reWordExtractor();
                if (!b)
                    return"";
                for (j = m.compact(m.formatToken(e).split(h)), l = m.arrayMinus(j, u), j = m.withSubTokens(l.concat(m.arrayMinus(j, l))), k = a.map(j, function(a){return new RegExp("^((.*)([" + i + "]+))?(" + m.escapeRegExChars(a) + ")([^" + i + "]*[" + i + "]*)", "i")}); (n = w.exec(b)) && n[0]; )
                    o = n[1],
                            t.push({text: o, hasUpperCase: o.toLowerCase() !== o, formatted: m.formatToken(o), matchable: !0}), n[2] && t.push({text: n[2]});
                for (p = 0; p < t.length; p++)
                    q = t[p], !q.matchable || q.matched || -1 !== a.inArray(q.formatted, u) && !q.hasUpperCase || a.each(k, function (a, b) {
                        var c, d = b.exec(q.formatted), e = p + 1;
                        return d ? (d = {before: d[1] || "", beforeText: d[2] || "", beforeDelimiter: d[3] || "", text: d[4] || "", after: d[5] || ""}, d.before && (t.splice(p, 0, {text: q.text.substr(0, d.beforeText.length), formatted: d.beforeText, matchable: !0}, {text: d.beforeDelimiter}), e += 2, c = d.before.length, q.text = q.text.substr(c), q.formatted = q.formatted.substr(c), p--), c = d.text.length + d.after.length, q.formatted.length > c && (t.splice(e, 0, {text: q.text.substr(c), formatted: q.formatted.substr(c), matchable: !0}), q.text = q.text.substr(0, c), q.formatted = q.formatted.substr(0, c)), d.after && (c = d.text.length, t.splice(e, 0, {text: q.text.substr(c), formatted: q.formatted.substr(c)}), q.text = q.text.substr(0, c), q.formatted = q.formatted.substr(0, c)), q.matched = !0, !1) : void 0
                    });
                if (v) {
                    for (p = 0; p < t.length && v >= 0; p++)
                        q = t[p], v -= q.text.length, 0 > v && (q.text = q.text.substr(0, q.text.length + v) + "...");
                    t.length = p
                }
                return r = c(t), d(r, s.classes.nowrap)
            }, makeSuggestionLabel: function (b, c) {
                var d, e, g = this, h = g.type.fieldNames, i = {}, j = m.reWordExtractor(), k = [];
                if (h && f(b, c) && c.data && (a.each(h, function (a) {
                    var b = c.data[a];
                    b && (i[a] = m.formatToken(b))
                }), !a.isEmptyObject(i))) {
                    for (; (d = j.exec(m.formatToken(c.value))) && (e = d[1]); )
                        a.each(i, function (a, b) {
                            return b == e ? (k.push(h[a]), delete i[a], !1) : void 0
                        });
                    if (k.length)
                        return k.join(", ")
                }
            }, hide: function () {
                var a = this;
                a.visible = !1, a.selectedIndex = -1, a.$container.hide().empty()
            }, activate: function (a) {
                var b, c, d = this, e = d.classes.selected;
                return!d.dropdownDisabled && (c = d.getSuggestionsItems(), c.removeClass(e), d.selectedIndex = a, -1 !== d.selectedIndex && c.length > d.selectedIndex) ? (b = c.eq(d.selectedIndex), b.addClass(e), b) : null
            }, deactivate: function (a) {
                var b = this;
                b.dropdownDisabled || (b.selectedIndex = -1, b.getSuggestionsItems().removeClass(b.classes.selected), a && b.el.val(b.currentValue))
            }, moveUp: function () {
                var a = this;
                if (!a.dropdownDisabled)
                    return-1 === a.selectedIndex ? void(a.suggestions.length && a.adjustScroll(a.suggestions.length - 1)) : 0 === a.selectedIndex ? void a.deactivate(!0) : void a.adjustScroll(a.selectedIndex - 1)
            }, moveDown: function () {
                var a = this;
                if (!a.dropdownDisabled)
                    return a.selectedIndex === a.suggestions.length - 1 ? void a.deactivate(!0) : void a.adjustScroll(a.selectedIndex + 1)
            }, adjustScroll: function (a) {
                var b, c, d, e = this, f = e.activate(a), g = e.$container.scrollTop();
                f && f.length && (b = f.position().top, 0 > b ? e.$container.scrollTop(g + b) : (c = b + f.outerHeight(), d = e.$container.innerHeight(), c > d && e.$container.scrollTop(g - d + c)), e.el.val(e.suggestions[a].value))
            }};
        a.extend(k, g), a.extend(b.prototype, j), l.on("initialize", j.createContainer).on("dispose", j.removeContainer).on("setOptions", j.setContainerOptions).on("fixPosition", j.setDropdownPosition).on("fixPosition", j.setItemsPositions).on("assignSuggestions", j.suggest)
    }(), function () {
        var b = "addon", c = 50, d = 1e3, e = {addon: null}, f = {NONE: "none", SPINNER: "spinner", CLEAR: "clear"}, g = function (b) {
            var c = this, d = a('<span class="suggestions-addon"/>');
            c.owner = b, c.$el = d, c.type = f.NONE, c.visible = !1, c.initialPadding = null, d.on("click", a.proxy(c, "onClick"))
        };
        g.prototype = {checkType: function () {
                var b = this, c = b.owner.options.addon, d = !1;
                a.each(f, function (a, b) {
                    return d = b == c, d ? !1 : void 0
                }), d || (c = b.owner.isMobile ? f.CLEAR : f.SPINNER), c != b.type && (b.type = c, b.$el.attr("data-addon-type", c), b.toggle(!0))
            }, toggle: function (a) {
                var b, c = this;
                switch (c.type) {
                    case f.CLEAR:
                        b = !!c.owner.currentValue;
                        break;
                        case f.SPINNER:
                        b = !!c.owner.currentRequest;
                        break;
                        default:
                        b = !1
                    }
                b != c.visible && (c.visible = b, b ? c.show(a) : c.hide(a))
            }, show: function (a) {
                var b = this, d = {opacity: 1};
                a ? (b.$el.show().css(d), b.showBackground(!0)) : b.$el.stop(!0, !0).delay(c).queue(function () {
                    b.$el.show(), b.showBackground(), b.$el.dequeue()
                }).animate(d, "fast")
            }, hide: function (a) {
                var b = this, c = {opacity: 0};
                a && b.$el.hide().css(c), b.$el.stop(!0).animate(c, {duration: "fast", complete: function () {
                        b.$el.hide(), b.hideBackground()
                    }})
            }, fixPosition: function (a, b) {
                var c = this, d = b.innerHeight;
                c.checkType(), c.$el.css({left: a.left + b.borderLeft + b.innerWidth - d + "px", top: a.top + b.borderTop + "px", height: d, width: d}), c.initialPadding = b.paddingRight, c.width = d, c.visible && (b.componentsRight += d)
            }, showBackground: function (a) {
                var c = this, d = c.owner.el, e = {paddingRight: c.width};
                c.width > c.initialPadding && (c.stopBackground(), a ? d.css(e):d.animate(e, {duration: "fast", queue : b}).dequeue(b))
            }, hideBackground: function (a) {
                var c = this, e = c.owner.el, f = {paddingRight: c.initialPadding};
                c.width > c.initialPadding && (c.stopBackground(!0), a ? e.css(f):e.delay(d, b).animate(f, {duration: "fast", queue : b}).dequeue(b))
            }, stopBackground: function (a) {
                this.owner.el.stop(b, !0, a)
            }, onClick: function (a) {
                var b = this;
                b.type == f.CLEAR && b.owner.clear()
            }};
        var h = {createAddon: function () {
                var a = this, b = new g(a);
                a.$wrapper.append(b.$el), a.addon = b
            }, fixAddonPosition: function (a, b) {
                this.addon.fixPosition(a, b)
            }, checkAddonType: function () {
                this.addon.checkType()
            }, checkAddonVisibility: function () {
                this.addon.toggle()
            }, stopBackground: function () {
                this.addon.stopBackground()
            }};
        a.extend(k, e), l.on("initialize", h.createAddon).on("setOptions", h.checkAddonType).on("fixPosition", h.fixAddonPosition).on("clear", h.checkAddonVisibility).on("valueChange", h.checkAddonVisibility).on("request", h.checkAddonVisibility).on("resetPosition", h.stopBackground)
    }(), function () {
        function c(b, c) {
            var d = c.selection, e = d && d.data && c.bounds;
            return e && a.each(c.bounds.all, function (a, c) {
                return e = d.data[c] === b.data[c]
            }), e
        }
        var d = {constraints: null, restrict_value: !1}, e = function (b, c) {
            var d = this;
            d.instance = c, d.fields = {}, d.specificity = -1, a.isPlainObject(b) && c.type.dataComponents && a.each(c.type.dataComponents, function (a, c) {
                var e = c.id;
                c.forLocations && b[e] && (d.fields[e] = b[e], d.specificity = a)
            }), d.fields.kladr_id && (d.fields = {kladr_id: d.fields.kladr_id}, d.specificity = d.getKladrSpecificity(d.fields.kladr_id))
        };
        a.extend(e.prototype, {getLabel: function () {
                return this.instance.type.composeValue(this.fields)
            }, getFields: function () {
                return this.fields
            }, isValid: function () {
                return!a.isEmptyObject(this.fields)
            }, getKladrSpecificity: function (b) {
                var c, d = -1;
                return this.significantKladr = b.replace(/^(\d{2})(\d*?)(0+)$/g, "$1$2"), c = this.significantKladr.length, a.each(this.instance.type.dataComponents, function (a, b) {
                    b.kladrFormat && c === b.kladrFormat.digits && (d = a)
                }), d
            }, containsData: function (b) {
                var c = !0;
                return this.fields.kladr_id ? !!b.kladr_id && 0 === b.kladr_id.indexOf(this.significantKladr) : (a.each(this.fields, function (a, d) {
                    return c = !!b[a] && b[a].toLowerCase() === d.toLowerCase()
                }), c)
            }}), b.ConstraintLocation = e;
        var f = function (b, c) {
            this.id = m.uniqueId("c"), this.deletable = !!b.deletable, this.instance = c, this.locations = a.map(a.makeArray(b && (b.locations || b.restrictions)), function (a) {
                return new e(a, c)
            }), this.locations = a.grep(this.locations, function (a) {
                return a.isValid()
            }), this.label = b.label, null == this.label && c.type.composeValue && (this.label = a.map(this.locations, function (a) {
                return a.getLabel()
            }).join(", ")), this.label && this.isValid() && (this.$el = a(document.createElement("li")).append(a(document.createElement("span")).text(this.label)).attr("data-constraint-id", this.id), this.deletable && this.$el.append(a(document.createElement("span")).addClass(c.classes.removeConstraint)))
        };
        a.extend(f.prototype, {isValid: function () {
                return this.locations.length > 0
            }, getFields: function () {
                return a.map(this.locations, function (a) {
                    return a.getFields()
                })
            }});
        var g = {createConstraints: function () {
                var b = this;
                b.constraints = {}, b.$constraints = a('<ul class="suggestions-constraints"/>'), b.$wrapper.append(b.$constraints), b.$constraints.on("click", "." + b.classes.removeConstraint, a.proxy(b.onConstraintRemoveClick, b))
            }, setConstraintsPosition: function (a, b) {
                var c = this;
                c.$constraints.css({left: a.left + b.borderLeft + b.paddingLeft + "px", top: a.top + b.borderTop + Math.round((b.innerHeight - c.$constraints.height()) / 2) + "px"}), b.componentsLeft += c.$constraints.outerWidth(!0) + b.paddingLeft
            }, onConstraintRemoveClick: function (b) {
                var c = this, d = a(b.target).closest("li"), e = d.attr("data-constraint-id");
                delete c.constraints[e], c.update(), d.fadeOut("fast", function () {
                    c.removeConstraint(e)
                })
            }, setupConstraints: function () {
                var b, c = this, d = c.options.constraints;
                return d ? void(d instanceof a || "string" == typeof d || "number" == typeof d.nodeType ? (b = a(d), b.is(c.constraints) || (c.unbindFromParent(), b.is(c.el) || (c.constraints = b, c.bindToParent()))) : (c._constraintsUpdating = !0, a.each(c.constraints, a.proxy(c.removeConstraint, c)), a.each(a.makeArray(d), function (a, b) {
                    c.addConstraint(b)
                }), c._constraintsUpdating = !1, c.fixPosition())) : void c.unbindFromParent()
            }, filteredLocation: function (b) {
                var c = [], d = {};
                return a.each(this.type.dataComponents, function () {
                    this.forLocations && c.push(this.id)
                }), a.isPlainObject(b) && a.each(b, function (a, b) {
                    b && c.indexOf(a) >= 0 && (d[a] = b)
                }), a.isEmptyObject(d) ? void 0 : d.kladr_id ? {kladr_id: d.kladr_id} : d
            }, addConstraint: function (a) {
                var b = this;
                a = new f(a, b), a.isValid() && (b.constraints[a.id] = a, a.$el && (b.$constraints.append(a.$el), b._constraintsUpdating || b.fixPosition()))
            }, removeConstraint: function (a) {
                var b = this;
                delete b.constraints[a], b.$constraints.children('[data-constraint-id="' + a + '"]').remove(), b._constraintsUpdating || b.fixPosition()
            }, constructConstraintsParams: function () {
                for (var b, c, d = this, f = [], g = d.constraints, h = {}; g instanceof a && (b = g.suggestions()) && !(c = m.getDeepValue(b, "selection.data")); )
                    g = b.constraints;
                return g instanceof a ? (c = new e(c, b).getFields(), c && (h.locations = [c], h.restrict_value = !0)) : g && (a.each(g, function (a, b) {
                    f = f.concat(b.getFields())
                }), f.length && (h.locations = f, h.restrict_value = d.options.restrict_value)), h
            }, getFirstConstraintLabel: function () {
                var b = this, c = a.isPlainObject(b.constraints) && Object.keys(b.constraints)[0];
                return c ? b.constraints[c].label : ""
            }, bindToParent: function () {
                var b = this;
                b.constraints.on(["suggestions-select." + b.uniqueId, "suggestions-invalidateselection." + b.uniqueId, "suggestions-clear." + b.uniqueId].join(" "), a.proxy(b.onParentSelectionChanged, b)).on("suggestions-dispose." + b.uniqueId, a.proxy(b.onParentDispose, b))
            }, unbindFromParent: function () {
                var b = this, c = b.constraints;
                c instanceof a && c.off("." + b.uniqueId)
            }, onParentSelectionChanged: function (a, b, c) {
                ("suggestions-select" !== a.type || c) && this.clear()
            }, onParentDispose: function (a) {
                this.unbindFromParent()
            }, getParentInstance: function () {
                return this.constraints instanceof a && this.constraints.suggestions()
            }, shareWithParent: function (a) {
                var b = this.getParentInstance();
                b && b.type === this.type && !c(a, b) && (b.shareWithParent(a), b.setSuggestion(a))
            }, getUnrestrictedData: function (b) {
                var c = this, d = [], e = {}, f = -1;
                return a.each(c.constraints, function (c, d) {
                    a.each(d.locations, function (a, c) {
                        c.containsData(b) && c.specificity > f && (f = c.specificity)
                    })
                }), f >= 0 ? (b.region_kladr_id && b.region_kladr_id === b.city_kladr_id && d.push.apply(d, c.type.dataComponentsById.city.fields), a.each(c.type.dataComponents.slice(0, f + 1), function (a, b) {
                    d.push.apply(d, b.fields)
                }), a.each(b, function (a, b) {
                    -1 === d.indexOf(a) && (e[a] = b)
                })) : e = b, e
            }};
        a.extend(k, d), a.extend(b.prototype, g), "GET" != m.getDefaultType() && l.on("initialize", g.createConstraints).on("setOptions", g.setupConstraints).on("fixPosition", g.setConstraintsPosition).on("requestParams", g.constructConstraintsParams).on("dispose", g.unbindFromParent)
    }(), function () {
        var c = {proceedQuery: function (a) {
                var b = this;
                a.length >= b.options.minChars ? b.updateSuggestions(a) : b.hide()
            }, selectCurrentValue: function (b) {
                var c = this, d = a.Deferred();
                return c.inputPhase.resolve(), c.fetchPhase.done(function () {
                    var a;
                    c.selection && !c.visible ? d.reject() : (a = c.findSuggestionIndex(), c.select(a, b), -1 === a ? d.reject() : d.resolve(a))
                }).fail(function () {
                    d.reject()
                }), d
            }, selectFoundSuggestion: function () {
                var a = this;
                a.requestMode.userSelect || a.select(0)
            }, findSuggestionIndex: function () {
                var b, c = this, d = c.selectedIndex;
                return-1 === d && (b = a.trim(c.el.val()), b && a.each(c.type.matchers, function (a, e) {
                    return d = e(b, c.suggestions), -1 === d
                })), d
            }, select: function (b, c) {
                var d, e = this, f = e.suggestions[b], g = c && c.continueSelecting, h = e.currentValue;
                if (!e.triggering.Select) {
                    if (!f)
                        return g || e.selection || e.triggerOnSelectNothing(), void e.onSelectComplete(g);
                    d = e.hasSameValues(f), e.enrichSuggestion(f, c).done(function (f, g) {
                        e.selectSuggestion(f, b, h, a.extend({hasBeenEnriched: g, hasSameValues: d}, c))
                    })
                }
            }, selectSuggestion: function (a, b, c, d) {
                var e = this, f = d.continueSelecting, g = !e.type.isDataComplete || e.type.isDataComplete.call(e, a), h = e.selection;
                e.triggering.Select || (e.type.alwaysContinueSelecting && (f = !0), g && (f = !1), d.hasBeenEnriched && e.suggestions[b] && (e.suggestions[b].data = a.data), e.requestMode.updateValue && (e.checkValueBounds(a), e.currentValue = e.getSuggestionValue(a, d), !e.currentValue || d.noSpace || g || (e.currentValue += " "), e.el.val(e.currentValue)), e.currentValue ? (e.selection = a, e.areSuggestionsSame(a, h) || e.trigger("Select", a, e.currentValue != c), e.requestMode.userSelect && e.onSelectComplete(f)) : (e.selection = null, e.triggerOnSelectNothing()), e.shareWithParent(a))
            }, onSelectComplete: function (a) {
                var b = this;
                a ? (b.selectedIndex = -1, b.updateSuggestions(b.currentValue)) : b.hide()
            }, triggerOnSelectNothing: function () {
                var a = this;
                a.triggering.SelectNothing || a.trigger("SelectNothing", a.currentValue)
            }, trigger: function (b) {
                var c = this, d = m.slice(arguments, 1), e = c.options["on" + b];
                c.triggering[b] = !0, a.isFunction(e) && e.apply(c.element, d), c.el.trigger.call(c.el, "suggestions-" + b.toLowerCase(), d), c.triggering[b] = !1
            }};
        a.extend(b.prototype, c), l.on("assignSuggestions", c.selectFoundSuggestion)
    }(), function () {
        var b = {bounds: null}, c = {setupBounds: function () {
                this.bounds = {from: null, to: null}
            }, setBoundsOptions: function () {
                var b, c, d = this, e = [], f = a.trim(d.options.bounds).split("-"), g = f[0], h = f[f.length - 1], i = [], j = [];
                d.type.dataComponents && a.each(d.type.dataComponents, function () {
                    this.forBounds && e.push(this.id)
                }), -1 === a.inArray(g, e) && (g = null), c = a.inArray(h, e), (-1 === c || c === e.length - 1) && (h = null), (g || h) && (b = !g, a.each(e, function (a, c) {
                    return c == g && (b = !0), j.push(c), b && i.push(c), c == h ? !1 : void 0
                })), d.bounds.from = g, d.bounds.to = h, d.bounds.all = j, d.bounds.own = i
            }, constructBoundsParams: function () {
                var a = this, b = {};
                return a.bounds.from && (b.from_bound = {value: a.bounds.from}), a.bounds.to && (b.to_bound = {value: a.bounds.to}), b
            }, checkValueBounds: function (a) {
                var b, c = this;
                c.bounds.own.length && c.type.composeValue && (b = c.copyDataComponents(a.data, c.bounds.own), a.value = c.type.composeValue(b))
            }, copyDataComponents: function (b, c) {
                var d = {}, e = this.type.dataComponentsById;
                return e && a.each(c, function (c, f) {
                    a.each(e[f].fields, function (a, c) {
                        null != b[c] && (d[c] = b[c])
                    })
                }), d
            }, getBoundedKladrId: function (b, c) {
                var d, e = c[c.length - 1];
                return a.each(this.type.dataComponents, function (a, b) {
                    return b.id === e ? (d = b.kladrFormat, !1) : void 0
                }), b.substr(0, d.digits) + new Array((d.zeros || 0) + 1).join("0")
            }};
        a.extend(k, b), a.extend(a.Suggestions.prototype, c), l.on("initialize", c.setupBounds).on("setOptions", c.setBoundsOptions).on("requestParams", c.constructBoundsParams)
    }(), a.fn.suggestions = function (c, d) {
        return 0 === arguments.length ? this.first().data(f) : this.each(function () {
            var e = a(this), g = e.data(f);
            "string" == typeof c ? g && "function" == typeof g[c] && g[c](d) : (g && g.dispose && g.dispose(), g = new b(this, c), e.data(f, g))
        })
    }
});