//$.widget("ctrl.orderEditor", $.ui.dialog, {
//    // Default options.
//    // Здесь задается список настроек и их значений по умолчанию
//
//    options: {
//        param1: "foo",
//        param2: "bar",
//        param3: null,
//        value: 0
//    },
//    red: function () {
//        this.element.css("color", "red");
//    },
//
//    open: function () {
//        console.log("open");
//        // Invoke the parent widget's open().
//        return this._super();
//    },
////    _create: function () {
////        // Options are already merged and stored in this.options
////        // Plugin logic goes here.
////        this.element.css( "background-color", this.options.color );
////        
////        var progress = this.options.value + "%";
////        this.element
////                .addClass("progressbar")
////                .text(progress);
////        this.options.value = this._constrain(this.options.value);
////        this.refresh();
////    },
//
//    // Этот метод вызывается для изменения настроек плагина   
//    _setOption: function (key, value) {
//        if (key === "value") {
//            value = this._constrain(value);
//        }
//        this._super(key, value);
////        switch( key ) {
////        case "clear":
////          // предпринимаем действия по изменению свойства clear
////          break;
////      }
////      this._super( "_setOption", key, value );
//    },
//    _setOptions: function (options) {
//        this._super(options);
//        this.refresh();
//    },
//    refresh: function () {
//        var progress = this.options.value + "%";
//        this.element.text(progress);
//    },
//
//    // Create a public method.
//    valvalue: function (value) {
//
//        // No value passed, act as a getter.
//        if (value === undefined) {
//            return this.options.value;
//        }
//
//        // Value passed, act as a setter.
//        this.options.value = this._constrain(value);
//        var progress = this.options.value + "%";
//        this.element.text(progress);
//    },
//
//    // Create a private method.
//    _constrain: function (value) {
//        if (value > 100) {
//            value = 100;
//        }
//        if (value < 0) {
//            value = 0;
//        }
//        return value;
//    },
//    // деструктор - метод, который будет вызван при удалении плагина с элемента.
//    // Он нужен чтобы очистить элемент от всех модификаций, сделанных плагином
//    // (удалить вспомогательные классы, атрибуты и элементы)
//    _destroy: function () {
//        this.element
//                .removeClass("progressbar")
//                .text("");
//    }
//});

