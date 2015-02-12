var Xomni;
(function (Xomni) {
    var HttpProvider = (function () {
        function HttpProvider() {
        }
        HttpProvider.prototype.get = function (uri, success, error) {
            var currentClientContext = this.getCurrentClientContext();
            var authorization = currentClientContext.username + ":" + currentClientContext.password;
            $.ajax({
                type: "Get",
                url: currentClientContext.serviceUri + uri,
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

        HttpProvider.prototype.getCurrentClientContext = function () {
            if (Xomni.currentContext === undefined || Xomni.currentContext.username === undefined || Xomni.currentContext.serviceUri === undefined || Xomni.currentContext.password === undefined) {
                throw 'API credential did not set.';
            } else {
                return Xomni.currentContext;
            }
        };
        return HttpProvider;
    })();
    Xomni.HttpProvider = HttpProvider;

    var BaseClient = (function () {
        function BaseClient() {
            this.httpProvider = new HttpProvider();
        }
        return BaseClient;
    })();
    Xomni.BaseClient = BaseClient;
    var ClientContext = (function () {
        function ClientContext(username, password, serviceUri) {
            this.username = username;
            this.password = password;
            this.serviceUri = serviceUri;
        }
        return ClientContext;
    })();
    Xomni.ClientContext = ClientContext;
    Xomni.currentContext;
})(Xomni || (Xomni = {}));
//# sourceMappingURL=core.js.map
