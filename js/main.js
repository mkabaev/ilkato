var G = {
    //clientsCache: null, //сюда кэшируем клиентов для поиска по номеру телефона
    AllProducts: null, //справочник продуктов
    AllOrders: null, //текущие заказы
    curOrder: null,
    today: function () {
        var d = new Date();
        d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    } //yyyy-mm-dd
};



//function Order(firstName,lastName,age,eyeColor) {
//    this.firstName = firstName;
//    this.lastName = lastName;
//    this.age = age;
//    this.eyeColor = eyeColor;
//    this.el=document.getElementById("or");
//    this.el.innerHTML=age;
//    this.changeName = function (name) {
//        this.lastName = name;
//    }
//    this.changeEl = function (v) {
//        this.el.innerHTML = v;
//    }
//}
//var order = new Order("Sally","Rally",48,"green");
//order.changeName("Doe");
//document.getElementById("demo").innerHTML =
//"My order last name is " + order.lastName;
//order.changeEl("Doe");







function createClientObj() {
    var c = {};
    c.id = null;
    c.Name = null;
    c.Surname = null;
    c.Phones = []; // [{"Phone": 9277777778, "isDefault": 1}, {"Phone": 9626040203}]
    c.Addresses = []; //[{"Floor": 6, "Address": "ул Владимирская, д 43, кв 82", "isDefault": 1}]
    c.Card = null;
    c.Comment = null;
    c.Org = null;
    return c;
}

function createProductObj(product) {
    var p = {};
    if (product === undefined || product.id === undefined) {
        p.id = null;
        p.Name = null;
        p.Price = null;
        p.Weight = null;
        p.idType = null;
        p.isCooked = null;
        p.isGift = null;
        p.CookingTime = null;
        p.Tags = [];
        p.Count = null;
    } else {
        p = getProduct(product.id);
//        p.id = product.id === undefined ? null : product.id;
//        p.Name = product.Name === undefined ? null : product.Name;
//        p.Count = product.Count === undefined ? null : product.Count;
//        p.Price = product.Price === undefined ? null : product.Price;
//        p.Weight = product.Weight === undefined ? null : product.Weight;
//        p.idType = product.idType === undefined ? null : product.idType;
//        p.isCooked = product.isCooked === undefined ? null : product.isCooked;
//        p.isGift = product.isCooked === undefined ? null : product.isGift;
//        p.CookingTime = product.CookingTime === undefined ? null : product.CookingTime;
//        p.Tags = product.Tags === undefined ? null : product.Tags;
    }
    return p;
}
function createOrderProductObj(product) {
    var p = createProductObj(product);
    //padding product for order
    if (product !== undefined) {
        p.Count = product.Count === undefined ? null : product.Count;
        p.isCooked = product.isCooked === undefined ? null : product.isCooked;
        p.isGift = product.isCooked === undefined ? null : product.isGift;
        p.Price = product.Price === undefined ? null : product.Price;
        p.Weight = product.Weight === undefined ? null : product.Weight;
    }
    return p;
}

