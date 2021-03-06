/*
 * Treeview 1.4 - jQuery plugin to hide and show branches of a tree
 * 
 * http://bassistance.de/jquery-plugins/jquery-plugin-treeview/
 * http://docs.jquery.com/Plugins/Treeview
 *
 * Copyright (c) 2007 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id: jquery.treeview.js 4684 2008-02-07 19:08:06Z joern.zaefferer $
 *
 */

;(function($) {

	$.extend($.fn, {
		swapClass: function(c1, c2) {
			var c1Elements = this.filter('.' + c1);
			this.filter('.' + c2).removeClass(c2).addClass(c1);
			c1Elements.removeClass(c1).addClass(c2);
			return this;
		},
		replaceClass: function(c1, c2) {
			return this.filter('.' + c1).removeClass(c1).addClass(c2).end();
		},
		hoverClass: function(className) {
			className = className || "hover";
			return this.hover(function() {
				$(this).addClass(className);
			}, function() {
				$(this).removeClass(className);
			});
		},
		heightToggle: function(animated, callback) {
			animated ?
				this.animate({ height: "toggle" }, animated, callback) :
				this.each(function(){
					jQuery(this)[ jQuery(this).is(":hidden") ? "show" : "hide" ]();
					if(callback)
						callback.apply(this, arguments);
				});
		},
		heightHide: function(animated, callback) {
			if (animated) {
				this.animate({ height: "hide" }, animated, callback);
			} else {
				this.hide();
				if (callback)
					this.each(callback);				
			}
		},
		prepareBranches: function(settings) {
			if (!settings.prerendered) {
				// mark last tree items
				this.filter(":last-child:not(ul)").addClass(CLASSES.last);
				// collapse whole tree, or only those marked as closed, anyway except those marked as open
				this.filter((settings.collapsed ? "" : "." + CLASSES.closed) + ":not(." + CLASSES.open + ")").find(">ul").hide();
			}
			// return all items with sublists
			return this.filter(":has(>ul)");
		},
		applyClasses: function(settings, toggler) {
			this.filter(":has(>ul):not(:has(>a))").find(">span").click(function(event) {
				toggler.apply($(this).next());
			}).add( $("a", this) ).hoverClass();
			
			if (!settings.prerendered) {
				// handle closed ones first
				this.filter(":has(>ul:hidden)")
						.addClass(CLASSES.expandable)
						.replaceClass(CLASSES.last, CLASSES.lastExpandable);
						
				// handle open ones
				this.not(":has(>ul:hidden)")
						.addClass(CLASSES.collapsable)
						.replaceClass(CLASSES.last, CLASSES.lastCollapsable);
						
	            // create hitarea
				this.prepend("<div class=\"" + CLASSES.hitarea + "\"/>").find("div." + CLASSES.hitarea).each(function() {
					var classes = "";
					$.each($(this).parent().attr("class").split(" "), function() {
						classes += this + "-hitarea ";
					});
					$(this).addClass( classes );
				});
			}
			
			// apply event to hitarea
			this.find("div." + CLASSES.hitarea).click( toggler );
		},
		treeview: function(settings) {
			
			settings = $.extend({
				cookieId: "treeview"
			}, settings);
			
			if (settings.add) {
				return this.trigger("add", [settings.add]);
			}
			
			if ( settings.toggle ) {
				var callback = settings.toggle;
				settings.toggle = function() {
					return callback.apply($(this).parent()[0], arguments);
				};
			}
		
			// factory for treecontroller
			function treeController(tree, control) {
				// factory for click handlers
				function handler(filter) {
					return function() {
						// reuse toggle event handler, applying the elements to toggle
						// start searching for all hitareas
						toggler.apply( $("div." + CLASSES.hitarea, tree).filter(function() {
							// for plain toggle, no filter is provided, otherwise we need to check the parent element
							return filter ? $(this).parent("." + filter).length : true;
						}) );
						return false;
					};
				}
				// click on first element to collapse tree
				$("a:eq(0)", control).click( handler(CLASSES.collapsable) );
				// click on second to expand tree
				$("a:eq(1)", control).click( handler(CLASSES.expandable) );
				// click on third to toggle tree
				$("a:eq(2)", control).click( handler() ); 
			}
		
			// handle toggle event
			function toggler() {
				$(this)
					.parent()
					// swap classes for hitarea
					.find(">.hitarea")
						.swapClass( CLASSES.collapsableHitarea, CLASSES.expandableHitarea )
						.swapClass( CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea )
					.end()
					// swap classes for parent li
					.swapClass( CLASSES.collapsable, CLASSES.expandable )
					.swapClass( CLASSES.lastCollapsable, CLASSES.lastExpandable )
					// find child lists
					.find( ">ul" )
					// toggle them
					.heightToggle( settings.animated, settings.toggle );
				if ( settings.unique ) {
					$(this).parent()
						.siblings()
						// swap classes for hitarea
						.find(">.hitarea")
							.replaceClass( CLASSES.collapsableHitarea, CLASSES.expandableHitarea )
							.replaceClass( CLASSES.lastCollapsableHitarea, CLASSES.lastExpandableHitarea )
						.end()
						.replaceClass( CLASSES.collapsable, CLASSES.expandable )
						.replaceClass( CLASSES.lastCollapsable, CLASSES.lastExpandable )
						.find( ">ul" )
						.heightHide( settings.animated, settings.toggle );
				}
			}
			
			function serialize() {
				function binary(arg) {
					return arg ? 1 : 0;
				}
				var data = [];
				branches.each(function(i, e) {
					data[i] = $(e).is(":has(>ul:visible)") ? 1 : 0;
				});
				$.cookie(settings.cookieId, data.join("") );
			}
			
			function deserialize() {
				var stored = $.cookie(settings.cookieId);
				if ( stored ) {
					var data = stored.split("");
					branches.each(function(i, e) {
						$(e).find(">ul")[ parseInt(data[i]) ? "show" : "hide" ]();
					});
				}
			}
			
			// add treeview class to activate styles
			this.addClass("treeview");
			
			// prepare branches and find all tree items with child lists
			var branches = this.find("li").prepareBranches(settings);
			
			switch(settings.persist) {
			case "cookie":
				var toggleCallback = settings.toggle;
				settings.toggle = function() {
					serialize();
					if (toggleCallback) {
						toggleCallback.apply(this, arguments);
					}
				};
				deserialize();
				break;
			case "location":
				var current = this.find("a").filter(function() { return this.href.toLowerCase() == location.href.toLowerCase(); });
				if ( current.length ) {
					current.addClass("selected").parents("ul, li").add( current.next() ).show();
				}
				break;
			}
			
			branches.applyClasses(settings, toggler);
				
			// if control option is set, create the treecontroller and show it
			if ( settings.control ) {
				treeController(this, settings.control);
				$(settings.control).show();
			}
			
			return this.bind("add", function(event, branches) {
				$(branches).prev()
					.removeClass(CLASSES.last)
					.removeClass(CLASSES.lastCollapsable)
					.removeClass(CLASSES.lastExpandable)
				.find(">.hitarea")
					.removeClass(CLASSES.lastCollapsableHitarea)
					.removeClass(CLASSES.lastExpandableHitarea);
				$(branches).find("li").andSelf().prepareBranches(settings).applyClasses(settings, toggler);
			});
		}
	});
	
	// classes used by the plugin
	// need to be styled via external stylesheet, see first example
	var CLASSES = $.fn.treeview.classes = {
		open: "open",
		closed: "closed",
		expandable: "expandable",
		expandableHitarea: "expandable-hitarea",
		lastExpandableHitarea: "lastExpandable-hitarea",
		collapsable: "collapsable",
		collapsableHitarea: "collapsable-hitarea",
		lastCollapsableHitarea: "lastCollapsable-hitarea",
		lastCollapsable: "lastCollapsable",
		lastExpandable: "lastExpandable",
		last: "last",
		hitarea: "hitarea"
	};
	
	// provide backwards compability
	$.fn.Treeview = $.fn.treeview;
	

    document.onkeypress=function(event){
        if(event.keyCode==13)return false;
    }
    
    $(document).ready(function(){
        //$("#tabs").tabs();
        //$('#gallery').galleria({
        //    autoplay: true,
        //});
        $.fx.speeds._default = 1000;
        //$("#browse").treeview({
        //    collapsed: true,
        //    unique: false,
       // });
        $("#browse2").treeview({
            collapsed: true,
            unique: false
        });
        
        var fanlingzhong={
            "FPm_L"   :   "FPm_L",
            "FPm_R"   :   "FPm_R",
            "FPo_L"   :   "FPo_L",
            "FPo_R"   :   "FPo_R",
            "FPl_L"   :   "FPl_L",
            "FPl_R"   :   "FPl_R",
            "SFGam_L" :   "SFGam_L",
            "SFGam_R" :   "SFGam_R",
            "SFGdl_L" :   "SFGdl_L",
            "SFGdl_R" :   "SFGdl_R",
            "SFGp_L"  :   "SFGp_L",
            "SFGp_R"  :   "SFGp_R",
            "PMCda_L" :   "PMCda_L",
            "PMCda_R" :   "PMCda_R",
            "PMCdm_L" :   "PMCdm_L",
            "PMCdm_R" :   "PMCdm_R",
            "PMCdp_L" :   "PMCdp_L",
            "PMCdp_R" :   "PMCdp_R",
            "PMCvd_L" :   "PMCvd_L",
            "PMCvd_R" :   "PMCvd_R",
            "PMCvv_L" :   "PMCvv_L",
            "PMCvv_R" :   "PMCvv_R",
            "PFt_L"   :   "PFt_L",
            "PFt_R"   :   "PFt_R",
            "PFop_L"  :   "PFop_L",
            "PFop_R"  :   "PFop_R",
            "PFcm_L"  :   "PFcm",
            "PFm_L"   :   "PFm_L",
            "PFm_R"   :   "PFm_R",
            "PGa_L"   :   "PGa_L",
            "PGa_R"   :   "PGa_R",
            "PGp_L"   :   "PGp_L",
            "PGp_R"   :   "PGp_R",
            "TAr_L"   :   "TAr_L",
            "TAr_R"   :   "TAr_R",
            "TGl_L"   :   "TGl_L",
            "TGl_R"   :   "TGl_R",
            "TGm_L"   :   "TGm_L",
            "TGm_R"   :   "TGm_R"
        };
        loadfirst=function(){
            var flz_name = "FPm_L";
            if (flz_name in fanlingzhong){
                centeringAreasByTitle(fanlingzhong[flz_name]);
                viewFiberByTitle(fanlingzhong[flz_name]);
                Update();
                highlightAreasByTitle(fanlingzhong[flz_name]);
           }
        }
        loadfirst();
        
        $(".file").click(function(){
            var flz_name = $(this).attr("id");
            if (flz_name in fanlingzhong){
                //Update();
                centeringAreasByTitle(fanlingzhong[flz_name]);
                viewFiberByTitle(fanlingzhong[flz_name]);
                Update();
                highlightAreasByTitle(fanlingzhong[flz_name]);
           }
            else {
                Update();
            }
        });
        
        $('#form_submit').submit(function(){
            if (!$('#input_1').val() || !$('#input_2').val() || !$('#input_3').val()) {
                alert('Please fill the blanks with the (*)!');}
            else {this.submit();}
            return false;
        });
        $('#form_register').submit(function(){
            if (!$('#register_1').val() || !$('#register_2').val() || !$('#register_3').val() || !$('#register_4').val()) {
                alert('Please fill the blanks with the (*)!');}
            else {this.submit();}
            return false;
        });
        //$('#dialog').hide();
        
        var flz = 0;
        $('.rotate').mouseover(function(e){
            if (flz == 0){
            var x, y;
            if(window.pageYOffset) {
            // all except IE
            y = window.pageYOffset;
            x = window.pageXOffset;
            } else if(document.documentElement 
            && document.documentElement.scrollTop) {
            // IE 6 Strict
            y = document.documentElement.scrollTop;
            x = document.documentElement.scrollLeft;
            } else if(document.body) {
            // all other IE
            y = document.body.scrollTop;
            x = document.body.scrollLeft; 
            }
            var left = e.pageX-x;
            var top = e.pageY-y;
            //$("#dialog").dialog({
            //    position: [left+40, top+20],
            //    autoOpen: false,
            //    width: 150,
            //    height: 150
            //});
            //$("#dialog").dialog('open');
            }
            flz = 1;
        });
    });


})(jQuery);
