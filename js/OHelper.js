function createOperatorInterface() {
    //            //console.log(JSON.stringify(oitems));
//
//            //$.parseJSON('[{"id":"3","name":"11","count":"2"},{"id":"10","name":"12","count":"2"},{"id":"11","name":"33","count":"2"},{"id":"12","name":"14","count":"2"},{"id":"13","name":"45","count":"2"}]');

//            var ulOrders = $('<ul/>', {
//                id: 'o_ordersPanel',
//                class: 'connectedSortable',
//                //attr: {'title': 'caption'}
//            }).appendTo($('#workplace'));

    var pnlOrders = $('<div/>', {
        id: 'o_ordersPanel',
        class: 'connectedSortable',
        //attr: {'title': 'caption'}
    });
    pnlOrders.appendTo($('#workplace'))
    updateOInterface_ordersPanel();

    var pnlActiveOrders = $('<div/>', {
        id: 'o_activeOrdersPanel',
        //class: 'connectedSortable',
        //attr: {'title': 'caption'}
    });
    //var pnlActiveOrders = CreateGroupPanel();
    pnlActiveOrders.appendTo($('#workplace'));
    pnlActiveOrders.append(CreateBatchPanel());
    pnlActiveOrders.append(CreateBatchPanel());
//            var ritems = ArrayToLiItems($.parseJSON('[{"id":"1"},{"id":"2"},{"id":"3"},{"id":"4"},{"id":"5"}]'));
//            var ulRows = createUL("o_rows", undefined, ritems).appendTo('#workplace');
//            $(ulRows).children('li').addClass('ui-state-default');

//            $(ulRows).children('li').html(createUL(undefined, 'o_orderlist connectedSortable', undefined)); //ritems
//            $(ulRows).children('li').prepend('<div style="float:left;padding:0;margin:0;top:10px;" class="ui-icon ui-icon-grip-dotted-vertical"></div>');
////'<span class="ui-icon u ui-icon-carat-2-n-s"></span>'
////$('.o_orderlist').children('li').html('<div style="float:left; padding:0; margin:0;">dasda</div>');

    $("#o_ordersPanel").sortable({
        connectWith: ".connectedSortable",
        //axis: "y",
        //handle: ".order-header, .order-content",
        //cancel: ".order-toggle",
        //placeholder: "order-placeholder ui-corner-all",
        //helper: "clone"
        //opacity: 0.8,
        //revert:true
        cursor: "move",
        //disabled: true
        //delay: 150,
        //revert: 150,



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
            console.log("Moved from " + ui.sender.attr("id") + " to " + ui.item.parent().attr("id"));
        }



    }).disableSelection();

    $(".o_orderBatchPanel").sortable({
        connectWith: ".connectedSortable",
        receive: function (event, ui) {
            console.log("Moved from " + ui.sender.attr("id") + " to " + ui.item.parent().attr("id"));
        }
    }).disableSelection();



    $("#o_activeOrdersPanel").sortable({
        //connectWith: ".connectedSortable",
        axis: "y",
    }).disableSelection();
}

function CreateBatchPanel() {
    var divPanel = $('<div/>', {
        //id: panel_id,
        class: 'o_orderBatchPanel connectedSortable ui-state-default',
        //attr: {'row': row, 'bla': 'blllaa'}
    });
    return divPanel;
}