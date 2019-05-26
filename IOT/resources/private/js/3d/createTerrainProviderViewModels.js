function createTerrainProviderViewModels() {
    var ProviderViewModel=Cesium.ProviderViewModel;
    var buildModuleUrl=Cesium.buildModuleUrl;
    var createWorldTerrain=Cesium.createWorldTerrain;
    var EllipsoidTerrainProvider=Cesium.EllipsoidTerrainProvider;

    var providerViewModels = [];

    providerViewModels.push(new ProviderViewModel({
        name : 'WGS84 基准平面',
        iconUrl : buildModuleUrl('Widgets/Images/TerrainProviders/Ellipsoid.png'),
        tooltip : 'WGS84 标准球体,即EPSG:4326',
        category: '地形图层',
        creationFunction : function() {
            return new EllipsoidTerrainProvider();
        }
    }));

    providerViewModels.push(new ProviderViewModel({
        name : '中国高程',
        iconUrl : buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
        tooltip : '中国地形高程数据',
        category: '地形图层',
        creationFunction : function() {
            return new Cesium.CesiumTerrainProvider({
                url : CONFIG.CHINA_DEM_Url,
            });
        }
    }));

    
    providerViewModels.push(new ProviderViewModel({
        name : '全球地形',
        iconUrl : buildModuleUrl('Widgets/Images/TerrainProviders/CesiumWorldTerrain.png'),
        tooltip : '高精度全球地形',
        category: '地形图层',
        creationFunction : function(){
            return createWorldTerrain({
                requestWaterMask: true,
                requestVertexNormals: true
            });
        }
    }));

   


    return providerViewModels;
}
