const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const fetchAPI = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Error de red' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  return res.json();
};

export const api = {
  getCategories: () => fetchAPI('/categories'),

  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchAPI(`/products?${query}`);
  },

  getFeaturedProducts: () => fetchAPI('/products/featured'),

  searchProducts: (q, page = 1) =>
    fetchAPI(`/products/search?q=${encodeURIComponent(q)}&page=${page}`),

  getProduct: (id) => fetchAPI(`/products/${id}`),

  createOrder: (data) =>
    fetchAPI('/orders', { method: 'POST', body: JSON.stringify(data) }),

  getOrder: (id) => fetchAPI(`/orders/${id}`),

  getOrderByNumber: (num) => fetchAPI(`/orders/number/${num}`),

  confirmPayment: (data) =>
    fetchAPI('/payments/confirm', { method: 'POST', body: JSON.stringify(data) }),

  validateCoupon: (code, subtotal) =>
    fetchAPI('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, subtotal }) }),

  submitReview: (productId, data) =>
    fetchAPI(`/products/${productId}/reviews`, { method: 'POST', body: JSON.stringify(data) }),

  getWishlist: (sessionId) => fetchAPI(`/wishlist?sessionId=${sessionId}`),

  addToWishlist: (sessionId, productId) =>
    fetchAPI('/wishlist', { method: 'POST', body: JSON.stringify({ sessionId, productId }) }),

  removeFromWishlist: (sessionId, productId) =>
    fetchAPI(`/wishlist/${productId}?sessionId=${sessionId}`, { method: 'DELETE' }),

  // Admin
  adminFetch: (endpoint, options = {}) => {
    const token = process.env.NEXT_PUBLIC_ADMIN_TOKEN;
    return fetchAPI(`/admin${endpoint}`, {
      ...options,
      headers: { Authorization: `Bearer ${token}`, ...options.headers },
    });
  },
};
