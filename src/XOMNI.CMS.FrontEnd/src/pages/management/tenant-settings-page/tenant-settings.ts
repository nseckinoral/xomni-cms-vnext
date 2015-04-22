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
    public cdnUrl = ko.observable<string>().extend({ required: { onlyIf: () => this.cdnEnabled() } });
    public cacheExpirationTime = ko.observable<number>().extend({ required: { onlyIf: () => this.cdnEnabled() } });
    public isPassbookEnabled = ko.observable<boolean>();
    public applePassTypeIdentifier = ko.observable<string>().extend({ required: { onlyIf: () => this.isPassbookEnabled() } });
    public appleWWDRCACertificateFileName = ko.observable<string>().extend({ required: { onlyIf: () => this.isPassbookEnabled() } });
    public passbookCertificateFileName = ko.observable<string>().extend({ required: { onlyIf: () => this.isPassbookEnabled() } });
    public passbookCertificatePassword = ko.observable<string>().extend({ required: { onlyIf: () => this.isPassbookEnabled() } });
    public passbookTeamIdentifier = ko.observable<string>().extend({ required: { onlyIf: () => this.isPassbookEnabled() } });
    public passbookOrganizationName = ko.observable<string>().extend({ required: { onlyIf: () => this.isPassbookEnabled() } });
    public popularityTimeImpactValue = ko.observable<number>().extend({ required: true });
    public isSearchIndexingEnabled = ko.observable<boolean>().extend({ required: true });
    public mailUnsubscribeRedirectionLink = ko.observable<string>().extend({ required: true });
    public appleWWDRCACertificate = ko.observable<File>();
    public passbookCertificate = ko.observable<File>();

    public validationErrors = ko.validation.group(this);
    //locals
    currentSettings: Models.Management.Configuration.Settings;
    appleWWDRCACertificateUploadStatus: TenantAssetUploadStatus;
    passbookCertificateUploadStatus: TenantAssetUploadStatus;
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
            this.storageClient.get(settings.PassbookCertificateTenantAssetId, (detail) => {
                this.passbookCertificateFileName(detail.FileName);
            }, error=> {
                    this.showErrorDialog();
                });
        }

        if (settings.PassbookWWDRCACertificateTenantAssetId !== undefined && settings.PassbookWWDRCACertificateTenantAssetId !== 0) {
            this.appleWWDRCACertificateAssetId = settings.PassbookWWDRCACertificateTenantAssetId;
            this.storageClient.get(settings.PassbookWWDRCACertificateTenantAssetId, (detail) => {
                this.appleWWDRCACertificateFileName(detail.FileName);
            }, error=> {
                    this.showErrorDialog();
                });
        }

        this.passbookTeamIdentifier(settings.PassbookTeamIdentifier);
        this.passbookOrganizationName(settings.PassbookOrganizationName);
        this.popularityTimeImpactValue(settings.PopularityTimeImpactValue);
        this.isSearchIndexingEnabled(settings.SearchIndexingEnabled);
        this.mailUnsubscribeRedirectionLink(settings.MailUnsubscribeRedirectionUri);
        this.currentSettings = settings;
    }
    update() {
        if (this.validationErrors().length === 0) {
            this.uploadTenantAssetsIfChanged();
            var intervalId = setInterval(() => {
                if (this.passbookCertificateUploadStatus !== TenantAssetUploadStatus.Failed && this.appleWWDRCACertificateUploadStatus !== TenantAssetUploadStatus.Failed) {
                    clearInterval(intervalId);
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
                    settings.TwitterConsumerKey = "sdadasd";
                    settings.TwitterConsumerKeySecret = "asdasd";
                    settings.TwitterRedirectUri = "http://xomni.com";

                    console.log(settings.TwitterConsumerKeySecret);

                    this.settingsClient.put(settings, t=> {
                        this.appleWWDRCACertificateUploadStatus = TenantAssetUploadStatus.None;
                        this.passbookCertificateUploadStatus = TenantAssetUploadStatus.None;
                        this.bindFields(t);
                    }, error=> {
                            this.showErrorDialog();
                        });
                }

                else {
                    this.validationErrors.showAllMessages();
                }
            }, 2000);
        }
    }
    uploadTenantAssetsIfChanged() {
        if (this.appleWWDRCACertificate() !== undefined) {
            this.appleWWDRCACertificateUploadStatus = TenantAssetUploadStatus.Uploading;
            this.appleCertificateReader.onload = t=> {
                var fileBody = new Uint8Array(this.appleCertificateReader.result);
                this.storageClient.post({
                    Id: 0,
                    FileName: this.appleWWDRCACertificate().name,
                    MimeType: this.appleWWDRCACertificate().type,
                    FileBody: fileBody
                }, t=> {
                        this.appleWWDRCACertificateUploadStatus = TenantAssetUploadStatus.Completed;
                        this.appleWWDRCACertificateAssetId = t.Id;
                    }, e=> {
                        this.appleWWDRCACertificateUploadStatus = TenantAssetUploadStatus.Failed;

                    });
            };

            this.appleCertificateReader.onerror = t=> {
                this.showCustomErrorDialog("An error occurred while reading file");
            };
            this.appleCertificateReader.readAsArrayBuffer(this.appleWWDRCACertificate());
        }

        if (this.passbookCertificate() !== undefined) {
            this.passbookCertificateUploadStatus = TenantAssetUploadStatus.Uploading;
            this.developerCertificateReader.onload = t=> {
                var fileBody = new Uint8Array(this.developerCertificateReader.result);
                this.storageClient.post({
                    Id: 0,
                    FileName: this.passbookCertificate().name,
                    MimeType: this.passbookCertificate().type,
                    FileBody: fileBody
                }, t=> {
                        this.passbookCertificateUploadStatus = TenantAssetUploadStatus.Completed;
                        this.passbookCertificateAssetId = t.Id;
                    }, e=> {
                        this.passbookCertificateUploadStatus = TenantAssetUploadStatus.Failed;
                    });
            };
            this.developerCertificateReader.onerror = t=> {
                this.showCustomErrorDialog("An error occurred while reading file");
            };
            this.developerCertificateReader.readAsArrayBuffer(this.passbookCertificate());
        }
    }
}
export enum TenantAssetUploadStatus {
    None= 0,
    Uploading,
    Completed,
    Failed
}