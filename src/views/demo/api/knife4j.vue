<!-- 接口文档 -->
<template>
  <div class="app-container">
    <iframe :src="BASE_URL + '/doc.html'" width="100%" height="100%" frameborder="0" />
  </div>
</template>

<script lang="ts" setup>
import { BASE_URL } from '@/utils/const'
</script>
<style lang="scss" scoped>
/** 关闭tag标签  */
.app-container {
  /* 50px = navbar = 50px */
  height: calc(100vh - 50px);
}

/** 开启tag标签  */
.hasTagsView {
  .app-container {
    /* 84px = navbar + tags-view = 50px + 34px */
    height: calc(100vh - 84px);
  }
}
</style>
