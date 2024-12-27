import request from "@/utils/request";

const notices_BASE_URL = "/api/v1/notices";

const noticesAPI = {  
  /** 获取小程序用户分页数据 */
  getPage(queryParams) {
    // return request<any, PageResult<SchoolWallItem[]>>({
      return request({
      url: `${notices_BASE_URL}/page`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 小程序用户表单数据
   *
   * @param id NoticeID
   * @returns Notice表单数据
   */
  getFormData(id: number) {
    return request<any, any>({
      url: `${notices_BASE_URL}/${id}/form`,
      method: "get",
    });
  },

  /**
   * 新增小程序用户表
   */
  add(data: any) {
    return request({
      url: `${notices_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  /**
   * 修改小程序用户表
   *
   * @param id NoticeID
   * @param data Notice表单数据
   */
  update(id: number, data) {
    return request({
      url: `${notices_BASE_URL}/${id}`,
      method: "put",
      data: data,
    });
  },

  /**
   * 批量删除小程序用户表，多个以英文逗号(,)分割
   *
   * @param ids 通知公告ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(ids: string) {
    return request({
      url: `${notices_BASE_URL}/${ids}`,
      method: "delete",
    });
  },

  // /**
  //  * 发布通知
  //  *
  //  * @param id 被发布的通知公告id
  //  * @returns
  //  */
  // publish(id: number) {
  //   return request({
  //     url: `${NOTICE_BASE_URL}/${id}/publish`,
  //     method: "patch",
  //   });
  // },
 
};

export default noticesAPI;