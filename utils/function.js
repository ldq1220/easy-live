// 过滤问答接口返回数据
function filterText(str) {
  let arr = [];
  let index = str.indexOf("\n");
  arr[0] = str.substring(0, index).trim();
  arr[1] = str.substring(index).trim();
  return arr;
}
