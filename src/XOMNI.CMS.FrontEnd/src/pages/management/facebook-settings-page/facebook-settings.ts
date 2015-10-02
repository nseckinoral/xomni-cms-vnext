/// <amd-dependency path="xomni" />
/// <amd-dependency path="text!./facebook-settings.html" />

import $ = require("jquery");
import ko = require("knockout");
import cms = require("app/infrastructure");

export var template: string = require("text!./facebook-settings.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    public client = new Xomni.Management.Configuration.Settings.SettingsClient();
    public displayType = ko.observable<number>();
    public applicationId = ko.observable<string>();
    public applicationSecretKey = ko.observable<string>();
    public redirectUri = ko.observable<string>();
    public displayTypeOptions = ko.observableArray([{ Id: 1, Type: "Page" }, { Id: 2, Type: "Popup" }, { Id: 3, Type: "Touch" }]);
    public settings = <Models.Management.Configuration.Settings>{};

    constructor() {
        super();
        this.initializeValidation();
        this.initValidation(ko.validation.group([this.applicationId, this.applicationSecretKey, this.redirectUri]));
        this.initialize();
    }

    initializeValidation() {
        this.applicationId.extend({
            required: {
                message: "Facebook application id should be filled.",
                onlyIf: () => {
                    if (this.redirectUri() || this.applicationSecretKey()) {
                        return true;
                    }
                    return false;
                }
            }
        });

        this.applicationSecretKey.extend({
            required: {
                message: "Facebook application secret key should be filled.",
                onlyIf: () => {
                    if (this.applicationId() || this.redirectUri()) {
                        return true;
                    }
                    return false;
                }
            }
        });

        this.redirectUri.extend({
            required: {
                onlyIf: () => {
                    if ((this.applicationId() || this.applicationSecretKey())) {
                        return true;
                    }
                    return false;
                },
                message: "Facebook redirect uri should be filled.",
            },
            url: {
                message: 'Facebook redirect uri has to be a valid.',
            }
        });
    }

    initialize() {
        this.client.get(this.success, this.error);
    }
    save() {
        this.changeValidationStatus(true);
        if (this.getValidationErrors().length == 0) {
            this.settings.FacebookApplicationId = this.applicationId();
            this.settings.FacebookApplicationSecretKey = this.applicationSecretKey();
            this.settings.FacebookRedirectUri = this.redirectUri();
            this.settings.FacebookDisplayType = this.displayType();
            this.client.put(this.settings, this.success, this.error);
        }
        else {
            this.showCustomErrorDialog("If you have filled at least one field , the other fields should be filled.");
        }
    }

    success = (result: Models.Management.Configuration.Settings) => {
        this.settings = result;
        this.applicationId(result.FacebookApplicationId);
        this.applicationSecretKey(result.FacebookApplicationSecretKey);
        this.redirectUri(result.FacebookRedirectUri);
        this.displayType(result.FacebookDisplayType);
        this.changeValidationStatus(false);
    }

    error = (error: Models.ExceptionResult) => {
        var errorMessage = this.createErrorMessage(error);
        this.showCustomErrorDialog(errorMessage);
    }
}