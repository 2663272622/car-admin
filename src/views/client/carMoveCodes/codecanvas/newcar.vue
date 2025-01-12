<template>
  <el-drawer
    v-model="modelValue"
    title="生成图片"  
    class="car-drawer"
  >
    <div class="car-drawer-content">
      <div class="car-drawer-content-left" v-if="showQR">
        <el-form :model="formData" label-width="auto" style="max-width: 600px">
          <el-form-item label="QR Logo">
            <el-upload
              class="avatar-uploader"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :show-file-list="false" 
              :before-upload="beforeAvatarUpload"
            > 
                <img class="w-55px h-55px" v-if="formData.logoImage" :src="formData.logoImage" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item> 
          <template v-if="formData.logoImage">
             
            <el-form-item label="LOGO大小">
              <el-slider v-model="formData.logoScale" @change="changeQR"  :min="0" :step="0.1" :max="0.9"/> 
            </el-form-item> 
            <el-form-item label="LOGO边距">
              <el-slider v-model="formData.logoMargin" @change="changeQR"  :min="0" /> 
            </el-form-item> 
            <el-form-item label="LOGO圆角">
              <el-slider v-model="formData.logoCornerRadius" @change="changeQR"  :min="0" /> 
            </el-form-item> 
          </template>
          <el-form-item label="色块颜色">
            <el-color-picker v-model="formData.colorDark" @change="changeQR" show-alpha />
          </el-form-item> 
          <el-form-item label="二维码尺寸">
            <!-- <el-input-number v-model="formData.size" :min="5"   /> -->
              <el-slider v-model="formData.size" @change="changeQR" :min="5" /> 
          </el-form-item>
          
          <el-form-item label="空白区域">
            <el-color-picker v-model="formData.colorLight" @change="changeQR" show-alpha />
          </el-form-item> 

          <!-- <el-button type="primary" @click="renderQR" class="mb-20px">生成二维码</el-button> -->

          <!-- 画布相关 -->
          <el-form-item label="画布背景">
            <el-upload
              class="avatar-uploader"
              action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
              :show-file-list="false" 
              :before-upload="beforeCanvasUpload"
            > 
                <img class="w-55px h-55px" v-if="canvasData.cimg" :src="canvasData.cimg" />
                <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            </el-upload>
          </el-form-item> 
          <el-form-item label="宽度">
              <el-slider v-model="canvasData.w" @change="changeCanvas" :min="0" :max="1000" /> 
          </el-form-item>
          <el-form-item label="高度">
              <el-slider v-model="canvasData.h" @change="changeCanvas" :min="0" :max="1000" /> 
          </el-form-item>
          <el-form-item label="二维码位置">
              <el-slider v-model="canvasData.x" @change="changeCanvas" :min="0" :max="canvasData.w" /> 
          </el-form-item>
          <el-form-item label="二维码位置">
              <el-slider v-model="canvasData.y" @change="changeCanvas" :min="0" :max="canvasData.h" /> 
          </el-form-item>

          <el-form-item label="插入文本">
              <el-input v-model="canvasData.txt" style="width: 100%" @input="changeCanvas" placeholder="Please input" />
          </el-form-item>
          <el-form-item label="文本大小">
              <el-slider v-model="canvasData.fontsize" @change="changeCanvas" :min="0" :max="100" /> 
          </el-form-item> 
          <el-form-item label="文本颜色">
            <el-color-picker v-model="canvasData.color" @change="changeCanvas" show-alpha />
          </el-form-item>
          <el-form-item label="文本X">
              <el-slider v-model="canvasData.fontx" @change="changeCanvas" :min="0" :max="canvasData.w" /> 
          </el-form-item> 
          <el-form-item label="文本Y">
              <el-slider v-model="canvasData.fonty" @change="changeCanvas" :min="0" :max="canvasData.w" /> 
          </el-form-item> 

          <el-form-item>
            <el-button type="primary" @click="renderCanvas">渲染</el-button>
          </el-form-item>
        <img :src="qrDemoImg " :style="`width:${formData.size}; height:${formData.size};max-width:100%;max-height:100%; margin-top: 15px`" alt="">
        </el-form>
        
      </div>
      <div class="car-drawer-content-right"> 
        <canvas id="myCanvas"  style="border:1px solid #ccc" :width="canvasData.w" :height="canvasData.h"></canvas>
        
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { ref } from 'vue'; 
import vueQr from 'vue-qr/src/packages/vue-qr.vue' 
 
