/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function CreateDialogWithItems(caption, _class) {
    var divDialog = $('<div/>', {
        //id: id,
        class: _class,
        attr: {'title': caption}
    });
    var ulUsers = $('<ul/>', {
        //id: id,
        class: 'ul_selectItems',
        //attr: {'title': "Авторизация", 'ts': timestamp}
    });
    divDialog.append(ulUsers);

    $('body').append(divDialog);

    $.ajax({
        type: "POST",
        data: "action=getUsers",
        url: "helper.php",
        cache: false,
        success: function (jsondata) {
            $('body').removeClass("ui-state-error");
            ulUsers.html(ArrayToLiItems($.parseJSON(jsondata)));
        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log("status: " + xhr.status + " | " + thrownError);
            $("body").addClass("ui-state-error");
            //$("body").addClass("ui-state-error");
//            alert(xhr.status);
//            alert(thrownError);
        }
    });

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

    ulUsers.selectable({
        tolerance: "fit",
        selected: function (event, ui) {
            //alert(ui.selected.id + " " + ui.selected.innerHTML);
            localStorage.user_id = $(ui.selected).attr("item_id");
            localStorage.user_name = ui.selected.innerHTML;
            updateInterface_user();
            //$("#"+idPanel + " .order").css("visible:none;");
            //SetCourierToOrdersAndClear(y, parseInt($(ui.selected).attr("courier_id")));

            //console.log(JSON.stringify(ar));
            divDialog.dialog("close");
        }

    });
    return divDialog;
}

function doInit() {
    //проверяем есть ли юзер. 
    //если есть, то загружаем локальные данные
    //если нет, то авторизуемся
    if (localStorage.user_id == null) {
        CreateDialogWithItems('Авторизация', null).dialog('open'); //show auth dialog
    } else {
        updateInterface_user();
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
        class: _class,
        //attr: {'status_id': status_id, 'ts': timestamp}
    });

    var tHead = $('<thead/>', {
        //id: id,
        //class: _class,
        //attr: {'status_id': status_id, 'ts': timestamp}
    });

    tHead.append(ArrayToTableHeader(headerItems));
    table.append(tHead);

    var tBody = $('<tbody/>', {
        //id: id,
        //class: _class,
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
        row = "<tr>";
        $.each(val, function (key2, val2) {
            if (key2 != 'id') {
                row = row + "<td>" + val2 + "</td>";
            }
        });
        row = row + "</tr>";
        items.push(row);
    });
    return items;
    //$("#tProducts tbody").html(items);
}

function ArrayToLiItems(ulItems) {
    var items = [];
    $.each(ulItems, function (key, val) {
        //class: 'order ui-widget ui-widget-content ui-helper-clearfix ui-corner-top'
        items.push("<li item_id=" + val.id + ">" + val.name + "</li>");
    });
    return items;
}

function MakePanelHTML(panel_id, row) {
    var divPanel = $('<div/>', {
        id: panel_id,
        class: 'ordrow ui-state-active',
        attr: {'row': row, 'bla': 'blllaa'}
    });
    return divPanel;
}

