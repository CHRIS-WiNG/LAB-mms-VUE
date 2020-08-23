<template>
  <div class="main">
    <!-- 注意：link不能使用，因为它是内置的标签，可以通过加前缀来替代 -->
    <!-- v-show加载AppMain中，可以在home的情况下减少一层的判断，加快速度 -->
    <app-link v-show="$route.path != '/home'"></app-link>
    <router-view></router-view>
  </div>
</template>

<script>
import AppLink from "./Link.vue";
export default {
  data() {
    return {};
  },

  components: { AppLink },

  methods: {}
};
</script>

<style scoped>
.link,
.clockin,
.teacher,
.student,
.account,
.diary,
.team {
  padding: 10px;
}
</style>
