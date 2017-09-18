$.widget("ctrl.orderPanel", {
    options: {
        order: null,
        // Callbacks
        change: null,
        random: null
    },
    _create: function () {
        this.element.addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-top op");
        this.pOrderHeader = $('<div/>', {
            class: 'ui-widget-header ui-corner-top header'
        }).appendTo(this.element);

        this.pCircleTime = $('<div/>', {
            class: 'circle'
        }).appendTo(this.element);

        this.pNo = $('<div/>', {
            class: 'no'
        }).appendTo(this.pOrderHeader);

        this.pHInfo = $('<div/>', {
            class: 'time'
        }).appendTo(this.pOrderHeader);

        this.pStatus = $('<span/>', {
            class: 'status'
        }).appendTo(this.pHInfo);

        this.pLogo = $('<div class="logo"></div>').appendTo(this.pOrderHeader);

//        this.pHInfo.append("<br>");
        this.pDTime = $('<span/>', {
            class: 'DTime'
        }).appendTo(this.pHInfo);

        this.pOrderContent = $('<div/>', {
            class: 'content'
        }).appendTo(this.element);

        this.pComment = $('<span/>', {
            class: 'comment'
        }).appendTo(this.pOrderContent);
        this.pOrderContent.append('<hr>');
        this.pAddress = $('<span/>', {
            class: 'address'
        }).appendTo(this.pOrderContent);

        this._refresh();
//        this._createButtons();
//        this._createTimer();
    },
    _setOption: function (key, value) {
        switch (key) {
            case "order":
                this._refresh();
                //console.log(this.options.order);
                //console.log(value);
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
        if (this.options.order !== undefined) {
            this.element.attr("id", this.options.order.id);
            this.pNo.html(this.options.order.No);
            this.pLogo.html('<span class="ico-s-' + this.options.order.idPricingType + '"></span>');

            this.pStatus.text(idStatusToString(this.options.order.idStatus));

            if (this.options.order.DTime) {
                var orderDate = new Date(this.options.order.DDate);
                var today = new Date();
                if (orderDate.withoutTime() < today.withoutTime()) {
//                    this.element.addClass("overdue");
//                    this.element.append('<div class="overdue-text">ПРОСРОЧЕН<br><small>' + orderDate.toLocaleDateString() + '</small></div>');
                }
                this.pDTime.html('<br/>Доставить к <span class="DTime">' + this.options.order.DTime + '</span>');
            } else {
                this.pDTime.html('<br/><p style="color:red"><b>САМОВЫВОЗ</b></p>');
            }

            var cookingTimeR = calcCoockingTime(this.options.order.Products, 1, 1);
            var cookingTimeP = calcCoockingTime(this.options.order.Products, 2, 1);
            var cookingTimeR2 = calcCoockingTime(this.options.order.Products, 1, 2);
            var cookingTimeP2 = calcCoockingTime(this.options.order.Products, 2, 2);

            this.pCircleTime.text(Math.max(cookingTimeR, cookingTimeP) / 60);
            var strAddress = 'адрес не указан';
            if (this.options.order.Address) {
                //strAddress = order.Client.Street + ', ' + order.Client.Building;
                strAddress = this.options.order.idAddress;
            }
            this.pAddress.html(strAddress);

            var comment = "";
            if (this.options.order.Comment) {
                comment = this.options.order.Comment;
            }
            this.pComment.html(comment);
            var log = '';
            $(this.options.order.Log).each(function (index) {
                //log += (new Date(this.ts)).toLocaleTimeString() + ": "+this.idStatus+'\n';
                log += this.ts.substr(11, 5) + ": " + idStatusToString(this.idStatus) + '\n';
            });
            this.element.attr('title', log);
            this.element.addClass('ord-workplace-' + this.options.order.idKitchen);
            this.element.addClass('ord-status-' + this.options.order.idStatus);
//this._trigger("complete25", null, {value: 25});
        }

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
                w.pHeader.append("Старт " + start + " | Стоп " + stop);



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
        var cookingTime = calcCoockingTime(this.options.order.Products, this.options.type, 1);

        this.timer = $('<div id="countdown" style="position:absolute;left:20px;top:10px;"></div>')
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
                            autostart: true, // start the countdown automatically
                            seconds: cookingTime, // the number of seconds to count down
                            label: false, // ["second", "seconds"], // the label to use or false if none, first is singular form, second is plural
                            startOverAfterAdding: true, // Start the timer over after time is added with addSeconds
                            smooth: true, // update the ticks every 16ms when true
                            onComplete: function () {
                                console.log('время вышло')
                            }
                        }
                );
        console.log(this.timer.startedAt);
    },
    _destroy: function () {
    }
});