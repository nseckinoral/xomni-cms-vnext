/// <reference path="../../definitions/jasmine/jasmine.d.ts" />
define(["pages/brand-page/brand", "jquery"], function (brandPage, jquery) {
    var brandViewModel = brandPage.viewModel;

    describe('Home page view model', function () {
        it('should supply hit the staging api.', function () {
            var instance = new brandViewModel();
            expect(instance.getAll().TotalCount).toEqual(5);
            //// See the message change
            //instance.doSomething();
            //expect(instance.message()).toContain('You invoked doSomething()');
        });
    });
});
//# sourceMappingURL=brand-page.js.map
