/**
 * jQuery EasyUI 1.5.2
 * 
 * Copyright (c) 2009-2017 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the freeware license: http://www.jeasyui.com/license_freeware.php
 * To use it on other terms please contact us: info@jeasyui.com
 *
 */
(function(b){function h(a){var c=b.data(a,"menubutton").options,d=b(a);d.linkbutton(c);c.hasDownArrow&&(d.removeClass(c.cls.btn1+" "+c.cls.btn2).addClass("m-btn"),d.removeClass("m-btn-small m-btn-medium m-btn-large").addClass("m-btn-"+c.size),d=d.find(".l-btn-left"),b("\x3cspan\x3e\x3c/span\x3e").addClass(c.cls.arrow).appendTo(d),b("\x3cspan\x3e\x3c/span\x3e").addClass("m-btn-line").appendTo(d));b(a).menubutton("resize");if(c.menu){b(c.menu).menu({duration:c.duration});a=b(c.menu).menu("options");var e=a.onShow,f=a.onHide;b.extend(a,{onShow:function(){var a=b(this).menu("options"),a=b(a.alignTo),c=a.menubutton("options");a.addClass(1==c.plain?c.cls.btn2:c.cls.btn1);e.call(this)},onHide:function(){var a=b(this).menu("options"),a=b(a.alignTo),c=a.menubutton("options");a.removeClass(1==c.plain?c.cls.btn2:c.cls.btn1);f.call(this)}})}}function k(a){var c=b.data(a,"menubutton").options,d=b(a),e=d.find("."+c.cls.trigger);e.length||(e=d);e.unbind(".menubutton");var f=null;e.bind("click.menubutton",function(){if(!b(a).linkbutton("options").disabled)return g(a),!1}).bind("mouseenter.menubutton",function(){if(!b(a).linkbutton("options").disabled)return f=setTimeout(function(){g(a)},c.duration),!1}).bind("mouseleave.menubutton",function(){f&&clearTimeout(f);b(c.menu).triggerHandler("mouseleave")})}function g(a){var c=b(a).menubutton("options");if(!c.disabled&&c.menu){b("body\x3ediv.menu-top").menu("hide");a=b(a);var d=b(c.menu);d.length&&(d.menu("options").alignTo=a,d.menu("show",{alignTo:a,align:c.menuAlign}));a.blur()}}b.fn.menubutton=function(a,c){if("string"==typeof a){var d=b.fn.menubutton.methods[a];return d?d(this,c):this.linkbutton(a,c)}a=a||{};return this.each(function(){var c=b.data(this,"menubutton");c?b.extend(c.options,a):(b.data(this,"menubutton",{options:b.extend({},b.fn.menubutton.defaults,b.fn.menubutton.parseOptions(this),a)}),b(this).removeAttr("disabled"));h(this);k(this)})};b.fn.menubutton.methods={options:function(a){var c=a.linkbutton("options");return b.extend(b.data(a[0],"menubutton").options,{toggle:c.toggle,selected:c.selected,disabled:c.disabled})},destroy:function(a){return a.each(function(){var a=b(this).menubutton("options");a.menu&&b(a.menu).menu("destroy");b(this).remove()})}};b.fn.menubutton.parseOptions=function(a){b(a);return b.extend({},b.fn.linkbutton.parseOptions(a),b.parser.parseOptions(a,["menu",{plain:"boolean",hasDownArrow:"boolean",duration:"number"}]))};b.fn.menubutton.defaults=b.extend({},b.fn.linkbutton.defaults,{plain:!0,hasDownArrow:!0,menu:null,menuAlign:"left",duration:100,cls:{btn1:"m-btn-active",btn2:"m-btn-plain-active",arrow:"m-btn-downarrow",trigger:"m-btn"}})})(jQuery);