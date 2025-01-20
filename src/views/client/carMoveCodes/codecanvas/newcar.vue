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
          <el-form-item label="分辨率">
              <el-input-number v-model="canvasData.DPI"  />
          </el-form-item>
          <el-form-item label="画布宽度">
              <el-slider v-model="canvasData.w" @change="changeCanvas" :min="0" :max="1000" /> 
              <el-input-number v-model="canvasData.w" :precision="2" @change="changeCanvas" :step="1" :max="1000" />
          </el-form-item>
          <el-form-item label="画布高度">
              <el-slider v-model="canvasData.h" @change="changeCanvas" :min="0" :max="1000" /> 
              <el-input-number v-model="canvasData.h" disabled :precision="2" @change="changeCanvas" :step="1" :max="1000" />
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
                <!-- <el-slider v-model="formData.logoScale" @change="changeQR"  :min="0" :step="1" :max="0.9"/>  -->
                <el-input-number v-model="formData.logoScale" :precision="2" @change="changeQR" :step="1" :max="0.9" />
              </el-form-item> 
              <el-form-item label="LOGO边距">
                <!-- <el-slider v-model="formData.logoMargin" @change="changeQR"  :min="0" />  -->
                <el-input-number v-model="formData.logoMargin" :precision="2" @change="changeQR" :step="1" :min="0" :max="0.9" />
              </el-form-item> 
              <el-form-item label="LOGO圆角">
                <!-- <el-slider v-model="formData.logoCornerRadius" @change="changeQR"  :min="0" />  -->
                <el-input-number v-model="formData.logoCornerRadius" :precision="2" @change="changeQR" :step="1" :min="0" />
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
            <el-slider v-model="formData.size" @change="changeQR" :min="5"  :max="canvasData.w"/> 
            <el-input-number v-model="formData.size" :precision="2" @change="changeQR" :step="1" :min="5" :max="canvasData.w" />
          </el-form-item> 
          <el-form-item label="二维码X">
              <el-slider v-model="canvasData.x" @change="changeCanvas" :min="0" :max="canvasData.w" /> 
                <el-input-number v-model="canvasData.x" :precision="2" @change="changeCanvas" :step="1" :min="0" :max="canvasData.w" />
          </el-form-item>
          <el-form-item label="二维码Y">
              <el-slider v-model="canvasData.y" @change="changeCanvas" :min="0" :max="canvasData.h" /> 
                <el-input-number v-model="canvasData.y" :precision="2" @change="changeCanvas" :step="1" :min="0" :max="canvasData.h" />
          </el-form-item>

          <el-divider content-position="left">设置文本</el-divider>
          <el-form-item label="插入文本">
              <el-input v-model="canvasData.txt" style="width: 100%" @input="changeCanvas" placeholder="Please input" />
          </el-form-item>
          <el-form-item label="文本大小">
              <!-- <el-slider v-model="canvasData.fontsize" @change="changeCanvas" :min="0" :max="100" />  -->
                <el-input-number v-model="canvasData.fontsize" :precision="2" @change="changeCanvas" :step="1" :min="0" :max="100" />
          </el-form-item> 
          <el-form-item label="文本颜色">
            <el-color-picker v-model="canvasData.color" @change="changeCanvas" show-alpha />
          </el-form-item>
          <el-form-item label="文本X">
              <el-slider v-model="canvasData.fontx" @change="changeCanvas" :min="0" :max="canvasData.w" /> 
                <el-input-number v-model="canvasData.fontx" :precision="2" @change="changeCanvas" :step="1" :min="0" :max="canvasData.w" />
          </el-form-item> 
          <el-form-item label="文本Y">
              <el-slider v-model="canvasData.fonty" @change="changeCanvas" :min="0" :max="canvasData.w" /> 
                <el-input-number v-model="canvasData.fonty" :precision="2" @change="changeCanvas" :step="1" :min="0" :max="canvasData.h" />
          </el-form-item> 

          <el-form-item>
            <!-- <el-button type="primary" @click="renderCanvas">渲染</el-button> -->
            <el-button type="primary" @click="exportCanvas">导出</el-button>
          </el-form-item>
        <!-- <img :src="qrDemoImg " :style="`width:${formData.size}; height:${formData.size};max-width:100%;max-height:100%; margin-top: 15px`" alt=""> -->
        </el-form>
        
      </div>
      <div class="car-drawer-content-right bg-#ccc"> 
        <canvas id="myCanvas"  style="border:1px solid #0000001f" :width="canvasData.w" :height="canvasData.h"></canvas>
        
        
        
        
        <canvas id="myScanCanvas"  style="opacity:0" :width="formData.size" :height="formData.size"></canvas>
        
      </div>
    </div>
  </el-drawer>
