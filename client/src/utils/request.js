async function request(url, method = "GET", body) {
  const resp = await window.fetch(url, {
    method: method,
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body)
  });

  const result = await resp.json();

  if (resp.ok) {
    return result;
  } else {
    return Promise.reject(result);
  }
}

export default request;
