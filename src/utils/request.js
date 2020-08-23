import axios from "axios";
import { Loading } from "element-ui";
import { Message } from "element-ui";
import store from "@/store";

const loading = {
  loadingInstance: null, // loading实例

  // 打开加载
  open: function() {
    // 创建实例，而且会打开加载窗口
    if (this.loadingInstance === null) {
      // 创建单例加载实例
      this.loadingInstance = Loading.service({
        target: ".main",
        background: "rgba(0, 0, 0, 0.4)",
        text: "拼命加载中",
        spinner: "el-icon-loading"
      });
    }
  },

  // 关闭加载
  close: function() {
    if (this.loadingInstance != null) {
      this.loadingInstance.close();
      this.loadingInstance = null;
    }
  }
};

const request = axios.create({
  // baseURL: '/',
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000 // 请求超时
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 打开加载窗口
    loading.open();
    // 在请求头携带token
    const token = store.state.user.token;
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  error => {
    // 出现异常
    loading.close();
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  response => {
    // 关闭加载窗口
    loading.close();

    const resp = response.data;
    // 后台正常响应的状态，如果不是2000，则说明后台处理有问题
    if (resp.code != 2000) {
      Message({
        message: resp.message,
        type: "warning",
        duration: 5 * 1000
      });
    }
    return response;
  },
  error => {
    // 出现异常
    loading.close();
    console.log("Axios出现异常：", error);
    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000
    });
    return Promise.reject(error);
  }
);

export default request;
