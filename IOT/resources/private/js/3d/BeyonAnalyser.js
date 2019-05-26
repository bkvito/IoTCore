
//分析功能
var BEYONANALYSER_TYPE={
    VISIBILITY:0,
    SLOPE:1,
    VISUALFIELD:2,
    POINTANALYSIS:3
    
}

var BEYONANALYSER_STATE={
    PREPARE:0,
    OPERATING:1,
    END:2};

function showTip(label,bShow,position,message,effectOptions){
    label.show = bShow;
    if(bShow){
        if(position)
            label.position = position;
        if(message)
            label.label.text =message;
        if(effectOptions){
            for(let key  in effectOptions){
                if(label.key){
                    label.key=effectOptions[key];
                }
            }
        }
    }    
}

function saveDataToFile(fileName,json, type) {
    //根据json数据，获取excel的第一行(例如:姓名、年龄、性别)存至map
    var tmpdata = json[0];
    json.unshift({});
    var keyMap = []; //获取keys
    for (var k in tmpdata) {
        keyMap.push(k);
        json[0][k] = k;
    }
    
    
    var tmpdata = [];
    json.map((v, i) => keyMap.map((k, j) => Object.assign({}, {
        v: v[k],
        position: (j > 25 ? getCharCol(j) : String.fromCharCode(65 + j)) + (i + 1)
    }))).reduce((prev, next) => prev.concat(next)).forEach((v, i) => tmpdata[v.position] = {
        v: v.v
    });
    
    //设置区域,比如表格从A1到D10
    var outputPos = Object.keys(tmpdata); 
    var tmpWB = {
        SheetNames: ['mySheet'], //保存的表标题
        Sheets: {
            'mySheet': Object.assign({},
                tmpdata, //内容
                {
                    '!ref': outputPos[0] + ':' + outputPos[outputPos.length - 1] //设置填充区域
                })
        }
    };
    
    //创建二进制对象写入转换好的字节流
    tmpDown = new Blob([s2ab(XLSX.write(tmpWB, 
        {bookType: (type == undefined ? 'xlsx':type),bookSST: false, type: 'binary'}//这里的数据是用来定义导出的格式类型
        ))], {
        type: ""
    });
    var o = document.body;
    var href = URL.createObjectURL(tmpDown); //创建对象超链接
    var downEle=document.createElement("a");
    downEle.href=href;
    downEle.download=fileName+".xlsx";
    o.appendChild(downEle);
    // document.getElementById("downloadA").download=fileName+".xlsx";
    // document.getElementById("downloadA").href = href; //绑定a标签
    //document.getElementById("downloadA").click(); //模拟点击实现下载
    downEle.click(); //模拟点击实现下载
    setTimeout(function() { //延时释放
        URL.revokeObjectURL(tmpDown); //用URL.revokeObjectURL()来释放这个object URL
    }, 100);
}

