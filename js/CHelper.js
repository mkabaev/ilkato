/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function C_RequestServer()
//send orders timestamps to server and recive changes
{
    var ar = [];
    //var y = parseInt(panel.attr("row"));
    $(".order").each(function (index) {
        //$(this).attr("status_id")
        //var x = index;
        ar.push(new Array(parseInt($(this).attr("id")), $(this).attr("ts")));
        //ar.push(order_id);
    });
    var json_orders = JSON.stringify(ar);
    //console.log('send to server: '+json_orders);
    
    $.ajax({
        type: "POST",
        data: "action=getCOrders&json=" + json_orders,
        url: "helper.php",
        cache: false,
        success: function (jsondata) {
            $(".ordrow").removeClass("ui-state-error");
            ProcessOrders(jsondata);    //append(jsondata); 
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

$(document).ready(function () {
    C_RequestServer();
    LoadCouriers();
    setInterval('C_RequestServer()', 3000);
    //$('#mainRange').append(DrawOrderCartHTML(3,123,6));

});