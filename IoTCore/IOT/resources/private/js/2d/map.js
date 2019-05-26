/**
 *  地图操作封装，用于简化地图开发 <p>
 *  默认集成了：热力图，动态聚合图，标记图层，量算图层，普通标绘图层，动态标绘图层，态势回放，二三维一体化；
 * 
 * @param {any} mapdiv id 
 * @param {any} options 
 * @author guanml <guanminglin@beyondb.com.cn>
 */
var BeyonMap = function (mapdiv, options) {
    var m = this._init(mapdiv, options);
    this.lastSelectedFeature = null;
    this.map = m;
    if (options) {
        var _enable3DMap = options.enable3DMap || false;
        var _enableLighting = options.enableLighting || false;
        if (_enable3DMap == true) {
            this.init3DMap();
            this.ol3d.setEnabled(true);
            if (_enableLighting == true) {
                this.enableLighting(true);
            }
        }
    }
}

/**
 * 初始化地图
 * 
 * @param {element} mapdiv id 
 * @param {any} options 
 */
BeyonMap.prototype._init = function (mapdiv, options) {
    var _zoom = 3;
    var _maxZoom = 18;
    var _minZoom = 2;
    var _center = ol.proj.fromLonLat([101.4173, 37.9204]);
    var _rotation = 0;

    var mousePositionControl = new ol.control.MousePosition({
        coordinateFormat: ol.coordinate.createStringXY(6),
        projection: 'EPSG:4326',
        undefinedHTML: '&nbsp;'
    });

    //定义弹出窗口
    var _popup = new ol.Overlay.Popup({
        popupClass: "default", //"tooltips", "warning" "black" "default", "tips", "shadow",
        closeBox: true,
        //onclose: function(){ console.log("You close the box"); },
        // onshow: function() { console.log("You opened the box"); },
        positioning: 'bottom-center',
        autoPan: true,
        offset: [1.2, -20],
        autoPanAnimation: {
            duration: 100
        }
    });

    //添加阴影
    _popup.addPopupClass('shadow');

    //定义默认标记图层
    var _markersLayer = new ol.layer.Vector({
        title: '标记图层',
        source: new ol.source.Vector({
            wrapX: false
        })
    });

    var _vectorLayer = new ol.layer.Vector({
        title: '矢量图层',
        source: new ol.source.Vector({
            wrapX: false
        })
    });

    //定义默认量算图层
    var _mesureLayer = new ol.layer.Vector({
        title: '量算图层',
        source: new ol.source.Vector(),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(255, 255, 255, 0.2)'
            }),
            stroke: new ol.style.Stroke({
                color: '#ffcc33',
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: '#ffcc33'
                })
            })
        })
    });

    //定义默认热力图层
    var _heatmapLayer = new ol.layer.Heatmap({
        title: '热力图层',
        source: new ol.source.Vector({
            wrapX: false
        }),
        blur: parseInt(20, 10),
        radius: parseInt(5, 10),
        visible: true
    });

    var _baseLayerGroup = new ol.layer.Group({
        'title': '基础底图',
        openInLayerSwitcher: true,
        layers: [
            new ol.layer.Tile({
                title: '天地图影像-网络',
                type: 'base',
                visible: false,
                source: new ol.source.XYZ({
                    url: CONFIG.TDT_RasterUrl
                })
            })
        ]
    });

    var _overlayersGroup = new ol.layer.Group({
        'title': '叠加图层',
        openInLayerSwitcher: true,
        layers: [
            new ol.layer.Tile({
                title: '天地图影像注记-网络',
                type: 'overlay',
                visible: false,
                source: new ol.source.XYZ({
                    url: CONFIG.TDT_RasterAnoUrl
                })
            })
        ]
    });

    if (options) {
        _zoom = options.zoom || 3;
        _center = options.center || ol.proj.fromLonLat([101.4173, 37.9204]);
        _rotation = options.rotation || 0;
        _maxZoom = options.maxZoom || 18;
        _minZoom = options.minZoom || 2;

        //如果options中有定义图层组则使用options中提供的
        if (options.baseLayerGroup) {
            _baseLayerGroup = options.baseLayerGroup;
        }

        if (options.overlayersGroup) {
            _overlayersGroup = options.overlayersGroup;
        }
    }

    this.popup = _popup;
    this.popups = new ol.Collection([]);
    this.baseLayerGroup = _baseLayerGroup;
    this.overlayersGroup = _overlayersGroup;
    this.markersLayer = _markersLayer;
    this.heatmapLayer = _heatmapLayer;
    this.mesureLayer = _mesureLayer;
    this.vectorLayer = _vectorLayer;
    this.zoom = _zoom;
    this.center = _center;
    this.rotation = _rotation;
    this.maxZoom = _maxZoom;
    this.minZoom = _minZoom;

    //添加默认图层
    this.overlayersGroup.getLayers().push(_mesureLayer);
    this.overlayersGroup.getLayers().push(_heatmapLayer);
    this.overlayersGroup.getLayers().push(_vectorLayer);
    this.overlayersGroup.getLayers().push(_markersLayer);

    this._initClusterLayer(this.overlayersGroup);

    //定义地图对象
    var _map = new ol.Map({
        layers: [
            _baseLayerGroup,
            _overlayersGroup
        ],

        controls: ol.control.defaults({
            attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
                collapsible: false
            })
        }).extend([mousePositionControl, new ol.control.FullScreen({
            source: 'fullscreen'
        })]),
        target: document.getElementById(mapdiv),
        view: new ol.View({
            zoom: _zoom,
            center: _center,
            rotation: _rotation,
            maxZoom: _maxZoom,
            minZoom: _minZoom
        }),
        loadTilesWhileInteracting: true,
        logo: false
    });

    // 添加图层管理器
    var layerSwitcher = new ol.control.LayerSwitcher({
        tipLabel: '图层管理' // Optional label for button
    });
    _map.addControl(layerSwitcher);

    //设置popup显示的地图
    _popup.setMap(_map);

    return _map;
};

