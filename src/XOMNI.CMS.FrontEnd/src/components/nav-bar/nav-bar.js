var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
define(["require", "exports", "knockout", "app/infrastructure", "text!./nav-bar.html"], function(require, exports, ko, cms) {
    exports.template = require("text!./nav-bar.html");

    var viewModel = (function (_super) {
        __extends(viewModel, _super);
        function viewModel(params) {
            _super.call(this);
            this.managementEnabled = ko.observable(false);
            this.oldCMSUrl = this.getOldCMSUrl();
            this.managementLink = ko.observable(this.oldCMSUrl + '/Stores/List.aspx');
            this.catalogLink = ko.observable(this.oldCMSUrl + '/Brands/List.aspx');
            this.dashboardLink = ko.observable(this.oldCMSUrl + '/Dashboard.aspx');
            this.route = params.route;
            this.shouter = params.shouter;
            this.managementEnabled(this.userIsInRole(1 /* ManagementAPI */));
        }
        return viewModel;
    })(cms.infrastructure.baseViewModel);
    exports.viewModel = viewModel;
});
//# sourceMappingURL=nav-bar.js.map
