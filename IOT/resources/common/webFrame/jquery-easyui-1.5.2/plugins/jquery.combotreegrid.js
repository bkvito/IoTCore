/**
 * jQuery EasyUI 1.5.2
 * 
 * Copyright (c) 2009-2017 www.jeasyui.com. All rights reserved.
 *
 * Licensed under the freeware license: http://www.jeasyui.com/license_freeware.php
 * To use it on other terms please contact us: info@jeasyui.com
 *
 */
(function(a){function q(b){var c=a.data(b,"combotreegrid"),d=c.options;a(b).addClass("combotreegrid-f").combo(a.extend({},d,{onShowPanel:function(){var b=a(this).combotreegrid("panel"),c=b.outerHeight()-b.height(),e=b._size("minHeight"),h=b._size("maxHeight"),b=a(this).combotreegrid("grid");b.treegrid("resize",{width:"100%",height:isNaN(parseInt(d.panelHeight))?"auto":"100%",minHeight:e?e-c:"",maxHeight:h?h-c:""});(c=b.treegrid("getSelected"))&&b.treegrid("scrollTo",c[d.idField]);d.onShowPanel.call(this)}}));if(!c.grid){var e=a(b).combo("panel");c.grid=a("\x3ctable\x3e\x3c/table\x3e").appendTo(e)}c.grid.treegrid(a.extend({},d,{border:!1,checkbox:d.multiple,onLoadSuccess:function(e,f){var g=a(b).combotreegrid("getValues");d.multiple&&a.map(a(this).treegrid("getCheckedNodes"),function(b){a.easyui.addArrayItem(g,b[d.idField])});l(b,g);d.onLoadSuccess.call(this,e,f);c.remainText=!1},onClickRow:function(c){d.multiple?(a(this).treegrid(c.checked?"uncheckNode":"checkNode",c[d.idField]),a(this).treegrid("unselect",c[d.idField])):a(b).combo("hidePanel");m(b);d.onClickRow.call(this,c)},onCheckNode:function(a,c){m(b);d.onCheckNode.call(this,a,c)}}))}function m(b){var c=a.data(b,"combotreegrid"),d=c.options,e=c.grid,c=[];d.multiple?c=a.map(e.treegrid("getCheckedNodes"),function(a){return a[d.idField]}):(e=e.treegrid("getSelected"))&&c.push(e[d.idField]);c=c.concat(d.unselectedValues);l(b,c)}function l(b,c){function d(b,c){var d=a.easyui.getArrayItem(c,f.idField,b);return d?e(d):void 0}function e(a){return a[f.textField||""]||a[f.treeField]}var g=a.data(b,"combotreegrid"),f=g.options,k=g.grid;a.isArray(c)||(c=c.split(f.separator));f.multiple||(c=c.length?[c[0]]:[""]);var h=a.map(c,function(a){return String(a)}),h=a.grep(h,function(b,c){return c===a.inArray(b,h)}),p=k.treegrid("getSelected");p&&k.treegrid("unselect",p[f.idField]);a.map(k.treegrid("getCheckedNodes"),function(b){-1==a.inArray(String(b[f.idField]),h)&&k.treegrid("uncheckNode",b[f.idField])});var n=[];f.unselectedValues=[];a.map(h,function(a){var b=k.treegrid("find",a);b?(f.multiple?k.treegrid("checkNode",a):k.treegrid("select",a),n.push(e(b))):(n.push(d(a,f.mappingRows)||a),f.unselectedValues.push(a))});f.multiple&&a.map(k.treegrid("getCheckedNodes"),function(b){var c=String(b[f.idField]);-1==a.inArray(c,h)&&(h.push(c),n.push(e(b)))});g.remainText||(g=n.join(f.separator),a(b).combo("getText")!=g&&a(b).combo("setText",g));a(b).combo("setValues",h)}function r(b,c){var d=a.data(b,"combotreegrid"),e=d.options,g=d.grid;d.remainText=!0;g.treegrid("clearSelections").treegrid("clearChecked").treegrid("highlightRow",-1);if("remote"==e.mode)a(b).combotreegrid("clear"),g.treegrid("load",a.extend({},e.queryParams,{q:c}));else if(c){var f=g.treegrid("getData"),k=[],h=e.multiple?c.split(e.separator):[c];a.map(h,function(c){if(c=a.trim(c)){var d=void 0;a.easyui.forEach(f,!0,function(a){if(c.toLowerCase()==String(a[e.treeField]).toLowerCase())return d=a[e.idField],!1;if(e.filter.call(b,c,a))return g.treegrid("expandTo",a[e.idField]),g.treegrid("highlightRow",a[e.idField]),!1});void 0==d&&a.easyui.forEach(e.mappingRows,!1,function(a){if(c.toLowerCase()==String(a[e.treeField]))return d=a[e.idField],!1});void 0!=d&&k.push(d)}});l(b,k);d.remainText=!1}}a.fn.combotreegrid=function(b,c){if("string"==typeof b){var d=a.fn.combotreegrid.methods[b];return d?d(this,c):this.combo(b,c)}b=b||{};return this.each(function(){var c=a.data(this,"combotreegrid");c?a.extend(c.options,b):a.data(this,"combotreegrid",{options:a.extend({},a.fn.combotreegrid.defaults,a.fn.combotreegrid.parseOptions(this),b)});q(this)})};a.fn.combotreegrid.methods={options:function(b){var c=b.combo("options");return a.extend(a.data(b[0],"combotreegrid").options,{width:c.width,height:c.height,originalValue:c.originalValue,disabled:c.disabled,readonly:c.readonly})},grid:function(b){return a.data(b[0],"combotreegrid").grid},setValues:function(b,c){return b.each(function(){var b=a(this).combotreegrid("options");a.isArray(c)&&(c=a.map(c,function(c){return c&&"object"==typeof c?(a.easyui.addArrayItem(b.mappingRows,b.idField,c),c[b.idField]):c}));l(this,c)})},setValue:function(b,c){return b.each(function(){a(this).combotreegrid("setValues",a.isArray(c)?c:[c])})},clear:function(b){return b.each(function(){a(this).combotreegrid("setValues",[])})},reset:function(b){return b.each(function(){var b=a(this).combotreegrid("options");b.multiple?a(this).combotreegrid("setValues",b.originalValue):a(this).combotreegrid("setValue",b.originalValue)})}};a.fn.combotreegrid.parseOptions=function(b){a(b);return a.extend({},a.fn.combo.parseOptions(b),a.fn.treegrid.parseOptions(b),a.parser.parseOptions(b,["mode",{limitToGrid:"boolean"}]))};a.fn.combotreegrid.defaults=a.extend({},a.fn.combo.defaults,a.fn.treegrid.defaults,{editable:!1,singleSelect:!0,limitToGrid:!1,unselectedValues:[],mappingRows:[],mode:"local",textField:null,keyHandler:{up:function(a){},down:function(a){},left:function(a){},right:function(a){},enter:function(a){m(this)},query:function(a,c){r(this,a)}},inputEvents:a.extend({},a.fn.combo.defaults.inputEvents,{blur:function(b){b=b.data.target;a(b).combotreegrid("options").limitToGrid&&m(b)}}),filter:function(b,c){var d=a(this).combotreegrid("options");return 0<=(c[d.treeField]||"").toLowerCase().indexOf(b.toLowerCase())}})})(jQuery);