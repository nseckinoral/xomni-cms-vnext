/// <amd-dependency path="text!./navigation.html" />
import ko = require("knockout");
import jquery = require("jquery");
import cms = require("app/infrastructure");
import crossroads = require("crossroads");
export var template: string = require("text!./navigation.html");

export class viewModel extends cms.infrastructure.baseViewModel {
    public route: any;
    public navigationItems = ko.observableArray([]);
    private menuItems: Array<MenuItem> = [];
    constructor(params: any) {
        super();
        //Uncomment this code when menu group based nav bar loading needed.
        //cms.infrastructure.shouter.subscribe(t=> {
        //    this.loadSideMenu(t);
        //}, this, 'menuGroupId');
        this.route = params.route;
        this.loadSideMenu(2);

        crossroads.routed.add(function (request, data) {
            console.log(request);
            console.log(data.route + ' - ' + data.params + ' - ' + data.isFirst);
            $("#navigationMenu > li").each((n, e) => { viewModel.slideChildsUpInternal(e)});
        });
    }

    public fetchNavigationData(userRightId: number, success: (result: MenuItem[]) => void): any {
        jquery.ajax(cms.infrastructure.Configuration.AppSettings.BackendAPIURL + "/api/navigation?userRightId=" + userRightId, {
            type: "get",
            contentType: "application/json",
            success: (d, t, s) => {
                success(d);
            },
            error: (r, t, e) => {
                alert(t);
            }
        });
    }

    mainItemClick(item, event) {
        var target;
        if (event.target.nodeName == "SPAN") {
            target = $(event.target).parent();
        }
        else {
            target = $(event.target)
        };
        var followingSibling = target.next();
        if (followingSibling.css('display') == 'none') {
            followingSibling.slideDown();
            target.parent().removeClass("menu_navigation_arrow_up");
            target.parent().addClass("menu_navigation_arrow_down");
        }
        else {
            followingSibling.slideUp();
            target.parent().removeClass("menu_navigation_arrow_down");
            target.parent().addClass("menu_navigation_arrow_up");
        }
        event.stopPropagation();
    }

    public slideChildsUp(elements) {
        viewModel.slideChildsUpInternal(elements[1]);
    }

    public static slideChildsUpInternal(element) {
        var slideUpNotRequired: boolean = false;
        if (element != null) {
            //$(element).children("ul").each((i, e : any) => {

            //    ko.contextFor(e).$data.ChildPages.foreach(function (v) {
            //        if (v.Url.indexOf(window.location.hash) != -1) {
            //            slideUpNotRequired = true;
            //        }
            //    });

            //    if (!slideUpNotRequired) {
            //        e.slideUp();
            //    }
            //});

            $(element).children("ul").slideUp();
            $(element).removeClass("menu_navigation_arrow_down");
            $(element).addClass("menu_navigation_arrow_up");

            ko.contextFor(element).$data.ChildPages.forEach(function (v) {
                if (v.Url.indexOf(window.location.hash) != -1) {
                    $(element).children("ul").slideDown();
                    $(element).removeClass("menu_navigation_arrow_up");
                    $(element).addClass("menu_navigation_arrow_down");

                    $(element).children("ul").children("li").each(function (index) {
                        if (ko.contextFor(this).$data.Url.indexOf(window.location.hash) != -1) {
                            $(this).addClass("menu_navigation_highlight");
                        }
                        else {
                            $(this).removeClass("menu_navigation_highlight");
                        }
                    });
                }
            });
        };
    }




    getUserRightId(): number {
        var userRightId: number;
        if (this.userIsInRole(cms.infrastructure.Roles.ManagementAPI)) {
            userRightId = 3;
        }
        else if (this.userIsInRole(cms.infrastructure.Roles.PrivateAPI)) {
            userRightId = 2;
        }

        return userRightId;
    }

    loadSideMenu(menuGroupId: number) {
        if (this.menuItems.length === 0) {
            var userRightId: number = this.getUserRightId();
            this.fetchNavigationData(userRightId, result=> {
                this.menuItems = result;
                this.filterMenuItems(menuGroupId);
            });
        }
        else {
            this.filterMenuItems(menuGroupId);
        }
    }

    filterMenuItems(menuGroupId: number) {
        if (this.menuItems.length > 0) {
            var menuItems = [];
            for (var i = 0; i < this.menuItems.length; i++) {
                if (this.menuItems[i].MenuGroupId == menuGroupId) {
                    menuItems.push(this.menuItems[i]);
                }
            }
            this.navigationItems(menuItems);
        }
    }
}

export interface MenuItem {
    Id: number;
    Title: string;
    Url: string;
    Order: number;
    ParentPageId: any;
    CssClass: string;
    MenuGroupId: number;
    IsActive: boolean;
    ChildPages: MenuItem[];
    ParentPage: MenuItem;
    PointsToNewCMS: boolean;
}
