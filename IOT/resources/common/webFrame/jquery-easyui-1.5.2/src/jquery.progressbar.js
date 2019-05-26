/**
 * jQuery EasyUI 1.5.2
 * 
 * Copyright (c) 2009-2017 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the freeware license: http://www.jeasyui.com/license_freeware.php
 * To use it on other terms please contact us: info@jeasyui.com
 *
 */
/**
 * progressbar - jQuery EasyUI
 * 
 * Dependencies:
 * 	 none
 * 
 */
(function(a){function g(b){a(b).addClass("progressbar");a(b).html('\x3cdiv class\x3d"progressbar-text"\x3e\x3c/div\x3e\x3cdiv class\x3d"progressbar-value"\x3e\x3cdiv class\x3d"progressbar-text"\x3e\x3c/div\x3e\x3c/div\x3e');a(b).bind("_resize",function(c,e){(a(this).hasClass("easyui-fluid")||e)&&f(b);return!1});return a(b)}function f(b,c){var e=a.data(b,"progressbar").options,d=a.data(b,"progressbar").bar;c&&(e.width=c);d._size(e);d.find("div.progressbar-text").css("width",d.width());d.find("div.progressbar-text,div.progressbar-value").css({height:d.height()+"px",lineHeight:d.height()+"px"})}a.fn.progressbar=function(b,c){if("string"==typeof b){var e=a.fn.progressbar.methods[b];if(e)return e(this,c)}b=b||{};return this.each(function(){var c=a.data(this,"progressbar");c?a.extend(c.options,b):c=a.data(this,"progressbar",{options:a.extend({},a.fn.progressbar.defaults,a.fn.progressbar.parseOptions(this),b),bar:g(this)});a(this).progressbar("setValue",c.options.value);f(this)})};a.fn.progressbar.methods={options:function(b){return a.data(b[0],"progressbar").options},resize:function(a,c){return a.each(function(){f(this,c)})},getValue:function(b){return a.data(b[0],"progressbar").options.value},setValue:function(b,c){0>c&&(c=0);100<c&&(c=100);return b.each(function(){var b=a.data(this,"progressbar").options,d=b.text.replace(/{value}/,c),f=b.value;b.value=c;a(this).find("div.progressbar-value").width(c+"%");a(this).find("div.progressbar-text").html(d);f!=c&&b.onChange.call(this,c,f)})}};a.fn.progressbar.parseOptions=function(b){return a.extend({},a.parser.parseOptions(b,["width","height","text",{value:"number"}]))};a.fn.progressbar.defaults={width:"auto",height:22,value:0,text:"{value}%",onChange:function(b,a){}}})(jQuery);