// temp
const BASE_URL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5000/api";

console.log("[debug] NODE_ENV", process.env.NODE_ENV);

export const get = (url) => {
  return fetch(BASE_URL + url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const post = (url, body) => {
  return fetch(BASE_URL + url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

export const put = (url, body) => {
  return fetch(BASE_URL + url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
};

/*로그인 테스트 디버그*/
export const login = (url, body) => {
  // var details = {
  //   email: "kjy@kjy.net",
  //   pwd: "12345",
  // };
  console.log(131313, body);
  var formBody = [];
  for (var property in body) {
    var encodedKey = encodeURIComponent(property);
    var encodedValue = encodeURIComponent(body[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  return fetch("http://localhost:5000/api/user/login_process", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      // "Content-Type": "application/json",
    },
    body: formBody,
    // body: body,
  });
};
