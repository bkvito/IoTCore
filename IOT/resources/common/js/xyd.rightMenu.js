/************************************************************
 * jquery 注册右键菜单
 */
var _bindRightMenuObj;(function(e){e.fn.extend({bingRightMenu:function(c){var d=this,b=e(c.element);b.hover(function(){},function(){b.hide()});d.bind("contextmenu",function(a){a=a||window.event;c.eventMenuUp?c.eventMenuUp(a):function(){};b.show().css({top:a.clientY-1+"px",left:a.clientX-1+"px"});_bindRightMenuObj=d;return!1});b.on("click",function(a){return!1});b.bind("contextmenu",function(a){return!1});return d},unbindRightMenu:function(){this.unbind("contextmenu").unbind("click");return this}})})(jQuery);