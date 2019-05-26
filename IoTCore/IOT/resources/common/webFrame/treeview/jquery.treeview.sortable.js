/*
 * jQuery UI Sortable
 *
 * Copyright (c) 2008 Paul Bakaus
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * http://docs.jquery.com/UI/Sortables
 *
 * Depends:
 *   ui.base.js
 *
 * Revision: $Id: ui.sortable.js 5262 2008-04-17 13:13:51Z paul.bakaus $
 */
(function(c){window.Node&&Node.prototype&&!Node.prototype.contains&&(Node.prototype.contains=function(a){return!!(this.compareDocumentPosition(a)&16)});c.widget("ui.sortableTree",c.extend(c.ui.mouse,{init:function(){var a=this.options;this.containerCache={};this.element.addClass("ui-sortableTree");this.refresh();/(relative|absolute|fixed)/.test(this.element.css("position"))||this.element.css("position","relative");this.offset=this.element.offset();this.mouseInit();a.cursorAt&&a.cursorAt.constructor==Array&&(a.cursorAt={left:a.cursorAt[0],top:a.cursorAt[1]})},plugins:{},ui:function(a){return{helper:(a||this).helper,position:(a||this).position.current,absolutePosition:(a||this).position.absolute,instance:this,options:this.options,element:this.element,item:(a||this).currentItem,sender:a?a.element:null}},propagate:function(a,b,d){c.ui.plugin.call(this,a,[b,this.ui(d)]);this.element.triggerHandler("sort"==a?a:"sort"+a,[b,this.ui(d)],this.options[a])},serialize:function(a){var b=c(this.options.items,this.element).not(".ui-sortableTree-helper"),d=[];a=a||{};b.each(function(){var b=(c(this).attr(a.attribute||"id")||"").match(a.expression||/(.+)[-=_](.+)/);b&&d.push((a.key||b[1])+"[]\x3d"+(a.key?b[1]:b[2]))});return d.join("\x26")},toArray:function(a){var b=[];c(this.options.items,this.element).not(".ui-sortableTree-helper").each(function(){b.push(c(this).attr(a||"id"))});return b},enable:function(){this.element.removeClass("ui-sortableTree-disabled");this.options.disabled=!1},disable:function(){this.element.addClass("ui-sortableTree-disabled");this.options.disabled=!0},intersectsWith:function(a){var b=this.position.absolute.left-10,d=this.position.absolute.top-10,c=a.left,g=c+a.width,e=a.top;a=e+a.height;return c<b+this.helperProportions.width/2&&b+10-this.helperProportions.width/2<g&&e<d+this.helperProportions.height/2&&d+10-this.helperProportions.height/2<a},intersectsWithEdge:function(a){var b=this.position.absolute.top-10,c=b+10,f=a.top,g=f+a.height;return this.intersectsWith(a.item.parents(".ui-sortableTree").data("sortableTree").containerCache)&&f<b+this.helperProportions.height/2&&c-this.helperProportions.height/2<g?c>f&&b<f?1:b<g&&c>g?2:!1:!1},refresh:function(){this.refreshItems();this.refreshPositions()},refreshItems:function(){this.items=[];this.containers=[this];var a=this.items,b=[c(this.options.items,this.element)];if(this.options.connectWith)for(var d=this.options.connectWith.length-1;0<=d;d--)for(var f=c(this.options.connectWith[d]),g=f.length-1;0<=g;g--){var e=c.data(f[g],"sortableTree");e&&!e.options.disabled&&(b.push(c(e.options.items,e.element)),this.containers.push(e))}for(d=b.length-1;0<=d;d--)b[d].each(function(){c.data(this,"sortableTree-item",!0);a.push({item:c(this),width:0,height:0,left:0,top:0})})},refreshPositions:function(a){for(var b=this.items.length-1;0<=b;b--)a||(this.items[b].height=this.items[b].item.outerHeight()),this.items[b].top=this.items[b].item.offset().top;for(b=this.containers.length-1;0<=b;b--)a=this.containers[b].element.offset(),this.containers[b].containerCache.left=a.left,this.containers[b].containerCache.top=a.top,this.containers[b].containerCache.width=this.containers[b].element.outerWidth(),this.containers[b].containerCache.height=this.containers[b].element.outerHeight()},destroy:function(){this.element.removeClass("ui-sortableTree ui-sortableTree-disabled").removeData("sortableTree").unbind(".sortableTree");this.mouseDestroy();for(var a=this.items.length-1;0<=a;a--)this.items[a].item.removeData("sortableTree-item")},contactContainers:function(a){for(var b=this.containers.length-1;0<=b;b--)if(this.intersectsWith(this.containers[b].containerCache)){if(!this.containers[b].containerCache.over){if(this.currentContainer!=this.containers[b]){for(var c=1E4,f=null,g=this.position.absolute.top,e=this.items.length-1;0<=e;e--)if(this.containers[b].element[0].contains(this.items[e].item[0])){var h=this.items[e].top;Math.abs(h-g)<c&&(c=Math.abs(h-g),f=this.items[e])}f?this.rearrange(a,f):this.rearrange(a,null,this.containers[b].element);this.propagate("change",a);this.containers[b].propagate("change",a,this);this.currentContainer=this.containers[b]}this.containers[b].propagate("over",a,this);this.containers[b].containerCache.over=1}}else this.containers[b].containerCache.over&&(this.containers[b].propagate("out",a,this),this.containers[b].containerCache.over=0)},mouseStart:function(a,b){if(this.options.disabled||"static"==this.options.type)return!1;var d=null;c(a.target).parents().each(function(){if(c.data(this,"sortableTree-item"))return d=c(this),!1});c.data(a.target,"sortableTree-item")&&(d=c(a.target));if(!d)return!1;if(this.options.handle){var f=!1;c(this.options.handle,d).each(function(){this==a.target&&(f=!0)});if(!f)return!1}this.currentItem=d;var g=this.options;this.currentContainer=this;this.refresh();this.helper="function"==typeof g.helper?c(g.helper.apply(this.element[0],[a,this.currentItem])):this.currentItem.clone();this.helper.parents("body").length||this.helper.appendTo("body");this.helper.css({position:"absolute",clear:"both"}).addClass("ui-sortableTree-helper");c.extend(this,{offsetParent:this.helper.offsetParent(),offsets:{absolute:this.currentItem.offset()}});c.extend(this,{position:{current:{left:a.pageX,top:a.pageY},absolute:{left:a.pageX,top:a.pageY},dom:this.currentItem.prev()[0]},clickOffset:{left:-5,top:-5}});this.propagate("start",a);this.helperProportions={width:this.helper.outerWidth(),height:this.helper.outerHeight()};for(var e=this.containers.length-1;0<=e;e--)this.containers[e].propagate("activate",a,this);c.ui.ddmanager&&(c.ui.ddmanager.current=this);c.ui.ddmanager&&!g.dropBehaviour&&c.ui.ddmanager.prepareOffsets(this,a);return this.dragging=!0},mouseStop:function(a){this.newPositionAt&&this.options.sortIndication.remove.call(this.currentItem,this.newPositionAt);this.propagate("stop",a);if((!c.ui.ddmanager||this.options.dropBehaviour||!c.ui.ddmanager.drop(this,a))&&this.newPositionAt)this.newPositionAt["down"==this.direction?"before":"after"](this.currentItem);this.position.dom!=this.currentItem.prev()[0]&&this.propagate("update",a);if(!this.element[0].contains(this.currentItem[0])){this.propagate("remove",a);for(var b=this.containers.length-1;0<=b;b--)this.containers[b].element[0].contains(this.currentItem[0])&&(this.containers[b].propagate("update",a,this),this.containers[b].propagate("receive",a,this))}for(b=this.containers.length-1;0<=b;b--)this.containers[b].propagate("deactivate",a,this),this.containers[b].containerCache.over&&(this.containers[b].propagate("out",a,this),this.containers[b].containerCache.over=0);this.dragging=!1;if(this.cancelHelperRemoval)return!1;this.helper.remove();return!1},mouseDrag:function(a){this.position.current={top:a.pageY+5,left:a.pageX+5};this.position.absolute={left:a.pageX+5,top:a.pageY+5};c.ui.ddmanager&&c.ui.ddmanager.drag(this,a);var b=!1;c.each(c.ui.ddmanager.droppables,function(){this.isover&&(b=!0)});if(b)this.newPositionAt&&this.options.sortIndication.remove.call(this.currentItem,this.newPositionAt);else for(var d=this.items.length-1;0<=d;d--)if(!this.currentItem[0].contains(this.items[d].item[0])){var f=this.intersectsWithEdge(this.items[d]);if(f){this.direction=1==f?"down":"up";this.rearrange(a,this.items[d]);this.propagate("change",a);break}}this.contactContainers(a);this.propagate("sort",a);this.helper.css({left:this.position.current.left+"px",top:this.position.current.top+"px"});return!1},rearrange:function(a,b,c){b&&(this.newPositionAt&&this.options.sortIndication.remove.call(this.currentItem,this.newPositionAt),this.newPositionAt=b.item,this.options.sortIndication[this.direction].call(this.currentItem,this.newPositionAt))}}));c.extend(c.ui.sortableTree,{defaults:{items:"\x3e *",zIndex:1E3,distance:1},getter:"serialize toArray"})})(jQuery);