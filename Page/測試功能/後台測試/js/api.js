// baseURL是你API的主要Domain，之後發請求時只要填相對路徑就可以了
// const token = ""
const instance = axios.create({
  baseURL: 'https://localhost:44392/',
  headers: 
  { 
    'Content-Type': 'application/json',
    // 'Authorization': 'Bearer ' + token
  },
  timeout: 1000000
});
function req(method, url, data = null, config) {
  method = method.toLowerCase();
  switch (method) {
    case "post":
      return instance.post(url, data, config);
    case "get":
      return instance.get(url, { params: data });
    case "delete":
      return instance.delete(url, { params: data });
    case "put":
      return instance.put(url, data);
    case "patch":
      return instance.patch(url, data);
    default:
      console.log(`未知的 method: ${method}`);
      return false;
  }
}
export{ req } // 具名匯出