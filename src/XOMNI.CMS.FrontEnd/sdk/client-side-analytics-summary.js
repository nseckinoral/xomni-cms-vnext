var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Xomni;
(function (Xomni) {
    (function (Private) {
        (function (Analytics) {
            /// <reference path="core.ts" />
            (function (ClientSideAnalyticsSummary) {
                var ClientSideAnalyticsLogSummaryClient = (function (_super) {
                    __extends(ClientSideAnalyticsLogSummaryClient, _super);
                    function ClientSideAnalyticsLogSummaryClient() {
                        _super.apply(this, arguments);
                        this.weeklyLogSummaryUri = '/private/analytics/clientcounters/{counterName}/summary/weekly?';
                        this.dailyLogSummaryUri = '/private/analytics/clientcounters/{counterName}/summary/daily?';
                        this.monthlyLogSummaryUri = '/private/analytics/clientcounters/{counterName}/summary/monthly?';
                        this.yearlyLogSummaryUri = '/private/analytics/clientcounters/{counterName}/summary/yearly?';
                    }
                    ClientSideAnalyticsLogSummaryClient.prototype.getDailyLogs = function (counterName, startOADate, endOADate, success, error) {
                        var uri = this.PrepareUri(this.dailyLogSummaryUri, counterName, startOADate, endOADate);
                        this.httpProvider.get(uri, success, error);
                    };

                    ClientSideAnalyticsLogSummaryClient.prototype.getWeeklyLogs = function (counterName, startOADate, endOADate, success, error) {
                        var uri = this.PrepareUri(this.weeklyLogSummaryUri, counterName, startOADate, endOADate);
                        this.httpProvider.get(uri, success, error);
                    };

                    ClientSideAnalyticsLogSummaryClient.prototype.getMonthlyLogs = function (counterName, startOADate, endOADate, success, error) {
                        var uri = this.PrepareUri(this.monthlyLogSummaryUri, counterName, startOADate, endOADate);
                        this.httpProvider.get(uri, success, error);
                    };

                    ClientSideAnalyticsLogSummaryClient.prototype.getYearlyLogs = function (counterName, startOADate, endOADate, success, error) {
                        var uri = this.PrepareUri(this.yearlyLogSummaryUri, counterName, startOADate, endOADate);
                        this.httpProvider.get(uri, success, error);
                    };

                    ClientSideAnalyticsLogSummaryClient.prototype.PrepareUri = function (baseUri, counterName, startOADate, endOADate) {
                        var uri = baseUri.replace("{counterName}", counterName);
                        return uri + "startOADate=" + startOADate + "&endOADate=" + endOADate;
                    };
                    return ClientSideAnalyticsLogSummaryClient;
                })(Xomni.BaseClient);
                ClientSideAnalyticsSummary.ClientSideAnalyticsLogSummaryClient = ClientSideAnalyticsLogSummaryClient;
            })(Analytics.ClientSideAnalyticsSummary || (Analytics.ClientSideAnalyticsSummary = {}));
            var ClientSideAnalyticsSummary = Analytics.ClientSideAnalyticsSummary;
        })(Private.Analytics || (Private.Analytics = {}));
        var Analytics = Private.Analytics;
    })(Xomni.Private || (Xomni.Private = {}));
    var Private = Xomni.Private;
})(Xomni || (Xomni = {}));
//# sourceMappingURL=client-side-analytics-summary.js.map
