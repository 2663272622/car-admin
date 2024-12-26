
<template> 
  <el-cascader 
    v-model="modelValue"
    clearable 
    :options="deptList" 
    :props="props2"
    :collapse-tags="true"
  />  
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import DeptAPI from "@/api/system/dept";
import { ref } from 'vue';
const props = defineProps({
  modelValue: {
    type: String||Number || [], 
  },
});   
const currentCheck = ref(null);
   
const emit = defineEmits(["update:modelValue","change"]);  
const modelValue = useVModel(props, 'modelValue') 
const handleClose = ()=>{
  emit('change',currentCheck.value)
}
const props2 = ref({
  label: 'name',
  value: 'id',
  children: 'children',
  checkStrictly : true,
  emitPath: false,
})

// 查询学校
const deptList = ref([])
function handleQuery() { 
  DeptAPI.getList({}).then((data) => {
    deptList.value = data; 
  });
}
handleQuery()


</script>


<style lang="scss" scoped>

</style>
