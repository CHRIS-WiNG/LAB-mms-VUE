import Vue from "vue";
import VueRouter from "vue-router";
// 默认导入目录下的 index.vue 文件，等价于 ../views/login/index.vue
import Login from "../views/login";
import Layout from "@/components/Layout.vue";
import Home from "@/views/home";
import Student from "@/views/student";
import Teacher from "@/views/teacher";
import Team from "@/views/team";
import Account from "@/views/account";
import Clockin from "@/views/clockin";
import Diary from "@/views/diary";

Vue.use(VueRouter);

const routes = [
  {
    // 登录路由
    path: "/login",
    name: "login", // 路由名称
    component: Login // 组件对象
  },
  {
    // 布局路由
    path: "/",
    name: "layout", // 路由名称
    component: Layout, // 组件对象
    // 自动重定向到欢迎首页home
    redirect: "/home",
    children: [
      {
        path: "/home",
        component: Home,
        meta: { title: "首页" }
      }
    ]
  },
  // 等同于在Layout中添加children路由Student
  {
    path: "/student",
    component: Layout,
    children: [
      {
        path: "/",
        component: Student,
        meta: { title: "学生管理" }
      }
    ]
  },
  {
    path: "/team",
    component: Layout,
    children: [
      {
        path: "/",
        component: Team,
        meta: { title: "组别管理" }
      }
    ]
  },
  {
    path: "/teacher",
    component: Layout,
    children: [
      {
        path: "/",
        component: Teacher,
        meta: { title: "教师管理" }
      }
    ]
  },
  {
    path: "/account",
    component: Layout,
    children: [
      {
        path: "/",
        component: Account,
        meta: { title: "账户管理" }
      }
    ]
  },
  {
    path: "/clockin",
    component: Layout,
    children: [
      {
        path: "/",
        component: Clockin,
        meta: { title: "每日打卡" }
      }
    ]
  },
  {
    path: "/diary",
    component: Layout,
    children: [
      {
        path: "/",
        component: Diary,
        meta: { title: "日报汇总" }
      }
    ]
  },
];

const router = new VueRouter({
  routes
});

export default router;

// 取消重复点击某个路由控制台报错的提醒
const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
