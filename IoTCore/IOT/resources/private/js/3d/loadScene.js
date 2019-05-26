function initScene(viewer){
    
    function OnClick(e, treeId, treeNode) {
        //camera.changed.raiseEvent(camera.changed); 视角改变  camera  镜头改变事件注册
        if(treeNode.model){
            viewer.camera.flyToBoundingSphere(treeNode.model.boundingSphere);
            
           // viewer.trackedEntity = modelCamera;
        }else if(treeNode.position){
            var position=Cesium.Cartesian3.fromArray(treeNode.position)
            //[-2327558.0244596656,4561785.4896314815,3789034.1595904473

            if(treeNode.id == '40101'){
                viewer.camera.flyTo({
                    destination : new Cesium.Cartesian3(-2327623.93672083,4561838.811893763,3789017.1113915793),
                    orientation : {
                        direction:new Cesium.Cartesian3(0.7025269667211049,-0.6205585436016268,0.34837186308981877),
                        up:new Cesium.Cartesian3(-0.021191195348466047,0.47106352822433467,0.8818447060659516)
                    }
                });

            }else if(treeNode.id == '40102'){
                viewer.camera.flyTo({
                    destination :  new Cesium.Cartesian3(-2327640.593544765,4561871.752660127,3788983.636213216),
                    orientation : {
                        direction : new Cesium.Cartesian3(0.8071715099824033,-0.5425416278200715,0.23264293575149467),
                        up : new Cesium.Cartesian3(0.08895561058446222,0.5013877292612342,0.8606376962995573)
                    }
                });
            }
            if(treeNode.radius){
                var boundingSphere=new Cesium.BoundingSphere(position,treeNode.radius);
                viewer.camera.flyToBoundingSphere(boundingSphere);
                
                
            }else if(treeNode.id != '40101' && treeNode.id != '40102'){
                //viewer.camera.move
                viewer.camera.flyTo({
                    destination : position,
                    orientation : {
                        heading : Cesium.Math.toRadians(0),
                        pitch : Cesium.Math.toRadians(-45.0),
                        roll : 0.0
                    }
                });

                
            }       

        }   
        //添加标记  
        if(treeNode.icon&&!treeNode.marker){
            //为该节点添加一个marker
            var marker=viewer.entities.add({
                //name:treeNode.modelId,
                position : position,
                billboard : {
                    image : treeNode.icon, // default: undefined
                    show : true, // default
                    pixelOffset : new Cesium.Cartesian2(20, -20), // default: (0, 0)
                    eyeOffset : new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
                    horizontalOrigin : Cesium.HorizontalOrigin.CENTER, // default
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM, // default: CENTER
                    scale : 1.0, // default: 1.0
                    //color : Cesium.Color.LIME, // default: WHITE
                    //rotation : Cesium.Math.PI_OVER_FOUR, // default: 0.0
                    alignedAxis : Cesium.Cartesian3.ZERO, // default
                    width : 48, // default: undefined
                    height :48, // default: undefined
                    scaleByDistance:new Cesium.NearFarScalar(10, 1, 1000, 0.01)
                }
            });
            treeNode.marker=marker;
        }
        
        if(treeNode.batchId){
            treeNode.batchTable.setColor(treeNode.batchId,Cesium.Color.LIME); 
        }
        if(treeNode.dataSoure&&!treeNode.realtimeLabel){   
            var settings=Cesium.defaultValue(treeNode.settings, 
                {
                    "offset":[0,-0.1,0],
                    "color":"yellow",
                    "heading":-0.314,
                    "pitch":0,
                    "roll":0,
                    "size":1
                  }
            );
            
            var realtimeLabel=new RealtimeLabel({
                viewer:viewer,
                position:position,
                offset:Cesium.Cartesian3.fromArray(settings.offset),
                color:settings.color,
                heading:settings.heading,
                size:settings.size,
                initNumber:treeNode.dataSoure
            });
            setInterval(function(){ 
                var number=parseInt(Math.random()*(9999-1000+1)+1000,10);
                realtimeLabel.setNumber(number);
             }, 3000);
            viewer.scene.primitives.add(realtimeLabel);
            treeNode.realtimeLabel=realtimeLabel;
        }

//添加模型
        if(treeNode.data&&!treeNode.model  && treeNode.id != '40102' && treeNode.id != '40101'){
            var modelSetting=treeNode.data;
              var modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);

              var modelUrl=modelSetting.url;
              //加载3dtiles
              if(modelUrl.indexOf("json")){
                var tilesetInfo = new Cesium.Cesium3DTileset({
                    url: modelUrl,
                    modelMatrix:modelMatrix,
                    
                });
                tilesetInfo.nodeId=treeNode.id;
                if(modelSetting.processProperty)
                    tilesetInfo.needProcessProperty=true;
                viewer.scene.primitives.add(tilesetInfo);
                tilesetInfo.readyPromise.then(function(tileset) {
                    //不是单位矩阵，说明前面已经设置过模型矩阵
                    if(!tileset.modelMatrix.equals(Cesium.Matrix4.IDENTITY)){
                        tileset._root.transform = Cesium.Matrix4.IDENTITY;
                    }
                    var node=modelTree.getNodeByParam("id", tileset.nodeId, null);                
                    node.model=tileset;
                    //加载处理该节点下的关联模型
                    if(tileset.needProcessProperty){
                        tileset.processPropertyEvent=new Cesium.Event;
                        tileset.processPropertyEvent.addEventListener(process3dtilesProperty,modelTree);
                    }
                    

                });
              }else if(modelUrl.indexOf("json")){
                var model = viewer.scene.primitives.add(Cesium.Model.fromGltf({
                    url : modelSetting.url,
                    show : true,                     // default
                    modelMatrix : modelMatrix,
                    scale : Cesium.defaultValue(modelSetting.scale, 1.0),                 // double size
                    minimumPixelSize :Cesium.defaultValue(modelSetting.minimumPixelSize, 128),          // never smaller than 128 pixels
                    //maximumScale: 20000,             // never larger than 20000 * model size (overrides minimumPixelSize)
                    allowPicking : Cesium.defaultValue(modelSetting.allowPicking,  true),            // not pickable
                    debugShowBoundingVolume :Cesium.defaultValue(modelSetting.debugShowBoundingVolume, true), // default
                    debugWireframe :Cesium.defaultValue(modelSetting.debugWireframe, true)
                  }));
                  treeNode.model=model;
              }

              
              
        }

        return e.preventDefault();
    }


    function parseModelNode(tileset,node){
        //首先遍历一遍取得所有定义的模型ID
        
    }
    //建立三维模型树
    var modelTree;
    function process3dtilesProperty(batchTable) {
     
        var properties=batchTable._properties;
        var names=properties['name']||[];
        for (let index = 0; index < names.length; index++) {
            const propertyName = names[index];
            var node=modelTree.getNodeByParam("modelId",propertyName);
            if(node){
                node.batchTable=batchTable;
                node.batchId=index;
            }
        }
    }
    // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
    function getTreeData(event, treeId, treeNode, data) {

        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            
            //场景添加模型
            var modelData=element.data;

             //如果自己设置位置的话
            var modelPosition= modelData.position;
            var modelMatrix=	Cesium.Matrix4.IDENTITY;
            if(modelPosition){
                var position = Cesium.Cartesian3.fromDegrees(modelPosition.longitude, modelPosition.latitude, modelPosition.height);
                //var scale=Cesium.defaultValue(modelData.scale,1) ;
                
                var heading=Cesium.defaultValue(modelData.heading, 0),
                pitch=Cesium.defaultValue(modelData.pitch, 0),//
                roll=Cesium.defaultValue(modelData.roll, 0); //

                var hpr=new Cesium.HeadingPitchRoll(heading, pitch, roll);
                modelMatrix=Cesium.Transforms.headingPitchRollToFixedFrame(position, hpr);

                
                //Cesium.Matrix4.fromTranslationQuaternionRotationScale(position, quaternion, new Cesium.Cartesian3(scale,scale,scale));
            }
            
            var tilesetInfo = new Cesium.Cesium3DTileset({
                    url: modelData.url,
                    modelMatrix:modelMatrix,
                    
                });
            tilesetInfo.nodeId=element.id;
            if(modelData.processProperty)
                tilesetInfo.needProcessProperty=true;
            viewer.scene.primitives.add(tilesetInfo);
            tilesetInfo.readyPromise.then(function(tileset) {
                //不是单位矩阵，说明前面已经设置过模型矩阵
                if(!tileset.modelMatrix.equals(Cesium.Matrix4.IDENTITY)){
                    tileset._root.transform = Cesium.Matrix4.IDENTITY;
                }
                var node=modelTree.getNodeByParam("id", tileset.nodeId, null);                
                node.model=tileset;
                //加载处理该节点下的关联模型
                if(tileset.needProcessProperty){
                    tileset.processPropertyEvent=new Cesium.Event;
                    tileset.processPropertyEvent.addEventListener(process3dtilesProperty,modelTree);
                }
                

            });
            
        }
    };
    var setting = {
        async: {
            enable: true,
            url: "../data/modelTree.json",
            contentType: "application/json",
            type: "get",
            dataType: "json"
        },
        callback: {
            onAsyncSuccess: getTreeData,
            onClick:OnClick
        }
    };
    var zNodes=[];
    modelTree = $.fn.zTree.init($("#modelTree"), setting, zNodes);
    window.modelTree=modelTree;
}