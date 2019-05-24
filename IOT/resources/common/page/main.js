(function($){
	$(document).ready(documentReady);
	
	function documentReady(){
		
		/**
		 * 兼容event
		 * @param {Object} event
		 */
		function PublicReturnEvent(event){
			return event || window.event;
		}
		
		
		
		/**
		 * 修正mCustomScrollbar插件滚动条D致的bug
		 * @param {Object} element
		 */
		
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
		
		/**
		 * 公共dom对象
		 */
		
		var _body = $("body");
		
		
		//切换模型到简单模式
		function SetModelViewToSimple(){
			_body.removeClass("model-normal").addClass("model-simple");
		}
		
		//切换模型到正常模式
		function SetModelViewToNormal(){
			_body.removeClass("model-simple").addClass("model-normal");
		}
		
		//搜索面板
		GetServerJsonData({
			//url : "JSON/data2-1.json",
			//url : "/webgis/page/webgis/sdmx/getSWMXTree",
			url : window.MOLDEL.GetUrl("GetModelList"),
			success : function(data){
				GetTemplateModelSearchWindow(data);
			}
		});
		
		function GetTemplateModelSearchWindow(data){
			
			var _model_search_box = $("#jquery-accordion-menu");
			
			//静态调试模式
//			_html = template("TemplateModelSearchWindow",{run : true});
//			_model_search_box.append(_html);
			
			//动态调试模式
			data = {
				data : data["SWMXTree"]
			};
			_model_search_box.modelSearchWindow(data);
			
			_model_search_box.find("a[model-id]").on("click",function(){
				if(!_webObject){
					layer.alert("模型数据没有初始化");
					return false;
				}
				var _this = $(this);
				var _bind_data = _this.attr("_bind_data");
				try{
					_bind_data = JSON.parse(_bind_data);
				}catch(e){
					_bind_data = {};
				}
				
				if(!_bind_data["id"]){
					layer.alert("没有该模型数据");
				}else{
					
					var _obj = {
						win : 0,
						url : _bind_data["mxurl"],
						id : _bind_data["zbnm"]
					};
					
					_webObject._NewModel = function(_obj){
						
						//切换简单模式
						SetModelViewToSimple();
						
						var _box = $("#model-search-box");
						_box.setElValue({
							name : "--"
						});
						
						$("#button-search").click();
						function Web3DLoader(){
							if(_webObject.isLoad(_obj.win,_obj.id)===true){
								
								_box.setElValue({
									name : _this.text()
								});
								
								//请求属性面板
								HttpGetModelAttribute(_obj.id);
								
								//请求综合数据
								HttpGetCountDataPanel(_bind_data["zbnm"]);
								
								setTimeout(function(){
									SetModelViewToNormal();
								},1000);
								
							}else{
								setTimeout(function(){
									Web3DLoader();
								},500);
							}
						}
						Web3DLoader();
						_webObject.create(_obj.win,_obj.url,_obj.id);
					}
					
					//如果第一次载入
					if(_webObject.curModel.has(_obj.win)===false){
						_webObject._NewModel(_obj);
					}else{
						
						if(_webObject.isLoad(_obj.win,_obj.id)===true){
							//如果已经加载,就show原模型
							_webObject.setShow(_obj.win,_obj.id,true);
							layer.msg("模型已加载",{time:3000});
						}else{
							layer.confirm("确认选择其它模型吗？选择其它会清空当前模型。",function(){		
								//修改默认旋转状态
								var ck = $("#control-panel").find("[name='rotation']").find("[type='checkbox']");
								if(ck.prop("checked")){
									ck.trigger("click");
								}															
								_webObject.remove(_obj.win,_webObject.curModel.get(_obj.win));
								layer.closeAll();
								_webObject._NewModel(_obj);
							});
						}
						
					}
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
		
		
		//属性面板
		function HttpGetModelAttribute(id){
			var _box = $("#model-attribute-box");
			_box.empty();
			GetServerJsonData({
				//url : "JSON/data1.json",
				//url : "/webgis/page/webgis/sdmx/getDHSYTree?SWMXNM="+id,
				//url : "JSON/data1-1.json",
				//url : "/webgis/page/webgis/sdmx/querySWMXXX?SWMXNM="+id,
				url : window.MOLDEL.GetUrl("GetModelAttribute") + "?SWMXNM=" + id,
				success : function(data){
					_box.attr("_bind_zbnm",id);
					GetTemplateModelAttribute(data);
				},
				error : function(){
					_box.append("数据加载失败");
				}
			});
		}
		
		function GetTemplateModelAttribute(data){
			//console.info("进入GetTemplateModelAttribute");
			var _box = $("#model-attribute-box");
			//合并数据
			function MergeArray(arr,obj){
				for(var i in obj){
					arr.push(obj[i]);
				}
				return arr;
			}
			
			//格式化数据
			var _datalist = [];
			_datalist = MergeArray( _datalist, data["zbzhmap"]["SWMXTree"]);
			_datalist = MergeArray( _datalist, data["wljgmap"]["SWMXTree"]);
			_datalist = MergeArray( _datalist, data["xtzcmap"]["SWMXTree"]);
			_datalist = MergeArray( _datalist, data["yhbwmap"]["SWMXTree"]);
			_datalist = MergeArray( _datalist, data["zznlmap"]["SWMXTree"]);
			
			function HandlerFormatData(data){
				for(var i=0;i<data.length;i++){
					var _d = data[i];
					if(_d["children"]){
						HandlerFormatData(_d["children"]);
					}
				}
				return data;
			}
			data = {
				data : _datalist
			};
			_box.attributeMenu(data);
			
			//隐藏所有ul
			_box.find(".one-line > ul ul").hide();
			
			//绑定第一层标题
			_box.find(".one-line > a").each(function(index,el){
				var _a = $(el);
				_a.find(".iconfont:eq(0)").addClass("fa-sitemap");
				_a.find(".iconfont:eq(1)").addClass("fa-minus-circle");
			})
			
			//给第二层所有a标签加iconfont
			_box.find(".one-line > ul a").addClass("panel-hide").each(function(index,el){
				var _a = $(el);
				if(_a.nextAll().length>0){
					_a.find(".iconfont:eq(0)").addClass("fa-tags");
					_a.find(".iconfont:eq(1)").addClass("fa-plus-circle");
				}
			});
			_BindModelAttribute(_box);
				
			//设置面板高度
			function SetAttributeHeight(){
				var _w = $("#body-background-image"),
					_h = $("#model-header"),
					_s = $("#model-search-box"),
					_f = $("#foot-button-group");
				var _hs = _w.outerHeight()-_h.outerHeight()-_s.outerHeight() - _f.outerHeight() - 100;
				$("#diy-scrollbar-model-attribute-box").css({"height":(_hs)+"px"});
			}
			SetAttributeHeight();
			$(window).resize(function(){
				SetAttributeHeight();
			});
				
			
			$("#diy-scrollbar-model-attribute-box").mCustomScrollbar({
				theme: 'minimal-dark',
				scrollInertia: 100,
				axis: 'yx',
				autoUpdate : true,
				mouseWheel: {
					enable: true,
					axis: 'y',
					preventDefault: true
				}
			});
			
			
			
			/**
			 * 绑定属性面板事件
			 * @param {Object} element
			 */
			function _BindModelAttribute(element){
				element.find("a").on("click touchstart",function(event){
					event = PublicReturnEvent(event);
					var _this = $(this),
						_parent = _this.parent();
					
					if(_this.hasClass("panel-hide")){
						//显示
						_this.removeClass("panel-hide");
						_this.find(".x-iconfont-down").removeClass("fa-plus-circle").addClass("fa-minus-circle");
						_parent.find(">ul").slideDown(300);
					}else{
						//隐藏
						_this.addClass("panel-hide");
						_this.find(".x-iconfont-down").removeClass("fa-minus-circle").addClass("fa-plus-circle");
						_parent.find(">ul").slideUp(300);
					}
					_this.closest("#model-attribute-box").find(".one-line a").removeClass("action");
					_this.addClass("action");
					//_parent.siblings().find(">ul").slideUp(300);
					
					
					
					var _bind_zbnm = _this.closest(".model-attribute-box").attr("_bind_zbnm");			
					var _bind_data = _this.attr("_bind_data");
					try{
						_bind_data = JSON.parse(_bind_data);
					}catch(e){
						_bind_data = {};
					}
					
					if(_bind_data["isflag"]!="1"){
						return false;
					}
					
					//子模型
					var _obj = _bind_data["zmx"]["zmxzcmap"];
					if(_obj.length<1){
						layer.msg("该模型没有对应数据！");
						return false;
					}
					
					_obj = _obj[0];
					_webObject.locateNode(0,_bind_zbnm,3000,_obj["zcbz"]);
					
					
					//模型动画
					var dh = _bind_data["zmx"]["zmxdhmap"];
					dh = dh.length<1 ? null : dh[0];
					
					if(dh){
						//Take 001
						_webObject.playAction(0,_bind_zbnm,"Take 001",parseInt(dh["dhksz"]),parseInt(dh["dhjsz"]));
					}
				});
				addClickEffect(element.find("a"));
			}
		}
		
		
		//右侧综合数据面板
		function HttpGetCountDataPanel(id){
			var _box = $("#count-data-ul-box");
			_box.empty();
			
			GetServerJsonData({
				//url : "/webgis/page/webgis/swmx/getJbxx?ZBNM=" + id,
				//url : "JSON/data3.json",
				url : window.MOLDEL.GetUrl("GetModelCountInfo") + "?ZBNM=" + id,
				success : function(data){
					GetTemplateCountDataPanel(data);
				}
			});
		}
		
		
		//右侧数据格式化
		function FomatCountDataPanel(obj){
			var _zb = obj["entityZB"] || {};
			var data = {
				mc : _zb["mc"],
				arrXNCS_A : _zb["arrXNCS_A"] || [],
				arrXNCS_B :_zb["arrXNCS_B"] || [],
				gjdq : _zb["gjdq"],
				info : _zb["info"],
				date : _zb["date"],
				media : _zb["arrPic"][0],
				nm : _zb["nm"]
			};
			
			var _t = {
				jgmc : "国家/地区",
				sjzforOrg : data["gjdq"]
			}
			data.arrXNCS_B.push(_t);
			
			for(var i in data.arrXNCS_A){
				data.arrXNCS_B.push(data.arrXNCS_A[i]);
			}
			
			delete data.arrXNCS_A;
			return data;
		}
		
		function GetTemplateCountDataPanel(data){
			var _box = $("#count-data-ul-box");
			
			if(!data["entityZB"]){
				layer.alert("模型ZB描述信息数据请求失败!");
				return;
			}
			data = FomatCountDataPanel(data);
			
			data = {
				run : true,
				data : data
			}
			//console.info(data);
			
			//静态调试模式
			var _html = template("TemplateCountDataPanel",data);
			_box.append(_html);
			var pic = data["data"]["media"];
			if(pic){
				//var _url = window.MOLDEL.GetUrl("GetMBImg")+"/"+data["data"]["nm"]+"_"+pic["mtnm"];
				var _box = $("#model-attribute-box");
				var _zhnm = _box.attr("_bind_zbnm");
				var _url = "images/model/"+_zhnm+".jpg";
				var _testimg = $("#media-img-box");
				_testimg.empty().append($("<img>",{src:_url}));
				
				//动态切换
				var _btngroup = $("#foot-button-group");
				if(_zhnm=="40100300000002300"){
					_btngroup.find("[x_bind_button_name='SetBackgroundSkin']:eq(0)").trigger("click");
				}else if(_zhnm=="040100300000002062"){
					_btngroup.find("[x_bind_button_name='SetBackgroundSkin']:eq(3)").trigger("click");
				}
			}
				
			//绑定第一层标题
			_box.prevAll().each(function(index,el){
				var _a = $(el);
				_a.find(".iconfont:eq(1)").addClass("fa-minus-circle");
			})
			
			_BindModelCountDataPanel(_box.closest("#count-data-box"));
			
			$("#diy-scrollbar-count-data-ul-box").mCustomScrollbar({
				theme: 'minimal-dark',
				scrollInertia: 100,
				axis: 'yx',
				mouseWheel: {
					enable: true,
					axis: 'y',
					preventDefault: true
				}
			});
			
			//$("#test").mCustomScrollbar("update");
			
			
			function _BindModelCountDataPanel(element){
				element.find("> .title").on("click touchstart",function(event){
					var _this = $(this),
						_ul = _this.next();
						
					if(_this.hasClass("panel-hide")){
						//显示
						_this.removeClass("panel-hide");
						_this.find(".x-iconfont-down").removeClass("fa-plus-circle").addClass("fa-minus-circle");
						_ul.slideDown(300);
					}else{
						//隐藏
						_this.addClass("panel-hide");
						_this.find(".x-iconfont-down").removeClass("fa-minus-circle").addClass("fa-plus-circle");
						_ul.slideUp(300);
					}
				});
				addClickEffect(element.find("> .title"));
			}
		}
		
		//右侧选项卡(传感器/电子Z范围，WQ范围)
		var _html = template("TemplateRigthContent",{run : true});
		if(_html!=""){
			var _model_tabs = $("#model-tabs");
			_model_tabs.html(_html);
		}
		
		//右侧圆形菜单
		var _html = template("TemplateRigthRadiusMenu",{run : true});
		if(_html!=""){
			var _model_count_menu = $("#count-menu-box");
			_model_count_menu.html(_html);
		}
		
		//按钮搜索
		var _search_panel = $("#search-input-box"),
			_model_attribute_box = $("#model-attribute-box");
		//_search_panel.addClass("animate").addClass("bounceOutLeft");
		//window.animatelo["bounceOutLeft"]("#"+_search_panel.attr("id"));
		$("#button-search").on("click",function(){
			var _name = "";
			if(_search_panel.hasClass("panel-hide")){
				_name = "bounceInLeft";
				_search_panel.show().removeClass("panel-hide");
			}else{
				_search_panel.addClass("panel-hide");
				_name = "bounceOutLeft";
			}
			if(_model_attribute_box.is(":hidden")){
				_search_panel.css({"left":"0"});
			}else{
				_search_panel.css({"left":"320px"});
			}
			window.animatelo[_name]("#"+_search_panel.attr("id"));
		});
		
		//底部按钮区
		var _foot = $("#foot-button-group");
		_foot.find(".one-line > .title").on("click",function(event){
			$(this).next().show();
		});

		_foot.find(".one-line").on("mouseleave",function(event){
			$(this).find(".menu-xiala").hide();
		});
		
		_foot.find("[x_bind_button_name='SetSkin']").on("click",function(event){
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
		
		_foot.find("[x_bind_button_name='SetBackgroundSkin']").on("click",function(event){
			var _this = $(this);
			_this.closest(".menu-xiala").hide();
			$("#background-changed").val(_this.attr("skin")).trigger("change");
			return false;
		});
		_foot.find("[x_bind_button_name='background-setting']").on("click",function(event){
			var _this = $(this);
			$("#background-setting-button").click();
			return false;
		});
		
		_foot.find("[x_bind_button_name='SetScreen']").on("click",function(event){
			if(_body.hasClass("model-simple")){
				_body.removeClass("model-simple");
			}else{
				_body.addClass("model-simple");
			}
			return false;
		});
		
		//模型控制
		_foot.find("[x_bind_button_name='showOperateCtrl']").on("click",function(event){
			var _this = $(this);
			if(_this.hasClass("showOperateCtrl")){
				_webObject.showOperateCtrl(0,false);
				_this.removeClass("showOperateCtrl");
			}else{
				_webObject.showOperateCtrl(0,true);
				_this.addClass("showOperateCtrl");
			}
			return false;
		});
		
		
		//动画控制
		_foot.find("[x_bind_button_name='playAction']").on("click",function(event){
			var _this = $(this);
			var _box = $("#model-attribute-box");
			var _zhnm = _box.attr("_bind_zbnm");
			/**
			 * play fa-play
			 * stop fa-pause
			 */
			if(!_this.hasClass("play")){
				_webObject.playAction(0,_zhnm,"Take 001",0,1000,true,100);
				_this.addClass("play");
				_this.find(".iconfont")
					.removeClass("fa-play")
					.addClass("fa-pause");
			}else{
				_webObject.playAction(0,_zhnm,"Take 001",0,1000,false,100);
				_this.removeClass("play");
				_this.find(".iconfont")
					.removeClass("fa-pause")
					.addClass("fa-play");
			}
			return false;
		});
		
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
	    
	    //打开模型比较
	    var _btn_compare = $("#x-btn-compare");
	    _btn_compare.on("click",function(){
	    	location.href = "main-compare.html";
	    });
	    
	}
})(jQuery);
