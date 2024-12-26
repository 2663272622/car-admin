

// const OSS = require('ali-oss'); // 引入ali-oss依赖
import OSS from 'ali-oss'
export function client() {  
    const client = new OSS({
        region: 'oss-cn-beijing',
        refreshSTSTokenInterval: 300000,
        accessKeyId: 'LTAI5tNd6WYEDWx52d88qmqt',
        accessKeySecret: '05QdpVP18xzzcSawZhCz3R8vYQ2ik6',
        bucket: 'img-ischool',
        secure: true, 
    })  
    return client
}
 