$.widget("ctrl.personData", {
// default options
    options: {
        value: 10,
        id: null,
        Name: null,
        Surname: null,
        Phones: [],
        Addresses: [],
        Card: null,
        Comment: null,
        Org: null,
        // Callbacks
        change: null,
        random: null
    },
    //map: null,
    //adrDlg: null,
    _create: function () {
//        this.options.value = this._constrain(this.options.value);
        this.element.addClass("ui-widget ui-widget-content persondata");
//this._createShowAllButton();

            $('<div/>', {
                class: "mode-search ui-corner-all"
            })
                    .append('<input class="sfield" type="text" placeholder="Выберите клиента">')
                    .appendTo(this.element);
            
            
        this.pHead = $('<div class="head"><img src="images/user24b.png"></div>').appendTo(this.element);
        this._createPhoneControls();
        this.pName = $('<input name="Name" class="prs-name" placeholder="Имя">').appendTo(this.element);
        this.pCard = $('<input name="Card" class="prs-card" placeholder="№ карты">').appendTo(this.element);
        this.pComment = $('<textarea/>', {
            placeholder: "Комментарий",
            class: 'comment',
            //cols:40,
            rows: 2
        }).appendTo(this.element);
        this._createAdrControls();
//        // bind events on elements:
//        var w = this;
//        this._on(w.pPhone, {
//            mouseenter: function () {
//                //console.log("MOUSE");
//                //console.log(this.selectedAddress());
//
////                w.pPhone
////                        .val("asdasd")
////                        .attr("title", "asd" + " didn't match any item")
//                //.tooltip("open");
////                this._delay(function () {
////                    w.pPhone.tooltip("close").attr("title", "");
////                }, 3500);
//                //this.pPhone.autocomplete("instance").term = "";
//            },
//            mouseleave: "_refresh"
//        });

        this._createAdrDialog();
        //this._createMap();
        this._delay(this._createMap, 100);
        this.pHistory = $('<div>', {
            class: "history"
        }).appendTo(this.element);
        this.pBonus = $('<input name="Bonus" class="prs-card" placeholder="Бонусы (авто)">').appendTo(this.pHistory);
        this.bHistory = $('<button>История заказов</button>').appendTo(this.pHistory);
        $(this.bHistory).button();
//        this._on( this.pPhone, {
//          autocompleteselect: function( event, ui ) {
//            ui.item.option.selected = true;
//            this._trigger( "select", event, {
//              item: ui.item.option
//            });
//          },
// 
//          autocompletechange: "_removeIfInvalid"
//        });
//      },

        this._on($(this.pHead), {click: function () {
                this._setMode("search");
            }});
        this._on($(this.pPhone), {change: this._ctrlChange});
        this._on($(this.pPhone2), {change: this._ctrlChange});
        this._on($(this.pName), {change: this._ctrlChange});
        this._on($(this.pAddresses), {change: this._ctrlChange});
        this._on($(this.pCard), {change: this._ctrlChange});
        this._on($(this.pComment), {change: this._ctrlChange});
        this._on($(this.bHistory), {click: function () {
                sendRequest('getOrdersByClient', 'id=' + this.options.id, function (response) {
                    console.log("----------response");
                    console.log(response);
                    if (response.status === 0) {
                    } else {
                        var divDialog = $('<div/>', {
                            //id: 'dlg_' + id,
                            id: id,
                            class: _class,
                            attr: {'title': caption}
                        });
                        //$('body').append(divDialog);
                        //divDialog.attr("user_id", $(this).parent().attr("item_id"));

                        divDialog.dialog({
                            width: 900,
                            height: 600,
                            //width: "auto",
                            autoOpen: false,
                            modal: true,
                            resizable: false,
                            //buttons: [ { text: "Okkkk", click: function() { $( this ).dialog( "close" ); } } ],
//        show: {
//            effect: "blind",
//            duration: 300
//        },
//        hide: {
//            effect: "explode",
//            duration: 300
//        },
                            open: function () {
                                $('.ui-widget-overlay').bind('click', function () {
                                    divDialog.dialog('close');
                                    //divDialog.dialog('destroy');
                                })
                            },
                            close: function () {
                                //This will destroy the dialog and then remove the div that was "hosting" the dialog completely from the DOM
//            $(this).dialog('destroy').remove();
                                $(this).remove();
                            },
                            dialogClass: "noclose"//+_class
                        });
                    }
                });
            }});
//        $(this.pPhone2).on("keydown", function (event) {
//            console.log(event.keyCode);
//            //if ( event.keyCode === $.ui.keyCode.TAB &&
//            //$( this ).autocomplete( "instance" ).menu.active;
//            event.preventDefault();
//        }
//        );
//        this._on($(w.pPhone2), {
//            change: function (event) {
//                console.log("changed");
//                console.log(event.target.value);
//            }
//        });
    },
    _ctrlChange: function (e) {
        switch (event.target.name) {
            case "Phone":
                if (event.target.value.length === 10) {
                    //this._loadClientByPhone(event.target.value);
                    var phone = event.target.value;
                    var w = this;
                    var prs = null;
                    sendRequest('getClientByPhone', 'Phone=' + phone, function (response) {
                        if (response.status === 0) {//create new
                            prs = {
                                id: null,
                                Name: null,
                                Surname: null,
                                Phones: [{Phone: phone, isDefault: 1}],
                                Addresses: [],
                                Card: null,
                                Comment: null,
                                Org: null
                            };
                            w._setOptions(prs);
                            w._saveClient();
                        } else {
                            prs = response;
                        }
                        w._setOptions(prs);
                    });
                } else {
                    if (event.target.value.length === 0) {
                        this._clear();
                        //this._loadClientByPhone(event.target.value);
//                        var phone = null;
//                        var w = this;
//                        var prs = null;
//                        prs = {
//                            id: null,
//                            Name: null,
//                            Surname: null,
//                            Phones: [{Phone: phone, isDefault: 1}],
//                            Addresses: [],
//                            Card: null,
//                            Comment: null,
//                            Org: null
//                        };
//                        w._setOptions(prs);
                    } else
                        alert("wrong phone");
                }
                break;
            case "Addresses"://при смене адреса saveClient не нужен. надо сохранять ордер
                var curAdr = this.selectedAddress();
                G.curOrder.idAddress = curAdr.id;
                //todo
                break;
            default:
                this._setOption(event.target.name, event.target.value);
                console.log("persondata ctrlChange fired. event name: " + event.target.name + " event value: " + event.target.value);
//              var defPhone = {"Phone": null, "isDefault": null};
//        if (Array.isArray(this.options.Phones) && this.options.Phones.length) {
//            defPhone = this.options.Phones.find(function (element, index, array) {
//                return element.isDefault === 1;
//            });
//        }
//        if (this.options.id || defPhone.Phone) {
                this._saveClient();
                //}
                break;
        }










//        if (ui.item) {//if client exists
//            this._loadClient(ui.item.id); //from server
//        } else { //if new client
//            console.log('new client');
//            var defPhone = event.target.value;
//            //this._clear();
//            this._setOptions({
//                id: null,
//                Name: null,
//                Surname: null,
//                Phones: [{"Phone": defPhone, "isDefault": 1}],
//                Addresses: null,
//                Card: null,
//                Comment: null,
//                Org: null,
//            });
//            this._saveClient();
//        }

        e.preventDefault();
    },
    _setOption: function (key, value) {
        if (key === "value") {
            value = this._constrain(value);
            if (value === 25) {
                this._trigger("complete25", null, {value: 25});
                // генерация события collapse
                // _trigger(name, [eventObject], [data]) 
                // С помощью этого метода можно вызывать собственные события плагина. Первый параметр, который необходимо передавать в метод 
                // это тип события (строково значение с его именем). Отметим, что префикс при этом указывать не нужно 
                // (см. описания свойства widgetEventPrefix). Если данное событие вызывается в ответ на выполнение одного 
                // из стандартных событий javascript, то вторым параметром в _trigger, следует передать получаемый объект event.
                // Все остальные данные, которые вы хотели бы передать в обработчик вызываемого с помощью _trigger события, 
                // следует указывать в третьем параметре data.
                //this._trigger("collapse");
            }
        }
        //console.log("setOption for -" + key + "- fired");
        switch (key) {
            case "id":
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
    _setMode: function (mode) {
        if (mode === "search") {
            var w = this;
//            $(w.element).children().hide();
            //$(this.element).css({opacity: .2});
//            $(this.element).children().addClass("ui-state-disabled");
//            $(w.element).addClass("ui-widget-overlay");
            $('<div/>', {
                class: "mode-search ui-corner-all"
            }).bind('click', function () {
                $(this).remove();
                $(w.element).removeClass("ui-widget-overlay");
                $(w.element).children().show();
            })
                    .append('<input class="sfield" type="text" placeholder="Выберите клиента">')
                    .appendTo(this.element);
//            $('<input class="sfield" type="text" placeholder="Выберите клиента">').appendTo(this.element);
        }
    },
    // Called when created, and later when changing options
    _refresh: function () {
//        console.log("refresh fired");
        var w = this;
        //var progress = this.options.value + "%";
        //this.element.text(progress);
        if (this.options.value == 100) {
            this._trigger("complete", null, {value: 100});
        }

        $(this.pName).val(this.options.Name);
        //var defPhone = {Phone: null, isDefault: null};
        //var addPhone = {Phone: null, isDefault: null};
        $.each(this.options.Phones, function (index, value) {
            if (value.isDefault === 1) {
                $(w.pPhone).val(value.Phone);
            } else {
                $(w.pPhone2).val(value.Phone);
            }
        });
//        if (Array.isArray(this.options.Phones) && this.options.Phones.length) {
//            defPhone = this.options.Phones.find(function (element, index, array) {
//                return element.isDefault === 1;
//            });
//            addPhone = this.options.Phones.find(function (element, index, array) {
//                return element.isDefault === 0;
//            });
//        }
//        console.log(addPhone);
        //$(this.pPhone).val(defPhone.Phone);
        //$(this.pPhone2).val(addPhone.Phone);
        //$(this.pPhone).attr("disabled",defPhone.Phone!==null);
        $(this.pCard).val(this.options.Card);
        $(this.pComment).val(this.options.Comment);
        $(this.pAddresses).empty();
        console.log("---------addr");
        console.log(this.options);
        if (this.options.Addresses) {
            var preparedAddrItems = this.options.Addresses.map(function (oldItem) {
                var newItem = {};
//                newItem.id = oldItem.id;
                newItem.Name = oldItem.Address;
                newItem.value = oldItem.id;
                newItem.isDefault = oldItem.isDefault;
                newItem.Floor = oldItem.Floor;
                newItem.Flat = oldItem.Flat;
                return newItem;
            });
            $(this.pAddresses).append(ArrayToOptionItems(preparedAddrItems));
            var defAddr = this.options.Addresses.find(function (element, index, array) {
                return element.isDefault === 1;
            });
//            //TODO set selected addr
            if (defAddr) {
                //alert("try to set addr: "+defAddr.Address);
                this.pAddresses.val(defAddr.Address);
            }

        }
        // Trigger a callback/event
        this._trigger("change", null, this.person());
    },
    _destroy: function () {
        //map
    },
    // Create a public method.
    person: function (value) {
        // No value passed, act as a getter.

        if (value === undefined) {
            var prs = {
                id: this.options.id,
                Name: this.options.Name,
                Surname: this.options.Surname,
                Phones: this.options.Phones, // [{"Phone": 9277777778, "isDefault": 1}, {"Phone": 9626040203}]
                Addresses: this.options.Addresses, //[{"Floor": 6, "Address": "ул Владимирская, д 43, кв 82", "isDefault": 1}]
                Card: this.options.Card,
                Comment: this.options.Comment,
                Org: this.options.Org
            }
            return prs;
        }

// Value passed, act as a setter.
//        this.options.id = value.id;
//        this.options.Name = value.Name;
//        this.options.Surname = value.Surname;
//        this.options.Phones = value.Phones; // [{"Phone": 9277777778, "isDefault": 1}, {"Phone": 9626040203}]
//        this.options.Addresses = value.Addresses; //[{"Floor": 6, "Address": "ул Владимирская, д 43, кв 82", "isDefault": 1}]
//        this.options.Card = value.Card;
//        this.options.Comment = value.Comment;
//        this.options.Org = value.Org;
//        this._refresh();
//OR
        this._setOptions(value);
//this.options.value = this._constrain(value);
//var progress = this.options.value + "%";
//this.element.text(progress);
    },
    selectedAddress: function (value) {
        // No value passed, act as a getter.
        if (value === undefined) {
            //console.log(this.pAddresses.selectedIndex);
            var $selopt = $(this.pAddresses).find("option:selected");
            //console.log($selopt.val());
            return {Floor: $selopt.attr('Floor'), Address: $selopt.text(), isDefault: $selopt.attr('isDefault'), Flat: $selopt.attr('Flat')};
        } else {
            if (value !== null) {
                alert("try addr" + value);
//                $(this.pAddresses).val(value).change(); // if need "change" event fired
                $(this.pAddresses).val(value);
            }
        }
    },
    selectedPhone: function () {
        return $(this.pPhone).val();
    },
    // Create a private method.
    _constrain: function (value) {
        if (value > 100) {
            value = 100;
        }
        if (value < 0) {
            value = 0;
        }
        return value;
    },
    _clear: function () {
        this._setOptions({
            id: null,
            Name: null,
            Surname: null,
            Phones: null,
            Addresses: null,
            Card: null,
            Comment: null,
            Org: null,
        });
    },
    _createPhoneControls: function () {
        this.pPhone = $('<input name="Phone" class="def-phone" placeholder="Телефон">').appendTo(this.pHead);
//----------------autocompl
//        $(this.pPhone).autocomplete({
//            minLength: 5,
//            source: function (request, response) {
//                var term = request.term;
//                if (term in clientsCache) {
//                    console.log("from cache:");
//                    response(clientsCache[term]);
//                    return;
//                }
//                $.getJSON("search.php?s=clients", request, function (data, status, xhr) {
//                    clientsCache[term] = data;
//                    console.log("from server:");
//                    console.log(data);
//                    response(data);
//                });
//            },
//            focus: function (event, ui) {
//                //$(this).val(ui.item.label);
//                //console.log(ui.item.id);
//                return false;
//            },
////            select: function (event, ui) {
////                $(this).val(ui.item.label);
////                console.log("clientSelect");
////                //return false;
////            },
////            change: function (event, ui) {
////            },
//        })
//                .autocomplete("instance")._renderItem = function (ul, item) {
//            var nm = "";
//            if (item.Name !== "") {
//                nm = '<br>' + item.Name;
//            }
//            var cm = "";
//            if (item.Comment !== "") {
//                cm = '<br>' + item.Comment;
//            }
//            return $("<li>")
//                    .append('<div style="margin-left:20px;"><img style="position:absolute; left:-18px;" src="images/user16.png">' + item.label + '<i>' + nm + cm + '</i></div>')
//                    .appendTo(ul);
//        };
//----------------------





        //this.pPhone2 = this.pPhone.clone().appendTo(this.element);
        this.pPhone2 = $('<input name="Phone2" class="phone" placeholder="Телефон">').appendTo(this.element);
        //this.pPhone.tooltip();

//        this._on(this.pPhone, {
////            autocompleteselect: function( event, ui ) {
////                console.log(ui.item);
////                console.log(ui.item.option);
////            //ui.item.option.selected = true;
////            this._trigger( "select", event, {
////              item: ui.item.option
////            });
////        },
//            autocompletechange: function (event, ui) {
////                if (ui.item) {//if client exists
////                    this._loadClient(ui.item.id); //from server
////                } else { //if new client
////                    console.log('new client');
////                    var defPhone = event.target.value;
////                    //this._clear();
////                    this._setOptions({
////                        id: null,
////                        Name: null,
////                        Surname: null,
////                        Phones: [{"Phone": defPhone, "isDefault": 1}],
////                        Addresses: null,
////                        Card: null,
////                        Comment: null,
////                        Org: null,
////                    });
////                    this._saveClient();
////                }
//            }
//        });
    },
    _createAdrDialog: function () {
        this.adrDlg = $('<div title="Адрес"></div>').dialog({
            modal: true,
            autoOpen: false,
            height: 300,
            width: 400,
            buttons: {
                'OK': function () {
                    //var tx = $('input[name="address"]').val();
                    var adr = $('input[name="address"]');
                    console.log(adr.suggestions("suggestion"));
                    $(this).dialog('close');
                },
                'Cancel': function () {
                    $(this).dialog('close');
                }
            }
        });
//        var $address = $(<input type="text" name="tx">);
        var $address = $('<input/>', {
            //type: "text",
            name: "address"
        }).appendTo(this.adrDlg);
        var divFloor = $('<div/>', {class: "ui-widget"}).appendTo(this.adrDlg).append("Этаж:");
        var $floor = $('<input/>', {
            type: "number",
            name: "floor",
            class: "prs-floor"
        }).appendTo(divFloor);
        $address.suggestions({
            serviceUrl: "https://suggestions.dadata.ru/suggestions/api/4_1/rs",
            token: "eab53cb4ce6873e6346bd24d131331c637ca23bf",
            type: "ADDRESS",
            constraints: {
                label: "Самара",
                // ограничиваем поиск Самарой
                locations: {
                    region: "Самарская",
                    city: "Самара"
                },
                // не даем пользователю возможность снять ограничение
                deletable: false
            },
            // в списке подсказок не показываем область и город
            restrict_value: true,
            count: 5, //Максимальное количество подсказок в выпадающем списке. Не может быть больше 20.
            autoSelectFirst: true,
            /* Вызывается, когда пользователь выбирает одну из подсказок */
            onSelect: function (suggestion) {
                //console.log(suggestion.data.house_fias_id);
                console.log(suggestion.data);
                //mapUpdate(suggestion.value, 16);
//            mapUpdate(suggestion.data.geo_lat, suggestion.data.geo_lon, 16);
            },
//        onSuggestionsFetch:function (suggestions) {
//            console.log(suggestions);
//        }
        });
    },
    _createAdrControls: function () {
        var divAdr = $('<div/>', {class: 'ui-widget prs-address'}).appendTo(this.element);
        var w = this;
        this.pAddresses = $('<select/>', {
            //id: "o_selstatus",
            name: "Addresses",
            //size:3,
            //class: 'prs-address',
            change: function () {
                //alert(this.options[this.selectedIndex].text);
                console.log(w.selectedAddress());
                //
//        new L.Control.GeoSearch({
//            provider: new L.GeoSearch.Provider.OpenStreetMap(),
//            position: 'topcenter',
//            showMarker: true
//        }).addTo(map);
//        


// instead of import {} from 'leaflet-geosearch', use the `window` global
                var OpenStreetMapProvider = window.GeoSearch.OpenStreetMapProvider;
                var GoogleMapProvider = window.GeoSearch.GoogleProvider;
                // remaining is the same as in the docs, accept for the var instead of const declarations
                //var provider = new OpenStreetMapProvider();

                var provider = new GoogleMapProvider({params: {
                        key: 'AIzaSyCkIHkx8lFZFjbmqTfFqFANF6OFeRCWSnc',
                    }});
                //добавдение контрола поиска на карту. Для оформления нужно еще добавить файл CSS от GeoSearch
                //var GeoSearchControl = window.GeoSearch.GeoSearchControl;
                //var searchControl = new GeoSearchControl({
                //  provider: provider
                //});
                //w.map.addControl(searchControl);



                var query_promise = provider.search({
                    query: "г.Самара, " + this.options[this.selectedIndex].text
                });
                // It's a promise because we have to wait for the geosearch results. It may be more than one. Be careful.
                // These results have the following properties:
                // const result = {
                //   x: Number,                      // lon,
                //   y: Number,                      // lat,
                //   label: String,                  // formatted address
                //   bounds: [
                //     [Number, Number],             // s, w - lat, lon
                //     [Number, Number],             // n, e - lat, lon
                //   ],
                //   raw: {},                        // raw provider result
                // }

                query_promise.then(value => {
                    for (i = 0; i < value.length; i++) {
                        // Success!
                        var x_coor = value[i].x;
                        var y_coor = value[i].y;
                        var label = value[i].label;
                        console.log(label);
                        console.log(x_coor);
                        console.log(y_coor);
                        var marker = L.marker([y_coor, x_coor]).addTo(w.map); // CAREFULL!!! The first position corresponds to the lat (y) and the second to the lon (x)
                        w.map.setView([y_coor, x_coor], 13);
                        //marker.bindPopup("<b>Found location</b><br>" + label).openPopup(); // note the "openPopup()" method. It only works on the marker
                    }
                    ;
                }, reason => {
                    console.log(reason); // Error!
                });
            }
        }).appendTo(divAdr);
        var bAdrAdd = $('<span class="ui-icon ui-icon-plus"></span>').appendTo(divAdr);
        bAdrAdd.click(function () {
            $(w.adrDlg).dialog("open");
        });
        var bAdrEdit = $('<span class="ui-icon ui-icon-pencil"></span>').appendTo(divAdr);
        bAdrEdit.click(function () {
            $(w.adrDlg).dialog("open");
            console.log(w.pAddresses);
            console.log(w.pAddresses.value);
            $(w.adrDlg).find("input").val($(w.pAddresses).val());
        });
//        $(divAdr).controlgroup({
//            "direction": "horizontal"
//        });
    },
    _createMap: function () {
        var mapPanel = $('<div class="panel-map"></div>').appendTo(this.element);
//this._hoverable( this.element.find( "*" ) );

        //initMap(map[0]);

//var map2 = L.map(document.body).setView([51.505, -0.09], 13);
//L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
//}).addTo(map2);


//L.marker([51.5, -0.09]).addTo(map)
//    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
//    .openPopup();


        var mapbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            //var mapbox = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        });
        var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');
        this.map = L.map(mapPanel[0]);
        this.map.addLayer(osm); //set active base
        this.map.setView([53.204552, 50.224026], 13);
        var baseMaps = {
            "Подложка Mapbox": mapbox,
            "Подложка OpenStreetMap": osm
        };
        var marker = L.marker([53.204552, 50.224026]);
        var polygon = L.polygon([
            [53.20162, 50.19198],
            [53.20995, 50.20245],
            [53.20018, 50.20674]
        ]);
        var activeOrders = L.layerGroup();
        //    var cities = L.layerGroup([littleton, denver, aurora, golden]);
        L.marker([53.2047, 50.2409]).bindPopup('Точка 1').addTo(activeOrders);
        L.marker([53.21272, 50.24314]).bindPopup('Точка 2').addTo(activeOrders);
        L.marker([53.21355, 50.22254]).bindPopup('Точка 3').addTo(activeOrders);
        L.marker([53.22228, 50.21121]).bindPopup('Точка 4').addTo(activeOrders);
        this.map.addLayer(activeOrders); //set active

        var doneOrders = L.layerGroup();
        L.marker([53.19442, 50.20537]).bindPopup('Точка 5').addTo(doneOrders);
        L.marker([53.20892, 50.21807]).bindPopup('Точка 6').addTo(doneOrders);
        var overlayMaps = {
            "Кухня - Печерская": marker,
            "Полигон": polygon,
            "Активные заказы": activeOrders,
            "Завернешенные заказы": doneOrders,
        };
        L.control.layers(baseMaps, overlayMaps).addTo(this.map);
//    L.marker([53.204552, 50.224026]).addTo(map)
//            .bindPopup("<b>Кухня на Печерской</b><br />ilkato").openPopup();

        L.circle([53.204552, 50.224026], 150, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            //stroke:false
        }).addTo(this.map); //.bindPopup("I am a circle.");        



//    L.polygon([
//        [53.20162, 50.19198],
//        [53.20995, 50.20245],
//        [53.20018, 50.20674]
//    ]).addTo(map).bindPopup("Область");
        this.map.on('click', this.onMapClick);
    },
    loadClient: function (id) {
        var w = this;
        sendRequest('getClient', 'id=' + id, function (response) {
            var prs = response;
            if (prs.id === null) {

            } else {
                //w.person(prs);
                //OR
                w._setOptions(prs);
            }
        });
    },
    _loadClientByPhone: function (Phone) {
        var w = this;
        sendRequest('getClientByPhone', 'Phone=' + Phone, function (response) {
            var prs = response;
            w._setOptions(prs);
        });
    },
    _saveClient: function () {
        //var w = this;
        var prs = this.person(); //если id задан, то клиент обновиться. если не задан или равен null, то клиент создастся
//На сервере проверится дефолтный телефонный номер клиента. Если он уже занят другим клиентом, то в ответе вернется ощибка. Вместе с ошибкой вернется объект клиента с указанным телефоном.

//        var client = {
//            id: 9226,
//            Name: 'Ванек',
//            Surname: 'Пупкин',
//            Phones: [{"Phone": 9277777778, "isDefault": 1}, {"Phone": 9626040203}],
//            Addresses: [{"Floor": 6, "Address": "ул Владимирская, д 43, кв 82", "isDefault": 1}],
//            Card: "1234",
//            Comment: "тут коммент",
//            Org: 'ОАО "ТяпЛяпСтрой"'
//        };

        console.log("persondata saveClient fired");
        sendRequest('setClient', 'client=' + JSON.stringify(prs), function (response) {
            var prs = response;
            if (prs.id === null) {
                alert("setClient filed");
            } else {
                //w.person(prs);
                //OR
                //    w._setOptions(prs);
            }
        });
    },
    //
//Создание собственных методов плагина.
//В итоге, созданный метод onMapClick можно будет вызывать внутри других методов плагина так: this.onMapClick(e), а вне плагина: $("#something").plaginName("onMapClick", e).
    onMapClick: function (e) {
        console.log(e.latlng.toString());
        var Courier = {};
        Courier.id = 4;
        Courier.lat = e.latlng.lat;
        Courier.lon = e.latlng.lng;
        $.ajax({
            dataType: 'json',
            type: "POST",
            data: "action=setCourierCoords&courier=" + JSON.stringify(Courier),
            url: "helper.php",
            cache: false,
            timeout: 30000,
            success: function (data) {
                console.log(data);
            },
            error: function (xhr, ajaxOptions, thrownError) {
                alert("status: " + xhr.status + " | " + thrownError);
            }
        });
    }
});