

<template>
  <el-dialog
    v-model="modelValue"
    :align-center="true"
    :append-to-body="true"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    width="700px" 
    title="坐标选择"
    style="padding-right: 0"
    @close="handleCloseModal"
  >
    <div style="position: absolute; top: 16px; right: 24px;">
      <el-select
        v-model="selectData"
        @change="handleChange"
        filterable
        remote
        reserve-keyword
        placeholder="搜索位置"
        :remote-method="remoteMethod"
        :loading="loading"
        style="width: 240px;margin-right: 5px;"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-input v-if="currentCheck" style="width: 240px;margin-right: 5px" v-model="currentCheck" clearable> </el-input>
      <el-button @click="handleClose">确认</el-button>
    </div>

      <div id="container"></div> 
  </el-dialog>
</template>

<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { i } from 'vite/dist/node/types.d-aGj9QkWt';

const props = defineProps({
  modelValue: {
    type: Boolean, 
  },
  coord:{
    type:String
  }
});
const emit = defineEmits(["update:modelValue","change"]);  
const modelValue = useVModel(props, 'modelValue')// as boolean; 
const handleCloseModal = () => {
  
}
const handleClose = ()=>{
  emit('change',currentCheck.value)
  modelValue.value = false
}

const map = ref()
const currentCheck = ref('')

 

const addPoint = (x,y)=>{
  map.value.clearOverlays();
  var point = new BMapGL.Point(x,y);   
  var marker = new BMapGL.Marker(point);        // 创建标注  
  currentCheck.value =  `${x},${y}`
  map.value.addOverlay(marker);       
}

watch(() => modelValue.value, async(newVal) => {
  if(newVal){
    await nextTick(() => {})
    // @ts-ignore
    map.value = new BMapGL.Map("container");
    map.value.enableScrollWheelZoom(true);     //开启鼠标滚轮缩放
    map.value.addEventListener('click', function(e) {
      addPoint(e.latlng.lng,e.latlng.lat)
    });

    var geolocation = new BMapGL.Geolocation();
    geolocation.getCurrentPosition(function(r){
        if(props.coord){
          const [ lng,lat ] = props.coord.split(',')
          addPoint(lng,lat);
          map.value.centerAndZoom(new BMapGL.Point(lng,lat), 5); 
        }
        if(this.getStatus() == BMAP_STATUS_SUCCESS){ 
            addPoint(r.point.lng,r.point.lat);
            map.value.centerAndZoom(new BMapGL.Point(r.point.lng,r.point.lat), 15); 
        }
        else { 
            var point = new BMapGL.Point(117.13503644283513,36.65185127085397);
            map.value.centerAndZoom(point, 5); 
        }        
    });

  }else{
    currentCheck.value = "";
    options.value = [];
    selectData.value = "";
  }
},{immediate: true })
 
// 远程搜索
const selectData = ref("");
const loading = ref(false)
const options = ref([])
const handleChange = ()=>{
  let check = options.value.find(i=>i.uid == selectData.value)
  console.log(check)
  addPoint(check.point.lng,check.point.lat)
}
const remoteMethod = async (query: string) => {
	var local = new BMapGL.LocalSearch(map.value, {
		renderOptions:{map: map.value}
	});
	local.search(query);
  
  // 设置回调函数，获取搜索结果
  local.setSearchCompleteCallback(function (searchResult) { 
      options.value = []
      options.value = searchResult._pois!.map(i=>({
        ...i,
        label: i.title,
        value:i.uid//
      }))
      console.log("搜索到的列表：", options.value );  
  });
}
 
</script>


<style lang="scss" scoped>
#container{
  width: 100%;
  height:400px
}
</style>
