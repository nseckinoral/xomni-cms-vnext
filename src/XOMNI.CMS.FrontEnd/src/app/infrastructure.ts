/// <amd-dependency path="jquery-cookie" />
/// <amd-dependency path="xomni" />

import $ = require("jquery");
import ko = require("knockout");
import dialog = require("models/dialog-content");

export module infrastructure {
    export var shouter = new ko.subscribable();
    export var showLoading = ko.observable<boolean>();

    $.ajaxSettings.beforeSend = (jqXHR: any, settings: JQueryAjaxSettings) => {
        if (settings.url.indexOf("xomni.com") > -1) {
            jqXHR.isXomni = true;
            showLoading(true);
        }
    }
    $.ajaxSettings.complete = (jqXHR: any) => {
        if (jqXHR.isXomni === true) {
            showLoading(false);
        }
    }

    showLoading.subscribe(t=> {
        shouter.notifySubscribers(t, "showLoading");
    });

    export class baseViewModel {
        public innerValidationErrors: KnockoutValidationErrors = undefined;
        public validationEnabled = ko.observable<boolean>(false);
        constructor() {
            var userInfo = this.getAuthenticatedUserInfo();
            var apiUrl = this.getApiUrl();
            Xomni.currentContext = new Xomni.ClientContext(userInfo.UserName, userInfo.Password, apiUrl);
        }

        public initValidation(element: any) {
            if (element) {
                this.innerValidationErrors = element;
                this.innerValidationErrors.showAllMessages(false);
            }
        }

        public changeValidationStatus(isEnabled: boolean) {
            this.innerValidationErrors.showAllMessages(isEnabled);
            this.validationEnabled(isEnabled);
        }

        public getValidationErrors(): string[] {
            var retVal: string[];
            if (this.validationEnabled()) {
                this.innerValidationErrors.showAllMessages(true);
                retVal = this.innerValidationErrors();
            }
            else {
                this.innerValidationErrors.showAllMessages(false);
                retVal = new Array<string>();
            }
            return retVal;
        }
        private getApiUrl() {
            var url: string;
            if (Configuration.AppSettings.IsDebug) {
                url = Configuration.AppSettings.XomniApiUrl;
            }
            else {
                url = location.protocol + '//' + location.hostname.replace('cmsvnext', 'api');
            }
            return url;
        }

        public getAuthenticatedUserInfo(): AuthenticatedUser {
            var user: AuthenticatedUser;
            if (Configuration.AppSettings.IsDebug) {
                user = {
                    UserName: Configuration.AppSettings.APIUsername,
                    Password: Configuration.AppSettings.APIPassword,
                    Identity: {
                        AuthenticationType: "Basic",
                        IsAuthenticated: true,
                        Name: Configuration.AppSettings.APIUsername,
                        Password: Configuration.AppSettings.APIPassword
                    },
                    Roles: new Array(Roles[Roles.ManagementAPI], Roles[Roles.PrivateAPI])
                };
            }
            else {
                $.cookie.json = true;
                var cookieName: string = location.hostname.replace('vnext', '') + 'SharedCMSCredentials';
                var cookie = $.cookie(cookieName);
                if (cookie === undefined) {
                    this.redirectToLoginPage();
                }
                user = <AuthenticatedUser>cookie;
            }
            return user;
        }

        private redirectToLoginPage() {
            var uri = this.getOldCMSUrl() + '/Login.aspx?ReturnUrl=' + location.href;
            window.location.href = uri;
        }

        public getOldCMSUrl(): string {
            return location.protocol + '//' + location.hostname.replace('vnext', '')
        }

        public userIsInRole(role: Roles): boolean {
            var user = this.getAuthenticatedUserInfo();
            return user.Roles.indexOf(Roles[role]) !== -1;
        }

        public showErrorDialog(error?: Models.ExceptionResult) {
            if (error) {
                shouter.notifySubscribers(<dialog.DialogContent>{
                    Body: this.createErrorMessage(error),
                    Title: dialog.ContentType[this.identifyErrorType(error)],
                    Type: this.identifyErrorType(error)
                }, "showDialog");
            }
            else {
                shouter.notifySubscribers(<dialog.DialogContent>{
                    Body: "An error occurred. Please try again.",
                    Title: "Error",
                    Type: dialog.ContentType.Error
                }, "showDialog");
            }
        }

        public showCustomErrorDialog(errorMessage: string) {
            shouter.notifySubscribers(<dialog.DialogContent>{
                Body: errorMessage,
                Title: "Error",
                Type: dialog.ContentType.Error
            }, "showDialog");
        }

        public showDialog(content: dialog.DialogContent) {
            shouter.notifySubscribers(content, "showDialog");
        }

        public createErrorMessage(error: Models.ExceptionResult) {
            var errorMessage = "{description}<br/><br/>Error Code: {errorCode}";
            errorMessage = errorMessage.replace("{errorCode}", error.IdentifierGuid);
            errorMessage = errorMessage.replace("{description}", error.FriendlyDescription);

            return errorMessage;
        }

        public identifyErrorType(error: Models.ExceptionResult) {
            var digit = error.HttpStatusCode.toString()[0];
            if (digit == '4') {
                return dialog.ContentType.Warning;
            }
            else if (digit == '5') {
                return dialog.ContentType.Error;
            }
        }
    }

    export interface AuthenticatedUser {
        Roles: string[];
        UserName: string;
        Password: string;
        Identity: CMSIdentity;
    }

    export interface CMSIdentity {
        Name: string;
        Password: string;
        IsAuthenticated: boolean;
        AuthenticationType: string;
    }

    export enum Roles {
        PrivateAPI,
        ManagementAPI
    }

    export class Configuration {
        public static AppSettings: AppSettings;
        private static isLoaded: boolean;
        public static loadAppSettings(callback: () => void) {
            $.ajax("appSettings.json", {
                async: true,
                success: (t, d) => {
                    this.AppSettings = <AppSettings>t;
                    callback();
                }
            });
        }
    }

    export interface AppSettings {
        BackendAPIURL: string;
        APIUsername: string;
        APIPassword: string;
        IsDebug: boolean;
        XomniApiUrl: string;
    }
}