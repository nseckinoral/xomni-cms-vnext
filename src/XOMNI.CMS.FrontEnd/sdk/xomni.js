var Xomni;
(function (Xomni) {
    var HttpProvider = (function () {
        function HttpProvider() {
        }
        HttpProvider.prototype.get = function (uri, success, error) {
            this.sendHttpRequest(0 /* Get */, uri, success, error);
        };

        HttpProvider.prototype.put = function (uri, data, success, error) {
            this.sendHttpRequest(2 /* Put */, uri, success, error, data);
        };

        HttpProvider.prototype.post = function (uri, data, success, error) {
            this.sendHttpRequest(1 /* Post */, uri, success, error, data);
        };

        HttpProvider.prototype.delete = function (uri, success, error) {
            this.sendHttpRequest(4 /* Delete */, uri, success, error);
        };

        HttpProvider.prototype.sendHttpRequest = function (httpMethod, uri, success, error, data) {
            var currentClientContext = this.getCurrentClientContext();
            var authorization = currentClientContext.username + ":" + currentClientContext.password;
            $.ajax({
                type: HttpMethod[httpMethod],
                url: currentClientContext.serviceUri + uri,
                contentType: "application/json",
                data: data,
                headers: {
                    "Authorization": "Basic " + btoa(authorization),
                    "Accept": "application/vnd.xomni.api-v3_1, */*"
                },
                success: function (d, t, s) {
                    success(d);
                },
                error: function (r, t, e) {
                    var exception = JSON.parse(r.responseText);
                    exception.HttpStatusCode = r.status;
                    error(exception);
                }
            });
        };

        HttpProvider.prototype.getCurrentClientContext = function () {
            if (Xomni.currentContext == null) {
                throw new Error("Client context could not be null.");
            } else {
                return Xomni.currentContext;
            }
        };
        return HttpProvider;
    })();
    Xomni.HttpProvider = HttpProvider;

    var HttpMethod;
    (function (HttpMethod) {
        HttpMethod[HttpMethod["Get"] = 0] = "Get";
        HttpMethod[HttpMethod["Post"] = 1] = "Post";
        HttpMethod[HttpMethod["Put"] = 2] = "Put";
        HttpMethod[HttpMethod["Patch"] = 3] = "Patch";
        HttpMethod[HttpMethod["Delete"] = 4] = "Delete";
    })(HttpMethod || (HttpMethod = {}));
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
            if (!username) {
                throw new Error("username could not be null or empty.");
            }
            if (!password) {
                throw new Error("password could not be null or empty.");
            }
            if (!serviceUri) {
                throw new Error("serviceUri could not be null or empty.");
            }
        }
        return ClientContext;
    })();
    Xomni.ClientContext = ClientContext;
    Xomni.currentContext;
})(Xomni || (Xomni = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Xomni;
(function (Xomni) {
    (function (Management) {
        (function (Configuration) {
            (function (Store) {
                var StoreClient = (function (_super) {
                    __extends(StoreClient, _super);
                    function StoreClient() {
                        _super.apply(this, arguments);
                        this.singleOperationBaseUrl = "/management/configuration/store/";
                        this.listOperationBaseUrl = "/management/configuration/stores";
                    }
                    StoreClient.prototype.get = function (storeId, success, error) {
                        this.ValidateStoreId(storeId);
                        var uri = this.PrepareSingleOperationUrl(storeId);
                        this.httpProvider.get(uri, success, error);
                    };

                    StoreClient.prototype.delete = function (storeId, success, error) {
                        this.ValidateStoreId(storeId);
                        var uri = this.PrepareSingleOperationUrl(storeId);
                        this.httpProvider.delete(uri, success, error);
                    };

                    StoreClient.prototype.post = function (store, success, error) {
                        if (!store.Name) {
                            throw new Error("name could not be null or empty.");
                        }
                        this.httpProvider.post(this.singleOperationBaseUrl, store, success, error);
                    };

                    StoreClient.prototype.put = function (store, success, error) {
                        this.ValidateStoreId(store.Id);
                        if (!store.Name) {
                            throw new Error("name could not be null or empty.");
                        }
                        this.httpProvider.put(this.singleOperationBaseUrl, store, success, error);
                    };

                    StoreClient.prototype.getList = function (skip, take, success, error) {
                        this.ValidateSkipTake(skip, take);
                        var uri = this.PrepareListOperationUrl(skip, take);
                        this.httpProvider.get(uri, success, error);
                    };

                    StoreClient.prototype.PrepareSingleOperationUrl = function (storeId) {
                        return this.singleOperationBaseUrl + storeId;
                    };

                    StoreClient.prototype.PrepareListOperationUrl = function (skip, take) {
                        return this.listOperationBaseUrl + "?skip=" + skip + "&take=" + take;
                    };

                    StoreClient.prototype.ValidateStoreId = function (storeId) {
                        if (storeId != 0 && !storeId) {
                            throw new Error("storeId could not be null or empty.");
                        }
                        if (storeId < 0) {
                            throw new Error("storeId could not be less than 0.");
                        }
                    };

                    StoreClient.prototype.ValidateSkipTake = function (skip, take) {
                        if (skip != 0 && !skip) {
                            throw new Error("skip could not be null or empty.");
                        }
                        if (skip < 0) {
                            throw new Error("skip could not be less than 0.");
                        }
                        if (take != 0 && !take) {
                            throw new Error("take could not be null or empty.");
                        }
                        if (take < 1) {
                            throw new Error("take could not be less than 1.");
                        }
                    };
                    return StoreClient;
                })(Xomni.BaseClient);
                Store.StoreClient = StoreClient;
            })(Configuration.Store || (Configuration.Store = {}));
            var Store = Configuration.Store;
        })(Management.Configuration || (Management.Configuration = {}));
        var Configuration = Management.Configuration;
    })(Xomni.Management || (Xomni.Management = {}));
    var Management = Xomni.Management;
})(Xomni || (Xomni = {}));
var Models;
(function (Models) {
    (function (Management) {
        (function (Configuration) {
            (function (FacebookDisplayType) {
                FacebookDisplayType[FacebookDisplayType["Page"] = 0] = "Page";
                FacebookDisplayType[FacebookDisplayType["Popup"] = 1] = "Popup";
                FacebookDisplayType[FacebookDisplayType["Touch"] = 2] = "Touch";
            })(Configuration.FacebookDisplayType || (Configuration.FacebookDisplayType = {}));
            var FacebookDisplayType = Configuration.FacebookDisplayType;
        })(Management.Configuration || (Management.Configuration = {}));
        var Configuration = Management.Configuration;
    })(Models.Management || (Models.Management = {}));
    var Management = Models.Management;
})(Models || (Models = {}));
;
var Xomni;
(function (Xomni) {
    (function (Management) {
        (function (Configuration) {
            (function (Settings) {
                var SettingsClient = (function (_super) {
                    __extends(SettingsClient, _super);
                    function SettingsClient() {
                        _super.apply(this, arguments);
                        this.uri = "/management/configuration/settings";
                    }
                    SettingsClient.prototype.put = function (settings, success, error) {
                        if (settings.PassbookCertificatePassword && settings.PassbookCertificatePassword.length > 250) {
                            throw new Error("Length of PassbookCertificatePassword must be lower than or equal to 250 character.");
                        }
                        if (settings.PassbookTeamIdentifier && settings.PassbookTeamIdentifier.length > 250) {
                            throw new Error("Length of PassbookTeamIdentifier must be lower than or equal to 250 character.");
                        }
                        if (settings.PassbookOrganizationName && settings.PassbookOrganizationName.length > 250) {
                            throw new Error("Length of PassbookOrganizationName must be lower than or equal to 250 character.");
                        }
                        this.httpProvider.put(this.uri, settings, success, error);
                    };

                    SettingsClient.prototype.get = function (success, error) {
                        this.httpProvider.get(this.uri, success, error);
                    };
                    return SettingsClient;
                })(Xomni.BaseClient);
                Settings.SettingsClient = SettingsClient;
            })(Configuration.Settings || (Configuration.Settings = {}));
            var Settings = Configuration.Settings;
        })(Management.Configuration || (Management.Configuration = {}));
        var Configuration = Management.Configuration;
    })(Xomni.Management || (Xomni.Management = {}));
    var Management = Xomni.Management;
})(Xomni || (Xomni = {}));
var Xomni;
(function (Xomni) {
    var Dictionary = (function () {
        function Dictionary(init) {
            this.keyArray = [];
            this.valueArray = [];
            if (init) {
                for (var i = 0; i < init.length; i++) {
                    this.keyArray.push(init[i].key);
                    this.valueArray.push(init[i].value);
                }
            }
        }
        Dictionary.prototype.add = function (key, value) {
            this.keyArray.push(key);
            this.valueArray.push(value);
        };

        Dictionary.prototype.remove = function (key) {
            var index = this.keyArray.indexOf(key, 0);
            this.keyArray.splice(index, 1);
            this.valueArray.splice(index, 1);
        };

        Dictionary.prototype.keys = function () {
            return this.keyArray;
        };

        Dictionary.prototype.values = function () {
            return this.valueArray;
        };

        Dictionary.prototype.containsKey = function (key) {
            if (this.keyArray.indexOf(key) === undefined) {
                return false;
            }
            return true;
        };
        return Dictionary;
    })();
    Xomni.Dictionary = Dictionary;
})(Xomni || (Xomni = {}));
var Xomni;
(function (Xomni) {
    (function (Management) {
        (function (Configuration) {
            (function (TrendingActionTypes) {
                var TrendingActionTypesClient = (function (_super) {
                    __extends(TrendingActionTypesClient, _super);
                    function TrendingActionTypesClient() {
                        _super.apply(this, arguments);
                        this.uri = "/management/configuration/tenantactiontypes";
                    }
                    TrendingActionTypesClient.prototype.put = function (actionTypes, success, error) {
                        this.httpProvider.put(this.uri, actionTypes, success, error);
                    };

                    TrendingActionTypesClient.prototype.get = function (success, error) {
                        this.httpProvider.get(this.uri, success, error);
                    };
                    return TrendingActionTypesClient;
                })(Xomni.BaseClient);
                TrendingActionTypes.TrendingActionTypesClient = TrendingActionTypesClient;
            })(Configuration.TrendingActionTypes || (Configuration.TrendingActionTypes = {}));
            var TrendingActionTypes = Configuration.TrendingActionTypes;
        })(Management.Configuration || (Management.Configuration = {}));
        var Configuration = Management.Configuration;
    })(Xomni.Management || (Xomni.Management = {}));
    var Management = Xomni.Management;
})(Xomni || (Xomni = {}));
var Models;
(function (Models) {
    (function (Management) {
        (function (Integration) {
            (function (EndpointStatusType) {
                EndpointStatusType[EndpointStatusType["InProgress"] = 1] = "InProgress";
                EndpointStatusType[EndpointStatusType["Succeeded"] = 2] = "Succeeded";
                EndpointStatusType[EndpointStatusType["Failed"] = 3] = "Failed";
            })(Integration.EndpointStatusType || (Integration.EndpointStatusType = {}));
            var EndpointStatusType = Integration.EndpointStatusType;
        })(Management.Integration || (Management.Integration = {}));
        var Integration = Management.Integration;
    })(Models.Management || (Models.Management = {}));
    var Management = Models.Management;
})(Models || (Models = {}));
;
var Xomni;
(function (Xomni) {
    (function (Management) {
        (function (Integration) {
            (function (Endpoint) {
                var EndpointClient = (function (_super) {
                    __extends(EndpointClient, _super);
                    function EndpointClient() {
                        _super.apply(this, arguments);
                        this.uri = "/management/integration/endpoint";
                    }
                    EndpointClient.prototype.get = function (success, error) {
                        this.httpProvider.get(this.uri, success, error);
                    };

                    EndpointClient.prototype.post = function (endpointCreateRequest, success, error) {
                        if (!endpointCreateRequest.AdminMail) {
                            throw new Error("AdminMail could not be null or empty.");
                        }

                        if (!endpointCreateRequest.ServiceName) {
                            throw new Error("ServiceName could not be null or empty.");
                        }

                        this.httpProvider.post(this.uri, endpointCreateRequest, function (t) {
                            success();
                        }, error);
                    };

                    EndpointClient.prototype.delete = function (success, error) {
                        this.httpProvider.delete(this.uri, success, error);
                    };
                    return EndpointClient;
                })(Xomni.BaseClient);
                Endpoint.EndpointClient = EndpointClient;
            })(Integration.Endpoint || (Integration.Endpoint = {}));
            var Endpoint = Integration.Endpoint;
        })(Management.Integration || (Management.Integration = {}));
        var Integration = Management.Integration;
    })(Xomni.Management || (Xomni.Management = {}));
    var Management = Xomni.Management;
})(Xomni || (Xomni = {}));
var Models;
(function (Models) {
    (function (Management) {
        (function (Integration) {
            (function (ServiceTierType) {
                ServiceTierType[ServiceTierType["Developer"] = 0] = "Developer";
                ServiceTierType[ServiceTierType["Standart"] = 1] = "Standart";
                ServiceTierType[ServiceTierType["Premium"] = 2] = "Premium";
            })(Integration.ServiceTierType || (Integration.ServiceTierType = {}));
            var ServiceTierType = Integration.ServiceTierType;
        })(Management.Integration || (Management.Integration = {}));
        var Integration = Management.Integration;
    })(Models.Management || (Models.Management = {}));
    var Management = Models.Management;
})(Models || (Models = {}));
;
var Xomni;
(function (Xomni) {
    (function (Private) {
        (function (Analytics) {
            (function (ClientCounters) {
                var ClientCounterClient = (function (_super) {
                    __extends(ClientCounterClient, _super);
                    function ClientCounterClient() {
                        _super.apply(this, arguments);
                        this.clientCounterUri = '/private/analytics/clientcounters';
                    }
                    ClientCounterClient.prototype.get = function (success, error, continuationKey) {
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
var Xomni;
(function (Xomni) {
    (function (Private) {
        (function (Analytics) {
            (function (ClientSideAnalyticsSummary) {
                var ClientSideAnalyticsLogSummaryClient = (function (_super) {
                    __extends(ClientSideAnalyticsLogSummaryClient, _super);
                    function ClientSideAnalyticsLogSummaryClient() {
                        _super.apply(this, arguments);
                        this.weeklyLogSummaryUri = '/private/analytics/clientcounters/{counterName}/summary/weekly?';
                        this.dailyLogSummaryUri = '/private/analytics/clientcounters/{counterName}/summary/daily?';
                        this.monthlyLogSummaryUri = '/private/analytics/clientcounters/{counterName}/summary/monthly?';
                        this.yearlyLogSummaryUri = '/private/analytics/clientcounters/{counterName}/summary/yearly?';
                    }
                    ClientSideAnalyticsLogSummaryClient.prototype.getDailyLogs = function (counterName, startOADate, endOADate, success, error) {
                        this.ValidateParameters(counterName, startOADate, endOADate);
                        var uri = this.PrepareUri(this.dailyLogSummaryUri, counterName, startOADate, endOADate);
                        this.httpProvider.get(uri, success, error);
                    };

                    ClientSideAnalyticsLogSummaryClient.prototype.getWeeklyLogs = function (counterName, startOADate, endOADate, success, error) {
                        this.ValidateParameters(counterName, startOADate, endOADate);
                        var uri = this.PrepareUri(this.weeklyLogSummaryUri, counterName, startOADate, endOADate);
                        this.httpProvider.get(uri, success, error);
                    };

                    ClientSideAnalyticsLogSummaryClient.prototype.getMonthlyLogs = function (counterName, startOADate, endOADate, success, error) {
                        this.ValidateParameters(counterName, startOADate, endOADate);
                        var uri = this.PrepareUri(this.monthlyLogSummaryUri, counterName, startOADate, endOADate);
                        this.httpProvider.get(uri, success, error);
                    };

                    ClientSideAnalyticsLogSummaryClient.prototype.getYearlyLogs = function (counterName, startOADate, endOADate, success, error) {
                        this.ValidateParameters(counterName, startOADate, endOADate);
                        var uri = this.PrepareUri(this.yearlyLogSummaryUri, counterName, startOADate, endOADate);
                        this.httpProvider.get(uri, success, error);
                    };

                    ClientSideAnalyticsLogSummaryClient.prototype.PrepareUri = function (baseUri, counterName, startOADate, endOADate) {
                        var uri = baseUri.replace("{counterName}", counterName);
                        return uri + "startOADate=" + startOADate + "&endOADate=" + endOADate;
                    };

                    ClientSideAnalyticsLogSummaryClient.prototype.ValidateParameters = function (counterName, startOADate, endOADate) {
                        if (!counterName) {
                            throw new Error("counterName could not be null or empty");
                        }

                        if (startOADate < 1) {
                            throw new Error("startOADate could not be less than 1");
                        }

                        if (endOADate < 1) {
                            throw new Error("endOADate could not be less than 1");
                        }

                        if (endOADate < startOADate) {
                            throw new Error("startOADate could not be greater than endOADate");
                        }
                    };
                    return ClientSideAnalyticsLogSummaryClient;
                })(Xomni.BaseClient);
                ClientSideAnalyticsSummary.ClientSideAnalyticsLogSummaryClient = ClientSideAnalyticsLogSummaryClient;
            })(Analytics.ClientSideAnalyticsSummary || (Analytics.ClientSideAnalyticsSummary = {}));
            var ClientSideAnalyticsSummary = Analytics.ClientSideAnalyticsSummary;
        })(Private.Analytics || (Private.Analytics = {}));
        var Analytics = Private.Analytics;
    })(Xomni.Private || (Xomni.Private = {}));
    var Private = Xomni.Private;
})(Xomni || (Xomni = {}));
var Xomni;
(function (Xomni) {
    (function (Management) {
        (function (Social) {
            (function (Facebook) {
                var FacebookClient = (function (_super) {
                    __extends(FacebookClient, _super);
                    function FacebookClient() {
                        _super.apply(this, arguments);
                        this.uri = "/management/social/facebookdisplaytypes";
                    }
                    FacebookClient.prototype.get = function (success, error) {
                        var _this = this;
                        this.httpProvider.get(this.uri, function (types) {
                            var dict = _this.convertToDictionary(types);
                            success(dict);
                        }, error);
                    };

                    FacebookClient.prototype.convertToDictionary = function (types) {
                        var dict = new Xomni.Dictionary();
                        for (var key in types) {
                            if (types.hasOwnProperty(key)) {
                                dict.add(key, types[key]);
                            }
                        }
                        return dict;
                    };
                    return FacebookClient;
                })(Xomni.BaseClient);
                Facebook.FacebookClient = FacebookClient;
            })(Social.Facebook || (Social.Facebook = {}));
            var Facebook = Social.Facebook;
        })(Management.Social || (Management.Social = {}));
        var Social = Management.Social;
    })(Xomni.Management || (Xomni.Management = {}));
    var Management = Xomni.Management;
})(Xomni || (Xomni = {}));
//# sourceMappingURL=xomni.js.map
