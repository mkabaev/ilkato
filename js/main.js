/* global eventSource, afterSelUser */

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

var wp = new WorkPlace('blaa');


function printHTML(html) {
    var divPrint = $('#divPrint');
    if (!divPrint.length) {
        var divPrint = $('<div/>', {
            id: "divPrint",
        }).appendTo("#workplace");
    }
    divPrint.html(html);
    window.print();
//    return divPrint;
}

function showSelectUserDialog() {
    var dlg = $('#dlg_selUsers');
    if (!dlg.length) {
        dlg = CreateSelectDialog('SelUsers', 'Авторизация', undefined, undefined, afterSelUser);
    }
    $.ajax({
        type: "POST",
        data: "action=getUsers",
        url: "helper.php",
        cache: false,
        success: function (jsondata) {
            //console.log('dialog ' + id + ' found on page. items');
            console.log('users loaded from server: ' + jsondata);
            $('#workplace').removeClass("ui-state-error");
            $('ul.ul_selectItems').html(ArrayToLiItems($.parseJSON(jsondata)));
            dlg.dialog('open');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("status: " + xhr.status + " | " + thrownError);
            $("#workplace").addClass("ui-state-error");
            //$("body").addClass("ui-state-error");
//            alert(xhr.status);
//            alert(thrownError);
        }
    });
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

function CreateDialog(id, caption, _class) {
    var divDialog = $('<div/>', {
        //id: 'dlg_' + id,
        id: id,
        class: _class,
        attr: {'title': caption}
    });
    //$('body').append(divDialog);
    //divDialog.attr("user_id", $(this).parent().attr("item_id"));

    divDialog.dialog({
        width: 900,
        height: 600,
        //width: "auto",
        autoOpen: false,
        modal: true,
        resizable: false,
        show: {
            effect: "blind",
            duration: 300
        },
        hide: {
            effect: "explode",
            duration: 300
        },
        open: function () {
            $('.ui-widget-overlay').bind('click', function () {
                divDialog.dialog('close');
                divDialog.dialog('destroy');
            })
        },
        dialogClass: "noclose"
    });
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
    var list = $('<ul/>', {
        //id: 'ul_'+id,
        class: 'ul_selectItems',
        //attr: {'title': "Авторизация", 'ts': timestamp}
    });
    divDialog.append(list);

    //divDialog.attr("user_id", $(this).parent().attr("item_id"));
    list.html(items);
    list.selectable({
        tolerance: "fit",
        selected:
                function (event, ui) {
                    //alert($(ui.selected).attr("item_id") + " " + ui.selected.innerHTML);
                    //localStorage.user_id = $(ui.selected).attr("item_id");
                    //localStorage.user_name = ui.selected.innerHTML;
                    //updateInterface_user();
                    //$("#"+idPanel + " .order").css("visible:none;");
                    //SetCourierToOrdersAndClear(y, parseInt($(ui.selected).attr("courier_id")));
                    if (callback) {
                        callback(ui.selected, $(ui.selected).attr("item_id"), ui.selected.innerHTML);
                    } else {
                        alert('callback error');
                    }
                    //callback.call($(ui.selected).attr("item_id"),ui.selected.innerHTML);
                    //console.log(JSON.stringify(ar));
                    divDialog.dialog("close");
                }
    });
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

    if (localStorage.uid === undefined) {
        showSelectUserDialog();
    } else {
        //set USER ONLINE on server and then get active orders
        $.ajax({
            type: "POST",
            data: "action=login&uid=" + localStorage.uid + "&wid=" + localStorage.wp_id + "&old_sid=" + localStorage.id_session,
            url: "helper.php?",
            cache: false,
            success: function (jsondata) {
                $("body").removeClass("ui-state-error");
                // remove orders from LS
                $.each(localStorage, function (key, value) {
                    if (key.startsWith('o_') | key.startsWith('b_')) {
                        localStorage.removeItem(key);
                    }
                });
                //save actual orders to LS
                var data = $.parseJSON(jsondata);
                localStorage.id_session = data.id_session;
                setItemsToLS('o_', data.orders);
                setItemsToLS('b_', data.batches);

                localStorage.activeDate = (new Date()).toISOString().substr(0,10);
                var dates = [];
                $(data.orders).each(function (indx, order) {
                    dates.push(order.DDate);
                });
                localStorage.dates = $.unique(dates);

                updateInterface_user();
                //clearStorage();
                //loadDataToStorage();

                createWorkplace(localStorage.wp_type);

                addEventListeners();
                if (callback) {
                    callback();
                }

            },
            error: function (xhr, ajaxOptions, thrownError) {
                $("body").addClass("ui-state-error");
                alert("Сервер не доступен: " + xhr.status + " | " + thrownError);
                //$("body").addClass("ui-state-error");
//            alert(xhr.status);
//            alert(thrownError);
            }
        });

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
    });

    tHead.append(ArrayToTableHeader(headerItems));
    table.append(tHead);

    var tBody = $('<tbody/>', {
        //id: id,
        //class: 'ui-widget-content',
        //attr: {'status_id': status_id, 'ts': timestamp}
    });

    //tBody.append(ArrayToTableItems(tableItems));

//tBody.append('<tr><td>Ролл Филаделфия</td><td>2</td></tr>');
    //tBody.append('<tr><td>Ролл сет Обжорка</td><td>1</td></tr>');

    table.append(tBody);

    return table;
}