</template>

<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { ElLoading } from 'element-plus';
import { ref } from 'vue'; 
import vueQr from 'vue-qr/src/packages/vue-qr.vue' 
import { renderScan } from '@/utils/canvas'
 
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
  w:1000,
  DPI:300,
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

    
    var img = new Image();
    img.onload =async function() {
        var width = img.width;
        var height = img.height;
        
          var multiple = canvasData.w / width;
          canvasData.w = multiple * width;
          canvasData.h = multiple * height;
          await nextTick(); 
        changeCanvas()
    };
    img.src = URL.createObjectURL(file);  // 将图片文件转换为 URL
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
    // qrDemoImg.value = `https://img-ischool.oss-cn-beijing.aliyuncs.com/qrcodes/qqq.png`
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
let timer = null;
const changeCanvas = ()=>{
  if(timer){
    clearTimeout(timer)
    timer = null;
  } 

  timer = setTimeout(()=>{
    console.log("直接执行")
    renderCanvas()
  },500)
  // let tt = new Date().getTime() - renderTimer.value
  // if(tt > 1000){
  //   console.log("直接执行", tt)
  // }else{ 
  //   setTimeout(()=>{
  //     changeCanvas()
  //   },150)
  // }
}
const renderCanvas = (cimgurl, ckey)=>{
    renderTimer.value = new Date().getTime() 
  return new Promise((resolve,reject)=>{
    // 获取 canvas 元素和 2D 上下文
    const canvas = document.getElementById("myCanvas");
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let loadimg = 0; 


    const myScanCanvas = document.getElementById("myScanCanvas");
    const scanCtx = myScanCanvas.getContext("2d");
    scanCtx.clearRect(0, 0,formData.size, formData.size);
    
    // ctx.globalCompositeOperation = 'destination-out'; // 设置合成模式为去除图像
      // 创建图片对象
      const img = new Image();
      img.onload =async function() {
          ++loadimg
          
          // var multiple = canvasData.w / img.width;
          // var height = img.height;
          // console.log(width,height)
          // debugger
          // canvasData.h = multiple * height 
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // 将图片缩放到 canvas 尺寸  
          // console.log("生成宽高", multiple * canvasData.w,canvasData.h)
          // ctx.drawImage(img, 0, 0, multiple * canvasData.w,canvasData.h ); // 将图片缩放到 canvas 尺寸  
 

          nextTick(()=>{
              const scanimg = new Image();
              scanimg.onload = function() {
                  scanCtx.drawImage(scanimg, 0, 0, formData.size, formData.size); // 将图片缩放到 canvas 尺寸  
                  // const radius = formData.size / 2;    // 圆形的半径
                  // const centerX = radius;  // 圆形的中心X坐标
                  // const centerY = radius;  // 圆形的中心X坐标

                  // // 创建圆形的裁剪区域
                  // scanCtx.save();  // 保存当前状态
                  // scanCtx.beginPath();
                  // scanCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
                  // scanCtx.closePath();
                  // scanCtx.clip();  // 应用裁剪区域

                  // // 在裁剪区域内绘制上传的图片
                  // scanCtx.drawImage(
                  //   scanimg, 
                  //   0,
                  //   0, 
                  //   formData.size, 
                  //   formData.size,  
                  // ); 
                  
                  let imageData = scanCtx.getImageData( 0,  0,  formData.size,  formData.size );
                  let data = imageData.data;
                  for (let i = 0; i < data.length; i += 4) {
                    let r = data[i];     
                    let g = data[i + 1]; 
                    let b = data[i + 2]; 
                    if (r > 200 && g > 200 && b > 200) {
                      data[i + 3] = 0; 
                    }
                  } 
                  scanCtx.clearRect(0, 0,formData.size, formData.size);
                  scanCtx.putImageData(imageData,0,0);
                  
                  // // 恢复画布的裁剪区域，以便后续操作不受影响
                  // scanCtx.restore();
                  const dataURL = myScanCanvas.toDataURL('image/png');
                  // console.log('生成二维码',dataURL)


                  const img2 = new Image(); 
                  img2.src = dataURL //cimgurl ? cimgurl : qrDemoImg.value ;
                  img2.onload = function() { 
                    // console.log("二维码",dataURL)
                    ctx.drawImage(
                      img2, 
                      canvasData.x,
                      canvasData.y, 
                      formData.size, 
                      formData.size,  
                    ); 
                    ++loadimg
                  }
              }
              scanimg.src = cimgurl ? cimgurl : qrDemoImg.value ;
              scanimg.setAttribute('crossOrigin', ''); 

          })

 



          
    };
    img.src = canvasData.cimg; 
      
    function rendertxt(){
      if(loadimg == 2){
        ctx.font = `${canvasData.fontsize}px Arial`;  // 字体大小和类型
        ctx.fillStyle = `${canvasData.color}`;    // 文字颜色
        ctx.textAlign = 'center';  // 设置文字水平居中
        ctx.textBaseline = 'middle';  // 设置文字垂直居中
        // 绘制填充文字
        let txt = ckey ? (ckey*1).toString(16).toUpperCase() :canvasData.txt
        ctx.fillText(txt, canvasData.fontx, canvasData.fonty); 
        
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
  console.log("导出arr",arr)
  const canvas = document.getElementById("myCanvas");
  const zip = new JSZip();  // 创建一个空的 ZIP 文件

  function exportImg(index){ 
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
      const daurl150dpi = changeDpiDataUrl(dataURL, canvasData.DPI);
      const imageBlob = base64ToBlob(daurl150dpi,"image/png")
      // 将图片添加到 ZIP 文件，文件名为 image1.jpg, image2.jpg 等
      zip.file('scan.'+key+'.png', imageBlob);
      loading.close()
      
      if(arr.length <= (index + 1)){
        zip.generateAsync({ type: "blob" }).then(function(content) {
            saveAs(content, "images.zip");  // 使用 FileSaver.js 保存并下载 ZIP 文件
        });
        return;
      }else{
        exportImg(++index)
      }
      
    })

  }
  exportImg(0) 
}

// function transitionImg(base64Image, targetWidthCm, targetDPI) {
//   return new Promise((resolve,reject)=>{
//     var daurl150dpi = changeDpiDataUrl(base64Image, canvasData.DPI);
//     resolve(daurl150dpi)
//     // const img = new Image();
//     // img.src = base64Image;
//     // img.onload = function() {
//     //   // 获取原始图像的宽高
//     //   const originalWidth = img.width;
//     //   const originalHeight = img.height;
//     //   // 计算目标图像宽度和高度
//     //   const targetWidthInches = targetWidthCm / 2.54;  // 将厘米转换为英寸
//     //   const targetWidth = targetWidthInches * targetDPI;  // 计算目标宽度（像素）
//     //   const targetHeight = targetWidth / originalWidth * originalHeight;  // 根据原始图像比例计算目标高度
//     //   // 创建canvas并绘制图像
//     //   const canvas = document.createElement("canvas");
//     //   const ctx = canvas.getContext("2d");
//     //   // 设置canvas尺寸为目标尺寸
//     //   canvas.width = targetWidth;
//     //   canvas.height = targetHeight;
//     //   // 绘制图像到canvas，调整为目标尺寸
//     //   ctx.drawImage(img, 0, 0, originalWidth, originalHeight, 0, 0, targetWidth, targetHeight);

//     //   // 导出处理后的图片为DataURL
//     //   const newImageDataURL = canvas.toDataURL("image/png"); 
//     // };
//   })
// };

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
      overflow: hidden;
      overflow-y: auto;
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
