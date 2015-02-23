/// <amd-dependency path="text!./licence-bar.html" />
import ko = require("knockout");
import jquery = require("jquery");
export var template: string = require("text!./licence-bar.html");

export class viewModel {
    public route: any;
    public username = ko.observable("");
    public licenceCap = ko.observable("");

    constructor(params: any) {
        this.username(this.getUsername());
        this.fetchNavigationData();
    }

    public fetchNavigationData(): any {
        var tenantName: string = this.getTenantName();
        jquery.ajax("http://localhost:38314/api/licence?tenantName=" + tenantName, {
            type: "get",
            contentType: "application/json",
            success: (d, t, s) => {
                this.licenceCap(d);
            },
            error: (r, t, e) => {
                this.licenceCap("N/A");
            }
        });
    }

    getTenantName(): string {
        var tenantName = location.hostname.split('.')[0];
        return tenantName;
    }

    getUsername(): any {
        var cookie = this.getCookie(location.hostname.replace('vnext', '') + 'SharedCMSCredentials');
        var credentials: any = $.parseJSON(cookie);
        return credentials.UserName;
    }

    getCookie(cookieName: string): any {
        var name = cookieName + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
        }
        return "";
    }
}
