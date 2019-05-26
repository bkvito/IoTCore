layui.use(['table','element','layer']);
(function($){
	/*计算面板的高度*/
	function calTbHeight(){
		let w_height = $(window).height();
		let tbHeight = w_height - 265-200;// - 200-20;
		if(tbHeight<400){
			tbHeight = w_height - 265;
		}
		return tbHeight
	}
	$(document).ready(documentReady);
	
	function documentReady(){
		
		function addClickEffect(element) {
		    var ink, d, x, y;
		    element.css({"overflow":"hidden"});
		    element.bind("click touchstart",function(e) {
		    	var _this = $(this);
		        _this.find(".ink").remove();
		        if (_this.children(".ink").length === 0) {
		           _this.append("<b class='ink'></b>");
		        }
		       
		        ink = _this.find(".ink");
		        ink.removeClass("animate-ink");
		        if (!ink.height() && !ink.width()) {
		            d = Math.max(_this.outerWidth(),_this.outerHeight());
		            ink.css({
		                height: d,
		                width: d
		            })
		        }
		        x = e.pageX -_this.offset().left - ink.width() / 2;
		        y = e.pageY -_this.offset().top - ink.height() / 2;
		        ink.css({
		            top: y + 'px',
		            left: x + 'px'
		        }).addClass("animate-ink")
		    })
		}
		
		//顶部时间
		var _times_box = $("#times-box"),
			_console = $("#x-console");
			
	    function showTime(){
	    	try{
	    		var today = new Date();
		        var weekday=["星期一","星期二","星期三","星期四","星期五","星期六","星期日"];
		     	var _data = {
		     		y : x.getStringRight("0000"+today.getFullYear(),4)+"年",
			        month : x.getStringRight("00"+(today.getMonth()+1),2)+"月",
			        td : x.getStringRight("00"+today.getDate(),2)+"日",
			        d : weekday[(today.getDay()-1)<0? 6:today.getDay()-1],
			        h : x.getStringRight("00"+today.getHours(),2)+"",
			        m : x.getStringRight("00"+today.getMinutes(),2)+"",
			        s : x.getStringRight("00"+today.getSeconds(),2)+""
		     	};
		     	
		        _data["time"] = _data["h"]+":"+_data["m"]+":"+_data["s"];
		        _data["date"] = _data["y"]+""+_data["month"]+""+_data["td"];
		        _data["week"] = _data["d"];
		        
		        if( _data["time"].length!=8){
		        	var _t = window.pageObject.getLocalStorage();
		        	if(!_t["error"]){
		        		_t["error"] = [];
		        	}
		        	
					_t["error"].push({
						"type" : "time error", 
						"message" : _data["time"]
					});
					window.pageObject.setLocalStorage(_t);
		        };
		        
		        var _s = "";
		        for(var i in _data["week"]){
		        	_s += _data["week"][i] + "&nbsp;&nbsp;";
		        }
		        _s = _s.replace(/(&nbsp;&nbsp;*$)/g, "");
		         _data["week"] = _s;
		        var _html = template("TemplateTopTimes",_data);
		        _times_box.html(_html);
	    	}catch(e){
	    		//TODO handle the exception
	    	}
	        
	        
	        setTimeout(function(){
	        	showTime();
	        },1000);
	    }
	    showTime();
	    
	    
	    //底部按钮区
		var _foot = $("#foot-button-group");
		$.each(_foot.find(".one-line > .title"), function(index,el) {
			addClickEffect($(el));
		});
		_foot.find(".one-line > .title").on("click",function(event){
			$(this).next().show();
		});

		_foot.find(".one-line").on("mouseleave",function(event){
			$(this).find(".menu-xiala").hide();
		});

		
		//顶部按钮区
		$.each($(".botton-group > .one-line > .title"), function(index,el) {
			addClickEffect($(el));
		});
		$(".botton-group > .one-line > .title").on("click",function(event){
			$(this).next().show();
		});
		$(".botton-group > .one-line").on("mouseleave",function(event){
			$(this).find(".menu-xiala").hide();
		});
		
		//换肤
		$("[x_bind_button_name='SetSkin']").on("click",function(event){
			var _this = $(this),
				_body = $("body");
			_this.closest(".menu-xiala").hide();
			
			var _arr = ["default","blue","green","red","yellow"];
			
			for(var i in _arr){
				_body.removeClass("skin-"+_arr[i]);
			}
			
			_body.addClass(_this.attr("skin"));
				
			var _t = window.pageObject.getLocalStorage();
			_t["x-skin"] = _this.attr("skin");
			window.pageObject.setLocalStorage(_t);
			return false;
		});
		
		_foot.find("[x_bind_button_name='SetBackgroundSkin']").on("click",function(event){
			var _this = $(this);
			_this.closest(".menu-xiala").hide();
			$("#background-changed").val(_this.attr("skin")).trigger("change");
			return false;
		});
		


		function isIncludecChn(str)
		{
		    if(/.*[\u4e00-\u9fa5]+.*$/.test(str))
		    {
		        return true ;
		    } else {
		    return false ;
		    }
		}


		function ProcessTool() {
			var win = document.getElementById("process-window");
			if (!win) {
				var html = '<div id = "process-window" class="Absolute-Center"><div id = "animition"><div id = "percent"> 30%</div><div id ="round-picture"></div></div><div id = "text" style="padding: 10px;"></div></div>';
				document.body.insertAdjacentHTML("beforeend", html);
				win = document.getElementById("process-window");
			}
			this.win = win;
			this.percent = document.getElementById("percent");
			this.text = document.getElementById("text");
			this.update = function (percent, text) {
				this.percent.innerText = percent;
				if (text) {
					this.text.innerText = text;
				}
				this.setVisible(true);
			};
			this.setVisible = function (bVisible) {
				this.win.style.display = bVisible ? "" : "none";
			};
			this.setVisible(false);
		}

//构建场景
		var viewer = new Cesium.Viewer('cesiumContainer',{
		    scene3DOnly:true,
		    baseLayerPicker:true,
		    navigationHelpButton:false,
		    imageryProviderViewModels:new createImageProviderViewModels(),
			terrainProviderViewModels:new createTerrainProviderViewModels(),
		    timeline:false,//控制时间线的显示与否
		    animation:true,//控制始终是否显示在左下角
			shouldAnimate : true //控制动画初始化时是否自动播放
		});
		window.viewer= viewer;
		viewer.scene.globe.depthTestAgainstTerrain = true;
		var scene = viewer.scene;

		
		
		
		
		
		
		
		//加载济南摄像头
		

		(function (){
			var cameraJN = Cesium.Transforms.eastNorthUpToFixedFrame(new Cesium.Cartesian3(-2327549.5490871724,4561772.413825485,3789063.8534280146));
			var cameralUrl="../data/model/camera/tileset.json";
			var tilesetInfo = new Cesium.Cesium3DTileset({
				url: cameralUrl,
				modelMatrix:cameraJN			
			});
			tilesetInfo.nodeId='40101';
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

			//加载shopcamera
			var shopJN= Cesium.Transforms.eastNorthUpToFixedFrame(new Cesium.Cartesian3(-2327549.5490871724,4561772.413825485,3789063.8534280146));
			var shoplUrl="../data/model/camera/tileset.json";
			var tilesetInfo1 = new Cesium.Cesium3DTileset({
				url: shoplUrl,
				modelMatrix:shopJN			
			});
			tilesetInfo1.nodeId='40102';
			viewer.scene.primitives.add(tilesetInfo1);
			tilesetInfo1.readyPromise.then(function(tileset) {
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
		})()
		

		//输出坐标
		/*viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
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
		}, Cesium.ScreenSpaceEventType.LEFT_CLICK);*/


		//var modelCamera = Cesium.Transforms.eastNorthUpToFixedFrame(
		//	Cesium.Cartesian3.fromDegrees(117.0457064313,36.6730601483,100000));
		//var model = scene.primitives.add(Cesium.Model.fromGltf({
		//	url : '../data/osgb/jnCamera/Camera.gltf',
		//	modelMatrix : modelCamera,
		//	scale : 1000,
		//	debugShowBoundingVolume:true,
		//	debugWireframe:true,
		//	minimumPixelSize:256
		//}))
		////viewer.trackedEntity = model;
		//viewer.camera.flyTo({
		//	destination : Cesium.Cartesian3.fromDegrees(117.0457064313,36.6730601483,100000)
		//});

		/*var modelCamera=viewer.entities.add({
			position:Cesium.Cartesian3.fromDegrees(117.0482771843,36.6807293777,1),
			model:{
				scale:1,
				uri: '../data/osgb/test/gltf/.gltf'
			}
		})*/
		var modelCamera1=viewer.entities.add({//a;117.2878975053,36.7206792940    b:117.0482771843 36.6807293777
			position:Cesium.Cartesian3.fromDegrees(117.0482771843,36.6807293777,25),
			point:{
				color:Cesium.Color.RED,
				pixelSize:10
			}
		})

		/*var tilesetInfo = new Cesium.Cesium3DTileset({
			url: "../data/model/camera/tileset.json"

		});
		viewer.scene.primitives.add(tilesetInfo);*/
		//var scene=viewer.scene;
		//加载gltf
		/*var modelMatrix1 = Cesium.Transforms.eastNorthUpToFixedFrame(
			Cesium.Cartesian3.fromDegrees(117.0321226103,36.6806047584,6.0));        //gltf数据加载位置
		var model1 = scene.primitives.add(Cesium.Model.fromGltf({
			url : '../data/model/camera/camera.gltf',        //如果为bgltf则为.bgltf
			modelMatrix : modelMatrix1,
			scale : 3.0     //放大倍数
		}));*/
		//window.modelCamera = modelCamera;
		//viewer.trackedEntity=modelCamera;

		/*//bydk

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


		viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(movement) {
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
*/
		/*viewer.scene.camera.setView({
			destination:  Cesium.Cartesian3.fromDegrees(116.3166614546,39.9788078778,5113),
			orientation: {
				heading: 6
			}
		});*/



		//效率调试
		scene.debugShowFramesPerSecond = false;

		//添加标记
		var googleAnoImagery = new Cesium.UrlTemplateImageryProvider({
			url: CONFIG.Google_RasterAnoUrl_lOCAL,
		});
		var bjImage= new Cesium.ImageryLayer(googleAnoImagery,{show:true});
		viewer.imageryLayers.add(bjImage);

		//加载场景
		loadJs(['../resources/private/js/3d/loadScene.js','../resources/private/js/3d/controlScene.js','../resources/private/js/3d/realtimeLabel.js'],"Scene_script",function(){
			initScene(viewer);
			ControlScene(viewer);
		})
 

		function flyToViewPoint(position,direction,up){
			viewer.camera.flyTo({
			    destination :new Cesium.Cartesian3(position.x,position.y,position.z),
			    orientation : {
			        direction : new Cesium.Cartesian3(direction.x,direction.y,direction.z),
			        up : new Cesium.Cartesian3(up.x,up.y,up.z)
			    }
			});
		}

		var analysisTool=new BeyonAnalyser(viewer);

		var drawManager = new Cesium.DrawingManager(viewer, {
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            drawingControl: false,
            isOpen: false,
		});
		
		//创建一个进度条
		var processTool=new ProcessTool();

		//var visualManager=new VisualManager(viewer);


		//绑定360版本可推拽
        $('div.panel360').draggable({ containment: "#cesiumContainer" });
        $('#pop_close').click(function() {
            $('div.panel360').hide(100);
        });
        $('#pop_min').click(function() {
            $('div.panel360').hide(100);
            $('#laye_min').show();
        });
        $('.layui-layer-close').click(function(){
        	$('#laye_min').hide();
        });
        //最大化
        $('.layui-layer-max').click(function(){
        	$('#laye_min').hide();
        	$('div.panel360').show(10);
        });
		//toolbar
		$('span.cesium-geocoder-searchButton').attr('title','查询');
		$('button.cesium-home-button').last().after('<button id="measureLength" title="测距" class="cesium-button cesium-toolbar-button"></button>\
													<button id="measureArea" title="测面" class="cesium-button cesium-toolbar-button "></button>\
													<button id="measureHeight" title="测高" class="cesium-button cesium-toolbar-button"></button>\
													<button id="lineView" title="线通视分析" class="cesium-button cesium-toolbar-button"></button>\
													<button id="areaView" title="可视域分析" class="cesium-button cesium-toolbar-button"></button>\
													<button id="btn360" title="360度环视分析" class="cesium-button cesium-toolbar-button"></button>\
													<button title="地图清除" id="clearTool" class="cesium-button cesium-toolbar-button"></button>\
													<button title="事件提醒" id="messageRemind" class="cesium-button cesium-toolbar-button defaultMessages"></button>\
													');
		$('#measureLength').click(function(){
			drawManager.startDrawingDistance({})
		});
		$('#measureArea').click(function(){
			drawManager.startDrawingArea({})
		});
		$('#measureHeight').click(function(){
			drawManager.startDrawingHeight({})
		});
		$('#lineView').click(function(){
			analysisTool.addAnalysis(BEYONANALYSER_TYPE.VISIBILITY,{});
		});
		$('#areaView').click(function(){
			analysisTool.addAnalysis(BEYONANALYSER_TYPE.VISUALFIELD,{});
		});
		$('#clearTool').click(function(){
			analysisTool.removeAnalysis();
			drawManager.clearDraw();
		});
		$('#btn360').click(function() {
            $('div.panel360').show(10);
            
        });
		layui.config({
			base: '/webFrame/layui_exts/'
		}).extend({
			excel: 'excel'
		});



		//分析按钮
		$('#btnFenxi').click(function(){
			var lla={};
			lla.lon=Number($('#input_lon').val());
			lla.lat=Number($('#input_lat').val());
			//获取输入的视高
			var viewHeight=Number($('#input_lookHeight').val());
			//获取保存的取点高程+视高
			lla.height=viewHeight+Number($('#input_lookHeight').attr("position_height"));
			//lla.height=Number($('#input_lookHeight').val());

			var carPos=Cesium.Cartesian3.fromDegrees(lla.lon, lla.lat, lla.height);

			//环视间隔
			var headingInterval=Number($('#input_heading').val());
			//环视间隔
			var pitchErr=Number($('#input_pitch').val());
			
			analysisTool.addAnalysis(BEYONANALYSER_TYPE.POINTANALYSIS,{
				id:'360analysis',
				position:carPos,
				showLine:true,
				headingInterval:headingInterval,
				pitchErr:pitchErr,
				processTool:processTool,
				callback:function(){
					var effect =analysisTool.getAnalysisEffect("360analysis");

					//处理场景中entity，保留相交体
					for (let index = 0; index < viewer.dataSources.length; index++) {
						const dataSource = viewer.dataSources.get(index);
						if(dataSource.name!=="gugong.geojson") continue;
						var entities =dataSource.entities.values;
		
						for (var i = 0; i < entities.length;i++) {
							var entity = entities[i];
							if(!effect._intersects.includes(entity)){
								entity.show=false;
							}else{
								var name=entity.name||'';
								var info=
								'名称：'+name+
								'\n面积：'+entity.area.toFixed(2)+' 平方米';
		
								effect._labels.add({
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

					//遮挡建筑信息
					var jzDatas=[];
					for (let index = 0; index < effect._intersects.length; index++) {
						const entity = effect._intersects[index];
						var data={};
						data.id=jzDatas.length+1;
						data.name=entity.name||'';
						data.area=entity.area.toFixed(2);	
						data.entity=entity;					
						jzDatas.push(data);
					}
					let tbHeight = calTbHeight();
					console.log(tbHeight);
					//建筑信息
					layui.use('table', function() {
						let table = layui.table;
						table.render({
							width: '455px',
							toolbar:true,
							height:tbHeight,
        					defaultToolbar:['exports'],
							elem: '#tbBuildingsInfo',
							done:function(){
								//纠正高度，因为计算了toolbar的高度
								$('div[lay-id="tbBuildingsInfo"]').css('height',tbHeight-50+'px');
							},
							cellMinWidth: 1 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
								,
							cols: [
								[{
										field: 'id',
										title: '序号',
										type: 'numbers',
										width: 50
									},  {
										field: 'name',
										title: '遮挡建筑',
										width: 241
									}, {
										field: 'area',
										title: '面积(平方米)',
										width: 150
									}
		
								]
							],
							data: jzDatas,
							page:false,
							limit:9999999999999999999999
							/*page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
					          layout: [  'prev', 'page', 'next', 'skip','count'] //自定义分页布局
					          //,curr: 5 //设定初始在第 5 页
					          ,groups: 2 //只显示 1 个连续页码
					          ,first: 1 //不显示首页
					          ,last: Math.ceil(jzDatas.length/10) //不显示尾页
					          
					        }*/
						});
						table.on('row(building-evt)', function(data) {
							//console.log(data)
							if(data.data.entity){
								//entity 没有position  track没有用
								//viewer.trackedEntity=data.data.entity;
								viewer.zoomTo(data.data.entity);
							}
						});
					})

					

					//遮蔽点信息
					var points=[];
					for (let index = 0; index < effect._intersects.length; index++) {
						const rs = effect.rePort[index];
						var data={};
						data.id=points.length+1;
						data.heading=rs["视角"]
						data.distance=rs["水平距离"];	
						data.pitch=rs["最大遮挡角"];	
						data.lon=rs["遮挡点经度"];	
						data.lat=rs["遮挡点纬度"];	
						data.height=rs["遮挡点高度"];					
						points.push(data);
					}
					layui.use('table', function() {
						let table = layui.table;
						table.render({
							width: '455px',
							toolbar:true,
							height:tbHeight,
        					defaultToolbar:['exports'],
							elem: '#tbHidePointsInfo',
							done:function(){
								//纠正高度，因为计算了toolbar的高度
								$('div[lay-id="tbHidePointsInfo"]').css('height',tbHeight-50+'px');
							},
							cellMinWidth: 1 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
								,
							cols: [
								[{
										field: 'id',title: '序号',type: 'numbers',width: 50
									},  {
										field: 'heading',title: '视角(正北为0度)',align: 'center',width:140
										//width: 100
									}, {
										field: 'distance',title: '水平距离',width:140,align: 'center'
									}, {
										field: 'pitch',title: '最大遮蔽角',width:140,align: 'center'
									}, {
										field: 'lon',title: '经度',width:140,align: 'center'
									}, {
										field: 'lat',title: '纬度',width:140,align: 'center'
									}, {
										field: 'height',title: '高程',align: 'center',width:140
									}
		
								]
							],
							data: points,
							page:false,
							limit:9999999999999999999999
							// page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
					  //         layout: [  'prev', 'page', 'next', 'skip','count'] //自定义分页布局
					  //         //,curr: 5 //设定初始在第 5 页
					  //         ,groups: 2 //只显示 1 个连续页码
					  //         ,first: 1 //不显示首页
					  //         ,last: Math.ceil(points.length/10) //不显示尾页
					          
					  //       }
						});
						// table.on('row(building-evt)', function(data) {
						// 	console.log(data)
							
						// 		//获取选中行的data
						// 	console.log(data.data);
						// })
					})
				}
			});


		});
		var marker=undefined;
		//清除按钮
		$('#btnClear').click(function(){
			analysisTool.removeAnalysis("360analysis");	
			marker&&viewer.entities.remove(marker);
		});

		//地图选点
		$('#toLocation').click(function(){
			analysisTool.pickMap(function(position){
				$('#input_lon').val(position.lon);
				$('#input_lat').val(position.lat);
				$("#input_lookHeight").attr("position_height",position.height);

				var carPos=Cesium.Cartesian3.fromDegrees(position.lon, position.lat, position.height);
				if(marker){
					marker.position=carPos
				}else{
					marker=viewer.entities.add({
						position:carPos,
						id:"marker",
						billboard:{
							image:window.XYDCONFIG.PROJECT_URL+"/webvis-gg/resources/common/images/marker.png",
							heightReference:Cesium.HeightReference.CLAMP_TO_GROUND,                
						}
					})
				}
				
				//$('#input_height').val(position.height);
			})
		});
		
	}
})(jQuery);

var xydWebFunction;
(function(b, c) {
	b(window).ready(function() {
		function e() {
			var a = b("#head-nav-box");
			_l = a.find(".nav-left-box");
			_c = a.find(".nav-center-box");
			_r = a.find(".nav-right-box");
			a = a.outerWidth() - _l.outerWidth() - _r.outerWidth();
			_c.css({
				width: a - 35 + "px",
				"margin-left": _l.outerWidth() + "px"
			})
		}
		c = {
			fn: {},
			module: {}
		};
		var f = b("#xyd-header,#xyd-bottom"),
			d;
		for(d in XYDCONFIG) f.find("[data-input-name\x3d'" + d + "']").html(XYDCONFIG[d]);
		c.fn.setPageContentHeight = function() {
			var a = b("body"),
				c = window.pageObject.getLocalStorage();
			//更换皮肤
			a.addClass(c["x-skin"] || "skin-blue").addClass(c["xyd-model"] || "");
			var a = b("#xyd-panel-content-line"),
				c = b("#xyd-header"),
				e = b("#xyd-bottom"),
				d = b("#xyd-right-header"),
				g = b("#xyd-right-content"),
				f = b("#xyd-right-content-element"),
				h = b("#panel-left");
			a.outerHeight();
			c.outerHeight();
			d.outerHeight();
			e.outerHeight();
			h.css({
				height: a.outerHeight() - c.outerHeight() + "px"
			});
			d.css({
				width: a.outerWidth() - h.outerWidth() + "px"
			});
			g.css({
				width: a.outerWidth() - h.outerWidth() + "px",
				height: a.outerHeight() - c.outerHeight() - d.outerHeight() - e.outerHeight() - 1 + "px",
				"margin-top": "1px"
			});
			f.css({
				width: g.outerWidth() - 40 + "px",
				height: g.outerHeight() - 40 + "px"
			})
		};
		b(window).resize(function() {
			c.fn.setPageContentHeight();
			e()
		});
		c.fn.getTreeCheckedNodes = function(a) {
			return b.fn.zTree.getZTreeObj(a).getCheckedNodes(!0)
		};
		c.fn.getTreeSelectedNodes = function(a) {
			return b.fn.zTree.getZTreeObj(a).getSelectedNodes()
		};
		c.module.bindButton1 = function() {
			b(document).on("click", ".button_on", function(a) {
				a = b(this).attr("data-state");
				b(this).css("left");
				"undefined" !== a && "1" == a ? (a = "-60", b(this).attr("data-state", "0")) : (a = "0", b(this).attr("data-state", "1"));
				b(this).animate({
					left: a + "px"
				})
			})
		};
		c.module.init = function() {
			c.fn.setPageContentHeight();
			e()
		};
		c.module.init();
		b("#shrinkage-box").on("click", function() {
			var a = b("body"),
				d = window.pageObject.getLocalStorage();
			a.hasClass("model-simple") ? (a.removeClass("model-simple"), delete d["xyd-model"]) : (a.addClass("model-simple"), d["xyd-model"] = "model-simple");
			window.pageObject.setLocalStorage(d);
			c.fn.setPageContentHeight();
			e()
		})
	})
})(jQuery, xydWebFunction);