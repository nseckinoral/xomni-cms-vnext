/// <amd-dependency path="text!./side-bar.html" />
import ko = require("knockout");
import jquery = require("jquery");
export var template: string = require("text!./side-bar.html");

export class viewModel {
    public route: any;
    public navigationItems = ko.observableArray([]);
    private menuItems: Array<MenuItem> = [];
    constructor(params: any) {
        //params.shouter.subscribe(t=> {
        //    this.loadSideMenu(t);
        //}, this, 'MenuGroupId');
        this.route = params.route;
        this.loadSideMenu(1);
    }

    public fetchNavigationData(userRightId: number, success: (result: MenuItem[]) => void): any {
        jquery.ajax("http://localhost:38314/api/navigation?userRightId=" + userRightId, {
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

    slideChildsUp(elements) {
        if (elements != null) {
            $(elements[1]).children("ul").slideUp();
            $(elements[1]).addClass("menu_navigation_arrow_up");

            ko.contextFor(elements[1]).$data.ChildPages.forEach(function (v) {
                if (v.Url.indexOf(window.location.hash) != -1) {
                    $(elements[1]).children("ul").slideDown();
                    $(event.target).parent().removeClass("menu_navigation_arrow_up");
                    $(event.target).parent().addClass("menu_navigation_arrow_down");

                    $(elements[1]).children("ul").children("li").each(function (index) {
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
        var cookie = document.cookie.split(';')[0].split('=')[1];
        var credentials: any = $.parseJSON(cookie);
        var roles: string[] = credentials.Roles;
        var userRightId: number;
        if (roles.indexOf('ManagementAPI') != -1) {
            userRightId = 3;
        }
        else if (roles.indexOf('PrivateAPI') != -1) {
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
