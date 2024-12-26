<template>
   <el-card body-class="order-card" shadow="hover">
    {{ props.item }}
      <div 
        class="order-item-title"
        :style="{background:COLORS.finish}"
      >
      <div class="order-item-title-left">
        <el-image
          style="width: 22px; height: 22px"
          src="https://www.duooo.net/static/upload/image/20220913/1663065870201615.jpg"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :initial-index="4"
          fit="cover"
        />
        <span style="color: #fff;">name</span>
      </div>

        <div class="title-text">status</div>
      </div>
      <div class="order-item-content">
           <div>订单城市：{{ props.item.city }}</div>
           <div>订单时间：{{ props.item.create_time }}</div>
           <div>订单金额：{{ props.item.total_price }}</div>
           
      </div>
    </el-card>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';
const props = defineProps({
  item:{
    type: Object,
  }
})
const COLORS = reactive({
  // 完成
  finish:`linear-gradient(40deg, rgb(38, 38, 38), rgb(91, 91, 91))`,
  // 退款
  refund:`linear-gradient(40deg, rgb(202, 202, 202), rgb(177, 177, 177))`,
})

</script>

<style lang="scss" scoped>

.order-card{
  width: 100%;
  .order-item-title{
    height: 28px; 
    display: flex;
    justify-content: space-between;
    align-self: center;
    align-items: center;
    padding: 5px 12px;
    .order-item-title-left{
      display: flex;
      align-items: center;
    }
  }
  .order-item-content{
    height: 100px;
    background-color: #fff;
  }
}
</style>
