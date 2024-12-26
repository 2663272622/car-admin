
import type { UploadProps, UploadUserFile } from 'element-plus' 
import { PREURL,IMG_BASE_URL } from "@/utils/const";
/**
 * Check if an element has a class
 * @param {HTMLElement} ele
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele: HTMLElement, cls: string) {
  return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
}


/**
 * Add class to element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function addClass(ele: HTMLElement, cls: string) {
  if (!hasClass(ele, cls)) ele.className += " " + cls;
}

/**
 * Remove class from element
 * @param {HTMLElement} ele
 * @param {string} cls
 */
export function removeClass(ele: HTMLElement, cls: string) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
    ele.className = ele.className.replace(reg, " ");
  }
}

/**
 * 判断是否是外部链接
 *
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path: string) {
  const isExternal = /^(https?:|http?:|mailto:|tel:)/.test(path);
  return isExternal;
}

/**
 * 用于格式化预览URL
 * @param {string} path
 * @param {Boolean} isPre 是否为预览图
 * @returns {Boolean}
 */
export function handleUrl(str: string,isPre=true):UploadUserFile[]{
  let url = []
  if(str){
    url = str.split(',').filter(i=>i).map(i=>({url:IMG_BASE_URL + i + (isPre ? PREURL : ''),name:''}))
  }
  return url
}
