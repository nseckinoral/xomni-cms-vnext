/// <amd-dependency path="xomni" />
/// <amd-dependency path="text!./add-edit.html" />
/// <amd-dependency path="jquery-simple-datepicker" />

import $ = require("jquery");
import ko = require("knockout");
import cms = require("app/infrastructure");
import hasher = require("hasher");

export var template: string = require("text!./add-edit.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    public metadataClient = new Xomni.Management.Company.DeviceMetadata.DeviceMetadataClient();
    public deviceClient = new Xomni.Management.Company.Device.DeviceClient();
    public licenseClient = new Xomni.Management.Security.License.LicenseClient();
    public deviceTypeClient = new Xomni.Management.Company.DeviceTypes.DeviceTypesClient();
    public deviceId: string;
    public deviceDescription: string = "";
    public deviceTypeList = new Array<Models.Management.Company.DeviceType>();
    public deviceTypeDescriptionList = ko.observableArray<string>();
    public licenseNameList = ko.observableArray<string>();
    public licenseList = new Array<Models.Management.Security.License>();
    public selectedDeviceType = ko.observable<string>();
    public selectedLicense = ko.observable<string>();
    public urlParameters: Array<any>;
    public relatedLicenseId;
    public editMode: boolean = false;
    public metadataList: Array<any> = new Array<Models.Management.Company.Metadata>();


    constructor() {
        super();
        this.urlParameters = this.sanitizeQuerystingIfNeccessary(this.getUrlParams());
        this.deviceId = this.urlParameters["deviceId"];
        this.relatedLicenseId = this.urlParameters["relatedLicenseId"];
        this.editMode = (this.deviceId && this.relatedLicenseId) ? true : false;
        this.initialize(this.deviceId,this.relatedLicenseId);
    }

    initialize(deviceId?: string, relatedLicenseId?: number) {
        this.deviceTypeClient.getList(0, 9999, this.deviceTypeGetListSuccess, this.error);
        this.licenseClient.getList(0, 9999, this.licenseGetListSuccess, this.error);
        if (deviceId && relatedLicenseId) {
            this.metadataClient.get(relatedLicenseId, deviceId, this.metadataGetSuccess, this.error);
            this.deviceClient.get(deviceId, relatedLicenseId, this.deviceGetSuccess, this.error);
        }
    }

    save() {
        var datePickerValue = $('#datepicker').handleDtpicker('getDate').toISOString();
        var expirationDate = new Models.UTCDate(datePickerValue);
        var device: Models.Management.Company.Device = {
            Description: this.deviceDescription,
            DeviceId: this.deviceId,
            DeviceTypeDescription: this.selectedDeviceType(),
            DeviceTypeId: this.findDeviceType(this.deviceTypeList, this.selectedDeviceType()).Id,
            RelatedLicenceName: this.selectedLicense(),
            ExpirationDate: expirationDate,
            RelatedLicenceId: this.findLicenseId(this.licenseList,this.selectedLicense()).Id
        };
        if (this.editMode) {
            this.deviceClient.put(this.urlParameters["deviceId"], device, this.devicePostSuccess, this.error);
        }
        else {
            this.deviceClient.post(device, this.devicePostSuccess, this.error);
        }

    }

    cancel() {
        hasher.setHash("");
    }

    findLicenseId = (licenseArray: Models.Management.Security.License[], licenseName: string): Models.Management.Security.License => {
        for (var i = 0; i < licenseArray.length; i++) {
            if (licenseName == licenseArray[i].Name) {
                return licenseArray[i];
            }
        }
    }

    findDeviceType = (deviceTypeArray: Models.Management.Company.DeviceType[], deviceTypeDescription: string): Models.Management.Company.DeviceType => {
        for (var i = 0; i < deviceTypeArray.length; i++) {
            if (deviceTypeDescription == deviceTypeArray[i].Description) {
                return deviceTypeArray[i];
            }
        }
    } 

    metadataGetSuccess = (result: Models.Management.Company.Metadata[]) => {
        this.metadataList = result;
    }

    devicePostSuccess = (result: Models.Management.Company.Device) => {
        //TODO: Check the URL that should be redirected
        hasher.setHash("");
    }

    licenseGetListSuccess = (result: Models.PaginatedContainer<Models.Management.Security.License>) => {
        this.licenseList = result.Results;
        for (var i = 0; i < result.TotalCount;i++) {
            this.licenseNameList.push(result.Results[i].Name);
        }
    }

    deviceTypeGetListSuccess = (result: Models.PaginatedContainer<Models.Management.Company.DeviceType>) => {
        this.deviceTypeList = result.Results;
        for (var i = 0; i < result.TotalCount; i++) {
            this.deviceTypeDescriptionList.push(result.Results[i].Description);
        }
    }

    deviceGetSuccess = (result: Models.Management.Company.Device) => {
        this.selectedDeviceType(result.DeviceTypeDescription);
        this.selectedLicense(result.RelatedLicenceName);
    }

    error = (error: Models.ExceptionResult) => {
        var errorMessage = this.createErrorMessage(error);
        this.showCustomErrorDialog(errorMessage);
    }

    public sanitizeQuerystingIfNeccessary(urlParameters: Array<any>) {
        var sortedArray = urlParameters.sort();
        var results = [];

        for (var i = 0; i < urlParameters.length; i++) {
            if (!results[urlParameters[i]]) {
                results.push(urlParameters[i]);
                results[urlParameters[i]] = urlParameters[urlParameters[i]];
            }
        }
        return results;
    }

    public getUrlParams() {
        var params = [], hash, hashes = [];
        if (window.location.href.indexOf('?') > -1) {
            hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        }

        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            params.push(hash[0]);
            params[hash[0]] = hash[1];
        }
        return params;
    }
}
     