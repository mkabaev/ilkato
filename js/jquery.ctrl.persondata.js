$.widget("ctrl.orderEditor", $.ui.dialog, {
    // Default options.
    // Здесь задается список настроек и их значений по умолчанию

    options: {
        param1: "foo",
        param2: "bar",
        param3: null,
        value: 0
    },
    red: function () {
        this.element.css("color", "red");
    },

    open: function () {
        console.log("open");
        // Invoke the parent widget's open().
        return this._super();
    },
//    _create: function () {
//        // Options are already merged and stored in this.options
//        // Plugin logic goes here.
//        this.element.css( "background-color", this.options.color );
//        
//        var progress = this.options.value + "%";
//        this.element
//                .addClass("progressbar")
//                .text(progress);
//        this.options.value = this._constrain(this.options.value);
//        this.refresh();
//    },

    // Этот метод вызывается для изменения настроек плагина   
    _setOption: function (key, value) {
        if (key === "value") {
            value = this._constrain(value);
        }
        this._super(key, value);
//        switch( key ) {
//        case "clear":
//          // предпринимаем действия по изменению свойства clear
//          break;
//      }
//      this._super( "_setOption", key, value );
    },
    _setOptions: function (options) {
        this._super(options);
        this.refresh();
    },
    refresh: function () {
        var progress = this.options.value + "%";
        this.element.text(progress);
    },

    // Create a public method.
    valvalue: function (value) {

        // No value passed, act as a getter.
        if (value === undefined) {
            return this.options.value;
        }

        // Value passed, act as a setter.
        this.options.value = this._constrain(value);
        var progress = this.options.value + "%";
        this.element.text(progress);
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
    // деструктор - метод, который будет вызван при удалении плагина с элемента.
    // Он нужен чтобы очистить элемент от всех модификаций, сделанных плагином
    // (удалить вспомогательные классы, атрибуты и элементы)
    _destroy: function () {
        this.element
                .removeClass("progressbar")
                .text("");
    }
});

$.widget("ctrl.personData", {
    options: {
        value: 10
    },
    map: null,
    _create: function () {
        this.options.value = this._constrain(this.options.value);
        this.element.addClass("ui-widget ui-widget-content persondata");
        var cgClient = $('<div/>').appendTo(this.element);
        cgClient.append('+7<input id="phone" class="prs-phone" placeholder="Телефон">');
        cgClient.append('+7<input id="phone2" class="prs-phone" placeholder="Телефон">');
        cgClient.append('<input id="card" class="prs-card" placeholder="№ карты">');
        cgClient.append('<input id="name"  class="prs-name" placeholder="Имя">');
        cgClient.append('<input type="text" id="info"  class="prs-info" placeholder="Доп. инфориация">');
        
var select = $('<select/>', {
        //id: "o_selstatus",
        name: "address",
//        class: 'ui-widget-header',
    }).appendTo(cgClient).append('<label for="address">Адрес</label>');
    select.append(ArrayToOptionItems(["Владимирская 43, кв.82", "Партизанская 86","новый адрес..."]));
    //or like this: [{id:1,Name:"Принят"},"Готовить","Готовится","Приготовлен"]
    $(select).selectmenu({
        width: 240,
//        position: {
//            my: "left+10 top",
//            at: "left top+20"
//        },
        change: function (event, ui) {
        }
    });
    select.val(2);
    select.selectmenu('refresh', true);
    
    
    
        var divAddress = $('<div/>').appendTo(cgClient);
        divAddress.append('<h3>Владимирская 43</h3>');
        divAddress.append('<div><input class="prs-address" type="text" placeholder="Адрес"><input class="prs-et" placeholder="этаж"></div>');
        divAddress.append('<h3>Ленинская 149</h3>');
        divAddress.append('<div><input class="prs-address" type="text" placeholder="Адрес"><input class="prs-et" placeholder="этаж"></div>');
        divAddress.append('<h3>Новый адрес...</h3>');
        divAddress.append('<div><input class="prs-address" type="text" placeholder="Адрес"><input class="prs-et" placeholder="этаж"></div>');
        //cgAddress.css("height","200px")
        divAddress.accordion({
            heightStyle: "content", //fill",
            //active: 2,
            icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" } //можно и без этого
        });
        
//        cgClient.controlgroup({
//            "direction": "vertical"
//        });

        var mapPanel = $('<div class="panel-map"></div>').appendTo(cgClient);

//this._hoverable( this.element.find( "*" ) );

        //initMap(map[0]);
        var mapbox = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
            maxZoom: 18,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
                    '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
                    'Imagery © <a href="http://mapbox.com">Mapbox</a>',
            id: 'mapbox.streets'
        });
        var osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png');

        map = L.map(mapPanel[0]);
        map.addLayer(osm); //set active base
        map.setView([53.204552, 50.224026], 13);

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
        map.addLayer(activeOrders); //set active

        var doneOrders = L.layerGroup();
        L.marker([53.19442, 50.20537]).bindPopup('Точка 5').addTo(doneOrders);
        L.marker([53.20892, 50.21807]).bindPopup('Точка 6').addTo(doneOrders);

        var overlayMaps = {
            "Кухня - Печерская": marker,
            "Полигон какойто": polygon,
            "Активные заказы": activeOrders,
            "Завернешенные заказы": doneOrders,
        };

        L.control.layers(baseMaps, overlayMaps).addTo(map);

//    L.marker([53.204552, 50.224026]).addTo(map)
//            .bindPopup("<b>Кухня на Печерской</b><br />ilkato").openPopup();

        L.circle([53.204552, 50.224026], 150, {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            //stroke:false
        }).addTo(map);//.bindPopup("I am a circle.");

//    L.polygon([
//        [53.20162, 50.19198],
//        [53.20995, 50.20245],
//        [53.20018, 50.20674]
//    ]).addTo(map).bindPopup("Область");
        map.on('click', this.onMapClick);



        var $address = cgClient.find('.address');
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
//            console.log(suggestion.data);
                //mapUpdate(suggestion.value, 16);
//            mapUpdate(suggestion.data.geo_lat, suggestion.data.geo_lon, 16);
            },
//        onSuggestionsFetch:function (suggestions) {
//            console.log(suggestions);
//        }
        });

        cgClient.find("#phone, #phone2").autocomplete({
            minLength: 5,
//       source: clientsCache,
            source: function (request, response) {
                var term = request.term;
                if (term in clientsCache) {
                    console.log("from cache");
                    response(clientsCache[term]);
                    return;
                }
                $.getJSON("search.php?s=clients", request, function (data, status, xhr) {
                    clientsCache[term] = data;
                    console.log("from server:");
                    console.log(data);
                    response(data);
                });
            },
            focus: function (event, ui) {
                //$(this).val(ui.item.label);
                //console.log(ui.item.id);
                return false;
            },
            select: function (event, ui) {
                $(this).val(ui.item.label);
                console.log("clientSelect");
                //return false;
            },
            change: function (event, ui) {
                //console.log(ui.item);
                // prev sendRequest('getClient', 'idClient=' + ui.item.idClient, function (response) {
                console.log("clientChange");
                sendRequest('getClient', 'id=' + ui.item.id, function (response) {
                    console.log("response");
                    console.log(response);
                    curOrder.Client = response;
                    //console.log(curOrder.Client);
                    updateEditorClient(curOrder.Client);
                    $($address).suggestions().setOptions({hint: "Исправить адрес на:"});
                    //$($address).suggestions().update(); //показывает подсказки и не скрывает пока не выберешь
                    $($address).focus();
                });
                //if (!ui.item) {
                //    console.log('new client');
                //    curOrder.Client.Phones=$(this).val();
                //}
                //$("#name").val(ui.item.idClient);
            },
        })
                .autocomplete("instance")._renderItem = function (ul, item) {
            var nm = "";
            if (item.Name !== "") {
                nm = '<br>' + item.Name;
            }
            var cm = "";
            if (item.Comment !== "") {
                cm = '<br>' + item.Comment;
            }
            return $("<li>")
                    .append('<div style="margin-left:20px;"><img style="position:absolute; left:-18px;" src="images/user16.png">' + item.label + '<i>' + nm + cm + '</i></div>')
                    .appendTo(ul);
        };
        this.refresh();
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
//        switch( key ) {
//        case "clear":
//          // предпринимаем действия по изменению свойства clear
//          break;
//      }

        this._super(key, value);
        //this._super( "_setOption", key, value );
    },
    _setOptions: function (options) {
        this._super(options);
        this.refresh();
    },
    refresh: function () {
        var progress = this.options.value + "%";
        //this.element.text(progress);
        if (this.options.value == 100) {
            this._trigger("complete", null, {value: 100});
        }
    },
    _constrain: function (value) {
        if (value > 100) {
            value = 100;
        }
        if (value < 0) {
            value = 0;
        }
        return value;
    },

    _destroy: function () {
        //map

    },

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