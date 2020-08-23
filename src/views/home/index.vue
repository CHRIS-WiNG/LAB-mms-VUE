<template>
  <div
    class="home"
    v-loading="loading"
    element-loading-text="拼命加载ing，模型较大，请稍等..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
  >
    <div id="cesiumContainer"></div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      loading: true,
    };
  },
  mounted() {
    // Cesium token
    Cesium.Ion.defaultAccessToken ='你的cesium token';
    // tdt token
    var token = '如果开启在线地图请注册天地图token';
    // 服务域名
    var tdtUrl = 'https://t{s}.tianditu.gov.cn/';
    // 服务负载子域
    var subdomains = ['0', '1', '2', '3', '4', '5', '6', '7'];

    // cesium 初始化
    var viewer = new Cesium.Map('cesiumContainer', {
      selectionIndicator: false,
      baseLayerPicker: false, //是否显示图层选择控件
      geocoder: true, //是否显示地名查找控件
      timeline: false, //是否显示时间线控件
      homeButton: true, // 主页按钮
      navigationHelpButton: false, //是否显示帮助信息控件
      infoBox: false, //是否显示点击要素之后显示的信息
    });
    // shouldAnimate: true,
    // animation: false, //是否显示动画控件
    // 抗锯齿
    viewer.scene.postProcessStages.fxaa.enabled = false;
    // 水雾特效
    viewer.scene.globe.showGroundAtmosphere = true;
    // 设置最大俯仰角，[-90,0]区间内，默认为-30，单位弧度
    viewer.scene.screenSpaceCameraController.constrainedPitch = Cesium.Math.toRadians(-20);
    // 取消默认的双击事件
    viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    // 去除左下角logo
    viewer._cesiumWidget._creditContainer.style.display = 'none';

    // 叠加影像服务
    var imgMap = new Cesium.UrlTemplateImageryProvider({
      url: tdtUrl + 'DataServer?T=img_w&x={x}&y={y}&l={z}&tk=' + token,
      subdomains: subdomains,
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      maximumLevel: 18,
    });
    viewer.imageryLayers.addImageryProvider(imgMap);

    // 叠加国界服务
    var iboMap = new Cesium.UrlTemplateImageryProvider({
      url: tdtUrl + 'DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=' + token,
      subdomains: subdomains,
      tilingScheme: new Cesium.WebMercatorTilingScheme(),
      maximumLevel: 10,
    });
    viewer.imageryLayers.addImageryProvider(iboMap);

    // 叠加地形服务
    var terrainUrls = new Array();
    for (var i = 0; i < subdomains.length; i++) {
      var url = tdtUrl.replace('{s}', subdomains[i]) + 'DataServer?T=elv_c&tk=' + token;
      terrainUrls.push(url);
    }
    var provider = new Cesium.GeoTerrainProvider({
      urls: terrainUrls,
    });
    viewer.terrainProvider = provider;

    // 模型数据
    var cartesian = Cesium.Cartesian3.fromDegrees(116.3004, 39.9904555911788, 20);

    var heading = Cesium.Math.toRadians(92);
    var pitch = Cesium.Math.toRadians(0);
    var roll = Cesium.Math.toRadians(0);
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
    var orientation = Cesium.Transforms.headingPitchRollQuaternion(cartesian, hpr);

    var m4 = Cesium.Matrix4.fromRotationTranslation(Cesium.Matrix3.fromQuaternion(orientation), cartesian);
    var result = Cesium.Matrix4.multiplyByPoint(m4, new Cesium.Cartesian3(0, 0, 0), new Cesium.Cartesian3());

    // self.position = result;
    // var entity = viewer.entities.add({
    //   position: result,
    //   orientation: orientation,
    //   clampToGround: true, //开启贴地
    //   model: {
    //     uri: '模型uri',
    //     scale: 27.5,
    //   },
    //   complete: this.closeLoading()
    // });

    // // 相机位置与视角
    // var cartesian_camera = Cesium.Cartesian3.fromDegrees(116.3034, 39.9918555911788, 350);
    // viewer.camera.flyTo({
    //   destination: cartesian_camera,
    //   orientation: {
    //     heading: Cesium.Math.toRadians(-120),
    //     pitch: Cesium.Math.toRadians(-45),
    //     roll: Cesium.Math.toRadians(0),
    //   },
    //   complete: function callback() {
    //     // 定位完成之后的回调函数
    //   },
    // });

    // 将三维球定位到中国
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
      orientation: {
        heading: Cesium.Math.toRadians(348.4202942851978),
        pitch: Cesium.Math.toRadians(-89.74026687972041),
        roll: Cesium.Math.toRadians(0),
      },
      complete: function callback() {
        // 定位完成之后的回调函数
      },
    });

    // homeButton按钮
    viewer.homeButton.viewModel.command.beforeExecute.addEventListener(function(e) {
      e.cancel = true;
      //你要飞的位置
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(103.84, 31.15, 17850000),
        orientation: {
          heading: Cesium.Math.toRadians(348.4202942851978),
          pitch: Cesium.Math.toRadians(-89.74026687972041),
          roll: Cesium.Math.toRadians(0),
        },
      });
    });

    let geocoder = viewer.geocoder.viewModel;
    geocoder._searchCommand = Cesium.createCommand(() => {
      if (geocoder.isSearchInProgress) {
        // 查询进行中，取消执行查询
        this.cancelGeoCode(geocoder);
      } else {
        // 执行查询
        this.geocode(geocoder);
        console.log('geocoder', geocoder);
      }
    });

    // 叠加三维地名服务
    var wtfs = new Cesium.GeoWTFS({
      viewer,
      //三维地名服务，使用wtfs服务
      subdomains: subdomains,
      metadata: {
        boundBox: {
          minX: -180,
          minY: -90,
          maxX: 180,
          maxY: 90,
        },
        minLevel: 1,
        maxLevel: 20,
      },
      aotuCollide: true,
      //是否开启避让
      collisionPadding: [5, 10, 8, 5],
      //开启避让时，标注碰撞增加内边距，上、右、下、左
      serverFirstStyle: true,
      //服务端样式优先
      labelGraphics: {
        font: '28px sans-serif',
        fontSize: 28,
        fillColor: Cesium.Color.WHITE,
        scale: 0.5,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 5,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        showBackground: false,
        backgroundColor: Cesium.Color.RED,
        backgroundPadding: new Cesium.Cartesian2(10, 10),
        horizontalOrigin: Cesium.HorizontalOrigin.MIDDLE,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        eyeOffset: Cesium.Cartesian3.ZERO,
        pixelOffset: new Cesium.Cartesian2(0, 8),
      },
      billboardGraphics: {
        horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        verticalOrigin: Cesium.VerticalOrigin.CENTER,
        eyeOffset: Cesium.Cartesian3.ZERO,
        pixelOffset: Cesium.Cartesian2.ZERO,
        alignedAxis: Cesium.Cartesian3.ZERO,
        color: Cesium.Color.WHITE,
        rotation: 0,
        scale: 1,
        width: 18,
        height: 18,
      },
    });

    //三维地名服务，使用wtfs服务
    wtfs.getTileUrl = function() {
      return tdtUrl + 'mapservice/GetTiles?lxys={z},{x},{y}&tk=' + token;
    };

    wtfs.getIcoUrl = function() {
      return tdtUrl + 'mapservice/GetIcon?id={id}&tk=' + token;
    };

    wtfs.initTDT([
      {
        x: 6,
        y: 1,
        level: 2,
        boundBox: {
          minX: 90,
          minY: 0,
          maxX: 135,
          maxY: 45,
        },
      },
      {
        x: 7,
        y: 1,
        level: 2,
        boundBox: {
          minX: 135,
          minY: 0,
          maxX: 180,
          maxY: 45,
        },
      },
      {
        x: 6,
        y: 0,
        level: 2,
        boundBox: {
          minX: 90,
          minY: 45,
          maxX: 135,
          maxY: 90,
        },
      },
      {
        x: 7,
        y: 0,
        level: 2,
        boundBox: {
          minX: 135,
          minY: 45,
          maxX: 180,
          maxY: 90,
        },
      },
      {
        x: 5,
        y: 1,
        level: 2,
        boundBox: {
          minX: 45,
          minY: 0,
          maxX: 90,
          maxY: 45,
        },
      },
      {
        x: 4,
        y: 1,
        level: 2,
        boundBox: {
          minX: 0,
          minY: 0,
          maxX: 45,
          maxY: 45,
        },
      },
      {
        x: 5,
        y: 0,
        level: 2,
        boundBox: {
          minX: 45,
          minY: 45,
          maxX: 90,
          maxY: 90,
        },
      },
      {
        x: 4,
        y: 0,
        level: 2,
        boundBox: {
          minX: 0,
          minY: 45,
          maxX: 45,
          maxY: 90,
        },
      },
      {
        x: 6,
        y: 2,
        level: 2,
        boundBox: {
          minX: 90,
          minY: -45,
          maxX: 135,
          maxY: 0,
        },
      },
      {
        x: 6,
        y: 3,
        level: 2,
        boundBox: {
          minX: 90,
          minY: -90,
          maxX: 135,
          maxY: -45,
        },
      },
      {
        x: 7,
        y: 2,
        level: 2,
        boundBox: {
          minX: 135,
          minY: -45,
          maxX: 180,
          maxY: 0,
        },
      },
      {
        x: 5,
        y: 2,
        level: 2,
        boundBox: {
          minX: 45,
          minY: -45,
          maxX: 90,
          maxY: 0,
        },
      },
      {
        x: 4,
        y: 2,
        level: 2,
        boundBox: {
          minX: 0,
          minY: -45,
          maxX: 45,
          maxY: 0,
        },
      },
      {
        x: 3,
        y: 1,
        level: 2,
        boundBox: {
          minX: -45,
          minY: 0,
          maxX: 0,
          maxY: 45,
        },
      },
      {
        x: 3,
        y: 0,
        level: 2,
        boundBox: {
          minX: -45,
          minY: 45,
          maxX: 0,
          maxY: 90,
        },
      },
      {
        x: 2,
        y: 0,
        level: 2,
        boundBox: {
          minX: -90,
          minY: 45,
          maxX: -45,
          maxY: 90,
        },
      },
      {
        x: 0,
        y: 1,
        level: 2,
        boundBox: {
          minX: -180,
          minY: 0,
          maxX: -135,
          maxY: 45,
        },
      },
      {
        x: 1,
        y: 0,
        level: 2,
        boundBox: {
          minX: -135,
          minY: 45,
          maxX: -90,
          maxY: 90,
        },
      },
      {
        x: 0,
        y: 0,
        level: 2,
        boundBox: {
          minX: -180,
          minY: 45,
          maxX: -135,
          maxY: 90,
        },
      },
    ]);
  },
  methods: {
    closeLoading() {
      setTimeout(() => {
        this.loading = false;
      }, 5000);
    },
    // geocoder相关
    cancelGeocode(viewModel) {
      viewModel._isSearchInProgress = false;
      if (Cesium.defined(viewModel._geocodeInProgress)) {
        viewModel._geocodeInProgress.cancel = true;
        viewModel._geocodeInProgress = undefined;
      }
      this.remove(viewModel);
    },
    geocode(viewModel) {
      let query = viewModel.searchText;
      if (/^\s*$/.test(query)) {
        //whitespace string
        return;
      }
      let splitQuery = query.match(/[^\s,\n]+/g),
        height = 300;
      if (splitQuery.length === 2 || splitQuery.length === 3) {
        let longitude = +splitQuery[0],
          latitude = +splitQuery[1];
        let obj = transform.gcj_decrypt_exact(latitude, longitude);
        height = splitQuery.length === 3 ? +splitQuery[2] : 300.0;

        if (!isNaN(longitude) && !isNaN(latitude) && !isNaN(height)) {
          this.updateCamera(viewModel, Cesium.Cartesian3.fromDegrees(obj.lon, obj.lat, height));
          return;
        }
      }
      viewModel._isSearchInProgress = true;
      // key 需要自行申请
      // 高德 POI接口
      var key = 'key 需要自行申请';
      var url = `https://restapi.amap.com/v3/place/text?keywords=${query}&output=xml&offset=20&page=1&key=${key}&extensions=all`;

      var promise = axios.get(url);
      let vm = this;
      var geocodeInProgress = (viewModel._geocodeInProgress = Cesium.when(
        promise,
        (result) => {
          if (geocodeInProgress.cancel) {
            return;
          }
          viewModel._isSearchInProgress = false;

          if (result.data.pois.length === 0 || result.data.count === 0) {
            viewModel.searchText = viewModel._searchText + ' 无相关数据';
            return;
          }
          vm.remove(viewModel); //移除上一结果
          var obj,
            pois = result.data.pois;
          viewModel.suggestions.removeAll(); //移除搜索建议结果
          for (var i = 0; i < pois.length; i++) {
            var resource = pois[i];

            var location = resource.location.split(',');
            // 高德火星坐标经纬度转 wgs84坐标
            obj = transform.gcj_decrypt_exact(location[1] * 1, location[0] * 1);

            let position = Cesium.Cartesian3.fromDegrees(obj.lon, obj.lat);
            var entity = {
              id: resource.name + i,
              position,
              point: {
                show: true, // default
                color: Cesium.Color.SKYBLUE, // default: WHITE
                pixelSize: 10, // default: 1
                outlineColor: Cesium.Color.YELLOW, // default: BLACK
                outlineWidth: 3, // default: 0
              },
            };
            //新增搜索建议结果
            viewModel.suggestions.push({
              displayName: resource.name,
              destination: position,
            });

            entity.description = new Cesium.ConstantProperty(resource.name);

            viewModel.entities.push(entity);
            this.viewer.entities.add(entity);

            if (i === 0) {
              viewModel._searchText = resource.name;
              this.updateCamera(viewModel, Cesium.Cartesian3.fromDegrees(obj.lon, obj.lat, height));
            }
          }
        },
        () => {
          if (geocodeInProgress.cancel) {
            return;
          }
          viewModel._isSearchInProgress = false;
          viewModel.searchText = viewModel._searchText + ' (错误)';
        }
      ));
    },
  },
};
</script>
<style scoped>
.home {
  width: 100%;
  height: 100%;
}
#cesiumContainer {
  width: 100%;
  height: 100%;
}
</style>
