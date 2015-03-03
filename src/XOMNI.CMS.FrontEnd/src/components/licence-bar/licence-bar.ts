/// <amd-dependency path="text!./licence-bar.html" />
import ko = require("knockout");
import jquery = require("jquery");
import cms = require("app/infrastructure");
export var template: string = require("text!./licence-bar.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    public route: any;
    public username = ko.observable("");
    public licenceCap = ko.observable("");

    constructor(params: any) {
        super();
        this.username(this.getAuthenticatedUserInfo().UserName);
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
}
