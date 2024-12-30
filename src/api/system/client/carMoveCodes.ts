import request from "@/utils/request";
//挪车码管理
const carMoveCodes_BASE_URL = "/api/v1/carMoveCodes";

const carMoveCodesAPI = {   
  // 获取列表
  getPage(queryParams) {
      return request({
      url: `${carMoveCodes_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },
 
  // 获取详情
  getFormData(id: number) {
    return request({
      url: `${carMoveCodes_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  // 添加
  add(data) {
    return request({
      url: `${carMoveCodes_BASE_URL}`,
      method: "post",
      data: data,
    });
  }, 

  // 更新 
  update(id: number, data) {
    return request({
      url: `${carMoveCodes_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  // 批量删除
  deleteByIds(ids: string) {
    return request({
      url: `${carMoveCodes_BASE_URL}/${ids}`,
      method: "delete",
    });
  },
  //批量生成
  generated(num: number,carMerchantId:number){
    return request({
      url: `${carMoveCodes_BASE_URL}/batchGenerate`,
      method: "post",
      params: {
        num: num,
        carMerchantId:carMerchantId
      }
    });
  },
  download(ids: number){
    return request({
      url: `${carMoveCodes_BASE_URL}/download`,
      method:'post',
      params:{
        ids:ids
      }
    })
  }
 
};

export default carMoveCodesAPI;