function createOrderObj(order) {
//          var client = {
//            id: 9226, //на данный момент достаточно только ID клиента. Остальную инфу сервер пока не обрабатывает.
//            //Name: 'Ванек',
//            //Surname: 'Пупкин',
//            //Phones: [{"Phone": 9277777778, "isDefault": 1}, {"Phone": 9626040203}],
//            //Addresses: [{"Floor": 6, "Address": "ул Владимирская, д 43, кв 82", "isDefault": 1}],
//            //Card: "1234",
//            //Comment: "тут коммент",
//            //Org: 'ОАО "ТяпЛяпСтрой"'
//        };
//
//        var order = {
//            id: 54336, //51979 //если передаем - то заказ редактируется. Если нет - создается
//            No: null, //номер заказа назначается сервером. Нумерация начинается с 1 каждый день
//            idBranch: 1,
//            idPricingType: null,
//            idStatus: 8,
//            idKitchen: null,
//            idBatch: null,
//            idCreatedBy: null,
//            Price: null,
//            Comment: null,
//            QueueNo: null,
//            //CDate: "17-02-03", // "yy-mm-dd" дата создания заказа. Если не передавать, то сервер установит текущую
//            //CTime: "15:00", //соответственно, время создания
//            DDate: "17-02-03", // К какому числу клиент хочет заказ
//            DTime: "15:00", // Соответственно, к какому времени
//            Products: [{"id": 774, "Count": 2}, {"id": 1319, "Count": 1}, {"id": 1319, "Count": 1, "isGift": 1}],
//            Client: client
//        };
    var o = {};
    if (order === undefined) {
        o.id = null;
        o.No = null;
        o.idBranch = null;
        //o.idClient = null; //?
        o.idPricingType = null;
        o.idStatus = null;
        o.idKitchen = null;
        o.idBatch = null;
        o.idCreatedBy = null;
        o.Price = null;
        o.Comment = null;
        o.QueueNo = null;
        o.DDate = null;
        o.DTime = null;
        o.Products = [];
        o.Client = createClientObj();
        o.Phone = null;
        o.idAddress = null;
    } else {
        o.id = order.id === undefined ? null : order.id;
        o.No = order.No === undefined ? null : order.No;
        o.idBranch = order.idBranch === undefined ? null : order.idBranch;
        //o.idClient = order.idClient === undefined ? null : order.idClient;
        o.idPricingType = order.idPricingType === undefined ? null : order.idPricingType;
        o.idStatus = order.idStatus === undefined ? null : order.idStatus;
        o.idKitchen = order.idKitchen === undefined ? null : order.idKitchen;
        o.idBatch = order.idBatch === undefined ? null : order.idBatch;
        o.idCreatedBy = order.idCreatedBy === undefined ? null : order.idCreatedBy;
        o.Price = order.Price === undefined ? null : order.Price;
        o.Comment = order.Comment === undefined ? null : order.Comment;
        o.QueueNo = order.QueueNo === undefined ? null : order.QueueNo;
        o.DDate = order.DDate === undefined ? null : order.DDate;
        o.DTime = order.DTime === undefined ? null : order.DTime;
        o.Products = order.Products === undefined || order.Products === null ? [] : (order.Products.map(function (p) {
            return createOrderProductObj(p);
        }));

        o.Client = order.Client === undefined ? createClientObj() : order.Client;
        o.Phone = order.Phone === undefined ? null : order.Phone;
        o.idAddress = order.idAddress === undefined ? null : order.idAddress;
    }
    return o;
}

function WorkPlace(name) {
    this.name = name;
    this._speed = 0;
    this.orders = getOrdersFromLS();
    //orders.forEach(function (order, index, array) {
    //});

    this.smallOrders = this.orders.map(function (obj) {
        var newObj = {};
        newObj.id = obj.id;
        newObj.Name = obj.No;
        //newObj.count = obj.count;
        //newObj.weight = obj.weight;
        return newObj;
    });
}

// методы в прототипе
WorkPlace.prototype.run = function (speed) {
    this._speed += speed;
    alert(this.name + ' бежит, скорость ' + this.speed);
};

WorkPlace.prototype.orders2 = function (speed) {
    //this.orders
};

WorkPlace.prototype.stop = function () {
    this._speed = 0;
    alert(this.name + ' стоит');
};

//.var wp = new WorkPlace('blaa');


function printHTML(htmlTemplate, order) {
    var divPrint = $('#divPrint');
    if (!divPrint.length) {
        var divPrint = $('<div/>', {
            id: "divPrint",
        }).appendTo("#workplace");
    }
    var s = "";
    s = htmlTemplate;
    s = s.replace("$caption", "ILKato");

    s = s.replace("$order_number", order.No);
    s = s.replace("$order_date", order.DDate);
    s = s.replace("$order_time", order.CTime);
    s = s.replace("$delivery_time", order.DTime);
//
    s = s.replace("$comment", order.Comment);
//
    var pcount = 1;
    s = s.replace("$count_person", pcount);
//
//    //table id, _class, headerItems, tableItems, footerItems
    var prd = order.Products.map(function (item, i, arr) {
        var newObj = {};
        newObj.No = i + 1;
        newObj.Count = 1;
        newObj.Name = item.Name;
        newObj.Weight = item.Weight;
        return newObj;
    });
//
////    function CreateTable(id, _class, headerItems, tableItems, footerItems) {
    var t = CreateTable('tPProducts', undefined, ["№", "Кол-во", "Наименование", "Вес"], prd, undefined);
    //t.css('align:"right"; width:"53%";border:"1px";cellspacing=0;');
    t.removeAttr("class");
    t.children().removeAttr("class");

//console.log(t[0].outerHTML);
    s = s.replace("$table", t[0].outerHTML);
    s = s.replace("<thead>", "");
    s = s.replace("</thead>", "");

//
//
//
//
//
//    //another one
//    s = s.replace("$order_time", order.CTime);

    divPrint.html(s);
    window.print();
    divPrint.remove();
//    return divPrint;
}

