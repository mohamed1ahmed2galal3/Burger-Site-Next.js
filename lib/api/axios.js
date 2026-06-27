// بديل axios.js — بيستخدم fetch الداخلي لـ Next.js API Routes
// بيرجع شكل شبيه بـ axios: { data } عشان كود الصفحات يفضل زي الأصلي بالظبط (res.data)

async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const error = new Error(data?.message || "حصل خطأ");
    error.response = { data, status: res.status };
    throw error;
  }

  return { data };
}

const api = {
  get: (path, config = {}) => {
    const params = config.params
      ? "?" + new URLSearchParams(config.params).toString()
      : "";
    return request(`${path}${params}`, { method: "GET", headers: config.headers });
  },
  post: (path, body, config = {}) =>
    request(path, { method: "POST", body: JSON.stringify(body), headers: config.headers }),
  put: (path, body, config = {}) =>
    request(path, { method: "PUT", body: JSON.stringify(body), headers: config.headers }),
  patch: (path, body, config = {}) =>
    request(path, { method: "PATCH", body: JSON.stringify(body), headers: config.headers }),
  delete: (path, config = {}) =>
    request(path, { method: "DELETE", headers: config.headers }),
};

export default api;
