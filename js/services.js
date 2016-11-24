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
        eventSource = new EventSource("events.php?id_session=" + localStorage.id_session);
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

        eventSource.addEventListener('message', function (e) {
            document.getElementById("result").innerHTML += "msg:" + e.data + "<br>";
        }, false);

        eventSource.addEventListener('onopen', function (e) {
            document.getElementById("result").innerHTML += "open:" + e.data + "<br>";
        }, false);

        eventSource.addEventListener('onerror', function (e) {
            document.getElementById("result").innerHTML += "ERR:" + e.data + "<br>";
        }, false);

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
    setItemsToLS("o_", [order]);

//    var dates = [];
//    $(items).each(function (indx, order) {
//        dates.push(order.DDate);
//    });

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
            updateInterface_order(order);
            break;
        case '3':
            //TODO: 1-сохранить новый заказ в LS
            //2-если активный, то обновить его
            //3-если новый, то добавить в панель
            updateInterface_order(order);
            if (order.id == localStorage.activeOrder) {
                updateOrderViewer(localStorage.activeOrder);
            }
//1	Принят
//2	Готовить
//3	Готовится
//4	Приготовлен
//5	Доставка
//6	В пути
//7	Доставлен
//8	Отказ
            //updateInterface_orders(_orders);
            //        updateKInterface_SelPanel();
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

function ProcessScanner()
{
    //2200003014129 roll
    //2200001012985 pizza
    if (inp.val().length == 13) {
        var s = inp.val();
        var type = s.substr(1, 6);
        var weight = s.substr(7, 5);
        weight = parseInt(weight);
        switch (type) {
            case "200003": //roll
                //var inttt=parseInt(weight);

                //$('#tProducts').append('<tr><td>my data</td><td>more data</td></tr>');
                //items.push("<tr id='" + val.product_id + "'><td>" + val.name + "</td><td id='scanp'>" + val.count + "</td><td>" + val.price + "</td></tr>");

                weightR = weight / 1000;
                $("#scanr").text(weightR);
                //$("#scanr").attr('weight', weightP);
                break;
            case "200001":
                weightP = weight / 1000;
                $("#scanp").text(weightP);
                //$("#scanp").attr('weight', weightR);
                break;
        }
        inp.val("");
        //$("#weight").text((weightP + weightR));
        SetOrderProductsOnServer($("#dlgEdit").attr("order_id"), weightR, weightP);
    }
}

function SetOrderProductsOnServer(order_id, weightR, weightP)
{
    $.ajax({
        type: "POST",
        data: "action=SetOrderProducts&issue_id=" + order_id + "&weightR=" + weightR + "&weightP=" + weightP,
        url: "helper.php",
        cache: false,
        success: function (timestamp) {
            //$("#" + panel_id + " > *:not('.setCourierButton')").remove();
            //$("#log").append(timestamp);
            $("#" + order_id).attr("ts", timestamp);
            LoadOrderProducts(order_id);
        }
    });
}