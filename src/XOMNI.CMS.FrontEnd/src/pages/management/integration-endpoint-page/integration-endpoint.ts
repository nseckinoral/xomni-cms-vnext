/// <amd-dependency path="xomni" />
/// <amd-dependency path="text!./integration-endpoint.html" />

import $ = require("jquery");
import ko = require("knockout");
import cms = require("app/infrastructure");

export var template: string = require("text!./integration-endpoint.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    public client = new Xomni.Management.Integration.Endpoint.EndpointClient();
    public isEnabled = ko.observable(false);
    public adminMail = ko.observable<string>().extend({ required: true, email: true });
    public serviceName = ko.observable<string>().extend({ required: true });
    public serviceTier = ko.observable<number>().extend({ required: true });
    public managementPortalUrl = ko.observable<string>();
    public endpointCreateStatus = ko.observable<string>();
    public serviceTierOptions = ko.observableArray([{ Id: 1, Description: "Developer" }, { Id: 2, Description: "Standart" }, { Id: 3, Description: "Premium" }]);
    public validationErrors = validation.group([this.adminMail, this.serviceName, this.serviceTier]);

    constructor() {
        super();
        this.showLoadingDialog();
        this.initalize();
        this.hideLoadingDialog();
    }

    initalize() {
        this.client.get(
            (t) => {
                this.hideLoadingDialog();
                this.managementPortalUrl(t.ManagementPortalUrl);
                this.serviceName(t.ServiceName);
                this.endpointCreateStatus(Models.Management.Integration.EndpointStatusType[t.Status]);
                this.isEnabled(true);
            },
            (e) => {
                this.hideLoadingDialog();
                if (e.HttpStatusCode == 404) {
                    this.isEnabled(false);
                }
                else {
                    this.hideLoadingDialog();
                    this.showErrorDialog();
                }
            }
            );
    }

    createEndpoint() {
        if (this.validationErrors().length == 0) {
            this.showLoadingDialog();
            this.client.post({
                AdminMail: this.adminMail(),
                ServiceName: this.serviceName(),
                ServiceTier: this.serviceTier()
            },
                () => {
                    this.initalize();
                },
                (e) => {
                    this.hideLoadingDialog();
                    this.showErrorDialog();
                }
                );
        }
        else {
            this.validationErrors.showAllMessages();
        }
    }

    deleteEndpoint() {
        this.showLoadingDialog();
        this.client.delete(
            () => {
                this.initalize();
            },
            (e) => {
                this.hideLoadingDialog();
                this.showErrorDialog();
            }
            );
    }

    showLoadingDialog() {
        $('#pleaseWaitDialog').modal({ keyboard: false, show: true });
    }

    hideLoadingDialog() {
        $('#pleaseWaitDialog').modal('hide');
    }

    showErrorDialog() {
        $('#dialogContent').text('An error occurred. Please try again.');
        $('#genericDialog').modal({ keyboard: false, show: true });
    }

    showNoDataFoundDialog() {
        $('#dialogContent').text('No data found for selected dates.');
        $('#genericDialog').modal({ keyboard: false, show: true });
    }
}