function MakeOrderHTML(order_id, number, status_id, Comment, start_time, stop_time, timestamp, address) {
    //var js_date_str = d.substr(0,10)+'T'+d.substr(11,8);
    var divOrder = $('<div/>', {
        id: order_id,
        class: 'order ui-widget ui-widget-content ui-helper-clearfix ui-corner-top',
        attr: {'status_id': status_id, 'ts': timestamp}
    });

    if (status_id == 4) {
        divOrder.addClass('ui-state-disabled');
    }
    if (status_id == 5) {
        divOrder.addClass('ui-state-default');
    }

    var divOrderHeader = $('<div/>', {
        //id: order_id,
        class: 'order-header ui-widget-header ui-corner-top',
        text: number
    });


    if (stop_time == null) {
        stop_time = '-'
    }
    ;
    //var curDate = new Date();
    var divTime = $('<div/>', {
        class: 'time ui-corner-tr',
        html: 'Принят в <span class="startTime">' + start_time + '</span><br/>Готов в <span class="stopTime">' + stop_time + '</span>'//order_time
    });
    divOrderHeader.append(divTime);


//var selectHTML='<select name="menu_drivers" id="menu_drivers" style="width: 100%;"><option selected disabled>Назначить курьера</option><option>Пупкин</option><option>Сидоров</option><!--<option selected="selected">Medium</option>--><option>Иванов</option><option>Петров</option></select>';
    var divOrderContent = $('<div/>', {
        //id: "content_"+order_id,
        class: 'order-content',
        html: '<div class="products"><ul id="ulProducts_' + order_id + '"></ul><span class=comment>' + Comment + '</span><hr/>' + address + '</div>'
    });

    $('<label for="' + 'chkDone' + order_id + '">Готов</label>').appendTo(divOrderContent);
    var chkDone = $("<input/>", {
        type: 'checkbox',
        id: 'chkDone' + order_id,
        name: 'n' + order_id,
        class: 'orderDoneButton'
    });
//    SetOrderProducts(order_id);
    $(chkDone).appendTo(divOrderContent);
    $(chkDone).button({
        icons: {
            primary: "ui-icon-check",
            //secondary: "ui-icon-triangle-1-s"
        },
        text: false
    }
    );
    $(chkDone).click(function (event) {
        var order = $(event.target).parent().parent();
        order.toggleClass('ui-state-disabled');

        order.attr('status_id', function (index, attr) {
            return attr == 3 ? 4 : 3;
        });
        UpdateOrderStatusOnServer(order.attr("id"), order.attr("status_id"));


        //$("#log").append("<br/>Moved from " + ui.sender.attr("id") + " to " + ui.item.parent().attr("id"));
//                        switch (ui.item.parent().attr("id")) {
//                            case "mainPanel":
//                                ui.item.attr("status_id", 2);
//                                UpdateOrderStatusOnServer(ui.item.attr("id"), 2);
//                                break;
//                            case "donePanel":
//                                ui.item.attr("status_id", 5);
//                                UpdateOrderStatusOnServer(ui.item.attr("id"), 5);
//                                break;
//                        }
        order.fadeOut(200);
        order.fadeIn(400);
    });

//$("<button>Редактор</button>").button({
//      icons: {
//        primary: "ui-icon-locked"
//      },
//      text: false
//  }).appendTo(divOrderContent);;


    $('<label for="' + 'bEdit' + order_id + '">Редактор</label>').appendTo(divOrderContent);
    var bEdit = $("<button/>", {
        type: 'checkbox',
        id: 'bEdit' + order_id,
        name: 'n' + order_id,
        class: 'orderDoneButton'
    });

//    SetOrderProducts(order_id);
    $(bEdit).appendTo(divOrderContent);
    $(bEdit).button({
        icons: {
            primary: "ui-icon-pencil",
            //secondary: "ui-icon-triangle-1-s"
        },
        text: false,
    }
    );

    $(bEdit).click(function (event) {

        //var order = $(event.target).parent().parent();
        //$("#dlgEdit").attr("order_id", $(this).parent().attr("id"));
        var order_id = $(event.target).parent().parent().attr("id");
//        $("#scanr").text("");
//        $("#scanp").text("");
//        $("#weight").text("");
        weightR = 0;
        weightP = 0;
        LoadOrderProducts(order_id);
        $("#dlgEdit").attr("order_id", order_id);
        $("#dlgEdit").dialog("open");
    });
    //divOrderContent.append(btnDone);

//    $('<button/>')
//            .text('Test')
//            .click(function () {
//                alert('hi');
//            }).appendTo(divOrderContent);

    divOrder.append(divOrderHeader);
    divOrder.append(divOrderContent);
    return divOrder;
}

