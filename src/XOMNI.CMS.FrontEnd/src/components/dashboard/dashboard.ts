/// <amd-dependency path="text!./dashboard.html" />
import ko = require("knockout");
export var template: string = require("text!./dashboard.html");

export class viewModel {
    public route: any;
    private managementEnabled = ko.observable(false);
    constructor(params: any) {
        this.managementEnabled(params.managementEnabled);
        this.route = params.route;
    }
}
