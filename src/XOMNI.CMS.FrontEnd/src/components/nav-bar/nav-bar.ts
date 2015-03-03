/// <amd-dependency path="text!./nav-bar.html" />
import ko = require("knockout");
import cms = require("app/infrastructure");
export var template: string = require("text!./nav-bar.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    private shouter: any;
    public route: any;
    private managementEnabled = ko.observable(false);
    constructor(params: any) {
        super();
        this.route = params.route;
        this.shouter = params.shouter;
        this.managementEnabled(this.userIsInRole(cms.infrastructure.Roles.ManagementAPI));
    }

    //Uncomment this method when menu group based nav bar loading needed.
    //changeMenuGroup(menuGroupId: number) {
    //    this.shouter.notifySubscribers(menuGroupId, "MenuGroupId");
    //}
}
