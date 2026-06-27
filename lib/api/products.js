import api from "./axios.js";

export function getProducts(category) {
  const params = category ? { category } : {};
  return api.get("/products", { params });
}

export function getProductById(id) {
  return api.get(`/products/${id}`);
}
