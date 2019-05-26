var BIGMap;
var playback;
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
    BIGMap.getHeatmapLayer().set('visible', false);

    BIGMap.enableMarkerPopup();

    BIGMap.addMarker(ol.proj.fromLonLat([107.806828, 34.861069]), 100, null, "content test!");
    //BIGMap.addMarker([112.233, 29.121], 100, null, "content test!");
    BIGMap.setCenter(ol.proj.fromLonLat([107.806828, 34.861069]));
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

