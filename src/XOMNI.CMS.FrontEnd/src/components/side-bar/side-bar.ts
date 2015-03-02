/// <amd-dependency path="text!./side-bar.html" />
import ko = require("knockout");
import jquery = require("jquery");
export var template: string = require("text!./side-bar.html");

export class viewModel {
    public route: any;
    public navigationItems = ko.observableArray([]);

    constructor(params: any) {

        this.route = params.route;
        this.fethNavigationData(2);
    }

    public fethNavigationData(userRightId: number) : any {
        jquery.ajax("http://localhost:38314/api/navigation?userRightId=" + userRightId, {
            type: "get",
            contentType: "application/json",
            success: (d, t, s) => {
                this.navigationItems(d);
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
}
