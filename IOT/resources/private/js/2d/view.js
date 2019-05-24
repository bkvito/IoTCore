var BIGMap;
var playback;
var ids = "";//船舶类型
var mbids = "";//船舶唯一标识编码MMSI
var flightIds = ""; //航班参数
var treeObj;//zTree对象
var aismbTreeObj;//AIS目标对象
var flightTreeObj;
var nodes;//树形节点对象
var interval;//定时器对象
var arr = [];
var index = 0;
var offset = 0;
var flag = true;
var blur;
var radius;
var opacity;
var aiswindow = -1;//船舶类型热力演变弹出层
var flightwindow = -1;//Flight弹出层
var aisanalysewindow = -1;//船舶数据统计分析弹出层
var aisentitywindow = -1;//船舶目标热力演变弹出层
var aismbsearchWindow = -1;//船舶目标查询搜索弹出层
var checkIndex = 0;
//页面加载完成后执行
$(document).ready(function () {

    var beyonmap = new BeyonMap("map", {
        minZoom: 1,
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
        /*title: 'Google影像',
        type: 'base',
        visible: true,
        source: new ol.source.XYZ({
        	attributions:"Google影像",
            url: CONFIG.Google_RasterUrl
        })*/
        title: '中国午夜蓝-网络',
        type: 'base',
        visible: true,
        source: new ol.source.XYZ({
            attributions: "中国午夜蓝-网络",
            url: CONFIG.CChinaOnlineStreetPurplishBlue_Url
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
        // visible: true,
        visible: false,
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
            , max: -1 //1天前
        });
        laydate.render({
            elem: '#aismb-beginInpt'
            , theme: '#393D49'
            , max: -1 //1天前
            , done: function (value, date, endDate) {
            }
        });
        laydate.render({
            elem: '#flight-beginInpt'
            , theme: '#393D49'
            , max: -1 //1天前
            , done: function (value, date, endDate) {
                changeTree(value, $("#flight-endInpt").val());
            }
        });
        //日期时间选择器
        laydate.render({
            elem: '#endInpt'
            , theme: '#393D49'
            , max: -1 //1天前
        });
        laydate.render({
            elem: '#aismb-endInpt'
            , theme: '#393D49'
            , max: -1 //1天前
            , done: function (value, date, endDate) {
            }
        });
        laydate.render({
            elem: '#flight-endInpt'
            , theme: '#393D49'
            , max: -1 //1天前
            , done: function (value, date, endDate) {
                changeTree($("#flight-beginInpt").val(), value);
            }
        });
    });
    var date = new Date();
    var dateStr = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + (date.getDate() - 1);
    $("#flight-beginInpt").val(dateStr);
    $("#flight-endInpt").val(dateStr);
    //设置滑块
    layui.use('slider', function () {
        var slider = layui.slider;

        //渲染
        aisblur = slider.render({
            elem: "#a-blurdiv", //绑定元素
            value: 20,
            change: function (value) {
                //do something
                BIGMap.getHeatmapLayer().setBlur(value);
            }
        });
        aismbblur = slider.render({
            elem: "#amb-blurdiv", //绑定元素
            value: 20,
            change: function (value) {
                //do something
                BIGMap.getHeatmapLayer().setBlur(value);
            }
        });
        flightblur = slider.render({
            elem: "#f-blurdiv", //绑定元素
            value: 20,
            change: function (value) {
                //do something
                BIGMap.getHeatmapLayer().setBlur(value);
            }
        });
        //渲染
        aisradius = slider.render({
            elem: "#a-radiusdiv", //绑定元素
            value: 5,
            change: function (value) {
                //do something
                BIGMap.getHeatmapLayer().setRadius(value);
            }
        });
        aismbradius = slider.render({
            elem: "#amb-radiusdiv", //绑定元素
            value: 5,
            change: function (value) {
                //do something
                BIGMap.getHeatmapLayer().setRadius(value);
            }
        });
        flightradius = slider.render({
            elem: "#f-radiusdiv", //绑定元素
            value: 5,
            change: function (value) {
                //do something
                BIGMap.getHeatmapLayer().setRadius(value);
            }
        });
        //渲染
        aisopacity = slider.render({
            elem: "#a-opacitydiv", //绑定元素
            value: 90,
            change: function (value) {
                //do something
                BIGMap.getHeatmapLayer().setOpacity(value / 100);
            }
        });
        aismbopacity = slider.render({
            elem: "#amb-opacitydiv", //绑定元素
            value: 90,
            change: function (value) {
                //do something
                BIGMap.getHeatmapLayer().setOpacity(value / 100);
            }
        });
        flightopacity = slider.render({
            elem: "#f-opacitydiv", //绑定元素
            value: 90,
            change: function (value) {
                //do something
                BIGMap.getHeatmapLayer().setOpacity(value / 100);
            }
        });
    });

    //ais初始化树形
    var setting = {
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
            onCheck: aisOnCheck
        }
    };
    var aismbsetting = {
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
            onCheck: aismbOnCheck
        }
    };

    var zNodes = [
        { id: 1, pId: 0, name: "船舶类型", open: true },
        { id: 101, pId: 1, name: "地效翼船", other: "2" },
        { id: 102, pId: 1, name: "作业船", other: "3" },
        { id: 103, pId: 1, name: "高速轮", other: "4" },
        { id: 104, pId: 1, name: "拖轮", other: "5" },
        { id: 108, pId: 1, name: "客轮", other: "6" },
        { id: 109, pId: 1, name: "货轮", other: "7" },
        { id: 110, pId: 1, name: "油轮", other: "8" },
        { id: 111, pId: 1, name: "其他", other: "9" },
        { id: 112, pId: 1, name: "不详", other: "0,1" }
    ];

    var aisEntityNodes = [{ id: 1, pId: 0, name: "船舶编码", isParent: true }];

    $.fn.zTree.init($("#treeDemo"), setting, zNodes);

    $.fn.zTree.init($("#treembDemo"), aismbsetting, aisEntityNodes);

    treeObj = $.fn.zTree.getZTreeObj("treeDemo");

    aismbTreeObj = $.fn.zTree.getZTreeObj("treembDemo");

    //ais树形节点选中事件
    function aisOnCheck(e, treeId, treeNode) {
        var str = "";
        //获取所有树形节点，把除了根节点之外的所有节点对应的类型返回
        nodes = treeObj.getCheckedNodes(true);
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].level !== 0) {
                str += nodes[i].other + ",";
            }
        }
        ids = str.substring(0, str.length - 1);
    }

    //ais目标树形节点选中事件
    function aismbOnCheck(e, treeId, treeNode) {
        var str = "";
        //获取所有树形节点，把除了根节点之外的所有节点对应的类型返回
        nodes = aismbTreeObj.getCheckedNodes(true);
        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].level !== 0) {
                str += nodes[i].other + ",";
            }
        }
        mbids = str.substring(0, str.length - 1);
        console.log(mbids)
    }


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
            , "begin": $("#flight-beginInpt").val()
            , "end": $("#flight-endInpt").val()
        },
        dataType: "json",
        success: function (data) {
            var flightzNodes = new Array();
            flightzNodes.push({ id: 1, pId: 0, name: "飞机类型", open: true });
            for (var i = 0; i < 10 & i < data.length; i++) {
                var obj = { id: data[i], pId: 1, name: data[i] };
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
        if (flightTreeObj.getCheckedNodes(false).length === -1) {
            flightIds = "all";
        } else {
            nodes = flightTreeObj.getCheckedNodes(true);
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].level !== 0) {
                    var string = nodes[i].name;
                    str += string.substr(0, string.indexOf("(", 0)) + ",";
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


    //船舶编码和轨迹点数表格复选框事件
    var ck = $("#aistable").find("thead input[type='checkbox']");
    ck.change(function () {
        var _ = $(this);
        var flag = _.prop("checked");
        $("#aistable").find("tbody input[type='checkbox']").prop("checked", flag);

        var trArr = $("#aistable").find("tbody tr");
        trArr.each(function(){
            var trObj = $(this);
            if(flag){
                trObj.data("ck","1");
            }else{
                trObj.data("ck","0");
            }
        });
    });
    

    //船舶编码弹出框按钮点击事件
    $("#aismbSearchBtn").click(function () {
        var val = $("#aismmsiInpt").val();
        var begin = $("#aismb-beginInpt").val();
        var end = $("#aismb-endInpt").val();
        $.ajax({
            url: "http://192.168.1.199:8084/flight24/ais/querymmsiData",
            type: "POST",
            data: {
                "mmsi": val,
                "begin": begin,
                "end": end
            },
            dataType: "json",
            success: function (data) {
                var obj = data.data;
                $("#aistable").show();
                var aistbody = $("#aistable").find("tbody");
                aistbody.empty();
                var html = "";
                for(var i=0;i<obj.length;i++){
                    html+="<tr data-ck='0'><th scope='row'><input type='checkbox'></th><td>"+obj[i].mmsi+"</td><td>"+obj[i].num+"</td></tr>";
                }
                aistbody.append(html);
                var childck = $("#aistable").find("tbody input[type='checkbox']");
                childck.each(function () {
                    var _ = $(this);
                    _.change(function () {
                        var __ = $(this);
                        var parentTr = __.parent().parent();
                        var flag = __.prop("checked");
                        if(flag){
                            checkIndex = checkIndex+1;
                            parentTr.data("ck","1");
                        }else{
                            checkIndex = checkIndex-1;
                            parentTr.data("ck","0");
                        }
                        if(checkIndex>0){
                            $("#aistable").find("thead input[type='checkbox']").prop("checked", true);
                        }else{
                            $("#aistable").find("thead input[type='checkbox']").prop("checked", false);
                        }
                    });
                });
            }
        });
    });



});


