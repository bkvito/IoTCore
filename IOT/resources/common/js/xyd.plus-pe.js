﻿/*********************************************************
*	jquery xyd plus
*********************************************************/
window.onerror=function(){};var fn={accAdd:function(e,f){var a,b;try{a=e.toString().split(".")[1].length}catch(c){a=0}try{b=f.toString().split(".")[1].length}catch(c){b=0}a=Math.pow(10,Math.max(a,b));return Math.round(e*a+f*a)/a},accSub:function(e,f){var a,b,c;try{a=e.toString().split(".")[1].length}catch(d){a=0}try{b=f.toString().split(".")[1].length}catch(d){b=0}c=Math.pow(10,Math.max(a,b));n=a>=b?a:b;return(Math.round(e*c-f*c)/c).toFixed(n)},accDiv:function(e,f){var a,b,c,d;try{a=e.toString().split(".")[1].length}catch(g){a=0}try{b=f.toString().split(".")[1].length}catch(g){b=0}c=Number(e.toString().replace(".",""));d=Number(f.toString().replace(".",""));return c/d*Math.pow(10,b-a)},accMul:function(e,f){var a=0,b=e.toString(),c=f.toString();try{-1<b.indexOf(".")&&(a+=b.split(".")[1].length)}catch(d){console.info(b)}try{-1<c.indexOf(".")&&(a+=c.split(".")[1].length)}catch(d){console.info(c)}return Number(b.replace(".",""))*Number(c.replace(".",""))/Math.pow(10,a)},toFixed:function(e,f){var a=Math.pow(10,f);return parseInt(e*a+.5,10)/a+""},getCookie:function(e){e=document.cookie.match(new RegExp("(^| )"+e+"\x3d([^;]*)(;|$)"));return null!=e?unescape(e[2]):null},setCookie:function(e,f){var a=new Date;a.setTime(a.getTime()+2592E6);document.cookie=e+"\x3d"+escape(f)+";expires\x3d"+a.toGMTString()+";path\x3d/"}},floatTool=function(){function e(a){var b={times:1,num:0};if(Math.floor(a)===a)return b.num=a,b;var c=a+"",d=c.indexOf("."),c=c.substr(d+1).length,c=Math.pow(10,c);a=parseInt(a*c+.5,10);b.times=c;b.num=a;return b}function f(a,b,c){var d=e(a),g=e(b);b=d.num;a=g.num;var d=d.times,g=g.times,h=d>g?d:g;switch(c){case "add":return(d===g?b+a:d>g?b+d/g*a:g/d*b+a)/h;case "subtract":return(d===g?b-a:d>g?b-d/g*a:g/d*b-a)/h;case "multiply":return b*a/(d*g);case "divide":return f(b/a,g/d,"multiply")}}return{add:function(a,b){return f(a,b,"add")},subtract:function(a,b){return f(a,b,"subtract")},multiply:function(a,b){return f(a,b,"multiply")},divide:function(a,b){return f(a,b,"divide")}}}();