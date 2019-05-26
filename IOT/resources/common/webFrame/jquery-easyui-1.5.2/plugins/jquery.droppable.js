/**
 * jQuery EasyUI 1.5.2
 * 
 * Copyright (c) 2009-2017 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the freeware license: http://www.jeasyui.com/license_freeware.php
 * To use it on other terms please contact us: info@jeasyui.com
 *
 */
(function(b){function e(a){b(a).addClass("droppable");b(a).bind("_dragenter",function(c,d){b.data(a,"droppable").options.onDragEnter.apply(a,[c,d])});b(a).bind("_dragleave",function(c,d){b.data(a,"droppable").options.onDragLeave.apply(a,[c,d])});b(a).bind("_dragover",function(c,d){b.data(a,"droppable").options.onDragOver.apply(a,[c,d])});b(a).bind("_drop",function(c,d){b.data(a,"droppable").options.onDrop.apply(a,[c,d])})}b.fn.droppable=function(a,c){if("string"==typeof a)return b.fn.droppable.methods[a](this,c);a=a||{};return this.each(function(){var c=b.data(this,"droppable");c?b.extend(c.options,a):(e(this),b.data(this,"droppable",{options:b.extend({},b.fn.droppable.defaults,b.fn.droppable.parseOptions(this),a)}))})};b.fn.droppable.methods={options:function(a){return b.data(a[0],"droppable").options},enable:function(a){return a.each(function(){b(this).droppable({disabled:!1})})},disable:function(a){return a.each(function(){b(this).droppable({disabled:!0})})}};b.fn.droppable.parseOptions=function(a){var c=b(a);return b.extend({},b.parser.parseOptions(a,["accept"]),{disabled:c.attr("disabled")?!0:void 0})};b.fn.droppable.defaults={accept:null,disabled:!1,onDragEnter:function(a,b){},onDragOver:function(a,b){},onDragLeave:function(a,b){},onDrop:function(a,b){}}})(jQuery);