function init3D() {
    // BIGMap.init3DMap();

    //BIGMap.enableLighting(true);

    var terrainProvider = new Cesium.CesiumTerrainProvider({
        //                url: '//assets.agi.com/stk-terrain/world',
        url: CONFIG.DEM2_Url
        //                    requestWaterMask: true,
    });

    // BIGMap.getOL3D().getCesiumScene().terrainProvider = terrainProvider;
    var scene = BIGMap.getOL3D().getCesiumScene();
    var ca = new Cesium.Camera(scene);
    var ds = Cesium.CzmlDataSource.load('../data/beidou.czml');
    // BIGMap.getOL3D().getDataSources().add(ds);


    BIGMap.getOL3D().getDataSources().add(ds).then(function (dataSource) {
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
    }).otherwise(function (error) {
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



//功能按钮滑动事件
$("#flightbtn").hover(function () {
    $("#flightbtn").css("box-shadow", "0 0 16px");
}, function () {
    $("#flightbtn").css("box-shadow", "0 1px 1px rgba(0,0,0,.05)");
});



//停止演变按钮
$("#stopBtn").click(function () {
    layer.confirm('是否确认停止热力演变？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        layer.close(layer.index);//关闭弹出框，在错误调用后台方法的时候[在后台调用失败的时候会导致确认弹出框无法关闭]
        $("#stopBtn").prop("disabled", "disabled");
        $("#stopBtn").attr("disabled", "disabled");
        $("#startBtn").removeAttr("disabled");
        $("#startBtn").removeProp("disabled");
        clearStatus();
        $("h4").text("");
    }, function () {
    });
});

//AIS目标热力也变停止演变按钮
$("#mbstopBtn").click(function () {
    layer.confirm('是否确认停止热力演变？', {
        btn: ['确定', '取消'] //按钮
    }, function () {
        layer.close(layer.index);//关闭弹出框，在错误调用后台方法的时候[在后台调用失败的时候会导致确认弹出框无法关闭]
        $("#mbstopBtn").prop("disabled", "disabled");
        $("#mbstopBtn").attr("disabled", "disabled");
        $("#mbstartBtn").removeAttr("disabled");
        $("#mbstartBtn").removeProp("disabled");
        clearStatus();
        $("h4").text("");
    }, function () {
    });
});

//开始演变按钮
$("#startBtn").click(function () {
    if (ids.trim().length === 0) {
        alert("请选择要查询的船舶类型！！！！");
        return;
    }
    var begin = $("#beginInpt").val();
    var end = $("#endInpt").val();
    if (begin.trim().length === 0 || end.trim().length === 0) {
        alert("请选择要查询的时间！！！！");
        return;
    }
    $("#startBtn").prop("disabled", "disabled");
    $("#startBtn").attr("disabled", "disabled");
    $("#stopBtn").removeAttr("disabled");
    $("#stopBtn").removeProp("disabled");


    //判断两个日期相隔多少天
    offset = DateDiff(begin, end);

    var days = [];
    if (offset === 0) {
        days.push(begin);
    } else {
        days.push(begin);
        for (var j = 1; j <= offset; j++) {
            var day = addByTransDate(begin, j);
            days.push(day);
        }
    }
    arr = days;

    interval = window.setInterval("xunhuan()", 10000);
});

//AIS目标热力开始演变按钮
$("#mbstartBtn").click(function () {
    if (mbids.trim().length === 0) {
        alert("请选择要查询的船舶类型！！！！");
        return;
    }
    var begin = $("#aismb-beginInpt").val();
    var end = $("#aismb-endInpt").val();
    if (begin.trim().length === 0 || end.trim().length === 0) {
        alert("请选择要查询的时间！！！！");
        return;
    }
    $("#mbstartBtn").prop("disabled", "disabled");
    $("#mbstartBtn").attr("disabled", "disabled");
    $("#mbstopBtn").removeAttr("disabled");
    $("#mbstopBtn").removeProp("disabled");


    //判断两个日期相隔多少天
    offset = DateDiff(begin, end);

    var days = [];
    if (offset === 0) {
        days.push(begin);
    } else {
        days.push(begin);
        for (var j = 1; j <= offset; j++) {
            var day = addByTransDate(begin, j);
            days.push(day);
        }
    }
    arr = days;

    interval = window.setInterval("mbxunhuan()", 10000);
});

$("#flightbtn").click(function () {
    if (aiswindow != -1) {
        layer.close(aiswindow);
        aiswindow = -1;
    }
    if (aisanalysewindow != -1) {
        layer.close(aisanalysewindow);
        aisanalysewindow = -1;
    }
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
        layer.close(layer.index);//关闭弹出框，在错误调用后台方法的时候[在后台调用失败的时候会导致确认弹出框无法关闭]
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
    var end = $("#flight-endInpt").val();
    if (begin.trim().length === 0 || end.trim().length === 0) {
        alert("请选择要查询的时间！！！！");
        return;
    }
    $("#flight-startBtn").prop("disabled", "disabled");
    $("#flight-startBtn").attr("disabled", "disabled");
    $("#flight-stopBtn").removeAttr("disabled");
    $("#flight-stopBtn").removeProp("disabled");


    //判断两个日期相隔多少天
    offset = DateDiff(begin, end);

    var days = [];
    if (offset === 0) {
        days.push(begin);
    } else {
        days.push(begin);
        for (var j = 1; j <= offset; j++) {
            var day = addByTransDate(begin, j);
            days.push(day);
        }
    }
    arr = days;

    interval = window.setInterval(flightxunhuan, 10000);
});

//计算两个日期天数差的函数，通用
function DateDiff(sDate1, sDate2) {  //sDate1和sDate2是yyyy-MM-dd格式
    var aDate, oDate1, oDate2, iDays;
    aDate = sDate1.split("-");
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);  //转换为yyyy-MM-dd格式
    aDate = sDate2.split("-");
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
    iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数

    return iDays;  //返回相差天数
}

//根据指定的一个日期和相差的天数，获取另外一个日期
//dateParameter为指定已经存在的日期yyyy-MM-dd  num为相差天数为整型 
function addByTransDate(dateParameter, num) {

    var translateDate = "", dateString = "", monthString = "", dayString = "";
    translateDate = dateParameter.replace("-", "/").replace("-", "/");
    ;

    var newDate = new Date(translateDate);
    newDate = newDate.valueOf();
    newDate = newDate + num * 24 * 60 * 60 * 1000;  //备注 如果是往前计算日期则为减号 否则为加号
    newDate = new Date(newDate);

    //如果月份长度少于2，则前加 0 补位   
    if ((newDate.getMonth() + 1).toString().length == 1) {
        monthString = 0 + "" + (newDate.getMonth() + 1).toString();
    } else {
        monthString = (newDate.getMonth() + 1).toString();
    }

    //如果天数长度少于2，则前加 0 补位   
    if (newDate.getDate().toString().length == 1) {

        dayString = 0 + "" + newDate.getDate().toString();
    } else {

        dayString = newDate.getDate().toString();
    }

    dateString = newDate.getFullYear() + "-" + monthString + "-" + dayString;
    return dateString;

}

//AIS类型热力演变定时调用方法
function xunhuan() {
    if (index >= arr.length) {
        index = 0;
    }
    $("h4").text(arr[index] + "日 AIS热力数据");
    //发送ajax请求
    $.ajax({
        url: "http://192.168.1.25:9090/flight24/ais/queryLineStringHeatData",
        type: "POST",
        data: {
            "ids": ids,
            "date": arr[index]
        },
        dataType: "json",
        beforeSend: function () {
            showLoading();
        },
        error: function (req, status, error) {//同时，在数据请求的时候可能会遇到后台服务停止或者崩溃的情况，则仍需要停止定时器，结束后台调用
            if (status == "timeout") {
                if (interval) {
                    interval = window.clearInterval(interval);
                }
                console.log("请求超时，请稍后再试!！");
                return;
            } else if (status === "error") {
                if (interval) {
                    interval = window.clearInterval(interval);
                }
                console.log("数据请求失败，请稍后再试!如果还未解决，请联系管理员！");
                return;
            }
            return;
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

//AIS目标热力演变定时调用方法
function mbxunhuan() {
    if (index >= arr.length) {
        index = 0;
    }
    $("h4").text(arr[index] + "日 AIS热力数据");
    //发送ajax请求
    $.ajax({
        url: "http://192.168.1.199:8084/flight24/ais/queryLineStringHeatDataByMMSI",
        type: "POST",
        data: {
            "ids": mbids,
            "date": arr[index]
        },
        dataType: "json",
        beforeSend: function () {
            showLoading();
        },
        error: function (req, status, error) {//同时，在数据请求的时候可能会遇到后台服务停止或者崩溃的情况，则仍需要停止定时器，结束后台调用
            if (status == "timeout") {
                if (interval) {
                    interval = window.clearInterval(interval);
                }
                console.log("请求超时，请稍后再试!！");
                return;
            } else if (status === "error") {
                if (interval) {
                    interval = window.clearInterval(interval);
                }
                console.log("数据请求失败，请稍后再试!如果还未解决，请联系管理员！");
                return;
            }
            return;
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

function flightxunhuan() {
    if (index >= arr.length) {
        index = 0;
    }
    $("h4").text(arr[index] + "日 flight热力数据");
    //发送ajax请求
    $.ajax({
        url: "http://192.168.1.25:9090/flight24/flight24/getFeatureData",
        type: "POST",
        data: {
            "allValue": flightIds,
            "begin": arr[index],
            "end": arr[index],
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
    if (interval) {
        interval = window.clearInterval(interval);
        layer.msg('热力演变已经停止', { icon: 1 });
    }

    BIGMap.getHeatmapLayer().getSource().clear();
}


function changeTree(begin, end) {
    flightTreeObj.removeChildNodes(flightTreeObj.getNodesByParam("id", 1, null)[0]);
    $.ajax({
        url: "http://192.168.1.25:9090/flight24/flight24/getAllFieldByTime",
        type: "POST",
        data: {
            "field": "model"
            , "begin": begin
            , "end": end
        },
        dataType: "json",
        success: function (data) {
            var zNodes = new Array();
            for (var i = 0; i < 10 & i < data.length; i++) {
                var obj = { id: data[i], pId: 1, name: data[i] };
                zNodes.push(obj);
            }
            flightTreeObj.addNodes(flightTreeObj.getNodesByParam("id", 1, null)[0], -1, zNodes, null);
        }
    });
}



function addNode(e) {
    var addNodes = new Array();
    $.each(e, function (i, n) {
        var value = $(n).attr("value");
        if (flightTreeObj.getNodesByParam("name", value, null).length === 0) {
            addNodes.push({ tId: value, name: value });
        }
    });
    flightTreeObj.addNodes(flightTreeObj.getNodesByParam("id", 1, null)[0], -1, addNodes, null);
}

var center = function (othis) {
    var type = othis.data('type');
    layer.open({
        type: 1
        , area: ['995px', '456px']
        , offset: ['188px', '407px'] //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
        , id: 'layerDemo' + type //防止重复弹出
        , content: '<div id="allModel" style="overflow-y:auto; overflow-x:auto; height:360px;padding: 50px; line-height: 22px; background-color: #393D49; color: #fff; font-weight: 300;"></div>'
        , btn: ['添加', '取消']
        , btnAlign: 'c' //按钮居中
        , shade: 0 //不显示遮罩
        , success: function (layero) {
            var allmodeldiv = layero.find("#allModel");
            var html = "<div> <label class='layui-form-label'>机型:</label><div class='layui-input-block'>";
            $.ajax({
                url: "http://192.168.1.25:9090/flight24/flight24/getAllFieldByTime",
                type: "POST",
                data: {
                    "field": "model"
                    , "begin": $("#flight-beginInpt").val()
                    , "end": $("#flight-endInpt").val()
                },
                dataType: "json",
                success: function (data) {
                    for (var i = 0; i < data.length; i++) {
                        if (flightTreeObj.getNodesByParam("name", data[i], null).length === 0) {
                            html = html + "<input type='checkbox' name='model' value='" + data[i] + "'/>" + data[i] + " ";
                        }
                    }
                    allmodeldiv.append(html + "</div></div>");
                }
            });
            layero.find('.layui-layer-btn').find('.layui-layer-btn0').click(function () { addNode($("input[name = 'model']:checked")) });
        }
    });
}

$('#moreModelBtu').on('click', function () {
    var othis = $(this);
    center.call(this, othis);
});

$('#moreAISEntityBtn').click(function () {
    var type = $('#moreAISEntityBtn').data("type");
    aismbsearchWindow = layer.open({
        type: 1,
        title: 'AIS目标添加'
        , area: ['495px', '600px']
        , offset: ['110px', '520px'] //具体配置参考：http://www.layui.com/doc/modules/layer.html#offset
        , id: 'layerDemo' + type //防止重复弹出
        , content: $('#aismbsearch')
        , btn: ['添加','取消']
        , btnAlign: 'c' //按钮居中
        , shade: 0 //不显示遮罩
        , success: function (layero) {
            
            layero.find('.layui-layer-btn').find('.layui-layer-btn0').click(function () { //添加按钮点击事件
                var nodeArr = [{ id: 1, pId: 0, name: "船舶编码", open: true }];
                //判断是否有选中的节点
                var arr = $("#aistable").find("tbody tr");
                arr.each(function(){
                    var a = $(this);
                    var ckstatus = a.data("ck");
                    var mbNode = {};
                    var trObj = "";
                    if(ckstatus==1){
                        var tdarr = a.find("td");
                        tdarr.each(function(index){
                            var tdObj = $(this);
                            if(index==0){
                                trObj =  tdObj.text(); 
                                mbNode.id = trObj;
                                mbNode.other = trObj;
                            }else{
                                trObj = trObj+"("+tdObj.text()+")";
                                mbNode.name = trObj;
                            }
                            mbNode.pId = 1;
                        });
                        nodeArr.push(mbNode);
                    }
                })

                //每次添加天都先删除之前旧的
                var nodes = aismbTreeObj.getNodes();
                for (var i=0, l=nodes.length; i < l; i++) {
                    aismbTreeObj.removeNode(nodes[i]);
                }

                //添加树形节点
                aismbTreeObj.addNodes(null,nodeArr,true);
            });
            layero.find('.layui-layer-btn').find('.layui-layer-btn1').click(function () { //取消按钮点击事件
                aismbsearchWindow = -1;
                $("#aismmsiInpt").val("");
                $("#aistable").hide();
                var ck = $("#aistable").find("thead input[type='checkbox']");
                ck.prop("checked",false);
            });
        },end:function(){//关闭窗口点击事件
            aismbsearchWindow = -1;
            $("#aismmsiInpt").val("");
            $("#aistable").hide();
            var ck = $("#aistable").find("thead input[type='checkbox']");
            ck.prop("checked",false);
        }
    });
});

function filter(node) {
    return (node.id != 1 );
}

//显示加载层
function showLoading() {
    //$("#loadingDiv").show();
    $('#loadingWrapper').show();
}
//隐藏加载层
function hideLoading() {
    //$("#loadingDiv").hide();
    $('#loadingWrapper').hide();
}

//为了以后的注销用户做准备
function logout() {
    //console.log(window.location.hostname)
    var logoutURL = "xxxx"; //用于注销用户的url
    if (logoutURL == "")
        return;
    var userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.indexOf("msie") > -1) { //IE
        $.ajax({ url: logoutURL, crossDomain: true, async: false, dataType: "jsonp" });
    } else { //FireFox Chrome
        $.ajax({ url: logoutURL, async: false });
    }
}

//////////////////////////////////////////////////////
//船舶功能所有调用方法//////////////////////////////////
//////////////////////////////////////////////////////
//船舶类型热力演变数据方法
function aistypeheatdata() {
    if (flightwindow != -1) {
        layer.close(flightwindow);
        flightwindow = -1;
    }
    if (aisanalysewindow != -1) {
        layer.close(aisanalysewindow);
        aisanalysewindow = -1;
    }
    if (aisentitywindow != -1) {
        layer.close(aisentitywindow);
        aisentitywindow = -1;
    }
    if (aiswindow === -1) {
        aiswindow = layer.open({
            type: 1,
            title: 'AIS数据热力演变',
            skin: 'layui-layer-molv',
            maxmin: false,
            resize: false,
            offset: ['110px', '170px'],
            area: ['320px', '610px'],
            content: $('#aisbody'),
            shade: false,
            end: function () {
                aiswindow = -1;
                $("#stopBtn").prop("disabled", "disabled");
                $("#stopBtn").attr("disabled", "disabled");
                $("#startBtn").removeAttr("disabled");
                $("#startBtn").removeProp("disabled");
                clearStatus();
                $("h4").text("");
            }
        });
    }
}

//船舶实体热力演变数据方法
function aisentityheatdata() {
    if (flightwindow != -1) {
        layer.close(flightwindow);
        flightwindow = -1;
    }
    if (aisanalysewindow != -1) {
        layer.close(aisanalysewindow);
        aisanalysewindow = -1;
    }
    if (aiswindow != -1) {
        layer.close(aiswindow);
        aiswindow = -1;
    }
    if (aisentitywindow === -1) {
        aisentitywindow = layer.open({
            type: 1,
            title: 'AIS数据热力演变',
            skin: 'layui-layer-molv',
            maxmin: false,
            resize: false,
            offset: ['110px', '170px'],
            area: ['320px', '660px'],
            content: $('#aismbbody'),
            shade: false,
            end: function () {
                aisentitywindow = -1;
                layer.close(aismbsearchWindow);
                aismbsearchWindow = -1;
                $("#mbstopBtn").prop("disabled", "disabled");
                $("#mbstopBtn").attr("disabled", "disabled");
                $("#mbstartBtn").removeAttr("disabled");
                $("#mbstartBtn").removeProp("disabled");
                clearStatus();
                $("h4").text("");
            }
        });
    }
}

//船舶数据统计分析调用方法
function aisanalysedata() {
    //获取屏幕高度宽度
    var width = document.body.clientWidth;
    var height = document.body.clientHeight;
    width = parseInt(width * 0.9) + "px";
    height = parseInt(height * 0.9) + "px";

    if (flightwindow != -1) {
        layer.close(flightwindow);
        flightwindow = -1;
    }
    if (aiswindow != -1) {
        layer.close(aiswindow);
        aiswindow = -1;
    }
    if (aisentitywindow != -1) {
        layer.close(aisentitywindow);
        aisentitywindow = -1;
    }
    if (aisanalysewindow === -1) {
        aisanalysewindow = layer.open({
            type: 2,
            title: 'Ais数据统计',
            shadeClose: true,
            shade: false,
            maxmin: true, //开启最大化最小化按钮
            //area: ['1000px', '600px'],
            area: [width, height],
            content: 'analyse.html',
            end: function () {
                aisanalysewindow = -1;
                clearStatus();
            }
        });
        //layer.full(aisanalysewindow);
    }
}

//////////////////////////////////////////////////////
//航班功能所有调用方法//////////////////////////////////
//////////////////////////////////////////////////////
function flightheatdata() {
    if (aiswindow != -1) {
        layer.close(aiswindow);
        aiswindow = -1;
    }
    if (aisanalysewindow != -1) {
        layer.close(aisanalysewindow);
        aisanalysewindow = -1;
    }
    if (aisentitywindow != -1) {
        layer.close(aisentitywindow);
        aisentitywindow = -1;
    }
    if (flightwindow === -1) {
        flightwindow = layer.open({
            type: 1,
            title: 'Flight数据热力演变',
            skin: 'layui-layer-molv',
            maxmin: false,
            resize: false,
            offset: ['110px', '170px'],
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
}