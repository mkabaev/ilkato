/* global eventSource, afterSelUser */

//1	Принят
//2	Готовить
//3	Готовится
//4	Приготовлен
//5	Доставка
//6	В пути
//7	Доставлен
//8	Отказ

function WorkPlace(name) {
    this.name = name;
    this._speed = 0;
    this.orders = getOrdersFromLS();
    //orders.forEach(function (order, index, array) {
    //});

    this.smallOrders = this.orders.map(function (obj) {
        var newObj = {};
        newObj.id = obj.id;
        newObj.name = obj.no;
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
            console.log('server data: ' + jsondata);
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
        id: 'dlg_' + id,
        class: _class,
        attr: {'title': caption}
    });
    //$('body').append(divDialog);
    //divDialog.attr("user_id", $(this).parent().attr("item_id"));

    divDialog.dialog({
        width: "900px",
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
                        callback(ui.selected, $(ui.selected).attr("item_id"), ui.selected.innerHTML);
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

function doInit() {
//    if (eventSource!==undefined) {
//        eventSource.close();
//        alert('es closed');
//    }
    if (localStorage.uid === undefined) {
        showSelectUserDialog();
        //CreateDialogWithItems('Авторизация', null).dialog('open'); //show auth dialog
    } else {
        updateInterface_user();
        //clearStorage();
        //loadDataToStorage();
        switch (localStorage.wp_type) {
            case '2':
                createWorkplace('O');
                break
            case '3':
                createWorkplace('K');
                break
        }
    }
//    $.ajax({
//        type: "POST",
//        data: "action=getKOrders&json=" + json_orders,
//        url: "helper.php",
//        cache: false,
//        success: function (jsondata) {
//            $(".ordrow").removeClass("ui-state-error");
//            ProcessOrders(jsondata);    //append(jsondata); 
//        },
//        error: function (xhr, ajaxOptions, thrownError) {
//            console.log("status: " + xhr.status + " | " + thrownError);
//            $(".ordrow").addClass("ui-state-error");
//            //$("body").addClass("ui-state-error");
////            alert(xhr.status);
////            alert(thrownError);
//        }
//    });
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
            if (key2 != 'id') {
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

                case 'name':  // if (x === 'value2')
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

function MakePanelHTML(panel_id, row) {
    var divPanel = $('<div/>', {
        id: panel_id,
        class: 'ordrow ui-state-active',
        attr: {'row': row, 'bla': 'blllaa'}
    });
    return divPanel;
}

function updateInterface_user() {
    $("#userinfo").html('<span class="ui-icon ui-icon-person"></span>' + localStorage.user_name);
}

function getOrdersFromLS() {
    var orders = [];
    //console.log('LS items count: '+localStorage.length);
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).substr(0, 2) === 'o_') {
            orders.push($.parseJSON(localStorage[localStorage.key(i)]));
        }
    }
    return orders;
}

function getOrderFromLS(id) {
    var order = undefined;
    //console.log('LS items count: '+localStorage.length);
    for (var i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) === 'o_' + id) {
            order = $.parseJSON(localStorage[localStorage.key(i)]);
        }
    }
    return order;
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
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}

//loadjscssfile("myscript.js", "js") //dynamically load and add this .js file
//loadjscssfile("javascript.php", "js") //dynamically load "javascript.php" as a JavaScript file
//loadjscssfile("mystyle.css", "css") ////dynamically load and add this .css file