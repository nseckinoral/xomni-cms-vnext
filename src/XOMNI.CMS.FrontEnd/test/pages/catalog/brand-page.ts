/// <reference path="../../../definitions/jasmine/jasmine.d.ts" />

define(["pages/catalog/brand-page/brand", "jquery"], (brandPage) => {
    var brandViewModel = brandPage.viewModel;
    var instance = new brandViewModel();

    describe('Brand page view model', () => {

        it("should make an AJAX request to the correct URL", function () {
            spyOn($, "ajax")
                .and
                .callFake(params => {
                    expect(params).toContain("/brands?skip=0&take=25");
                });
            instance.list();
        });
        

        //it("should parse the brand list correctly.", function () {
        //    spyOn(instance, "getAll")
        //        .and
        //        .returnValue({
        //            "Data": {
        //                "Results": [
        //                    {
        //                        "Id": 1,
        //                        "Name": "Brand 1"
        //                    },
        //                    {
        //                        "Id": 2,
        //                        "Name": "Brand 2"
        //                    },
        //                    {
        //                        "Id": 3,
        //                        "Name": "Brand 3"
        //                    }
        //                ],
        //                "TotalCount": 8
        //            }
        //        });
        //    instance.getAll();
        //    alert(instance.pagedBrands());
        //});
        //it('should supply hit the staging api.', () => {
        //    var instance = new brandViewModel();
        //    expect(instance.getAll().TotalCount).toEqual(5);

        //    //// See the message change
        //    //instance.doSomething();
        //    //expect(instance.message()).toContain('You invoked doSomething()');
        //});

    });
});
