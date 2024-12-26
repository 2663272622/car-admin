export const formatApplyDate=(date)=> {
  if (!date ||!Array.isArray(date)) return '';
    // 初始化单位数组
    const units = ['', '', '', '', '', ''];
    // 初始化分隔符数组
    const separators = ['-', '-','', ':', ':', ''];
    // 对date数组中的每个元素进行处理，如果小于10则在前面加0
    const processedDate = date.map((value) => {
        if (typeof value === 'number' && value < 10) {
            return `0${value}`;
        }
        return value.toString();
    });
    // 拼接处理后的字符串，重点在第三个和第四个数据之间添加空格
    return processedDate.map((value, index) => {
        if (index === 2) {
            return value +'  ';
        }
        return value + (units[index] || '') + (separators[index] || '');
    }).join('');
}

