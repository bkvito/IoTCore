/**
 * jQuery EasyUI 1.5.2
 * 
 * Copyright (c) 2009-2017 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the freeware license: http://www.jeasyui.com/license_freeware.php
 * To use it on other terms please contact us: info@jeasyui.com
 *
 */
(function(b){b.fn.datetimespinner=function(a,c){if("string"==typeof a){var d=b.fn.datetimespinner.methods[a];return d?d(this,c):this.timespinner(a,c)}a=a||{};return this.each(function(){var c=b.data(this,"datetimespinner");c?b.extend(c.options,a):b.data(this,"datetimespinner",{options:b.extend({},b.fn.datetimespinner.defaults,b.fn.datetimespinner.parseOptions(this),a)});c=b.data(this,"datetimespinner").options;b(this).addClass("datetimespinner-f").timespinner(c)})};b.fn.datetimespinner.methods={options:function(a){var c=a.timespinner("options");return b.extend(b.data(a[0],"datetimespinner").options,{width:c.width,value:c.value,originalValue:c.originalValue,disabled:c.disabled,readonly:c.readonly})}};b.fn.datetimespinner.parseOptions=function(a){return b.extend({},b.fn.timespinner.parseOptions(a),b.parser.parseOptions(a,[]))};b.fn.datetimespinner.defaults=b.extend({},b.fn.timespinner.defaults,{formatter:function(a){return a?b.fn.datebox.defaults.formatter.call(this,a)+" "+b.fn.timespinner.defaults.formatter.call(this,a):""},parser:function(a){a=b.trim(a);if(!a)return null;var c=a.split(" ");a=b.fn.datebox.defaults.parser.call(this,c[0]);if(2>c.length)return a;c=b.fn.timespinner.defaults.parser.call(this,c[1]);return new Date(a.getFullYear(),a.getMonth(),a.getDate(),c.getHours(),c.getMinutes(),c.getSeconds())},selections:[[0,2],[3,5],[6,10],[11,13],[14,16],[17,19]]})})(jQuery);