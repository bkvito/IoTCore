window.XYDCONFIG = {
	PROJECT_URL:'http://127.0.0.1:8081',
	PROBJECT_LOCATION: "http://location",
	PROBJECT_NAME: "IOT",
	PROBJECT_PATH: "/IOT/resources/common",
	PROBJECT_NAMECHINA: "WEB二三维可视化系统",
	PROBJECT_VERSIONS: "1.0",
};

window.MOLDEL = {};

//设置当前运行模式，localhost,server
window.MOLDEL.type = "localhost";

window.MOLDEL.ServerIp = {
	localhost : "",
	server : "http://10.17.181.28:8080"
}

window.MOLDEL.URLS = {
	//取模型列表
	GetModelList : ["/webgis/page/webgis/sdmx/getSWMXTree","JSON/GetModelList-1.json"],
	//取模型属性
	GetModelAttribute : ["/webgis/page/webgis/sdmx/querySWMXXX","JSON/GetModelAttribute-1.json"],
	//取模型综合
	GetModelCountInfo : ["/webgis/page/webgis/swmx/getJbxx","JSON/GetModelCountInfo-1.json"],
	//取模型对比
	GetModelCompareInfo : ["/webgis/page/webgis/swmx/getJbxx","JSON/GetModelCompareInfo-1.json"],
	//取图片
	GetMBImg : ["/webgis/page/jcqb/showPicPTMB",""]
};

window.MOLDEL.GetUrl = function(_name){
	//模式，默认选择服务器模式
	var _index;
	if(window.MOLDEL.type=="server"){
		_index = 0;
	}else{
		_index = 1;
	}
	
	return window.MOLDEL.ServerIp[window.MOLDEL.type] + window.MOLDEL.URLS[_name][_index];
}


