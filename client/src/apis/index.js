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