const props = defineProps({
  modelValue: {
    type: Boolean, 
  },
});   

const emit = defineEmits(["update:modelValue"]);  
const modelValue = useVModel(props, 'modelValue')

const showQR = ref(false) 
const qrDemoImg = ref("")
const formData = reactive({
  size:200,  
  text :"https://onlinewifi.car.ischool.shop?move=7410",
  margin:0,
  colorDark :'#000',
  colorLight  :'#fff',
  logoImage: '',
  logoMargin  :0,
  logoCornerRadius:0, 
})
const canvasData = reactive({
  cimg:"",
  w:400,
  h:300,
  x:0,
  y:0,
  txt:"插入编号",
  fontsize:12,
  color:"#000",
  fonty:220,
  fontx:220, 
}) 

const onSubmit = () => {
  console.log('submit!')
}

const beforeAvatarUpload = (file) =>{
  const reader = new FileReader();
  reader.addEventListener('load', ()=> {
    formData.logoImage = reader.result as string
    renderQR()
  });
  reader.readAsDataURL(file);
  return false;
}
const beforeCanvasUpload = (file) =>{
  const reader = new FileReader();
  reader.addEventListener('load', ()=> {
    canvasData.cimg = reader.result as string
    changeCanvas()
  });
  reader.readAsDataURL(file);
  return false;
}




const renderQR =async() => {
  await nextTick()
  showQR.value = true
  // @ts-ignore
  new AwesomeQR.AwesomeQR(
    formData
  ).draw().then((dataURL) => {
    qrDemoImg.value = dataURL
    changeCanvas()
  }); 
} 

const renderQRTimer = ref(0)
const changeQR = ()=>{
  if(new Date().getTime() - renderQRTimer.value > 150){
    renderQR()
  }else{ 
    setTimeout(()=>{
      renderQR()
    },150)
  }
}

const renderTimer = ref(0)
const changeCanvas = ()=>{
  if(new Date().getTime() - renderTimer.value > 150){
    renderCanvas()
  }else{ 
    setTimeout(()=>{
      changeCanvas()
    },150)
  }
}
const renderCanvas = ()=>{
  renderTimer.value = new Date().getTime()
  console.log("渲染canvas")

    // 获取 canvas 元素和 2D 上下文
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let loadimg = 0;
    // 创建图片对象
    const img = new Image();
    img.onload = function() {
        ++loadimg
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // 将图片缩放到 canvas 尺寸
    };
    img.src = canvasData.cimg;  

  
    const img2 = new Image();
    img2.onload = function() {
        ++loadimg
        ctx.drawImage(img2, canvasData.x, canvasData.y, formData.size, formData.size); // 在指定位置绘制第二张图片
    }; 
    img2.src = qrDemoImg.value;
    
    


    function rendertxt(){
      if(loadimg == 2){
        ctx.font = `${canvasData.fontsize}px Arial`;  // 字体大小和类型
        ctx.fillStyle = `${canvasData.color}`;    // 文字颜色
        ctx.textAlign = 'center';  // 设置文字水平居中
        ctx.textBaseline = 'middle';  // 设置文字垂直居中
        // 绘制填充文字
        ctx.fillText(canvasData.txt, canvasData.fontx, canvasData.fonty); 
      }else{
        setTimeout(()=>{
          rendertxt()
        })
      }
    }
    rendertxt()
}

watch(()=>modelValue.value,()=>{
  if(modelValue.value){
    renderQR()
  }
},{immediate:true})


</script>

<style lang="scss"  >
.car-drawer{
  width:85vw !important;
  .el-drawer__body{
    padding: 0;
  }
  .car-drawer-content{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-between;
    border-top: 1px solid #ccc;
    .car-drawer-content-left, .car-drawer-content-right{
      height: 100%;
      padding: 10px 5px;
      box-sizing: border-box;
    }
    .car-drawer-content-left{
      width: 300px;
      min-width: 300px;
      border-right: 1px solid #ccc;
    }
    .car-drawer-content-right{
      width: 100%;
    }
  }
}
</style>
