const API = {
  DATASET_LIST_URL: "core/dataset/collection/list", // 获取数据集列表
};

// 获取数据集列表
const getList = (data) => request.post(API.DATASET_LIST_URL, data);
