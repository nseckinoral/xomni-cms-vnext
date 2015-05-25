/// <amd-dependency path="xomni" />
/// <amd-dependency path="text!./integration-endpoint.html" />

import $ = require("jquery");
import ko = require("knockout");
import cms = require("app/infrastructure");
import dialog = require("models/dialog-content");

export var template: string = require("text!./integration-endpoint.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    public client = new Xomni.Management.Integration.Endpoint.EndpointClient();
    public isEnabled = ko.observable(false);
    public isVisible = ko.observable(false);
    public showErrors = ko.observable(false);
    public adminMail = ko.observable<string>().extend({
        required: {
            onlyIf: () => {
                return this.showErrors();
            },
            message: "Admin mail is required.",
        },
        email: true
    });
    public serviceName = ko.observable<string>().extend({
        required: {
            onlyIf: () => {
                return this.showErrors();
            },
            message: "Service name is required."
        }
    });
    public serviceTier = ko.observable<number>().extend({ required: true });
    public managementPortalUrl = ko.observable<string>();
    public endpointCreateStatus = ko.observable<string>();
    public serviceTierOptions = ko.observableArray([{ Id: 1, Description: "Developer" }, { Id: 2, Description: "Standart" }, { Id: 3, Description: "Premium" }]);
    public validationErrors = ko.validation.group([this.adminMail, this.serviceName, this.serviceTier]);

    constructor() {
        super();
        this.initalize();
    }

    initalize() {
        this.client.get(
            (t) => {
                this.managementPortalUrl(t.ManagementPortalUrl);
                this.serviceName(t.ServiceName);
                this.endpointCreateStatus(IntegrationEndpointStatusType[t.Status]);
                this.isEnabled(true);
                this.isVisible(true);
            },
            (e) => {
                if (e.HttpStatusCode == 404) {
                    this.isEnabled(false);
                }
                else {
                    cms.infrastructure.showLoading(false);
                    this.showErrorDialog();
                }
                this.isVisible(true);
            }
            );
    }

    createEndpoint() {
        this.showErrors(true);
        if (this.validationErrors().length == 0) {
            this.client.post({
                AdminMail: this.adminMail(),
                ServiceName: this.serviceName(),
                ServiceTier: this.serviceTier()
            },
                () => {
                    this.initalize();
                },
                (e) => {
                    this.showErrorDialog();
                }
                );
        }
        else {
            this.validationErrors.showAllMessages();
        }
    }

    deleteEndpoint() {
        var content = <dialog.DialogContent>{
            Body: "Are you sure you want to delete integration endpoint?",
            Title: "Warning",
            Type: dialog.ContentType.Warning,
            Click: (context) => {
                context.client.delete(
                    () => {
                        context.initalize();
                    },
                    (e) => {
                        context.showErrorDialog(e);
                    }
                    );

            },
            DataContext: this
        };
        this.showDialog(content);
    }
}

export enum IntegrationEndpointStatusType {
    InProgress = 1,
    Enabled = 2,
    Failed = 3,
}