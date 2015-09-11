/// <amd-dependency path="text!./paginator.html" />
import ko = require("knockout");
import cms = require("app/infrastructure");
import hasher = require("hasher");


export var template: string = require("text!./paginator.html");

export class viewModel extends cms.infrastructure.baseViewModel {

    public hasNextPage: boolean = false;
    public hasPreviousPage: boolean = false;
    public hasNextFrame: boolean = false;
    public hasPreviousFrame: boolean = false;
    public pageNumbers: Array<number> = new Array;
    public totalPageCount: number;
    public currentPage: number = 1;
    public urlParameters: Array<any>;

    constructor(params: any) {

        super();

        this.urlParameters = this.sanitizeQuerystingIfNeccessary(this.getUrlParams());

        if (cms.infrastructure.Configuration.AppSettings.PaginatorFrameSize <= 0) {
            this.showCustomErrorDialog("Frame Size should be greater than 0. Please take a look at the application settings.");
            return;
        }

        if (params.totalPageCount > 1) {
            this.totalPageCount = params.totalPageCount;
            if (this.urlParameters["page"]) {
                this.currentPage = parseInt(this.urlParameters["page"]) > this.totalPageCount ? this.totalPageCount : parseInt(this.urlParameters["page"]);
                if (!this.currentPage || this.currentPage < 0) {
                    this.currentPage = 1;
                }
            }
            this.initializePaginator(cms.infrastructure.Configuration.AppSettings.PaginatorFrameSize, this.totalPageCount, this.currentPage);
        }
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

    public prepareActiveClass(id: number) {

        var className: string = "";
        if (id == this.currentPage) {
            className = "active";
        }
        return className;
    }

    public initializePaginator(frameSize: number, totalPageCount: number, currentPage: number) {

        this.pageNumbers = this.calculateBoundry(frameSize, totalPageCount, currentPage);
        this.preparePageShortcutVisibility();
        this.prepareFrameShortcutVisibility();
    }

    public moveFrameRight() {
        this.redirectToPage(this.currentPage + cms.infrastructure.Configuration.AppSettings.PaginatorFrameSize > this.totalPageCount ?
            this.totalPageCount : this.currentPage + cms.infrastructure.Configuration.AppSettings.PaginatorFrameSize);
    }

    public moveFrameLeft() {
        this.redirectToPage(this.currentPage - cms.infrastructure.Configuration.AppSettings.PaginatorFrameSize < 1 ?
            1 : this.currentPage - cms.infrastructure.Configuration.AppSettings.PaginatorFrameSize);
    }

    public prepareFrameShortcutVisibility() {

        this.hasNextFrame = this.pageNumbers.indexOf(this.totalPageCount) > -1 ? false : true;
        this.hasPreviousFrame = this.pageNumbers[0] == 1 ? false : true;

    }

    public preparePageShortcutVisibility() {

        if (cms.infrastructure.Configuration.AppSettings.PaginatorFrameSize >= this.totalPageCount) {
            this.hasNextPage = false;
            this.hasPreviousPage = false;
        }
        else {
            if (this.currentPage == 1) {
                this.hasNextPage = true;
                this.hasPreviousPage = false;
            }

            else if (this.currentPage == this.totalPageCount) {
                this.hasNextPage = false;
                this.hasPreviousPage = true;
            }
            else {
                this.hasNextPage = true;
                this.hasPreviousPage = true;
            }
        }
    }

    public redirectToPage(pageNumber: number) {

        try {
            var newUri = this.prepareQuerystring(window.location.hash, pageNumber);
            hasher.setHash(newUri);
        }

        catch (exception) {
            this.showCustomErrorDialog(exception);
        }
    }

    public prepareQuerystring(uri: string, page: number) {

        var retVal: string = null;

        if (!this.urlParameters["page"]) {
            this.urlParameters.push("page");
        }

        this.urlParameters["page"] = page;

        var newPageQueryString: string = "?";

        for (var i = 0; i < this.urlParameters.length; i++) {

            if (i > 0) {
                newPageQueryString += "&";
            }

            newPageQueryString += this.urlParameters[i] + "=" + this.urlParameters[this.urlParameters[i]];
        }

        var queryStringIndex = window.location.hash.lastIndexOf("?");

        if (queryStringIndex > -1) {
            retVal = window.location.hash.slice(0, queryStringIndex) + newPageQueryString;
        }

        else {
            retVal = window.location.hash + newPageQueryString;
        }

        retVal = retVal.replace("#/", "");

        return retVal;
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

    public calculateBoundry(frameSize: number, totalPageCount: number, currentPage: number) {
        var upperBound = frameSize;

        if (totalPageCount < frameSize) {
            return this.range(1, totalPageCount);
        }
        else {
            var undividedFrame = this.range(1, totalPageCount);
            for (var i = 0; i <= totalPageCount; i += frameSize) {
                var currentFrame = undividedFrame.slice(i, upperBound);
                if (currentFrame.indexOf(currentPage) > -1) {
                    return currentFrame;
                }
                upperBound += frameSize;
            }
        }
    }

    public range(start: number, end: number) {

        var returnedArray = [];

        for (var i = start; i <= end; i++) {
            returnedArray.push(i);
        }

        return returnedArray;
    }

}