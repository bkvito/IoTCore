/*
 * Async Treeview 0.1 - Lazy-loading extension for Treeview
 * 
 * http://bassistance.de/jquery-plugins/jquery-plugin-treeview/
 *
 * Copyright (c) 2007 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id$
 *
 */
(function(b){function g(a,e,c,d){function f(a){a=b("\x3cli/\x3e").attr("id",this.id||"").html("\x3cspan\x3e"+this.text+"\x3c/span\x3e").appendTo(a);this.classes&&a.children("span").addClass(this.classes);this.expanded&&a.addClass("open");if(this.hasChildren||this.children&&this.children.length){var c=b("\x3cul/\x3e").appendTo(a);this.hasChildren&&(a.addClass("hasChildren"),f.call({classes:"placeholder",text:"\x26nbsp;",children:[]},c));this.children&&this.children.length&&b.each(this.children,f,[c])}}b.ajax(b.extend(!0,{url:a.url,dataType:"json",data:{root:e},success:function(a){c.empty();b.each(a,f,[c]);b(d).treeview({add:c})}},a.ajax))}var h=b.fn.treeview;b.fn.treeview=function(a){if(!a.url)return h.apply(this,arguments);var e=this;e.children().size()||g(a,"source",this,e);var c=a.toggle;return h.call(this,b.extend({},a,{collapsed:!0,toggle:function(){var d=b(this);d.hasClass("hasChildren")&&(d=d.removeClass("hasChildren").find("ul"),g(a,this.id,d,e));c&&c.apply(this,arguments)}}))}})(jQuery);