// require.js looks for the following global when initializing
var require = {
    baseUrl: ".",
    paths: {
        "bootstrap": "bower_modules/components-bootstrap/js/bootstrap.min",
        "crossroads": "bower_modules/crossroads/dist/crossroads.min",
        "hasher": "bower_modules/hasher/dist/js/hasher.min",
        "jquery": "bower_modules/jquery/dist/jquery",
        "jqueryui": "bower_modules/jqueryui/jquery-ui.min",
        "jqrangeslider": "scripts/jQDateRangeSlider-min",
        "jquery-cookie": "bower_modules/jquery-cookie/jquery.cookie",
        "knockout": "bower_modules/knockout/dist/knockout",
        "knockout-projections": "bower_modules/knockout-projections/dist/knockout-projections",
        "signals": "bower_modules/js-signals/dist/signals.min",
        "text": "bower_modules/requirejs-text/text",
        "moment": "bower_modules/moment/min/moment.min",
        "moment-msdate": "scripts/moment-msdate",
        "xomni": "../sdk/xomni",
        "chartist": "bower_modules/chartist/dist/chartist"
    },
    shim: {
        "bootstrap": { deps: ["jquery"] },
        "jquery-cookie": { deps: ["jquery"] },
        "jqueryui": { deps: ["jquery"] },
        "jqrangeslider": { deps: ["jqueryui"] },
        "moment-msdate": { deps: ["moment"] },
        "xomni": { deps: ["jquery"] }
    },
    deps: ["knockout" ,"bootstrap"]
};
