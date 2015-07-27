/// <amd-dependency path="xomni" />
/// <amd-dependency path="text!./device-types.html" />
/// <amd-dependency path="bootstrap-paginator" />
import $ = require("jquery");
import ko = require("knockout");
import cms = require("app/infrastructure");
import hasher = require("hasher");


export var template: string = require("text!./device-types.html");

export class viewModel extends cms.infrastructure.baseViewModel {

    public client = new Xomni.Management.Company.DeviceTypes.DeviceTypesClient();
    public deviceTypes = ko.observableArray<Models.Management.Company.DeviceType>();
    public pageCount = ko.observableArray<number>();
    public currentPage = 1;

    public decideButtonVisibility(data: Models.Management.Company.DeviceType) {
        return !(data.Description == 'InStore' || data.Description == 'Consumer');
    }

    public decidePagingVisibility() {
        if (this.pageCount().length > 1) {
            return true;
        }
        return false;
    }

    constructor(params: any) {
        super();
        var skip = 0;

        try {
            this.currentPage = parseInt(params.route()["?query"].page);
            skip = (this.currentPage - 1) * cms.infrastructure.Configuration.AppSettings.ShortListItemCount;
        }
        catch (exception) {
            if (exception.name != "TypeError") {
                this.showCustomErrorDialog(exception.message);
            }
        }

        this.initialize(skip);
    }

    redirectToCms(page: string, id?: number) {
        var baseUrl = cms.infrastructure.Configuration.AppSettings.XomniApiUrl.replace("api", "cms");
        switch (page) {
            case "add":
                baseUrl += "/DeviceTypes/AddEdit.aspx";
                break;
            case "edit":
                baseUrl += "/DeviceTypes/AddEdit.aspx?Id=" + id;
                break;
            case "delete":
                baseUrl += "/DeviceTypes/List.aspx";
                break;
        }

        $(location).attr('href', baseUrl);
    }

    initialize(skip: number) {
        try {
            this.client.getList(skip, cms.infrastructure.Configuration.AppSettings.ShortListItemCount, this.success, this.error);
        }
        catch (exception) {
            this.showCustomErrorDialog(exception.Message);
        }
    }

    success = (result: Models.PaginatedContainer<Models.Management.Company.DeviceType>) => {
        try {
            var count = this.range(1,(Math.ceil(result.TotalCount / cms.infrastructure.Configuration.AppSettings.ShortListItemCount)));
            this.pageCount(count);
            var lastPage = this.pageCount()[this.pageCount().length - 1]
            if (this.currentPage > lastPage) {
                hasher.setHash("#management/device-types?page=" + lastPage);
            }
            else {
                this.deviceTypes(result.Results);
                this.initializePagination();
            }

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
