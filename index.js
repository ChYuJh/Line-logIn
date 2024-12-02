// const redirect_uri = "https://chyujh.github.io/Line-logIn/";
const redirect_uri = "http://127.0.0.1:5500/";
const client_id = "2006626177";
const client_secret = "2d6aa4a6453fa79f44cec2d821918542";
const queryObject = {};

// const lineLoginBtn = document.getElementById("lineLoginBtn")
function loginToLine() {
  /* GET https://access.line.me/oauth2/v2.1/authorize */
  // 這邊分開寫比較好閱讀
  let link = "https://access.line.me/oauth2/v2.1/authorize?";
  link += "response_type=code";
  link += "&client_id=" + client_id;
  link += "&redirect_uri=" + redirect_uri;
  link += "&state=login";
  link += "&scope=openid%20profile";

  window.location.href = link;
}

function init() {
  // 解析是否是line跳轉過來的
  const myURL = new URL(window.location.href);

  // 透過物件的解構賦值，取出 URL 物件的屬性值
  const { searchParams } = myURL;

  // 透過陣列的解構賦值，取得網址參數部分(code=lfcJqyvcdr6WQvTSV4Mg&state=login)
  for (let [key, value] of searchParams.entries()) {
    queryObject[key] = value;
  }
  console.log(queryObject);
}
let tokenInfo = {};
// POST https://api.line.me/oauth2/v2.1/token
//https://developers.line.biz/en/reference/line-login/#issue-access-token 官網文件
async function getLineToken() {
  // 留意一下官網告知的傳送格式，是使用 application/x-www-form-urlencoded
  const url = "https://api.line.me/oauth2/v2.1/token";
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  //若為json才要 JSON.stringify(body)
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code: queryObject.code, //第一次拿的code
    redirect_uri,
    client_id, //Channel ID
    client_secret, //Channel secret
  });

  const response = await postApi(url, headers, body);
  tokenInfo = response;

  function postApi(url, headers, body) {
    return fetch(url, {
      method: "POST",
      headers: headers,
      //別忘了把主體参數轉成字串，否則資料會變成[object Object]，它無法被成功儲存在後台
      body,
    }).then((response) => response.json());
    /**
         * response
            {
            "access_token": "bNl4YEFPI/hjFWhTqexp4MuEw5YPs...",
            "expires_in": 2592000,
            "id_token": "eyJhbGciOiJIUzI1NiJ9...",
            "refresh_token": "Aa1FdeggRhTnPNNpxr8p",
            "scope": "profile",
            "token_type": "Bearer"
            }         
        */
  }
}

//https://api.line.me/v2/profile
async function getUserInfo() {
  console.log(tokenInfo.access_token);
  const response = await getApi(
    "https://api.line.me/v2/profile",
    tokenInfo.access_token
  );
  console.log(response);
  function getApi(url, token) {
    console.log(token);
    return fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then((response) => response.json());
  }
}
