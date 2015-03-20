/// <amd-dependency path="jqrangeslider" />
/// <amd-dependency path="moment-msdate" />
/// <amd-dependency path="xomni" />
/// <amd-dependency path="text!./analytics-summary.html" />
/// <amd-dependency path="jquery-cookie" />

import $ = require("jquery");
import ko = require("knockout");
import Chartist = require("chartist");
import moment = require("moment");
import cms = require("app/infrastructure");

export var template: string = require("text!./analytics-summary.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    public selectedCounterType = ko.observable("daily");
    public clientCounters = ko.observableArray([]);
    public selectedClientCounters = ko.observableArray([]);

    constructor() {
        super();
        this.showLoadingDialog();
        this.initializeSlider();
        this.loadClientCounters();
    }

    initializeSlider() {
        var slider = $("#slider");
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

        slider.bind("userValuesChanged", (e) => {
            this.loadChart();
        });
    }

    loadClientCounters() {
        var client = new Xomni.Private.Analytics.ClientCounters.ClientCounterClient();
        var errorFunc = (error) => { this.hideLoadingDialog(); };

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

        client.getClientCounterList(successFunc, errorFunc);
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

    loadChart() {
        if (this.selectedClientCounters().length > 0) {
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
        }
    }

    createDailyChart() {
        var client = new Xomni.Private.Analytics.ClientSideAnalyticsSummary.ClientSideAnalyticsLogSummaryClient();
        var selectedDates = this.getSelectedDates();
        var data = {
            labels: [],
            series: []
        };

        var resultCount: number = 0;
        for (var i = 0; i < this.selectedClientCounters().length; i++) {
            client.getDailyLogs(this.selectedClientCounters()[i], selectedDates.startOADate, selectedDates.endOADate, res=> {
                if (res.length > 0) {
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
                        new Chartist.Line('.ct-chart', data, {
                            showPoint: true,
                            // Disable line smoothing
                            lineSmooth: false
                        });
                        $(".ct-chart").show();
                        this.hideLoadingDialog();
                    }
                }
                else {
                    this.hideLoadingDialog();
                    $(".ct-chart").hide();
                    this.showNoDataFoundDialog();
                }
            }, err=> {
                    this.hideLoadingDialog();
                    $(".ct-chart").hide();
                    this.showErrorDialog();
                });
        }
    }

    createWeeklyChart() {
        var client = new Xomni.Private.Analytics.ClientSideAnalyticsSummary.ClientSideAnalyticsLogSummaryClient();
        var selectedDates = this.getSelectedDates();
        var data = {
            labels: [],
            series: []
        };

        var resultCount: number = 0;
        for (var i = 0; i < this.selectedClientCounters().length; i++) {
            client.getWeeklyLogs(this.selectedClientCounters()[i], selectedDates.startOADate, selectedDates.endOADate, res=> {
                if (res.length > 0) {
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
                        $(".ct-chart").show();
                        this.hideLoadingDialog();
                    }
                }
                else {
                    this.hideLoadingDialog();
                    $(".ct-chart").hide();
                    this.showNoDataFoundDialog();
                }
            }, err=> {
                    this.hideLoadingDialog();
                    $(".ct-chart").hide();
                    this.showErrorDialog();
                });
        }
    }

    createMonthlyChart() {
        var client = new Xomni.Private.Analytics.ClientSideAnalyticsSummary.ClientSideAnalyticsLogSummaryClient();
        var selectedDates = this.getSelectedDates();
        var data = {
            labels: [],
            series: []
        };

        var resultCount: number = 0;
        for (var i = 0; i < this.selectedClientCounters().length; i++) {
            client.getMonthlyLogs(this.selectedClientCounters()[i], selectedDates.startOADate, selectedDates.endOADate, res=> {
                if (res.length > 0) {
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
                        $(".ct-chart").show();
                        this.hideLoadingDialog();
                    }
                }
                else {
                    this.hideLoadingDialog();
                    $(".ct-chart").hide();
                    this.showNoDataFoundDialog();
                }
            }, err=> {
                    this.hideLoadingDialog();
                    $(".ct-chart").hide();
                    this.showErrorDialog();
                });
        }
    }

    createYearlyChart() {
        var client = new Xomni.Private.Analytics.ClientSideAnalyticsSummary.ClientSideAnalyticsLogSummaryClient();
        var selectedDates = this.getSelectedDates();
        var data = {
            labels: [],
            series: []
        };

        var resultCount: number = 0;
        for (var i = 0; i < this.selectedClientCounters().length; i++) {
            client.getYearlyLogs(this.selectedClientCounters()[i], selectedDates.startOADate, selectedDates.endOADate, res=> {
                if (res.length > 0) {
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
                        $(".ct-chart").show();
                        this.hideLoadingDialog();
                    }
                }
                else {
                    this.hideLoadingDialog();
                    $(".ct-chart").hide();
                    this.showNoDataFoundDialog();
                }
            }, err=> {
                    this.hideLoadingDialog();
                    $(".ct-chart").hide();
                    this.showErrorDialog();
                });
        }
    }

    private getSelectedDates(): SliderSelectedDates {
        var slider: any = $("#slider");
        var selectedDates = slider.dateRangeSlider("values");
        var startDateWrapper = moment(selectedDates.min);
        var endDateWrapper = moment(selectedDates.max);
        return {
            startOADate: Math.floor(startDateWrapper.toOADate()),
            endOADate: Math.floor(endDateWrapper.toOADate())
        };
    }


}

interface SliderSelectedDates {
    startOADate: number;
    endOADate: number;
}