import $ = require("jquery");
import ko = require("knockout");
import bootstrap = require("bootstrap");
import router = require("./router");

// Components can be packaged as AMD modules, such as the following:
ko.components.register('dashboard', { require: 'components/dashboard/dashboard' });
ko.components.register('nav-bar', { require: 'components/nav-bar/nav-bar' });
ko.components.register('side-bar', { require: 'components/side-bar/side-bar' });
ko.components.register('catalog-brand-page', { require: 'pages/catalog/brand-page/brand' });

// ... or for template-only components, you can just point to a .html file directly:
ko.components.register('about-page', {
  template: { require: 'text!pages/about-page/about.html' }
});

// [Scaffolded component registrations will be inserted here. To retain this feature, don't remove this comment.]
//[[XO-SCAFFOLDER]]

// Start the application
ko.applyBindings({ route: router.currentRoute });

