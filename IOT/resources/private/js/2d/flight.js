var BIGMap;
var playback;
var flightIds = ""; //航班参数
var flightTreeObj;
var nodes;//树形节点对象
var interval;//定时器对鞋
var arr = [];
var index = 0;
var offset = 0;
var flag = true;
var blur;
var radius;
var opacity;
var flightwindow = -1;
//页面加载完成后执行
$(document).ready(function () {

    var beyonmap = new BeyonMap("map", {
        minZoom:1,
        maxZoom: 19
    });
    BIGMap = beyonmap;

    //控制热力图不显示图层管理器上
    // BIGMap.getHeatmapLayer().set('displayInLayerSwitcher', false);
    //控制不显示在地图上，但是在图层管理器中能看到
    BIGMap.getHeatmapLayer().set('visible', true);

    BIGMap.enableMarkerPopup();

    BIGMap.setZoom(4);
  
   var google = new ol.layer.Tile({
        title: 'Google影像',
        type: 'base',
        visible: true,
        source: new ol.source.XYZ({
        	attributions:"Google影像",
            url: CONFIG.Google_RasterUrl
        })
    });

    var google2 = new ol.layer.Tile({
        title: 'Google影像本地',
        type: 'base',
        visible: false,
        source: new ol.source.XYZ({
            url: CONFIG.Google_RasterUrl_lOCAL
        })
    });
   var googleAno = new ol.layer.Tile({
        title: 'Google影像注记',
        type: 'overlay',
        visible: true,
        source: new ol.source.XYZ({
            url: CONFIG.Google_RasterAnoUrl
        })
    });
   var googleAno2 = new ol.layer.Tile({
        title: 'Google影像注记本地',
        type: 'overlay',
        visible: false,
        source: new ol.source.XYZ({
            url: CONFIG.Google_RasterAnoUrl_lOCAL
        })
    });
   
    BIGMap.addBaseLayer(google);
    BIGMap.addBaseLayer(google2);
    BIGMap.addOverLayLayer(googleAno);
    BIGMap.addOverLayLayer(googleAno2);
    // BIGMap.addOverLayLayer(overlayLayer);

    // BIGMap.getDefaultOverlayGroup().getLayers().push(bigraster);

    //设置开始时间和结束时间
    layui.use('laydate', function () {
        var laydate = layui.laydate;
        //日期时间选择器
        laydate.render({
            elem: '#beginInpt'
            , theme: '#393D49'
            ,max: -1 //1天前
        });
        laydate.render({
            elem: '#flight-beginInpt'
            , theme: '#393D49'
            ,max: -1 //1天前
            ,done: function(value, date, endDate){
            	changeTree(value, $("#flight-endInpt").val());
            }
        });
        //日期时间选择器
        laydate.render({
            elem: '#endInpt'
            , theme: '#393D49'
            ,max: -1 //1天前
        });
    });
    var date = new Date();
    var dateStr = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+(date.getDate()-1);
    $("#flight-beginInpt").val(dateStr);
    $("#flight-beginInpt").val(dateStr);
    //设置滑块
    layui.use('slider', function () {
        var slider = layui.slider;

        //渲染
        flightblur = slider.render({
            elem: "#f-blurdiv", //绑定元素
            value: 20,
            change: function (value) {
                //do something
                BIGMap.getHeatmapLayer().setBlur(value);
            }
        });
        //渲染
        flightradius = slider.render({
            elem: "#f-radiusdiv", //绑定元素
            value: 5,
            change: function (value) {
                //do something
                BIGMap.getHeatmapLayer().setRadius(value);
            }
        });
        //渲染
        flightopacity = slider.render({
            elem: "#f-opacitydiv", //绑定元素
            value: 90,
            change: function (value) {
                //do something
                BIGMap.getHeatmapLayer().setOpacity(value / 100);
            }
        });
    });

	//flight初始化树形
    var flightSetting = {
        view: {
            selectedMulti: false
        },
        check: {
            enable: true
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            onCheck: flightOnCheck
        }
    };
                
    $.ajax({
        url: "http://192.168.1.25:9090/flight24/flight24/getAllFieldByTime",
        type: "POST",
        data: {
            "field": "model"
            ,"begin": $("#flight-beginInpt").val()
            ,"end": $("#flight-beginInpt").val()
        },
        dataType: "json",
        success: function (data) {
           var flightzNodes = new Array();
           flightzNodes.push({id: 1, pId: 0, name: "飞机类型", open: true});
           for(var i =0; i < 10 & i < data.length; i++) {
              var obj = {id: data[i], pId: 1, name: data[i]};
              flightzNodes.push(obj);
           }
           $.fn.zTree.init($("#flight-treeDemo"), flightSetting, flightzNodes);
           flightTreeObj = $.fn.zTree.getZTreeObj("flight-treeDemo");
        }
    });
    //flight树形节点选中事件
    function flightOnCheck(e, treeId, treeNode) {
        var str = "";
        //获取所有树形节点，把除了根节点之外的所有节点对应的类型返回
        if(flightTreeObj.getCheckedNodes(false).length === -1) {
            flightIds = "all";
        } else {
            nodes = flightTreeObj.getCheckedNodes(true);
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].level !== 0) {
                    var string = nodes[i].name;
                    str += string.substr(0,string.indexOf("(",0)) + ",";
                }
            }
        flightIds = str.substring(0, str.length - 1);
        }

    }


    //关闭或者刷新页面时如果定时器仍在进行会导致后台程序默认执行，所以应该停止定时器
    window.onbeforeunload = function () {
        if (interval) {
            interval = window.clearInterval(interval);
        }
    };




});


