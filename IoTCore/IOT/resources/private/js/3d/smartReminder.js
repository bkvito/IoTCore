function smartReminder(){
    //生成提醒按钮
    remind
    //请求商铺网格事件  shopGrid
    //请求道路网格事件  roadGrid

    //1.1点击商铺网格消息  生成商铺网格面板 同时定位到点击的网格事件
    //1.2点击道路网格消息  生成道路网格面板 同时定位到点击的网格事件
}
//小车的位置 -2327556.988513823,4561772.542377647,3789048.8006730573
// 0.0,-2327595.2720306134,4561838.7502654,3788948.3199482616,
// 10.0,-2327581.305378903,4561817.791666645,3788981.834629963,
// 15.0,-2327572.3902167347,4561796.721967127,3789011.5210816264,
// 30.0,-2327557.627593028,4561771.295162648,3789049.7953003505

//"interval": "2012-08-04T16:00:00Z/2012-08-04T16:00:04Z",

// "availability":"2012-08-04T16:00:00Z/2012-08-04T16:00:04Z", 
var messageInterval
window.backlogId //商铺待办网格entity的id
window.roadBacklogId //道路待办网格entity的id
//开关
$(document).on('click','#switchBtn',function(){
    
    if($('#openRemind').css('right')=='-22px'){
        crateGrid.crateShopGrid()
        crateGrid.crateRoadGrid()
        $('#openRemind').css({
            'right':'-1px',
            'background':'green'
        })
        setTimeout(function(){
            
            //crateGrid.shopGridBlink()
            //crateGrid.roadGridBlink()
            crateGrid.animation()
            //viewer.clock.shouldAnimate = false;//控制clock停止
            // messageInterval = setInterval(function(){
            //     $('#messageRemind').removeClass("currentMessages").addClass('defaultMessages')
            //     setTimeout(function(){
            //         $('#messageRemind').removeClass('defaultMessages').addClass("currentMessages")
            //     },100)
            //     //console.log('setInterval')
            // },300)
            setTimeout(function(){
                $('.gridBoxRoll').css('display','block')
                crateGrid.shopGridBlink()
                crateGrid.roadGridBlink()
                messageInterval = setInterval(function(){
                    $('#messageRemind').removeClass("currentMessages").addClass('defaultMessages')
                    setTimeout(function(){
                        $('#messageRemind').removeClass('defaultMessages').addClass("currentMessages")
                    },100)
                    //console.log('setInterval')
                },300)
            },3200)
        },3200)
    }else{
        $('#openRemind').css({
            'right':'-22px',
            'background':'red'
        })
        entitiesActually.removeAll()
    }
})
$(document).on('click','#solveId',function(){
    if($('#solveId').html() === "未办结"){
        entitiesActually.remove(entitiesActually.getById(backlogId))
        $('#backlog').html("无待处理事件").css('background','#ea6f6f00')
        $('.infoDivClass').css('background','#ea6f6f00')
        $('#solveId').html("已办结")
    }
})
$(document).on('click','#roadEventStatus',function(){
    if($('#roadEventStatus').html() === "未办结"){
        entitiesActually.remove(entitiesActually.getById('roadBlinkEntity0'))  
        entitiesActually.removeById('roadBacklog0')
        //$('#roadEventStatus').html("已办结").css('background','#ea6f6f00')
        $('#roadEventStatus').css('background','#ff000000')
        $('#roadEventStatus').html("已办结")
        setTimeout(function(){
            
            //$("#roadEventUl0").remove() //这句不行？？？为啥 对比下面一个
            $('.roadUl').remove() //这个可以
            //$('.roadUl').css('display','none')//不好使
            //viewer.dataSources.destroy() //销毁czml添加进的数据
            entitiesActually.removeById('car')
        
        },500)
    }
})


