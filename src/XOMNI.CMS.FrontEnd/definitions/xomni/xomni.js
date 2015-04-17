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
                data: JSON.stringify(data),
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
        (function (Company) {
            (function (DeviceMetadata) {
                var DeviceMetadataClient = (function (_super) {
                    __extends(DeviceMetadataClient, _super);
                    function DeviceMetadataClient() {
                        _super.apply(this, arguments);
                        this.baseUri = "/management/company/licences/{licenceId}/devices/{deviceId}/metadata/";
                    }
                    DeviceMetadataClient.prototype.post = function (licenceId, deviceId, metadata, success, error) {
                        this.validateLicenceIdAndDeviceId(licenceId, deviceId);
                        this.validateMetadata(metadata);
                        var uri = Xomni.Utils.UrlGenerator.ReplaceUri(this.baseUri, new Xomni.Dictionary([
                            { key: "{licenceId}", value: licenceId.toString() },
                            { key: "{deviceId}", value: deviceId }
                        ]));

                        this.httpProvider.post(uri, metadata, success, error);
                    };

                    DeviceMetadataClient.prototype.put = function (licenceId, deviceId, metadata, success, error) {
                        this.validateLicenceIdAndDeviceId(licenceId, deviceId);
                        this.validateMetadata(metadata);
                        var uri = Xomni.Utils.UrlGenerator.ReplaceUri(this.baseUri, new Xomni.Dictionary([
                            { key: "{licenceId}", value: licenceId.toString() },
                            { key: "{deviceId}", value: deviceId }
                        ]));

                        this.httpProvider.put(uri, metadata, success, error);
                    };

                    DeviceMetadataClient.prototype.delete = function (licenceId, deviceId, metadataKey, success, error) {
                        this.validateLicenceIdAndDeviceId(licenceId, deviceId);
                        Xomni.Utils.Validator.isDefined("metadataKey", metadataKey);
                        var uri = Xomni.Utils.UrlGenerator.ReplaceUri(this.baseUri, new Xomni.Dictionary([
                            { key: "{licenceId}", value: licenceId.toString() },
                            { key: "{deviceId}", value: deviceId }
                        ]));
                        uri = Xomni.Utils.UrlGenerator.PrepareOperationUrl(uri, metadataKey);

                        this.httpProvider.delete(uri, success, error);
                    };

                    DeviceMetadataClient.prototype.deleteAll = function (licenceId, deviceId, success, error) {
                        this.validateLicenceIdAndDeviceId(licenceId, deviceId);
                        var uri = Xomni.Utils.UrlGenerator.ReplaceUri(this.baseUri, new Xomni.Dictionary([
                            { key: "{licenceId}", value: licenceId.toString() },
                            { key: "{deviceId}", value: deviceId }
                        ]));

                        this.httpProvider.delete(uri, success, error);
                    };

                    DeviceMetadataClient.prototype.get = function (licenceId, deviceId, success, error) {
                        this.validateLicenceIdAndDeviceId(licenceId, deviceId);
                        var uri = Xomni.Utils.UrlGenerator.ReplaceUri(this.baseUri, new Xomni.Dictionary([
                            { key: "{licenceId}", value: licenceId.toString() },
                            { key: "{deviceId}", value: deviceId }
                        ]));

                        this.httpProvider.get(uri, success, error);
                    };

                    DeviceMetadataClient.prototype.validateLicenceIdAndDeviceId = function (licenceId, deviceId) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("licenceId", licenceId, 1);
                        Xomni.Utils.Validator.isDefined("deviceId", deviceId);
                    };

                    DeviceMetadataClient.prototype.validateMetadata = function (metadata) {
                        Xomni.Utils.Validator.isDefined("metadata", metadata);
                        Xomni.Utils.Validator.isDefined("key", metadata.Key);
                        Xomni.Utils.Validator.isDefined("value", metadata.Value);
                    };
                    return DeviceMetadataClient;
                })(Xomni.BaseClient);
                DeviceMetadata.DeviceMetadataClient = DeviceMetadataClient;
            })(Company.DeviceMetadata || (Company.DeviceMetadata = {}));
            var DeviceMetadata = Company.DeviceMetadata;
        })(Management.Company || (Management.Company = {}));
        var Company = Management.Company;
    })(Xomni.Management || (Xomni.Management = {}));
    var Management = Xomni.Management;
})(Xomni || (Xomni = {}));
var Xomni;
(function (Xomni) {
    (function (Management) {
        (function (Company) {
            (function (DeviceTypes) {
                var DeviceTypesClient = (function (_super) {
                    __extends(DeviceTypesClient, _super);
                    function DeviceTypesClient() {
                        _super.apply(this, arguments);
                        this.baseUri = "/management/company/devicetypes";
                    }
                    DeviceTypesClient.prototype.post = function (deviceType, success, error) {
                        this.validateDeviceType(deviceType);

                        this.httpProvider.post(this.baseUri, deviceType, success, error);
                    };

                    DeviceTypesClient.prototype.put = function (deviceType, success, error) {
                        this.validateDeviceType(deviceType);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("id", deviceType.Id, 1);

                        this.httpProvider.put(this.baseUri, deviceType, success, error);
                    };

                    DeviceTypesClient.prototype.delete = function (deviceTypeId, success, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("deviceTypeId", deviceTypeId, 1);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrl(this.baseUri, deviceTypeId.toString());

                        this.httpProvider.delete(uri, success, error);
                    };

                    DeviceTypesClient.prototype.get = function (deviceTypeId, success, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("deviceTypeId", deviceTypeId, 1);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrl(this.baseUri, deviceTypeId.toString());

                        this.httpProvider.get(uri, success, error);
                    };

                    DeviceTypesClient.prototype.getList = function (skip, take, succes, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("skip", skip, 0);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("take", take, 1);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrlWithMultipleParameters(this.baseUri, new Xomni.Dictionary([
                            { key: "skip", value: skip.toString() },
                            { key: "take", value: take.toString() }
                        ]));

                        this.httpProvider.get(uri, succes, error);
                    };

                    DeviceTypesClient.prototype.validateDeviceType = function (deviceType) {
                        Xomni.Utils.Validator.isDefined("deviceType", deviceType);
                        Xomni.Utils.Validator.isDefined("description", deviceType.Description);
                        Xomni.Utils.Validator.isLessThan(deviceType.Description.length, "description length", 150);
                    };
                    return DeviceTypesClient;
                })(Xomni.BaseClient);
                DeviceTypes.DeviceTypesClient = DeviceTypesClient;
            })(Company.DeviceTypes || (Company.DeviceTypes = {}));
            var DeviceTypes = Company.DeviceTypes;
        })(Management.Company || (Management.Company = {}));
        var Company = Management.Company;
    })(Xomni.Management || (Xomni.Management = {}));
    var Management = Xomni.Management;
})(Xomni || (Xomni = {}));
var Xomni;
(function (Xomni) {
    (function (Management) {
        (function (Configuration) {
            (function (ImageSizeProfile) {
                var ImageSizeProfileClient = (function (_super) {
                    __extends(ImageSizeProfileClient, _super);
                    function ImageSizeProfileClient() {
                        _super.apply(this, arguments);
                        this.singleOperationBaseUrl = "/management/configuration/imagesizeprofile";
                        this.listOperationBaseUrl = "/management/configuration/imagesizeprofiles";
                    }
                    ImageSizeProfileClient.prototype.getList = function (skip, take, success, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("skip", skip, 0);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("take", take, 1);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrlWithMultipleParameters(this.listOperationBaseUrl, new Xomni.Dictionary([
                            { key: "skip", value: skip.toString() },
                            { key: "take", value: take.toString() }
                        ]));
                        this.httpProvider.get(uri, success, error);
                    };

                    ImageSizeProfileClient.prototype.get = function (imageSizeProfileId, success, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("imageSizeProfileId", imageSizeProfileId, 0);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrlWithMultipleParameters(this.singleOperationBaseUrl, new Xomni.Dictionary([
                            { key: "id", value: imageSizeProfileId.toString() }
                        ]));
                        this.httpProvider.get(uri, success, error);
                    };

                    ImageSizeProfileClient.prototype.post = function (imageSizeProfile, success, error) {
                        Xomni.Utils.Validator.isDefined("imageSizeProfile", imageSizeProfile);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("height", imageSizeProfile.Height, 1);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("width", imageSizeProfile.Width, 1);
                        this.httpProvider.post(this.singleOperationBaseUrl, imageSizeProfile, success, error);
                    };

                    ImageSizeProfileClient.prototype.delete = function (imageSizeProfileId, success, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("imageSizeProfileId", imageSizeProfileId, 0);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrlWithMultipleParameters(this.singleOperationBaseUrl, new Xomni.Dictionary([
                            { key: "id", value: imageSizeProfileId.toString() }
                        ]));
                        this.httpProvider.delete(uri, success, error);
                    };
                    return ImageSizeProfileClient;
                })(Xomni.BaseClient);
                ImageSizeProfile.ImageSizeProfileClient = ImageSizeProfileClient;
            })(Configuration.ImageSizeProfile || (Configuration.ImageSizeProfile = {}));
            var ImageSizeProfile = Configuration.ImageSizeProfile;
        })(Management.Configuration || (Management.Configuration = {}));
        var Configuration = Management.Configuration;
    })(Xomni.Management || (Xomni.Management = {}));
    var Management = Xomni.Management;
})(Xomni || (Xomni = {}));
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
                        Xomni.Utils.Validator.isGreaterThanOrEqual("storeId", storeId, 0);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrl(this.singleOperationBaseUrl, storeId.toString());
                        this.httpProvider.get(uri, success, error);
                    };

                    StoreClient.prototype.delete = function (storeId, success, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("storeId", storeId, 0);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrl(this.singleOperationBaseUrl, storeId.toString());
                        this.httpProvider.delete(uri, success, error);
                    };

                    StoreClient.prototype.post = function (store, success, error) {
                        Xomni.Utils.Validator.isDefined("name", store.Name);
                        this.httpProvider.post(this.singleOperationBaseUrl, store, success, error);
                    };

                    StoreClient.prototype.put = function (store, success, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("id", store.Id, 0);
                        Xomni.Utils.Validator.isDefined("name", store.Name);
                        this.httpProvider.put(this.singleOperationBaseUrl, store, success, error);
                    };

                    StoreClient.prototype.getList = function (skip, take, success, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("skip", skip, 0);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("take", take, 1);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrlWithMultipleParameters(this.listOperationBaseUrl, new Xomni.Dictionary([
                            { key: "skip", value: skip.toString() },
                            { key: "take", value: take.toString() }
                        ]));
                        this.httpProvider.get(uri, success, error);
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
                        if (settings.PassbookCertificatePassword) {
                            Xomni.Utils.Validator.isLessThan(settings.PassbookCertificatePassword.length, "PassbookCertificatePassword", 250);
                        }
                        if (settings.PassbookTeamIdentifier) {
                            Xomni.Utils.Validator.isLessThan(settings.PassbookTeamIdentifier.length, "PassbookTeamIdentifier", 250);
                        }
                        if (settings.PassbookOrganizationName) {
                            Xomni.Utils.Validator.isLessThan(settings.PassbookOrganizationName.length, "PassbookOrganizationName", 250);
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
var Xomni;
(function (Xomni) {
    (function (Management) {
        (function (Integration) {
            (function (MSG) {
                var MSGClient = (function (_super) {
                    __extends(MSGClient, _super);
                    function MSGClient() {
                        _super.apply(this, arguments);
                        this.uri = "/management/integration/msg";
                    }
                    MSGClient.prototype.get = function (success, error) {
                        this.httpProvider.get(this.uri, success, error);
                    };

                    MSGClient.prototype.post = function (createRequest, success, error) {
                        if (!createRequest.Email) {
                            throw new Error("Email could not be null or empty.");
                        }

                        if (!createRequest.FirstName) {
                            throw new Error("FirstName could not be null or empty.");
                        }

                        if (!createRequest.LastName) {
                            throw new Error("LastName could not be null or empty.");
                        }

                        this.httpProvider.post(this.uri, createRequest, success, error);
                    };
                    return MSGClient;
                })(Xomni.BaseClient);
                MSG.MSGClient = MSGClient;
            })(Integration.MSG || (Integration.MSG = {}));
            var MSG = Integration.MSG;
        })(Management.Integration || (Management.Integration = {}));
        var Integration = Management.Integration;
    })(Xomni.Management || (Xomni.Management = {}));
    var Management = Xomni.Management;
})(Xomni || (Xomni = {}));
var Xomni;
(function (Xomni) {
    (function (Management) {
        (function (Security) {
            (function (License) {
                var LicenseClient = (function (_super) {
                    __extends(LicenseClient, _super);
                    function LicenseClient() {
                        _super.apply(this, arguments);
                        this.singleOperationBaseUrl = "/management/security/license/";
                        this.listOperationBaseUrl = "/management/security/licenses";
                        this.auditBaseUrl = "/management/security/licenses/audits";
                    }
                    LicenseClient.prototype.get = function (licenseId, success, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("licenseId", licenseId, 0);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrl(this.singleOperationBaseUrl, licenseId.toString());
                        this.httpProvider.get(uri, success, error);
                    };

                    LicenseClient.prototype.getList = function (skip, take, success, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("skip", skip, 0);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("take", take, 1);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrlWithMultipleParameters(this.listOperationBaseUrl, new Xomni.Dictionary([
                            { key: "skip", value: skip.toString() },
                            { key: "take", value: take.toString() }
                        ]));
                        this.httpProvider.get(uri, success, error);
                    };

                    LicenseClient.prototype.post = function (license, success, error) {
                        Xomni.Utils.Validator.isDefined("license", license);
                        Xomni.Utils.Validator.isDefined("username", license.Username);
                        Xomni.Utils.Validator.isDefined("password", license.Password);
                        this.httpProvider.post(this.singleOperationBaseUrl, license, success, error);
                    };

                    LicenseClient.prototype.put = function (license, success, error) {
                        Xomni.Utils.Validator.isDefined("license", license);
                        Xomni.Utils.Validator.isDefined("id", license.Id);
                        Xomni.Utils.Validator.isDefined("username", license.Username);
                        Xomni.Utils.Validator.isDefined("password", license.Password);
                        this.httpProvider.put(this.singleOperationBaseUrl, license, success, error);
                    };

                    LicenseClient.prototype.delete = function (licenseId, success, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("licenseId", licenseId, 0);
                        this.httpProvider.delete(this.singleOperationBaseUrl, success, error);
                    };

                    LicenseClient.prototype.getAuditLogs = function (skip, take, success, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("skip", skip, 0);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("take", take, 1);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrlWithMultipleParameters(this.auditBaseUrl, new Xomni.Dictionary([
                            { key: "skip", value: skip.toString() },
                            { key: "take", value: take.toString() }
                        ]));
                        this.httpProvider.get(uri, success, error);
                    };

                    LicenseClient.prototype.getUnassignedLicenses = function (onlyUnassignedUsers, success, error) {
                        Xomni.Utils.Validator.isDefined("onlyUnassignedUsers", onlyUnassignedUsers);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrlWithMultipleParameters(this.listOperationBaseUrl, new Xomni.Dictionary([
                            { key: "onlyUnassignedUsers", value: String(onlyUnassignedUsers) }
                        ]));
                        this.httpProvider.get(uri, success, error);
                    };
                    return LicenseClient;
                })(Xomni.BaseClient);
                License.LicenseClient = LicenseClient;
            })(Security.License || (Security.License = {}));
            var License = Security.License;
        })(Management.Security || (Management.Security = {}));
        var Security = Management.Security;
    })(Xomni.Management || (Xomni.Management = {}));
    var Management = Xomni.Management;
})(Xomni || (Xomni = {}));
var Xomni;
(function (Xomni) {
    (function (Management) {
        (function (Storage) {
            (function (Assets) {
                var AssetClient = (function (_super) {
                    __extends(AssetClient, _super);
                    function AssetClient() {
                        _super.apply(this, arguments);
                        this.singleOperationBaseUrl = "/management/storage/asset";
                        this.listOperationBaseUrl = "/management/storage/assets";
                    }
                    AssetClient.prototype.getList = function (skip, take, success, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("skip", skip, 0);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("take", take, 1);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrlWithMultipleParameters(this.listOperationBaseUrl, new Xomni.Dictionary([
                            { key: "skip", value: skip.toString() },
                            { key: "take", value: take.toString() }
                        ]));
                        this.httpProvider.get(uri, success, error);
                    };

                    AssetClient.prototype.get = function (assetId, success, error) {
                        var _this = this;
                        Xomni.Utils.Validator.isGreaterThanOrEqual("assetId", assetId, 0);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrlWithMultipleParameters(this.singleOperationBaseUrl, new Xomni.Dictionary([
                            { key: "id", value: assetId.toString() }
                        ]));
                        this.httpProvider.get(uri, (function (r) {
                            success({
                                Id: r.Id,
                                FileName: r.FileName,
                                MimeType: r.MimeType,
                                FileBody: _this.StringToUint8Array(atob(r.FileBody))
                            });
                        }), error);
                    };

                    AssetClient.prototype.delete = function (assetId, success, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("assetId", assetId, 0);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrlWithMultipleParameters(this.singleOperationBaseUrl, new Xomni.Dictionary([
                            { key: "id", value: assetId.toString() }
                        ]));
                        this.httpProvider.delete(uri, success, error);
                    };

                    AssetClient.prototype.post = function (tenantAssetDetail, success, error) {
                        Xomni.Utils.Validator.isDefined("tenantAssetDetail", tenantAssetDetail);
                        Xomni.Utils.Validator.isDefined("FileName", tenantAssetDetail.FileName);
                        Xomni.Utils.Validator.isDefined("MimeType", tenantAssetDetail.MimeType);
                        Xomni.Utils.Validator.isDefined("FileBody", tenantAssetDetail.FileBody);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("FileName length", tenantAssetDetail.FileName.length, 1);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("Mimetype length", tenantAssetDetail.MimeType.length, 1);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("File body", tenantAssetDetail.FileBody.length, 1);
                        this.httpProvider.post(this.singleOperationBaseUrl, {
                            FileName: tenantAssetDetail.FileName,
                            FileBody: btoa(this.Uint8ArrayToString(tenantAssetDetail.FileBody)),
                            MimeType: tenantAssetDetail.MimeType
                        }, success, error);
                    };

                    AssetClient.prototype.put = function (tenantAssetDetail, success, error) {
                        Xomni.Utils.Validator.isDefined("tenantAssetDetail", tenantAssetDetail);
                        Xomni.Utils.Validator.isDefined("Id", tenantAssetDetail.Id);
                        Xomni.Utils.Validator.isDefined("FileName", tenantAssetDetail.FileName);
                        Xomni.Utils.Validator.isDefined("MimeType", tenantAssetDetail.MimeType);
                        Xomni.Utils.Validator.isDefined("FileBody", tenantAssetDetail.FileBody);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("Id", tenantAssetDetail.Id, 1);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("FileName length", tenantAssetDetail.FileName.length, 1);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("Mimetype length", tenantAssetDetail.MimeType.length, 1);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("File body", tenantAssetDetail.FileBody.length, 1);
                        this.httpProvider.put(this.singleOperationBaseUrl, {
                            Id: tenantAssetDetail.Id,
                            FileName: tenantAssetDetail.FileName,
                            FileBody: btoa(this.Uint8ArrayToString(tenantAssetDetail.FileBody)),
                            MimeType: tenantAssetDetail.MimeType
                        }, success, error);
                    };

                    AssetClient.prototype.StringToUint8Array = function (str) {
                        var bufView = new Uint8Array(str.length);
                        for (var i = 0, strLen = str.length; i < strLen; i++) {
                            bufView[i] = str.charCodeAt(i);
                        }
                        return bufView;
                    };

                    AssetClient.prototype.Uint8ArrayToString = function (arr) {
                        var result = '';
                        for (var i = 0; i < arr.length; i++) {
                            result += String.fromCharCode(arr[i]);
                        }
                        return result;
                    };
                    return AssetClient;
                })(Xomni.BaseClient);
                Assets.AssetClient = AssetClient;
            })(Storage.Assets || (Storage.Assets = {}));
            var Assets = Storage.Assets;
        })(Management.Storage || (Management.Storage = {}));
        var Storage = Management.Storage;
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
    (function (Management) {
        (function (Security) {
            (function (PrivateApiUser) {
                var PrivateApiUserClient = (function (_super) {
                    __extends(PrivateApiUserClient, _super);
                    function PrivateApiUserClient() {
                        _super.apply(this, arguments);
                        this.listOperationBaseUrl = "/management/security/privateapiusers";
                        this.singleOperationBaseUrl = "/management/security/privateapiuser/";
                    }
                    PrivateApiUserClient.prototype.getList = function (skip, take, success, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("skip", skip, 0);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("take", take, 1);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrlWithMultipleParameters(this.listOperationBaseUrl, new Xomni.Dictionary([
                            { key: "skip", value: skip.toString() },
                            { key: "take", value: take.toString() }
                        ]));
                        this.httpProvider.get(uri, success, error);
                    };

                    PrivateApiUserClient.prototype.get = function (privateApiUserId, success, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("privateApiUserId", privateApiUserId, 0);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrl(this.singleOperationBaseUrl, privateApiUserId.toString());
                        this.httpProvider.get(uri, success, error);
                    };

                    PrivateApiUserClient.prototype.delete = function (privateApiUserId, success, error) {
                        Xomni.Utils.Validator.isGreaterThanOrEqual("privateApiUserId", privateApiUserId, 0);
                        var uri = Xomni.Utils.UrlGenerator.PrepareOperationUrl(this.singleOperationBaseUrl, privateApiUserId.toString());
                        this.httpProvider.delete(uri, success, error);
                    };

                    PrivateApiUserClient.prototype.post = function (privateApiUser, success, error) {
                        Xomni.Utils.Validator.isDefined("privateApiUser", privateApiUser);
                        Xomni.Utils.Validator.isDefined("name", privateApiUser.Name);
                        Xomni.Utils.Validator.isDefined("password", privateApiUser.Password);
                        this.httpProvider.post(this.singleOperationBaseUrl, privateApiUser, success, error);
                    };

                    PrivateApiUserClient.prototype.put = function (privateApiUser, success, error) {
                        Xomni.Utils.Validator.isDefined("privateApiUser", privateApiUser);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("id", privateApiUser.Id, 0);
                        Xomni.Utils.Validator.isDefined("name", privateApiUser.Name);
                        Xomni.Utils.Validator.isDefined("password", privateApiUser.Password);

                        this.httpProvider.put(this.singleOperationBaseUrl, privateApiUser, success, error);
                    };
                    return PrivateApiUserClient;
                })(Xomni.BaseClient);
                PrivateApiUser.PrivateApiUserClient = PrivateApiUserClient;
            })(Security.PrivateApiUser || (Security.PrivateApiUser = {}));
            var PrivateApiUser = Security.PrivateApiUser;
        })(Management.Security || (Management.Security = {}));
        var Security = Management.Security;
    })(Xomni.Management || (Xomni.Management = {}));
    var Management = Xomni.Management;
})(Xomni || (Xomni = {}));
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
                            uri = Xomni.Utils.UrlGenerator.PrepareOperationUrlWithMultipleParameters(uri, new Xomni.Dictionary([
                                { key: "continuationKey", value: continuationKey }
                            ]));
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
                        this.weeklyLogSummaryUri = '/private/analytics/clientcounters/{counterName}/summary/weekly';
                        this.dailyLogSummaryUri = '/private/analytics/clientcounters/{counterName}/summary/daily';
                        this.monthlyLogSummaryUri = '/private/analytics/clientcounters/{counterName}/summary/monthly';
                        this.yearlyLogSummaryUri = '/private/analytics/clientcounters/{counterName}/summary/yearly';
                    }
                    ClientSideAnalyticsLogSummaryClient.prototype.getDailyLogs = function (counterName, startOADate, endOADate, success, error) {
                        Xomni.Utils.Validator.isDefined("counterName", counterName);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("startOADate", startOADate, 1);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("endOADate", endOADate, 1);
                        Xomni.Utils.Validator.isLessThan(startOADate, "startOADate", endOADate, "endOADate");
                        var uri = this.PrepareUri(this.dailyLogSummaryUri, counterName, startOADate, endOADate);
                        this.httpProvider.get(uri, success, error);
                    };

                    ClientSideAnalyticsLogSummaryClient.prototype.getWeeklyLogs = function (counterName, startOADate, endOADate, success, error) {
                        Xomni.Utils.Validator.isDefined("counterName", counterName);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("startOADate", startOADate, 1);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("endOADate", endOADate, 1);
                        Xomni.Utils.Validator.isLessThan(startOADate, "startOADate", endOADate, "endOADate");
                        var uri = this.PrepareUri(this.weeklyLogSummaryUri, counterName, startOADate, endOADate);
                        this.httpProvider.get(uri, success, error);
                    };

                    ClientSideAnalyticsLogSummaryClient.prototype.getMonthlyLogs = function (counterName, startOADate, endOADate, success, error) {
                        Xomni.Utils.Validator.isDefined("counterName", counterName);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("startOADate", startOADate, 1);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("endOADate", endOADate, 1);
                        Xomni.Utils.Validator.isLessThan(startOADate, "startOADate", endOADate, "endOADate");
                        var uri = this.PrepareUri(this.monthlyLogSummaryUri, counterName, startOADate, endOADate);
                        this.httpProvider.get(uri, success, error);
                    };

                    ClientSideAnalyticsLogSummaryClient.prototype.getYearlyLogs = function (counterName, startOADate, endOADate, success, error) {
                        Xomni.Utils.Validator.isDefined("counterName", counterName);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("startOADate", startOADate, 1);
                        Xomni.Utils.Validator.isGreaterThanOrEqual("endOADate", endOADate, 1);
                        Xomni.Utils.Validator.isLessThan(startOADate, "startOADate", endOADate, "endOADate");
                        var uri = this.PrepareUri(this.yearlyLogSummaryUri, counterName, startOADate, endOADate);
                        this.httpProvider.get(uri, success, error);
                    };

                    ClientSideAnalyticsLogSummaryClient.prototype.PrepareUri = function (baseUri, counterName, startOADate, endOADate) {
                        var uri = baseUri.replace("{counterName}", counterName);
                        uri = Xomni.Utils.UrlGenerator.PrepareOperationUrlWithMultipleParameters(uri, new Xomni.Dictionary([
                            { key: "startOADate", value: startOADate.toString() },
                            { key: "endOADate", value: endOADate.toString() }
                        ]));
                        return uri;
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
var Xomni;
(function (Xomni) {
    (function (Utils) {
        var UrlGenerator = (function () {
            function UrlGenerator() {
            }
            UrlGenerator.PrepareOperationUrl = function (baseUrl, additionalQueryString) {
                Xomni.Utils.Validator.isDefined("baseUrl", baseUrl);
                Xomni.Utils.Validator.isDefined("additionalQueryString", additionalQueryString);
                if (baseUrl.substring(baseUrl.length - 1) != "/") {
                    baseUrl += "/";
                }
                return baseUrl + additionalQueryString;
            };

            UrlGenerator.PrepareOperationUrlWithMultipleParameters = function (baseUrl, additionalQueryString) {
                Xomni.Utils.Validator.isDefined("baseUrl", baseUrl);
                Xomni.Utils.Validator.isDefined("additionalQueryString", additionalQueryString);
                baseUrl += "?";
                for (var i = 0; i < additionalQueryString.keys().length; i++) {
                    baseUrl += additionalQueryString.keys()[i] + "=" + additionalQueryString.values()[i];
                    baseUrl += "&";
                }
                if (baseUrl.substring(baseUrl.length - 1) == "&") {
                    baseUrl = baseUrl.substring(0, baseUrl.length - 1);
                }
                return baseUrl;
            };

            UrlGenerator.ReplaceUri = function (baseUrl, patterns) {
                Xomni.Utils.Validator.isDefined("baseUrl", baseUrl);
                Xomni.Utils.Validator.isDefined("patterns", patterns);
                for (var i = 0; i < patterns.keys().length; i++) {
                    baseUrl = baseUrl.replace(patterns.keys()[i], patterns.values()[i]);
                }
                return baseUrl;
            };
            return UrlGenerator;
        })();
        Utils.UrlGenerator = UrlGenerator;
    })(Xomni.Utils || (Xomni.Utils = {}));
    var Utils = Xomni.Utils;
})(Xomni || (Xomni = {}));
var Xomni;
(function (Xomni) {
    (function (Utils) {
        var Validator = (function () {
            function Validator() {
            }
            Validator.isDefined = function (argName, argValue) {
                if (!argName) {
                    throw new Error("Argument name could not be null or empty");
                }
                if ((typeof (argValue) === "string" || argValue != 0) && !argValue) {
                    throw new Error(argName + " could not be null or empty");
                }
            };

            Validator.isGreaterThanOrEqual = function (argName, argValue, bound) {
                this.isDefined(argName, argValue);
                this.isDefined("bound", bound);
                if (argValue < bound) {
                    throw new Error(argName + " must be greater than or equal to " + bound);
                }
            };

            Validator.isLessThan = function (minValue, minParameterName, maxValue, maxParameterName) {
                this.isDefined(minParameterName, minValue);

                if (maxParameterName) {
                    this.isDefined(maxParameterName, maxValue);
                    if (minValue > maxValue) {
                        throw new Error(minParameterName + " could not be greater than " + maxParameterName);
                    }
                } else {
                    this.isDefined("maxParameter", maxValue);
                    if (minValue > maxValue) {
                        throw new Error(minParameterName + " could not be greater than " + maxValue);
                    }
                }
            };
            return Validator;
        })();
        Utils.Validator = Validator;
    })(Xomni.Utils || (Xomni.Utils = {}));
    var Utils = Xomni.Utils;
})(Xomni || (Xomni = {}));
//# sourceMappingURL=xomni.js.map
