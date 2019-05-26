/* iframe script helper for jquery.nicescroll
-- version 0.9.0
-- copyright 2017-06-18 InuYaksa*2017
-- licensed under the MIT
--
-- https://nicescroll.areaaperta.com/
-- https://github.com/inuyaksa/jquery.nicescroll
--
*/
(function(d,c){var l=d.body,h=c.parent;h&&"createEvent"in d&&l.addEventListener("wheel",function(b){var a=d.createEvent("MouseEvents");a.initEvent("wheel",!0,!0);a.deltaMode=b.deltaMode;a.deltaX=b.deltaX;a.deltaY=b.deltaY;a.deltaZ=b.deltaZ;a.wheelDelta=b.wheelDelta;a.wheelDeltaX=b.wheelDeltaX;a.wheelDeltaY=b.wheelDeltaY;h.dispatchEvent(a)});if(c.addEventListener){var k=function(){var b=d.createElement("style");b.appendChild(d.createTextNode(""));d.head.appendChild(b);return b.sheet}(),e=null,f=null,g=[];c.addEventListener("scroll",function(b){f&&c.scrollTo(g[0],g[1])});c.addEventListener("load",function(){var b=!1;$.nicescroll.each(function(){this.scrollstart(function(){b||k.insertRule("iframe { pointer-events: none !important; }",0);b=!0});this.scrollend(function(){b&&k.deleteRule(0);b=!1})});$("iframe").each(function(){this.addEventListener("mouseenter",function(a){e=a.target;a:{a=e;do{if(void 0!==$.data(a,"__nicescroll"))break a;a=a.parentNode||!1}while(a);a=!1}f=a;g=[c.scrollX,c.scrollY]});this.addEventListener("mouseleave",function(a){e=f=null})})})}})(document,window);