//开启监听之后执行 生成shopgrid 和roadgrid
//var myEntityCar//vehicle
var roadGridArray =[
    117.0320036714,36.6807695534,27,
    117.0320943699,36.6807708685,27, 
    117.0321290022,36.6803782535,27,
    117.0320374795,36.6803804975,27
]
var crateGrid ={
    crateShopGrid:function(){
        var x1=117.0316181401; //117.0316181401,36.6799126616
        var x2=117.0315881401
        var y1=36.6799126616;
        var y2=36.680069579999994
        var xd=(x1 - x2)/5;
        var yd=(y1 - y2)/5;
        var aConstant =0.0001;//管理区宽度
        
        var myentity='myentity'// 网格id
            
        for(var i=0;i<18;i++){
            var yyyy='myArrPolygon'+i
            yyyy =[
                x1-i*xd,y1-i*yd,27,
                x1-(i+1)*xd,y1-(i+1)*yd,27,
                x1-(i+1)*xd+aConstant,y1-(i+1)*yd,27,
                x1-i*xd+aConstant,y1-i*yd,27
            ]
            myArrPolygon.push(yyyy);
            // 店铺 商铺 网格  shopGrid
            entitiesActually.add({
                id:myentity+i,
                polygon : {
                    hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(myArrPolygon[i]),  //不能放到另一个循环里单独生成polygon  这个hierarchy的位置必须在myArrPolygon完全输出后才行 ，不然cesium会报没有coordinate

                    height:27,        
                    material : Cesium.Color.ORANGE.withAlpha(0.2),
                    outline : true,
                    outlineColor : Cesium.Color.BLACK
                }
            });

        }
        //生成四条线
        // var myArra =
        // [
        //     [117.0316174764,36.6799123078, 27,117.0317620369,36.6800949970,32],
        //     [117.0317207402,36.6799145865, 27,117.0317620369,36.6800949970,32],
        //     [117.0316857598,36.6800692279, 27,117.0317620369,36.6800949970,32],
        //     [117.0315858891,36.6800701810, 27,117.0317620369,36.6800949970,32]
        // ];

        // for(var j= 0;j<myArra.length;j++)
        // {
        //     entitiesActually.add({
                
        //         polyline : {
        //             positions : Cesium.Cartesian3.fromDegreesArrayHeights(myArra[j]),
        //             width : 1,
        //             material :Cesium.Color.WHITE
        //         }
        //     });
        // };

        
        clickStatus2=1;
    },
    shopGridBlink:function(){
        //闪烁网格  blink
        entitiesActually.add({
            id:'blinkEntity0',
            polygon:{
            hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(myArrPolygon[0]),                            
            height:27.001,//定义了高度就不会贴着osgb了
            //颜色回调
            material :Cesium.Color.RED.withAlpha(1)
            }
        })

        entitiesActually.add({
            id:'blinkEntity1',
            polygon:{
            hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(myArrPolygon[1]),                            
            height:27.001,//定义了高度就不会贴着osgb了
            //颜色回调
            material :Cesium.Color.RED.withAlpha(1)
            }
        })

        shopBlink0 =setInterval(function(){
            entitiesActually.getById('blinkEntity0').polygon.material=Cesium.Color.ORANGE.withAlpha(0.3);                            
            setTimeout(function(){
                entitiesActually.getById('blinkEntity0').polygon.material=Cesium.Color.RED.withAlpha(1);                                
            },1000)
            //console.log("i am shopBlink0")                     
        },800)
        shopBlink1 =setInterval(function(){
            entitiesActually.getById('blinkEntity1').polygon.material=Cesium.Color.ORANGE.withAlpha(0.3);                            
            setTimeout(function(){
                entitiesActually.getById('blinkEntity1').polygon.material=Cesium.Color.RED.withAlpha(1);                                
            },1000)  
            //console.log("i am shopBlink1")                      
        },800)
    },
    crateRoadGrid:function(){
        //摄像头监控区
        entitiesActually.add({
            id:'carsMonitor',                    
            polygon : {
                hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights([
                    117.0320036714,36.6807695534,27,
                    117.0320943699,36.6807708685,27, 
                    117.0321290022,36.6803782535,27,
                    117.0320374795,36.6803804975,27,
                ]),  //不能放到另一个循环里单独生成polygon  这个hierarchy的位置必须在myArrPolygon完全输出后才行 ，不然cesium会报没有coordinate

                height:27,        
                material : Cesium.Color.ORANGE.withAlpha(0.3),
                outline : true,
                outlineColor : Cesium.Color.BLACK
            }
        }); 
        var myArr =
            [
                [117.0320036714,36.6807695534,27,117.0319903106,36.6808219156,31.2],
                [117.0320943699,36.6807708685,27,117.0319903106,36.6808219156,31.2],
                [117.0321290022,36.6803782535,27,117.0319903106,36.6808219156,31.2],
                [117.0320374795,36.6803804975,27,117.0319903106,36.6808219156,31.2]
            ];

        for(var i= 0;i<myArr.length;i++)
        {
            entitiesActually.add({
                polyline : {
                    positions : Cesium.Cartesian3.fromDegreesArrayHeights(myArr[i]),
                    width : 1,
                    material :Cesium.Color.WHITE.withAlpha(0.3)
                }
            });
        }
        
        // //viewer.clock.shouldAnimate = false;
        // var myEntityCar = Cesium.CzmlDataSource.load('../data/Vehicle.czml')
        // viewer.dataSources.add(myEntityCar);
        // //viewer.dataSources.add(Cesium.CzmlDataSource.load('../data/Vehicle1.czml'));
        // viewer.dataSources.add(Cesium.CzmlDataSource.load('../data/label.czml'));
        
        clickStatus1=1
    },
    roadGridBlink:function(){
        entitiesActually.add({
            id:'roadBlinkEntity0',
            polygon:{
                hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(roadGridArray),                            
            height:27.002,//定义了高度就不会贴着osgb了
            //颜色回调
            material :Cesium.Color.RED.withAlpha(1)
            }
        })
        roadBlink1 =setInterval(function(){
            entitiesActually.getById('roadBlinkEntity0').polygon.material=Cesium.Color.ORANGE.withAlpha(0.3);                            
            setTimeout(function(){
                entitiesActually.getById('roadBlinkEntity0').polygon.material=Cesium.Color.RED.withAlpha(1);                                
            },1000)  
            //console.log("i am roadBlinkEntity0")                      
        },800)
    },
    animation:function(){
        
        var start = Cesium.JulianDate.fromDate(new Date(2015, 2, 25, 16));
        var stop = Cesium.JulianDate.addSeconds(start, 3, new Cesium.JulianDate());//3秒后停止运动

        viewer.clock.startTime = start.clone();
        viewer.clock.stopTime = stop.clone();
        viewer.clock.currentTime = start.clone();
        viewer.clock.clockRange = Cesium.ClockRange.CLAMPED ; //Loop at the end //到stop后停止
        viewer.clock.multiplier = 1; //秒表运行倍数

        //viewer.timeline.zoomTo(start, stop);
        // var carPositionArray=[
        //     [117.0321183685,36.6789209756,29],
        //     [117.0321138647,36.6793391282,29],
        //     [117.0321040796,36.6799573931,29],
        //     [117.0320630505,36.6806054205,29]
        // ]
        var lon=[117.0321183685,117.0321138647,117.0321040796,117.0320630505]
        var lat=[36.6789209756,36.6793391282,36.6799573931,36.6806054205]
        //var heightCar=29
        var property = new Cesium.SampledPositionProperty();
        for(var i=0;i<4;i++){
            var time = Cesium.JulianDate.addSeconds(start, i, new Cesium.JulianDate());
            var position = Cesium.Cartesian3.fromDegrees(lon[i],lat[i],24)  //这里只能用fromDegrees() 用其他的不行 比如说fromDegreesArrayHeights()这个不行的
            property.addSample(time, position);
        }

        entitiesActually.add({
            id:"car",

            //Set the entity availability to the same interval as the simulation time.
            availability : new Cesium.TimeIntervalCollection([new Cesium.TimeInterval({
                start : start,
                stop : stop
            })]),

            //Use our computed positions
            position : property,

            //Automatically compute orientation based on position movement.
            orientation : new Cesium.VelocityOrientationProperty(property),

            //Load the Cesium plane model to represent the entity
            model : {
                uri : '../data/CesiumMilkTruck.glb',
                scale:1.0
            },

            //Show the path as a pink line sampled in 1 second increments.
            path : {
                resolution : 1,
                material : new Cesium.PolylineGlowMaterialProperty({
                    glowPower : 0.1,
                    color : Cesium.Color.YELLOW
                }),
                width : 10
            }
        });

        //viewer.trackedEntity = entityCar
    }
}