window.pageObject = {
	response: {
		htmlHead: function() {
			document.write('\x3c!--[if IE 6 ]\x3e\x3chtml lang\x3d"en" class\x3d"ie6"\x3e\x3c![endif]--\x3e\x3c!--[if IE 7 ]\x3e\x3chtml lang\x3d"en" class\x3d"ie7"\x3e\x3c![endif]--\x3e\x3c!--[if IE 8 ]\x3e\x3chtml lang\x3d"en" class\x3d"ie8"\x3e\x3c![endif]--\x3e\x3c!--[if IE 9 ]\x3e\x3chtml lang\x3d"en" class\x3d"ie9"\x3e\x3c![endif]--\x3e\x3c!--[if IE 10 ]\x3e\x3chtml lang\x3d"en" class\x3d"ie10"\x3e\x3c![endif]--\x3e\x3c!--[if IE 11 ]\x3e\x3chtml lang\x3d"en" class\x3d"ie11"\x3e\x3c![endif]--\x3e\x3c!--[if !IE]\x3e\x3c!--\x3e\x3chtml lang\x3d"en" class\x3d"noIE"\x3e\x3c!--\x3c![endif]--\x3e')
		},
		css: function(a) {
			var b = {
				iconlogo: ["/page/images/logo.ico", "shortcut icon"],
				iconfont: ["/webFrame/iconfont/font_842054_l3t4me3f26/iconfont.css", "stylesheet", ""],
				common: ["/css/common.css", "stylesheet"],
				xydStyle: ["/css/x-style.css", "stylesheet"],
				xSkin : ["/css/x-skin.css","stylesheet"],
				easyui: ["/webFrame/jquery-easyui-1.5.2/themes/black/easyui.css", "stylesheet"],
				layer: ["/webFrame/layer-v.0.3/skin/default/layer.css", "stylesheet"],
				bootstrap335: ["/webFrame/bootstrap-3.3.5/css/bootstrap.min.css", "stylesheet"],
				bootstrapTreeview: ["/webFrame/bootstrap-treeview/css/bootstrap-treeview.min.css", "stylesheet"],
				bootstrapzTreeStyle: ["/webFrame/bootstrap-ztree-style/bootstrapStyle.css", "stylesheet"],
				fontAwesome: ["/webFrame/font-awesome-4.7.0/css/font-awesome.css", "stylesheet"],
				layui : ["/webFrame/layui-v2.4.3/css/layui.css", "stylesheet"],
				layui245 : ["/webFrame/layui-v2.4.5/css/layui.css", "stylesheet"],
				accordionMenu : ["/webFrame/jquery-accordion-menu/jquery-accordion-menu.css","stylesheet"],
				jqueryCustomScrollbar : ["/webFrame/jquery-mCustom-Scrollbar/jquery.mCustomScrollbar.css","stylesheet"],
				ol4 : ["/webFrame/ol/4.6.5/ol.css", "stylesheet"],
				ol4ext : ["/webFrame/ol/4.6.5/ol-ext-2.0.6/ol-ext.css", "stylesheet"],
				ol5 : ["/webFrame/ol/5.2/ol.css", "stylesheet"],
				ol5ext : ["/webFrame/ol/5.2/ol-ext-3.0.1/ol-ext.css", "stylesheet"],
				ztree : ["/webFrame/zTree_v3/css/zTreeStyle/zTreeStyle.css","stylesheet"],
				ztreeDemo : ["/webFrame/zTree_v3/css/demo.css","stylesheet"]
			};
			if(b[a]) {
				var c = b[a][1];
				a = '\x3clink href\x3d"' + ("remote" != b[a][2] ? window.XYDCONFIG.PROBJECT_PATH + b[a][0] : b[a][0]) + "?TIME\x3d" + (new Date).getTime() + '" rel\x3d"' + c + '" /\x3e';
				document.write(a)
			}
		},
		javascript: function(a) {
			var b = {
				jquery183: [window.jQuery ? "" : "/js/jquery-1.8.3.js"],
				jquery191: [window.jQuery ? "" : "/js/jquery-1.9.1.min.js"],
				jquery1124: [window.jQuery ? "" : "/js/jquery.1.12.4.min.js"],
				json2: ["/js/json2.js"],
				html5shiv: ["/js/html5shiv.js"],
				ieCss3MediaQuery: ["/js/respond.js"],
				placeholder: ["/js/jquery.placeholder.js"],
				unslider: ["/webFrame/unslider-150203225543/unslider.min.js"],
				md5: ["/js/md5.js"],
				easyui: ["/webFrame/jquery-easyui-1.5.2/jquery.easyui.min.js"],
				layer: ["/webFrame/layer-v.0.3/layer.js"],
				layer311: ["/webFrame/layer-v3.1.1/layer.js"],
				xydPlus: ["/js/x.plus.js"],
				xydPlusIn: ["/js/xyd.plus.in.js"],
				artTemplate: ["/js/artTemplate.js"],
				xydTable: ["/js/xyd.table.js"],
				xydMenuTemplate: ["/include/xyd.menu.template.js"],
				xydPjax: ["/js/xyd.pjax.js"],
				bootstrap335: ["/webFrame/bootstrap-3.3.5/js/bootstrap.min.js"],
				nicescroll: ["/webFrame/jquery.nicescroll-3.7.6/jquery.nicescroll.min.js"],
				ZeroClipboard: ["/webFrame/ZeroClipboard/ZeroClipboard.min.js"],
				WdatePicker: ["/webFrame/DatePicker/WdatePicker.js"],
				bootstrapTreeview: ["/webFrame/bootstrap-treeview/js/bootstrap-treeview.min.js"],
				cookie: ["/webFrame/treeview/lib/jquery.cookie.js"],
				layui: ["/webFrame/layui-v2.3.0/layui.all.js"],
				layui243: ["/webFrame/layui-v2.4.3/layui.js"],
				layui245: ["/webFrame/layui-v2.4.5/layui.js"],
				accordionMenu : ["/webFrame/jquery-accordion-menu/jquery-accordion-menu.js"],
				jqueryCustomScrollbar : ["/webFrame/jquery-mCustom-Scrollbar/jquery.mCustomScrollbar.concat.min.js"],
				webAnimations : ["/webFrame/animatelo/web-animations.min.js"],
				animatelo : ["/webFrame/animatelo/animatelo.min.js"],
				ol4 : ["/webFrame/ol/4.6.5/ol.js"],
				ol4ext:["/webFrame/ol/4.6.5/ol-ext-2.0.6/ol-ext.js"],
				ol5 : ["/webFrame/ol/5.2/ol.js"],
				ol5ext:["/webFrame/ol/4.6.5/ol-ext-2.0.6/ol-ext.js"],
				ztree:["/webFrame/zTree_v3/js/jquery.ztree.core.min.js"],
				ztreeExcheck:["/webFrame/zTree_v3/js/jquery.ztree.excheck.min.js"],
				require:["/webFrame/requirejs-2.1.20/require.min.js"]
			};
			if(b[a]) {
				a = b[a];
				var c;
				1 > a.length || (1 == a.length ? c = window.XYDCONFIG.PROBJECT_PATH + a[0] : 2 == a.length && (c = a[0]), document.write('\x3cscript src\x3d"' + c + '"\x3e\x3c/script\x3e'))
			} else throw Error("js nonexistence error");
		},
		swf: function(a) {
			return window.XYDCONFIG.PROBJECT_PATH + {
				ZeroClipboardSwf: "/webFrame/ZeroClipboard/ZeroClipboard.swf"
			}[a]
		}
	},
	setLocalStorage: function(a) {
		if(!localStorage) return null;
		try {
			localStorage.setItem(window.XYDCONFIG.PROBJECT_NAME, JSON.stringify(a))
		} catch(b) {
			throw Error(b.message);
		}
		return !0
	},
	getLocalStorage: function() {
		if(!localStorage) return null;
		try {
			var a;
			try {
				a = JSON.parse(localStorage.getItem(window.XYDCONFIG.PROBJECT_NAME)), null == a && (a = {})
			} catch(b) {
				a = {}, localStorage.setItem(window.XYDCONFIG.PROBJECT_NAME, JSON.stringify(a))
			}
			return a
		} catch(b) {
			throw Error(b.message);
		}
	},
	clearLocalStorage: function() {
		localStorage.setItem(window.XYDCONFIG.PROBJECT_NAME, JSON.stringify({}))
	},
	setHTMLTitle: function(a) {
		document.title = a || window.XYDCONFIG.PROBJECT_NAMECHINA
	}
};
window.pageResponse = function(a, b) {
	switch(a) {
		case "css":
			window.pageObject.response.css(b);
			break;
		case "javascript":
			window.pageObject.response.javascript(b);
			break;
		case "html":
			window.pageObject.response.htmlHead();
			break;
		case "swf":
			window.pageObject.response.swf(b)
	}
};
window.pageResponseie8service = function() {
	pageResponse("javascript", "json2");
	pageResponse("javascript", "html5shiv");
	pageResponse("javascript", "ieCss3MediaQuery");
	window.jQuery || pageResponse("javascript", "jquery183");
	pageResponse("javascript", "placeholder")
};
pageResponse("html");
//window.pageObject.setHTMLTitle();