/// <amd-dependency path="xomni" />
/// <amd-dependency path="text!./trending-action-settings.html" />
/// <amd-dependency path="jqueryui" />
/// <amd-dependency path="bootstrap-touchspin" />

import $ = require("jquery");
import ko = require("knockout");
import cms = require("app/infrastructure");
export var template: string = require("text!./trending-action-settings.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    public client = new Xomni.Management.Configuration.TrendingActionTypes.TrendingActionTypesClient();
    public socialLike = ko.observable<number>();
    public socialShare = ko.observable<number>();
    public shoppingCartItemInsert = ko.observable<number>();
    public wishlistItemInsert = ko.observable<number>();
    public itemView = ko.observable<number>();
    public trendingActionTypeValues = new Array<Models.Management.Configuration.TrendingActionTypeValue>();
    constructor() {
        super();
        this.initializeValidation();
        this.initValidation(ko.validation.group([this.socialLike, this.socialShare, this.shoppingCartItemInsert, this.wishlistItemInsert, this.itemView]));
        this.initialize();
    }

    initialize() {
        try {
            this.client.get(this.success, this.error);
        }
        catch (exception) {
            this.showCustomErrorDialog(exception.Message);
        }
    }

    save() {
        this.validationActive(true)
        if (this.getValidationErrors().length == 0) {
            try {
                this.trendingActionTypeValues.filter(function (item) { return item.Description == "Social Like"; })[0].ImpactValue = this.socialLike();
                this.trendingActionTypeValues.filter(function (item) { return item.Description == "Social Share"; })[0].ImpactValue = this.socialShare();
                this.trendingActionTypeValues.filter(function (item) { return item.Description == "Shopping Cart ItemI Insert"; })[0].ImpactValue = this.shoppingCartItemInsert();
                this.trendingActionTypeValues.filter(function (item) { return item.Description == "Wishlist Item Insert"; })[0].ImpactValue = this.wishlistItemInsert();
                this.trendingActionTypeValues.filter(function (item) { return item.Description == "Item View"; })[0].ImpactValue = this.itemView();
                this.client.put(this.trendingActionTypeValues, this.success, this.error);
            }
            catch (exception) {
                this.showCustomErrorDialog(exception.message);
            }
        }
        else {
            this.showCustomErrorDialog("Please fill out all required fields and try again.");
        }
    }

    initializeValidation() {
        this.socialLike.extend({
            required: {
                message: "Social Like field should be filled."
            },
            numeric: 2
        });

        this.socialShare.extend({
            required: {
                message: "Social Share field should be filled."
            },
            numeric: 2
        });

        this.shoppingCartItemInsert.extend({
            required: {
                message: "Shopping Cart Item Insert field should be filled."
            },
            numeric: 2,

        });

        this.wishlistItemInsert.extend({
            required: {
                message: "Wishlist Item Insert field should be filled."
            },
            numeric: 2
        });

        this.itemView.extend({
            required: {
                message: "Item View field should be filled."
            },
            numeric: 2
        });
    }
    success = (result: Models.Management.Configuration.TrendingActionTypeValue[]) => {
        try {
            this.trendingActionTypeValues = result;
            this.socialLike(result.filter(function (item) { return item.Description == "Social Like"; })[0].ImpactValue);
            this.socialShare(result.filter(function (item) { return item.Description == "Social Share"; })[0].ImpactValue);
            this.shoppingCartItemInsert(result.filter(function (item) { return item.Description == "Shopping Cart ItemI Insert"; })[0].ImpactValue);
            this.wishlistItemInsert(result.filter(function (item) { return item.Description == "Wishlist Item Insert"; })[0].ImpactValue);
            this.itemView(result.filter(function (item) { return item.Description == "Item View"; })[0].ImpactValue);
            this.validationActive(false);
        }
        catch (exception) {
            this.showCustomErrorDialog(exception.message);
        }
    }

    error = (error: Models.ExceptionResult) => {
        var errorMessage = this.createErrorMessage(error);
        this.showCustomErrorDialog(errorMessage);
    }

}