//工具栏事件提醒图标
$(document).on('click','#messageRemind',function(){
    if($('#remindBoxId').css('display') !== 'block'){
        //clearInterval(messageInterval);
        $('#messageRemind').removeClass("currentMessages").addClass('defaultMessages')
        $('#remindBoxId').css('display','block')
        $('#remindBoxId').animate({
            width:'370px',
            heigth:'163px'
        },function(){
            $('.gridWrapBox').css('display','block')
            
        })
    }else{
        $('.gridWrapBox').css('display','none')
        $('#shopGridBoxId').css('display','none')
        $('#roadGridBoxId').css('display','none')
        $('#remindBoxId').animate({
            width:'0px',
            heigth:'0px'
        },function(){
            $('#remindBoxId').css('display','none') 
        })
    }
    
    // setTimeout(function(){        
        
    // },300)
    //$('.gridWrapBoxSon').animate({width:'163px'})
    
})

//生成商铺面板 和违章面板 和事件提醒面板
var smartReminder ={    
    remindMaker :function(){//事件提醒按钮
        var remindBox='<div id="remindBoxId"></div>'
        var infoCircle ='<div id="infoCircleId"></div>'//'&nbsp&nbsp'
        var remindBoxSon ='<div id="remindBoxSonId"></div>'
        var remindTile = '<div id="remindTileId">城管网格事件<div id="switchBtn"><p>开</p><p>关</p><div id="openRemind"></div></div></div>'
        var leftBox = '<div class="gridWrapBox" id="leftBoxId">商铺网格事件</div>'
        var rightBox = '<div class="gridWrapBox" id="rightBoxId">道路网格事件</div>'
        var remindShopGridBox = '<div class="gridWrapBoxSon" id="remindShopGridBoxId"></div>'
        var remindRoadGridBox = '<div class="gridWrapBoxSon" id="remindRoadGridBoxId"></div>'
        // var shopGridBoxWrap = '<div id="shopGridBoxWrapId"></div>'
        // var roadGridBoxWrap = '<div id="roadGridBoxWrapId"></div>'
        var shopGridBoxRoll = '<div class ="gridBoxRoll" id="shopGridBoxRollId"></div>'
        var roadGridBoxRoll = '<div class ="gridBoxRoll" id="roadGridBoxRollId"></div>'
        var shopUl1='<ul class="shopEventGrid" id="shopEvent0"><li><a>商铺网格0001</a></li></ul>'
        var shopUl2='<ul class="shopEventGrid" id="shopEvent1"><li><a>商铺网格0002</a></li></ul>'
        //var shopUl3='<ul class="shopEventGrid" id="shopEvent2"><li><a>商铺网格0003</a></li></ul>'
        var roadUl1='<ul class="roadEventGrid" id="roadEvent0"><li><a>道路网格0001</a></li></ul>'
        $(document.body).append(remindBox)
        $('#remindBoxId').append(remindBoxSon,infoCircle)
        $('#remindBoxSonId').append(remindTile,leftBox,rightBox)
        $('#leftBoxId').append(remindShopGridBox)
        $('#rightBoxId').append(remindRoadGridBox)
        $('#remindShopGridBoxId').append(shopGridBoxRoll)
        $('#remindRoadGridBoxId').append(roadGridBoxRoll)
        $('#shopGridBoxRollId').append(shopUl1,shopUl2)
        $('#roadGridBoxRollId').append(roadUl1)
    },
    shopEventClick:function(){
        if($('#shopGridBoxId')){
            //保证该面板打开时 不会重复生成
            $('#shopGridBoxId').remove()
            $('#gridCloseBtnId').remove()
            $('#gridImgId').remove()
            $('#gridInfoId').remove()
        }        
        var shopGridBox ='<div id="shopGridBoxId" class="shopGridClass"></div>'
        var gridCloseBtn ='<div id ="gridCloseBtnId" style="height:20px;width:20px;position:relative;right:-327px;top:-106px;">X</div>'
        var gridTuPian = '<div id ="gridTuPianId" ></div>'
        var gridImg ='<div id ="gridImgId" style="text-align: center">电子网格信息</div>'
        var gridInfo ='<div id ="gridInfoId"></div>' 
                    
        $('#remindBoxId').append(shopGridBox);
        $('#shopGridBoxId').append(gridImg,gridInfo);
        $('#gridImgId').append(gridTuPian,gridCloseBtn)


    },
    roadEventClick:function(){
        if($('#roadGridBoxId')){
            //保证该面板打开时 不会重复生成
            $('#roadGridBoxId').remove()
        }
        var roadGridBox ='<div id="roadGridBoxId" ></div>';
        var roadGridBoxInner ='<div class="roadGridBoxInner" id="roadGridBoxInnerId"></div>';
        var roadGridBoxTile ='<div class="roadGridBoxTile" id="roadGridBoxTileId"><p>违章停车监控</p></div>';
        var roadCancelBtn ='<div class="roadGridBoxTile" id="roadCancelBtnId">X</div>';
        var roadSearch ='<div class="roadGridBoxTile" id="roadSearchId"></div>' ;
        var roadInput ='<input class="roadInput"  type="text" id="roadInputId" placeholder="输入车牌号查询"/> '
        var roadGridBoxWrap ='<div class="roadGridBoxWrap" id="roadGridBoxWrapId" onmouseleave="btnhide()"></div>';
        var roadGridRollbox ='<div class="roadGridRollbox weizhangtingche" id="WZTCId"  onmouseenter="stopRoll()" onmouseleave="restartRoll()"></div>';                
        var roadGridBoxWrapInner ='<div class="roadGridBoxWrapInner" id="roadGridBoxWrapInnerId"></div>';
        var arrowTop='<div class="rollBtn top" id ="arrowTopId"></div>'
        var arrowDown='<div class="rollBtn down" id ="arrowDownId""></div>'        
        
        $('#remindBoxId').append(roadGridBox);
        $('#roadGridBoxId').append(roadGridBoxInner);
        $('#roadGridBoxInnerId').append(roadGridBoxTile,roadGridBoxWrap);
        $('#roadGridBoxTileId').append(roadSearch,roadCancelBtn,roadInput);
        $('#roadGridBoxWrapId').append(roadGridRollbox);
        $('#WZTCId').append(roadGridBoxWrapInner,arrowTop,arrowDown)
    }
}
window.smartReminder=smartReminder
window.num= new Number(); // 
var getWhichJson
window.getWhichJson = getWhichJson// 页面加载的时候被初始化   写完var getWhichJson  之后写window.getWhichJson = getWhichJson 1是为了将他声明成全局变量2.是防止只写window.getWhichJson时  本页面调用getWhichJson时报错getWhichJson is not defined
var getWhichRoadJson
window.getWhichRoadJson = getWhichRoadJson
window.getShopInformation=function(){  //getShopInformation()获取商家信息
    if(getWhichJson == 'myentity'){
        $.ajax({
            type: "get",
            url: "../data/dianpu.json",
            dataType: "json",
            success: function(data){
                //data里包括事件类型 商家事件 或者 交通事件
                //生成展示商家的信息的面板
                
                for(var key in data[num]){
                    var div = 'div'+ key
                    
                    if( key !== '待处理事件' && key !=='logo' ){
                        if(key === '办结状态'){
                            div = '<div class="gridBoxClass" >'+key+':'+'<span id="solveId" style="cursor: pointer;">'+data[num][key]+'</span></div>';
                            $('#gridInfoId').append(div);
                        }else{
                            div = '<div class="gridBoxClass" >'+key+':'+'<span>'+data[num][key]+'</span></div>';
                            $('#gridInfoId').append(div);
                        }
                                                        
                    }else if(key === '待处理事件'){
                        if( data[num][key] != ''){
                            var infoDiv ='<div class="gridBoxClass infoDivClass" style ="background: #ea6f6f">'+key+':'+'<span id="backlog">'+data[num][key]+'</span></div>'
                            $('#gridInfoId').append(infoDiv);
                        }else{
                            var infoDiv ='<div class="gridBoxClass infoDivClass" >'+key+':'+'<span id="backlog">无待处理事件</span></div>'
                            $('#gridInfoId').append(infoDiv);
                        }
                        
                    }else{
                        var url = 'url('+data[num][key]+') no-repeat' ;
                        $('#gridTuPianId').css({                                    
                            'background':url,
                            'background-size':'100% 100%'
                        })
                    }
                }
                
            },
            error: function(message){
                console.log(message)
            }
        })
    }else{
        $.ajax({
            type: "get",
            url: "../data/dianpuEvent.json",
            dataType: "json",
            success: function(data){
                //data里包括事件类型 商家事件 或者 交通事件
                //生成展示商家的信息的面板
                
                for(var key in data[num]){
                    var div = 'div'+ key
                    
                    if( key !== '待处理事件' && key !=='logo' ){
                        if(key === '办结状态'){
                            div = '<div class="gridBoxClass" >'+key+':'+'<span id="solveId" style="cursor: pointer;">'+data[num][key]+'</span></div>';
                            $('#gridInfoId').append(div);
                        }else{
                            div = '<div class="gridBoxClass" >'+key+':'+'<span>'+data[num][key]+'</span></div>';
                            $('#gridInfoId').append(div);
                        }
                                                        
                    }else if(key === '待处理事件'){
                        if( data[num][key] != ''){
                            var infoDiv ='<div class="gridBoxClass infoDivClass" style ="background: #ea6f6f">'+key+':'+'<span id="backlog">'+data[num][key]+'</span></div>'
                            $('#gridInfoId').append(infoDiv);
                        }else{
                            var infoDiv ='<div class="gridBoxClass infoDivClass" >'+key+':'+'<span id="backlog">无待处理事件</span></div>'
                            $('#gridInfoId').append(infoDiv);
                        }
                        
                    }else{
                        var url = 'url('+data[num][key]+') no-repeat' ;
                        $('#gridTuPianId').css({                                    
                            'background':url,
                            'background-size':'100% 100%'
                        })
                    }
                }
                
            },
            error: function(message){
                console.log(message)
            }
        })
    }
    
}
window.getRoadInformation =function(){
    if(getWhichRoadJson == 'carsMonitor'){
        $.ajax({
            type:"get",
            url : "../data/roadGrid.json",
            dataType:"json",
            success:function(data){
                carArray =data
                for(var i=0;i<data.length;i++){  //data.length
                    carNumArray.push(data[i].carNum)
                }
                illegalParking(data)
            },
            error:function(message){
                console.log(message)

            }
        })
    }else{
        $.ajax({
            type:"get",
            url : "../data/illegalPark.json",
            dataType:"json",
            success:function(data){
                carArray =data
                for(var i=0;i<data.length;i++){  //data.length
                    carNumArray.push(data[i].carNum)
                }
                illegalParking(data)
            },
            error:function(message){
                console.log(message)

            }
        })
    }
}
function illegalParking (data){
    if(data.length>10){ //判断接受到的违停的消息是否超过10条 这个逻辑以后可以不用  先留着
        for(let i=0;i<1;i++){ //i<10  //只显示一个车
            var a=i+1
            var url=data[i].carImg 
            var discribleBox = 'discrible'+i          
            var roadEventUl ='roadEventUl'+i      //style="background:url('+ data[i].carImg+') no repeat;background-size:100% 100%"  这样就不行
            var roadUl='<ul class="roadUl" id="'+ roadEventUl + ' "><li style="background:url('+url+ ') no-repeat ;background-size: 100% 100%">'+a+'</li><div class="discribleBox "id="'+ discribleBox+'"></div></ul>';
            $('#roadGridBoxWrapInnerId').append(roadUl);

            var carNum ='<p class="carInfo">车牌号:<a>'+ data[i].carNum+'<a></p>'
            var ownerName ='<p class="carInfo">车主:<a>'+ data[i].ownerName+'<a></p>'
            var ownerTel ='<p class="carInfo">车主电话:<a>'+ data[i].ownerTel+'<a></p>'
            var stopTime ='<p class="carInfo">停车时间:<a>'+ data[i].stopTime+'<a></p>'
            var history ='<p class="carInfo">违章记录:<a>'+ data[i].history+'<a></p>'
            var command ='<p class="carInfo" >办结状态:<a id="roadEventStatus">'+ data[i].command+'<a></p>'

            var divId="#"+discribleBox 
            $(divId).append(carNum,ownerName,ownerTel,stopTime,history,command)//id作为变量传入$  动态
            
        }
        
    }else{
        for(let i=0;i<data.length;i++){ //data.length
            var a=i+1
            var roadEventUl ='roadEventUl'+i
            var roadUl='<div class="roadUl" id="'+ roadEventUl + ' "></div>';
            var roadEventUlId="#"+roadEventUl

            var raodGridAddress ='<p class="carInfo">网格地址:<a>'+ data[i].raodGridAddress+'</a></p>'
            var eventStatus ='<p class="carInfo">有无事件:<a>'+ data[i].eventStatus+'</a></p>'
            var ownownerNameerTel ='<p class="carInfo">网格管理员:<a>'+ data[i].ownownerNameerTel+'</a></p>'
            var ownerTel ='<p class="carInfo">管理员电话:<a>'+ data[i].ownerTel+'</a></p>'
            $('#roadGridBoxWrapInnerId').append(roadUl);
            var roadEventUlId="#"+roadEventUl
            // $(roadEventUlId).append(raodGridAddress,eventStatus,ownownerNameerTel,ownerTel); //为什么不行  对比上面
            // $('#roadEventUl0').append(raodGridAddress,eventStatus,ownownerNameerTel,ownerTel) //取得id为roadEventUl0的元素在用append怎么不行？？  上面还有个类似的情况
            $('.roadUl').append(raodGridAddress,eventStatus,ownownerNameerTel,ownerTel);
        }
    }

    // setTimeout(function(){  //当车辆信息加载完之后就开始滚动
    //     $('#roadGridBoxWrapInnerId').animate({top:'-700px'},7000)
    // },200)



    

    
    $(document).on('click','#roadCancelBtnId',function(){
        $('#roadGridBoxId').css('display','none')
        carPanelStatus =0
        
    })
    
    $(document).on('click','.roadUl',function(){
        $('#roadGridBoxWrapInnerId').stop();
    })
    

    

    var myCarArr =[0,-100,-200,-300,-400,-500,-600,-700]
    $('#arrowTopId').click(function(){
        var currentCarBoxTop=parseInt($('#roadGridBoxWrapInnerId').css('top')); //把 120px 转成数值型 120
        var carLocation
        if(currentCarBoxTop== 0){
            alert('当前已经是第一条数据了，不能再往上了，谢谢！')
        }else{
            for(var i =0;i<myCarArr.length;i++){
                if(currentCarBoxTop<myCarArr[i]){
                    continue;
                }else{
                    carLocation = -(i-1)*100 +'px';
                    break;
                }
            }
            $('#roadGridBoxWrapInnerId').animate({top:carLocation},300);
        }                       
        

    }) 
    $('#arrowDownId').click(function(){
        var currentCarBoxTop=parseInt($('#roadGridBoxWrapInnerId').css('top')); //把 120px 转成数值型 120
        var carLocation
        if(currentCarBoxTop== -700){
            alert('当前已经是最后一条数据了，不能再往下了，谢谢！')
        }else{
            for(var i =0;i<myCarArr.length;i++){
                if(currentCarBoxTop<myCarArr[i]){
                    continue;
                }else if(currentCarBoxTop == -700){
                    carLocation = -i*100 +'px';
                }else{
                    carLocation = -(i+1)*100 +'px';
                    break;
                }
            }
            $('#roadGridBoxWrapInnerId').animate({top:carLocation},300)
        }
        
        

    })  
    
    $('#roadInputId').on({  //查询违章信息
        keydown:function(){
            if(event.keyCode == "13"){
                $('.roadUl').removeClass('selectedUl')
                //$('#roadGridBoxWrapInnerId').stop()
                let carId = $('#roadInputId').val()                                
                let carIdRegExp = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
                if(carId != "" ){
                    if(carId.match(carIdRegExp)){
                        if(carNumArray.indexOf(carId)>-1){           //判断数组中有没有carId                                 
                            let ii =carNumArray.indexOf(carId);    //ii 是字符串carId再数组carnumarry中的位置
                            var $a=$('.roadUl')[ii]
                            $($a).addClass('selectedUl')
                            if(ii<8){// 防止最后几张图片还在滚上去 造成 上下的点击按钮失效
                                let carLocation = -ii*100+'px';
                                $('#roadGridBoxWrapInnerId').animate({top:carLocation},200)
                            }
                            
                                                                            
                            
                        }else{
                            alert("未查询到该车辆的信息")
                        }
                    }else{
                        alert("请输入合法的车牌号进行查询")
                    }
                }else{
                    alert("请输入车牌号")
                }
            }
        },
        change:function(){
            $('#roadGridBoxWrapInnerId').stop()
        }
    })

    
}



