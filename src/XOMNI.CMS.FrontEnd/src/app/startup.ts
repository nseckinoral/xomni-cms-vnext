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
ko.components.register('error-dialog', { require: 'components/error-dialog/error-dialog' });
// ... or for template-only components, you can just point to a .html file directly:
ko.components.register('about-page', {
    template: { require: 'text!pages/about-page/about.html' }
});

// [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]
ko.components.register('private-analytics-summary-page', { require: 'pages/private/analytics-summary-page/analytics-summary' });
ko.components.register('management-integration-endpoint-page', { require: 'pages/management/integration-endpoint-page/integration-endpoint' });
ko.components.register('management-msg-integration-page', { require: 'pages/management/msg-integration-page/msg-integration' });
ko.components.register('management-tenant-settings-page', { require: 'pages/management/tenant-settings-page/tenant-settings' });
ko.components.register('management-twitter-settings-page', { require: 'pages/management/settings-page/twitter-settings' });
ko.components.register('management-facebook-settings-page', { require: 'pages/management/settings-page/facebook-settings' });
//[[XO-SCAFFOLDER]]

// Start the application
cms.infrastructure.Configuration.loadAppSettings(() => {
    ko.applyBindings({ route: router.currentRoute });
    ko.validation.init({ messagesOnModified: true, errorMessageClass: "validationMessage" });
});