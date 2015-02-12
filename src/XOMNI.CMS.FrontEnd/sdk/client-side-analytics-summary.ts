/// <reference path="core.ts" />
module Xomni.Private.Analytics.ClientSideAnalyticsSummary {
    export class ClientSideAnalyticsLogSummaryClient extends BaseClient {
        private weeklyLogSummaryUri: string = '/private/analytics/clientcounters/{counterName}/summary/weekly?';
        private dailyLogSummaryUri: string = '/private/analytics/clientcounters/{counterName}/summary/daily?';
        private monthlyLogSummaryUri: string = '/private/analytics/clientcounters/{counterName}/summary/monthly?';
        private yearlyLogSummaryUri: string = '/private/analytics/clientcounters/{counterName}/summary/yearly?';

        getDailyLogs(counterName: string, startOADate: number, endOADate: number, success: (result: DailyCountSummary[]) => void, error: (error: any) => void) {
            var uri = this.PrepareUri(this.dailyLogSummaryUri, counterName, startOADate, endOADate);
            this.httpProvider.get(uri, success, error);
        }

        getWeeklyLogs(counterName: string, startOADate: number, endOADate: number, success: (result: WeeklyCountSummary[]) => void, error: (error: any) => void) {
            var uri = this.PrepareUri(this.weeklyLogSummaryUri, counterName, startOADate, endOADate);
            this.httpProvider.get(uri, success, error);
        }

        getMonthlyLogs(counterName: string, startOADate: number, endOADate: number, success: (result: MonthlyCountSummary[]) => void, error: (error: any) => void) {
            var uri = this.PrepareUri(this.monthlyLogSummaryUri, counterName, startOADate, endOADate);
            this.httpProvider.get(uri, success, error);
        }

        getYearlyLogs(counterName: string, startOADate: number, endOADate: number, success: (result: YearlyCountSummary[]) => void, error: (error: any) => void) {
            var uri = this.PrepareUri(this.yearlyLogSummaryUri, counterName, startOADate, endOADate);
            this.httpProvider.get(uri, success, error);
        }

        private PrepareUri(baseUri: string, counterName: string, startOADate: number, endOADate: number): string {
            var uri = baseUri.replace("{counterName}", counterName);
            return uri + "startOADate=" + startOADate + "&endOADate=" + endOADate;
        }
    }

    export interface BaseAnalyticsCountSummary {
        totalCount: number;
    }

    export interface YearlyCountSummary extends BaseAnalyticsCountSummary {
        year: number;
    }

    export interface MonthlyCountSummary extends YearlyCountSummary {
        month: number;
    }

    export interface WeeklyCountSummary extends MonthlyCountSummary {
        weekOfYear: number;
    }

    export interface DailyCountSummary extends WeeklyCountSummary {
        day: number;
    }
}
