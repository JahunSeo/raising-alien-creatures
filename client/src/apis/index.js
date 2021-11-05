// temp
const BASE_URL = "http://localhost:5000/api";

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