/**
 * 初始化聚合图层
 * 
 * @param {any} overlayersGroup 
 */
BeyonMap.prototype._initClusterLayer = function (overlayersGroup) {

    // Style for the clusters
    var styleCache = {};
    // Cluster Source
    var _clusterSource = new ol.source.Cluster({
        distance: 40,
        source: new ol.source.Vector()
    });
    // Animated cluster layer
    var _clusterLayer = new ol.layer.AnimatedCluster({
        name: '动态聚合图',
        source: _clusterSource,
        animationDuration: 700,
        // Cluster style
        style: function (feature, resolution) {
            var size = feature.get('features').length;
            var style = styleCache[size];
            if (!style) {
                var color = size > 25 ? "192,0,0" : size > 8 ? "255,128,0" : "0,128,0";
                var radius = Math.max(8, Math.min(size * 0.75, 20));
                var dash = 2 * Math.PI * radius / 6;
                dash = [0, dash, dash, dash, dash, dash, dash];
                style = styleCache[size] = [new ol.style.Style({
                    image: new ol.style.Circle({
                        radius: radius,
                        stroke: new ol.style.Stroke({
                            color: "rgba(" + color + ",0.5)",
                            width: 15,
                            lineDash: dash
                        }),
                        fill: new ol.style.Fill({
                            color: "rgba(" + color + ",1)"
                        })
                    }),
                    text: new ol.style.Text({
                        text: size.toString(),
                        fill: new ol.style.Fill({
                            color: '#fff'
                        })
                    })
                })];
            }
            return style;
        }
    });
    this.clusterLayer = _clusterLayer;
    overlayersGroup.getLayers().push(this.clusterLayer);
};

/**
 * 初始化三维地图
 * @returns {undefined}
 */