function showSelectUserDialog() {
    var dlg = $('#SelUser');
    if (!dlg.length) {
        sendRequest('getUsers', '', function (data) {
            //console.log('dialog ' + id + ' found on page. items');
            console.log('users loaded from server:');
            console.log(data);
            dlg = CreateSelectDialog('SelUser', 'Авторизация', undefined, data, afterSelUser);
            dlg.dialog("option", {width: 400, height: 200});
//$('ul.ul_selectItems').html(ArrayToLiItems(data));
            //$('#authSel').append(ArrayToOptionItems(["U1", "U2", "U3"]));
            dlg.dialog('open');
        });
    }
}

function createSelectPanel(id, _class, items, callback) {
    var div = $('<div/>', {
        id: id,
        class: _class,
    });

    var list = $('<ul/>', {
        //id: 'ul_'+id,
        class: 'selItems',
        //attr: {'title': "Авторизация", 'ts': timestamp}
    });
    div.append(list);

    list.append(ArrayToLiItems(items));
    $(list.children('li')).addClass('ui-widget-content');

    //divDialog.attr("user_id", $(this).parent().attr("item_id"));
    list.selectable({
        //tolerance: "fit",
        selected:
                function (event, ui) {
                    //alert(ui.selected.id + " " + ui.selected.innerHTML);
                    //localStorage.user_id = $(ui.selected).attr("item_id");
                    //localStorage.user_name = ui.selected.innerHTML;
                    //updateInterface_user();
                    //$("#"+idPanel + " .order").css("visible:none;");
                    //SetCourierToOrdersAndClear(y, parseInt($(ui.selected).attr("courier_id")));
                    if (callback) {
                        callback($(ui.selected).attr("item_id"), ui.selected.innerHTML);
                    }
                    //callback.call($(ui.selected).attr("item_id"),ui.selected.innerHTML);
                    //console.log(JSON.stringify(ar));
                }

    });

    return div;
}

function CreateDialog(id, caption, _class, enableAnimation) {
    var divDialog = $('<div/>', {
        //id: 'dlg_' + id,
        id: id,
        class: _class,
        attr: {'title': caption}
    });
    //$('body').append(divDialog);
    //divDialog.attr("user_id", $(this).parent().attr("item_id"));

    divDialog.dialog({
        width: "100%",
        height: $(window).height(),
        //width: "auto",
//        autoOpen: false,
//        modal: true,
//        resizable: false,
//        closeOnEscape: false,
//        draggable: false,
        //buttons: [ { text: "Okkkk", click: function() { $( this ).dialog( "close" ); } } ],
//        show: {
//            effect: "blind",
//            duration: 300
//        },
//        hide: {
//            effect: "explode",
//            duration: 300
//        },
//        open: function () {
//            $('.ui-widget-overlay').bind('click', function () {
//                divDialog.dialog('close');
//                //divDialog.dialog('destroy');
//            })
//        },
//        close: function () {
//            //This will destroy the dialog and then remove the div that was "hosting" the dialog completely from the DOM
////            $(this).dialog('destroy').remove();
//            $(this).remove();
//        },
        //dialogClass: "noclose"//+_class
    });
    if (enableAnimation === undefined) {
        divDialog.dialog("option", "show", {effect: "blind", duration: 300});
        divDialog.dialog("option", "hide", {effect: "explode", duration: 300});
    }
    return divDialog;
}

/**
 * Create modal dialog with select menu and callback function
 * @param id {number} id to set
 * @param caption {string} Dialog Caption
 * @param _class {string} add class
 * @param items {Array} array of li items
 * @param callback function(id,name)
 * @return {Object} div dialog
 */
