/// <amd-dependency path="jquery-cookie" />
/// <amd-dependency path="xomni" />
import $ = require("jquery");

export module infrastructure {
    export class baseViewModel {
        constructor() {
            var userInfo = this.getAuthenticatedUserInfo();
            Xomni.currentContext = new Xomni.ClientContext(userInfo.UserName, userInfo.Password, location.protocol + '//' + location.hostname.replace('cmsvnext', 'api'));
        }
        public getAuthenticatedUserInfo(): AuthenticatedUser {
            $.cookie.json = true;
            var cookieName: string = location.hostname.replace('vnext', '') + 'SharedCMSCredentials';
            var cookie = $.cookie(cookieName);
            if (cookie === undefined) {
                this.redirectToLoginPage();
            }
            return <AuthenticatedUser>cookie;
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
            console.log(Roles[role]);
            return user.Roles.indexOf(Roles[role]) !== -1;
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
}