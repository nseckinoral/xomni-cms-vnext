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
    public serviceTierOptions = ko.observableArray([{ Id: 1, Description: "Developer" }, { Id: 2, Description: "Standart" }, { Id: 3, Description: "Premium" }]);
    public endpointCreateStatus = ko.observable<Models.Management.Integration.EndpointStatusType>();
    public isInProgress = ko.computed<boolean>(() => this.endpointCreateStatus() === Models.Management.Integration.EndpointStatusType.InProgress);
    public isFailed = ko.computed<boolean>(() => this.endpointCreateStatus() === Models.Management.Integration.EndpointStatusType.Failed);
    public isSucceeded = ko.computed<boolean>(() => this.endpointCreateStatus() === Models.Management.Integration.EndpointStatusType.Succeeded);
    public lastFailedServiceName = ko.observable<string>();
    public lastFailedCreationDate = ko.observable<string>();

    intervalId: number;
    constructor() {
        super();
        this.initalize();
        this.initValidation(ko.validation.group([this.adminMail, this.serviceName, this.serviceTier]));
    }

    initalize() {
        this.changeValidationStatus(false);
        this.client.get(
            (t) => {
                this.isEnabled(true);
                this.managementPortalUrl(t.ManagementPortalUrl);
                this.serviceName(t.ServiceName);
                this.endpointCreateStatus(t.Status);
                if (t.Status === Models.Management.Integration.EndpointStatusType.InProgress) {
                    if (this.intervalId === undefined) {
                        this.intervalId = setInterval(() => this.initalize(), 10000);
                    }
                }
                else {
                    if (this.intervalId != undefined) {
                        clearInterval(this.intervalId);
                    }
                    if (t.Status === Models.Management.Integration.EndpointStatusType.Failed) {
                        this.lastFailedServiceName(t.ServiceName);
                        this.lastFailedCreationDate(t.CreationDate.getDate().toLocaleString());
                        this.clearInputFields();
                        this.isEnabled(false);
                    }
                }
            },
            (e) => {
                if (e.HttpStatusCode == 404) {
                    this.isEnabled(false);
                }
                else {
                    cms.infrastructure.showLoading(false);
                    this.showErrorDialog();
                }
            }
            );
    }

    createEndpoint() {
        this.showErrors(true);
        this.changeValidationStatus(true);
        if (this.getValidationErrors().length == 0) {
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
    }

    deleteEndpoint() {
        var content = <dialog.DialogContent>{
            Body: '<div class="alert alert-warning">Deleting your integration endpoint will delete all related configuration and disable all third party data access integration as well.</div><br/>Are you sure you want to delete integration endpoint?',
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
                context.clearInputFields();
            },
            DataContext: this
        };
        this.showDialog(content);
    }

    clearInputFields() {
        this.adminMail("");
        this.serviceName("");
        this.showErrors(false);
        this.changeValidationStatus(false);
    }
}
