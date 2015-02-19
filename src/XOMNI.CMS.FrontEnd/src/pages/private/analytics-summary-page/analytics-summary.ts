/// <reference path="../../../../sdk/core.ts" />
/// <reference path="../../../../definitions/moment/moment.d.ts" />
/// <amd-dependency path="text!./analytics-summary.html" />
import $ = require("jquery");
import ko = require("knockout");

export var template: string = require("text!./analytics-summary.html");

declare var Chartist;
export class viewModel {
    public selectedCounterType = ko.observable("daily");
    public clientCounters = ko.observableArray([]);
    public selectedClientCounters = ko.observableArray([]);

    constructor() {
        this.showLoadingDialog();
        var slider: any = $("#slider");
        var minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 2);
        var maxDate = new Date();
        var defaultMinDate = new Date();
        defaultMinDate.setMonth(defaultMinDate.getMonth() - 1);
        var defaultMaxDate = new Date();
        slider.dateRangeSlider({
            bounds: { min: minDate, max: maxDate },
            defaultValues: { min: defaultMinDate, max: defaultMaxDate },
            step: {
                days: 1
            },
            range: {
                min: { days: 1 },
                max: { days: 31 }
            }
        });

        slider.bind("userValuesChanged", (e, data) => {
            this.loadChart();
        });


        var credentials: any = $.parseJSON(this.getCookie(location.hostname.replace('vnext', '') + 'SharedCMSCredentials'));
        var username = credentials.UserName;
        var password = credentials.Password;

        Xomni.currentContext = new Xomni.ClientContext(username, password, location.protocol + '//' + location.hostname.replace('cmsvnext', 'api'));
        var client = new Xomni.Private.Analytics.ClientCounters.ClientCounterClient();
        var successFunc = (counters: Xomni.Private.Analytics.ClientCounters.ClientCounterListContainer) => {
            for (var i = 0; i < counters.CounterNames.length; i++) {
                this.clientCounters.push(counters.CounterNames[i]);
            }
            if (counters.ContinuationToken !== null) {
                client.getClientCounterList(successFunc, errorFunc, counters.ContinuationToken);
            }
            else {
                this.hideLoadingDialog();
            }
        };

