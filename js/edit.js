/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function LoadOrderProducts(order_id)
{
    return $.ajax({
        type: "POST",
        data: "action=getOrderProducts&order_id=" + order_id,
        url: "helper.php",
        cache: false,
        success: function (jsondata) {
            console.log("Loading products. Server response is " + jsondata);
            var data = $.parseJSON(jsondata);
            var items = [];
            var sum=0;
            //items.push("<thead><tr><th>Продукт</th><th>Кол-во</th><th>Цена</th></tr></thead>");
            weightP = 0;
            weightR = 0;
            $.each(data, function (key, val) {
                var id_string = "";
                sum=sum+parseFloat(val.price);
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

var inp = $("#inpScanner");
var weightP = 0;
var weightR = 0;

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