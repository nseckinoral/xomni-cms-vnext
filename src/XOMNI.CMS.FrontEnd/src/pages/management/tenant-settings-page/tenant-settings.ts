/// <amd-dependency path="bootstrap-toggle" />
/// <amd-dependency path="xomni" />
/// <amd-dependency path="text!./tenant-settings.html" />

import $ = require("jquery");
import ko = require("knockout");
import cms = require("app/infrastructure");

export var template: string = require("text!./tenant-settings.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    public settingsClient = new Xomni.Management.Configuration.Settings.SettingsClient();
    public storageClient = new Xomni.Management.Storage.Assets.AssetClient();

    //observables
    public cdnEnabled = ko.observable<boolean>();

    public cdnUrl = ko.observable<string>().extend({
        required: {
            message: "CDN Url should be filled.",
            onlyIf: () => this.cdnEnabled()
        }
    });

    public cacheExpirationTime = ko.observable<number>().extend({
        required: {
            message: "Cache expiration time should be filled.",
            onlyIf: () => this.cdnEnabled()
        }
    });

    public isPassbookEnabled = ko.observable<boolean>();

    public applePassTypeIdentifier = ko.observable<string>().extend({
        required: {
            message: "Apple Pass Type Identifer should be filled.",
            onlyIf: () => this.isPassbookEnabled()
        }
    });

    public appleWWDRCACertificateFileName = ko.observable<string>().extend(
        {
            required: {
                message: "Apple WWDRCA Certificate should be filled.",
                onlyIf: () => this.isPassbookEnabled()
            }
        });

    public passbookCertificateFileName = ko.observable<string>().extend({
        required: {
            message: "Passbook Certificate should be filled.",
            onlyIf: () => this.isPassbookEnabled()
        }
    });

    public passbookCertificatePassword = ko.observable<string>().extend({
        required: {
            message: "Passbook Certificate Password should be filled.",
            onlyIf: () => this.isPassbookEnabled()
        }
    });

    public passbookTeamIdentifier = ko.observable<string>().extend({
        required: {
            message: "Passbook Team Identifier should be filled.",
            onlyIf: () => this.isPassbookEnabled()
        }
    });

    public passbookOrganizationName = ko.observable<string>().extend({
        required: {
            message: "Passbook Organization Name should be filled.",
            onlyIf: () => this.isPassbookEnabled()
        }
    });
    public popularityTimeImpactValue = ko.observable<number>().extend({
        required: {
            message: "Popularity time impact value should be filled."
        }
    });
    public isSearchIndexingEnabled = ko.observable<boolean>().extend({ required: true });
    public mailUnsubscribeRedirectionLink = ko.observable<string>().extend({
        required: {
            message: "Mail Unsubscribe Redirection Link should be filled."
        },
        url: {
            message: "Mail Unsubscribe Redirection Link has to be valid."
        }
    });
    public appleWWDRCACertificate = ko.observable<File>();
    public passbookCertificate = ko.observable<File>();
    public waitingFileUpload = ko.observable<boolean>(false);
    public validationErrors = ko.validation.group(this);
    //locals
    currentSettings: Models.Management.Configuration.Settings;
    appleWWDRCACertificateAssetId: number;
    passbookCertificateAssetId: number;
    appleCertificateReader: FileReader = new FileReader();
    developerCertificateReader: FileReader = new FileReader();

    constructor() {
        super();
        this.initalize();
    }

    initalize() {
        this.settingsClient.get(
            (t) => {
                this.bindFields(t);
            },
            (e) => {
                this.showErrorDialog();
            }
            );
    }

    bindFields(settings: Models.Management.Configuration.Settings) {
        this.cdnEnabled(settings.IsCDNEnabled);
        this.cdnUrl(settings.CDNUrl);
        this.cacheExpirationTime(settings.CacheExpirationTime);
        this.isPassbookEnabled(settings.IsPassbookEnabled);
        this.applePassTypeIdentifier(settings.PassbookPassTypeIdentifier);

        if (settings.PassbookCertificateTenantAssetId !== undefined && settings.PassbookCertificateTenantAssetId !== 0) {
            this.passbookCertificateAssetId = settings.PassbookCertificateTenantAssetId;
            this.storageClient.get(settings.PassbookCertificateTenantAssetId,(detail) => {
                this.passbookCertificateFileName(detail.FileName);
            }, error=> {
                    this.showErrorDialog();
                });
        }
        else {
            this.passbookCertificateFileName("");
        }

        if (settings.PassbookWWDRCACertificateTenantAssetId !== undefined && settings.PassbookWWDRCACertificateTenantAssetId !== 0) {
            this.appleWWDRCACertificateAssetId = settings.PassbookWWDRCACertificateTenantAssetId;
            this.storageClient.get(settings.PassbookWWDRCACertificateTenantAssetId,(detail) => {
                this.appleWWDRCACertificateFileName(detail.FileName);
            }, error=> {
                    this.showErrorDialog();
                });
        }
        else {
            this.appleWWDRCACertificateFileName("");
        }
        this.passbookTeamIdentifier(settings.PassbookTeamIdentifier);
        this.passbookOrganizationName(settings.PassbookOrganizationName);
        this.popularityTimeImpactValue(settings.PopularityTimeImpactValue);
        this.isSearchIndexingEnabled(settings.SearchIndexingEnabled);
        this.mailUnsubscribeRedirectionLink(settings.MailUnsubscribeRedirectionUri);
        this.passbookCertificatePassword(settings.PassbookCertificatePassword);
        this.currentSettings = settings;
    }

    update() {
        if (this.validationErrors().length === 0) {
            var settings: Models.Management.Configuration.Settings = {
                CacheExpirationTime: this.cacheExpirationTime(),
                CDNUrl: this.cdnUrl(),
                IsCDNEnabled: this.cdnEnabled(),
                IsPassbookEnabled: this.isPassbookEnabled(),
                MailUnsubscribeRedirectionUri: this.mailUnsubscribeRedirectionLink(),
                PassbookCertificatePassword: this.passbookCertificatePassword(),
                PassbookOrganizationName: this.passbookOrganizationName(),
                PassbookPassTypeIdentifier: this.applePassTypeIdentifier(),
                PassbookTeamIdentifier: this.passbookTeamIdentifier(),
                PassbookCertificateTenantAssetId: this.passbookCertificateAssetId,
                SearchIndexingEnabled: this.isSearchIndexingEnabled(),
                PopularityTimeImpactValue: this.popularityTimeImpactValue(),
                PassbookWWDRCACertificateTenantAssetId: this.appleWWDRCACertificateAssetId,
                FacebookApplicationId: this.currentSettings.FacebookApplicationId,
                FacebookApplicationSecretKey: this.currentSettings.FacebookApplicationSecretKey,
                FacebookDisplayType: this.currentSettings.FacebookDisplayType,
                FacebookRedirectUri: this.currentSettings.FacebookRedirectUri,
                TwitterConsumerKey: this.currentSettings.TwitterConsumerKey,
                TwitterConsumerKeySecret: this.currentSettings.TwitterConsumerKeySecret,
                TwitterRedirectUri: this.currentSettings.TwitterRedirectUri
            };

            this.settingsClient.put(settings, t=> {
                this.bindFields(t);
            }, error=> {
                    this.showErrorDialog();
                });
        }
        else {
            this.validationErrors.showAllMessages();
        }
    }
    appleWWDRCACertificateFileChanged(files: any) {
        if (files.length > 0) {
            this.waitingFileUpload(true);
            var newFile = files[0];
            this.appleWWDRCACertificate(newFile);
            this.appleWWDRCACertificateFileName(newFile.name);

            this.appleCertificateReader.onload = t=> {
                var fileBody = new Uint8Array(this.appleCertificateReader.result);
                this.storageClient.post({
                    Id: 0,
                    FileName: this.appleWWDRCACertificate().name,
                    MimeType: this.appleWWDRCACertificate().type,
                    FileBody: fileBody
                }, t=> {
                        this.appleWWDRCACertificateAssetId = t.Id;
                        this.waitingFileUpload(false);
                    }, e=> {
                        this.waitingFileUpload(false);
                        this.showCustomErrorDialog("An error occurred while uploading file");
                    });
            };

            this.appleCertificateReader.onerror = t=> {
                this.showCustomErrorDialog("An error occurred while reading file");
            };
            this.appleCertificateReader.readAsArrayBuffer(this.appleWWDRCACertificate());
        }
    }

    passbookCertificateFileChanged(files: any) {
        if (files.length > 0) {
            this.waitingFileUpload(true);
            var newFile = files[0];
            this.passbookCertificate(newFile);
            this.passbookCertificateFileName(newFile.name);

            this.developerCertificateReader.onload = t=> {
                var fileBody = new Uint8Array(this.developerCertificateReader.result);
                this.storageClient.post({
                    Id: 0,
                    FileName: this.passbookCertificate().name,
                    MimeType: this.passbookCertificate().type,
                    FileBody: fileBody
                }, t=> {
                        this.waitingFileUpload(false);
                        this.passbookCertificateAssetId = t.Id;
                    }, e=> {
                        this.waitingFileUpload(false);
                        this.showCustomErrorDialog("An error occurred while uploading file");
                    });
            };
            this.developerCertificateReader.onerror = t=> {
                this.showCustomErrorDialog("An error occurred while reading file");
            };
            this.developerCertificateReader.readAsArrayBuffer(this.passbookCertificate());
        }
    }
}
