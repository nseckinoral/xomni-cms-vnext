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

    public settings = <Models.Management.Configuration.Settings>{};

    constructor() {
        super();
        this.initObservableValidations();
        this.initValidation(ko.validation.group([this.consumerKey, this.redirectUri, this.consumerSecretKey]));
        this.initialize();
    }

    initObservableValidations() {
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
            },
            url: {
                message: "Twitter redirect uri has to be valid."
            }
        });
    }

    initialize() {
        this.client.get(this.success, this.error);
    }

    save() {
        this.changeValidationStatus(true);
        if (this.getValidationErrors().length === 0) {
            this.settings.TwitterConsumerKey = this.consumerKey();
            this.settings.TwitterConsumerKeySecret = this.consumerSecretKey();
            this.settings.TwitterRedirectUri = this.redirectUri();
            this.client.put(this.settings, this.success, this.error);
        }
        else {
            this.showCustomErrorDialog("Required fields are missing.");
        }
    }

    success = (result: Models.Management.Configuration.Settings) => {
        this.settings = result;
        this.consumerKey(result.TwitterConsumerKey);
        this.consumerSecretKey(result.TwitterConsumerKeySecret);
        this.redirectUri(result.TwitterRedirectUri);
        this.changeValidationStatus(false);
    }

    error = (error: Models.ExceptionResult) => {
        var errorMessage = this.createErrorMessage(error);
        this.showCustomErrorDialog(errorMessage);
    }
}