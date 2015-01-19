var main;
(function (main) {
    // Reference your test modules here
    var testModules = [
        'pages/catalog/brand-page'
    ];

    // After the 'jasmine-boot' module creates the Jasmine environment, load all test modules then run them
    require(['jasmine-boot'], function () {
        require(testModules.map(function (m) {
            return '../test/' + m;
        }), window.onload);
    });
})(main || (main = {}));
//# sourceMappingURL=SpecRunner.browser.js.map
