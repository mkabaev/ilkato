function createAdmInterface() {
    var pnlProducts = $('<div/>', {
        //id: 'o_ordersPanel',
        //class: 'connectedSortable',
        //attr: {'title': 'caption'}
    });
    pnlProducts.appendTo($('#workplace'));

    var clients = [
        {"Name": "Otto Clay", "Age": 25, "Country": 1, "Address": "Ap #897-1459 Quam Avenue", "Married": false},
        {"Name": "Connor Johnston", "Age": 45, "Country": 2, "Address": "Ap #370-4647 Dis Av.", "Married": true},
        {"Name": "Lacey Hess", "Age": 29, "Country": 3, "Address": "Ap #365-8835 Integer St.", "Married": false},
        {"Name": "Timothy Henson", "Age": 56, "Country": 1, "Address": "911-5143 Luctus Ave", "Married": true},
        {"Name": "Ramona Benton", "Age": 32, "Country": 3, "Address": "Ap #614-689 Vehicula Street", "Married": false}
    ];

    var countries = [
        {Name: "", Id: 0},
        {Name: "United States", Id: 1},
        {Name: "Canada", Id: 2},
        {Name: "United Kingdom", Id: 3}
    ];

    var ap = [
        {
            "id": 64,
            "Name": "+ Сырный соус 50 гр",
            "Tags": [
                {
                    "id": 2,
                    "Name": "Италия",
                    "idParent": 0
                },
                {
                    "id": 13,
                    "Name": "Соус",
                    "idParent": 2
                }
            ],
            "Price": 50,
            "Weight": 25,
            "idType": 2,
            "Comment": "",
            "idGroup": 1025,
            "idBranch": 1,
            "isActive": 1,
            "idPicture": 0,
            "CookingTime": 10,
            "idPricingType": 1
        }
    ];
    pnlProducts.jsGrid({
        width: "100%",
        height: "700px",
        deleteConfirm: "Удалить?",
        inserting: true,
        editing: true,
        sorting: true,
        //paging: true,

       controller: {
//                loadData: $.noop,
        //insertItem: $.noop,
        //updateItem: $.noop,
        //deleteItem: $.noop
        loadData: function(filter) {
        return $.ajax({
            dataType: 'json',
            type: "POST",
            url: "helper.php",
            data: "action=getProducts" //filter
        });
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

//        data: AllProducts,
        fields: [
            {name: "Name", type: "text"},
            {name: "Comment", type: "textarea", width: 150},
            {name: "Rating", type: "number", width: 50, align: "center",
                //itemTemplate: function (value) {
                //    return $("<div>").addClass("rating").append(Array(value + 1).join("&#9733;"));
                //}
            },
            {name: "Price", type: "number", width: 50,
                //itemTemplate: function (value) {
                //    return value.toFixed(2) + "$";
                //}
            },
            {name: "isActive", type: "checkbox", title: "Активен", sorting: false},
            {name: "Weight", type: "number", title: "Вес", sorting: false},
            {name: "CookingTime", type: "number", title: "Время приготовления", sorting: false},
            {name: "Tags", type: "text",
                itemTemplate: function (value) {
                    var s = "";
                    value.forEach(function (tag, index, array) {
                        s = s + ", " + tag.Name;
                    });
                    return s;
                }
            },
            {type: "control"}
        ]
//    fields: [
//        {name: "Name", type: "text", width: 150, validate: "required"},
//        {name: "Age", type: "number", width: 50},
//        {name: "Address", type: "text", width: 200},
//        {name: "Country", type: "select", items: countries, valueField: "Id", textField: "Name"},
//        {name: "Married", type: "checkbox", title: "Is Married", sorting: false},
//        {type: "control"}
//    ]
    });
}