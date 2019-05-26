(function($){
	$(document).ready(documentReady);
	
	function documentReady(){
		
		function addClickEffect(element) {
		    var ink, d, x, y;
		    element.css({"overflow":"hidden"});
		    element.bind("click touchstart",function(e) {
		    	var _this = $(this);
		        _this.find(".ink").remove();
		        if (_this.children(".ink").length === 0) {
		           _this.append("<b class='ink'></b>");
		        }
		       
		        ink = _this.find(".ink");
		        ink.removeClass("animate-ink");
		        if (!ink.height() && !ink.width()) {
		            d = Math.max(_this.outerWidth(),_this.outerHeight());
		            ink.css({
		                height: d,
		                width: d
		            })
		        }
		        x = e.pageX -_this.offset().left - ink.width() / 2;
		        y = e.pageY -_this.offset().top - ink.height() / 2;
		        ink.css({
		            top: y + 'px',
		            left: x + 'px'
		        }).addClass("animate-ink")
		    })
		}
		
		//顶部时间
		var _times_box = $("#times-box"),
			_console = $("#x-console");
			
	    function showTime(){
	    	try{
	    		var today = new Date();
		        var weekday=["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];
		     	var _data = {
		     		y : x.getStringRight("0000"+today.getFullYear(),4)+"年",
			        month : x.getStringRight("00"+(today.getMonth()+1),2)+"月",
			        td : x.getStringRight("00"+today.getDate(),2)+"日",
			        d : weekday[(today.getDay()-1)<0? 6:today.getDay()-1],
			        h : x.getStringRight("00"+today.getHours(),2)+"",
			        m : x.getStringRight("00"+today.getMinutes(),2)+"",
			        s : x.getStringRight("00"+today.getSeconds(),2)+""
		     	};
		     	
		        _data["time"] = _data["h"]+":"+_data["m"]+":"+_data["s"];
		        _data["date"] = _data["y"]+""+_data["month"]+""+_data["td"];
		        _data["week"] = _data["d"];
		        
		        if( _data["time"].length!=8){
		        	var _t = window.pageObject.getLocalStorage();
		        	if(!_t["error"]){
		        		_t["error"] = [];
		        	}
		        	
					_t["error"].push({
						"type" : "time error", 
						"message" : _data["time"]
					});
					window.pageObject.setLocalStorage(_t);
		        };
		        
		        var _s = "";
		        for(var i in _data["week"]){
		        	_s += _data["week"][i] + "&nbsp;&nbsp;";
		        }
		        _s = _s.replace(/(&nbsp;&nbsp;*$)/g, "");
		         _data["week"] = _s;
		        var _html = template("TemplateTopTimes",_data);
		        _times_box.html(_html);
	    	}catch(e){
	    		//TODO handle the exception
	    	}
	        
	        
	        setTimeout(function(){
	        	showTime();
	        },1000);
	    }
	    showTime();
	    
	    
	    //顶部按钮区
		$.each($(".botton-group > .one-line > .title"), function(index,el) {
			addClickEffect($(el));
		});
		$(".botton-group > .one-line > .title").on("click",function(event){
			$(this).next().show();
		});
		$(".botton-group > .one-line").on("mouseleave",function(event){
			$(this).find(".menu-xiala").hide();
		});
		
		//换肤
		$("[x_bind_button_name='SetSkin']").on("click",function(event){
			var _this = $(this),
				_body = $("body");
			_this.closest(".menu-xiala").hide();
			
			var _arr = ["default","blue","green","red","yellow"];
			
			for(var i in _arr){
				_body.removeClass("skin-"+_arr[i]);
			}
			
			_body.addClass(_this.attr("skin"));
				
			var _t = window.pageObject.getLocalStorage();
			_t["x-skin"] = _this.attr("skin");
			window.pageObject.setLocalStorage(_t);
			return false;
		});
	}
})(jQuery);

var xydWebFunction;
(function(b, c) {
	b(window).ready(function() {
		function e() {
			var a = b("#head-nav-box");
			_l = a.find(".nav-left-box");
			_c = a.find(".nav-center-box");
			_r = a.find(".nav-right-box");
			a = a.outerWidth() - _l.outerWidth() - _r.outerWidth();
			_c.css({
				width: a - 35 + "px",
				"margin-left": _l.outerWidth() + "px"
			})
		}
		c = {
			fn: {},
			module: {}
		};
		var f = b("#xyd-header,#xyd-bottom"),
			d;
		for(d in XYDCONFIG) f.find("[data-input-name\x3d'" + d + "']").html(XYDCONFIG[d]);
		c.fn.setPageContentHeight = function() {
			var a = b("body"),
				c = window.pageObject.getLocalStorage();
			//更换皮肤
			a.addClass(c["x-skin"] || "skin-blue").addClass(c["xyd-model"] || "");
			var a = b("#xyd-panel-content-line"),
				c = b("#xyd-header"),
				e = b("#xyd-bottom"),
				d = b("#xyd-right-header"),
				g = b("#xyd-right-content"),
				f = b("#xyd-right-content-element"),
				h = b("#panel-left");
			a.outerHeight();
			c.outerHeight();
			d.outerHeight();
			e.outerHeight();
			h.css({
				height: a.outerHeight() - c.outerHeight() + "px"
			});
			d.css({
				width: a.outerWidth() - h.outerWidth() + "px"
			});
			g.css({
				width: a.outerWidth() - h.outerWidth() + "px",
				height: a.outerHeight() - c.outerHeight() - d.outerHeight() - e.outerHeight() - 1 + "px",
				"margin-top": "1px"
			});
			f.css({
				width: g.outerWidth() - 40 + "px",
				height: g.outerHeight() - 40 + "px"
			})
		};
		b(window).resize(function() {
			c.fn.setPageContentHeight();
			e()
		});
		c.fn.getTreeCheckedNodes = function(a) {
			return b.fn.zTree.getZTreeObj(a).getCheckedNodes(!0)
		};
		c.fn.getTreeSelectedNodes = function(a) {
			return b.fn.zTree.getZTreeObj(a).getSelectedNodes()
		};
		c.module.bindButton1 = function() {
			b(document).on("click", ".button_on", function(a) {
				a = b(this).attr("data-state");
				b(this).css("left");
				"undefined" !== a && "1" == a ? (a = "-60", b(this).attr("data-state", "0")) : (a = "0", b(this).attr("data-state", "1"));
				b(this).animate({
					left: a + "px"
				})
			})
		};
		c.module.init = function() {
			c.fn.setPageContentHeight();
			e()
		};
		c.module.init();
		b("#shrinkage-box").on("click", function() {
			var a = b("body"),
				d = window.pageObject.getLocalStorage();
			a.hasClass("model-simple") ? (a.removeClass("model-simple"), delete d["xyd-model"]) : (a.addClass("model-simple"), d["xyd-model"] = "model-simple");
			window.pageObject.setLocalStorage(d);
			c.fn.setPageContentHeight();
			e()
		})
	})
})(jQuery, xydWebFunction);