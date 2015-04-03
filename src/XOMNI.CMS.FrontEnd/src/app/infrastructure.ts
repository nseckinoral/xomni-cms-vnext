/// <amd-dependency path="jquery-cookie" />
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
            Xomni.currentContext = new Xomni.ClientContext(userInfo.UserName, userInfo.Password, location.protocol + '//' + location.hostname.replace('cmsvnext', 'api'));
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
    }
}