function LoadOrderProducts(order_id)
{
    return $.ajax({
        type: "POST",
        data: "action=getOrderProducts&order_id=" + order_id,
        url: "helper.php",
        cache: false,
        success: function (jsondata) {
            console.log("Loading products. Server response is " + jsondata);
            localStorage.orders = jsondata;
            localStorage.orders_ts = 123;

            var data = $.parseJSON(jsondata);
            var items = [];
            var sum = 0;
            //items.push("<thead><tr><th>Продукт</th><th>Кол-во</th><th>Цена</th></tr></thead>");
            weightP = 0;
            weightR = 0;
            $.each(data, function (key, val) {
                var id_string = "";
                sum = sum + parseFloat(val.price);
                switch (val.product_id) {
                    case '1271':
                        id_string = "id='scanp'";
                        weightP = parseFloat(val.count);
                        break;
                    case '1272':
                        id_string = "id='scanr'";
                        weightR = parseFloat(val.count);
                        break;
                    case '1273':
                        id_string = "id='weight'";
                        break;
                }
                items.push("<tr id='" + val.product_id + "'><td>" + val.name + "</td><td " + id_string + ">" + val.count + "</td><td>" + val.price + "</td></tr>");
            });
            //items.push("<tr><tfoot>sum</tfoot><tfoot>Кол-во</tfoot><tfoot>"+sum+"</tfoot></tr>");
            $("#weight").text((weightP + weightR));
            $("#tProducts tbody").html(items);
            $("#totalPrice").html(sum);
        }
    });
}

//changes status 
function ChangeOrder(id, status_id, timestamp, x, y, start_time, stop_time) {
    var order = $("#" + id);
    order.attr("ts", timestamp);
    SetOrderPosition(order, x, y);
    order.find('span.startTime').text(start_time);
    if (stop_time == null) {
        stop_time = '-'
    }
    ;
    order.find('span.stopTime').text(stop_time);
    if (order.attr("status_id") !== status_id) {
        order.attr("status_id", status_id);
//        switch (status_id) {
//            case 3:
//                order.find('span.stopTime').text("");
//                break;
//            case 4:
//                order.find('span.stopTime').text(stop_time);
//                break;
//            case 5:
//                break;
//        }
        order.toggleClass('ui-state-disabled');
        order.fadeOut(200);
        order.fadeIn(600);
    }
}

function ProcessOrders(jsondata) { //create orders, skip if exists
//    [{"number":"6","status_id":"5"},{"number":"2","status_id":"2"},{"number":"5","status_id":"2"},{"number":"7","status_id":"5"}]
    if (!$.isEmptyObject(jsondata))
    {
        console.log('server response: ' + jsondata);
        //$("#log").append(jsondata);
        var data = $.parseJSON(jsondata);
        //var items = [];
        var order;
        $.each(data, function (key, val) {
            order = $("#" + val.id);
            if (order.length) { //if exists
                ChangeOrder(val.id, val.status_id, val.ts, val.x, val.y, val.start_time, val.stop_time); //change status if needed
                //$("#log").append("<br/>already exists");
//            $("#" + val.id).animate({width:'-=30px', height:'-=30px'});
                //$("#" + val.id).toggle({width:'-=10px', height:'-=10px'});
                //$("#log").append("<br/>sid]="+$("#" + val.id).attr("status_id"));
            } else { //create
//            switch (val.status_id) {
//                case "2":
//                    panel = $("#mainPanel");
//                    clicksound.playclip();
//                    break;
//                case "5":
//                    panel = $("#donePanel");
//                    break;
//                default:
//                    panel = $("#mainPanel");
//                    break;
//            }

                if (val.y == null) {
                    var p = 4;
//                    if (key > 5) {
//                        p = p + 1
//                    }
//                    if (key > 10) {
//                        p = p + 1
//                    }
                } else
                {
                    p = val.y;
                }
                if (val.status_id == 5) { //if delivery
                    p = 5
                }
                var panel = $("#Panel" + p);
//            if (panel.) {
//                
//            }
                var address = val.street == null ? 'адрес не указан' : val.street + " " + val.building;
                panel.append(MakeOrderHTML(val.id, val.number, val.status_id, val.comment, val.start_time, val.stop_time, val.ts, address)); //val.id
                //ChangeOrder(val.id, val.status_id, val.ts, val.x, val.y, val.start_time, val.stop_time);
// temporary commented                clicksound.playclip();
            }

            //items.push(MakeOrderHTML(val.id,val.number,val.status_id));
        });
        //$("#34841").appendTo($("#donePanel"));


    } else {
        console.log('server response is empty');
    }
    return 1; // data[0].number+" "+data[0].status_id;
}

