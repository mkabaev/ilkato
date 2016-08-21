function createOperatorInterface() {
    var oitems = $.parseJSON('[{"id":"3","name":"11","count":"2"},{"id":"3","name":"11","count":"2"},{"id":"3","name":"11","count":"2"},{"id":"10","name":"12","count":"2"},{"id":"11","name":"33","count":"2"},{"id":"12","name":"14","count":"2"},{"id":"13","name":"45","count":"2"}]');

    var ulOrders = $('<ul/>', {
        id: 'o_sortable1',
        class: 'connectedSortable',
        //attr: {'title': 'caption'}
    }).appendTo($('body'));
    ulOrders.html(ArrayToLiItems(oitems));
    ulOrders.children('li').addClass('ui-state-default');

    var ritems = ArrayToLiItems($.parseJSON('[{"id":"3","name":"Row1"},{"id":"3","name":"Row1"},{"id":"3","name":"Row1"},{"id":"3","name":"Row1"},{"id":"10","name":"Row2"},{"id":"11","name":"Row3"}]'));
    var ulRows = CreateUL("o_rows", undefined, ritems).appendTo('body');
    $(ulRows).children('li').addClass('ui-state-default');

    $(ulRows).children('li').html(CreateUL(undefined, 'o_orderlist connectedSortable', undefined)); //ritems


    $("#settings").on("click", function ()
    {
        $("#o_rows").append(ritems);
        $("#o_rows").children('li').addClass('ui-state-default');
        $("#o_rows").children('li').html(CreateUL(undefined, 'o_orderlist connectedSortable', undefined)); //ritems
                $(".o_orderlist").sortable({
            connectWith: ".connectedSortable",
            //axis: "y",
        }).disableSelection();
    });
//$('.o_orderlist').children('li').html('<div style="float:left; width:40px;">hhd</div>');

    $(function () {
        $("#o_sortable1").sortable({
            connectWith: ".connectedSortable",
            //axis: "y",
        }).disableSelection();

        $("#o_rows").sortable({
            //connectWith: ".connectedSortable",
            axis: "y",
        }).disableSelection();


        $(".o_orderlist").sortable({
            connectWith: ".connectedSortable",
            //axis: "y",
        }).disableSelection();
    });
}