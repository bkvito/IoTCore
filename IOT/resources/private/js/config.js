/**
 * 配置对象，用于配置地图地址和其他通用配置
 */
var CONFIG = {
    TDT_RasterUrl: "http://t{0-6}.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}",
    TDT_RasterUrl_LOCAL: "http://192.168.1.55:8084/bigmap/tile/maptile/548572442/{z}/{x}/{y}",
    TDT_RasterAnoUrl: "http://t{0-6}.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}",
    TDT_RasterAnoUrl_LOCAL: "http://192.168.1.55:8084/bigmap/tile/maptile/2071081155/{z}/{x}/{y}",
    TDT_VectorUrl: "http://t{0-6}.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}",
    TDT_VectorAnoUrl: "http://t{0-6}.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}",
    TDT_VECTOR_LOCAL: "http://localhost:8080/bigmap/tile/maptile/2071081155/{z}/{x}/{y}",
    GAODE_Online_RasterUrl: "http://webst0{1-3}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    GAODE_Online_RasterAnoUrl: "http://webst0{1-4}.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8",
    GAODE_Local_RasterUrl: "http://localhost:8080/bigmap/tile/maptile/321978823/{z}/{x}/{y}",
    GAODE_Loacl_RasterAnoUrl: "http://localhost:8080/bigmap/tile/maptile/2046959579/{z}/{x}/{y}",
    GAODE_VECTOR_LOCAL: "http://localhost:8080/bigmap/tile/maptile/1447870524/{z}/{x}/{y}",
    Google_Url: "http://mt{1-3}.google.cn/vt/lyrs=m@180000000&hl=zh-CN&gl=cn&src=app&s=Gal&x={x}&y={y}&z={z}",
    Google_Url_lOCAL: "http://localhost:8080/bigmap/tile/maptile/1818940751/{z}/{x}/{y}",
    Google_RasterAnoUrl_lOCAL: "http://192.168.1.25:9090/bigmap/tile/gettile/GoogleChinaSatelliteAno/{z}/{x}/{y}",
    Google_RasterUrl_lOCAL: "http://192.168.1.25:9090/bigmap/tile/gettile/GoogleChinaSatellite/{z}/{x}/{y}",
    Google_RasterAnoUrl:'http://mt{1-3}.google.cn/vt/lyrs=h@298&gl=cn&s=Ga&x={x}&y={y}&z={z}',
    Google_RasterUrl:'http://mt{1-3}.google.cn/vt/lyrs=s@170&gl=cn&s=Gal&x={x}&y={y}&z={z}',
    ChinaOnlineStreetPurplishBlue_Url:'http://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
    BlueMAP_LOCAL:"http://192.168.1.25:9090/bigmap/tile/gettile/ChinaOnlineStreetPurplishBlue/{z}/{x}/{y}",
    CHINA_DEM_Url: "http://192.168.1.25:8090/chinadem",
    DEM3_Url: "//assets.agi.com/stk-terrain/world",
    DEM_Url: "http://www.beyondb.com.cn/chinadem"
}
