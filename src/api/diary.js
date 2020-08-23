import request from "@/utils/request";

export default {
  // 上传图片文件
  uploadFile(formdata) {
    return request({
      url: 'diary/file',
      method: 'post',
      data: formdata,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  submitDiary(form) {
    return request({
      url: 'diary',
      method: 'post',
      data: form,
    });
  },
  // 分页搜索方法
  // page 当前页码，size 每页条数，searchMap条件查询的条件
  search(page, size, searchMap) {
    return request({
      url: `/diary/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },

  getById(id) {
    return request({
      url: `/diary/${id}`,
      method: "get"
    });
  },

    // 通过id删除记录
    deleteById(id) {
      return request({
        url: `/diary/${id}`,
        method: "delete"
      });
    }
}