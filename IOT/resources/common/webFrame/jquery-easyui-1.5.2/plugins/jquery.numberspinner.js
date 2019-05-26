/**
 * jQuery EasyUI 1.5.2
 * 
 * Copyright (c) 2009-2017 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the freeware license: http://www.jeasyui.com/license_freeware.php
 * To use it on other terms please contact us: info@jeasyui.com
 *
 */
(function(a){a.fn.numberspinner=function(c,b){if("string"==typeof c){var d=a.fn.numberspinner.methods[c];return d?d(this,b):this.numberbox(c,b)}c=c||{};return this.each(function(){var b=a.data(this,"numberspinner");b?a.extend(b.options,c):a.data(this,"numberspinner",{options:a.extend({},a.fn.numberspinner.defaults,a.fn.numberspinner.parseOptions(this),c)});a(this).addClass("numberspinner-f");b=a.data(this,"numberspinner").options;a(this).numberbox(a.extend({},b,{doSize:!1})).spinner(b);a(this).numberbox("setValue",b.value)})};a.fn.numberspinner.methods={options:function(c){var b=c.numberbox("options");return a.extend(a.data(c[0],"numberspinner").options,{width:b.width,value:b.value,originalValue:b.originalValue,disabled:b.disabled,readonly:b.readonly})}};a.fn.numberspinner.parseOptions=function(c){return a.extend({},a.fn.spinner.parseOptions(c),a.fn.numberbox.parseOptions(c),{})};a.fn.numberspinner.defaults=a.extend({},a.fn.spinner.defaults,a.fn.numberbox.defaults,{spin:function(c){var b=a.data(this,"numberspinner").options,d=parseFloat(a(this).numberbox("getValue")||b.value)||0,d=c?d-b.increment:d+b.increment;a(this).numberbox("setValue",d)}})})(jQuery);