function LoadCouriers()
{
    $.ajax({
        type: "POST",
        data: "action=getCouriers",
        url: "helper.php",
        cache: false,
        success: function (jsondata) {
            var data = $.parseJSON(jsondata);

            var items = [];
            $.each(data, function (key, val) {
                //class: 'order ui-widget ui-widget-content ui-helper-clearfix ui-corner-top'
                items.push("<li id='courier_" + val.id + "' courier_id='" + val.id + "' class='ui-widget-content ui-corner-all'>" + val.name + "</li>");
            });
            $("#ul_couriers").html(items);

            $("#ul_couriers").selectable({
                tolerance: "fit",
                selected: function (event, ui) {
                    //alert(ui.selected.id + " " + ui.selected.innerHTML);

                    var y = parseInt($("#dialog").attr("row"));
                    //$("#"+idPanel + " .order").css("visible:none;");
                    SetCourierToOrdersAndClear(y, parseInt($(ui.selected).attr("courier_id")));

                    //console.log(JSON.stringify(ar));
                    $("#dialog").dialog("close");
                }

            });



        }
    });
}

function UpdateOrderStatusOnServer(id, status_id)
{
    $.ajax({
        type: "POST",
        data: "action=updateOrderStatus&id=" + id + "&status_id=" + status_id,
        url: "helper.php",
        cache: false,
        success: function (jsondata) {
            //$("#log").append("<br/>updated"+jsondata); 
        }
    });
}

function SetCourierToOrdersAndClear(fromRowNo, courier_id)
{
    var ar = [];
    var panel = $("#Panel" + fromRowNo);
    var y = fromRowNo; //parseInt(panel.attr("row"));

    $("#Panel" + fromRowNo + " .order").each(function (index) {
        //$(this).attr("status_id")
        var order_id = $(this).attr("id");
        //var x = index;
        //ar.push(new Array(parseInt(order_id), x, y));
        ar.push(order_id);
    });
    var json_orders = JSON.stringify(ar);

    $.ajax({
        type: "POST",
        data: "action=SetCourierToOrders&json=" + json_orders + "&courier_id=" + courier_id,
        url: "helper.php",
        cache: false,
        success: function (timestamps) {
            $("#Panel" + fromRowNo + " > *:not('.setCourierButton')").appendTo($('#Panel4')); // remove();
            console.log("returned timestamps: " + timestamps);
            K_RequestServer(); //force page update
        }
    });
}

function SetOrderPosition(order, x, y)
{
//    var order = $("#" + order_id);
    var current_y = order.parent().attr("row");
    var current_x = order.index();
    if (current_y !== y) {
        order.appendTo($("#Panel" + y));
    }
    //$("#" + order_id).insertAfter($("#34849"));
}
function SetOrderPositionOnServer(order_id, x, y)
{
//    var ar = [];
//    var panel = $("#" + panel_id);
//    var y = parseInt(panel.attr("row"));
//
//    $("#" + panel_id + " .order").each(function (index) {
//        //$(this).attr("status_id")
//        var order_id = $(this).attr("id");
//        //var x = index;
//        //ar.push(new Array(parseInt(order_id), x, y));
//        ar.push(order_id);
//    });
//    var json_orders = JSON.stringify(ar);

    $.ajax({
        type: "POST",
        data: "action=SetOrderPosition&issue_id=" + order_id + "&x=" + x + "&y=" + y,
        url: "helper.php",
        cache: false,
        success: function (timestamp) {
//            //$("#" + panel_id + " > *:not('.setCourierButton')").remove();
//            //$("#log").append(timestamp);
//            $("#" + order_id).attr("ts", timestamp);
//            if (y == 4) {
//                $("#" + order_id).attr("status_id", 5);
//            } else
//            {
//                $("#" + order_id).attr("status_id", 3);
//            }
        }
    });
}

function updateInterface_user() {
    $("#userinfo").text(localStorage.user_name);
}

function updateInterface_products() {
    $('#tableR tbody').html(ArrayToTableItems($.parseJSON(localStorage.products)));
    $('#tableP tbody').html(ArrayToTableItems($.parseJSON(localStorage.products)));
}