function CreateSelectDialog(id, caption, _class, items, callback) {
    var divDialog = CreateDialog(id, caption, _class);
//    var list = $('<ul/>', {
//        //id: 'ul_'+id,
//        class: 'ul_selectItems',
//        //attr: {'title': "Авторизация", 'ts': timestamp}
//    });
//    divDialog.append(list);

    var selUser = $('<select/>', {
        id: "authSel",
        //name: "paytype",
        class: 'authSel',
    });
    divDialog.append(selUser);
    selUser.append(ArrayToOptionItems(items));
    selUser.selectmenu({
//        create: function (event, ui) {
////            $('.ui-selectmenu-menu').css({'height': '100px', 'overflow': 'auto'});
//            $('.ui-selectmenu-menu').css({'z-index': '10000000'});
//        },
//        open: function (event, ui)
//        {
//            $('.ui-selectmenu-menu').zIndex($(‘#dialog’).zIndex() + 1);
//        },
        width: 340,
//        position: {
//            my: "left+10 top",
//            at: "left top+20"
//        },
        change: function (event, ui) {
            //alert($(this).val());
            //localStorage.user_id = $(ui.selected).attr("item_id");
            //localStorage.user_name = ui.selected.innerHTML;
            //updateInterface_user();
            //$("#"+idPanel + " .order").css("visible:none;");
            //SetCourierToOrdersAndClear(y, parseInt($(ui.selected).attr("courier_id")));
            if (callback) {
                //callback(ui.selected, $(ui.selected).attr("item_id"), ui.selected.innerHTML);
                //callback(ui.selected);
                callback(ui.item.element);
                //console.log($(ui.item.element).attr("idPerson")); 
            } else {
                alert('callback error');
            }
            //callback.call($(ui.selected).attr("item_id"),ui.selected.innerHTML);
            //console.log(JSON.stringify(ar));
            divDialog.dialog("close");
        }
    });
//    selUser.val(1);
    selUser.selectmenu('refresh', true);


//    list.html(items);
//    list.selectable({
//        tolerance: "fit",
//        selected:
//                function (event, ui) {
//                    //localStorage.user_id = $(ui.selected).attr("item_id");
//                    //localStorage.user_name = ui.selected.innerHTML;
//                    //updateInterface_user();
//                    //$("#"+idPanel + " .order").css("visible:none;");
//                    //SetCourierToOrdersAndClear(y, parseInt($(ui.selected).attr("courier_id")));
//                    if (callback) {
//                        //callback(ui.selected, $(ui.selected).attr("item_id"), ui.selected.innerHTML);
//                        callback(ui.selected);
//                    } else {
//                        alert('callback error');
//                    }
//                    //callback.call($(ui.selected).attr("item_id"),ui.selected.innerHTML);
//                    //console.log(JSON.stringify(ar));
//                    divDialog.dialog("close");
//                }
//    });
    return divDialog;
}

/**
 * Create UL list
 * @param id {number} id to set
 * @param _class {string} add class
 * @param items {Array} array of li items
 * @return {Object} ul
 */
function createUL(id, _class, items) {
    var list = $('<ul/>', {
        id: id,
        class: _class,
        //attr: {'title': "Авторизация", 'ts': timestamp}
    });

    //divDialog.attr("user_id", $(this).parent().attr("item_id"));
    list.html(items);
    return list;
}

function doInit(callback) {
    //websql
//    db = openDatabase("ilkato", "0.1", "Ilkato orders", 200000);
//    if (!db) {
//        alert("Failed to connect to database.");
//    }
//    db.transaction(function (tx) {
//        tx.executeSql("SELECT COUNT(*) FROM orders", [], function (result) {
//            alert('dsfsdf')
//        }, function (tx, error) {
//            tx.executeSql("CREATE TABLE orders (id REAL UNIQUE, label TEXT, timestamp REAL)", [], null, null);
//        })
//    });
//
//    db.transaction(function (tx) {
//        tx.executeSql("INSERT INTO orders (label, timestamp) values(?, ?)", ["Купить iPad или HP Slate", new Date().getTime()], null, null);
//    });
//
//    db.transaction(function (tx) {
//        tx.executeSql("SELECT * FROM ToDo", [], function (tx, result) {
//            for (var i = 0; i < result.rows.length; i++) {
//                document.write('<b>' + result.rows.item(i)['label'] + '</b><br />');
//            }
//        }, null)
//    }); 

    if (localStorage.uid === undefined || localStorage.wp_id === undefined) {
        showSelectUserDialog();
    } else {
        updateInterface_user();
        //set USER ONLINE on server and then get active orders
        sendRequest("login", "uid=" + localStorage.uid + "&wid=" + localStorage.wp_id + "&old_sid=" + localStorage.id_session, function (data) {

//            $.each(localStorage, function (key, value) {
//                if (key.startsWith('o_') | key.startsWith('b_')) {
//                    localStorage.removeItem(key);
//                }
//            });
            clearStorage(); //except uid, wp_id...
            //save actual orders to LS
            //var data = JSON.parse(jsondata);
            localStorage.id_session = data.id_session;
//            if (data.batches.length) {
//                setItemsToLS('b_', data.batches);
//            }
            if (data.orders.length) {
                setItemsToLS('o_', data.orders);
                G.AllOrders = data.orders;
            }
            //localStorage.activeDate = (new Date()).toISOString().substr(0, 10);
            //var dates = [];
            //$(data.orders).each(function (indx, order) {
            //    dates.push(order.DDate);
            //});
            //localStorage.dates = $.unique(dates);
            //updateInterface_user();
            ////clearStorage();
            ////loadDataToStorage();
            createWorkplace(localStorage.wp_type);
            addEventListeners();
        });

//        $.ajax({
//            type: "POST",
//            data: "action=login&uid=" + localStorage.uid + "&wid=" + localStorage.wp_id + "&old_sid=" + localStorage.id_session,
//            url: "helper.php?",
//            cache: false,
//            success: function (jsondata) {
//                $("body").removeClass("ui-state-error");
//                // remove orders from LS
//                $.each(localStorage, function (key, value) {
//                    if (key.startsWith('o_') | key.startsWith('b_')) {
//                        localStorage.removeItem(key);
//                    }
//                });
//                //save actual orders to LS
//                console.log(jsondata);
//                var data = JSON.parse(jsondata);
//                localStorage.id_session = data.id_session;
//                setItemsToLS('o_', data.orders);
//                setItemsToLS('b_', data.batches);
//
//                localStorage.activeDate = (new Date()).toISOString().substr(0, 10);
//                var dates = [];
//                $(data.orders).each(function (indx, order) {
//                    dates.push(order.DDate);
//                });
//                localStorage.dates = $.unique(dates);
//
//                updateInterface_user();
//                //clearStorage();
//                //loadDataToStorage();
//
//                createWorkplace(localStorage.wp_type);
//
//                addEventListeners();
//            },
//            error: function (xhr, ajaxOptions, thrownError) {
//                $("body").addClass("ui-state-error");
//                alert("Сервер не доступен: " + xhr.status + " | " + thrownError);
//                //$("body").addClass("ui-state-error");
////            alert(xhr.status);
////            alert(thrownError);
//            }
//        });
    }
    if (callback) {
        callback();
    }
}

