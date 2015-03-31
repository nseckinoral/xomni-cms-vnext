declare module Xomni {
    class HttpProvider {
        public get<T>(uri: string, success: (result: T) => void, error: (error: Models.ExceptionResult) => void): void;
        public put<T>(uri: string, data: any, success: (result: T) => void, error: (error: Models.ExceptionResult) => void): void;
        public post<T>(uri: string, data: any, success: (result: T) => void, error: (error: Models.ExceptionResult) => void): void;
        public delete(uri: string, success: () => void, error: (error: Models.ExceptionResult) => void): void;
        private sendHttpRequest<T>(httpMethod, uri, success, error, data?);
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
declare module Xomni.Management.Configuration.ImageSizeProfile {
    class ImageSizeProfileClient extends BaseClient {
        private singleOperationBaseUrl;
        private listOperationBaseUrl;
        public getList(skip: number, take: number, success: (result: Models.PaginatedContainer<Models.Management.Configuration.ImageSizeProfile>) => void, error: (error: Models.ExceptionResult) => void): void;
        public get(imageSizeProfileId: number, success: (result: Models.Management.Configuration.ImageSizeProfile) => void, error: (error: Models.ExceptionResult) => void): void;
        public post(imageSizeProfile: Models.Management.Configuration.ImageSizeProfile, success: (result: Models.Management.Configuration.ImageSizeProfile) => void, error: (error: Models.ExceptionResult) => void): void;
        public delete(imageSizeProfileId: number, success: () => void, error: (error: Models.ExceptionResult) => void): void;
    }
}
declare module Xomni.Management.Configuration.Store {
    class StoreClient extends BaseClient {
        private singleOperationBaseUrl;
        private listOperationBaseUrl;
        public get(storeId: number, success: (result: Models.Management.Configuration.Store) => void, error: (error: Models.ExceptionResult) => void): void;
        public delete(storeId: number, success: () => void, error: (error: Models.ExceptionResult) => void): void;
        public post(store: Models.Management.Configuration.Store, success: (result: Models.Management.Configuration.Store) => void, error: (error: Models.ExceptionResult) => void): void;
        public put(store: Models.Management.Configuration.Store, success: (result: Models.Management.Configuration.Store) => void, error: (error: Models.ExceptionResult) => void): void;
        public getList(skip: number, take: number, success: (result: Models.PaginatedContainer<Models.Management.Configuration.Store>) => void, error: (error: Models.ExceptionResult) => void): void;
    }
}
declare module Xomni.Management.Configuration.Settings {
    class SettingsClient extends BaseClient {
        private uri;
        public put(settings: Models.Management.Configuration.Settings, success: (result: Models.Management.Configuration.Settings) => void, error: (error: Models.ExceptionResult) => void): void;
        public get(success: (result: Models.Management.Configuration.Settings) => void, error: (error: Models.ExceptionResult) => void): void;
    }
}
declare module Xomni {
    class Dictionary<K, V> {
        private keyArray;
        private valueArray;
        constructor(init?: {
            key: K;
            value: V;
        }[]);
        public add(key: K, value: V): void;
        public remove(key: K): void;
        public keys(): K[];
        public values(): V[];
        public containsKey(key: K): boolean;
    }
}
declare module Xomni.Management.Configuration.TrendingActionTypes {
    class TrendingActionTypesClient extends BaseClient {
        private uri;
        public put(actionTypes: Models.Management.Configuration.TrendingActionTypeValue[], success: (result: Models.Management.Configuration.TrendingActionTypeValue[]) => void, error: (error: Models.ExceptionResult) => void): void;
        public get(success: (result: Models.Management.Configuration.TrendingActionTypeValue[]) => void, error: (error: Models.ExceptionResult) => void): void;
    }
}
declare module Models.Management.Integration {
    enum EndpointStatusType {
        InProgress = 1,
        Succeeded = 2,
        Failed = 3,
    }
}
declare module Models.Management.Integration {
    interface EndpointDetail {
        ServiceName: string;
        ManagementPortalUrl: string;
        Status: EndpointStatusType;
    }
}
declare module Xomni.Management.Integration.Endpoint {
    class EndpointClient extends BaseClient {
        private uri;
        public get(success: (result: Models.Management.Integration.EndpointDetail) => void, error: (error: Models.ExceptionResult) => void): void;
        public post(endpointCreateRequest: Models.Management.Integration.EndpointCreateRequest, success: () => void, error: (error: Models.ExceptionResult) => void): void;
        public delete(success: () => void, error: (error: Models.ExceptionResult) => void): void;
    }
}
declare module Xomni.Management.Security.License {
    class LicenseClient extends BaseClient {
        private singleOperationBaseUrl;
        private listOperationBaseUrl;
        private auditBaseUrl;
        public get(licenseId: number, success: (result: Models.Management.Security.License) => void, error: (error: Models.ExceptionResult) => void): void;
        public getList(skip: number, take: number, success: (result: Models.PaginatedContainer<Models.Management.Security.License>) => void, error: (error: Models.ExceptionResult) => void): void;
        public post(license: Models.Management.Security.License, success: (result: Models.Management.Security.License) => void, error: (error: Models.ExceptionResult) => void): void;
        public put(license: Models.Management.Security.License, success: (result: Models.Management.Security.License) => void, error: (error: Models.ExceptionResult) => void): void;
        public delete(licenseId: number, success: () => void, error: (error: Models.ExceptionResult) => void): void;
        public getAuditLogs(skip: number, take: number, success: (result: Models.PaginatedContainer<Models.Management.Security.LicenseAuditLogs>) => void, error: (error: Models.ExceptionResult) => void): void;
        public getUnassignedLicenses(onlyUnassignedUsers: boolean, success: (result: Models.PaginatedContainer<Models.Management.Security.License>) => void, error: (error: Models.ExceptionResult) => void): void;
    }
}
declare module Models {
    interface ExceptionResult {
        IdentifierGuid: string;
        IdentifierTick: number;
        FriendlyDescription: string;
        HttpStatusCode: number;
    }
}
declare module Models.Management.Configuration {
    interface ImageSizeProfile {
        Id: number;
        Height: number;
        Width: number;
    }
}
declare module Models.Management.Configuration {
    interface Licenses {
        Id: number;
        Username: string;
        Name: string;
        Password: string;
        StoreId: number;
    }
}
declare module Models.Management.Configuration {
    interface Location {
        Longitude: number;
        Latitude: number;
    }
}
declare module Models.Management.Configuration {
    interface Store {
        Id: number;
        Name: string;
        Description: string;
        Address: string;
        Location: Location;
        Licenses: Licenses[];
    }
}
declare module Models.Management.Configuration {
    enum FacebookDisplayType {
        Page = 0,
        Popup = 1,
        Touch = 2,
    }
}
declare module Models.Management.Configuration {
    interface Settings {
        FacebookDisplayType: FacebookDisplayType;
        FacebookApplicationId: string;
        FacebookRedirectUri: string;
        FacebookApplicationSecretKey: string;
        IsCDNEnabled: boolean;
        CDNUrl: string;
        CacheExpirationTime: number;
        IsPassbookEnabled: boolean;
        PassbookPassTypeIdentifier: string;
        PassbookWWDRCACertificateTenantAssetId: string;
        PassbookCertificateTenantAssetId: string;
        PassbookCertificatePassword: string;
        PassbookTeamIdentifier: string;
        PassbookOrganizationName: string;
        PopularityTimeImpactValue: number;
        SearchIndexingEnabled: boolean;
        TwitterConsumerKey: string;
        TwitterConsumerKeySecret: string;
        TwitterRedirectUri: string;
    }
}
declare module Models.Management.Configuration {
    interface TrendingActionTypeValue {
        Id: number;
        Description: string;
        ImpactValue: number;
    }
}
declare module Models.Management.Integration {
    interface EndpointCreateRequest {
        AdminMail: string;
        ServiceName: string;
        ServiceTier: ServiceTierType;
    }
}
declare module Models.Management.Integration {
    enum ServiceTierType {
        Developer = 0,
        Standart = 1,
        Premium = 2,
    }
}
declare module Xomni.Management.Security.PrivateApiUser {
    class PrivateApiUserClient extends BaseClient {
        private listOperationBaseUrl;
        private singleOperationBaseUrl;
        public getList(skip: number, take: number, success: (result: Models.PaginatedContainer<Models.Management.Security.ApiUser>) => void, error: (error: Models.ExceptionResult) => void): void;
        public get(privateApiUserId: number, success: (result: Models.Management.Security.ApiUser) => void, error: (error: Models.ExceptionResult) => void): void;
        public delete(privateApiUserId: number, success: () => void, error: (error: Models.ExceptionResult) => void): void;
        public post(privateApiUser: Models.Management.Security.ApiUser, success: (result: Models.Management.Security.ApiUser) => void, error: (error: Models.ExceptionResult) => void): void;
        public put(privateApiUser: Models.Management.Security.ApiUser, success: (result: Models.Management.Security.ApiUser) => void, error: (error: Models.ExceptionResult) => void): void;
    }
}
declare module Models.Management.Security {
    interface ApiUserRights {
        Id: number;
        Description: string;
    }
}
declare module Models.Management.Security {
    interface ApiUser {
        Id: number;
        Username: string;
        Name: string;
        Password: string;
        StoreId: number;
        Rights: ApiUserRights[];
    }
}
declare module Models.Management.Security {
    interface LicenseAuditLogs {
        Username: string;
        Name: string;
        CreatedAt: Date;
        DeletedAt: Date;
        CreatedApiUserName: string;
        DeletedApiUserName: string;
    }
}
declare module Models.Management.Security {
    interface License {
        Id: number;
        Username: string;
        Name: string;
        Password: string;
        StoreId: number;
    }
}
declare module Models {
    interface PaginatedContainer<T> {
        Results: T[];
        TotalCount: number;
    }
}
declare module Models.Private.Analytics {
    interface BaseAnalyticsCountSummary {
        TotalCount: number;
    }
}
declare module Models.Private.Analytics {
    interface ClientCounterListContainer {
        ContinuationToken: string;
        CounterNames: string[];
    }
}
declare module Models.Private.Analytics {
    interface DailyCountSummary extends WeeklyCountSummary {
        Day: number;
    }
}
declare module Models.Private.Analytics {
    interface MonthlyCountSummary extends YearlyCountSummary {
        Month: number;
    }
}
declare module Models.Private.Analytics {
    interface WeeklyCountSummary extends MonthlyCountSummary {
        WeekOfYear: number;
    }
}
declare module Models.Private.Analytics {
    interface YearlyCountSummary extends BaseAnalyticsCountSummary {
        Year: number;
    }
}
declare module Xomni.Private.Analytics.ClientCounters {
    class ClientCounterClient extends BaseClient {
        private clientCounterUri;
        public get(success: (result: Models.Private.Analytics.ClientCounterListContainer) => void, error: (error: Models.ExceptionResult) => void, continuationKey?: string): void;
    }
}
declare module Xomni.Private.Analytics.ClientSideAnalyticsSummary {
    class ClientSideAnalyticsLogSummaryClient extends BaseClient {
        private weeklyLogSummaryUri;
        private dailyLogSummaryUri;
        private monthlyLogSummaryUri;
        private yearlyLogSummaryUri;
        public getDailyLogs(counterName: string, startOADate: number, endOADate: number, success: (result: Models.Private.Analytics.DailyCountSummary[]) => void, error: (error: Models.ExceptionResult) => void): void;
        public getWeeklyLogs(counterName: string, startOADate: number, endOADate: number, success: (result: Models.Private.Analytics.WeeklyCountSummary[]) => void, error: (error: Models.ExceptionResult) => void): void;
        public getMonthlyLogs(counterName: string, startOADate: number, endOADate: number, success: (result: Models.Private.Analytics.MonthlyCountSummary[]) => void, error: (error: Models.ExceptionResult) => void): void;
        public getYearlyLogs(counterName: string, startOADate: number, endOADate: number, success: (result: Models.Private.Analytics.YearlyCountSummary[]) => void, error: (error: Models.ExceptionResult) => void): void;
        private PrepareUri(baseUri, counterName, startOADate, endOADate);
    }
}
declare module Xomni.Management.Social.Facebook {
    class FacebookClient extends BaseClient {
        private uri;
        public get(success: (result: Dictionary<string, string>) => void, error: (error: Models.ExceptionResult) => void): void;
        private convertToDictionary(types);
    }
}
declare module Xomni.Utils {
    class UrlGenerator {
        static PrepareOperationUrl(baseUrl: string, additionalQueryString: string): string;
        static PrepareOperationUrlWithMultipleParameter(baseUrl: string, additionalQueryString: Dictionary<string, string>): string;
        static ReplaceUri(baseUri: string, oldStringPattern: string, newStringPattern: string): string;
    }
}
declare module Xomni.Utils {
    class Validator {
        static isDefined(argName: string, argValue: any): void;
        static isGreaterThanOrEqual(argName: string, argValue: number, bound: number): void;
        static isLessThan(minValue: number, minParameterName: string, maxValue: number, maxParameterName?: string): void;
    }
}
