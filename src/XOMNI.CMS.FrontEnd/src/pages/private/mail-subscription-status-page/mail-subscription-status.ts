/// <amd-dependency path="xomni" />
/// <amd-dependency path="text!./mail-subscription-status.html" />

import $ = require("jquery");
import ko = require("knockout");
import cms = require("app/infrastructure");

export var template: string = require("text!./mail-subscription-status.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    public piiName = ko.observable<string>();
    public purposeType = ko.observable<string>();
    public status = ko.observable<string>();
    public isSubscribable = ko.observable<boolean>(true);
    public client = new Xomni.Private.Mail.Status.StatusClient();
    public subscriptionDetail = ko.observable<Models.Private.Mail.MailSubscription>();
    public email = ko.observable<string>().extend({
        required: {
            message: "E-Mail is required."
        }
    });

    constructor() {
        super();
        this.initValidation(ko.validation.group([this.email]));
    }

    getSubscriptionDetails() {
        this.changeValidationStatus(true);
        if (this.getValidationErrors().length == 0) {
            this.client.get(this.email(),
                t=> {
                    this.piiName(t.PIIName);
                    this.purposeType(Models.Private.Mail.MailSubscriptionPurposeType[t.PurposeTypeId]);
                    this.status(Models.Private.Mail.MailSubscriptionStatus[t.StatusId]);
                    this.isSubscribable(t.IsSubscribable);
                },
                e=> {
                    this.showCustomErrorDialog(this.createErrorMessage(e));
                });
        }
    }

    updateSubscriptionStatus() {
        this.changeValidationStatus(true);
        if (this.getValidationErrors().length === 0) {
            this.client.put(this.email(), Models.Private.Mail.MailSubscriptionStatus.Subscribed,
                () => {
                    this.getSubscriptionDetails();
                },
                e=> {
                    this.showCustomErrorDialog(this.createErrorMessage(e));
                });
        }
    }
}