function CreateTable(id, _class, headerItems, tableItems, footerItems) {
    var table = $('<table/>', {
        id: id,
        class: 'ui-widget-content ' + _class,
        //attr: {'status_id': status_id, 'ts': timestamp}
    });

    var tHead = $('<thead/>', {
        //id: id,
        class: 'ui-widget-header',
        //attr: {'status_id': status_id, 'ts': timestamp}
    }).append(ArrayToTableHeader(headerItems));
    table.append(tHead);

    //if (footerItems!==undefined) {
    var tFooter = $('<tfoot/>', {
        //id: id,
        //class: 'ui-widget-header',
        //attr: {'status_id': status_id, 'ts': timestamp}

    }).append(ArrayToTableFooter(footerItems));
    table.append(tFooter);
    //}

    var tBody = $('<tbody/>', {
        //id: id,
        //class: 'ui-widget-content',
        //attr: {'status_id': status_id, 'ts': timestamp}
    }).append(ArrayToTableItems(tableItems));
    table.append(tBody);

    //tBody.append(ArrayToTableItems(tableItems));

//tBody.append('<tr><td>Ролл Филаделфия</td><td>2</td></tr>');
    //tBody.append('<tr><td>Ролл сет Обжорка</td><td>1</td></tr>');



    return table;
}

function UpdateTableItems(table, tableItems, footerItems) {
    $(table).find('tbody').html(ArrayToTableItems(tableItems));
    if (footerItems) {
        $(table).find('tfoot').html(ArrayToTableFooter(footerItems));
    }
}

function ArrayToTableHeader(headerItems) {
    var headerHtml;
    headerHtml = '<tr>';
    $.each(headerItems, function (key, val) {
        headerHtml = headerHtml + "<th>" + val + "</th>";
    });
    headerHtml = headerHtml + '</tr>';
    return headerHtml;
    //$("#tProducts tbody").html(items);
}

function ArrayToTableFooter(items) {
    var html;
    html = '<tr>';
    $.each(items, function (key, val) {
        html = html + "<td>" + val + "</td>";
    });
    html = html + '</tr>';
    return html;
}

function ArrayToTableItems(tableItems) {
    var items = [];
    var row;
    $.each(tableItems, function (key, val) {

        row = "<tr item_id=" + val.id + ">";

        $.each(val, function (key2, val2) {
            if (key2 !== 'id') {
                row = row + "<td>" + val2 + "</td>";
            }
        });
        row = row + "</tr>";

        //$(row).attr('item_id', 'val.id');
        items.push(row);

    });
    return items;
    //$("#tProducts tbody").html(items);
}

function ArrayToLiItems(items) {
    var _items = [];
    $.each(items, function (key, val) {
        //class: 'order ui-widget ui-widget-content ui-helper-clearfix ui-corner-top'
        var s = "";
        var t = "";
        $.each(val, function (key2, val2) {
            //class: 'order ui-widget ui-widget-content ui-helper-clearfix ui-corner-top'
            switch (key2) {
                case 'id':  // if (x === 'value1')
                    s = s + " item_id=" + val2;
                    break

                case 'Name':  // if (x === 'value2')
                    t = val2;
                    break
                default:
                    s = s + " " + key2 + "=" + val2;
                    break
            }
        });
        _items.push("<li" + s + ">" + t + "</li>");


    });
    return _items;
}

