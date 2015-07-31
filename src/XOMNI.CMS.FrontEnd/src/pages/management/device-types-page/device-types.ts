/// <amd-dependency path="xomni" />
/// <amd-dependency path="text!./device-types.html" />
/// <amd-dependency path="bootstrap-paginator" />
/// <amd-dependency path="jqueryui" />
import $ = require("jquery");
import ko = require("knockout");
import cms = require("app/infrastructure");
import hasher = require("hasher");
import dialog = require("models/dialog-content");

export var template: string = require("text!./device-types.html");

export class viewModel extends cms.infrastructure.baseViewModel {

    public client = new Xomni.Management.Company.DeviceTypes.DeviceTypesClient();
    public deviceTypes = ko.observableArray<Models.Management.Company.DeviceType>();
    public pageCount = ko.observableArray<number>();
    public currentPage = 1;
    public editableRow = ko.observable<number>(0);
    public skip: number = 0;
    public isAddAvailable = ko.observable<boolean>(false);
    public deletedItem: Models.Management.Company.DeviceType;
    public newDescription = ko.observable<string>().extend({
        required: {
            message: "Description should be filled."
        }
    });
    public newDeviceTypeId: number;

    constructor(params: any) {
        super();

        try {
            var pageNumber = parseInt(params.route()["?query"].page);
            this.currentPage = pageNumber;
            this.skip = (this.currentPage - 1) * cms.infrastructure.Configuration.AppSettings.ShortListItemCount;
            this.newDeviceTypeId = params.route()["?query"].id;
        }
        catch (exception) {
            if (exception.name != "TypeError") {
                this.showCustomErrorDialog(exception.message);
            }
        }
        this.initValidation(ko.validation.group([this.newDescription]));
        this.initialize(this.skip);
    }

    public highlightNewDeviceType(hexColor: string, duration: number, id?: number) {
        var deviceTypeId = this.newDeviceTypeId;
        if (id) {
            deviceTypeId = id;
        }
        setTimeout(function () {
            $("#" + deviceTypeId).effect("highlight", { color: hexColor }, duration);
        }, 300);

    }

    public prepareAddInput() {
        this.cancel();
        this.isAddAvailable(true);
        $("#addInput").focus();
    }

    public decideEditability(data: Models.Management.Company.DeviceType, index: number, element: any) {
        if (data.Description != "InStore" && data.Description != "Consumer") {
            switch (element.id) {
                case 'delete':
                case 'edit':
                case 'description':
                    return this.editableRow() != index + 1;
                    break;
                case 'cancel':
                case 'save':
                case 'editableDescription':
                    return this.editableRow() == index + 1;
                    break;
            }
        }
        else {
            switch (element.id) {
                case 'description':
                    return this.editableRow() != index + 1;
                    break;
                case 'editableDescription':
                    return this.editableRow() == index + 1;
                    break;
            }
        }
    }

    public deleteDeviceType(data: Models.Management.Company.DeviceType) {
        try {
            this.deletedItem = data;
            var content = <dialog.DialogContent>{
                Body: '<div class="alert alert-warning">Deleting a devicetype is not reversible.</div><br/>Are you sure you want to delete this device type?',
                Title: "Warning",
                Type: dialog.ContentType.Warning,
                Click: (context) => {
                    this.client.delete(data.Id, this.deleteSuccess, this.error);
                },
                DataContext: this
            };
            this.showDialog(content);


        }
        catch (exception) {
            this.showCustomErrorDialog(exception.message);
        }
    }

    public cancel() {
        this.changeEditableRow(-1);
        this.newDescription(null);
        this.isAddAvailable(false);
        this.changeValidationStatus(false);
    }

    public updateDeviceType(data, description) {
        this.changeValidationStatus(true);
        if (this.getValidationErrors().length == 0) {
            try {
                if (description != data.Description) {
                    this.client.put({ Id: data.Id, Description: description }, () => { this.initialize(this.skip); }, this.error);
                }
                this.cancel();
            }
            catch (exception) {
                this.showCustomErrorDialog(exception.message);
            }
        }
    }

    public handleUpdateKeyUp(event, data, description) {
        var theEvent = event || window.event;
        var key = theEvent.keyCode || theEvent.which;
        if (key == 13) {
            this.updateDeviceType(data, description);
        }
        if (key == 27) {
            this.cancel();
        }
    }

    public handlePostKeyUp(event, data, description) {
        var theEvent = event || window.event;
        var key = theEvent.keyCode || theEvent.which;
        if (key == 13) {
            this.postDeviceType(data, description);
        }
        if (key == 27) {
            this.cancel();
        }
    }

