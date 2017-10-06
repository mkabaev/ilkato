/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


/* global EventSource */

var eventSource;

//
function addEventListeners() {
    if (eventSource !== undefined) {
        eventSource.close();
    }
    if (typeof (EventSource) !== "undefined") {
        //sendRequest("login", "uid=" + localStorage.uid + "&wid=" + localStorage.wp_id + "&old_sid=" + localStorage.id_session, function (data) {

        eventSource = new EventSource("events.php?id_session=" + localStorage.id_session + "&wid=" + localStorage.wp_id);
//                source.onmessage = function (event) {
//                    document.getElementById("result").innerHTML += event.data + "<br>";
//                };
//
//                source.myevent = function (event) {
//                    document.getElementById("result").innerHTML += event.data + "<br>";
//                };
//                source.addEventListener('message', function (e) {
//                    document.getElementById("result").innerHTML += e.data + "<br>";
//                }, false);

//        eventSource.addEventListener('message', function (e) {
//            console.log("eventSource msg:" + e.data);
//        }, false);
//        eventSource.addEventListener('onopen', function (e) {
//            console.log("eventSource opened:" + e.data);
//        }, false);
//        eventSource.addEventListener('onerror', function (e) {
//            console.log("eventSource ERROR:" + e.data);
//        }, false);

        eventSource.onopen = function (e) {
            console.log("eventSource Соединение открыто");
        };
        eventSource.onerror = function (e) {
            if (this.readyState == EventSource.CONNECTING) {
                console.log("eventSource Соединение порвалось, пересоединяемся...");
            } else {
                console.log("eventSource Ошибка, состояние: " + this.readyState);
            }
        };
        eventSource.onmessage = function (e) {
            console.log("eventSource Пришли данные: " + e.data);
        };

        eventSource.addEventListener('ordUpdate', ordUpdate, false);
        eventSource.addEventListener('batchUpdate', batchUpdate, false);

    } else {
        alert("Sorry, your browser does not support server-sent events..., Звоните Максимке");
    }
}
function ordUpdate(e) {
    console.log('ordUpdate fired:');
    //console.log(e.data);
    var order = JSON.parse(e.data);
    console.log(order);
//    setItemsToLS("o_", [order]);


//    localStorage.dates = $.unique(dates);
    //localStorage.dates = ["2016-10-25", "2016-10-26", "2016-10-28"];
    afterOrdUpdate(order);
}

function batchUpdate(e) {
    console.log('batchUpdate fired:');
    var items = JSON.parse(e.data);
    console.log(items);
    setItemsToLS("b_", items);
    afterBatchUpdate(items);
}

function afterOrdUpdate(order) {
    switch (localStorage.wp_type) {
        case '2':
            updateOInterface_order(order);
            break;
        case '3':
            //TODO: 1-сохранить новый заказ в LS
            //2-если активный, то обновить его
            //3-если новый, то добавить в панель

            var o = null;
            for (var i = 0; i < G.AllOrders.length; i++)
                if (G.AllOrders[i].id === order.id) {
                    G.AllOrders[i] = createOrderObj(order);
                    o = G.AllOrders[i];
                }

            //var filtered = G.AllOrders.filter(o => (o.id === order.id));
            if (o !== null) {//exists
                $("#" + o.id).orderPanel("option", "order", o);

            } else { //new
                //add to panel if needed
                if (G.curOrder.idBatch === o.idBatch) {
                    $("<div/>")
                            .orderPanel({order: o})
                            .appendTo($('#o_ordersPanel'))
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
            }
            if (order.id === G.curOrder.id || G.AllOrders.length === 1) {
                $("#" + order.id).click();
            }

            break;
    }
    //audio.play();
}

function afterBatchUpdate(batches) {
    switch (localStorage.wp_type) {
        case '2':
            updateOInterface_batches(batches);
            break;
        case '3': //TODO: batches in kitchen
            //updateOrderViewer(localStorage.activeOrder);
            //updateKInterface_SelPanel();
            break;
    }
    //audio.play();
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

function SetOrderProductsOnServer(order_id, weightR, weightP)
{
    $.ajax({
        type: "POST",
        data: "action=SetOrderProducts&issue_id=" + order_id + "&weightR=" + weightR + "&weightP=" + weightP,
        url: "api.ilkato.ru",
        cache: false,
        success: function (timestamp) {
            //$("#" + panel_id + " > *:not('.setCourierButton')").remove();
            //$("#log").append(timestamp);
            $("#" + order_id).attr("ts", timestamp);
            LoadOrderProducts(order_id);
        }
    });
}