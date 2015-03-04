/// <amd-dependency path="text!./dashboard.html" />

import ko = require("knockout");
import cms = require("app/infrastructure");

export var template: string = require("text!./dashboard.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    public route: any;
    private managementEnabled = ko.observable(false);
    constructor(params: any) {
        super();
        this.managementEnabled(this.userIsInRole(cms.infrastructure.Roles.ManagementAPI));
        this.route = params.route;
    }
}