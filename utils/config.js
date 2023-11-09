const config = {
  baseUrl: "http://192.168.11.190:3000/api/",
  questionLibraryListUrl: "http://192.168.11.190/questionLibrary/list", // 获取系统问答库总列表 url (注意 端口号不一致)
  chatTranslateUrl: "http://192.168.11.190/chatGPT/translate", //翻译
  datasetId: "654a0e916bcc679370ccbef8", // 知识库id 测试用
  appId: "654a0e916bcc679370ccbf02",

  queryListByUserIdUrl: "http://192.168.11.190/faq/queryListByUserId", // 获取旧RFQ数据
  userId: "018c52a4-d2bd-41a1-bcb1-cfa5508251cd", // 获取旧RFQ数据 ===> query参数
};
