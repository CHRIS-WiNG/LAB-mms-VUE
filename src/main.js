import Vue from "vue";
import ElementUI from "element-ui"; // 组件库
import "element-ui/lib/theme-chalk/index.css"; // 样式
import App from "./App.vue";
import router from "./router";
// 权限拦截，全局的
import "./permission";
import store from "./store";
import Cesium from 'cesium/Cesium' //from 中 cesium 指向的是vue.config.js中 alias对象中的别名
// noinspection ES6UnusedImports
import widget from 'cesium/Widgets/widgets.css'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 使用饿了么UI
Vue.use(ElementUI);
Vue.use(mavonEditor)

Vue.config.productionTip = false;
// console.log(process.env.VUE_APP_BASE_API);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");