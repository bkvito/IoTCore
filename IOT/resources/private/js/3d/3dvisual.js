function VisualManager(viewer){
    var hander=new Camera.screenSpaceEventHandler(viewer.scene.canvas);
    var selectedEntity = new Cesium.Entity();
    var selected = {
        feature: undefined,
        originalColor: new Cesium.Color()
    };
    // Information about the currently highlighted feature
    var highlighted = {
        feature: undefined,
        originalColor: new Cesium.Color()
    };
    var drawstatus =0;
    var clickHandler = viewer.screenSpaceEventHandler.getInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);


    hander.setInputAction(function onLeftClick(movement) {
        //打印坐标值

        let longitudeString =0;
        let latitudeString =0;
        let ellipsoid = scene.globe.ellipsoid;
        //let aaaaaa = new Cesium.Ellipsoid();
        cartesian = viewer.camera.pickEllipsoid(movement.position, ellipsoid);


        var cartographic = ellipsoid.cartesianToCartographic(cartesian);
        //将弧度转为度的十进制度表示
        longitudeString = Cesium.Math.toDegrees(cartographic.longitude);
        latitudeString = Cesium.Math.toDegrees(cartographic.latitude);
        //获取相机高度
        height = Math.ceil(viewer.camera.positionCartographic.height);

        console.log(longitudeString.toFixed(10) +',' +latitudeString.toFixed(10) + ","+ height)//左击事件
        console.log(cartesian.x+','+cartesian.y+','+cartesian.z);
        // If a feature was previously selected, undo the highlight
        if (drawstatus == 0){
            if (Cesium.defined(selected.feature)) {
                selected.feature.color = selected.originalColor;
                selected.feature = undefined;
            }
        }


        // Pick a new feature
        var pickedFeature = viewer.scene.pick(movement.position);
        if (!Cesium.defined(pickedFeature) && drawstatus ==0) {
            clickHandler(movement);
            return;
        }

        // Select the feature if it's not already selected
        if (selected.feature === pickedFeature  && drawstatus ==0) {
            return;
        }
        selected.feature = pickedFeature;

        // Save the selected feature's original color
        if (pickedFeature === highlighted.feature && drawstatus ==0) {
            Cesium.Color.clone(highlighted.originalColor, selected.originalColor);
            highlighted.feature = undefined;
        } else {
            Cesium.Color.clone(pickedFeature.color, selected.originalColor);
        }
        //alert('lalalall')
        // Highlight newly selected feature
        pickedFeature.color = Cesium.Color.LIME;
        //function clickonme(){}

        // Set feature infobox description
        var featureName = pickedFeature.getProperty('name');
        selectedEntity.name = featureName;
        selectedEntity.description = 'Loading <div class="cesium-infoBox-loading"></div>';
        viewer.selectedEntity = selectedEntity;
        selectedEntity.description = '<table class="cesium-infoBox-defaultTable"><tbody>' +
            '<tr><th>BIN</th><td>' + pickedFeature.getProperty('BIN') + '</td></tr>' +
            '<tr><th>DOITT ID</th><td>' + pickedFeature.getProperty('DOITT_ID') + '</td></tr>' +
            '<tr><th>SOURCE ID</th><td>' + pickedFeature.getProperty('SOURCE_ID') + '</td></tr>' +
            '<tr><th>Longitude</th><td>' + pickedFeature.getProperty('longitude') + '</td></tr>' +
            '<tr><th>Latitude</th><td>' + pickedFeature.getProperty('latitude') + '</td></tr>' +
            '<tr><th>Height</th><td>' + pickedFeature.getProperty('height') + '</td></tr>' +
            '<tr><th>Terrain Height (Ellipsoid)</th><td>' + pickedFeature.getProperty('TerrainHeight') + '</td></tr>' +
            '</tbody></table>';




    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //加载CZML
    viewer.dataSources.add(Cesium.CzmlDataSource.load('../data/Vehicle.czml'));
}