function ArrayToOptionItems(items) {
    var _items = [];
    $.each(items, function (key, val) {
        var opt = $("<option/>");
        if (typeof val === 'object') {
            $.each(val, function (atrName, atrVal) {
                //class: 'order ui-widget ui-widget-content ui-helper-clearfix ui-corner-top'
                switch (atrName) {
                    case 'id':  // if (x === 'value1')
                        opt.attr("item_id", atrVal);
//                      break;
                    case 'Name':  // if (x === 'value2')
                        opt.text(atrVal);
//                        break;
                    default:
                        opt.attr(atrName, atrVal);
//                        break;
                }
            });
            _items.push(opt);
        } else {
            opt.attr("value", key);
            opt.text(val);
            _items.push(opt);
        }

    });
    return _items;
}

function updateInterface_user() {
    $("#userinfo").html('<span class="ui-icon ui-icon-person"></span>' + localStorage.user_name);
}

function getItemFromLS(prefix, id) {
    var item = undefined;
    //console.log('LS items count: '+localStorage.length);
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) === prefix + id) {
            item = JSON.parse(localStorage[localStorage.key(i)]);
        }
    }
    return item;
}

function getItemsFromLS(prefix) {
    var items = [];
    //console.log('LS items count: '+localStorage.length);
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).substr(0, 2) === prefix) {
//            items.push($.parseJSON(localStorage[localStorage.key(i)]));
            items.push(JSON.parse(localStorage[localStorage.key(i)]));
        }
    }
    return items;
}

function getProduct(id) {
    return G.AllProducts.find(function (p) {
        return p.id === id;
    });
}

function getOrderFromLS(id) {
    return getItemFromLS("o_", id);
}

function getOrdersFromLS() {
    return getItemsFromLS('o_');
}

function getBatchFromLS(id) {
    return getItemFromLS("b_", id);
}

function getBatchesFromLS() {
    return getItemsFromLS('b_');
}

function afterSelUser(sender) {
    //callback(ui.selected, $(ui.selected).attr("item_id"), ui.selected.innerHTML);
    //alert(ui.selected.id + " " + ui.selected.innerHTML);
    if (eventSource) {
        eventSource.close();
    }
    localStorage.clear();
    localStorage.wp_id = $(sender).attr("idWorkplace");
    localStorage.wp_type = $(sender).attr("idType");
    localStorage.uid = $(sender).attr("idPerson");
    localStorage.user_name = $(sender).text();
    console.log("Clear localStorage and set wp_id=" + localStorage.wp_id + ", wp_type=" + localStorage.wp_type + ", uid=" + localStorage.uid);

//    $("#SelUsers").remove();
    doInit();
    //updateInterface_user();
}

function sendRequest(action, paramsstr, callback) {
    //alert("action=" + action + "&" + paramsstr);
    //$(this).addClass("ui-state-disabled");
    $.ajax({
        dataType: 'json',
        type: "POST",
        data: "action=" + action + "&" + paramsstr,
        url: "helper.php",
        //cache: false,
        timeout: 30000,
        //processData: false,
        success: function (data) {
//            console.log("sendRequest " + action + " successful. Response:");
//            console.log(data);
//            $("body").removeClass("ui-state-error");
//            //$(this).removeClass("ui-state-disabled");
//
//            if (callback) {
//                callback(data);
//            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("status: " + xhr.status + " | " + thrownError);
            $("body").addClass("ui-state-error");
            //$("body").addClass("ui-state-error");
//            alert(xhr.status);
//            alert(thrownError);
        }
    }).done(
            function (data) {
                console.log("sendRequest " + action + " successful. Response:");
                console.log(data);
                $("body").removeClass("ui-state-error");
                //$(this).removeClass("ui-state-disabled");
                if (callback) {
                    callback(data);
                }
            }
    );

}



//DYNAMIC CSS and JS load
function loadjscssfile(filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script')
        fileref.setAttribute("type", "text/javascript")
        fileref.setAttribute("src", filename)
    } else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link")
        fileref.setAttribute("rel", "stylesheet")
        fileref.setAttribute("type", "text/css")
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref !== "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

function clearStorage() {
    var uid = localStorage.uid;
    var user_name = localStorage.user_name;
    var wp_type = localStorage.wp_type;
    var wp_id = localStorage.wp_id;

    localStorage.clear();

    localStorage.uid = uid;
    localStorage.user_name = user_name;
    localStorage.wp_type = wp_type;
    localStorage.wp_id = wp_id;
//updateInterface_user();
}

