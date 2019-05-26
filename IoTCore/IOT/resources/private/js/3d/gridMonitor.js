function gridMonitor(pickedObject,featureName,clickStatus1,clickStatus2,entitiesActually)
{
    
    // pick商家电子网格
    if(pickedObject.id instanceof Cesium.Entity && pickedObject.id._id === 'blinkEntity'){
        entitiesActually.remove(entitiesActually.getById("blinkEntity")); //删除闪烁entity
        //表示当前entity被选中
        entitiesActually.add({
            id:"hightLightEntity",
            polygon:{
                hierarchy:pickedObject.id.polygon.hierarchy,
                height:27,
                material:Cesium.Color.RED.withAlpha(0.5)
            }
        })
        //获取商家数据
        $.ajax({
            type: "get",
            url: "../data/studentInformation.json",
            dataType: "json",
            success: function(data){
                //data里包括事件类型 商家事件 或者 交通事件
                //生成展示商家的信息的面板
                
                
                facialRecognition(data)
            },
            error: function(message){
                console.log(message)
            }
        })
    }else{
        entitiesActually.remove(entitiesActually.getById("hightLightEntity")); //上出已经高亮的的entity       remove和show那个更有利于性能
        entitiesActually.add({
            id:"hightLightEntity",
            polygon:{
                hierarchy:pickedObject.id.polygon.hierarchy,
                height:27,
                material:Cesium.Color.RED.withAlpha(0.5)
            }
        })
    }
    
    
    
}