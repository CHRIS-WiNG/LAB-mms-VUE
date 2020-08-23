/**
 * 权限校验
 *  Vue Router中的 前置钩子函数 beforeEach(to, from, next)
 *  当路由进行跳转之前，进行判断 是否已经登录过， 如果登录过允许访问非登录页面，否则回到登录页
 */

import router from "./router";
import store from "@/store";

router.beforeEach((to, from, next) => {
  // 1. 获取token
  // const token = localStorage.getItem('wzb-msm-token');
  const token = store.state.user.token;
  // 1.1如果未获取到token
  if (!token) {
    // 要访问非登录页，则不让访问，回到登录页 /login
    if (to.path != "/login") {
      next({ path: "/login" });
    } else {
      // 请求登录页面 /login
      next();
    }
  } else {
    // 1.2 如果获取到了 token
    // 1.2.1 请求路由 /login，不让它去
    if (to.path == "/login") {
      next({ path: "/home" });
    } else {
      // 1.2.2 请求路由非登录页面，现在本地查看是否有用户信息
      // const userInfo = localStorage.getItem('wzb-msm-user');
      const userInfo = store.state.user.user;
      if (userInfo) {
        next();
      } else {
        // 如果本地没有用户信息就通过token去获取用户信息，如果获取到用户信息，则进入非登录页面
        store
          .dispatch("GetUserInfo")
          .then(response => {
            if (response.flag) {
              next();
            } else {
              next({ path: "/login" });
            }
          })
          .catch();
      }
    }
  }
});