function init3D(){
	 // BIGMap.init3DMap();
  
    //BIGMap.enableLighting(true);

    var terrainProvider = new Cesium.CesiumTerrainProvider({
        //                url: '//assets.agi.com/stk-terrain/world',
        url: CONFIG.DEM2_Url
        //                    requestWaterMask: true,
    });

    // BIGMap.getOL3D().getCesiumScene().terrainProvider = terrainProvider;
   var scene =  BIGMap.getOL3D().getCesiumScene();
    var ca = new Cesium.Camera(scene);
    var ds = Cesium.CzmlDataSource.load('../data/beidou.czml');
    // BIGMap.getOL3D().getDataSources().add(ds);
   

        BIGMap.getOL3D().getDataSources().add(ds).then(function(dataSource) {
            // var lookAt = endUserOptions.lookAt;
            // if (defined(lookAt)) {
            //     var entity = dataSource.entities.getById(lookAt);
            //     if (defined(entity)) {
            //         viewer.trackedEntity = entity;
            //     } else {
            //         var error = 'No entity with id "' + lookAt + '" exists in the provided data source.';
            //         showLoadError(source, error);
            //     }
            // } else if (!defined(view)) {
            //     ca.flyTo(dataSource);
            // }
            ca.flyTo(dataSource);
        }).otherwise(function(error) {
            showLoadError(source, error);
        });

    BIGMap.getOL3D().setEnabled(true);

}

/**
 * 投影转换，将 EPSG:4326转换成EPSG:3857
 * @param {*} extent 
 */
function transform(extent) {
    return ol.proj.transformExtent(extent, 'EPSG:4326', 'EPSG:3857');
}


$("#flightbtn").hover(function () {
    $("#flightbtn").css("box-shadow", "0 0 16px");
}, function () {
    $("#flightbtn").css("box-shadow", "0 1px 1px rgba(0,0,0,.05)");
});


$("#flightbtn").click(function () {
	if (flightwindow === -1) {
		flightwindow = layer.open({
	        type: 1,
	        title: 'Flight数据热力演变',
	        skin: 'layui-layer-molv',
	        maxmin: false,
	        resize: false,
	        offset: ['110px', '70px'],
	        area: ['320px', '680px'],
	        content: $('#flightbody'),
	        shade: false,
	        end: function () {
	        	flightwindow = -1;
		        $("#flight-stopBtn").prop("disabled", "disabled");
		        $("#flight-stopBtn").attr("disabled", "disabled");
		        $("#flight-startBtn").removeAttr("disabled");
		        $("#flight-startBtn").removeProp("disabled");
		        clearStatus();
		        $("h4").text("");
		    }
	    });
	}
    
});
//停止演变按钮
$("#flight-stopBtn").click(function () {
    layer.confirm('是否确认停止热力演变？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        $("#flight-stopBtn").prop("disabled", "disabled");
        $("#flight-stopBtn").attr("disabled", "disabled");
        $("#flight-startBtn").removeAttr("disabled");
        $("#flight-startBtn").removeProp("disabled");
        clearStatus();
        $("h4").text("");
        
    }, function () {
    });
});

//开始演变按钮
$("#flight-startBtn").click(function () {
    if (flightIds.trim().length === 0) {
        alert("请选择要查询的飞机类型！！！！");
        return;
    }
    flightIds = flightIds === "all" ? "" : flightIds;
    var begin = $("#flight-beginInpt").val();
    var end = $("#flight-beginInpt").val();
    if (begin.trim().length === 0 || end.trim().length === 0) {
        alert("请选择要查询的时间！！！！");
        return;
    }
    $("#flight-startBtn").prop("disabled", "disabled");
    $("#flight-startBtn").attr("disabled", "disabled");
    $("#flight-stopBtn").removeAttr("disabled");
    $("#flight-stopBtn").removeProp("disabled");


    //判断两个日期相隔多少天
    var timestep = new Number($("input[name='timestep']").val());
    var start = new Date(begin+" 00:00:00");
    var index = 0;
    for(var i = 0; i < 60*24; i+=timestep) {
    	var minute = i%60;
    	var hour = (i-minute)/60;
    	var mstr = minute < 10 ? "0"+minute : minute;
    	var hstr = hour < 10 ? "0"+hour : hour;
    	arr[index] = begin+" "+hstr+":"+mstr+":"+"00";
    	index++;
    }
    interval = window.setInterval(flightxunhuan, 10000);
});


