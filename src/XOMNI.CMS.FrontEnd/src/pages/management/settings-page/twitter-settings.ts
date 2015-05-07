/// <amd-dependency path="xomni" />
/// <amd-dependency path="text!./twitter-settings.html" />

import $ = require("jquery");
import ko = require("knockout");
import cms = require("app/infrastructure");

export var template: string = require("text!./twitter-settings.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    public client = new Xomni.Management.Configuration.Settings.SettingsClient();
    public consumerKey = ko.observable<string>();
    public consumerSecretKey = ko.observable<string>();
    public redirectUri = ko.observable<string>();
    public validationErrors = ko.validation.group([this.consumerKey, this.consumerSecretKey, this.redirectUri]);
    public settings = <Models.Management.Configuration.Settings>{};

    constructor() {
        super();
        this.initialize();
    }

    initialize() {
        try {
            this.client.get(this.success, this.error);
            this.initializeValidation();
        }
        catch (exception) {
            this.showCustomErrorDialog(exception.Message);
        }
    }

    initializeValidation() {
        this.consumerKey.extend({
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

        this.consumerSecretKey.extend({
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

        this.redirectUri.extend({
            required: {
                message: "Twitter redirect uri should be filled.",
                onlyIf: () => {
                    if (this.consumerKey() || this.consumerSecretKey()) {
                        return true;
                    }
                    return false;
                }
            }
        });
    }

    save() {
        if (this.validationErrors().length == 0) {
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
            this.validationErrors.showAllMessages();
            this.showCustomErrorDialog("If you have filled at least one field , the other fields should be filled.");
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