/// <amd-dependency path="text!./validation-summary.html" />
import ko = require("knockout");
export var template: string = require("text!./validation-summary.html");

export class viewModel {
    public errors = ko.observable<KnockoutValidationErrors>();
    constructor(params: any) {
        this.errors = params.errors;
    }
}