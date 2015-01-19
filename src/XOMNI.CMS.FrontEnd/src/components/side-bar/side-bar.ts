/// <amd-dependency path="text!./side-bar.html" />
import ko = require("knockout");
import jquery = require("jquery");
export var template: string = require("text!./side-bar.html");

export class viewModel {
    public route: any;
    public navigationItems = ko.observableArray([]);

    constructor(params: any) {
        // This viewmodel doesn't do anything except pass through the 'route' parameter to the view.
        // You could remove this viewmodel entirely, and define 'nav-bar' as a template-only component.
        // But in most apps, you'll want some viewmodel logic to determine what navigation options appear.

        this.route = params.route;
        this.fethNavigationData(2);
    }

    public fethNavigationData(userRightId: number) : any {
        jquery.ajax("http://localhost:38314/api/navigation?userRightId=" + userRightId, {
            type: "get",
            contentType: "application/json",
            success: (d, t, s) => {
                this.navigationItems(d);
            },
            error: (r, t, e) => {
                alert(t);
            }
        });
    }
}
