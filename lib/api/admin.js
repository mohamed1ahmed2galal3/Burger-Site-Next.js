import api from "./axios.js";

export function loginAdmin(email, password) {
  return api.post("/auth/login", { email, password });
}

export function getOrders(token) {
  return api.get("/orders", {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateOrderStatus(id, status, token) {
  return api.patch(
    `/orders/${id}`,
    { status },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

export function addProduct(data, token) {
  return api.post("/products", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateProduct(id, data, token) {
  return api.put(`/products/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function deleteProduct(id, token) {
  return api.delete(`/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