function flightxunhuan() {
    if (index >= arr.length-1) {
        index = 0;
    }
    $("h4").text(arr[index] + "flight热力数据");
    //发送ajax请求
    $.ajax({
        url: "http://192.168.1.156:8090/flight24/flight24/getFeacherDataByDayAndStep",
        type: "POST",
        data: {
            "allValue": flightIds,
            "begin": arr[index],
            "end": arr[index+1],
            "rate": $("input[name='rate']").val(),
            "field": "model"
        },
        dataType: "json",
        beforeSend: function () {
            showLoading();
        },
        success: function (data) {
            BIGMap.getHeatmapLayer().getSource().clear();
            var obj = data.data;
            for (var i = 0; i < obj.length; i++) {
                var wkt = obj[i].geodata;
                //初始化wkt
                var wkt_c = new ol.format.WKT();
                //将wkt格式数据转换成geometry对象
                var geometry = wkt_c.readFeatures(wkt, {
                    dataProjection: 'EPSG:4326',
                    featureProjection: 'EPSG:3857'
                });
                //将图形添加到指定图层上
				BIGMap.getHeatmapLayer().getSource().addFeatures(geometry);
            }
        },
        complete: function () {
        	hideLoading();
            index++;
        }
    });
}

function clearStatus() {
	if(interval) {
		interval = window.clearInterval(interval);
		layer.msg('热力演变已经停止', {icon: 1});
	}
	
    BIGMap.getHeatmapLayer().getSource().clear();
}


function changeTree(begin,end){
    flightTreeObj.removeChildNodes(flightTreeObj.getNodesByParam("id", 1, null)[0]);
    $.ajax({
        url: "http://192.168.1.25:9090/flight24/flight24/getAllFieldByTime",
        type: "POST",
        data: {
            "field": "model"
            ,"begin": begin
            ,"end": end
        },
        dataType: "json",
        success: function (data) {
           var zNodes = new Array();
           for(var i =0 ; i < 10 & i < data.length; i++) { 
              var obj = {id: data[i], pId: 1, name: data[i]};
              zNodes.push(obj);
           }
           flightTreeObj.addNodes(flightTreeObj.getNodesByParam("id", 1, null)[0],-1,zNodes,null);
        }
    });
}



function addNode(e) {
    var addNodes = new Array();
    $.each(e, function(i,n){
        var value = $(n).attr("value");
        if(flightTreeObj.getNodesByParam("name", value, null).length === 0) {
            addNodes.push({tId : value, name: value});
        }
    });
    flightTreeObj.addNodes(flightTreeObj.getNodesByParam("id", 1, null)[0],-1,addNodes,null);
}            
                        
 var center = function(othis){
      var type = othis.data('type');
      layer.open({
        type: 1
        ,area: ['995px', '456px']
        ,offset: ['188px', '407px'] //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
        ,id: 'layerDemo'+type //防止重复弹出
        ,content: '<div id="allModel" style="overflow-y:auto; overflow-x:auto; height:360px;padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;"></div>'
        ,btn: ['添加', '取消']
        ,btnAlign: 'c' //按钮居中
        ,shade: 0 //不显示遮罩
        ,success: function(layero){
            var allmodeldiv = layero.find("#allModel");
            var html = "<div> <label class='layui-form-label'>机型:</label><div class='layui-input-block'>";
            $.ajax({
                url: "http://192.168.1.25:9090/flight24/flight24/getAllFieldByTime",
                type: "POST",
                data: {
                    "field": "model"
                    ,"begin": $("#flight-beginInpt").val()
                    ,"end": $("#flight-beginInpt").val()
                },
                dataType: "json",
                success: function (data) {
                    for(var i =0 ; i<data.length; i++) {
                        if(flightTreeObj.getNodesByParam("name", data[i], null).length === 0) {
                            html = html + "<input type='checkbox' name='model' value='"+data[i]+"'/>"+data[i]+ " ";
                        }  
                    }
                    allmodeldiv.append(html+"</div></div>");
                }
            });
            layero.find('.layui-layer-btn').find('.layui-layer-btn0') .click(function(){addNode($("input[name = 'model']:checked"))});
        }
    });
 }
   
 $('#moreModelBtu').on('click', function(){
    var othis = $(this);
    center.call(this, othis);
  });



//显示加载层
function showLoading() {
    $("#loadingDiv").show();
}
//隐藏加载层
function hideLoading() {
    $("#loadingDiv").hide();
}
