﻿/// <amd-dependency path="xomni" />
/// <amd-dependency path="text!./twitter-settings.html" />

import $ = require("jquery");
import ko = require("knockout");
import cms = require("app/infrastructure");

export var template: string = require("text!./twitter-settings.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    public client = new Xomni.Management.Configuration.Settings.SettingsClient();
    public consumerKey = ko.observable<string>().extend({
        required: {
            message: "Twitter consumer key should be filled.",
            onlyIf: () => {
                if (this.redirectUri() || this.consumerSecretKey()) {
                    return true;
                }
                return false;
            }
        }
    });
    public consumerSecretKey = ko.observable<string>().extend({
        required: {
            message: "Twitter consumer secret key should be filled.",
            onlyIf: () => {
                if (this.consumerKey() || this.redirectUri()) {
                    return true;
                }
                return false;
            }
        }
    });

    public redirectUri = ko.observable<string>().extend({
        required: {
            message: "Twitter redirect uri should be filled.",
            onlyIf: () => {
                if (this.consumerKey() || this.consumerSecretKey()) {
                    return true;
                }
                return false;
            }
        },
        url: {
            message: "Twitter redirect uri has to be valid."
        }
    });
    public settings = <Models.Management.Configuration.Settings>{};

    constructor() {
        super();
        this.initialize();
        this.initValidation(ko.validation.group([this.consumerKey, this.consumerSecretKey, this.redirectUri]));
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
        this.validationActive(true);
        if (this.getValidationErrors().length == 0) {
            try {
                this.settings.TwitterConsumerKey = this.consumerKey();
                this.settings.TwitterConsumerKeySecret = this.consumerSecretKey();
                this.settings.TwitterRedirectUri = this.redirectUri();
                this.client.put(this.settings, this.success, this.error);
            }
            catch (exception) {
                this.showCustomErrorDialog(exception.message);
            }
        }
        else {
            this.showCustomErrorDialog("Required fields are missing.");
        }
    }

    success = (result: Models.Management.Configuration.Settings) => {
        try {
            this.settings = result;
            this.consumerKey(result.TwitterConsumerKey);
            this.consumerSecretKey(result.TwitterConsumerKeySecret);
            this.redirectUri(result.TwitterRedirectUri);
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