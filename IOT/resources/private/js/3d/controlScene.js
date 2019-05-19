function ControlScene(viewer){

    // $('.roadUl').on({
    //     click:function(){
    //         $('#roadGridBoxInnerId').stop();//          border-color: #aef; box-shadow: 0 0 8px #fff;

    //     },
    //     mouseover:function(){
    //         $('#roadGridBoxInnerId').stop();
    //     },
    //     mouseout:function(){
    //         $('#roadGridBoxWrapInnerId').animate({top:'-700px'},7000)
    //     }
    // })

    // $('#roadCancelBtnId').on({
    //     click:function(){
    //         $('#roadGridBoxId').css('display','none')
    //     }
    // })

    // $('#roadGridBoxWrapId').on({
    //     mouseover:function(){
    //         $('.rollBtn').css('display','block')
    //     },
    //     mouseout:function(){
    //         $('.rollBtn').css('display','none')
    //     },
    //     mouseover:function(){
    //     }
    // }) 
    $(document).on('mouseover','#roadGridBoxInnerId',function(){
        $('#roadGridBoxInnerId').stop();
    })
    var selected = {
        object: undefined,
        originalColor: new Cesium.Color()
    };
    
    // An entity object which will hold info about the currently selected feature for infobox display
    var selectedEntity = new Cesium.Entity();
    var highlighted = {
        object : undefined,
        originalColor : new Cesium.Color()
    };

    // Get default left click handler for when a feature is not picked on left click
    var clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    //varhandler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
    var clickStatus1 =0;
    var clickStatus2 =0;
    var blink0;
    var blink15;
    //var blinkWeatherMore =1 //判断是否有闪烁
    var myArrPolygon=[]//存储网格的坐标
    var blinkArray = ['blinkEntity0','blinkEntity15']//用来存储服务器端传过来的数据，生成blinkentity的数据
    var carPanelStatus = 0//表示当前违章停车的面板不存在
    var carArray //存储违章车辆的数组
    var carNumArray =[] //存储违规车辆的车牌数组
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
        // If a feature was previously selected, undo the highlight
        if (Cesium.defined(selected.object)) {
            selected.object.color = selected.originalColor;
            selected.object = undefined;
        }
        // Pick a new feature
        var pickedObject = viewer.scene.pick(movement.position);

        if (!Cesium.defined(pickedObject)) {
            clickHandler(movement);
            return;
        }

        

        var treeNode;
        var entitiesActually = viewer.entities;//区域管理专用变量

        //点击摄像头 点击3dtiles
        if(pickedObject instanceof Cesium.Cesium3DTileFeature)  //pick到3dtiles
        {

            // Set feature infobox description
            var featureName = pickedObject.getProperty('name');

            //街道电子网格的生成
            //点击济南道路网格摄像头
            if(featureName == "_01_1082NS0020013SP0052X110901_OID_3418_Object03_FACES_Model01" && clickStatus1==0)
            {

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

                viewer.camera.flyTo({
                    destination : Cesium.Cartesian3.fromDegrees(117.0321168838,36.6800289578,75),
                    orientation : {
                        heading : Cesium.Math.toRadians(0),
                        pitch : Cesium.Math.toRadians(-40.0),
                        roll : 0.0
                    }
                });
                clickStatus1=1
                //viewer.clock.shouldAnimate = false;
                var myEntityCar = Cesium.CzmlDataSource.load('../data/Vehicle.czml')
                viewer.dataSources.add(myEntityCar);
                viewer.dataSources.add(Cesium.CzmlDataSource.load('../data/Vehicle1.czml'));
                viewer.dataSources.add(Cesium.CzmlDataSource.load('../data/label.czml'));
                setTimeout(function(){
                    viewer.clock.shouldAnimate = false;
                    //var startTime = Cesium.JulianDate.now()获取当前时间
                    setTimeout(function(){
                        entitiesActually.getById('carsMonitor').polygon.material=Cesium.Color.RED.withAlpha(0.7)
                        
                    },200)
                    
                }, 12000);
            }else if(featureName == 'camera' && clickStatus2==0){

                var x1=117.03169;
                var x2=117.03166;
                var y1=36.6799238234;
                var y2=36.6800807418;
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
                    // 店铺 商铺 网格
                    entitiesActually.add({
                        id:myentity+i,
                        polygon : {
                            hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(myArrPolygon[i]),  //不能放到另一个循环里单独生成polygon  这个hierarchy的位置必须在myArrPolygon完全输出后才行 ，不然cesium会报没有coordinate

                            height:27,        
                            material : Cesium.Color.ORANGE.withAlpha(0.5),
                            outline : true,
                            outlineColor : Cesium.Color.BLACK
                        }
                    });

                }
                
                

               var myArra =
                    [
                        [117.03169, 36.6799238234, 27,117.0317620369,36.6800949970,32],
                        [117.03179, 36.6799238234, 27,117.0317620369,36.6800949970,32],
                        [117.03166, 36.6800807418, 27,117.0317620369,36.6800949970,32],
                        [117.03176, 36.6800807418, 27,117.0317620369,36.6800949970,32]
                    ];

                for(var j= 0;j<myArra.length;j++)
                {
                    entitiesActually.add({
                        
                        polyline : {
                            positions : Cesium.Cartesian3.fromDegreesArrayHeights(myArra[j]),
                            width : 1,
                            material :Cesium.Color.WHITE
                        }
                    });
                };
                clickStatus2=1;
                viewer.camera.flyTo({
                    destination : Cesium.Cartesian3.fromDegrees(117.0317976005,36.6797036509,80),
                    orientation : {
                        heading : Cesium.Math.toRadians(0),
                        pitch : Cesium.Math.toRadians(-45.0),
                        roll : 0.0
                    }
                });



                //网格事件动态提醒
                setTimeout(function() {
                    entitiesActually.add({
                        id:'blinkEntity0',
                        polygon:{
                        hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(myArrPolygon[0]),                            
                        height:27.001,//定义了高度就不会贴着osgb了
                        //颜色回调
                        material :Cesium.Color.RED.withAlpha(0.5)
                        }
                    })
                    // entitiesActually.add({
                    //     id:'blinkEntity15',
                    //     polygon:{
                    //     hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(myArrPolygon[15]),                            
                    //     height:27.001,//定义了高度就不会贴着osgb了
                    //     //颜色回调
                    //     material :Cesium.Color.RED.withAlpha(0.5)
                    //     }
                    // })
                    blink0 =setInterval(function(){
                            entitiesActually.getById('blinkEntity0').polygon.material=Cesium.Color.RED.withAlpha(0.001);                            
                            setTimeout(function(){
                                entitiesActually.getById('blinkEntity0').polygon.material=Cesium.Color.RED.withAlpha(0.5);                                
                            },200)                       
                    },300)
                    // blink15 =setInterval(function(){                        
                    //     entitiesActually.getById('blinkEntity15').polygon.material=Cesium.Color.RED.withAlpha(0.001);
                    //     setTimeout(function(){                            
                    //         entitiesActually.getById('blinkEntity15').polygon.material=Cesium.Color.RED.withAlpha(0.5);
                    //     },200)                       
                    // },320)
                }, 3000);
                //另一种中闪烁  这种闪烁过于晃眼
                // entitiesActually.add({
                //     name : 'red polygon',
                //     id: "blinkEntity",
                //     polygon : {
                //         hierarchy : Cesium.Cartesian3.fromDegreesArrayHeights(myArrPolygon[0]),                            
                //         height:27,//定义了高度就不会贴着osgb了
                //         //颜色回调
                //         material : new Cesium.ColorMaterialProperty(new Cesium.CallbackProperty(function() {
                //         return Cesium.Color.fromRandom({
                //         red:1.0,
                //         alpha : 0.3
                //         });
                        
                //         }, false))
                //     }
                // });
                
            }else {
                entitiesActually.removeAll();
                clickStatus1=0;
                clickStatus2=0;

            }
            treeNode=modelTree.getNodeByParam("modelId", featureName, null);
             // If a feature was previously selected, undo the highlight
            // Pick a new feature
            // Select the feature if it's not already selected
            //控制中关村摄像头面板的显示和隐藏
            if (selected.object === pickedObject) {
                if(treeNode.videoElement){
                    var videoElement=treeNode.videoElement;
                    if(videoElement.style.display==''){
                        videoElement.pause();
                        videoElement.style.display = 'none';
                    }else{
                        videoElement.style.display = '';
                        videoElement.play();
                    }
                }
                return;
            }
            selected.object = pickedObject;
            // Save the selected feature's original color
            if (pickedObject === highlighted.object) {
                Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
                highlighted.object = undefined;
            } else {
                Cesium.Color.clone(pickedObject.color, selected.originalColor);
            }
            // Highlight newly selected feature
            pickedObject.color = Cesium.Color.LIME; 
            //选择云南校区摄像头 校园
            if(featureName==  'jgjs6028b')
            {
                if($('#faceVisualId').css('display') != 'block'){
                    //$(function(){});

                    //后台请求数据
                    $.ajax({
                        type: "get",
                        url: "../data/studentInformation.json",
                        dataType: "json",
                        success: function(data){
                            
                            
                            facialRecognition(data)
                        },
                        error: function(message){
                            console.log(message)
                        }
                    });
                    
                    //facialRecognition()
                }
                
            }

            
        }else if(pickedObject.id instanceof Cesium.Entity){  //点击到entity
            
            if(pickedObject.id._id.match(RegExp('myentity'))){ //点击到商铺管理网格  shopGrid
                var linShiId=pickedObject.id._id
                var gridBoxId =Number(linShiId.replace(/[^0-9]/ig,""))//获取网格id 进行匹配后台数据
                var currentPickedObject =pickedObject.id.polygon.hierarchy._value //
                var blinkEntityHierarchy;
                var blinkEntityPosition2GridId; 
                var blinkEntityId ='blinkEntity' +gridBoxId
                var blinkId ='blink' +gridBoxId
                //var myReg = RegExp(blinkEntityId);
                var blinkArrayStr =blinkArray.toString();
                // if(blinkArray.length !=0 && blinkArrayStr.match(RegExp(blinkEntityId)) !== null){
                //     //判断有没有闪烁  判断 闪烁数组 是不是空
                //     //有闪烁时执行本段 
                //     if(blinkArrayStr.match(RegExp(blinkEntityId)) !== null){ //判断点击到的entity是不是在blinkarry数组中  非null就表示点到了闪烁entity
                //         //点击到的是某一个闪烁entity
                //         entitiesActually.remove(entitiesActually.getById("hightLightEntity")); 
                //         clearInterval(blinkId);
                //         //表示当前entity被选中
                //         entitiesActually.add({
                //             id:"hightLightEntity",
                //             polygon:{
                //                 hierarchy:pickedObject.id.polygon.hierarchy,
                //                 height:27,
                //                 material:Cesium.Color.GREEN.withAlpha(0.7)
                //             }
                //         })
                //         createGridDiv(gridBoxId)

                //         setTimeout(function(){
                //             entitiesActually.remove(entitiesActually.getById(blinkEntityId)); //删除闪烁entity（稍后验证是否要删除）  而且必须放到这个settimeout内 不然clearInterval(blink)这一步就会报错
                            
                //         },350)
                        
                //     }else{
                //         //点击到的不是 闪烁entity
                //         entitiesActually.remove(entitiesActually.getById("hightLightEntity")); //上出已经高亮的的entity       remove和show那个更有利于性能
                //         entitiesActually.add({
                //             id:"hightLightEntity",
                //             polygon:{
                //                 hierarchy:pickedObject.id.polygon.hierarchy,
                //                 height:27,
                //                 material:Cesium.Color.GREEN.withAlpha(0.7)
                //             }
                //         })

                //         createGridDiv(gridBoxId)                
                //         $('#gridCloseBtnId').click(function(){                        
                //                 $('#gridBoxId').css('display','none')
                //             }
                //         )
                //     }

                // }else{
                //     entitiesActually.remove(entitiesActually.getById("hightLightEntity")); //上出已经高亮的的entity       remove和show那个更有利于性能
                //     entitiesActually.add({
                //         id:"hightLightEntity",
                //         polygon:{
                //             hierarchy:pickedObject.id.polygon.hierarchy,
                //             height:27,
                //             material:Cesium.Color.GREEN.withAlpha(0.7)
                //         }
                //     })

                //     createGridDiv(gridBoxId)                
                //     $('#gridCloseBtnId').click(function(){                        
                //             $('#gridBoxId').css('display','none')
                //         }
                //     )
                // }
                
                //商铺网格存在闪烁
                if(entitiesActually.getById("blinkEntity0")){

                    
                    var blinkEntity = 'blinkEntity' +gridBoxId
                    
                    blinkEntityHierarchy =entitiesActually.getById("blinkEntity0").polygon.hierarchy._value

                    //判断点击的是不是闪烁的网格
                    if(currentPickedObject.toString() == blinkEntityHierarchy.toString()){  //两个数组不能直接比较  toString后可以比较值
                        entitiesActually.remove(entitiesActually.getById("hightLightEntity")); 
                        clearInterval(blink0);//停止闪烁
                        //entitiesActually.getById("blinkEntity").polygon.fill=false;
                        
                        
                        //表示当前entity被选中
                        entitiesActually.add({
                            id:"hightLightEntity",
                            polygon:{
                                hierarchy:pickedObject.id.polygon.hierarchy,
                                height:27,
                                material:Cesium.Color.GREEN.withAlpha(0.7)
                            }
                        })
                        //查找当前闪烁的entity 对应是第几个管理网格
                        for(var i=0 ; i<18 ;i++){
                            var myCartesian3 = Cesium.Cartesian3.fromDegreesArrayHeights(myArrPolygon[i])
                            if(blinkEntityHierarchy.toString() != myCartesian3.toString() ){
                                continue;
                            }else{
                                blinkEntityPosition2GridId = i;
                                break;
                            }
                        }
                        createGridDiv(blinkEntityPosition2GridId)
                        setTimeout(function(){
                            entitiesActually.remove(entitiesActually.getById("blinkEntity0")); //删除闪烁entity  而且必须放到这个settimeout内 不然clearInterval(blink)这一步就会报错
                            
                        },350)
                        
                        
                    }else{
                        //clearInterval(blink); 
                        //entitiesActually.remove(entitiesActually.getById("blinkEntity0"));
                        entitiesActually.remove(entitiesActually.getById("hightLightEntity")); //上出已经高亮的的entity       remove和show那个更有利于性能
                        entitiesActually.add({
                            id:"hightLightEntity",
                            polygon:{
                                hierarchy:pickedObject.id.polygon.hierarchy,
                                height:27,
                                material:Cesium.Color.GREEN.withAlpha(0.7)
                            }
                        })
                        //店铺面板
                        createGridDiv(gridBoxId)
                        $('#gridCloseBtnId').click(function(){                        
                            $('#gridBoxId').css('display','none')
                        }
                    )
                        
                    }
                }else{ //
                    entitiesActually.remove(entitiesActually.getById("hightLightEntity")); //上出已经高亮的的entity       remove和show那个更有利于性能
                    entitiesActually.add({
                        id:"hightLightEntity",
                        polygon:{
                            hierarchy:pickedObject.id.polygon.hierarchy,
                            height:27,
                            material:Cesium.Color.GREEN.withAlpha(0.7)
                        }
                    })
                    //店铺面板
                    createGridDiv(gridBoxId)                
                    $('#gridCloseBtnId').click(function(){                        
                            $('#gridBoxId').css('display','none')
                        }
                    )
                }
                //弹出店铺面板
                function createGridDiv(num){
                    
                    if($('#gridBoxId')){
                        //保证该面板打开时 不会重复生成
                        $('#gridBoxId').remove()
                        $('#gridCloseBtnId').remove()
                        $('#gridImgId').remove()
                        $('#gridInfoId').remove()
                    }
                    
                    var gridBox ='<div id ="gridBoxId"></div>'
                    var gridCloseBtn ='<div id ="gridCloseBtnId" style="height:20px;width:20px;border:1px solid black;position:absolute;right:0px;top:0px;right:6px;top:5px;">X</div>'
                    var gridTuPian = '<div id ="gridTuPianId" ></div>'
                    var gridImg ='<div id ="gridImgId" style="text-align: center">电子网格信息</div>'
                    var gridInfo ='<div id ="gridInfoId"></div>' 
                                
                    $(document.body).append(gridBox);
                    $('#gridBoxId').append(gridCloseBtn,gridImg,gridInfo);
                    $('#gridImgId').append(gridTuPian)

                    
                    
                    
                    //获取商家数据
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
                                    div = '<div class="gridBoxClass" >'+key+':'+'<span>'+data[num][key]+'</span></div>';
                                    $('#gridInfoId').append(div);                                
                                }else if(key === '待处理事件'){
                                    if( data[num][key] != ''){
                                        var infoDiv ='<div class="gridBoxClass infoDivClass" style ="background: #ea6f6f">'+key+':'+'<span>'+data[num][key]+'</span></div>'
                                        $('#gridInfoId').append(infoDiv);
                                    }else{
                                        var infoDiv ='<div class="gridBoxClass infoDivClass" >'+key+':'+'<span>无待处理事件</span></div>'
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

                    $('#gridCloseBtnId').click(function(){                        
                        $('#gridBoxId').css('display','none')
                    })
                } 
            }
            if(pickedObject.id._id == 'carsMonitor' && carPanelStatus == 0){//点击到道路监控网格 roadGrid
                carPanelStatus =1
                entitiesActually.getById('carsMonitor').polygon.material=Cesium.Color.ORANGE.withAlpha(0.3)
                //网格管理  电子围栏
                //pickedObject.id.rectangle.material =Cesium.Color.RED.withAlpha(0.5);                
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
                
                
                $(document.body).append(roadGridBox);
                $('#roadGridBoxId').append(roadGridBoxInner);
                $('#roadGridBoxInnerId').append(roadGridBoxTile,roadGridBoxWrap);
                $('#roadGridBoxTileId').append(roadSearch,roadCancelBtn,roadInput);
                $('#roadGridBoxWrapId').append(roadGridRollbox);
                $('#WZTCId').append(roadGridBoxWrapInner,arrowTop,arrowDown) 
                $('#WZTCId').click(function(){
                    $('#roadGridBoxWrapInnerId').stop();
                }) 


                //违规停车
                setTimeout(function(){
                    //illegalParking()
                    //ajax获取数据 判断长度取生成div
                    $.ajax({
                        type:"get",
                        url : "../data/illegalPark.json",
                        dataType:"json",
                        success:function(data){
                            carArray =data
                            for(var i=0;i<data.length;i++){
                                carNumArray.push(data[i].carNum)
                            }
                            illegalParking(data)
                        },
                        error:function(message){
                            console.log(message)

                        }
                    })
                },500)

                function illegalParking (data){
                    if(data.length>10){
                        for(let i=0;i<10;i++){
                            var a=i+1
                            var url=data[i].carImg 
                            var discribleBox = 'discrible'+i          //style="background:url('+ data[i].carImg+') no repeat;background-size:100% 100%"  这样就不行
                            var roadUl='<ul class="roadUl"><li style="background:url('+url+ ') no-repeat ;background-size: 100% 100%">'+a+'</li><div class="discribleBox "id="'+ discribleBox+'"></div></ul>';
                            $('#roadGridBoxWrapInnerId').append(roadUl);

                            var carNum ='<p class="carInfo">车牌号:<a>'+ data[i].carNum+'<a></p>'
                            var ownerName ='<p class="carInfo">车主:<a>'+ data[i].ownerName+'<a></p>'
                            var ownerTel ='<p class="carInfo">车主电话:<a>'+ data[i].ownerTel+'<a></p>'
                            var stopTime ='<p class="carInfo">停车时间:<a>'+ data[i].stopTime+'<a></p>'
                            var history ='<p class="carInfo">违章记录:<a>'+ data[i].history+'<a></p>'
                            var command ='<p class="carInfo">措施:<a>'+ data[i].command+'<a></p>'

                            var divId="#"+discribleBox
                            $(divId).append(carNum,ownerName,ownerTel,stopTime,history,command) 



                            // for( let key in data[i]){
                                
                            //     if(key == 'carImg'){
                            //         continue;
                            //     }else{
                            //         var discribleInfo= '<p class="carInfo">'+ key+'：<a>'+ data[i][key]+'<a></p>';
                            //         var divId="#"+discribleBox
                            //         $(divId).append(discribleInfo)
                            //     }
                            //     //$('#personName').html(personInfoArr[personArrMarked].name)
                            // } 
                        }
                        
                    }else{
                        for(let i=0;i<data.length;i++){
                            var a=i+1
                            var roadUl='<ul class="roadUl">'+a+'<li style="background:url('+ data[i].carImg+') no repeat;background-size:100% 100%"></li></ul>';
                            $('#roadGridBoxWrapInnerId').append(roadUl);
                        }
                    }

                    setTimeout(function(){
                        $('#roadGridBoxWrapInnerId').animate({top:'-700px'},7000)
                    },200)

                

                    

                    
                    $(document).on('click','#roadCancelBtnId',function(){
                        $('#roadGridBoxId').css('display','none')
                        carPanelStatus =0
                        
                    })
                    //监听事件
                    
                    
                    // $('#roadGridBoxWrapInnerId').on({
                    //     mouseover:function(){
                    //         console.log('mouseover')
                            
                    //         $('#roadGridBoxWrapInnerId').stop();
                    //         $('.rollBtn').css('display','block')
                    //     },  
                    //     mouseout:function(){
                    //         console.log('mouseout')
                    //         var boxTop =$('#roadGridBoxWrapInnerId').css('top')
                    //         var restTime =(700 -boxTop)/700*7  //剩下的高度要多长时间去滚动到-700px
                    //          $('#roadGridBoxWrapInnerId').animate({top:'-700px'},restTime)
                    //          $('.rollBtn').css('display','none')
                    //     },
                    //     click:function(){
                    //         console.log('click')
                    //     }
                    // })

                    

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
                            $('#roadGridBoxWrapInnerId').animate({top:carLocation},300)
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

                    
                    $('#roadSearchId').on({  //查询违章信息
                        keydown:function(){
                            if(event.keyCode == "13"){
                                $('.roadUl').removeClass('selectedUl')
                                $('#roadGridBoxWrapInnerId').stop()
                                let carId = $('#roadInputId').val()                                
                                let carIdRegExp = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/
                                if(carId != "" ){
                                    if(carId.match(carIdRegExp)){
                                        if(carNumArray.indexOf(carId)>-1){
                                            let ii =carNumArray.indexOf(carId);
                                            var $a=$('.roadUl')[ii]
                                            $($a).addClass('selectedUl')
                                            let carLocation = -ii*100+'px';
                                            $('#roadGridBoxWrapInnerId').animate({top:carLocation},200)                                                
                                            
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
            }
            var name=pickedObject.id.name;
            treeNode=modelTree.getNodeByParam("modelId", name, null);
                        
        }


        var position=new Cesium.Cartesian3();        
        viewer.scene.pickPosition(movement.position,position);
        console.info(position);
        var longitudeString =0;
        var latitudeString =0;
        var scene = viewer.scene;

        var ellipsoid = scene.globe.ellipsoid;
        //let aaaaaa = new Cesium.Ellipsoid();
        //cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);


        var cartographic = ellipsoid.cartesianToCartographic(position);
        //将弧度转为度的十进制度表示
        longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        //获取相机高度
        height = Math.ceil(viewer.camera.positionCartographic.height);

        console.log(longitudeString.toFixed(10) +',' +latitudeString.toFixed(10) + ","+ height)//左击事件
        //console.log(cartesian.x+','+cartesian.y+','+cartesian.z);

        if(!treeNode)return;


        //Cannot read property 'style' of undefined 问题
        //中关村点击摄像头 弹出 摄像头信息和播放动画
        if(!treeNode.videoElement &&  !(pickedObject.id instanceof Cesium.Entity)){ //   !(pickedObject.id instanceof Cesium.Entity)  Cesium.Cesium3DTileFeature
            showInfobox();
            var vedioEle=document.createElement("video");
            vedioEle.id=treeNode.name;
            /*vedioEle.style.position='absolute';
            vedioEle.style.left=movement.position.x+15+'px';
            vedioEle.style.top=movement.position.y+15+'px';
            vedioEle.style.width='320px';
            vedioEle.style.height='180px';*/
            vedioEle.style.zIndex=9999;
            vedioEle.src=treeNode.url;
            vedioEle.muted=true;
            vedioEle.autoplay=true;
            vedioEle.loop=true;
            vedioEle.crossorigin=true;
            vedioEle.controls=true;
            vedioEle.draggable=true;
            vedioEle.setAttribute("class","innerbox");
            vedioEle.setAttribute("class","innerbox-vedio");
            //document.body.appendChild(vedioEle);
            document.getElementById("outBox").appendChild(vedioEle);
            //treeNode.videoElement=vedioEle;
            treeNode.videoElement=vedioEle;
            //treeNode.videoElement=document.getElementById("outBox");
            vedioEle.play();
        }else{
            var videoElement=treeNode.videoElement;

            if(videoElement.style.display==''){
                videoElement.pause();
                videoElement.style.display = 'none';
                document.getElementById("outBox").style.display = 'none';
            }else{
                document.getElementById("outBox").style.display = 'block';
                videoElement.style.display = '';
                videoElement.play();
            }
        }
        // //镜头移动 关闭videoElement  camera  视角
        // var camera = Cesium.Camera(scene)
        // if(videoElement && camera.changed){
        //     alert1(1111)
        // }




        
        
        
        
        


    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);


    // handler.setInputAction(function (movement) {
    //     var cartesian =viewer.scene.pickPosition(movement.endPosition);  
    //     if(scope.state===BEYONANALYSER_STATE.OPERATING){
    //         info ='双击取点';
    //         showTip(scope._tip,true,cartesian,info);         
    //     }
    // },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    //监听事件

    

}