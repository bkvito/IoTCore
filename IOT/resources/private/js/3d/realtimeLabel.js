function RealtimeLabelLayer(viewLayer){
    Cesium.ViewLayer.call(this,viewLayer);

    //创建该图层下的标牌集合，便于整个图层的控制
    this.labelCollection=viewer.scene.primitives.add(new Cesium.LabelCollection());


    //创建该图层下的路径集合，便于整个图层的控制

    
}
(function(){
    var SuperClass=function(){};
    SuperClass.prototype=Cesium.ViewLayer.prototype;
    RealtimeLabelLayer.prototype=new SuperClass();
})();
//原型继承
//ZhtsLayer.prototype = new Cesium.ViewLayer();
//将自身指针指向自己的构造函数
RealtimeLabelLayer.prototype.constructor = RealtimeLabelLayer;


//添加一个态势目标
RealtimeLabelLayer.prototype.addLabel= function (id, obj) {
    
}

function localToWallGeometry(modelMatrix,center,Length,Height){
    var leftPos=new Cesium.Cartesian3(),rightPos=new Cesium.Cartesian3(),centerW=new Cesium.Cartesian3();
    leftPos=Cesium.Cartesian3.subtract(center,new Cesium.Cartesian3(Length/2,0,-Height/2),leftPos);
    rightPos=Cesium.Cartesian3.add(center,new Cesium.Cartesian3(Length/2,0,Height/2),rightPos);
    //将本地坐标转世界
    leftPos=Cesium.Matrix4.multiplyByPoint(modelMatrix,leftPos,leftPos);
    rightPos=Cesium.Matrix4.multiplyByPoint(modelMatrix,rightPos,rightPos);
    centerW=Cesium.Matrix4.multiplyByPoint(modelMatrix,center,centerW);
    var  centerW_cartog=Cesium.Cartographic.fromCartesian(centerW);
    wall = Cesium.WallGeometry.fromConstantHeights({
        positions : [leftPos,rightPos],
        minimumHeight : centerW_cartog.height-Height/2,
        maximumHeight : centerW_cartog.height+Height/2,
      });
      var geometry = Cesium.WallGeometry.createGeometry(wall);

    return geometry;
}

