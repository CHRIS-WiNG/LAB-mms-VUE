<template>
  <div class="navbar">
    <!-- :router="true" 表示开启路由模式，开启后index的值代表路由地址 -->
    <el-menu
      :router="true"
      default-active="/"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item index="/">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <el-menu-item index="/clockin/">
        <i class="el-icon-date"></i>
        <span slot="title">每日打卡</span>
      </el-menu-item>
      <el-menu-item index="/diary/">
        <i class="el-icon-document"></i>
        <span slot="title">日报汇总</span>
      </el-menu-item>
      <el-menu-item
        index="/student/"
        v-if="this.$store.state.user.user.permission === 1 || this.$store.state.user.user.identity === 2"
      >
        <i class="el-icon-user"></i>
        <span slot="title">学生管理</span>
      </el-menu-item>
      <el-menu-item
        index="/teacher/"
        v-if="this.$store.state.user.user.permission === 1 || this.$store.state.user.user.identity === 2"
      >
        <i class="el-icon-user-solid"></i>
        <span slot="title">教师管理</span>
      </el-menu-item>
      <el-menu-item
        index="/team/"
        v-if="this.$store.state.user.user.permission === 1 || this.$store.state.user.user.identity === 2"
      >
        <i class="el-icon-office-building"></i>
        <span slot="title">组别管理</span>
      </el-menu-item>
      <el-menu-item index="/account/" v-if="this.$store.state.user.user.permission === 1">
        <i class="el-icon-setting"></i>
        <span slot="title">账户管理</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },

  components: {},

  methods: {},
};
</script>

<style scoped>
.el-menu {
  border-right: none;
}
</style>