//copy data to LS and update interface if needed
function setItemsToLS(prefix, data) {
    $.each(data, function (key, val) {
        console.log('try to saving ' + prefix + ' to LS:');
        if (val) {
            localStorage.setItem(prefix + val.id, JSON.stringify(val));
        } else {
            console.log('ERROR setItemstoLS: val is null');
        }
    });
}

//собирает необходимые данные для создания заказа на сервере. Если клиент новый, то отправляются данные клиента вместо его id
function prepareDataToCreateOrderOnServer(order) {
//            id: 54336, //51979 //если передаем - то заказ редактируется. Если нет - создается
//            No: null, //номер заказа назначается сервером. Нумерация начинается с 1 каждый день
//            idBranch: 1,
//            idPricingType: null,
//            idStatus: 1,
//            idKitchen: null,
//            idBatch: null,
//            idCreatedBy: null,
//            Price: null,
//            Comment: null,
//            QueueNo: null,
//            //CDate: "17-02-03", // "yy-mm-dd" дата создания заказа. Если не передавать, то сервер установит текущую
//            //CTime: "15:00", //соответственно, время создания
//            DDate: "17-02-03", // К какому числу клиент хочет заказ
//            DTime: "15:00", // Соответственно, к какому времени
//            Products: [{"id": 774, "Count": 2}, {"id": 1319, "Count": 1}, {"id": 1319, "Count": 1, "isGift": 1}],
//            Client: 
    var Client = null;
    if (order.Client !== null) {
        if (order.Client.id) {
            Client = {id: order.Client.id}
        } else {
            if (order.Client.Phones !== null && order.Client.Phones.length) { // & order.Client.Phones[0].length === 10
                Client = order.Client;
            }
            //else {
            //    Client = null;
            //}
        }

    }
    var Products = null;
    if (order.Products !== null && order.Products.length) {
        Products = order.Products.map(function (oldItem) {
            var newItem = {};
            newItem.id = oldItem.id;
            newItem.Count = oldItem.Count;
            return newItem;
        });
    }
    var newOrder = {
        id: order.id,
        idBranch: order.idBranch,
        idPricingType: order.idPricingType,
        idStatus: order.idStatus,
        idKitchen: order.idKitchen,
        idBatch: order.idBatch,
        idCreatedBy: order.idCreatedBy,
        Price: order.Price,
        Comment: order.Comment,
        QueueNo: order.QueueNo,
        DDate: order.DDate,
        DTime: order.DTime,
        Client: Client,
        Products: Products,
        Phone: order.Phone,
        idAddress: order.idAddress,
    }
    return newOrder;
}

function idStatusToString(idStatus) {
    var arr = ["Принят", "Готовить", "Готовится", "Приготовлен", "Доставка", "В пути", "Доставлен", "Отказ"];
    return arr[idStatus - 1];
}

//    localStorage.dates = ["25.10.2016", "26.10.2016", "29.10.2016"]

//ANIMATE ELEMENT
var notLocked = true;
$.fn.animateHighlight = function (highlightColor, duration) {
    var highlightBg = highlightColor || "#FFFF9C";
    var animateMs = duration || 1500;
    var originalBg = this.css("backgroundColor");
    if (notLocked) {
        notLocked = false;
        this.stop().css("background-color", highlightBg)
                .animate({backgroundColor: originalBg}, animateMs);
        setTimeout(function () {
            notLocked = true;
        }, animateMs);
    }
};//using //.animateHighlight("#dd0000", 1000);

//русифицируем датапикер
$.datepicker.regional['ru'] = {
    closeText: 'Закрыть',
    prevText: '&#x3c;Пред',
    nextText: 'След&#x3e;',
    currentText: 'Сегодня',
    monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
        'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
    monthNamesShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
        'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
    dayNames: ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'],
    dayNamesShort: ['вск', 'пнд', 'втр', 'срд', 'чтв', 'птн', 'сбт'],
    dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
    dateFormat: 'dd.mm.yy',
    firstDay: 1,
    isRTL: false
};
$.datepicker.setDefaults($.datepicker.regional['ru']);

// extend jquery filter for case insensitive
$.extend($.expr[':'], {
    'containsi': function (elem, i, match, array)
    {
        return (elem.textContent || elem.innerText || '').toLowerCase()
                .indexOf((match[3] || "").toLowerCase()) >= 0;
    }
});

$(document).ajaxStart(function () {
    $("#topmenu").addClass("ui-autocomplete-loading");
//    $("#fountainG").show();
});
$(document).ajaxStop(function () {
    $("#topmenu").removeClass("ui-autocomplete-loading");
//    $("#fountainG").hide();
});

