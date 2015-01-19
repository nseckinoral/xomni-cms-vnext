define(["require", "exports", "knockout", "text!./nav-bar.html"], function(require, exports, ko) {
    exports.template = require("text!./nav-bar.html");

    var viewModel = (function () {
        function viewModel(params) {
            this.managementEnabled = ko.observable(false);
            this.managementEnabled(params.managementEnabled);
            this.route = params.route;
        }
        return viewModel;
    })();
    exports.viewModel = viewModel;
});
//# sourceMappingURL=nav-bar.js.map
