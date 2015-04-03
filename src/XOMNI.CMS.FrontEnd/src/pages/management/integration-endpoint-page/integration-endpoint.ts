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
                this.endpointCreateStatus(Models.Management.Integration.EndpointStatusType[t.Status]);
                this.isEnabled(true);
            },
            (e) => {
                cms.infrastructure.showLoading(false);
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
                    cms.infrastructure.showLoading(false);
                    this.showErrorDialog();
                }
                );
        }
        else {
            this.validationErrors.showAllMessages();
        }
    }

    deleteEndpoint() {
        this.client.delete(
            () => {
                this.initalize();
            },
            (e) => {
                cms.infrastructure.showLoading(false);
                this.showErrorDialog();
            }
            );
    }

    showNoDataFoundDialog() {
        this.showCustomErrorDialog("No data found for selected dates.");
    }
}