function UpdateTableItems(table, tableItems) {
    $(table > 'tbody').html(ArrayToTableItems(tableItems));
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

function updateInterface_user() {
    $("#userinfo").html('<span class="ui-icon ui-icon-person"></span>' + localStorage.user_name);
}

function getItemFromLS(prefix, id) {
    var item = undefined;
    //console.log('LS items count: '+localStorage.length);
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) === prefix + id) {
            item = $.parseJSON(localStorage[localStorage.key(i)]);
        }
    }
    return item;
}

function getItemsFromLS(prefix) {
    var items = [];
    //console.log('LS items count: '+localStorage.length);
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).substr(0, 2) === prefix) {
            items.push($.parseJSON(localStorage[localStorage.key(i)]));
        }
    }
    return items;
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

function afterSelUser(sender, id, name) {
    //alert(ui.selected.id + " " + ui.selected.innerHTML);
    //localStorage.clear();
    localStorage.wp_id = $(sender).attr("idWorkplace");
    localStorage.wp_type = $(sender).attr("idType");
    localStorage.uid = id;
    localStorage.user_name = name;
    doInit();
    //updateInterface_user();
}

function sendRequest(action, paramsstr, callback) {
    $.ajax({
        type: "POST",
        data: "action=" + action + "&" + paramsstr,
        url: "helper.php?",
        cache: false,
        success: function (jsondata) {
            if (callback) {
                callback(jsondata);
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("status: " + xhr.status + " | " + thrownError);
            $(".ordrow").addClass("ui-state-error");
            //$("body").addClass("ui-state-error");
//            alert(xhr.status);
//            alert(thrownError);
        }
    });

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

    localStorage.clear();

    localStorage.uid = uid;
    localStorage.user_name = user_name;
    //updateInterface_user();
}

//copy data to LS and update interface if needed
function setItemsToLS(prefix, data) {
    $.each(data, function (key, val) {
        //console.log('saving '+prefix+' to LS:' + JSON.stringify(val));
        if (val) {
            localStorage.setItem(prefix + val.id, JSON.stringify(val));
        } else {
            console.log('ERROR setItemstoLS: val is null');
        }
    });
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

$(document).ready(function () {
    //K_RequestServer();
    //LoadCouriers();
    //setInterval('K_RequestServer()', 3000);
    //$(".left").append(MakePanelHTML('pane12', 12));
    ////$('#mainRange').append(DrawOrderCartHTML(3,123,6));

});
//loadjscssfile("myscript.js", "js") //dynamically load and add this .js file
//loadjscssfile("javascript.php", "js") //dynamically load "javascript.php" as a JavaScript file
//loadjscssfile("mystyle.css", "css") ////dynamically load and add this .css file