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
// ... or for template-only components, you can just point to a .html file directly:
ko.components.register('about-page', {
    template: { require: 'text!pages/about-page/about.html' }
});

// [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]
ko.components.register('private-analytics-summary-page', { require: 'pages/private/analytics-summary-page/analytics-summary' });
ko.components.register('management-integration-endpoint-page', { require: 'pages/management/integration-endpoint-page/integration-endpoint' });
//[[XO-SCAFFOLDER]]

// Start the application
cms.infrastructure.Configuration.loadAppSettings(() => {
    var shouter = new ko.subscribable();
    ko.applyBindings({ route: router.currentRoute, shouter: shouter });
});