//ul点击事件
$(document).on('click','#remindBoxSonId ul',function(){
    clearInterval(messageInterval);
    var thisUl = $(this)
    var ulIdString =thisUl.attr('id');
    var ulIdNumber = Number(ulIdString.replace(/[^0-9]/ig,"")) //字符串中提取数字 数值
    var myentity ='myentity'+ulIdNumber
    num =ulIdNumber
    var entity = entitiesActually.getById(myentity)
    thisUl.css('background-color','#3c6e31')
    if(ulIdString.match('shopEvent')){
        smartReminder.shopEventClick();
        var shop = function(){
                return new Promise(function(resolve, reject){
                    
                    resolve("ajax 请求完毕")//这一句是必须要的 但是函数resolve内的参数随意写，执行了这一句只是给then传参表示这里的代码已经被执行，然后可以执行then（）内方法
                    
                    getShopInformation();

                    $(document).on('click','#gridCloseBtnId',function(){
                        $('#shopGridBoxId').css('display','none')
                    })

                    // $('#gridCloseBtnId').click(function(){                        
                    //     $('#shopGridBoxId').css('display','none')
                    // })  面板关闭以后再打开后这个监听事件就失效了
                    //viewer.zoomTo(entity)
                    
            })
        }
        
        shop().then(function(resolve){
            var blinkIdn = 'blink'+ulIdNumber
            var blinkEntityIdn ='blinkEntity'+ulIdNumber
            backlogId ='backlog'+ulIdNumber
            if($('.shopEventGrid').length>1){
                thisUl.css({
                    'animation': 'myfirst 2s',
                    '-moz-animation': 'myfirst 2s',	/* Firefox */
                    '-webkit-animation': 'myfirst 2s',	/* Safari 和 Chrome */
                    '-o-animation': 'myfirst 2s'	/* Opera */
                })
                //clearInterval(blinkIdn);  这种方式不能清楚闪烁 因为clearInterval()传入的参数是Number 而我们这里的blinkIdn是字符串
                clearInterval(ulIdNumber ==0 ? shopBlink0 : shopBlink1)                    
                entitiesActually.remove(entitiesActually.getById(blinkEntityIdn))
                entitiesActually.add({
                    id:backlogId,
                    polygon:{
                    hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(myArrPolygon[ulIdNumber]),                            
                    height:27.001,//定义了高度就不会贴着osgb了
                    //颜色回调
                    material :Cesium.Color.GRAY.withAlpha(1),
                    outline : true,
                    outlineColor : Cesium.Color.BLACK
                    }
                })
                //viewer.zoomTo(entity)
                viewer.camera.flyTo({
                    destination :  new Cesium.Cartesian3(-2327603.4127747663,4561875.502058783,3788988.744501913),
                    orientation : {
                        direction : new Cesium.Cartesian3(0.7986994641517644,-0.5817904844569156,0.15361965420828097),
                        up : new Cesium.Cartesian3(0.16199826705118447,0.4537717782134776,0.8762692136377906)
                    },
                    duration:1
                });
                setTimeout(()=>{
                    thisUl.remove()
                    
                },2200)
            }else{
                if($('.roadEventGrid').length != 0){
                    thisUl.css({
                        'animation': 'myfirst 2s',
                        '-moz-animation': 'myfirst 2s',	/* Firefox */
                        '-webkit-animation': 'myfirst 2s',	/* Safari 和 Chrome */
                        '-o-animation': 'myfirst 2s'	/* Opera */
                    })
                    //clearInterval(blinkIdn);  这种方式不能清楚闪烁 因为clearInterval()传入的参数是Number 而我们这里的blinkIdn是字符串
                    clearInterval(ulIdNumber ==0 ? shopBlink0 : shopBlink1)                    
                    entitiesActually.remove(entitiesActually.getById(blinkEntityIdn))
                    entitiesActually.add({
                        id:backlogId,
                        polygon:{
                        hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(myArrPolygon[ulIdNumber]),                            
                        height:27.001,//定义了高度就不会贴着osgb了
                        //颜色回调
                        material :Cesium.Color.GRAY.withAlpha(1),
                        outline : true,
                        outlineColor : Cesium.Color.BLACK
                        }
                    })
                    //viewer.zoomTo(entity)
                    viewer.camera.flyTo({
                        destination :  new Cesium.Cartesian3(-2327603.4127747663,4561875.502058783,3788988.744501913),
                        orientation : {
                            direction : new Cesium.Cartesian3(0.7986994641517644,-0.5817904844569156,0.15361965420828097),
                            up : new Cesium.Cartesian3(0.16199826705118447,0.4537717782134776,0.8762692136377906)
                        },
                        duration:1
                    });
                    setTimeout(()=>{
                        thisUl.remove()                        
                    },2200)
                }else{
                    thisUl.css({
                        'animation': 'myfirst 2s',
                        '-moz-animation': 'myfirst 2s',	/* Firefox */
                        '-webkit-animation': 'myfirst 2s',	/* Safari 和 Chrome */
                        '-o-animation': 'myfirst 2s'	/* Opera */
                    })
                    //clearInterval(blinkIdn);  这种方式不能清楚闪烁 因为clearInterval()传入的参数是Number 而我们这里的blinkIdn是字符串
                    clearInterval(ulIdNumber ==0 ? shopBlink0 : shopBlink1)                    
                    entitiesActually.remove(entitiesActually.getById(blinkEntityIdn))
                    entitiesActually.add({
                        id:backlogId,
                        polygon:{
                        hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(myArrPolygon[ulIdNumber]),                            
                        height:27.001,//定义了高度就不会贴着osgb了
                        //颜色回调
                        material :Cesium.Color.GRAY.withAlpha(1),
                        
                        outline : true,
                        outlineColor : Cesium.Color.BLACK
                        }
                    })
                    //viewer.zoomTo(entity)
                    viewer.camera.flyTo({
                        destination :  new Cesium.Cartesian3(-2327603.4127747663,4561875.502058783,3788988.744501913),
                        orientation : {
                            direction : new Cesium.Cartesian3(0.7986994641517644,-0.5817904844569156,0.15361965420828097),
                            up : new Cesium.Cartesian3(0.16199826705118447,0.4537717782134776,0.8762692136377906)
                        },
                        duration:1
                    });
                    setTimeout(()=>{

                        thisUl.remove();                        
                        $('#messageRemind').removeClass('currentMessages').addClass('defaultMessages')
                    },2200)
                }
            } 
        })
        
    }
    if(ulIdString.match('roadEvent')){
        smartReminder.roadEventClick()

        var road = function(){
            return new Promise(function(resolve,reject){
                resolve(1);
                setTimeout(function(){
                    //illegalParking()
                    //ajax获取数据 判断长度取生成div
                    $.ajax({
                        type:"get",
                        url : "../data/illegalPark.json",
                        dataType:"json",
                        success:function(data){
                            carArray =data
                            for(var i=0;i<data.length;i++){  //data.length
                                carNumArray.push(data[i].carNum)
                            }
                            illegalParking(data)
                        },
                        error:function(message){
                            console.log(message)
        
                        }
                    })

                    function illegalParking (data){
                        if(data.length>10){
                            for(let i=0;i<1;i++){ //i<10  //只显示一个车
                                var a=i+1
                                var url=data[i].carImg 
                                var discribleBox = 'discrible'+i          
                                var roadEventUl ='roadEventUl'+i      //style="background:url('+ data[i].carImg+') no repeat;background-size:100% 100%"  这样就不行
                                var roadUl='<ul class="roadUl" id="'+ roadEventUl + ' "><li style="background:url('+url+ ') no-repeat ;background-size: 100% 100%">'+a+'</li><div class="discribleBox "id="'+ discribleBox+'"></div></ul>';
                                $('#roadGridBoxWrapInnerId').append(roadUl);
            
                                var carNum ='<p class="carInfo">车牌号:<a>'+ data[i].carNum+'<a></p>'
                                var ownerName ='<p class="carInfo">车主:<a>'+ data[i].ownerName+'<a></p>'
                                var ownerTel ='<p class="carInfo">车主电话:<a>'+ data[i].ownerTel+'<a></p>'
                                var stopTime ='<p class="carInfo">停车时间:<a>'+ data[i].stopTime+'<a></p>'
                                var history ='<p class="carInfo">违章记录:<a>'+ data[i].history+'<a></p>'
                                var command ='<p class="carInfo" >办结状态:<a id="roadEventStatus">'+ data[i].command+'<a></p>'
            
                                var divId="#"+discribleBox
                                $(divId).append(carNum,ownerName,ownerTel,stopTime,history,command)
                                
                            }
                            
                        }else{
                            for(let i=0;i<data.length;i++){ //data.length
                                var a=i+1
                                var roadEventUl ='roadEventUl'+i
                                var roadUl='<ul class="roadUl" id="'+ roadEventUl + ' ">'+a+'<li style="background:url('+ data[i].carImg+') no repeat;background-size:100% 100%"></li></ul>';
                                $('#roadGridBoxWrapInnerId').append(roadUl);
                            }
                        }
            
                        // setTimeout(function(){  //当车辆信息加载完之后就开始滚动
                        //     $('#roadGridBoxWrapInnerId').animate({top:'-700px'},7000)
                        // },200)
            
                    
            
                        
            
                        
                        $(document).on('click','#roadCancelBtnId',function(){
                            $('#roadGridBoxId').css('display','none')
                            carPanelStatus =0
                            
                        })
                        
                        $(document).on('click','.roadUl',function(){
                            $('#roadGridBoxWrapInnerId').stop();
                        })
                        
            
                        
            
                        var myCarArr =[0,-100,-200,-300,-400,-500,-600,-700]
                        $('#arrowTopId').click(function(){
                            var currentCarBoxTop=parseInt($('#roadGridBoxWrapInnerId').css('top')); //把 120px 转成数值型 120
                            var carLocation
                            if(currentCarBoxTop== 0){
                                alert('当前已经是第一条数据了，不能再往上了，谢谢！')
                            }else{
                                for(var i =0;i<myCarArr.length;i++){
                                    if(currentCarBoxTop<myCarArr[i]){
                                        continue;
                                    }else{
                                        carLocation = -(i-1)*100 +'px';
                                        break;
                                    }
                                }
                                $('#roadGridBoxWrapInnerId').animate({top:carLocation},300);
                            }                       
                            
            
                        }) 
                        $('#arrowDownId').click(function(){
                            var currentCarBoxTop=parseInt($('#roadGridBoxWrapInnerId').css('top')); //把 120px 转成数值型 120
                            var carLocation
                            if(currentCarBoxTop== -700){
                                alert('当前已经是最后一条数据了，不能再往下了，谢谢！')
                            }else{
                                for(var i =0;i<myCarArr.length;i++){
                                    if(currentCarBoxTop<myCarArr[i]){
                                        continue;
                                    }else if(currentCarBoxTop == -700){
                                        carLocation = -i*100 +'px';
                                    }else{
                                        carLocation = -(i+1)*100 +'px';
                                        break;
                                    }
                                }
                                $('#roadGridBoxWrapInnerId').animate({top:carLocation},300)
                            }
                            
                            
            
                        })  
                        
                        $('#roadInputId').on({  //查询违章信息
                            keydown:function(){
                                if(event.keyCode == "13"){
                                    $('.roadUl').removeClass('selectedUl')
                                    //$('#roadGridBoxWrapInnerId').stop()
                                    let carId = $('#roadInputId').val()                                
                                    let carIdRegExp = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
                                    if(carId != "" ){
                                        if(carId.match(carIdRegExp)){
                                            if(carNumArray.indexOf(carId)>-1){           //判断数组中有没有carId                                 
                                                let ii =carNumArray.indexOf(carId);    //ii 是字符串carId再数组carnumarry中的位置
                                                var $a=$('.roadUl')[ii]
                                                $($a).addClass('selectedUl')
                                                if(ii<8){// 防止最后几张图片还在滚上去 造成 上下的点击按钮失效
                                                    let carLocation = -ii*100+'px';
                                                    $('#roadGridBoxWrapInnerId').animate({top:carLocation},200)
                                                }
                                                
                                                                                                
                                                
                                            }else{
                                                alert("未查询到该车辆的信息")
                                            }
                                        }else{
                                            alert("请输入合法的车牌号进行查询")
                                        }
                                    }else{
                                        alert("请输入车牌号")
                                    }
                                }
                            },
                            change:function(){
                                $('#roadGridBoxWrapInnerId').stop()
                            }
                        })
            
                        
                        // $('#roadSearchId').on({  //查询违章信息
                        //     keydown:function(){
                        //         if(event.keyCode == "13"){
                        //             $('.roadUl').removeClass('selectedUl')
                        //             $('#roadGridBoxWrapInnerId').stop()
                        //             let carId = $('#roadInputId').val()                                
                        //             let carIdRegExp = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
                        //             if(carId != "" ){
                        //                 if(carId.match(carIdRegExp)){
                        //                     if(carNumArray.indexOf(carId)>-1){
                        //                         let ii =carNumArray.indexOf(carId);
                        //                         var $a=$('.roadUl')[ii]
                        //                         $($a).addClass('selectedUl')
                        //                         let carLocation = -ii*100+'px';
                        //                         $('#roadGridBoxWrapInnerId').animate({top:carLocation},200)                                                
                                                
                        //                     }else{
                        //                         alert("未查询到该车辆的信息")
                        //                     }
                        //                 }else{
                        //                     alert("请输入合法的车牌号进行查询")
                        //                 }
                        //             }else{
                        //                 alert("请输入车牌号")
                        //             }
                        //         }
                        //     },
                        //     change:function(){
                        //         $('#roadGridBoxWrapInnerId').stop()
                        //     }
                        // })
                        
            
                        
                    }
                },300)

            })
        }

        road().then(function(resolve){
            var blinkEntityIdn ='blinkEntity'+ulIdNumber
            roadBacklogId ='roadBacklog'+ulIdNumber
            if($('.roadEventGrid').length>1){
                thisUl.css({
                    'animation': 'myfirst 2s',
                    '-moz-animation': 'myfirst 2s',	/* Firefox */
                    '-webkit-animation': 'myfirst 2s',	/* Safari 和 Chrome */
                    '-o-animation': 'myfirst 2s'	/* Opera */
                })
                setTimeout(()=>{thisUl.remove()},2200)
                viewer.camera.flyTo({
                    destination : new Cesium.Cartesian3(-2327623.93672083,4561838.811893763,3789017.1113915793),
                    orientation : {
                        direction:new Cesium.Cartesian3(0.7025269667211049,-0.6205585436016268,0.34837186308981877),
                        up:new Cesium.Cartesian3(-0.021191195348466047,0.47106352822433467,0.8818447060659516)
                    }
                });
                clearInterval(ulIdNumber ==0 ? roadBlink1 : roadBlink1)                    
                // entitiesActually.remove(entitiesActually.getById('roadBlinkEntity0'))
                // entitiesActually.add({
                //     id:roadBacklogId,
                //     polygon:{
                //     hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(roadGridArray),                            
                //     height:27.02,//定义了高度就不会贴着osgb了
                //     //颜色回调
                //     material :Cesium.Color.GRAY.withAlpha(1),
                //     outline : true,
                //     outlineColor : Cesium.Color.BLACK
                //     }
                // })
            }else{
                if($('.shopEventGrid').length != 0){
                    thisUl.css({
                        'animation': 'myfirst 2s',
                        '-moz-animation': 'myfirst 2s',	/* Firefox */
                        '-webkit-animation': 'myfirst 2s',	/* Safari 和 Chrome */
                        '-o-animation': 'myfirst 2s'	/* Opera */
                    })
                    setTimeout(()=>{
                        thisUl.remove()
                    },2200)
                    viewer.camera.flyTo({
                        destination : new Cesium.Cartesian3(-2327623.93672083,4561838.811893763,3789017.1113915793),
                        orientation : {
                            direction:new Cesium.Cartesian3(0.7025269667211049,-0.6205585436016268,0.34837186308981877),
                            up:new Cesium.Cartesian3(-0.021191195348466047,0.47106352822433467,0.8818447060659516)
                        }
                    });
                    clearInterval(ulIdNumber ==0 ? roadBlink1 : roadBlink1)                    
                    entitiesActually.remove(entitiesActually.getById('roadBlinkEntity0'))
                    entitiesActually.add({
                        id:roadBacklogId,
                        polygon:{
                        hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(roadGridArray),                            
                        height:27.001,//定义了高度就不会贴着osgb了
                        //颜色回调
                        material :Cesium.Color.GRAY.withAlpha(1),
                        // material :new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(function() { 
                        //     return Cesium.Color.fromRandom({
                        //         red : 1,
                        //         alpha : 1.0
                        //     });
                        // }, true)),
                        outline : true,
                        outlineColor : Cesium.Color.BLACK
                        }
                    })
                }else{
                    thisUl.css({
                        'animation': 'myfirst 2s',
                        '-moz-animation': 'myfirst 2s',	/* Firefox */
                        '-webkit-animation': 'myfirst 2s',	/* Safari 和 Chrome */
                        '-o-animation': 'myfirst 2s'	/* Opera */
                    })
                    setTimeout(()=>{
                        thisUl.remove();
                        $('#messageRemind').removeClass('currentMessages').addClass('defaultMessages')
                    },2200)
                    viewer.camera.flyTo({
                        destination : new Cesium.Cartesian3(-2327623.93672083,4561838.811893763,3789017.1113915793),
                        orientation : {
                            direction:new Cesium.Cartesian3(0.7025269667211049,-0.6205585436016268,0.34837186308981877),
                            up:new Cesium.Cartesian3(-0.021191195348466047,0.47106352822433467,0.8818447060659516)
                        }
                    });
                    clearInterval(ulIdNumber ==0 ? roadBlink1 : roadBlink1)                    
                    // entitiesActually.remove(entitiesActually.getById('roadBlinkEntity0'))
                    // entitiesActually.add({
                    //     id:roadBacklogId,
                    //     polygon:{
                    //     hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(roadGridArray),                            
                    //     height:27.02,//定义了高度就不会贴着osgb了
                    //     //颜色回调
                    //     material :Cesium.Color.GRAY.withAlpha(1),
                    //     outline : true,
                    //     outlineColor : Cesium.Color.BLACK
                    //     }
                    // })
                }
                
            }
        })

        //viewer.zoomTo()
        

        
    }
    
})

