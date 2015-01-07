define(['knockout', 'text!./brands.html', 'knockout-mapping'], function (ko, templateMarkup, koMapping) {
    ko.dirtyFlag = function (root, isInitiallyDirty) {
        var result = function () { },
            _initialState = ko.observable(ko.toJSON(root)),
            _isInitiallyDirty = ko.observable(isInitiallyDirty);

        result.isDirty = ko.computed(function () {
            return _isInitiallyDirty() || _initialState() !== ko.toJSON(root);
        });

        result.reset = function () {
            _initialState(ko.toJSON(root));
            _isInitiallyDirty(false);
        };

        return result;
    };

    function GenericModel(data) {
        var self = this;
        koMapping.fromJS(data, {}, self);
        self.dirtyFlag = new ko.dirtyFlag(self);
        //self.dirtyFlag.reset();
    }

    function BrandsPage(params) {
        var self = this;
        self.brands = ko.observableArray();
        self.newBrandName = ko.observable();

        $.ajaxSetup({
            headers: {
                "Authorization": "Basic U3RhZ2luZ0FwaVByaXZhdGVUZXN0VXNlcjpTdGFnaW5nQXBpUHJpdmF0ZVRlc3RQYXNz",
                "Accept": "application/vnd.xomni.api-v3_0, */*"
            }
        });

        // initial
        $.ajax("http://test.apistaging.xomni.com/private/catalog/brands?skip=0&take=1000", {
            type: "get",
            contentType: "application/json",
            success: function (result) {
                koMapping.fromJS(result.Results,
                {
                    create: function (item) {
                        return new GenericModel(item.data);
                    }
                },
                self.brands);
            }
        });

        // behaviors
        self.add = function () {
            $.ajax("http://test.apistaging.xomni.com/private/catalog/brand", {
                data: ko.toJSON({ Name: self.newBrandName }),
                type: "post",
                contentType: "application/json",
                success: function (result) {
                    var newBrand = koMapping.fromJS(result,
                    {
                        create: function (item) {
                            return new GenericModel(item.data);
                        }
                    });
                    self.brands.push(newBrand);
                    self.clean();
                }
            });
        }

        self.clean = function () {
            self.newBrandName("");
        }

        self.delete = function (brand) {
            $.ajax("http://test.apistaging.xomni.com/private/catalog/brand/" + brand.Id(), {
                type: "delete",
                contentType: "application/json",
                success: function () { self.brands.remove(brand); }
            });
        }

        self.update = function (brand) {
            $.ajax("http://test.apistaging.xomni.com/private/catalog/brand/" + brand.Id(), {
                data: ko.toJSON(brand),
                type: "put",
                contentType: "application/json",
                success: function (result) {
                    brand.dirtyFlag.reset();
                }
            });
        }
    }

    return { viewModel: BrandsPage, template: templateMarkup };
});
