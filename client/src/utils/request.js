async function request(url, method = "GET", body) {
  if (url.includes("2")) {
    return Promise.reject("Marijoon");
  }
  const resp = await window.fetch(url, {
    method: method,
    headers: { "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify(body),
  });

  let result;
  try {
    result = await resp.json();
  } catch (e) {
    return Promise.reject("Could not parse response");
  }

  if (resp.ok) {
    return result;
  } else {
    return Promise.reject(result);
  }
}

export default request;
