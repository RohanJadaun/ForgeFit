import { apiClient } from "./apiClient";

export const registerUser = async (userData) => {
  const { data } = await apiClient.post("/auth/register", userData);
  return data;
};

export const loginUser = async (credentials) => {
  const { data } = await apiClient.post("/auth/login", credentials);
  return data;
};

export const getCurrentUser = async () => {
  const { data } = await apiClient.get("/auth/me");
  return data;
};

export const logoutUser = async () => {
  const { data } = await apiClient.post("/auth/logout");
  return data;
};

export const requestPasswordReset = async (email) => {
  const { data } = await apiClient.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (token, password) => {
  const { data } = await apiClient.post("/auth/reset-password", { token, password });
  return data;
};
