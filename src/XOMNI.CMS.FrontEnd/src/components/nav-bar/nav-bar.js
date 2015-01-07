define(['knockout', 'text!./nav-bar.html', 'knockout-mapping', 'app/router'], function (ko, template, koMapping, router) {

    function navBarItem(data) {
        var self = this;
        koMapping.fromJS(data, {}, self);
        self.link = ko.computed(function () {
            return "#" + self.url().toLowerCase();
        }, self);
        self.selected = ko.computed(function () {
            return router.currentRoute().page === self.params.page();
        }, self);
    }

    function NavBarViewModel(params) {
        var self = this;
        self.navBarItems = koMapping.fromJS([]);
        koMapping.fromJS(router.routes,
        {
            create: function (item) {
                return new navBarItem(item.data);
            }
        },
        self.navBarItems);
    }

    return { viewModel: NavBarViewModel, template: template };
});
