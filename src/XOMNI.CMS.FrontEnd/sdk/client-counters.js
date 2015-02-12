var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Xomni;
(function (Xomni) {
    (function (Private) {
        (function (Analytics) {
            /// <reference path="core.ts" />
            (function (ClientCounters) {
                var ClientCounterClient = (function (_super) {
                    __extends(ClientCounterClient, _super);
                    function ClientCounterClient() {
                        _super.apply(this, arguments);
                        this.clientCounterUri = 'private/analytics/clientcounters';
                    }
                    ClientCounterClient.prototype.getClientCounterList = function (success, error, continuationKey) {
                        var uri = this.clientCounterUri;
                        if (continuationKey != undefined) {
                            uri = uri + '?continuationKey=' + continuationKey;
                        }
                        this.httpProvider.get(uri, success, error);
                    };
                    return ClientCounterClient;
                })(Xomni.BaseClient);
                ClientCounters.ClientCounterClient = ClientCounterClient;
            })(Analytics.ClientCounters || (Analytics.ClientCounters = {}));
            var ClientCounters = Analytics.ClientCounters;
        })(Private.Analytics || (Private.Analytics = {}));
        var Analytics = Private.Analytics;
    })(Xomni.Private || (Xomni.Private = {}));
    var Private = Xomni.Private;
})(Xomni || (Xomni = {}));
//# sourceMappingURL=client-counters.js.map
