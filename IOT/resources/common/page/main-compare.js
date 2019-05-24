(function($){
	$(document).ready(main_documentReady);
	
	function main_documentReady(){
		
		/**
		 * 兼容event
		 * @param {Object} event
		 */
		function PublicReturnEvent(event){
			return event || window.event;
		}
		
		//设置面板高度
		function SetMainContentHeight(){
			var _w = $("#model-windows");
			var _arr = ["#model-header"];
			var _hs = _w.outerHeight();
			for(var i in _arr){
				_hs -= $(_arr[i]).outerHeight();
			}
			_hs -= 10;
			//$("#model-content").css({"height":(_hs)+"px"});
		}
		
		//设置模型块的尺寸
		function SetModelSize(){
			var _src = $("#src-model-box");
			
			var _w = _src.outerWidth();
			var _h = _w * 0.4;
			_src.css({"height":_h+"px"});
		}
		
		//初始化body
		function InitBody(){
			SetMainContentHeight();
			SetModelSize();
		}
		InitBody();
		
		$(window).resize(function(){
			InitBody();
		});
			
		function addClickEffect(element) {
		    var ink, d, x, y;
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
		
		/**
		 * 获取数据（公共方法）
		 * @param {Object} o
		 */
		function GetServerJsonData(o){
			var _p = {
				success : function(data){
					o["success"](data);
				},
				error : function(a,b,c){}
			};
			$.extend(true, _p, o);
			x.ajax(_p);
		}
		
		//顶部时间
		var _times_box = $("#times-box");
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
		        var _s = "";
		        for(var i in _data["week"]){
		        	_s += _data["week"][i] + "&nbsp;&nbsp;";
		        }
		        _s = _s.replace(/(&nbsp;&nbsp;*$)/g, "");;
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
	    
	    //返回上一页窗口
	     var _btn_compare = $("#x-btn-main-window");
	    _btn_compare.on("click",function(){
	    	location.href = "main.html";
	    });
	    
	    //获取对比数据
		GetServerJsonData({
			url : "JSON/data3.json",
			success : function(data){
				SetTemplateDataModelCompare(data);
			}
		});
		
		function SetTemplateDataModelCompare(data){
			var _box = $("#compare-font-ul");
			data["datalist"] = [];
			for(var i in data["result"]){
				var _d = data["result"][i];
				data.datalist.push(_d);
			}
			
			var _data = {
				data : {
					key : data["key"]
				},
				datalist : data["datalist"]
			};
			_data["run"] = true;
			
			//静态调试模式
			var _html = template("TemplateCompareDataPanel",_data);
			_box.append(_html);
			
			_BindEventModelCompare( _box.parent().find(".compare-font-title"));
			/**
			 * 绑定属性面板事件
			 * @param {Object} element
			 */
			function _BindEventModelCompare(element){
			    element.on("click",function(){
					var _this = $(this),
						_parent = _this.parent();
					if(_this.hasClass("panel-hide")){
						//显示
						_this.removeClass("panel-hide");
						_this.find(".x-iconfont-down").removeClass("fa-plus-circle").addClass("fa-minus-circle");
						_this.next().slideDown();
					}else{
						//隐藏
						_this.addClass("panel-hide");
						_this.find(".x-iconfont-down").removeClass("fa-minus-circle").addClass("fa-plus-circle");
						_this.next().slideUp();
					}
					
			    });
			    addClickEffect(element);
			}
			
			//设置面板高度
			function SetModelCompareFontUlHeight(){
				var _w = $("#model-content");
				var _arr = ["#compare-3d","#compare-font-box > .compare-font-title:eq(0)"];
				var _hs = _w.outerHeight();
				for(var i in _arr){
					_hs -= $(_arr[i]).outerHeight();
				}
				_hs -= 30;
				$("#compare-font-ul").css({"height":(_hs)+"px"});
			}
			/*
			SetModelCompareFontUlHeight();
			$(window).resize(function(){
				SetModelCompareFontUlHeight();
			});
			
			
			_box.mCustomScrollbar({
				theme: 'minimal-dark',
				scrollInertia: 100,
				axis: 'yx',
				mouseWheel: {
					enable: true,
					axis: 'y',
					preventDefault: true
				}
			});
			*/
		}
	    
	    
	    //搜索面板
		GetServerJsonData({
			url : "JSON/data2.json",
			success : function(data){
				GetTemplateModelSearchWindow(data);
			}
		});
		
		function GetTemplateModelSearchWindow(data){
			
			var _model_search_box = $("#jquery-accordion-menu");
			
			//动态调试模式
			data = {
				data : data
			};
			_model_search_box.modelSearchWindow(data);
			
			_model_search_box.find("a[model-id]").on("click",function(){
				if(!_webObject){
					alert("_webObject未初始化");
					//return false;
				}
				var _this = $(this);
				var _id = _this.attr("model-id");

				if(_id!=="040102040332"){
					alert("没有该模型数据");
					//return false;
				}else{
					_webObject.create();
					$("#button-search").click();
				}
				

			})
			

			$.expr[":"].Contains = function(a, i, m) {
				//console.info(a,i,m);
				return (a.textContent || a.innerText || "").toUpperCase().indexOf(m[3].toUpperCase()) >= 0;
			};
			function filterList(header, list) {
				//@header 头部元素
				//@list 无序列表
				//创建一个搜素表单
				var form = $("<form>").attr({
					"class":"filterform",
					action:"#"
				}), input = $("<input>").attr({
					"class":"filterinput",
					type:"text",
					placeholder : "请输入..."
				});
				$(form).append(input).appendTo(header);
				$(input).change(function() {
					var filter = $(this).val();
					if (filter) {
						$matches = $(list).find("a:Contains(" + filter + ")").parent();
						$("li", list).not($matches).slideUp();
						$matches.slideDown();
					} else {
						$(list).find("li").slideDown();
					}
					return false;
				}).keyup(function() {
					$(this).change();
				});
			}
			filterList($("#form"), _model_search_box.find(">ul"));
			
			_model_search_box.jqueryAccordionMenu();
			_model_search_box.mCustomScrollbar({
				theme: 'minimal-dark',
				scrollInertia: 100,
				axis: 'yx',
				mouseWheel: {
					enable: true,
					axis: 'y',
					preventDefault: true
				}
			});
			
		}
		
		//按钮搜索
		var _search_panel = $("#search-input-box");
		$("#button-search").on("click",function(){
			var _this = $(this),
				_id = _this.attr("id"),
				_name = "";
			if(_search_panel.hasClass("panel-hide")){
				_name = "bounceInLeft";
				_search_panel.show().removeClass("panel-hide");
			}else{
				_search_panel.addClass("panel-hide");
				_name = "bounceOutLeft";
			}
			_search_panel.css({"left":"0"});
			window.animatelo[_name]("#"+_search_panel.attr("id"));
		});
		
		var _search_panel1 = $("#search-input-box1");
		$("#button-search1").on("click",function(){
			var _this = $(this),
				_id = _this.attr("id"),
				_name = "";
			if(_search_panel1.hasClass("panel-hide")){
				_name = "bounceInRight";
				_search_panel1.show().removeClass("panel-hide");
			}else{
				_search_panel1.addClass("panel-hide");
				_name = "bounceOutRight";
			}
			_search_panel1.css({"left":"0"});
			window.animatelo[_name]("#"+_search_panel1.attr("id"));
		});
		
		
		
		//切换背景
		var _header_btn_group = $("#model-header .page-config");
		_header_btn_group.find("#x-btn-config").on("click",function(event){
			$(this).next().show();
		});

		_header_btn_group.on("mouseleave",function(event){
			$(this).find(".menu-xiala").hide();
		});
		
		_header_btn_group.find("[x_bind_button_name='SetSkin']").on("click",function(event){
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
