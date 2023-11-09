// 创建axios实例
const request = axios.create({
  baseURL: config.baseUrl,
});

// 配置请求拦截器
request.interceptors.request.use(async (config) => {
  // 配置请求头
  const authorization =
    "fastgpt-wpOx1MEqEKrj4Y7pyTRVmPGmD3bWxhsfU0jDW-654a0e916bcc679370ccbf02";

  // 验证token
  if (authorization) {
    config.headers.authorization = "Bearer " + authorization;
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// 配置响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data; // 返回响应数据
  },
  (error) => {
    // 失败回调
    let message = error.response.data.message;

    return error.response.data; // 返回响应数据或错误信息的包装器
  }
);
