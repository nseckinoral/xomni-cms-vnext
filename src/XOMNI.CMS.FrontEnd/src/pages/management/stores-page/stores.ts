/// <amd-dependency path="xomni" />
/// <amd-dependency path="text!./stores.html" />
/// <amd-dependency path="bootstrap-paginator" />
import $ = require("jquery");
import ko = require("knockout");
import cms = require("app/infrastructure");
import hasher = require("hasher");

export var template: string = require("text!./stores.html");

export class viewModel extends cms.infrastructure.baseViewModel {

    public client = new Xomni.Management.Configuration.Store.StoreClient;
    public stores = ko.observableArray<Models.Management.Configuration.Store>();
    public pageCount = ko.observableArray<number>();
    public currentPage = 1;

    constructor(params: any) {
        super();
        var skip = 0;

        try {
            var pageNumber = parseInt(params.route()["?query"].page);
            this.currentPage = pageNumber;
            skip = (this.currentPage - 1) * cms.infrastructure.Configuration.AppSettings.ShortListItemCount;
        }
        catch (exception) {
            if (exception.name != "TypeError") {
                this.showCustomErrorDialog(exception.message);
            }
        }

        this.initialize(skip);
    }

    initialize(skip: number) {
        try {
            this.client.getList(skip, cms.infrastructure.Configuration.AppSettings.ShortListItemCount, this.success, this.error);
        }
        catch (exception) {
            this.showCustomErrorDialog(exception.Message);
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
                hasher.setHash("#management/stores?page=" + page);
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
        };
        
        $('#pagination').bootstrapPaginator(options);
    }

    generateUrl(page: string, id?: number) {

        var baseUrl = cms.infrastructure.Configuration.AppSettings.XomniApiUrl.replace("api", "cms");
        switch (page) {
            case "add":
                baseUrl += "/Stores/AddEdit.aspx";
                break;
            case "edit":
                baseUrl += "/Stores/AddEdit.aspx?Id=" + id;
                break;
            case "delete":
                baseUrl += "/Stores/List.aspx";
                break;
        }
        return baseUrl;
    }

    public decidePagingVisibility() {
        if (this.pageCount().length > 1) {
            return true;
        }
        return false;
    }

    success = (result) => {
        try {
            var count = this.range(1, (Math.ceil(result.TotalCount / cms.infrastructure.Configuration.AppSettings.ShortListItemCount)));
            this.pageCount(count);

            if (this.currentPage > this.pageCount()[this.pageCount().length - 1]) {
                this.pageCount.removeAll();
                throw new Error("Invalid page number");
            }
            this.stores(result.Results);
            this.initializePagination();
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