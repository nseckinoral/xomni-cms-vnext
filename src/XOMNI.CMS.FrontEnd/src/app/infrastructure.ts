﻿/// <amd-dependency path="jquery-cookie" />
/// <amd-dependency path="xomni" />

import $ = require("jquery");
import ko = require("knockout");

export module infrastructure {
    export var shouter = new ko.subscribable();
    export var showLoading = ko.observable<boolean>();

    $.ajaxSettings.beforeSend = () => {
        showLoading(true);
    }
    $.ajaxSettings.complete = () => {
        showLoading(false);
    }

    showLoading.subscribe(t=> {
        shouter.notifySubscribers(t, "showLoading");
    });

    export class baseViewModel {
        constructor() {
            var userInfo = this.getAuthenticatedUserInfo();
            var apiUrl = this.getApiUrl();
            Xomni.currentContext = new Xomni.ClientContext(userInfo.UserName, userInfo.Password, apiUrl);
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

        public showCustomErrorDialog(errorText: string) {
            shouter.notifySubscribers(errorText, "showError");
        }

        public showErrorDialog() {
            shouter.notifySubscribers("An error occurred. Please try again.", "showError");
        }

        public createErrorMessage(error: Models.ExceptionResult) {
            var errorMessage = "{message}<br/><br/>{description} <br/>Error Code: {errorCode}";
            errorMessage = errorMessage.replace("{errorCode}", error.IdentifierGuid);
            errorMessage = errorMessage.replace("{description}", error.FriendlyDescription);
            var message = "";
            switch (error.HttpStatusCode) {
                case 400:
                    message = "Your client has issued a malformed or illegal request.";
                    break;
                case 401:
                    message = "Unauthorized.";
                    break;
                case 404:
                    message = "The resource you are looking for was not found.";
                    break;
                case 409:
                    message = "Resource already exists!";
                    break;
                case 500:
                    message = "The server encountered an error and could not complete your request.";
                    break;
                case 503:
                    message = "Service Unavailable!";
                    break;
                default:
                    message = "Something went wrong."
                    break;
            }
            errorMessage = errorMessage.replace("{message}", message);
            return errorMessage;
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