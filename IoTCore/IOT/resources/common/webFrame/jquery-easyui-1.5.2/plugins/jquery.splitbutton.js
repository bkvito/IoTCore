/**
 * jQuery EasyUI 1.5.2
 * 
 * Copyright (c) 2009-2017 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the freeware license: http://www.jeasyui.com/license_freeware.php
 * To use it on other terms please contact us: info@jeasyui.com
 *
 */
(function(a){a.fn.splitbutton=function(b,c){if("string"==typeof b){var d=a.fn.splitbutton.methods[b];return d?d(this,c):this.menubutton(b,c)}b=b||{};return this.each(function(){var c=a.data(this,"splitbutton");c?a.extend(c.options,b):(a.data(this,"splitbutton",{options:a.extend({},a.fn.splitbutton.defaults,a.fn.splitbutton.parseOptions(this),b)}),a(this).removeAttr("disabled"));c=a.data(this,"splitbutton").options;a(this).menubutton(c);a(this).addClass("s-btn")})};a.fn.splitbutton.methods={options:function(b){var c=b.menubutton("options");b=a.data(b[0],"splitbutton").options;a.extend(b,{disabled:c.disabled,toggle:c.toggle,selected:c.selected});return b}};a.fn.splitbutton.parseOptions=function(b){a(b);return a.extend({},a.fn.linkbutton.parseOptions(b),a.parser.parseOptions(b,["menu",{plain:"boolean",duration:"number"}]))};a.fn.splitbutton.defaults=a.extend({},a.fn.linkbutton.defaults,{plain:!0,menu:null,duration:100,cls:{btn1:"m-btn-active s-btn-active",btn2:"m-btn-plain-active s-btn-plain-active",arrow:"m-btn-downarrow",trigger:"m-btn-line"}})})(jQuery);