/// <amd-dependency path="validation" />
import $ = require("jquery");
import ko = require("knockout");
import bootstrap = require("bootstrap");
import router = require("./router");
import cms = require("app/infrastructure");

// Components can be packaged as AMD modules, such as the following:
ko.components.register('dashboard', { require: 'components/dashboard/dashboard' });
ko.components.register('menubar', { require: 'components/menubar/menubar' });
ko.components.register('navigation', { require: 'components/navigation/navigation' });
ko.components.register('catalog-brand-page', { require: 'pages/catalog/brand-page/brand' });
ko.components.register('licence-bar', { require: 'components/licence-bar/licence-bar' });
ko.components.register('loading-modal', { require: 'components/loading-modal/loading-modal' });
ko.components.register('message-dialog', { require: 'components/message-dialog/message-dialog' });
ko.components.register('validation-summary', { require: 'components/validation-summary/validation-summary' });

// ... or for template-only components, you can just point to a .html file directly:
ko.components.register('about-page', {
    template: { require: 'text!pages/about-page/about.html' }
});

// [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]
ko.components.register('private-analytics-summary-page', { require: 'pages/private/analytics-summary-page/analytics-summary' });
ko.components.register('management-integration-endpoint-page', { require: 'pages/management/integration-endpoint-page/integration-endpoint' });
ko.components.register('management-msg-integration-page', { require: 'pages/management/msg-integration-page/msg-integration' });
ko.components.register('management-tenant-settings-page', { require: 'pages/management/tenant-settings-page/tenant-settings' });
ko.components.register('management-facebook-settings-page', { require: 'pages/management/facebook-settings-page/facebook-settings' });
ko.components.register('management-twitter-settings-page', { require: 'pages/management/twitter-settings-page/twitter-settings' });
//[[XO-SCAFFOLDER]]

(<any>ko.bindingHandlers).toggle = {
    init: function (element, valueAccessor, allBindings, data, context) {
        var $element, observable;
        observable = valueAccessor();
        if (!ko.isWriteableObservable(observable)) {
            throw "You must pass an observable or writeable computed";
        }
        $element = $(element);
        $element.on("change", function () {
            $element.bootstrapToggle();
            observable($element.prop('checked'));
        });
        ko.computed({
            disposeWhenNodeIsRemoved: element,
            read: function () {
                $element.prop('checked', observable()).change();
            }
        });
    }
};

// Start the application
cms.infrastructure.Configuration.loadAppSettings(() => {
    ko.applyBindings({ route: router.currentRoute });
    ko.validation.init({
        messagesOnModified: false, insertMessages: false, errorMessageClass: "validationMessage", errorElementClass: "validationElement", decorateElement: true, errorClass: "validationElement"
    });

    ko.validation.rules['url'] = {
        validator: (val, required) => {
            if (!val) {
                return required;
            } else {
                // We are using this regex for removing white spaces.
                val = val.replace(/^\s+|\s+$/, '');
                if (val.indexOf('http://localhost') != -1) {
                    return true;
                }
                else {
                    // We are using this regex statement for validate url. If the val is a valid url, returns true.
                    // The regex statement was taken from: http://bit.ly/1d3lypT
                    return val.match(/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i);
                }
            }
        }
    };
    ko.validation.registerExtenders();
});