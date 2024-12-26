import request from "@/utils/request";

const School_BASE_URL = "/api/v1/";

const SchoolAPI = {  
  /** 获取通知公告分页数据 */
  getPage(queryParams?: ThemesListParams) {
    return request<any, PageResult<ThemesItem[]>>({
      url: `${School_BASE_URL}/isThemes`,
      method: "get",
      params: queryParams,
    });
  },

  // /**
  //  * 获取通知公告表单数据
  //  *
  //  * @param id NoticeID
  //  * @returns Notice表单数据
  //  */
  // getFormData(id: number) {
  //   return request<any, NoticeForm>({
  //     url: `${NOTICE_BASE_URL}/${id}/form`,
  //     method: "get",
  //   });
  // },

  /**
   * 添加话题
   */
  add(data: ThemesItem) {
    return request({
      url: `${School_BASE_URL}`,
      method: "post",
      data: data,
    });
  },

  // /**
  //  * 更新通知公告
  //  *
  //  * @param id NoticeID
  //  * @param data Notice表单数据
  //  */
  // update(id: number, data: NoticeForm) {
  //   return request({
  //     url: `${NOTICE_BASE_URL}/${id}`,
  //     method: "put",
  //     data: data,
  //   });
  // },

  // /**
  //  * 批量删除通知公告，多个以英文逗号(,)分割
  //  *
  //  * @param ids 通知公告ID字符串，多个以英文逗号(,)分割
  //  */
  // deleteByIds(ids: string) {
  //   return request({
  //     url: `${NOTICE_BASE_URL}/${ids}`,
  //     method: "delete",
  //   });
  // },

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

export default SchoolAPI;

/** 校园话题表查新对象 */
export interface ThemesListParams { 
  tenantId :string;
  createTime :string;
  pageNum :string;
  pageSize  :string;
  title?: string; 
  status?:string;
}
/** 校园话题表新增对象 */
export interface ThemesItem {
  id:string;
  themeId:string;
  title:string;
  content:string;
  comment:number;
  views:number;
  heat:number;
  frontUserId:string;
  createDate:string;
  updateDate:string;
  createBy:string;
  updateBy:string;
} 

/** 校园话题表分页对象 */
export interface ThemesItem {
  id:string;
  themeId:string;
  title:string;
  content:string;
  comment:number;
  views:number;
  heat:number;
  frontUserId:string;
  createDate:string;
  updateDate:string;
  createBy:string;
  updateBy:string;
} 
