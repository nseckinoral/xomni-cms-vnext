/// <amd-dependency path="text!./brand.html" />
import ko = require("knockout");
import jquery = require("jquery");

export var template: string = require("text!./brand.html");

export class viewModel {
    constructor(params: any) {
        jquery.ajaxSettings.headers = {
            "Authorization": "",
            "Accept": ""
        };
    }

    public pagedBrands = ko.observableArray([]);
    public totalCount = ko.observable(0);

    public list(skip: number = 0, take: number = 25): void {
        this.getBrands(skip, take, r => {
            this.pagedBrands(r.Results);
            this.totalCount(r.TotalCount);
        });
    }

    public getBrands(skip: number, take: number, callback: (result: any) => void): any {
        jquery.ajax("http://test.apistaging.xomni.com/private/catalog/brands?skip=" + skip + "&take=" + take, {
            type: "get",
            contentType: "application/json",
            success: (d, t, s) => {
                callback(d);
            },
            error: (r, t, e) => {
                alert(t);
            }
        });
    }
}
