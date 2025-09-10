import axios from "axios";
import { mockAPI, MOCK_MODE } from "@/mocks";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login", credentials),

  register: (userData: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string | object;
  }) => api.post("/auth/register", userData),

  logout: () => api.post("/auth/logout"),

  refreshToken: () => api.post("/auth/refresh"),

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }),

  resetPassword: (token: string, password: string) =>
    api.post("/auth/reset-password", { token, password }),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (userData: Record<string, unknown>) =>
    api.put("/users/profile", userData),

  uploadPrescription: (formData: FormData) =>
    api.post("/users/prescriptions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getPrescriptions: () => api.get("/users/prescriptions"),
};

// Products API
export const productsAPI = {
  getProducts: (params?: {
    search?: string;
    category?: string;
    pharmacy?: string;
    page?: number;
    limit?: number;
  }) => {
    if (MOCK_MODE) {
      return mockAPI.getProducts(params);
    }
    return api.get("/products", { params });
  },

  getProduct: (id: string) => {
    if (MOCK_MODE) {
      return mockAPI.getProductById(id);
    }
    return api.get(`/products/${id}`);
  },

  getCategories: () => {
    if (MOCK_MODE) {
      return mockAPI.getCategories();
    }
    return api.get("/products/categories");
  },

  getPharmacies: () => {
    if (MOCK_MODE) {
      return mockAPI.getPharmacies();
    }
    return api.get("/products/pharmacies");
  },
};

// Orders API
export const ordersAPI = {
  createOrder: (orderData: {
    items: Array<{ productId: string; quantity: number; price: number }>;
    shippingAddress: Record<string, unknown>;
    paymentMethod: string;
    prescriptionId?: string;
  }) => api.post("/orders", orderData),

  getOrders: (params?: { status?: string; page?: number; limit?: number }) =>
    api.get("/orders", { params }),

  getOrder: (id: string) => api.get(`/orders/${id}`),

  updateOrderStatus: (id: string, status: string) =>
    api.put(`/orders/${id}/status`, { status }),
};

// Prescriptions API
export const prescriptionsAPI = {
  uploadPrescription: (formData: FormData) =>
    api.post("/prescriptions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getPrescriptions: () => api.get("/prescriptions"),

  getPrescription: (id: string) => api.get(`/prescriptions/${id}`),
};

// Payments API
export const paymentsAPI = {
  processPayment: (paymentData: {
    orderId: string;
    paymentMethod: string;
    amount: number;
  }) => api.post("/payments", paymentData),

  getPaymentStatus: (paymentId: string) =>
    api.get(`/payments/${paymentId}/status`),
};

export default api;
