define(['components/brands-page/brands' , 'jquery'], function(brandPage, $) {
  var BrandPageViewModel = brandPage.viewModel;

  describe('Brands page view model', function() {
    it('should total brand count must be equal 4', function () {
      var instance = new BrandPageViewModel();
      var a = instance.list();
      dump(a);
      expect(instance.brands().length).toEqual(4);
    });
  });
});
