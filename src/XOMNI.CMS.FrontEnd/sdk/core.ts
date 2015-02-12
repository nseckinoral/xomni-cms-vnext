module Xomni {
    export class HttpProvider {
        get<T>(uri: string, success: (result: T) => void, error: (error: any) => void) {
            var currentClientContext = this.getCurrentClientContext();
            var authorization: string = currentClientContext.username + ":" + currentClientContext.password;
            $.ajax({
                type: "Get",
                url: currentClientContext.serviceUri + uri,
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

        getCurrentClientContext(): ClientContext {
            if (currentContext === undefined || currentContext.username === undefined || currentContext.serviceUri === undefined || currentContext.password === undefined) {
                throw 'API credential did not set.';
            }
            else {
                return currentContext;
            }
        }
    }

    export class BaseClient {
        httpProvider: HttpProvider = new HttpProvider();
    }
    export class ClientContext {
        constructor(public username: string, public password: string, public serviceUri: string) {
        }
    }
    export var currentContext: ClientContext;
}