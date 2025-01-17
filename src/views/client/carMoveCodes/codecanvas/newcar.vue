<template>
  <el-drawer
    v-model="modelValue"
    title="生成图片"  
    class="car-drawer"
  >
    <div class="car-drawer-content">
      <div class="car-drawer-content-left">
        <el-form :model="formData" label-width="auto" style="max-width: 600px">
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
          <el-form-item label="画布宽度">
              <el-slider v-model="canvasData.w" @change="changeCanvas" :min="0" :max="1000" /> 
          </el-form-item>
          <el-form-item label="画布高度">
              <el-slider v-model="canvasData.h" @change="changeCanvas" :min="0" :max="1000" /> 
          </el-form-item>

          <el-divider content-position="left">设置二维码</el-divider>

          <el-form-item label="二维码">
              <!-- <el-switch 
                v-model="useQr"  
              /> -->
              <el-radio-group v-model="useQr" @change="renderQR">
                <el-radio :value="false" size="small">使用微信</el-radio>
                <el-radio :value="true" size="small">手动生成</el-radio>
              </el-radio-group>
          </el-form-item>

          <template v-if="useQr">
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
            <el-form-item label="空白区域">
              <el-color-picker v-model="formData.colorLight" @change="changeQR" show-alpha />
            </el-form-item> 
          </template>

          <el-form-item label="二维码尺寸">
            <el-slider v-model="formData.size" @change="changeQR" :min="5" :max="300"/> 
          </el-form-item> 
          <el-form-item label="二维码位置">
              <el-slider v-model="canvasData.x" @change="changeCanvas" :min="0" :max="canvasData.w" /> 
          </el-form-item>
          <el-form-item label="二维码位置">
              <el-slider v-model="canvasData.y" @change="changeCanvas" :min="0" :max="canvasData.h" /> 
          </el-form-item>

          <el-divider content-position="left">设置文本</el-divider>
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
            <el-button type="primary" @click="exportCanvas">导出</el-button>
          </el-form-item>
        <!-- <img :src="qrDemoImg " :style="`width:${formData.size}; height:${formData.size};max-width:100%;max-height:100%; margin-top: 15px`" alt=""> -->
        </el-form>
        
      </div>
      <div class="car-drawer-content-right bg-#cca6a6"> 
        <canvas id="myCanvas"  style="border:1px solid #ccc" :width="canvasData.w" :height="canvasData.h"></canvas>
        
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { ElLoading } from 'element-plus';
import { ref } from 'vue'; 
import vueQr from 'vue-qr/src/packages/vue-qr.vue' 
 
const props = defineProps({
  modelValue: {
    type: Boolean, 
  },
  newcarcode:{

  }
});   
const useQr = ref(false)

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
  // showQR.value = true
  if(useQr.value){
    // @ts-ignore
    new AwesomeQR.AwesomeQR(
      formData
    ).draw().then((dataURL) => {
      qrDemoImg.value = dataURL
      changeCanvas()
    }); 
  }else{
    qrDemoImg.value = `http://img-ischool.oss-cn-beijing.aliyuncs.com/qrcodes/qrCode_7700.PNG`
    changeCanvas()
  }
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
const renderCanvas = (cimgurl, ckey)=>{
  return new Promise((resolve,reject)=>{
    renderTimer.value = new Date().getTime() 
    // 获取 canvas 元素和 2D 上下文
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let loadimg = 0; 

    const img2 = new Image();
    img2.onload = function() {
        ++loadimg
        ctx.drawImage(img2, canvasData.x, canvasData.y, formData.size, formData.size); // 在指定位置绘制第二张图片
        // 获取图像的像素数据
        var imageData = ctx.getImageData(canvasData.x, canvasData.y, formData.size, formData.size);
        var data = imageData.data;

        for (var i = 0; i < data.length; i += 4) {
          var r = data[i];     
          var g = data[i + 1]; 
          var b = data[i + 2]; 
          if (r > 200 && g > 200 && b > 200) {
            data[i + 3] = 0; 
          }
        }
        ctx.putImageData(imageData, canvasData.x, canvasData.y);
        
        // 创建图片对象
        const img = new Image();
        img.onload = function() {
            ++loadimg
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // 将图片缩放到 canvas 尺寸

            
        };
        img.src = canvasData.cimg; 

    }; 
    img2.src = cimgurl ? cimgurl : qrDemoImg.value ;
    img2.setAttribute('crossOrigin', ''); 

    
    function rendertxt(){
      if(loadimg == 2){
        ctx.font = `${canvasData.fontsize}px Arial`;  // 字体大小和类型
        ctx.fillStyle = `${canvasData.color}`;    // 文字颜色
        ctx.textAlign = 'center';  // 设置文字水平居中
        ctx.textBaseline = 'middle';  // 设置文字垂直居中
        // 绘制填充文字
        ctx.fillText(ckey ? ckey :canvasData.txt, canvasData.fontx, canvasData.fonty); 
        
        resolve(true)
      }else{
        setTimeout(()=>{
          rendertxt()
        })
      }
    }
    rendertxt()
  })
}

const exportCanvas = ()=>{
  let arr = Object.keys(props.newcarcode) 
  const canvas = document.getElementById("myCanvas");
  const zip = new JSZip();  // 创建一个空的 ZIP 文件

  function exportImg(index){
    if(arr.length <= (index + 1)){
      zip.generateAsync({ type: "blob" }).then(function(content) {
          saveAs(content, "images.zip");  // 使用 FileSaver.js 保存并下载 ZIP 文件
      });
      return;
    }
    let key = arr[index]
    let imgurl = props.newcarcode[key]

    const loading = ElLoading.service({
      lock: true,
      text: `正在处理${key},共${arr.length}个,目前第${index}个`,
      background: 'rgba(0, 0, 0, 0.7)',
    })

    renderCanvas(imgurl, key).then(async()=>{ 
      // 将 Canvas 转换为 PNG 图片的 Data URL
      const dataURL = canvas.toDataURL('image/png');
      console.log(key,'--------------',dataURL)
      const imageBlob = base64ToBlob(dataURL,"image/png")
      // 将图片添加到 ZIP 文件，文件名为 image1.jpg, image2.jpg 等
      zip.file('scan.'+key+'.png', imageBlob);
      loading.close()
      // 创建一个下载链接并触发下载
      // const link = document.createElement('a');
      // link.href = dataURL;
      // link.download = 'scan.'+key+'.png';  // 设置下载的文件名
      // link.click();
      exportImg(++index)
    })

  }
  exportImg(0) 
}

function base64ToBlob(base64, mimeType) {
    // 移除 Base64 字符串的头部 (如：data:image/png;base64,)
    const base64Data = base64.split(',')[1];

    // 解码 Base64 字符串
    const binaryString = atob(base64Data);

    // 创建一个 Uint8Array 用于存储二进制数据
    const length = binaryString.length;
    const bytes = new Uint8Array(length);

    // 将二进制字符串转换为 Uint8Array
    for (let i = 0; i < length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // 创建 Blob 对象并返回
    return new Blob([bytes], { type: mimeType });
}

 

// 弹窗显隐
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
