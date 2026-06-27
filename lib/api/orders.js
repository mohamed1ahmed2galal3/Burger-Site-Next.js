import api from "./axios.js";

export function createOrder(orderData) {
  return api.post("/orders", orderData);
}

export function trackOrder(id) {
  return api.get(`/orders/${id}`);
}
