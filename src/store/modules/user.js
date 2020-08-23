import {
  getToken,
  setToken,
  setUser,
  getUser,
  removeToken
} from "@/utils/auth";
import { login, getUserInfo, logout } from "@/api/login";

const user = {
  state: {
    token: getToken(), // 从localStorage中获取 token，作为token的初始值，解决刷新为null
    user: getUser() //
  },

  mutations: {
    SET_TOKEN(state, token) {
      state.token = token;
      setToken(token); // 将token保存到localStorage中
    },

    SET_USER(state, user) {
      state.user = user;
      setUser(user);
    }
  },

  actions: {
    // actions中的方法一般首字母大写
    Login({ commit }, form) {
      // api中的axios方法返回的也是promise对象
      return new Promise((resolve, reject) => {
        login(form.username.trim(), form.password)
          .then(response => {
            const resp = response.data;
            commit("SET_TOKEN", resp.data.token);
            // 通知组件已经将token更新成功，成功之后的触发
            resolve(resp);
          })
          .catch(error => {
            // 更新失败，出现异常
            reject(error);
          });
      });
    },
    // 通过 token 获取用户信息 state不能放大括号外面，放外面是接收触发actions时传入的参数
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token)
          .then(response => {
            const resp = response.data;
            commit("SET_USER", resp.data);
            resolve(resp);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 退出
    Logout({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token)
          .then(response => {
            const resp = response.data;
            commit("SET_TOKEN", null);
            commit("SET_USER", null);
            removeToken();
            resolve(resp);
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
};

export default user;