//字符串转字符流
function s2ab(s) { 
    var buf = new ArrayBuffer(s.length);
    var view = new Uint8Array(buf);
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

//将指定的自然数转换为26进制表示。映射关系：[0-25] -> [A-Z]。
function getCharCol(n) {
    let temCol = '',
    s = '',
    m = 0
    while (n > 0) {
        m = n % 26 + 1
        s = String.fromCharCode(m + 64) + s
        n = (n - m) / 26
    }
    return s
}


//两点通视分析
function createVisibility(options){
    
    options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);

    var viewer=options.viewer;
    
    if (!Cesium.defined(viewer)) {
        throw new Cesium.DeveloperError('viewer is required.');
    }
    var analyser=options.analyser;
    if (!Cesium.defined(analyser)) {
        throw new Cesium.DeveloperError('analyser is required.');
    }
    analyser.state=BEYONANALYSER_STATE.PREPARE;

    var visiblyEffect=function(options){
        this.id=Cesium.defaultValue(options.id,Cesium.createGuid());
        this._markers=[];
        this._lines=[];
        this._pickedObjs=[];
        this.posArray=[];
        this._resultTip=viewer.entities.add({
            id:this.id,
            label : {
                //name: 'visiblyEffect',
                //show : false,
                fillColor:Cesium.Color.YELLOW,
                showBackground : true,
                font : '14px monospace',
                horizontalOrigin : Cesium.HorizontalOrigin.LEFT,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                pixelOffset : new Cesium.Cartesian2(0, -10)
            }
        });

        //交互操作
        var scope=this;
        analyser.handler.setInputAction(function (movement) {
            var cartesian =Cesium.pickGlobe(viewer.scene,movement.position);
            scope.posArray.push(cartesian);
            if(scope._markers.length==0){
                //scope.reset();
                var startSphere = viewer.entities.add({
                    position : cartesian,
                    ellipsoid : {
                        radii : new Cesium.Cartesian3(2.0, 2.0, 2.0),
                        material : Cesium.Color.BLUE
                    },
                    label:{
                        text:"视线起点",
                        fillColor:Cesium.Color.YELLOW,
                        pixelOffset:{
                            x:0,y:-20
                        },
                        scale:0.5
                    }
                });  
                //objectsToExclude.push(startSphere);
                scope._markers.push(startSphere);
                analyser.state=BEYONANALYSER_STATE.OPERATING;
            }else if(scope._markers.length==1){
                var redSphere = viewer.entities.add({
                    position : cartesian,
                    ellipsoid : {
                        radii : new Cesium.Cartesian3(2.0, 2.0, 2.0),
                        material : Cesium.Color.RED
                    }
                });
                scope._markers.push(redSphere);
                
                var results=analyser.getIntersectObj(scope.posArray[0],cartesian,scope._markers,true);
                
                
                //分析一下是否都有position
                for (let index = results.length-1; index >=0; index--) {
                    const element = results[index];
                    if(!Cesium.defined(element.position)){
                        results.splice(index,1);
                    }                    
                }
                if(!Cesium.defined(results[0].position)){
                    throw new Cesium.DeveloperError("position is undefined");
                }
                var pickPos1=results[0].position;
                var dis=Cesium.Cartesian3.distance(pickPos1,cartesian);                
                var bVisibility=dis<5?true:false;
                var arrowPositions=[scope.posArray[0],results[0].position];
                var greenLine=viewer.entities.add({
                        polyline : {
                            positions : arrowPositions,
                            width : 10,
                            arcType : Cesium.ArcType.NONE,
                            material : new Cesium.PolylineArrowMaterialProperty(Cesium.Color.GREEN)
                        }
                    });
                    scope._lines.push(greenLine);
                if(!bVisibility){
                    var unArrowPositions=[results[0].position,cartesian];
                    var redLine=viewer.entities.add({
                        polyline : {
                            positions : unArrowPositions,
                            width : 10,
                            arcType : Cesium.ArcType.NONE,
                            material : new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED)
                        }
                    });
                    scope._lines.push(redLine);
                }
                
                showIntersections(results);
                var pos1=scope.posArray[0];
                var pos2=cartesian;
                var rad1 = Cesium.Cartographic.fromCartesian(pos1);
                var rad2 = Cesium.Cartographic.fromCartesian(pos2);
                var degree1 = {longitude:rad1.longitude / Math.PI * 180,latitude:rad1.latitude / Math.PI * 180,height:rad1.height};
                var degree2 = {longitude:rad2.longitude / Math.PI * 180,latitude:rad2.latitude / Math.PI * 180,height:rad2.height};

                var length_ping = Math.sqrt(Math.pow(pos1.x-pos2.x,2)+Math.pow(pos1.y-pos2.y,2)+Math.pow(pos1.z-pos2.z,2));
                var length_h = Math.abs(degree2.height-degree1.height);
                var length = Math.sqrt(Math.pow(length_ping,2)+Math.pow(length_h,2));
                //console.log(degree1);
                var visTxt=bVisibility?'是':'否';
                var text =
                    '起点坐标: ' + ('   (' + degree1.longitude.toFixed(6))+ '\u00B0' +',' +(degree1.latitude.toFixed(6))+ '\u00B0'+',' +degree1.height.toFixed(2)+')' +
                    '\n终点坐标: ' + ('   (' + degree2.longitude.toFixed(6))+ '\u00B0' +',' +(degree2.latitude.toFixed(6))+ '\u00B0'+',' +degree2.height.toFixed(2)+')' +
                    '\n垂直距离: ' + '   ' + length_h.toFixed(2) +'m'+
                    '\n水平距离: ' + '   ' + length_ping.toFixed(2) +'m'+
                    '\n空间距离: ' + '   ' + length.toFixed(2) +'m'+
                    '\n是否可视: ' + '   ' + visTxt;
                
                showTip(scope._resultTip,true,cartesian,text,{
                    fillColor:Cesium.Color.YELLOW
                });
                analyser.state=BEYONANALYSER_STATE.END;
            }
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK );

        var info;
        analyser.handler.setInputAction(function (movement) {
            var cartesian =viewer.scene.pickPosition(movement.endPosition);
            if(analyser.state===BEYONANALYSER_STATE.PREPARE){               
                info ='点击设定起点';
                showTip(scope._resultTip,true,cartesian,info);
            }else if(analyser.state===BEYONANALYSER_STATE.OPERATING){               
                info ='点击分析通视情况';
                showTip(scope._resultTip,true,cartesian,info);
            }
        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);



        function showIntersections(results) {        
            for (i = 0; i < results.length; ++i) {
                var object = results[i].object;
                if(object){
                    if (object instanceof Cesium.Cesium3DTileFeature) {
                        scope._pickedObjs.push(object);
                        object.oldColor=object.color.clone();
                        object.color = Cesium.Color.fromAlpha(Cesium.Color.YELLOW, object.color.alpha);
                    }else if (object.id instanceof Cesium.Entity) {
                        var entity=object.id;
                        scope._pickedObjs.push(entity);
                        var color=entity.polygon.material.color.getValue();
                        entity.polygon.oldColor=color.clone();
                        entity.polygon.material = Cesium.Color.fromAlpha(Cesium.Color.YELLOW, color.alpha);
                    }
                }
                
                scope._markers.push(viewer.entities.add({
                    position : results[i].position,
                    ellipsoid : {
                        radii : new Cesium.Cartesian3(0.8, 0.8, 0.8),
                        material : Cesium.Color.RED
                    }
                }));
            }
        }

    }
    visiblyEffect.prototype.remove = function () {
        //恢复颜色
        for (i = 0; i < this._pickedObjs.length; ++i) {
            var object=this._pickedObjs[i];
            if (object instanceof Cesium.Cesium3DTileFeature) {
                object.color = object.oldColor.clone();
            }else if (object instanceof Cesium.Entity) {
    
                object.polygon.material = object.polygon.oldColor.clone();                
            }
        }
        this._pickedObjs.length=0;

        for (let index = 0; index < this._markers.length; index++) {
            var element = this._markers[index];
            viewer.entities.remove(element);            
        }
        this._markers.length=0;

        for (let index = 0; index < this._lines.length; index++) {
            var element = this._lines[index];
            viewer.entities.remove(element);            
        }
        this._lines.length=0;

        viewer.entities.remove(this._resultTip);   
        this._resultTip=undefined;        
    }



    
    return new visiblyEffect(options);
}

//环视通视分析
function createPointVisualAnalyseEffect(options){
    options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);

    var viewer=options.viewer;
    
    if (!Cesium.defined(viewer)) {
        throw new Cesium.DeveloperError('viewer is required.');
    }
    var analyser=options.analyser;
    if (!Cesium.defined(analyser)) {
        throw new Cesium.DeveloperError('analyser is required.');
    }
    // var position=options.position;
    // if (!Cesium.defined(position)) {
    //     throw new Cesium.DeveloperError('position is required.');
    // }

    const ANGLE_STEP=10;
    var ANGLE_ERROR=Cesium.defaultValue(options.pitchErr,0.1);
    var headingStep=Cesium.defaultValue(options.headingInterval,1);

    var processTool=options.processTool;
    /**
     *360环视分析
     *
     * @param {*} options
     */
    var pointVisualAnalyseEffect=function(options){
        this.id=Cesium.defaultValue(options.id,Cesium.createGuid());
        this._tip=viewer.entities.add({
            id:this.id,
            label : {
                name: 'pointVisualAnalyseEffect',
                show : false,
                showBackground : true,
                font : '14px monospace',
                horizontalOrigin : Cesium.HorizontalOrigin.LEFT,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                pixelOffset : new Cesium.Cartesian2(15, -10)
            }
        });
        this._orginCartographic=undefined;
        this.analysisData=[];
        this._lines=[];
        this._intersects=[];
        //报告
        this.rePort=[];
        //标牌集合
        this._labels = viewer.scene.primitives.add(new Cesium.LabelCollection({
            scene:viewer.scene
        }));
        this._personModel=undefined;

        this._processing=0;
 
        //this._origin=options.position;
        var scope=this;

        var bShowLine=Cesium.defaultValue(options.showLine,true);
        //使用promise
        function calculateVisualAngle(heading,pitch,lastPitch=(ANGLE_ERROR*2)){

            var p=new Promise(function(resolve,reject){

                //迭代计算函数
                function runCompute(heading,pitch,lastPitch=(ANGLE_ERROR*2),lastRS){
                     //创建本地矩阵
                    // var hpr=Cesium.HeadingPitchRoll.fromDegrees(heading, pitch, 0);
                    // var mat4=Cesium.Transforms.headingPitchRollToFixedFrame(scope._origin, hpr);
                    var mat4=Cesium.Transforms.eastNorthUpToFixedFrame(scope._origin)
                    //设定方向
                    var vec=new Cesium.Cartesian3();
                    var angleRad=Cesium.Math.toRadians(heading);
                    var pitchRad=Cesium.Math.toRadians(Math.abs(pitch));
                    vec.x=Math.cos(angleRad);
                    vec.y=Math.sin(angleRad);
                    vec.z=Math.sin(pitchRad);
                    //转换为世界坐标
                    var vecWorld=new Cesium.Cartesian3();
                    vecWorld=Cesium.Matrix4.multiplyByPoint(mat4, vec, vecWorld);    
                    //获取相交体  只pick到一个object      
                    var rsPick=analyser.getIntersectObj(scope._origin,vecWorld)[0];   

                    //保存上一次的角度
                    var newLastPitch=pitch;

                    //如果有相交体，继续改变pith
                    if(rsPick&&rsPick.object){
                        //rs[0].position.clone(intersectPoint);                
                        if(lastPitch>0){
                            pitch-=ANGLE_STEP;
                        }
                        else if(lastPitch<pitch){
                            
                            pitch+=(lastPitch-pitch)/2;
                        }else{
                            pitch-=lastPitch-pitch;
                        }
                        //intersectEntity=rs[0].object.id;
                        runCompute(heading,pitch,newLastPitch,rsPick);
                    }
                    //初始平时没有相交到时 直接返回
                    else if(pitch===0){
                        var rsData={
                            heading:heading,
                            maxVisualAngle:pitch,
                            distance:0,
                            position:undefined,
                            object:undefined                     
                        }
                        resolve(rsData);
                    }else{
                        //角度相差ANGLE_ERROR  两次角度差小于精度差，认为上次是相交结果
                        if((lastPitch-pitch)<ANGLE_ERROR){
                            // var hpr=Cesium.HeadingPitchRoll.fromDegrees(heading, 0, 0);
                            // var mat4=Cesium.Transforms.headingPitchRollToFixedFrame(scope._origin, hpr);
                            //var mat4=Cesium.Transforms.eastNorthUpToFixedFrame(scope._origin)
                            var inverseMat=new Cesium.Matrix4();
                            //求逆矩阵
                            inverseMat=Cesium.Matrix4.inverse(mat4, inverseMat);
                            //转换为本地坐标
                            var posLocal=new Cesium.Cartesian3();
                            var intersectposition=lastRS.position;
                            posLocal=Cesium.Matrix4.multiplyByPoint(inverseMat, intersectposition, posLocal);  
                        // var visualVec =new Cesium.Cartesian3();
                            //Cesium.Cartesian3.subtract(posLocal, scope._origin, visualVec);
                            //var dis=Cesium.Cartesian3.magnitude(visualVec)*Math.cos(Cesium.Math.toRadians(visualAngle));
                            
                            var rsData={
                                heading:heading,
                                maxVisualAngle:pitch,
                                distance:Cesium.Cartesian3.magnitude(posLocal)*Math.cos(Cesium.Math.toRadians(pitch)),
                                position:intersectposition,
                                object:lastRS.object                                        
                            }
                            resolve(rsData);
                        }else{
                            runCompute(heading,lastPitch-(lastPitch-pitch)/2,newLastPitch,lastRS);
                        }
                    }
                }                
                runCompute(heading,pitch,lastPitch);
            });
            return p;
        }

        //处理分析结果
        function processAllResult(rsDatas,callback){
            
            for (let index = 0; index < rsDatas.length; index++) {
                const rs = rsDatas[index];
                var cartog_pos;
                if(rs.position){
                    cartog_pos=Cesium.Cartographic.fromCartesian(rs.position);
                    //添加视线
                    if(bShowLine){
                        var redLine=viewer.entities.add({
                            polyline : {
                                positions : [scope._origin,rs.position],
                                width : 10,
                                arcType : Cesium.ArcType.NONE,
                                material : new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED)
                            }
                        });
                        scope._lines.push(redLine);
                    }
                                 
                }
                //储存相交体
                if(rs.object){
                    if(!scope._intersects.includes(rs.object.id)){
                        scope._intersects.push(rs.object.id); 
                    }                    
                }                           

                
                var data={
                    // "经度":Cesium.Math.toDegrees(cartog.longitude),
                    // "纬度":Cesium.Math.toDegrees(cartog.latitude),
                    // "视高":1.6,
                    "视角":rs.heading,
                    "水平距离":rs.distance>0?rs.distance.toFixed(3):"水平无遮挡",
                    "最大遮挡角":rs.maxVisualAngle,
                    "遮挡点经度":cartog_pos?Cesium.Math.toDegrees(cartog_pos.longitude).toFixed(6):'',
                    "遮挡点纬度":cartog_pos?Cesium.Math.toDegrees(cartog_pos.latitude).toFixed(6):'',
                    "遮挡点高度":cartog_pos?Cesium.Math.toDegrees(cartog_pos.height).toFixed(3):'',
                }
                scope.rePort.push(data);                
            }
            //导出excel
            //saveDataToFile("test",reData);
            //处理场景中entity，保留相交体
            for (let index = 0; index < viewer.dataSources.length; index++) {
                const dataSource = viewer.dataSources.get(index);
                if(dataSource.name!=="gugong.geojson") continue;
                var entities =dataSource.entities.values;

                for (var i = 0; i < entities.length;i++) {
                    var entity = entities[i];
                    if(!scope._intersects.includes(entity)){
                        entity.show=false;
                    }else{
                        var name=entity.name||'';
                        var info=
                        '名称：'+name+
                        '\n面积：'+entity.area.toFixed(2)+' 平方米';

                        scope._labels.add({
                            id:entity.id,
                            text: info,
                            show : true,
                            position:entity.center,
                            showBackground : true,
                            font : '64px monospace',
                            scale:0.2,
                            horizontalOrigin : Cesium.HorizontalOrigin.LEFT,
                            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset : new Cesium.Cartesian2(15, -10),
                            heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,
                            
                        });
                    }                   
                }
                
            } 
            
            
            callback();
        }

//处理单个结果
        function processResult(rs,callback){
            var cartog_pos;
            if(rs.position){
                cartog_pos=Cesium.Cartographic.fromCartesian(rs.position);
                //添加视线
                if(bShowLine){
                    var redLine=viewer.entities.add({
                        polyline : {
                            positions : [scope._origin,rs.position],
                            width : 10,
                            arcType : Cesium.ArcType.NONE,
                            material : new Cesium.PolylineArrowMaterialProperty(Cesium.Color.RED)
                        }
                    });
                    scope._lines.push(redLine);
                }
                             
            }
            //储存相交体
            if(rs.object){
                if(!scope._intersects.includes(rs.object.id)){
                    scope._intersects.push(rs.object.id); 
                }                    
            }                           

            
            var data={
                // "经度":Cesium.Math.toDegrees(cartog.longitude),
                // "纬度":Cesium.Math.toDegrees(cartog.latitude),
                // "视高":1.6,
                "视角":rs.heading,
                "水平距离":rs.distance>0?rs.distance.toFixed(3):"水平无遮挡",
                "最大遮挡角":rs.maxVisualAngle,
                "遮挡点经度":cartog_pos?Cesium.Math.toDegrees(cartog_pos.longitude).toFixed(6):'',
                "遮挡点纬度":cartog_pos?Cesium.Math.toDegrees(cartog_pos.latitude).toFixed(6):'',
                "遮挡点高度":cartog_pos?Cesium.Math.toDegrees(cartog_pos.height).toFixed(3):'',
            }
            scope.rePort.push(data);      
            
            scope._processing++;
            var percent=scope._processing/scope._processTotal*100;
            var m=(360-scope._processing*headingStep)/headingStep;
            if(m<1){                
                processTool.update("100%","分析计算完毕");
                callback&&callback();
                setTimeout(() => {
                    processTool.setVisible(false);
                }, 2000);
            }else{
                processTool.update(percent+'%',"正在分析计算，请稍候。。。");
            }
           
        }

        //不使用promise来计算
        function calculateVisualAngleNoPromise(heading,pitch,lastPitch=(ANGLE_ERROR*2),lastRS){
            //迭代计算函数
            //创建本地矩阵
            // var hpr=Cesium.HeadingPitchRoll.fromDegrees(heading, pitch, 0);
            // var mat4=Cesium.Transforms.headingPitchRollToFixedFrame(scope._origin, hpr);
            var mat4=Cesium.Transforms.eastNorthUpToFixedFrame(scope._origin)
            //设定方向
            var vec=new Cesium.Cartesian3();
            var angleRad=Cesium.Math.toRadians(heading);
            var pitchRad=Cesium.Math.toRadians(Math.abs(pitch));
            vec.x=Math.cos(angleRad);
            vec.y=Math.sin(angleRad);
            vec.z=Math.sin(pitchRad);
            //转换为世界坐标
            var vecWorld=new Cesium.Cartesian3();
            vecWorld=Cesium.Matrix4.multiplyByPoint(mat4, vec, vecWorld);    
            //获取相交体  只pick到一个object      
            var rsPick=analyser.getIntersectObj(scope._origin,vecWorld)[0];   

            //保存上一次的角度
            var newLastPitch=pitch;

            //如果有相交体，继续改变pith
            if(rsPick&&rsPick.object){
                //rs[0].position.clone(intersectPoint);                
                if(lastPitch>0){
                    pitch-=ANGLE_STEP;
                }
                else if(lastPitch<pitch){
                    
                    pitch+=(lastPitch-pitch)/2;
                }else{
                    pitch-=lastPitch-pitch;
                }
                //intersectEntity=rs[0].object.id;
                return calculateVisualAngleNoPromise(heading,pitch,newLastPitch,rsPick);
            }
            //初始平时没有相交到时 直接返回
            else if(pitch===0){
                var rsData={
                    heading:heading,
                    maxVisualAngle:pitch,
                    distance:0,
                    position:undefined,
                    object:undefined                     
                }
                return rsData;
            }else{
                //角度相差ANGLE_ERROR  两次角度差小于精度差，认为上次是相交结果
                if(Math.abs(lastPitch-pitch)<ANGLE_ERROR){
                    // var hpr=Cesium.HeadingPitchRoll.fromDegrees(heading, 0, 0);
                    // var mat4=Cesium.Transforms.headingPitchRollToFixedFrame(scope._origin, hpr);
                    //var mat4=Cesium.Transforms.eastNorthUpToFixedFrame(scope._origin)
                    var inverseMat=new Cesium.Matrix4();
                    //求逆矩阵
                    inverseMat=Cesium.Matrix4.inverse(mat4, inverseMat);
                    //转换为本地坐标
                    var posLocal=new Cesium.Cartesian3();
                    var intersectposition=lastRS.position;
                    posLocal=Cesium.Matrix4.multiplyByPoint(inverseMat, intersectposition, posLocal);  
                // var visualVec =new Cesium.Cartesian3();
                    //Cesium.Cartesian3.subtract(posLocal, scope._origin, visualVec);
                    //var dis=Cesium.Cartesian3.magnitude(visualVec)*Math.cos(Cesium.Math.toRadians(visualAngle));
                    
                    var rsData={
                        heading:heading,
                        maxVisualAngle:pitch,
                        distance:Cesium.Cartesian3.magnitude(posLocal)*Math.cos(Cesium.Math.toRadians(pitch)),
                        position:intersectposition,
                        object:lastRS.object                                        
                    }
                    return rsData;
                }else{
                    return calculateVisualAngleNoPromise(heading,lastPitch-(lastPitch-pitch)/2,newLastPitch,lastRS);
                }
            }
        }
        //var taskProcessor = new Cesium.TaskProcessor('create360Analysis');
        processTool.update("正在分析计算，请稍后。。。");
        //如果使用双击事件开始计算
        if(options.dbLeftClick){
            analyser.handler.setInputAction(function (movement) {
                var pos =Cesium.pickGlobe(viewer.scene,movement.position);   
                var cartog=Cesium.Cartographic.fromCartesian(pos);
    
                var landHeight=viewer.scene.globe.getHeight(cartog);
    
                //地表高1.6米视高
                cartog.height=landHeight+1.6;
    
                this._orginCartographic=cartog;
    
                var positioon=Cesium.Cartesian3.fromRadians(cartog.longitude, cartog.latitude, cartog.height);
                info ='视点';
                showTip(scope._tip,true,positioon,info);
                scope._origin=positioon;
                var promiseArray=[];
                for (let heading = 0; heading < 360; heading=heading+headingStep) {
                    promiseArray.push(calculateVisualAngle(heading,0,ANGLE_ERROR*2,undefined));    

                }
                Promise.all(promiseArray)
                .then(function(results){
                    processResult(results,options.callback)})
                .catch(function(e){
                    console.log(JSON.stringify(e))});
            
    
            },Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    
        }else if(options.position){
            scope._origin=options.position;         
            scope._processTotal=360/headingStep;
            for (let heading = 0; heading < 360; heading=heading+headingStep) {
                calculateVisualAngle(heading,0,ANGLE_ERROR*2,undefined)
                .then(function(result){
                        processResult(result,options.callback)}) 
                .catch(function(e){
                    console.log(JSON.stringify(e))});   

            }



            // var promiseArray=[];
            // for (let heading = 0; heading < 360; heading=heading+headingStep) {
            //     promiseArray.push(calculateVisualAngle(heading,0,ANGLE_ERROR*2,undefined));    

            // }
            // scope.destroyHandler();
            // scope.restoreViewerLeftClicHander();
            // Promise.all(promiseArray)
            // .then(function(results){
            //     processAllResult(results,options.callback)})
            // .catch(function(e){
            //         console.log(JSON.stringify(e))});    
            
            
            // for (let heading = 0; heading < 360; heading=heading+headingStep) {
            //     var rs=calculateVisualAngleNoPromise(heading,0,ANGLE_ERROR*2,undefined);
            //     processResult(rs);

            //     var percent=heading/360*100;
            //     processTool.update(percent+'%',"正在分析计算，请稍候。。。");
            // }

            // processTool.update("100%","分析计算完毕");
            // setTimeout(() => {
            //     processTool.setVisible(false);
            // }, 2000);
            // options.callback&&options.callback();     
            
            // //使用worker来计算
           

            // var analysisPromise = taskProcessor.scheduleTask({
                
            //     origin:scope._origin,
            //     startHeading : 0,
            //     endHeading : 360,
            //     pitch_step : ANGLE_STEP,
            //     pitch_error : ANGLE_ERROR,
            //     heading_step : headingStep,                
            // },{
            //     scene :viewer.scene
            // });
    
            // if (!Cesium.defined(analysisPromise)) {
            //     // Postponed
            //     return undefined;
            // }
            // Cesium.when(analysisPromise, function(result) {
            //     processAllResult(result,options.callback)                
            // });
        }
        
        
        
    }

    pointVisualAnalyseEffect.prototype.remove = function () {
        //viewer.scene.primitives.add(this._shadowPrimitive);
        this.analysisData=[];
        viewer.entities.remove(this._tip);   
        this._tip=undefined;   

        for (let index = 0; index < this._lines.length; index++) {
            var element = this._lines[index];
            viewer.entities.remove(element);            
        }
        this._lines.length=0;

        this._labels.removeAll();
        //this._labels.destroy();
        viewer.scene.primitives.remove(this._labels);

        this._personModel&&viewer.entities.remove(this._personModel);
        this._personModel=undefined;
        this.rePort.length=0;
        this._intersects.length=0;

        //隐藏的建筑显示
        for (let index = 0; index < viewer.dataSources.length; index++) {
            const dataSource = viewer.dataSources.get(index);
            if(dataSource.name!=="gugong.geojson") continue;
            var entities =dataSource.entities.values;

            for (var i = 0; i < entities.length;i++) {
                var entity = entities[i];
                entity.show=true;               
            }
            
        } 
    }

    return new pointVisualAnalyseEffect(options);
}

