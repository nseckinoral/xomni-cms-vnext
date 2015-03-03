/// <amd-dependency path="text!./nav-bar.html" />
import ko = require("knockout");
export var template: string = require("text!./nav-bar.html");

export class viewModel {
    private shouter: any;
    public route: any;
    private managementEnabled = ko.observable(false);
    constructor(params: any) {
        this.route = params.route;
        this.shouter = params.shouter;
        if (this.getUserRightId() === 3) {
            this.managementEnabled(true);
        }
    }

    changeMenuGroup(menuGroupId: number) {
        this.shouter.notifySubscribers(menuGroupId, "MenuGroupId");
    }

    getUserRightId(): number {
        var cookie = document.cookie.split(';')[0].split('=')[1];
        var credentials: any = $.parseJSON(cookie);
        var roles: string[] = credentials.Roles;
        var userRightId: number;
        if (roles.indexOf('ManagementAPI') != -1) {
            userRightId = 3;
        }
        else if (roles.indexOf('PrivateAPI') != -1) {
            userRightId = 2;
        }

        return userRightId;
    }
}
