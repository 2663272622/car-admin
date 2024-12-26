<!-- 分页功能 -->
<template>
  <div class="m-2">
    <el-pagination
      :pager-count="9"
      v-model:current-page="currentPage"
      v-model:page-size="pageSize"
      :page-sizes="[10, 20, 30, 50]"
      :total="props.total"
      background
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  total: {
    type: Number,
    default: 0
  },
  pageNo: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
});

const emit = defineEmits(['update:pageNo', 'update:pageSize']);

// 定义响应式变量
const currentPage = ref(props.pageNo);
const pageSize = ref(props.pageSize);

// 处理页码变化
const handleCurrentChange = (val: number) => {
  currentPage.value = val;
  emit('update:pageNo', val);
};

// 处理每页条数变化
const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1; // 切换每页条数时重置为第一页
  emit('update:pageSize', val);
  emit('update:pageNo', 1); // 同时发出页码重置信号
};

// 监听props变化更新本地状态
watch(
  () => props.pageNo,
  (newVal) => {
    if (newVal !== currentPage.value) {
      currentPage.value = newVal;
    }
  }
);

watch(
  () => props.pageSize,
  (newVal) => {
    if (newVal !== pageSize.value) {
      pageSize.value = newVal;
    }
  }
);
</script>

<style scoped lang="scss">

</style>