function RealtimeLabel(options){
    this.viewer=options.viewer;
    var scene=this.viewer.scene;

    this.position=Cesium.defaultValue(options.position,new Cesium.Cartesian3);

    var heading=Cesium.defaultValue(options.heading, 0),
                pitch=Cesium.defaultValue(options.pitch, 0),
                roll=Cesium.defaultValue(options.roll, 0);

    this.hpr=new Cesium.HeadingPitchRoll(heading, pitch, roll);

    //默认坐标系下矩阵
    this.modelMatrix=	Cesium.Matrix4.IDENTITY;
    this.modelMatrix=Cesium.Transforms.headingPitchRollToFixedFrame(this.position, this.hpr);
    //添加4个数字

    this.horizontalAlign='center';
    this.verticalAlign='center';

    //单个数字图片大小  米单位
    this.singleSize=Cesium.defaultValue(options.size, 0.1);

    this.numberLabels=[];

    //创建材质
    this.numberMaterials=[];
    var color=options.color||'';
    color=color+'/';
    for (let index = 0; index < 10; index++) {
       var  material = new Cesium.Material({
            fabric : {
                type : 'Image',
                uniforms : {
                    image : '../data/images/numbers/'+color+index+'.png'
                }
            }
         });
         this.numberMaterials.push(material) ;         
    }
    var  pMaterial = new Cesium.Material({
        fabric : {
            type : 'Image',
            uniforms : {
                image : '../data/images/numbers/'+color+'p.png'
            }
        }
     });
     this.numberMaterials.push(pMaterial) ;    
     var  p2Material = new Cesium.Material({
        fabric : {
            type : 'Image',
            uniforms : {
                image : '../data/images/numbers/'+color+'p2.png'
            }
        }
     });
     this.numberMaterials.push(p2Material) ;    
    this.offset=Cesium.defaultValue(options.offset,new Cesium.Cartesian3);

    var center=new Cesium.Cartesian3(-this.singleSize*1.5,0,0);
    center=Cesium.Cartesian3.add(center,this.offset,center);

    var num0 = scene.primitives.add(new Cesium.Primitive({
        geometryInstances : new Cesium.GeometryInstance({
            geometry :localToWallGeometry(this.modelMatrix,center,this.singleSize,this.singleSize),
            attributes : {
                color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.AQUA)
              },
        }),
        appearance : new Cesium.MaterialAppearance({
            material : Cesium.Material.fromType('Color'),
            faceForward : true
          }),
        asynchronous:false
        
    }));
    this.numberLabels.push(num0);

    center.x+=this.singleSize;
    var num1 = scene.primitives.add(new Cesium.Primitive({
        geometryInstances : new Cesium.GeometryInstance({
            geometry :localToWallGeometry(this.modelMatrix,center,this.singleSize,this.singleSize),
            attributes : {
                color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.AQUA)
              },
        }),
        appearance : new Cesium.MaterialAppearance({
            material : Cesium.Material.fromType('Color'),
            faceForward : true
          }),
          asynchronous:false
    }));
    this.numberLabels.push(num1);
    center.x+=this.singleSize;
    var num2 = scene.primitives.add(new Cesium.Primitive({
        geometryInstances : new Cesium.GeometryInstance({
            geometry :localToWallGeometry(this.modelMatrix,center,this.singleSize,this.singleSize),
            attributes : {
                color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.AQUA)
              },
        }),
        appearance : new Cesium.MaterialAppearance({
            material : Cesium.Material.fromType('Color'),
            faceForward : true
          }),
          asynchronous:false
    }));
    this.numberLabels.push(num2);
    center.x+=this.singleSize;
    var num3 = scene.primitives.add(new Cesium.Primitive({
        geometryInstances : new Cesium.GeometryInstance({
            geometry :localToWallGeometry(this.modelMatrix,center,this.singleSize,this.singleSize),
            attributes : {
                color : Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.AQUA)
              },
        }),
        appearance : new Cesium.MaterialAppearance({
            material : Cesium.Material.fromType('Color'),
            faceForward : true
          }),
          asynchronous:false
    }));
    this.numberLabels.push(num3);


    if(options.initNumber){
        this.setNumber(options.initNumber);
    }

}
/* Document This 
0--------------1
|              |
|              |
|              |
3--------------2
*/


// function createGeometry(p0,p1,p2,p3){
//     // Create geometry with a position attribute and indexed lines.
//     var positions = new Float64Array([
//         p0.x, p0.y, p0.z,
//         p1.x, p1.y, p1.z,
//         p2.x, p2.y, p2.z,
//         p3.x, p3.y, p3.z
//     ]);
    
//     var geometry = new Cesium.Geometry({
//         attributes : {
//             position : new Cesium.GeometryAttribute({
//                 componentDatatype : Cesium.ComponentDatatype.FLOAT,
//                 componentsPerAttribute : 3,
//                 values : positions
//             })
//         },
//         indices : new Uint16Array([0, 1, 3, 3, 1, 2]),
//         primitiveType : Cesium.PrimitiveType.TRIANGLES,
//         boundingSphere : Cesium.BoundingSphere.fromVertices(positions)
//     });
//     return geometry;
// }

RealtimeLabel.prototype.setNumber=function(number){
    this.number=number;
    //var number=parseInt(Math.random()*(9999-1000+1)+1000,10);
    var qn=parseInt(number/1000);number=number-qn*1000;
    var bn=parseInt(number/100);number=number-bn*100;
    var sn=parseInt(number/10);number=number-sn*10;

    this.numberLabels[0].appearance.material=this.numberMaterials[qn];
    this.numberLabels[1].appearance.material=this.numberMaterials[bn];
    this.numberLabels[2].appearance.material=this.numberMaterials[sn];
    this.numberLabels[3].appearance.material=this.numberMaterials[number];
}

RealtimeLabel.prototype.update = function(frameState) {
    

    return false;
}