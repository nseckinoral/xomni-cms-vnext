/// <amd-dependency path="xomni" />
/// <amd-dependency path="text!./msg-integration.html" />

import $ = require("jquery");
import ko = require("knockout");
import cms = require("app/infrastructure");

export var template: string = require("text!./msg-integration.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    public client = new Xomni.Management.Integration.MSG.MSGClient();
    public isEnabled = ko.observable(false);
    public isVisible = ko.observable(false);
    public showErrors = ko.observable(false);
    public email = ko.observable<string>().extend({
        required: {
            onlyIf: () => {
                return this.showErrors();
            },
            message: "Email is required."
        }, email: true
    });
    public firstName = ko.observable<string>().extend({
        required: {
            onlyIf: () => {
                return this.showErrors();
            },
            message: "FirstName is required."
        }
    });
    public lastName = ko.observable<string>().extend({
        required: {
            onlyIf: () => {
                return this.showErrors();
            },
            message: "LastName is required."
        }
    });
    public ssoUrl = ko.observable<string>();
    public password = ko.observable<string>();
    public subscriptionKey = ko.observable<string>();
    public endpoints = ko.observable([]);
    public pageInfo = ko.observable();

    constructor() {
        super();
        this.initalize();
        this.initValidation(ko.validation.group([this.email, this.firstName, this.lastName]));
    }

    initalize() {
        this.loadPageInfo();
        this.client.get(
            (t) => {
                this.email(t.Email);
                this.ssoUrl(t.SsoUrl);
                this.isEnabled(true);
                this.isVisible(true);
                this.endpoints(t.Endpoints);
                this.subscriptionKey(t.SubscriptionKey);
            },
            (e) => {
                if (e.HttpStatusCode == 404) {
                    this.isEnabled(false);
                }
                else {
                    this.showErrorDialog();
                }
                this.isVisible(true);
            }
            );
    }

    enableIntegration() {
        this.showErrors(true);
        this.validationActive(true);
        if (this.getValidationErrors().length == 0) {
            this.client.post({
                Email: this.email(),
                FirstName: this.firstName(),
                LastName: this.lastName()
            },
                (t) => {
                    this.password(t.Password);
                    this.email(t.Email);
                    this.ssoUrl(t.SsoUrl);
                    this.isEnabled(true);
                    this.endpoints(t.Endpoints);
                    this.subscriptionKey(t.SubscriptionKey);
                },
                (e) => {
                    if (e.HttpStatusCode == 400) {
                        this.showCustomErrorDialog("Please enable integration endpoint first.");
                    }
                    else {
                        this.showErrorDialog(e);
                    }
                }
                );
        }
    }

    disableIntegration() {
        this.clearInputFields();
        this.client.delete(
            () => {
                this.initalize();
            },
            (e) => {
                this.showErrorDialog(e);
            }
            );
    }

    clearInputFields() {
        this.email("");
        this.firstName("");
        this.lastName("");
        this.showErrors(false);
    }

    loadPageInfo() {
        $.ajax("msg-info.json", {
            async: true,
            success: (t, d) => {
                this.pageInfo(t);
            }
        });
    }
}
