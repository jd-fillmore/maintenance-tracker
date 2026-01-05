import axios from "axios";
import type {
  User,
  ServiceRecord,
  AuthResponse,
  LoginCredentials,
  SignupCredentials,
} from "../types";

// Create axios instance with default config
const api = axios.create({
  baseURL: "/api", // Vite proxy will redirect to http://localhost:3000/api
  withCredentials: true, // IMPORTANT: Send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Origin header to all requests (BetterAuth requires this)
api.interceptors.request.use((config) => {
  config.headers["Origin"] = window.location.origin;
  return config;
});

// ============================================
// AUTH ENDPOINTS
// ============================================

export const authAPI = {
  // Sign up new user
  signup: async (credentials: SignupCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/auth/sign-up/email",
      credentials
    );
    return response.data;
  },

  // Sign in existing user
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(
      "/auth/sign-in/email",
      credentials
    );
    return response.data;
  },

  // Sign out
  logout: async (): Promise<void> => {
    await api.post("/auth/sign-out");
  },

  // Get current session
  getSession: async (): Promise<{ user: User } | null> => {
    try {
      const response = await api.get("/auth/get-session");
      return response.data;
    } catch (error) {
      return null;
    }
  },
};

// ============================================
// SERVICE RECORDS ENDPOINTS
// ============================================

export const serviceRecordsAPI = {
  // Get all service records for logged-in user
  getAll: async (): Promise<ServiceRecord[]> => {
    const response = await api.get<ServiceRecord[]>("/service-records");
    return response.data;
  },

  // Get single service record by ID
  getById: async (id: string): Promise<ServiceRecord> => {
    const response = await api.get<ServiceRecord>(`/service-records/${id}`);
    return response.data;
  },

  // Create new service record
  create: async (
    data: Omit<ServiceRecord, "id" | "userId" | "createdAt" | "updatedAt">
  ): Promise<ServiceRecord> => {
    const response = await api.post<{ data: ServiceRecord }>(
      "/service-records",
      data
    );
    return response.data.data;
  },

  // Update existing service record
  update: async (
    id: string,
    data: Partial<ServiceRecord>
  ): Promise<ServiceRecord> => {
    const response = await api.put<ServiceRecord>(
      `/service-records/${id}`,
      data
    );
    return response.data;
  },

  // Delete service record
  delete: async (id: string): Promise<void> => {
    await api.delete(`/service-records/${id}`);
  },
};

export default api;
