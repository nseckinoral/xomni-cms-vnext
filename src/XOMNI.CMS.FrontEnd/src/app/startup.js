define(["require", "exports", "knockout", "./router", "app/infrastructure"], function(require, exports, ko, router, cms) {
    // Components can be packaged as AMD modules, such as the following:
    ko.components.register('dashboard', { require: 'components/dashboard/dashboard' });
    ko.components.register('nav-bar', { require: 'components/nav-bar/nav-bar' });
    ko.components.register('side-bar', { require: 'components/side-bar/side-bar' });
    ko.components.register('catalog-brand-page', { require: 'pages/catalog/brand-page/brand' });
    ko.components.register('licence-bar', { require: 'components/licence-bar/licence-bar' });

    // ... or for template-only components, you can just point to a .html file directly:
    ko.components.register('about-page', {
        template: { require: 'text!pages/about-page/about.html' }
    });

    // [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]
    ko.components.register('private-analytics-summary-page', { require: 'pages/private/analytics-summary-page/analytics-summary' });

    //[[XO-SCAFFOLDER]]
    // Start the application
    cms.infrastructure.Configuration.loadAppSettings(function () {
        var shouter = new ko.subscribable();
        ko.applyBindings({ route: router.currentRoute, shouter: shouter });
    });
});
//# sourceMappingURL=startup.js.map
