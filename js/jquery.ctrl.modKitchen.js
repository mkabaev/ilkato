$.widget("ctrl.modKitchen", {
    options: {
        value: 10,
        order: null,
        type: null,
        // Callbacks
        change: null,
        random: null
    },
    _create: function () {
//            var divChefs = $('<div/>', {
//        id: 'divChefs' + modType,
//        //class: 'ui-widget-',
//    }).appendTo(divHeader).append('<span class="ui-icon ui-icon-person"></span>Повара').css({"float": "right", "padding": "5px"});


        this.element.addClass("ui-widget ui-widget-content modKitchen");
//        console.log(this.options.order.Products);
        this.pLogo = $('<div class="logo"></div>').appendTo(this.element);

//        if (this.options.type !== null) {
//            this.element.append('<div class="img' + (this.options.type === 1 ? "Roll" : "Pizza") + '"></div>');
//        }
//    var select = $('<select/>', {
//        id: "selstatus",
//        name: "status",
////        class: 'ui-widget-header',
//    }).append('<label for="status">Статус</label>').appendTo(divOrderViewer);
        this.pHeader = $('<div/>', {
//            id: "orderheader",
            class: 'ui-widget-header header',
        }).appendTo(this.element);

        this.bPrint = $('<button/>').button({
            class: 'bprint',
            //text: "Печать",
            icons: {
                primary: "ui-icon-print",
                //secondary: "ui-icon-triangle-1-s"
            }
        }).appendTo(this.pHeader);

        this.bPrint2 = $('<button/>').button({
            class: 'bprint',
            //text: "Печать",
            icons: {
                primary: "ui-icon-print",
                //secondary: "ui-icon-triangle-1-s"
            }
        }).appendTo(this.pHeader).addClass("ui-state-disabled");

        this.bPrint.click(function (event) {
            localStorage.removeItem("chktemplate");
            //if (localStorage.getItem("chktemplate") === null) {
            $.ajaxSetup({cache: false});
            $.get("chktemplate.html", function (data) {
                localStorage.chktemplate = data;
                //alert(data);
                //printHTML(localStorage.chktemplate, getOrderFromLS(localStorage.activeOrder));
                //printHTML(data, getOrderFromLS(localStorage.activeOrder));
                printHTML(data, getOrdersFromLS()[0]);
            });
            //} else {
            //    printHTML(localStorage.chktemplate, getOrderFromLS(localStorage.activeOrder));
            //}


        });

        this.pNumber = $('<div/>', {
            class: "number",
        }).appendTo(this.pHeader);

        this.pComment = $('<div/>', {
            class: 'comment',
        }).appendTo(this.element);

        this._createTable();
        this._createButtons();
        this._createTimer();

        if (this.options.order !== null) {
            this._refresh();
        }
    },
    _setOption: function (key, value) {
        switch (key) {
            case "order":
                //console.log(this.options.order);
                //console.log(value);
                this.options.order = value;
                this._refresh();
                break;
            case "Name":
                //$(this.pName).val(this.options.Name);
                //$(this.pName).val(value);
                break;
            case "Phones":
//                var defPhone = {"Phone": null, "isDefault": null};
//                if (Array.isArray(this.options.Phones) && this.options.Phones.length) {
//                    defPhone = this.options.Phones.find(function (element, index, array) {
//                        return element.isDefault == 1;
//                    });
//                }
//                $(this.pPhone).val(defPhone.Phone);
                break;
            case "Addresses":
//                $(this.pAddresses).empty().append(ArrayToOptionItems(this.options.Addresses));
//                //or like this: [{id:1,Name:"Принят"},"Готовить","Готовится","Приготовлен"]
                break;
            case "Card":
//                $(this.pCard).val(this.options.Card);
                break;
            case "Info":
//                $(this.pComment).val(this.options.Comment);
                break;
            case "Org":
//                $(this.pOrg).val(this.options.Org);
                break;
        }
        this._super(key, value);
        //this._super( "_setOption", key, value );
    },
    _setOptions: function (options) {
        this._super(options);
        this._refresh();
    },

    // Called when created, and later when changing options
    _refresh: function () {
        this.pLogo.html('<span class="ico-' + this.options.order.idPricingType + '"></span>');
        var s = "";
        if (this.options.type !== null) {
            s = this.options.type === 1 ? "ЯПОНИЯ: " : "ИТАЛИЯ: ";
        }
        this.pNumber.text(s + 'Заказ ' + this.options.order.No);
        this.pComment.text(this.options.order.Comment);

        //this.t.jsGrid("refresh");
        var w = this;
        this.t.jsGrid("loadData", this.options.type);

        var cookingTime = calcCoockingTime(this.options.order.Products, this.options.type, 1);

//        this.timer.countdown360().stop();
//        this.timer.countdown360().settings.seconds = cookingTime;
//        this.timer.countdown360().start();

        var isCooked = w.options.order.Products
                .filter(function (p) {
                    if (p.Tags !== null) {
                        return p.Tags.map(function (tag) {
                            return tag.id;
                        }).includes(w.options.type);
                    }
                }).every(function (p) {
            return p.isCooked === 1;
        });

        if (isCooked) {
            this.t.addClass("ui-state-disabled");
            if (this.timer) {
                this.timer.stop();
            }
        }
//        if (this.options.type !== null) {
//            this.t.jsGrid("search", this.options.type);
//        }
    },
    _createTable: function () {
        this.t = $('<div></div>').appendTo(this.element);
        var w = this;
        this.t.jsGrid({
            width: "100%",
            height: "400px",
//            filtering: true,
//            autoload: true,
//    inserting: true,
//    editing: true,
//    sorting: true,
//    sorter: "string",


            controller: {
//                loadData: $.noop,
                //insertItem: $.noop,
                //updateItem: $.noop,
                //deleteItem: $.noop
                loadData: function (filter) {
//                    console.log("filter");
//                    console.log(filter);
                    var items = w.options.order.Products
                            .filter(function (p) {
                                if (p.Tags !== null) {
                                    return p.Tags.map(function (tag) {
                                        return tag.id;
                                    }).includes(filter);
                                }
                            });
                    return items;
//                    return $.ajax({
//                        dataType: 'json',
//                        type: "POST",
//                        url: "helper.php",
//                        data: "action=getProducts" //filter
//                    });
                },
//            loadData: function() {
//                var d = $.Deferred();
//                $.ajax({
//                    dataType: 'json',
//                    type: "POST",
//                    data: "action=getProducts",
//                    url: "helper.php"}).done(function(response) {
//                    console.log("done");
//                    d.resolve(response.value);
//                });

//                $.ajax({
//                    url: "http://services.odata.org/V3/(S(3mnweai3qldmghnzfshavfok))/OData/OData.svc/Products",
//                    dataType: "json"
//                }).done(function(response) {
//                    d.resolve(response.value);
//                });

                //return d.promise();
                //}
            },

//            data: this.options.order.Products,
            fields: [
                {name: "isCooked", type: "checkbox", title: "", width: 20},
                {name: "ProcCardNo", title: "№", type: "number", width: 20},
                {name: "Name", type: "text", width: 120,
                    itemTemplate: function (Name, p) {
                        var tags = p.Tags;
                        if (tags !== null) {
                            tags = tags
                                    .filter(function (tag) {
                                        return tag.id === 4 || tag.id === 10 || tag.id === 13 || tag.id === 17;//30cm 40cm
                                    })
                                    .map(function (tag) {
                                        return tag.id;
                                    });
                        }

                        var el = $("<div></div>").html(Name);
                        el.attr("title", '<hr><h5>Тех. карта №</h5>' + p.ProcCard)

                        tags.forEach(function (itm) {
                            el.addClass('ptag-' + itm);
                        });

////                        tags.forEach(function (tag, index, array) {
////                            s = s + ", " + tag.Name;
////                        });

                        return el[0].outerHTML;
                    }
                },
//                {name: "Comment", type: "textarea", width: 150},
//                {name: "Rating", type: "number", width: 50, align: "center",
//                    //itemTemplate: function (value) {
//                    //    return $("<div>").addClass("rating").append(Array(value + 1).join("&#9733;"));
//                    //}
//                },
//                {name: "Price", type: "number", width: 50,
//                    //itemTemplate: function (value) {
//                    //    return value.toFixed(2) + "$";
//                    //}
//                },
//                {name: "isActive", type: "checkbox", title: "Активен", sorting: false},
                {name: "Weight", type: "number", title: "Вес", sorting: false, width: 40},
                {name: "Count", type: "number", title: "Кол-во", sorting: false, width: 40},
                {name: "CookingTime", type: "number", title: "Время", sorting: false, width: 40},
//                {name: "ProcCard", type: "text",
//                    itemTemplate: function (c) {
//                        var s = '<div class="tooltip">Состав<span class="tooltiptext">' + c + '</span></div>';
////                        tags.forEach(function (tag, index, array) {
////                            s = s + ", " + tag.Name;
////                        });
//                        return s;
//                    }
//                }
            ]
        });
        this.t.tooltip({content: function () {
                return $(this).prop('title');
            }});
    },
    _createButtons: function () {
        var w = this;
        this.bDone = $('<button/>', {
            //id: "bDone" + modType,
            class: 'doneButton',
            text: "Готово",
            icons: {
                primary: "ui-icon-check",
                //secondary: "ui-icon-triangle-1-s"
            },
            click: function (event) {
                w.options.order.Products
                        .filter(function (p) {
                            if (p.Tags !== null) {
                                return p.Tags.map(function (tag) {
                                    return tag.id;
                                }).includes(w.options.type);
                            }
                        }).forEach(function (p) {
                    p.isCooked = 1;
                });
                w._refresh();

                var start = w.timer.startedAt.toLocaleString();
                var stop = w.timer.stoppedAt.toLocaleString();
                console.log("Старт " + start + " | Стоп " + stop);



                var params = {idOrder: w.options.order.id, Products: w.options.order.Products};
                //alert(JSON.stringify(params));
                sendRequest('updateOrderProductsIsCookedStatus', "params=" + JSON.stringify(params), function (response) {
                    //console.log(response);
                });

//                        
//                var divModule = $(this).parent();
//                divModule.addClass('ui-state-disabled');
//
//                var arProducts = [];
//                switch ($(event.target).attr("id")) {
//                    case "bDoneR":
//                        $("#tableR>tbody").children().each(function (index) {
//                            arProducts.push({id: parseInt($(this).attr("item_id")), isCooked: 1})
//                        });
//                        break;
//                    case "bDoneP":
//                        $("#tableP>tbody").children().each(function (index) {
//                            arProducts.push({id: parseInt($(this).attr("item_id")), isCooked: 1})
//                        });
//                        break;
//                }
//                if (arProducts.length) {
//                    var params = {idOrder: parseInt(localStorage.activeOrder), Products: arProducts};
//                    //alert(JSON.stringify(params));
//                    sendRequest('updateOrderProductsIsCookedStatus', "params=" + JSON.stringify(params), function (response) {
//                        //console.log(response);
//                    });
//                }
//
//
//                //print if order done
//                if ($("#divR").hasClass('ui-state-disabled') && $("#divP").hasClass('ui-state-disabled')) {
//
//                    localStorage.removeItem("check");
//                    //if (localStorage.getItem("chktemplate") === null) {
//                    $.ajaxSetup({cache: false});
//                    $.get("check.html", function (data) {
//                        localStorage.check = data;
//                        //alert(data);
//                        //printHTML(localStorage.chktemplate, getOrderFromLS(localStorage.activeOrder));
//                        printHTML(data, getOrderFromLS(localStorage.activeOrder));
//                    });
//                    //var idOrder = parseInt($('#ordViewer').attr("idOrder"));
//                }
            },
        }).appendTo(this.element);
    },
    _createTimer: function () {
        this.timer = $('<div id="countdown" style="position:absolute;bottom:0px;left:0px;"></div>')
                .appendTo(this.element)
                .countdown360(
                        {
                            radius: 40, // radius of arc
                            strokeStyle: "orange", // the color of the stroke
                            strokeWidth: undefined, // the stroke width, dynamically calulated if omitted in options
                            fillStyle: "#fff0e6", // the fill color
                            fontColor: "#477050", // the font color
                            fontFamily: "sans-serif", // the font family
                            fontSize: undefined, // the font size, dynamically calulated if omitted in options
                            fontWeight: 700, // the font weight
                            autostart: false, // start the countdown automatically
                            seconds: 0, // the number of seconds to count down
                            label: false, // ["second", "seconds"], // the label to use or false if none, first is singular form, second is plural
                            startOverAfterAdding: true, // Start the timer over after time is added with addSeconds
                            smooth: true, // update the ticks every 16ms when true
                            onComplete: function () {
                                console.log('время вышло')
                            }
                        }
                );

        //console.log(this.timer.startedAt);
    },
    _destroy: function () {
    }
});