module XOMNIPrivateSDK {
    export class BaseClient {

    }
    export class ClientSideAnalyticsLogSummaryClient extends BaseClient {
        private weeklyLogSummaryUri: string = '/private/analytics/clientcounters/{counterName}/summary/weekly?';
        private dailyLogSummaryUri: string = '/private/analytics/clientcounters/{counterName}/summary/daily?';
        private monthlyLogSummaryUri: string = '/private/analytics/clientcounters/{counterName}/summary/monthly?';
        private yearlyLogSummaryUri: string = '/private/analytics/clientcounters/{counterName}/summary/yearly?';

        GetDailyLogs(counterName: string, startOADate: number, endOADate: number, success: (result: DailyCountSummary[]) => void, error: (error: any) => void) {
            var httpProvider = new HttpProvider();
            var uri = this.PrepareUri(this.dailyLogSummaryUri, counterName, startOADate, endOADate);
            httpProvider.Get(uri, success, error);
        }

        GetWeeklyLogs(counterName: string, startOADate: number, endOADate: number, success: (result: DailyCountSummary[]) => void, error: (error: any) => void) {
            var httpProvider = new HttpProvider();
            var uri = this.PrepareUri(this.weeklyLogSummaryUri, counterName, startOADate, endOADate);
            httpProvider.Get(uri, success, error);
        }

        GetMonthlyLogs(counterName: string, startOADate: number, endOADate: number, success: (result: DailyCountSummary[]) => void, error: (error: any) => void) {
            var httpProvider = new HttpProvider();
            var uri = this.PrepareUri(this.monthlyLogSummaryUri, counterName, startOADate, endOADate);
            httpProvider.Get(uri, success, error);
        }

        GetYearlyLogs(counterName: string, startOADate: number, endOADate: number, success: (result: DailyCountSummary[]) => void, error: (error: any) => void) {
            var httpProvider = new HttpProvider();
            var uri = this.PrepareUri(this.yearlyLogSummaryUri, counterName, startOADate, endOADate);
            httpProvider.Get(uri, success, error);
        }

        private PrepareUri(baseUri: string, counterName: string, startOADate: number, endOADate: number): string {
            var uri = baseUri.replace("{counterName}", counterName);
            return uri + "startOADate=" + startOADate + "&endOADate=" + endOADate;
        }
    }

    class HttpProvider {
        Get<T>(uri: string, success: (result: T) => void, error: (error: any) => void) {
            var authorization: string = XOMNIPrivateSDK.currentContext.username + ":" + XOMNIPrivateSDK.currentContext.password;
            $.ajax({
                type: "Get",
                url: currentContext.serviceUri + uri,
                contentType: "application/json",
                headers: {
                    "Authorization": btoa(authorization),
                    "Accept": "application/vnd.xomni.api-v3_0, */*"
                },
                success: (d, t, s) => {
                    success(<T>d);
                },
                error: (r, t, e) => {
                    error(t);
                }
            });
        }
    }

    export class ClientContext {
        constructor(public username: string, public password: string, public serviceUri: string) {
        }
        GetClientAnalyticsSummaryClient(): ClientSideAnalyticsLogSummaryClient {
            return new ClientSideAnalyticsLogSummaryClient();
        }
    }

    export class BaseAnalyticsCountSummary {
        TotalCount: number;
    }

    export class YearlyCountSummary extends BaseAnalyticsCountSummary {
        Year: number;
    }

    export class MonthlyCountSummary extends YearlyCountSummary {
        Month: number;
    }

    export class WeeklyCountSummary extends MonthlyCountSummary {
        WeekOfYear: number;
    }

    export class DailyCountSummary extends WeeklyCountSummary {
        Day: number;
    }

    export var currentContext: ClientContext;
}
