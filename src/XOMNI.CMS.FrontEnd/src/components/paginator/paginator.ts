/// <amd-dependency path="text!./paginator.html" />
import ko = require("knockout");
import cms = require("app/infrastructure");
import hasher = require("hasher");


export var template: string = require("text!./paginator.html");

export class viewModel extends cms.infrastructure.baseViewModel {

    public hasNext: boolean = false;
    public hasPrevious: boolean = false;
    public frameSize: number = 5;
    public pageNumbers: Array<number> = new Array;
    public totalPageCount: number;
    public currentPage: number = 1;
    public urlParameters: Array<any>;

    constructor(params: any) {

        super();

        this.urlParameters = this.sanitizeQuerystingIfNeccessary(this.getUrlParams());

        if (params.totalPageCount) {
            this.totalPageCount = params.totalPageCount;
            if (this.urlParameters["page"]) {
                this.currentPage = parseInt(this.urlParameters["page"]);
                if (!this.currentPage) {
                    this.currentPage = 1;
                }
            }
            this.initializePaginator(this.frameSize, this.totalPageCount, this.currentPage);
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

        var pageLimits = this.calculateBoundry(frameSize, totalPageCount, currentPage);
        this.pageNumbers = this.range(pageLimits.lowerBound, pageLimits.upperBound);
        this.prepareShortcutButtonVisibility();
    }

    public prepareShortcutButtonVisibility() {

        if (this.frameSize >= this.totalPageCount) {
            this.hasNext = false;
            this.hasPrevious = false;
        }

        else {
            if (this.currentPage == 1) {
                this.hasNext = true;
                this.hasPrevious = false;
            }

            else if (this.currentPage == this.pageNumbers[this.pageNumbers.length - 1]) {
                this.hasNext = false;
                this.hasPrevious = true;
            }

            else {
                this.hasNext = true;
                this.hasPrevious = true;
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

        var lowerBound;
        var upperBound;

        if (totalPageCount < frameSize) {
            lowerBound = 1;
            upperBound = totalPageCount;
        }

        else {
            var rightDisplay = Math.ceil(frameSize / 2);
            var leftDisplay = frameSize - rightDisplay;

            lowerBound = currentPage - leftDisplay;
            var lowerOffset = 0 - lowerBound;

            upperBound = currentPage + rightDisplay + (lowerOffset > 0 ? lowerOffset : 0);
            var upperOffset = upperBound > totalPageCount ? upperBound - totalPageCount : 0;
            upperBound = (totalPageCount - upperBound) > 0 ? upperBound : totalPageCount;

            lowerBound = lowerBound > 0 ? (lowerBound + lowerBound > upperOffset ? lowerBound - upperOffset + 1 : 1) : 1;
        }

        return { lowerBound: lowerBound, upperBound: upperBound };
    }

    public range(start: number, end: number) {

        var returnedArray = [];

        for (var i = start; i <= end; i++) {
            returnedArray.push(i);
        }

        return returnedArray;
    }

}