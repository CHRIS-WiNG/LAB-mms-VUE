import request from "@/utils/request";

export default {
  // 分页条件查询
  search(page, size, searchMap) {
    return request({
      url: `/teacher/list/search/${page}/${size}`,
      method: "post",
      data: searchMap
    });
  },
  // 新增教师
  add(pojo) {
    return request({
      url: "/teacher",
      method: "post",
      data: pojo
    });
  },

  // 通过 ID 查询教师信息
  getById(id) {
    return request({
      url: `/teacher/${id}`,
      method: "get"
    });
  },

  // 修改教师信息
  update(pojo) {
    return request({
      url: `/teacher/${pojo.id}`,
      method: "put",
      data: pojo
    });
  },

  // 通过 ID 删除教师
  deleteById(id) {
    return request({
      url: `/teacher/${id}`,
      method: "delete"
    });
  },
    // 根据UID获取教师记录
    getByUId(id) {
      return request({
        url: `/teacher/uid/${id}`,
        method: "get"
      });
    },
};