    public postDeviceType(data, description) {
        this.changeValidationStatus(true);
        if (this.getValidationErrors().length == 0) {
            try {
                //Current Page is Last Page
                if (this.pageCount().length == this.currentPage) {
                    if (this.deviceTypes().length < cms.infrastructure.Configuration.AppSettings.ShortListItemCount) {
                        this.client.post({ Id: 0, Description: description }, (result) => {
                            this.initialize((this.currentPage - 1) * cms.infrastructure.Configuration.AppSettings.ShortListItemCount, () => this.highlightNewDeviceType('#d9edf7', 1500, result.Id));
                        }, this.error);
                    }
                    //List is full
                    else {
                        this.client.post({ Id: 0, Description: description }, (result) => {
                            hasher.setHash("#management/device-types?page=" + (this.currentPage + 1) + "&id=" + result.Id);
                        }, this.error);
                    }
                }
                else {
                    //Get the Total Count by fetching 1 device type only.
                    this.client.getList(0, 1, (result: Models.PaginatedContainer<Models.Management.Company.DeviceType>) => {
                        //Last page is full
                        if (result.TotalCount % 10 == 0) {
                            this.client.post({ Id: 0, Description: description }, (result) => {
                                hasher.setHash("#management/device-types?page=" + (this.pageCount().length + 1) + "&id=" + result.Id);
                            }, this.error);
                        }
                        else {
                            this.client.post({ Id: 0, Description: description }, (result) => {
                                hasher.setHash("#management/device-types?page=" + this.pageCount().length + "&id=" + result.Id);
                            }, this.error);
                        }
                    }, this.error);
                }
            }
            catch (exception) {
                this.showCustomErrorDialog(exception.message);
            }
        }

    }

    public changeEditableRow(index: number, data?: Models.Management.Company.DeviceType) {
        this.editableRow(index + 1);
        if (data) {
            this.newDescription(data.Description);
            $("#" + data.Description).focus();
        }
    }

    public decidePagingVisibility() {
        if (this.pageCount().length > 1) {
            return true;
        }
        return false;
    }


    initialize(skip: number, highlight?: () => void) {
        try {
            this.client.getList(skip, cms.infrastructure.Configuration.AppSettings.ShortListItemCount, (result) => { this.success(result, highlight) }, this.error);
        }
        catch (exception) {
            this.showCustomErrorDialog(exception.message);
        }
    }

    initializePagination() {
        var options = {
            currentPage: this.currentPage,
            totalPages: this.pageCount().length,
            numberOfPages: 10,
            size: 'small',
            bootstrapMajorVersion: 3,
            pageUrl: function (type, page, current) {
                return "javascript:void(0);"
            },
            onPageClicked: (event, originalEvent, type, page) => {
                hasher.setHash("#management/device-types?page=" + page);
            },
            itemTexts: function (type, page, current) {
                switch (type) {
                    case "first":
                        return "First";
                    case "prev":
                        return "&laquo;";
                    case "next":
                        return "&raquo;";
                    case "last":
                        return "Last";
                    case "page":
                        return page;
                }
            }
        }

        $('#pagination').bootstrapPaginator(options);
    }

    deleteSuccess = () => {
        var firstItem = this.deviceTypes()[0];
        if (this.deletedItem == firstItem) {
            hasher.setHash("management/device-types?page=" + (this.currentPage - 1));
        }
        else {
            this.initialize(this.skip);
        }
    }

    success = (result: Models.PaginatedContainer<Models.Management.Company.DeviceType>, highlight?: () => void) => {
        try {
            var count = this.range(1, (Math.ceil(result.TotalCount / cms.infrastructure.Configuration.AppSettings.ShortListItemCount)));
            this.pageCount(count);

            if (this.currentPage > this.pageCount()[this.pageCount().length - 1]) {
                this.pageCount.removeAll();
                throw new Error("Invalid page number");
            }
            this.deviceTypes(result.Results);
            this.initializePagination();
            this.editableRow(0);
            this.isAddAvailable(false);

            if (highlight) {
                this.newDeviceTypeId = null;
                highlight();
            }

            if (this.newDeviceTypeId) {
                this.highlightNewDeviceType('#d9edf7', 1500);
            }
        }
        catch (exception) {
            this.showCustomErrorDialog(exception.message);
        }
    }

    error = (error: Models.ExceptionResult) => {
        var errorMessage = this.createErrorMessage(error);
        this.showCustomErrorDialog(errorMessage);
    }

    range(start, end) {
        var foo = [];
        for (var i = start; i <= end; i++) {
            foo.push(i);
        }
        return foo;
    }
}
