// require.js looks for the following global when initializing
var require = {
    baseUrl: ".",
    paths: {
        "bootstrap": "bower_modules/components-bootstrap/js/bootstrap.min",
        "crossroads": "bower_modules/crossroads/dist/crossroads.min",
        "hasher": "bower_modules/hasher/dist/js/hasher.min",
        "jquery": "bower_modules/jquery/dist/jquery",
        "jquery-cookie": "bower_modules/jquery-cookie/jquery.cookie",
        "knockout": "bower_modules/knockout/dist/knockout",
        "knockout-projections": "bower_modules/knockout-projections/dist/knockout-projections",
        "signals": "bower_modules/js-signals/dist/signals.min",
        "text": "bower_modules/requirejs-text/text",
        "moment": "bower_modules/moment/min/moment.min",
        //"xomni": "bower_modules/xomni/core",
        "chartist": "bower_modules/chartist/dist/chartist"
        //"jquery-ui": "bower_modules/jquery-ui/jquery-ui.min",
        //"jqueryrangeslider": "scripts/jQDateRangeSlider-min"
    },
    shim: {
        "bootstrap": { deps: ["jquery"] },
        "jquery-cookie": { deps: ["jquery-cookie"] }
    }
};
