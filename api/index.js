const API = {
  // INIT_FAST_GPT_URL: "faq/initFastGPT", // 初始化fastGPT
  DATASET_LIST_URL: "core/dataset/collection/list", // 获取数据集列表
  CREATE_COLLECTION_URL: "core/dataset/collection/create", // 创建数据集
  UPDATE_COLLECTION_URL: "core/dataset/collection/update", // 修改数据集
  DELECT_COLLECTION_URL: "core/dataset/collection/delById", // 删除数据集
  GET_DATA_LIST_URL: "core/dataset/data/getDataList", // 获取数据集的数据列表
  DEL_DATA_BYID_URL: "core/dataset/data/delDataById", // 删除数据集中的数据
  INSERT_DATA_URL: "core/dataset/data/insertData", // 为指定数据集中插入数据
  UPDATE_DATA_URL: "core/dataset/data/updateData", // 修改数据集中的数据
  CHAT_COMPLETIONS_URL: "v1/chat/completions", // 对话
  SEARCH_TEST_URL: "core/dataset/searchTest", // 搜索测试
  DETAIL_MODULE_URL: "app/detailModule", // 获取高级设置
  UPDATE_MODULE_URL: "app/updateModule", // 修改高级设置
};

// 初始化fastGPT
// const reqInitFastGPT = () => request.post(API.INIT_FAST_GPT_URL);

// 获取数据集列表
const reqDatasetList = (data) => request.post(API.DATASET_LIST_URL, data);

// 创建数据集
const reqCreateDataset = (data) =>
  request.post(API.CREATE_COLLECTION_URL, data);

// 修改数据集
const reqUpdateDataset = (data) =>
  request.post(API.UPDATE_COLLECTION_URL, data);

// 删除数据集
const reqDeleteDataset = (collectionId) =>
  request.delete(API.DELECT_COLLECTION_URL + `?collectionId=${collectionId}`);

// 获取系统问答库总列表
const reqQuestionLibraryList = () => request.get(config.questionLibraryListUrl);

// 获取数据集的数据列表
const reqGetDataList = (data) => request.post(API.GET_DATA_LIST_URL, data);

//为指定数据集中插入数据
const reqInsertData = (data) => request.post(API.INSERT_DATA_URL, data);

// 删除数据集中的数据
const delDataById = (id) =>
  request.delete(API.DEL_DATA_BYID_URL + `?dataId=${id}`);

// 修改数据集中的数据
const reqUpdateData = (data) => request.put(API.UPDATE_DATA_URL, data);

// 对话
const reqChatCompletions = (data) =>
  request.post(API.CHAT_COMPLETIONS_URL, data);

// 搜索测试
const reqSearchTest = (data) => request.post(API.SEARCH_TEST_URL, data);

// 获取高级设置
const reqDetailModule = (appId) =>
  request.get(API.DETAIL_MODULE_URL + `?appId=${appId}`);

// 修改高级设置
const reqUpdateModule = (appId, data) =>
  request.post(API.UPDATE_MODULE_URL + `?appId=${appId}`, data);
