/// <amd-dependency path="xomni" />
/// <amd-dependency path="text!./device-types.html" />
/// <amd-dependency path="bootstrap-paginator" />
import $ = require("jquery");
import ko = require("knockout");
import cms = require("app/infrastructure");


export var template: string = require("text!./device-types.html");

export class viewModel extends cms.infrastructure.baseViewModel {

    public client = new Xomni.Management.Company.DeviceTypes.DeviceTypesClient();
    public deviceTypes = ko.observableArray<Models.Management.Company.DeviceType>();
    public pageCount = ko.observableArray<number>();
    private take = cms.infrastructure.Configuration.AppSettings.DeviceTypesTake;
    public currentPage = 1;

    public buttonIsVisible(data: Models.Management.Company.DeviceType) {
        return !(data.Description == 'InStore' || data.Description == 'Consumer');
    }

    public pagingIsVisible() {
        if (this.pageCount().length > 1) {
            return true;
        }
        return false;
    }

    constructor(params: any) {
        super();
        var skip = 0;

        try {
            var pageNumber = parseInt(params.route()["?query"].page);
            this.currentPage = pageNumber;
            skip = (this.currentPage - 1) * this.take;
        }
        catch (e) {

        }

        this.initialize(skip);
    }

    initialize(skip: number) {
        try {
            this.client.getList(skip, this.take, this.success, this.error);
        }
        catch (exception) {
            this.showCustomErrorDialog(exception.Message);
        }
    }

    success = (result: Models.PaginatedContainer<Models.Management.Company.DeviceType>) => {
        try {
            var count = this.range(1, (Math.ceil(result.TotalCount / this.take)));
            this.pageCount(count);

            if (this.currentPage > this.pageCount()[this.pageCount().length - 1]) {
                this.pageCount.removeAll();
                throw new Error("Invalid page number");
            }
            this.deviceTypes(result.Results);
            this.initializePagination();
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
                return "/XOMNI.CMS.FrontEnd/src/#management/device-types?page=" + page;
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