//Load and execute a JavaScript file.
//$.ajax({
//  method: "GET",
//  url: "test.js",
//  dataType: "script"
//});

//$(document).ajaxComplete(function () {
//    $('#settings').fadeOut().fadeIn();
//});

$(document).ready(function () {
//    $("#fountainG").hide();

    //K_RequestServer();
    //LoadCouriers();
    //setInterval('K_RequestServer()', 3000);
    //$(".left").append(MakePanelHTML('pane12', 12));
    ////$('#mainRange').append(DrawOrderCartHTML(3,123,6));

});
//loadjscssfile("myscript.js", "js") //dynamically load and add this .js file
//loadjscssfile("javascript.php", "js") //dynamically load "javascript.php" as a JavaScript file
//loadjscssfile("mystyle.css", "css") ////dynamically load and add this .css file


//DB
//var indexedDB 	  = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB,
//	IDBTransaction  = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
//	baseName 	  = "filesBase",
//	storeName 	  = "filesStore";
//
//function logerr(err){
//	console.log(err);
//}
//
//function connectDB(f){
//	var request = indexedDB.open(baseName, 1);
//	request.onerror = logerr;
//	request.onsuccess = function(){
//		f(request.result);
//	}
//	request.onupgradeneeded = function(e){
//		e.currentTarget.result.createObjectStore(storeName, { keyPath: "path" });
//		connectDB(f);
//	}
//}
//
//function getFile(file, f){
//	connectDB(function(db){
//		var request = db.transaction([storeName], "readonly").objectStore(storeName).get(file);
//		request.onerror = logerr;
//		request.onsuccess = function(){
//			f(request.result ? request.result : -1);
//		}
//	});
//}
//
//function getStorage(f){
//	connectDB(function(db){
//		var rows = [],
//			store = db.transaction([storeName], "readonly").objectStore(storeName);
//
//		if(store.mozGetAll)
//			store.mozGetAll().onsuccess = function(e){
//				f(e.target.result);
//			};
//		else
//			store.openCursor().onsuccess = function(e) {
//				var cursor = e.target.result;
//				if(cursor){
//					rows.push(cursor.value);
//					cursor.continue();
//				}
//				else {
//					f(rows);
//				}
//			};
//	});
//}
//
//function setFile(file){
//	connectDB(function(db){
//		var request = db.transaction([storeName], "readwrite").objectStore(storeName).put(file);
//		request.onerror = logerr;
//		request.onsuccess = function(){
//			return request.result;
//		}
//	});
//}
//
//function delFile(file){
//	connectDB(function(db){
//		var request = db.transaction([storeName], "readwrite").objectStore(storeName).delete(file);
//		request.onerror = logerr;
//		request.onsuccess = function(){
//			console.log("File delete from DB:", file);
//		}
//	});
//}


//*************** IDB
// This works on all devices/browsers, and uses IndexedDBShim as a final fallback 
//var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
//
//// Open (or create) the database
//var open = indexedDB.open("ilkato", 1);
//
//// Create the schema
//open.onupgradeneeded = function() {
//    var db = open.result;
//    var store = db.createObjectStore("IlkatoObjectStore", {keyPath: "id"});
//    var index = store.createIndex("NameIndex", ["name.last", "name.first"]);
//};
//
//open.onsuccess = function() {
//    // Start a new transaction
//    var db = open.result;
//    var tx = db.transaction("IlkatoObjectStore", "readwrite");
//    var store = tx.objectStore("IlkatoObjectStore");
//    var index = store.index("NameIndex");
//
//    // Add some data
//    store.put({id: 12345, name: {first: "John", last: "Doe"}, age: 42});
//    store.put({id: 67890, name: {first: "Bob", last: "Smith"}, age: 35});
//    
//    // Query the data
//    var getJohn = store.get(12345);
//    var getBob = index.get(["Smith", "Bob"]);
//
//    getJohn.onsuccess = function() {
//        console.log(getJohn.result.name.first);  // => "John"
//    };
//
//    getBob.onsuccess = function() {
//        console.log(getBob.result.name.first);   // => "Bob"
//    };
//
//    // Close the db when the transaction is done
//    tx.oncomplete = function() {
//        db.close();
//    };
//}

Number.prototype.toHHMMSS = function () {
    var sec_num = this;
    if (sec_num > 0) {
        var hours = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours < 10) {
            hours = "0" + hours;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        return hours > 0 ? hours + ':' : '' + minutes + ':' + seconds;
    } else {
        return sec_num;
    }
}

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    return sec_num.toHHMMSS();
}

function remove_duplicates_es6(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
}

Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}