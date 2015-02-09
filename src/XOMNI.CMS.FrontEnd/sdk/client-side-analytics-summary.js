var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var XOMNIPrivateSDK;
(function (XOMNIPrivateSDK) {
    var BaseClient = (function () {
        function BaseClient() {
        }
        return BaseClient;
    })();
    XOMNIPrivateSDK.BaseClient = BaseClient;
    var ClientSideAnalyticsLogSummaryClient = (function (_super) {
        __extends(ClientSideAnalyticsLogSummaryClient, _super);
        function ClientSideAnalyticsLogSummaryClient() {
            _super.apply(this, arguments);
            this.weeklyLogSummaryUri = '/private/analytics/clientcounters/{counterName}/summary/weekly?';
            this.dailyLogSummaryUri = '/private/analytics/clientcounters/{counterName}/summary/daily?';
            this.monthlyLogSummaryUri = '/private/analytics/clientcounters/{counterName}/summary/monthly?';
            this.yearlyLogSummaryUri = '/private/analytics/clientcounters/{counterName}/summary/yearly?';
        }
        ClientSideAnalyticsLogSummaryClient.prototype.GetDailyLogs = function (counterName, startOADate, endOADate, success, error) {
            var httpProvider = new HttpProvider();
            var uri = this.PrepareUri(this.dailyLogSummaryUri, counterName, startOADate, endOADate);
            httpProvider.Get(uri, success, error);
        };

        ClientSideAnalyticsLogSummaryClient.prototype.GetWeeklyLogs = function (counterName, startOADate, endOADate, success, error) {
            var httpProvider = new HttpProvider();
            var uri = this.PrepareUri(this.weeklyLogSummaryUri, counterName, startOADate, endOADate);
            httpProvider.Get(uri, success, error);
        };

        ClientSideAnalyticsLogSummaryClient.prototype.GetMonthlyLogs = function (counterName, startOADate, endOADate, success, error) {
            var httpProvider = new HttpProvider();
            var uri = this.PrepareUri(this.monthlyLogSummaryUri, counterName, startOADate, endOADate);
            httpProvider.Get(uri, success, error);
        };

        ClientSideAnalyticsLogSummaryClient.prototype.GetYearlyLogs = function (counterName, startOADate, endOADate, success, error) {
            var httpProvider = new HttpProvider();
            var uri = this.PrepareUri(this.yearlyLogSummaryUri, counterName, startOADate, endOADate);
            httpProvider.Get(uri, success, error);
        };

        ClientSideAnalyticsLogSummaryClient.prototype.PrepareUri = function (baseUri, counterName, startOADate, endOADate) {
            var uri = baseUri.replace("{counterName}", counterName);
            return uri + "startOADate=" + startOADate + "&endOADate=" + endOADate;
        };
        return ClientSideAnalyticsLogSummaryClient;
    })(BaseClient);
    XOMNIPrivateSDK.ClientSideAnalyticsLogSummaryClient = ClientSideAnalyticsLogSummaryClient;

    var HttpProvider = (function () {
        function HttpProvider() {
        }
        HttpProvider.prototype.Get = function (uri, success, error) {
            var authorization = XOMNIPrivateSDK.currentContext.username + ":" + XOMNIPrivateSDK.currentContext.password;
            $.ajax({
                type: "Get",
                url: XOMNIPrivateSDK.currentContext.serviceUri + uri,
                contentType: "application/json",
                headers: {
                    "Authorization": btoa(authorization),
                    "Accept": "application/vnd.xomni.api-v3_0, */*"
                },
                success: function (d, t, s) {
                    success(d);
                },
                error: function (r, t, e) {
                    error(t);
                }
            });
        };
        return HttpProvider;
    })();

    var ClientContext = (function () {
        function ClientContext(username, password, serviceUri) {
            this.username = username;
            this.password = password;
            this.serviceUri = serviceUri;
        }
        ClientContext.prototype.GetClientAnalyticsSummaryClient = function () {
            return new ClientSideAnalyticsLogSummaryClient();
        };
        return ClientContext;
    })();
    XOMNIPrivateSDK.ClientContext = ClientContext;

    var BaseAnalyticsCountSummary = (function () {
        function BaseAnalyticsCountSummary() {
        }
        return BaseAnalyticsCountSummary;
    })();
    XOMNIPrivateSDK.BaseAnalyticsCountSummary = BaseAnalyticsCountSummary;

    var YearlyCountSummary = (function (_super) {
        __extends(YearlyCountSummary, _super);
        function YearlyCountSummary() {
            _super.apply(this, arguments);
        }
        return YearlyCountSummary;
    })(BaseAnalyticsCountSummary);
    XOMNIPrivateSDK.YearlyCountSummary = YearlyCountSummary;

    var MonthlyCountSummary = (function (_super) {
        __extends(MonthlyCountSummary, _super);
        function MonthlyCountSummary() {
            _super.apply(this, arguments);
        }
        return MonthlyCountSummary;
    })(YearlyCountSummary);
    XOMNIPrivateSDK.MonthlyCountSummary = MonthlyCountSummary;

    var WeeklyCountSummary = (function (_super) {
        __extends(WeeklyCountSummary, _super);
        function WeeklyCountSummary() {
            _super.apply(this, arguments);
        }
        return WeeklyCountSummary;
    })(MonthlyCountSummary);
    XOMNIPrivateSDK.WeeklyCountSummary = WeeklyCountSummary;

    var DailyCountSummary = (function (_super) {
        __extends(DailyCountSummary, _super);
        function DailyCountSummary() {
            _super.apply(this, arguments);
        }
        return DailyCountSummary;
    })(WeeklyCountSummary);
    XOMNIPrivateSDK.DailyCountSummary = DailyCountSummary;

    XOMNIPrivateSDK.currentContext;
})(XOMNIPrivateSDK || (XOMNIPrivateSDK = {}));
//# sourceMappingURL=client-side-analytics-summary.js.map
