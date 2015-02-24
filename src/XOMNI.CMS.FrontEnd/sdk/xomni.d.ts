declare module Xomni.Private.Analytics.ClientCounters {
    class ClientCounterClient extends BaseClient {
        private clientCounterUri;
        public getClientCounterList(success: (result: ClientCounterListContainer) => void, error: (error: any) => void, continuationKey?: string): void;
    }
    interface ClientCounterListContainer {
        ContinuationToken: string;
        CounterNames: string[];
    }
}
declare module Xomni.Private.Analytics.ClientSideAnalyticsSummary {
    class ClientSideAnalyticsLogSummaryClient extends BaseClient {
        private weeklyLogSummaryUri;
        private dailyLogSummaryUri;
        private monthlyLogSummaryUri;
        private yearlyLogSummaryUri;
        public getDailyLogs(counterName: string, startOADate: number, endOADate: number, success: (result: DailyCountSummary[]) => void, error: (error: any) => void): void;
        public getWeeklyLogs(counterName: string, startOADate: number, endOADate: number, success: (result: WeeklyCountSummary[]) => void, error: (error: any) => void): void;
        public getMonthlyLogs(counterName: string, startOADate: number, endOADate: number, success: (result: MonthlyCountSummary[]) => void, error: (error: any) => void): void;
        public getYearlyLogs(counterName: string, startOADate: number, endOADate: number, success: (result: YearlyCountSummary[]) => void, error: (error: any) => void): void;
        private PrepareUri(baseUri, counterName, startOADate, endOADate);
        private ValidateParameters(counterName, startOADate, endOADate);
    }
    interface BaseAnalyticsCountSummary {
        TotalCount: number;
    }
    interface YearlyCountSummary extends BaseAnalyticsCountSummary {
        Year: number;
    }
    interface MonthlyCountSummary extends YearlyCountSummary {
        Month: number;
    }
    interface WeeklyCountSummary extends MonthlyCountSummary {
        WeekOfYear: number;
    }
    interface DailyCountSummary extends WeeklyCountSummary {
        Day: number;
    }
}
declare module Xomni {
    class HttpProvider {
        public get<T>(uri: string, success: (result: T) => void, error: (error: any) => void): void;
        public getCurrentClientContext(): ClientContext;
    }
    class BaseClient {
        public httpProvider: HttpProvider;
    }
    class ClientContext {
        public username: string;
        public password: string;
        public serviceUri: string;
        constructor(username: string, password: string, serviceUri: string);
    }
    var currentContext: ClientContext;
}
