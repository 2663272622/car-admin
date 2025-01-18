
/**
 * 渲染二维码
 * @param {ctx} ctx 画布实例
 * @param {String} shape 形状
 * @param {String} bg 二维码背景色 ''为透明
 * @param {String} img 图片对象
 * @param {Number} x x坐标
 * @param {Number} y y坐标
 * @param {Number} size 二维码尺寸 
 * @returns {Promise}
 */
// await renderScan(ctx,'square','',img2, canvasData.x, canvasData.y, formData.size)
// await renderScan(ctx,'circle','',img2, canvasData.x, canvasData.y, formData.size)

export const renderScan = (ctx,shape,bg,img,x,y,size) => {
  // const ctx = canvas.getContext("2d");

  
  let imageData;
  return new Promise((resolve, reject) => {
    switch (shape) {
      case 'circle':// 圆形
        // 计算圆形图片的裁剪区域
        const radius = size / 2;    // 圆形的半径
        const centerX = x + radius;  // 圆形的中心X坐标
        const centerY = y + radius;  // 圆形的中心X坐标

        // 创建圆形的裁剪区域
        ctx.save();  // 保存当前状态
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.clip();  // 应用裁剪区域

        // 在裁剪区域内绘制上传的图片
        ctx.drawImage(
          img, 
          x,
          y, 
          size, 
          size,  
        ); 
        // 恢复画布的裁剪区域，以便后续操作不受影响
        ctx.restore();
      break;
      case 'square':// 方形
        ctx.drawImage(img,x,y,size,size); // 在指定位置绘制第二张图片
        // 设置为透明色
        imageData = ctx.getImageData(x, y, size, size);
        // let data = imageData.data;
        if(bg == ''){
          setTm(imageData)
        } 
        // 获取图像的像素数据
      break;
    }



    ctx.putImageData(imageData, x, y);
    resolve(true)
  })
}


function setTm(imageData){
  let data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];     
    let g = data[i + 1]; 
    let b = data[i + 2]; 
    if (r > 200 && g > 200 && b > 200) {
      data[i + 3] = 0; 
    }
  }

}




 