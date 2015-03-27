/// <amd-dependency path="xomni" />
/// <amd-dependency path="text!./integration-endpoint.html" />

import $ = require("jquery");
import ko = require("knockout");
import cms = require("app/infrastructure");

export var template: string = require("text!./integration-endpoint.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    public client = new Xomni.Management.Integration.Endpoint.EndpointClient();
    public isEnabled = ko.observable(false);
    public endpointDetail = ko.observable<Models.Management.Integration.EndpointDetail>();
    public endpointCreateRequest = ko.observable<Models.Management.Integration.EndpointCreateRequest>();
    public endpointCreateStatus = ko.observable<string>();

    constructor() {
        super();
        this.showLoadingDialog();
        this.initalize();
        this.hideLoadingDialog();
    }

    initalize() {
        //this.client.get(
        //    (t) => {
        //        this.hideLoadingDialog();
        //        this.endpointDetail(t);
        //        this.endpointCreateStatus(Models.Management.Integration.EndpointStatusType[t.Status]);
        //    },
        //    (e) => {
        //        this.hideLoadingDialog();
        //        if (e.HttpStatusCode == 404) {
        //            this.isEnabled(false);
        //        }
        //        else {
        //            this.hideLoadingDialog();
        //            this.showErrorDialog();
        //        }
        //    }
        //);
    }

    createEndpoint() {
        this.showLoadingDialog();
        this.client.post(
            <Models.Management.Integration.EndpointCreateRequest> {
                AdminMail: (<any>this.endpointCreateRequest).ServiceName,
                ServiceName: (<any>this.endpointCreateRequest).AdminMail,
                ServiceTier: (<any>this.endpointCreateRequest).ServiceTier
            },
            () => {
                this.isEnabled(true);
                this.initalize();
            },
            (e) => {
                this.hideLoadingDialog();
                this.showErrorDialog();
            }
        ); 
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