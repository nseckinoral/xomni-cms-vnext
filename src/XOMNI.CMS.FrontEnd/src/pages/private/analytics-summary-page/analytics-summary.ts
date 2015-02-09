/// <amd-dependency path="text!./analytics-summary.html" />
import $ = require("jquery");
import ko = require("knockout");

export var template: string = require("text!./analytics-summary.html");
export class viewModel {
    constructor(params: any) {

    }

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