//可视域分析
function createVisualField(options){
    options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);

    var viewer=options.viewer;
    
    if (!Cesium.defined(viewer)) {
        throw new Cesium.DeveloperError('viewer is required.');
    }
    var analyser=options.analyser;
    if (!Cesium.defined(analyser)) {
        throw new Cesium.DeveloperError('analyser is required.');
    }
    analyser.state=BEYONANALYSER_STATE.PREPARE;

    
    var info;
    var visualFieldEffect=function(options){

       
        this.id=Cesium.defaultValue(options.id,Cesium.createGuid());
        this._tip=viewer.entities.add({
            id:this.id,
            label : {
                name: 'visualFieldEffect',
                show : false,
                showBackground : true,
                font : '14px monospace',
                horizontalOrigin : Cesium.HorizontalOrigin.LEFT,
                verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                pixelOffset : new Cesium.Cartesian2(15, -10)
            }
        });
        this._shadowPrimitive=undefined;

        var scope=this;
        analyser.handler.setInputAction(function (movement) {
            var cartesian =viewer.scene.pickPosition(movement.endPosition);  
            if(analyser.state===BEYONANALYSER_STATE.END){               
                info ='点击设定起点';
                showTip(scope._tip,true,cartesian,info);
            }else if(analyser.state===BEYONANALYSER_STATE.OPERATING){
                scope._shadowPrimitive.setPoseByTargetPoint(cartesian);   
                info ='点击分析可视域';
                showTip(scope._tip,true,cartesian,info);         
            }
        },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    
      
        analyser.handler.setInputAction(function (movement) {
            var pos =Cesium.pickGlobe(viewer.scene,movement.position);   
    
            if(!Cesium.defined(scope._shadowPrimitive)){
                scope._shadowPrimitive=new Cesium.ShadowPrimitive({
                    scene:viewer.scene,
                    viewerPosition:pos
                });
                viewer.scene.primitives.add(scope._shadowPrimitive);
                analyser.state=BEYONANALYSER_STATE.OPERATING;
            }else{
                analyser.state=BEYONANALYSER_STATE.END;
                showTip(scope._tip,false);    
            }
        },Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    visualFieldEffect.prototype.remove=function(){
        //viewer.scene.primitives.add(this._shadowPrimitive);
        this._shadowPrimitive.show=false;
        viewer.entities.remove(this._tip);   
        this._tip=undefined;   
    }

    return new visualFieldEffect(options);
    
    
}

/**
 *坡度分析
 *
 * @param {*} options
 * @returns
 */
function createSlopeAnslysis(options){
    options = BeyonMap.defaultValue(options, BeyonMap.defaultValue.EMPTY_OBJECT);

    var viewer=options.viewer;
    
    if (!BeyonMap.defined(viewer)) {
        throw new BeyonMap.DeveloperError('viewer is required.');
    }
    var analyser=options.analyser;
    if (!BeyonMap.defined(analyser)) {
        throw new BeyonMap.DeveloperError('analyser is required.');
    }
    analyser.state=BEYONANALYSER_STATE.PREPARE;

    function showResult(startPoint,endPoint){
        //起止点相关信息
        var scartographic = BeyonMap.Cartographic.fromCartesian(startPoint);


        //var ecartographic = BeyonMap.Cartographic.fromCartesian(endPoint);


        var samplePoint=[scartographic];
        var pointSum = 10;  //取样点个数
        var tempCartesians=new BeyonMap.Cartesian3();
        var slopePercent=[0];
        var disL=[0];
        var angle=0;
        for(var i =1; i <= pointSum; i++){
            BeyonMap.Cartesian3.lerp(startPoint, endPoint, i/pointSum, tempCartesians);
            var tempCartographic = BeyonMap.Cartographic.fromCartesian(tempCartesians);
            var surfaceHeight=viewer.scene.globe.getHeight(tempCartographic);
            tempCartographic.height=surfaceHeight;
            samplePoint.push(tempCartographic);
            
            var lastCarto=samplePoint[i-1];
            var dis=BeyonMap.Cartesian3.distance(BeyonMap.Cartographic.toCartesian(lastCarto), BeyonMap.Cartographic.toCartesian(tempCartographic));            
            disL.push(disL[i-1]+dis);
            angle=Math.asin((tempCartographic.height-lastCarto.height)/dis);
            slopePercent.push(Math.tan(angle)*100);
        }
        
        var echartContainer = document.createElement('div');
        echartContainer.className = 'echart-viewer';
        viewer.container.appendChild(echartContainer,'dark',{
            renderer: 'canvas',
            width: 640,
            height:480
        });
        echartContainer.style.position = "absolute";  
        echartContainer.style.left =  '160px';  
        echartContainer.style.top =  '80px';  
        echartContainer.style.height =  '300px'; 
        echartContainer.style.width =  '640px'; 
        echartContainer.style.overflow = "hidden";  
        echartContainer.style.zIndex = "9999";  
        echartContainer.style.opacity = 0.9; 
        var myChart = echarts.init(echartContainer);
        var option = {
            title : {
                text: '剖面示意图',
                left: 'center',
                subtext: '',
                textStyle: {
                    color: 'white',
                    fontSize:15
                }
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['']
            },
            //右上角工具条
            toolbox: {
                show : false,
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    magicType : {show: true, type: ['line', 'bar']},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    name:"长度(米)",
                    boundaryGap : false,
                    data : disL,
                    axisLabel : {
                        textStyle: {
                            color: 'white'
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:"white"
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    name:"坡度（%）",
                    axisLabel : {
                        formatter:function(data){ return data.toFixed(2)+"%";} ,
                        // formatter: '{value} 米',
                        textStyle: {
                            color: 'white'
                        }
                    },
                    axisLine:{
                        lineStyle:{
                            color:"white"
                        }
                    }
                }
            ],
            series : [
                {
                    name:'坡度',
                    type:'line',
                    areaStyle: {},
                    smooth: true,
                    data:slopePercent,
                    markPoint : {
                        data : [
                            {type : 'max', name: '最大值'},
                            {type : 'min', name: '最小值'}
                        ]
                    },
                    markLine : {
                        data : [
                            {type : 'average', name: '平均值'}
                        ]
                    }
                }
            ]
        };

        // 为echarts对象加载数据
        myChart.setOption(option);
        return myChart;
    }

    var slopeEffect=function(options){
        this.id=BeyonMap.defaultValue(options.id,BeyonMap.createGuid());
        this._markers=[];
        this._lines=[];       
        this.posArray=[];
        this._resultChart=undefined;
        this._tip=viewer.entities.add({
            id:this.id,
            label : {
                //name: 'visiblyEffect',
                //show : false,
                fillColor:BeyonMap.Color.YELLOW,
                showBackground : true,
                font : '14px monospace',
                horizontalOrigin : BeyonMap.HorizontalOrigin.LEFT,
                verticalOrigin : BeyonMap.VerticalOrigin.BOTTOM,
                pixelOffset : new BeyonMap.Cartesian2(0, -10),
                heightReference : BeyonMap.HeightReference.CLAMP_TO_GROUND,
            }
        });

        //交互操作
        var scope=this;

        analyser.handler.setInputAction(function (movement) {
            var cartesian =viewer.scene.pickPosition(movement.endPosition);  
            if(analyser.state===BEYONANALYSER_STATE.PREPARE){               
                info ='点击设定起点';
                showTip(scope._tip,true,cartesian,info);
            }else if(analyser.state===BEYONANALYSER_STATE.OPERATING){
                info ='点击分析坡度';
                showTip(scope._tip,true,cartesian,info);         
            }
        },BeyonMap.ScreenSpaceEventType.MOUSE_MOVE);
    

        analyser.handler.setInputAction(function (movement) {
                var cartesian =BeyonMap.pickGlobe(viewer.scene,movement.position);
                scope.posArray.push(cartesian);
                var blueSphere = viewer.entities.add({
                    position : cartesian,
                    ellipsoid : {
                        radii : new BeyonMap.Cartesian3(5.0, 5.0, 5.0),
                        material : BeyonMap.Color.BLUE
                    }
                });  
                scope._markers.push(blueSphere);
                analyser.state=BEYONANALYSER_STATE.OPERATING;
                if(scope.posArray.length==2){
                   
                    //var Positions=[scope.posArray[0],cartesian];
                    var greenLine=viewer.entities.add({
                            polyline : {
                                positions : scope.posArray,
                                width : 10,
                                arcType : BeyonMap.ArcType.NONE,
                                material : new BeyonMap.PolylineArrowMaterialProperty(BeyonMap.Color.GREEN)
                            }
                        });
                    scope._lines.push(greenLine);
                    analyser.state=BEYONANALYSER_STATE.END;                    
                    scope._resultChart=showResult(scope.posArray[0],scope.posArray[1]);
                    scope.posArray=[];
                    analyser.destroyHandler();
                }
            }, BeyonMap.ScreenSpaceEventType.LEFT_CLICK );
    }

    slopeEffect.prototype.remove=function(){
        
        for (let index = 0; index < this._markers.length; index++) {
            var element = this._markers[index];
            viewer.entities.remove(element);            
        }
        this._markers.length=0;

        for (let index = 0; index < this._lines.length; index++) {
            var element = this._lines[index];
            viewer.entities.remove(element);            
        }
        this._lines.length=0;
        viewer.entities.remove(this._tip);   
        this._resultChart.dispose();
        this._tip=undefined;   
    }

    return new slopeEffect(options);
}





function BeyonAnalyser(viewer) {
    this._viewer=viewer;

    this.tipLabelEntity=viewer.entities.add({
        label : {
            name: 'analyse',
            show : false,
            showBackground : true,
            font : '14px monospace',
            horizontalOrigin : Cesium.HorizontalOrigin.LEFT,
            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
            pixelOffset : new Cesium.Cartesian2(15, -10)
        }
    });
    this.analysisEffects=[];
    //this.posArray=[];

    this.type=undefined;

}

Cesium.defineProperties(BeyonAnalyser.prototype, {




});

BeyonAnalyser.prototype.showTip=function(bShow,position,message){
    this.tipLabelEntity.label.show = bShow;
    if(bShow){
        if(position)
            this.tipLabelEntity.position = position;
        if(message)
            this.tipLabelEntity.label.text =message;
    }
    
}

BeyonAnalyser.prototype.addAnalysis=function(type,options){
    this.stopViewerLeftClickHander()
    this.destroyHandler(); 
    this.handler=new Cesium.ScreenSpaceEventHandler(this._viewer.scene.canvas);   
    var scope=this;
    options = Cesium.defaultValue(options, Cesium.defaultValue.EMPTY_OBJECT);
    options.analyser=this;
    options.viewer=this._viewer;
    switch (type) {
        case BEYONANALYSER_TYPE.VISIBILITY:        
            this.analysisEffects.push(createVisibility(options));
            break;
        case BEYONANALYSER_TYPE.SLOPE:
            this.analysisEffects.push(createSlopeAnslysis(options));  
            break;
        case BEYONANALYSER_TYPE.VISUALFIELD:
            this.analysisEffects.push(createVisualField(options));  
            break;
        case BEYONANALYSER_TYPE.POINTANALYSIS:
            this.analysisEffects.push(createPointVisualAnalyseEffect(options));  
            break;            
        default:
            break;
    }
}

BeyonAnalyser.prototype.removeAnalysis=function(id){
    if(!Cesium.defined(id)){
        this.analysisEffects.forEach(function(effect){
            effect.remove();
            effect=undefined;
        });
        this.analysisEffects=[];
        this.destroyHandler();
        this.restoreViewerLeftClicHander();
    }else{
        for (let index = 0; index < this.analysisEffects.length; index++) {
            var effect = this.analysisEffects[index];
            if(id===effect.id){
                effect.remove();
                var delEffect=this.analysisEffects.splice(index,1);
                delEffect=undefined;
                break;
            }            
        }
    }
}


BeyonAnalyser.prototype.destroyHandler=function(){
    this.handler=this.handler&&this.handler.destroy();
}
BeyonAnalyser.prototype.getIntersectObj=function(startPos,endPos,excludeArr=[],bDrillPick=false){
    var viewer=this._viewer;
    var direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(endPos, startPos, new Cesium.Cartesian3()), new Cesium.Cartesian3());
    var ray = new Cesium.Ray(startPos, direction);

    var results = [];

    if (bDrillPick) {
        results = viewer.scene.drillPickFromRay(ray, 10, excludeArr);
    } else //只pick首个物体
    {
        var result = viewer.scene.pickFromRay(ray, excludeArr);
        if (Cesium.defined(result)) {
            results = [result];
        }
    }
    return results;
}
BeyonAnalyser.prototype.stopViewerLeftClickHander=function(){
    this.viewerHandler=this.viewerHandler||this._viewer._cesiumWidget.screenSpaceEventHandler;
    //保存一下视图的单击、双击事件
    if(!Cesium.defined(this.viewActtion)){
        this.viewActtion={};
        this.viewActtion.leftClick=this.viewerHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.viewActtion.leftDBClick=this.viewerHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }
    this.viewerHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    this.viewerHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
}
BeyonAnalyser.prototype.restoreViewerLeftClicHander=function(){
    if(Cesium.defined(this.viewerHandler)&&Cesium.defined(this.viewActtion)){
        this.viewerHandler.setInputAction(this.viewActtion.leftClick,Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.viewerHandler.setInputAction(this.viewActtion.leftDBClick,Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    }
}

/**
 * 
 * @param {*} center 
 * @param {*} heading 
 */
function addPrimitive(center, heading) {
    //var center = Cesium.Cartesian3.fromRadians(lon, lat, height);

    var lightCamera = new Cesium.Camera(scene);
    lightCamera.position = center;
    lightCamera.direction = Cesium.Cartesian3.negate(Cesium.Cartesian3.UNIT_Z, new Cesium.Cartesian3());
    lightCamera.up = Cesium.Cartesian3.clone(Cesium.Cartesian3.UNIT_Y);
    lightCamera.frustum.fov = Cesium.Math.PI_OVER_THREE;
    lightCamera.frustum.near = 0.1;
    lightCamera.frustum.far = 200;

    // camera.lookAt(center, new Cesium.Cartesian3(25.0, 25.0, 30.0));
    // camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

    var shadowMap = new Cesium.ShadowMap({
        context : scene.context,
        lightCamera : lightCamera,
        softShadows : false,
        cascadesEnabled:false
    });
    shadowMap.useCustomColor=true;

    shadowMap._customColor={
        invisibly:Cesium.Color.RED,
        visibly:Cesium.Color.GREEN
    };

    shadowMap.enabled = true;
    return shadowMap;
}





//地球取点
BeyonAnalyser.prototype.pickMap=function(callback){
    this.stopViewerLeftClickHander()
    this.destroyHandler(); 
    var viewer=this._viewer;
    this.handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);   
    var scope=this;

    this._tip=viewer.entities.add({
        id:this.id,
        label : {
            fillColor:Cesium.Color.YELLOW,
            showBackground : true,
            font : '14px monospace',
            horizontalOrigin : Cesium.HorizontalOrigin.LEFT,
            verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
            pixelOffset : new Cesium.Cartesian2(0, -10)
        }
    });

    this.state=BEYONANALYSER_STATE.OPERATING;

    this.handler.setInputAction(function (movement) {
            var cartesian =Cesium.pickGlobe(viewer.scene,movement.position);
           
           
            this.state=BEYONANALYSER_STATE.END;
            var lla={};
            var cartographic=Cesium.Cartographic.fromCartesian(cartesian);
             //获取该点地表高程
            var landHeight=viewer.scene.globe.getHeight(cartographic);
            if(cartographic.height<landHeight)
            {
                cartographic.height=landHeight;
            }            
            lla.lon=Cesium.Math.toDegrees(cartographic.longitude);
            lla.lat=Cesium.Math.toDegrees(cartographic.latitude);
            lla.height=cartographic.height;
            scope.removeAnalysis();
            viewer.entities.remove(scope._tip);
            callback(lla);
            scope.destroyHandler();
            scope.restoreViewerLeftClicHander();
        }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK  );


    this.handler.setInputAction(function (movement) {
        var cartesian =viewer.scene.pickPosition(movement.endPosition);  
        if(scope.state===BEYONANALYSER_STATE.OPERATING){
            info ='双击取点';
            showTip(scope._tip,true,cartesian,info);         
        }
    },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

/**
 * 获取存在的效果
 * @param {*} id 
 */
BeyonAnalyser.prototype.getAnalysisEffect=function(id){

    for (let index = 0; index < this.analysisEffects.length; index++) {
        var effect = this.analysisEffects[index];
        if(id===effect.id){
            return effect;
        }            
    }
    return undefined;
}