BeyonMap.prototype.init3DMap = function () {

    var ol3dmap = new olcs.OLCesium({
        map: this.map
    });
    this.ol3d = ol3dmap;
    var scene = this.ol3d.getCesiumScene();
    scene.sun = new Cesium.Sun();
    scene.globe.enableLighting = false;
    scene.globe.depthTestAgainstTerrain = true;
    this.ol3d.enableAutoRenderLoop();

    scene.skyBox = new Cesium.SkyBox({
        sources: {
            positiveX: '../resouces/common/images/spacebook/Version2_dark_px.jpg',
            negativeX: '../resouces/common/images/spacebook/Version2_dark_mx.jpg',
            positiveY: '../resouces/common/images/spacebook/Version2_dark_py.jpg',
            negativeY: '../resouces/common/images/spacebook/Version2_dark_my.jpg',
            positiveZ: '../resouces/common/images/spacebook/Version2_dark_pz.jpg',
            negativeZ: '../resouces/common/images/spacebook/Version2_dark_mz.jpg'
        }
    });

    // Show off 3D feature picking
    var handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
    var lastPicked;
    handler.setInputAction(function (movement) {
        var pickedObjects = ol3dmap.getCesiumScene().drillPick(movement.position);
        if (Cesium.defined(pickedObjects)) {
            for (i = 0; i < pickedObjects.length; ++i) {
                var picked = pickedObjects[i];
                if (Cesium.defined(picked) && Cesium.defined(picked.node) && Cesium.defined(picked.mesh)) {
                    console.log('node: ' + picked.node.name + '. mesh: ' + picked.mesh.name);
                    alert("选中：" + picked.mesh.name);
                }

            }
        } else {
            lastPicked = undefined;

        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
};

/**
 * 启用或关闭三维日照光线视图
 * @returns {undefined}
 */
BeyonMap.prototype.enableLighting = function (enable) {
    var _ol3d = this.ol3d;
    if (enable) {
        if (_ol3d.getEnabled()) {
            _ol3d.getCesiumScene().globe.enableLighting = true;
        } else {
            alert("请先切换到三维视图！");
            $('#lightningview').prop("checked", "false");
            return;
        }
    } else {
        if (_ol3d.getEnabled()) {
            _ol3d.getCesiumScene().globe.enableLighting = false;
        } else {
            alert("请先切换到三维视图！");
            return;
        }

    }
};


/**
 * 添加基础底图
 * 
 * @param {array} baselayers 
 */
BeyonMap.prototype.addBaseLayer = function (baselayer) {
    this.baseLayerGroup.getLayers().push(baselayer);
};

/**
 * 添加叠加图层
 * 
 * @param {any} overlayer 
 */
BeyonMap.prototype.addOverLayLayer = function (overlayer) {
    this.overlayersGroup.getLayers().push(overlayer);
};

/**
 * 添加overlay图层组
 * 
 * @param {any} group 
 */
BeyonMap.prototype.addOverlayersGroup = function (group) {
    this.map.addLayer(group);
};

/** 
 * 添加marker
 * 
 * @param {ol.Coordinate} lonlat 经纬度坐标
 * @param {ol.style.Style} style  样式
 * @returns {ol.feature}  要素对象
 */
BeyonMap.prototype.addMarker = function (lonlat, alt, style, content, transform) {

    var coordinate = [];
    if (transform) {
        coordinate = ol.proj.transform(lonlat, 'EPSG:4326', 'EPSG:3857');
    } else {
        coordinate = lonlat;
    }

    //高程不为null时，添加高程坐标
    if (alt) {
        coordinate.push(alt);
    }

    var feature = new ol.Feature({
        type: 'icon',
        geometry: new ol.geom.Point(coordinate),
        content: content
    });


    if (style) {
        feature.setStyle(style);
    } else {
        //设置默认的style
        feature.setStyle(new ol.style.Style({
            image: new ol.style.Icon( /** @type {olx.style.IconOptions} */ ({
                anchor: [0.5, 40],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                scale: 0.8,
                src: '../resouces/common/images/marker-gold.png'
            }))
        }));

    }

    //添加feature
    this.markersLayer.getSource().addFeature(feature);

    return feature;
};

/**
 * 添加弹出窗口
 * @param {*} popup 
 */
BeyonMap.prototype.addPopup = function (popup) {
    var _overlay = null;
    var _map = this.map;
    if (popup) {
        var p = this.popups.push(popup);
        if (p) {
            _overlay = _map.addOverlay(popup);
        }
    } else {
        console.error("popup 不能为空！");
    }
    return _overlay;
}

/**
 * 添加热力图数据
 * 
 * @param {any} feature 
 */
BeyonMap.prototype.addHeatmapData = function (feature) {
    this.heatmapLayer.getSource().addFeature(feature);
};

/**
 * 添加热力图数据数组
 * 
 * @param {any} features 
 */
BeyonMap.prototype.addHeatmapDatas = function (features) {
    this.heatmapLayer.getSource().addFeatures(features);
};

/**
 * 添加聚合数据
 * 
 * @param {any} feature 
 */
BeyonMap.prototype.addClusterData = function (feature) {
    this.clusterLayer.getSource().getSource().addFeature(feature);
};

/**
 * 添加聚合数据数组
 * 
 * @param [] features 
 */
BeyonMap.prototype.addClusterDatas = function (features) {
    this.clusterLayer.getSource().getSource().addFeatures(features);
};

/**
 * 删除 信息框,如果删除成功则返回被删除的popup
 * @param {*} popup 
 */
BeyonMap.prototype.removePopup = function (popup) {
    var p = this.popups.remove(popup);
    return this.map.removeOverlay(p);
}

/**
 *  删除地图上的marker
 * @param {ol.Feature} marker
 */
BeyonMap.prototype.removeMarker = function (marker) {
    if (marker) {
        this.markersLayer.getSource().removeFeature(marker);
    }
};

/**
 * 清除所有popup
 */
BeyonMap.prototype.cleanPopups = function () {
    var _popups = this.popups;
    var _m = this.map;
    _popups.forEach(function (elem, index, arr) {
        _m.removeOverlay(elem);
    });
    _popups.clear();
}

/**
 * 清理标记图层
 * 
 */
BeyonMap.prototype.cleanMarkers = function () {
    this.markersLayer.getSource().clear();
};

/**
 * 清理热力图层
 * 
 */
BeyonMap.prototype.cleanHeatmapLayer = function () {
    this.heatmapLayer.getSource().clear();
};

/**
 * 清理动态聚合图层
 * 
 */
BeyonMap.prototype.cleanClusterLayer = function () {
    this.clusterLayer.getSource().clear();
};

/**
 * 清理矢量绘制图层数据
 */
BeyonMap.prototype.cleanVectorLayer = function () {
    this.vectorLayer.getSource().clear();
}

/**
 * 清理量算图层
 * 
 */
BeyonMap.prototype.cleanMesureLayer = function () {
    this.mesureLayer.getSource().clear();
};

//TODO 清理地图
BeyonMap.prototype.cleanMap = function () {
    //TODO 清除所有矢量图层的数据
};

/**
 * 获取标记图层
 * 
 * @returns {ol.layer.Vector} 矢量图层
 */
BeyonMap.prototype.getMarkersLayer = function () {
    return this.markersLayer;
};

/**
 * 获取热力图层
 * 
 * @returns {ol.layer.Vector} 矢量图层
 */
BeyonMap.prototype.getHeatmapLayer = function () {
    return this.heatmapLayer;
};

/**
 * 获取动态聚合图层
 * 
 * @returns 
 */
BeyonMap.prototype.getClusterLayer = function () {
    return this.clusterLayer;
};

/**
 * 获取量算图层
 * 
 * @returns {ol.layer.Vector} 矢量图层
 */
BeyonMap.prototype.getMeasureLayer = function () {
    return this.mesureLayer;
};

/**
 * 获取矢量绘制图层
 */
BeyonMap.prototype.getVectorLayer = function () {
    return this.vectorLayer;
}

/**
 * 获取地图对象
 * @return {ol.Map} 地图对象
 */
BeyonMap.prototype.getMap = function () {
    return this.map;
};

/**
 * 获取3D 地图对象
 * @returns {olcs.OLCesium}
 */
BeyonMap.prototype.getOL3D = function () {
    return this.ol3d;
};

/**
 * 设置缩放层级
 * 
 * @param {any} zoom 
 */
BeyonMap.prototype.setZoom = function (zoom) {
    this.map.getView().setZoom(zoom);
};

/**
 * 设置地图中心点
 * 
 * @param {any} center 
 */
BeyonMap.prototype.setCenter = function (center) {
    this.map.getView().setCenter(center);
};

/**
 * 设置一个最后一次选中的要素
 * 
 * @param {any} feature 
 */
BeyonMap.prototype.setLastSelectedFeature = function (feature) {
    this.lastSelectedFeature = feature;
};

/**
 * 获取地图当前的缩放层级
 */
BeyonMap.prototype.getCurrentZoom = function () {
    return this.map.getView().getZoom();
};

/**
 * 获取地图上的覆盖物
 * @returns {ol.Overlay}
 */
BeyonMap.prototype.getOverlays = function () {
    return this.map.getOverlays();
};

/**
 * 获取基层图层数组
 */
BeyonMap.prototype.getDefaultBaseGroup = function () {
    return this.baseLayerGroup;
};

/**
 * 获取叠加图层数组
 */
BeyonMap.prototype.getDefaultOverlayGroup = function () {
    return this.overlayersGroup;
};

/**
 * 获取所有基础图层
 */
BeyonMap.prototype.getBaseLayers = function () {
    return this.baseLayerGroup.getLayers();
};

/**
 * 获取所有叠加图层
 */
BeyonMap.prototype.getOverlayLayers = function () {
    return this.overlayersGroup.getLayers();
};

/**
 * 获取默认的弹出框popup
 */
BeyonMap.prototype.getDefaultPopup = function () {
    return this.popup;
};

/**
 * 获取最后一次选中的要素
 * 
 * @returns {ol.feature} 要素
 */
BeyonMap.prototype.getLastSelectedFeature = function () {
    return this.lastSelectedFeature;
};

/**
 * 启用marker和弹出框
 * 
 */
BeyonMap.prototype.enableMarkerPopup = function () {
    var _map = this.map;
    var _popup = this.popup;
    var _lastSelectedFeature = this.lastSelectedFeature;
    this.map.on('pointermove', function (e) {
        var pixel = _map.getEventPixel(e.originalEvent);
        var hit = _map.hasFeatureAtPixel(pixel);
        _map.getTarget().style.cursor = hit ? 'pointer' : '';
        //如果最后一次选择的marker不为空，则变回原样
        if (_lastSelectedFeature) {
            _lastSelectedFeature.getStyle().getImage().setScale(0.8);
            _lastSelectedFeature.changed();
        }

        if (hit) {
            var f = _map.forEachFeatureAtPixel(e.pixel, function (feature) {
                return feature;
            });

            if (f.get("type") === 'icon') {
                f.getStyle().getImage().setScale(1);
                f.changed();
                _lastSelectedFeature = f;
            }

        }

    });

    this.map.on('click', function (e) {
        var feature = _map.forEachFeatureAtPixel(e.pixel, function (feature) {
            return feature;
        });

        if (feature) {
            var geom = feature.getGeometry();
            var coordinates;
            if (geom instanceof ol.geom.Circle) {
                coordinates = geom.getCenter();
                _popup.setOffset([0, 0]);
            } else if (geom instanceof ol.geom.Point) {
                coordinates = geom.getCoordinates();
                _popup.setOffset([1.2, -20]);
            } else {
                coordinates = e.coordinate;
                _popup.setOffset([0, 0]);
            }

            var content = feature.get("content");
            if (content) {
                _popup.show(coordinates, content);
            }

        } else {
            _popup.hide();
        }

    });
};