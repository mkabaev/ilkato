/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function K_RequestServer()
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
        data: "action=getKOrders&json=" + json_orders,
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

$(function () {
    $("#rightpanel").sortable({
        connectWith: "#rightpanel",
        axis: "y",
        handle: ".order-header, .order-content",
        cancel: ".order-toggle",
        placeholder: "order-placeholder ui-corner-all",
        //helper: "clone"
        //opacity: 0.8,
        //revert:true
        cursor: "move",
        //disabled: true
        delay: 150,
        revert: 150,
//                    start: function (event, ui) {
//                        var currPos1 = ui.item.index();
//                    },
//                    change: function (event, ui) {
//                        var currPos2 = ui.item.index();
//                        //alert("done");
//                    },

//                    update: function (event, ui) {
//                        //$('#sortable li').removeClass('highlights');
//
//                        if (ui.sender) {
//                        //ui.item.attr("status_id");
//                            $("#log").append("<br/>Done" + ui.sender)
//                        }
//
//                    }

        receive: function (event, ui) {
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
            //console.log(("order "+ui.item.attr("id")+" to row"+ui.item.parent().attr("row")));
            var newrow = ui.item.parent().attr("row");
            var newstatus;
            if (newrow == 5) {
                newstatus = 5;
            } else {
                newstatus = 3;
            }
            SetOrderPositionOnServer(ui.item.attr("id"), 1, ui.item.parent().attr("row"));
            UpdateOrderStatusOnServer(ui.item.attr("id"), newstatus);
            ui.item.fadeOut(200);
            ui.item.fadeIn(600);
        }

    });
});

$(function () {
    //$(".ordrow").disableSelection();
    //$(".order").disableSelection();
    //$(".dialog").disableSelection();
    //$(".dlgEdit").disableSelection();
    $("body").disableSelection();
//                $(".setCourierButton").click(function () {
//                    $("#divcurier").animate({width: '300px'}, 500);
//                });
//                $("#menu_drivers").selectmenu();
    $("#dlgEdit").dialog({
        width: "500px",
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
        buttons: {
//                        "ЗАКРЫТЬ": function () {
////                            var order_id = $("#dlgEdit").attr("order_id");
//                            //var weightP=$("#scanp").attr("weight");
//                            //var weightR=$("#scanr").attr("weight");
//                            //console.log(weightP);
////                            SetOrderProductsOnServer(order_id, weightR, weightP);
//                            weightR = 0;
//                            weightP = 0;
//                            //console.log("response is "+res);
//                            //alert( $(this).children("#scanp").text());
//                            $(this).dialog("close");
//                        }
        },
        open: function () {
            $('.ui-widget-overlay').bind('click', function () {
                weightR = 0;
                weightP = 0;
                $('#dlgEdit').dialog('close');
            })
        },
        dialogClass: "noclose"
    });
//                $(function () {
//                    $("#menu").menu({
//                        items: "> :not(.ui-widget-header)"
//                    });
//                });
    $("#menu").selectable({
        selected: function (event, ui) {}
    });
//                $("#inpScanner").change(function () {
//                    alert("called.");
//                });
    $("#bJapanDone, #bItalyDone").button({
        icons: {
            primary: "ui-icon-check",
            //secondary: "ui-icon-triangle-1-s"
        },
    });
    $("#bJapanDone, #bItalyDone").click(function (event) {
        alert('event.target')
    });

    $("#bPrint").button();

    var ScannerTimerId;
    $("#inpScanner").focusin(function () {
        ScannerTimerId = setInterval('ProcessScanner()', 100);
        //console.log("scannerTimer: "+ScannerTimerId);
    });
    $("#inpScanner").focusout(function () {
        clearInterval(ScannerTimerId);
        //console.log("scannerTimer: "+ScannerTimerId);
    });
});

$(document).ready(function () {
    K_RequestServer();
    LoadCouriers();
    setInterval('K_RequestServer()', 3000);
    $(".left").append(MakePanelHTML('pane12', 12));
    //$('#mainRange').append(DrawOrderCartHTML(3,123,6));

});