        var errorFunc = (error) => { alert(error); }
        client.getClientCounterList(successFunc, errorFunc);
    }

    showLoadingDialog() {
        $('#pleaseWaitDialog').modal({ keyboard: false, show: true, });
    }

    hideLoadingDialog() {
        $('#pleaseWaitDialog').modal('hide');
    }

    ///TODO : Use jquery cookie
    getCookie(cookieName: string): any {
        var name = cookieName + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1);
            if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
        }
        return "";
    }

    dailySelected(): boolean {
        var slider: any = $("#slider");
        slider.dateRangeSlider({
            range: {
                min: { days: 1 },
                max: { days: 31 }
            }
        });
        return true;
    }

    weeklySelected(): boolean {
        var slider: any = $("#slider");
        slider.dateRangeSlider({
            range: {
                min: { days: 1 },
                max: { days: 366 }
            }
        });
        return true;
    }

    monthlySelected(): boolean {
        var slider: any = $("#slider");
        slider.dateRangeSlider({
            range: {
                min: { days: 1 },
                max: { days: 366 }
            }
        });
        return true;
    }

    yearlySelected(): boolean {
        var slider: any = $("#slider");
        slider.dateRangeSlider({
            range: {
                min: { years: 1 },
                max: { years: 2 }
            }
        });
        return true;
    }

    loadChart(): boolean {
        this.showLoadingDialog();
        if (this.selectedClientCounters().length != 0) {
            switch (this.selectedCounterType()) {
                case ("daily"): {
                    this.createDailyChart();
                    break;
                }
                case ("weekly"): {
                    this.createWeeklyChart();
                    break;
                }
                case ("monthly"): {
                    this.createMonthlyChart();
                    break;
                }
                case ("yearly"): {
                    this.createYearlyChart();
                    break;
                }
            }
        }
        return true;
    }

    createDailyChart() {
        var client = new Xomni.Private.Analytics.ClientSideAnalyticsSummary.ClientSideAnalyticsLogSummaryClient();
        var slider: any = $("#slider");
        var selectedDates = slider.dateRangeSlider("values");
        var startDateWrapper: any = moment(selectedDates.min);
        var endDateWrapper: any = moment(selectedDates.max);

        var data = {
            labels: [],
            series: []
        };

        var resultCount: number = 0;
        for (var i = 0; i < this.selectedClientCounters().length; i++) {
            client.getDailyLogs(this.selectedClientCounters()[i], Math.floor(startDateWrapper.toOADate()), Math.floor(endDateWrapper.toOADate()), res=> {
                var array: Array<number> = [];
                data.series.push(array);
                for (var k = 0; k < res.length; k++) {
                    var date: string = res[k].Month.toString() + '/' + res[k].Day.toString() + '/' + res[k].Year.toString();
                    if (data.labels.indexOf(date) === -1) {
                        data.labels.push(date);
                    }
                    array.push(res[k].TotalCount);
                }
                resultCount++;
                if (resultCount === this.selectedClientCounters().length) {
                    new Chartist.Line('.ct-chart', data);
                    this.hideLoadingDialog();
                }
            }, err=> {
                    this.hideLoadingDialog();
                    alert(err);
                });
        }
    }

    createWeeklyChart() {
        var client = new Xomni.Private.Analytics.ClientSideAnalyticsSummary.ClientSideAnalyticsLogSummaryClient();
        var slider: any = $("#slider");
        var selectedDates = slider.dateRangeSlider("values");
        var startDateWrapper: any = moment(selectedDates.min);
        var endDateWrapper: any = moment(selectedDates.max);
        var data = {
            labels: [],
            series: []
        };

        var resultCount: number = 0;
        for (var i = 0; i < this.selectedClientCounters().length; i++) {
            client.getWeeklyLogs(this.selectedClientCounters()[i], Math.floor(startDateWrapper.toOADate()), Math.floor(endDateWrapper.toOADate()), res=> {
                var array: Array<number> = [];
                data.series.push(array);
                for (var k = 0; k < res.length; k++) {
                    var date: string = res[k].WeekOfYear.toString();
                    if (data.labels.indexOf(date) === -1) {
                        data.labels.push(date);
                    }
                    array.push(res[k].TotalCount);
                }
                resultCount++;
                if (resultCount === this.selectedClientCounters().length) {
                    new Chartist.Line('.ct-chart', data);
                    this.hideLoadingDialog();
                }
            }, err=> {
                    this.hideLoadingDialog();
                    alert(err);
                });
        }
    }

    createMonthlyChart() {
        var client = new Xomni.Private.Analytics.ClientSideAnalyticsSummary.ClientSideAnalyticsLogSummaryClient();
        var slider: any = $("#slider");
        var selectedDates = slider.dateRangeSlider("values");
        var startDateWrapper: any = moment(selectedDates.min);
        var endDateWrapper: any = moment(selectedDates.max);
        var data = {
            labels: [],
            series: []
        };

        var resultCount: number = 0;
        for (var i = 0; i < this.selectedClientCounters().length; i++) {
            client.getMonthlyLogs(this.selectedClientCounters()[i], Math.floor(startDateWrapper.toOADate()), Math.floor(endDateWrapper.toOADate()), res=> {
                var array: Array<number> = [];
                data.series.push(array);
                for (var k = 0; k < res.length; k++) {
                    var date: string = res[k].Month.toString() + '/' + res[k].Year.toString();
                    if (data.labels.indexOf(date) === -1) {
                        data.labels.push(date);
                    }
                    array.push(res[k].TotalCount);
                }
                resultCount++;
                if (resultCount === this.selectedClientCounters().length) {
                    new Chartist.Line('.ct-chart', data);
                    this.hideLoadingDialog();
                }
            }, err=> {
                    this.hideLoadingDialog();
                    alert(err);
                });
        }
    }

    createYearlyChart() {
        var client = new Xomni.Private.Analytics.ClientSideAnalyticsSummary.ClientSideAnalyticsLogSummaryClient();
        var slider: any = $("#slider");
        var selectedDates = slider.dateRangeSlider("values");
        var startDateWrapper: any = moment(selectedDates.min);
        var endDateWrapper: any = moment(selectedDates.max);
        var data = {
            labels: [],
            series: []
        };

        var resultCount: number = 0;
        for (var i = 0; i < this.selectedClientCounters().length; i++) {
            client.getYearlyLogs(this.selectedClientCounters()[i], Math.floor(startDateWrapper.toOADate()), Math.floor(endDateWrapper.toOADate()), res=> {
                var array: Array<number> = [];
                data.series.push(array);
                for (var k = 0; k < res.length; k++) {
                    var date: string = res[k].Year.toString();
                    if (data.labels.indexOf(date) === -1) {
                        data.labels.push(date);
                    }
                    array.push(res[k].TotalCount);
                }
                resultCount++;
                if (resultCount === this.selectedClientCounters().length) {
                    new Chartist.Line('.ct-chart', data);
                    this.hideLoadingDialog();
                }
            }, err=> {
                    this.hideLoadingDialog();
                    alert(err);
                });
        }
    }
}