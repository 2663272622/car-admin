<!-- 订单列表 -->
<template>
  <div class="app-container">
    <div class="search-bar">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" prop="keywords">
          <el-input
            placeholder="字典名称/编码"
            clearable
          />
            <!-- @keyup.enter="handleQuery" -->
        </el-form-item>
        <el-form-item label="查询时间范围" prop="createTime"> 
          <el-date-picker
            v-model="datePicker"
            type="datetimerange" 
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format ="YYYY-MM-DD HH:mm:ss" 
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="search" @click="handleQuery">搜索</el-button>
          <el-button icon="refresh" @click="handleResetQuery">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <el-card shadow="never">
      <el-row :gutter="12">
        <el-col :span="6" class="order-item" v-for="(item,index ) of tableList" :key="index">
          <orderItem :item="item"></orderItem>
        </el-col> 
      </el-row>
    </el-card>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Orderls",
  inherititems: false,
}); 
import router from "@/router";
import { reactive } from "vue";
import orderItem from '@views/order/orderls/orderItem.vue'
import ordersAPI,{QueryParams} from "@/api/system/client/orders";
const datePicker = ref([])
const queryParams:QueryParams = reactive({
  tenantId:'1',
  pageNum: 1,
  pageSize: 10,
  keywords: '',
})
const tableList = ref([])
const total = ref(0)
const loading = ref(false)
// 修改查询函数，确保在查询时使用正确的分页参数
function handleQuery() {
  loading.value = true;
  let [ startTime = '', endTime = '' ] = datePicker.value;
  let params = {
    ...queryParams,
    pageNum: queryParams.pageNum,
    pageSize: queryParams.pageSize
  } 
  startTime && (params.startTime = startTime);
  endTime && (params.endTime = endTime);
  console.log(params)
  
  ordersAPI.getPage(params).then((data:any) => {
    tableList.value = data.list;
    total.value = data.total;
    loading.value = false;
  });
}
handleQuery()


const queryFormRef = ref(ElForm);
// 重置查询条件
function handleResetQuery() {
  datePicker.value = []; 
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1; // 重置页码到第一页
  handleQuery();
}
</script>

<style lang="scss">
  .order-item{
    margin-bottom: 12px;
    .order-card{
      --el-card-padding:0
    }
  }
</style>
