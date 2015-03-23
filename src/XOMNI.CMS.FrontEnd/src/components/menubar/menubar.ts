/// <amd-dependency path="text!./menubar.html" />
import ko = require("knockout");
import cms = require("app/infrastructure");
export var template: string = require("text!./menubar.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    private shouter: any;
    public route: any;
    private managementEnabled = ko.observable(false);
    private oldCMSUrl = this.getOldCMSUrl();
    private managementLink = ko.observable(this.oldCMSUrl + '/Stores/List.aspx');
    private catalogLink = ko.observable(this.oldCMSUrl + '/Brands/List.aspx');
    private dashboardLink = ko.observable(this.oldCMSUrl + '/Dashboard.aspx');

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
