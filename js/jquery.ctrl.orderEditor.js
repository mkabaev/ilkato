$.widget("ctrl.orderEditor", {
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


        this.element.addClass("ui-widget ui-widget-content orderEditor");
//        console.log(this.options.order.Products);

//        if (this.options.type !== null) {
//            this.element.append('<div class="img' + (this.options.type === 1 ? "Roll" : "Pizza") + '"></div>');
//        }
//    var select = $('<select/>', {
//        id: "selstatus",
//        name: "status",
////        class: 'ui-widget-header',
//    }).append('<label for="status">Статус</label>').appendTo(divOrderViewer);
//        this.pHeader = $('<div/>', {
////            id: "orderheader",
//            class: 'ui-widget-header header',
//        }).appendTo(this.element);
//        this.pNumber = $('<div/>', {
//            class: "number",
//        }).appendTo(this.pHeader);


        this._createClientControls();
        this._createMenuTable();
        this._createOrderTable();


        this._createButtons();
//        this._createTimer();

        if (this.options.order !== null) {
            this._refreshPerson();
            this._refreshMenuTable();
            this._refreshOrderTable();
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
        this.pComment.text(this.options.order.Comment);

        //this.t.jsGrid("refresh");
        var w = this;
        this.t.jsGrid("loadData");

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
    _refreshPerson: function () {
        //set options after init
        //cgClient.personData("option", "value", 25);
        this.pPerson.personData("person", this.options.order.Client); //OR cgClient.personData("loadClient", cl.id);
        this.pPerson.personData("selectedAddress", this.options.order.idAddress);

// EXTEND PLUGIN
//    $.ctrl.personData.prototype.reset = function () {
//        this._setOption("value", 0);
//        console.log("reset fired");
//    };
//    cgClient.personData("reset");
    },
    _refreshMenuTable: function () {
        this.tMenu.jsGrid("loadData");
    },
    _refreshOrderTable: function () {
        this.pLogo.html('<span class="ico-' + this.options.order.idPricingType + '"></span>');

        this.tOrder.jsGrid("loadData");

        //var d = new Date();
        //this.pDDate.val(d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2));
        this.pDDate.val(this.options.order.DDate);

        var d = new Date(),
                h = d.getHours(),
                m = d.getMinutes();
        if (h < 10)
            h = '0' + h;
        if (m < 10)
            m = '0' + m;

        this.DTime.val(this.options.order.DTime === null ? h + ':' + m : this.options.order.DTime);

//        this.selStatus.val(this.options.order.idStatus === null ? 0 : this.options.order.idStatus - 1);
//        this.selStatus.selectmenu('refresh', true);

        this.pComment = this.options.order.Comment === null ? "" : this.options.order.Comment;
//    var totalCount = 0;
//    var totalWeight = 0;
//    var totalPrice = 0;
//    var totalBonus = 0;
//    tableItems.forEach(function (itm) {
//        totalCount = totalCount + itm.Count;
//        totalWeight = totalWeight + itm.Count * itm.Weight;
//        totalPrice = totalPrice + itm.Count * itm.Price;
//        totalBonus = totalBonus + itm.Bonus;
//    });
//
//    footerItems = ["Всего", totalCount, "", "", totalPrice, totalBonus];
//
        var coockingTimeR = calcCoockingTime(this.options.order.Products, 1, 1);
        var coockingTimeP = calcCoockingTime(this.options.order.Products, 2, 1);
        var coockingTimeR2 = calcCoockingTime(this.options.order.Products, 1, 2);
        var coockingTimeP2 = calcCoockingTime(this.options.order.Products, 2, 2);
//
        this.pCTime.text("Время приготовления: Пицца(если 1 пицер) " + coockingTimeP / 60 + "мин. Пицца(если 2 пицера) " + coockingTimeP2 / 60 + "| Роллы " + coockingTimeR / 60 + "мин.");
        this.bDone.button({disabled: !this._isFormValid()});
    },
    _createClientControls: function () {
        var w = this;
        this.pPerson = $('<div/>').appendTo(this.element).personData({
            value: 20,
            //Name: "Test Name",
            //Addresses: ["Владимирская 43, кв.82", "Партизанская 86", "новый адрес..."],
            complete25: function (event, data) {
                // alert("Callbacks are great!");
            },
            change: function (event, person) {
                w.options.order.Client = person;
                if (w.options.order.Client.id === null) {
                    $("#bOk").addClass("ui-state-disabled")
                } else {
                    $("#bOk").removeClass("ui-state-disabled")
                }
//            console.log("person");
//            console.log(person);
//            console.log("sel address:");
//            console.log(cgClient.personData("selectedAddress"));
            }
        }).appendTo(this.element);

    },
    _createMenuTable: function () {
        var cgMenu = $('<div/>', {class: 'ui-widget ui-widget-content controlgroup'}).appendTo(this.element);
        cgMenu.css("width", 270);
        this.tMenu = $('<div></div>').appendTo(cgMenu);
        var w = this;
        this.tMenu.jsGrid({
            width: "100%",
            height: "600px",
            filtering: true,

            controller: {
                loadData: function (filter) {
                    var items = G.AllProducts
                            .filter(function (p) {
                                return p.idPricingType === w.options.order.idPricingType;
                            });

                    if (filter.Name !== "")
                        items = items.filter(function (p) {
                            if (p.Name.toLocaleLowerCase().indexOf(filter.Name.toLocaleLowerCase()) >= 0)
                            {
                                return true;
                            }
                        });
                    return items;
                },
            },
            fields: [
                {name: "Name", type: "text", width: 120, title: "Меню",
                    itemTemplate: function (Name, p) {
                        var tags = p.Tags;
                        if (tags !== null) {
                            tags = tags
                                    .filter(function (tag) {
                                        return tag.id === 4 || tag.id === 10 || tag.id === 13 || tag.id === 17; //30cm 40cm
                                    })
                                    .map(function (tag) {
                                        return tag.id;
                                    });
                        }

//                var $photo = $("<div>").addClass("client-photo").append($("<img>").attr("src", p.id));
//                var $info = $("<div>").addClass("client-info")
                        var el = $("<div/>")
                                .append($("<p>").append($("<strong>").text(Name)))
                                .append($("<p>").text("Время приготовления: " + p.CookingTime))
                                .attr({title: '<hr><h5>Тех. карта №</h5>' + p.ProcCard, idP: p.id})
                                .addClass('m-product');
                        tags.forEach(function (itm) {
                            el.addClass('ptag-' + itm);
                        });
                        return el[0].outerHTML;
                    }
                },
                        //{name: "CookingTime", type: "number", title: "Время", sorting: false, width: 40},
            ],
            rowClick: function (args) {
                var o = w.options.order;
                console.log(o);
                if (o.Products === null)
                    o.Products = [];
                var p = o.Products.find(function (itm) {
                    return itm.id === args.item.id;
                });
                if (p !== undefined) {//если такой продукт уже есть в заказе, то увеличиваем его count
                    p.Count = p.Count + 1;
                    var i = o.Products.indexOf(p);
                    o.Products[i] = p;
                } else {//если нет, то добавим 1шт в список заказа
                    var newProduct = args.item;
                    newProduct.Count = 1; //add record
                    o.Products.push(newProduct);
                }
                w._refreshOrderTable();
            }
        });
        this.tMenu.tooltip({content: function () {
                return $(this).prop('title');
            }});
    },
    _createOrderTable: function () {
        this.cgOrder = $('<div/>', {class: 'ui-widget ui-widget-content pnl-order controlgroup'}).appendTo(this.element);
        var w = this;

        this.pLogo = $('<div class="logo"></div>').appendTo(this.cgOrder);

        var d = new Date();
        this.pDDate = $("<input/>", {
            type: "date",
            id: "DDate",
            min: d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2),
            required: true
        });

        this.cgOrder
                .append('<label for="DDate">На какое число заказ:</label>')
                .append(this.pDDate);

        this.DTime = $('<input type="time" name="Time" id="Time" min=10:00 max=23:00 step=900 required>');
        this.pDelivery = $("<div/>", {class: "delivery"})
                .append('<label for="rDelivery">Доставка</label><input type="radio" name="chkD" id="rDelivery" required>')
                .append('<label for="rSelf">Самовывоз</label><input type="radio" name="chkD" id="rSelf">')
                .append('<label for="Time">к: </label>')
                .append(this.DTime)
                .appendTo(this.cgOrder);

        this.pDelivery.children("#rDelivery,#rSelf")
                .checkboxradio({
                    icon: false
                });

//        this.selStatus = $('<select/>', {
//            id: "o_selstatus",
//            name: "status",
//        })
//                .append('<label for="status">Статус</label>')
//                .append(ArrayToOptionItems(["Принят", "Готовить", "Готовится", "Приготовлен", "Доставка", "В пути", "Доставлен", "Отказ"]))
//                .appendTo(this.cgOrder)
//                .selectmenu({
//                    width: 100,
////        position: {
////            my: "left+10 top",
////            at: "left top+20"
////        },
//                    change: function (event, ui) {
//                        w.options.order.idStatus = parseInt($(this).val()) + 1;
//                    }
//                });

        this.tOrder = $('<div/>').appendTo(this.cgOrder);
        this.tOrder.jsGrid({
            width: "100%",
            height: "400px",
            deleteConfirm: "Удалить?",
            editing: true,
//            autoload: true,
            controller: {
                deleteItem: function (p) {
//                    console.log(w.options.order.Products);
//                    var o = w.options.order;
//
//                    if (p !== undefined) {//если такой продукт уже есть в заказе, то увеличиваем его count
//                        p.Count = p.Count + 1;
//                        var i = o.Products.indexOf(p);
//                        o.Products[i] = p;
//                    } else {//если нет, то добавим 1шт в список заказа
//                        var newProduct = args.item;
//                        newProduct.Count = 1; //add record
//                        o.Products.push(newProduct);
//                    }
//                    w._refreshOrderTable();
                },
                loadData: function (filter) {
                    return w.options.order.Products;
                },
            },
            onRefreshed: function (args) {
                var items = args.grid.option("data");
                //var items=w.options.order.Products;
                if (items.length) {
                    var total = items[1];
                    total.Name = "Всего";
                    total.Count = 0;
                    total.Tags = [];
                    total.Weight = 0;
                    total.Price = 0;
                    total.isTotal = true;

                    items.forEach(function (item) {
                        total.Count += item.Count;
                        total.Weight += item.Weight;
                        total.Price += item.Price;
                    });

                    var $totalRow = $("<tr>").addClass("total-row");
//
                    args.grid._renderCells($totalRow, total);
                    args.grid._content.append($totalRow);
                }
            },
            fields: [
//                {name: "isCooked", type: "checkbox", title: "", width: 20},
//                {name: "ProcCardNo", title: "№", type: "number", width: 20},
                {name: "Name", type: "text", width: 120, title: "Продукт", editing: false,
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
                        var s="";
                        p.RelatedProducts.forEach(function (itm) {
                            s+='<br>' + itm.Name;
                        });

                        
                        el.attr("title", '<h5>Рекомендованные продукты</h5>'+s+'<hr><h5>Тех. карта №</h5>' + p.ProcCard)

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
                {name: "Count", type: "number", title: "Кол-во", sorting: false, width: 40},
                {name: "Weight", type: "number", title: "Вес", sorting: false, width: 40, editing: false, },
                {name: "Price", type: "number", title: "Цена", sorting: false, width: 40, editing: false, },
                {name: "Discount", type: "number", title: "Скидка", sorting: false, width: 40},
                {name: "TotalPrice", type: "number", title: "Итого", sorting: false, width: 40, editing: false, },
                {name: "Bonus", type: "number", title: "Бонусы", sorting: false, width: 40, editing: false, },
                {
                    type: "control",
                    modeSwitchButton: false,
                    editButton: false,
                    width: 20,
                    deleteButtonTooltip: "",

                    itemTemplate: function (_, item) {
                        if (item.isTotal)
                            return "";
                        return jsGrid.fields.control.prototype.itemTemplate.apply(this, arguments);
                    }
                }
            ]
        });
        this.tOrder.tooltip({content: function () {
                return $(this).prop('title');
            }});

        //this.pComment = $('<input type="text" name="Comment" id="Comment" placeholder="Комментарий" >');
        this.pComment = $('<textarea/>', {
            placeholder: "Комментарий",
            class: 'comment',
            //cols:40,
            rows: 2
        });

        this.pPCount = $('<input id="pPCount" class="ui-spinner-input pcount">');
        this.cgOrder
                .append('<br>')
                .append(this.pComment)
                .append('<label for="pPCount" class="ui-controlgroup-label">Кол-во персон</label>')
                .append(this.pPCount)
                .append('<br><button>Назначить скидку [%,руб,бонусы]</button>');

        this.bCancelOrder = $('<button/>', {
            //id: "bDone" + modType,
            class: 'cancelOrderButton',
            text: "Отменить заказ",
            class: "ui-state-error",
            icons: {
                primary: "ui-icon-closethick",
                //secondary: "ui-icon-triangle-1-s"
            },
            click: function (event) {
                if (confirm("ОТМЕНИТЬ ЗАКАЗ?")) {
                    alert("foo");
                }
                //w._setOrder();
//                console.log(w.options.order.Products);
            }
        }).appendTo(this.cgOrder);

        this.bDone = $('<button/>', {
            //id: "bDone" + modType,
            class: 'doneButton',
            text: "Готово",
            icons: {
                primary: "ui-icon-check",
                //secondary: "ui-icon-triangle-1-s"
            },
            click: function (event) {
                w._setOrder();
//                console.log(w.options.order.Products);
            }
        }).appendTo(this.cgOrder);

        this.pCTime = $('<div/>', {
            class: 'ctime',
            //text: "asdasdasd",
//            click: function (event) {
//                alert(10);
//            }
        }).appendTo(this.cgOrder);

        this.cgOrder.controlgroup({
//        "direction": "vertical"
        });

//        this._on($(this.pDDate), {change: function () {
//                $(this.bDone).button({disabled: !this._isFormValid()})
//            }});
        this._on($(this.DTime), {change: function () {
                $(this.bDone).button({disabled: !this._isFormValid()})
            }});
        this._on($(this.pDelivery), {change: function () {
                $(this.bDone).button({disabled: !this._isFormValid()})
            }});
    },
    _createButtons: function () {
        var w = this;
    },
    _createTimer: function () {
    },
    _isFormValid: function () {
        return (//this.pDDate[0].checkValidity() &&
                this.DTime[0].checkValidity() &&
                this.pDelivery.children("input")[0].checkValidity());

    },
    _setOrder: function () {
        this.options.order.idBranch = 1;
        //this.options.order.idPricingType = 1;
        this.options.order.idStatus = 1;
        this.options.order.idKitchen = 5;
        this.options.order.idBatch = null;
        this.options.order.idCreatedBy = 1;
        this.options.order.Price = null;
        this.options.order.Comment = $(this.pComment).val();
        this.options.order.QueueNo = null;
        //this.options.order.CDate= "17-02-03", // "yy-mm-dd" дата создания заказа. Если не передавать, то сервер установит текущую
        //this.options.order.CTime= "15:00", //соответственно, время создания
        this.options.order.DDate = $(this.pDDate).val() === "" ? null : $(this.pDDate).val();//"17-02-03"; // К какому числу клиент хочет заказ
        //this.options.order.DTime = this.pDTime.val() === "" ? null : this.pDTime.val();//"15:00"; // Соотв
        var curAdr = this.pPerson.personData("selectedAddress");
        this.options.order.idAddress = curAdr.idAddress;
        this.options.order.Phone = this.pPerson.personData("selectedPhone");

        var smallOrder = prepareDataToCreateOrderOnServer(this.options.order);
        console.log('prepared order:');
        console.log(smallOrder);

        sendRequest("setOrder", "order=" + JSON.stringify(smallOrder), function (data) {
            //console.log(data);
        });
        $(this.element).parent().dialog('close');
    },
    _destroy: function () {
    }
});