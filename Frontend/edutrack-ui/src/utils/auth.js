import apiClient from '../api/axios';

export const roles = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN'
};

export const saveUserSession = (userData, password) => {
  localStorage.setItem("userId", userData.id || userData.userId);
  localStorage.setItem("role", userData.role);
  localStorage.setItem("name", userData.name);
  localStorage.setItem("email", userData.email || "");
  
  if (password) {
    const authString = btoa(`${userData.email}:${password}`);
    localStorage.setItem("authToken", authString);
  }

  if (userData.role === "STUDENT" && userData.studentId) {
    localStorage.setItem("studentId", userData.studentId);
  } else {
    localStorage.removeItem("studentId");
  }
};

export const getUserSession = () => {
  return {
    userId: localStorage.getItem("userId"),
    studentId: localStorage.getItem("studentId"),
    role: localStorage.getItem("role"),
    name: localStorage.getItem("name"),
    email: localStorage.getItem("email"),
    authToken: localStorage.getItem("authToken"),
  };
};

export const clearUserSession = () => {
  localStorage.removeItem("userId");
  localStorage.removeItem("studentId");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  localStorage.removeItem("email");
  localStorage.removeItem("authToken");
};

export const isAuthenticated = () => !!localStorage.getItem("userId");

export const getUserRole = () => localStorage.getItem("role");

export const getDataFetchId = () => {
  const role = localStorage.getItem("role");
  const studentId = localStorage.getItem("studentId");
  const userId = localStorage.getItem("userId");
  if (role === "STUDENT" && studentId && studentId !== "undefined") {
    return studentId;
  }
  return userId;
};

export const signup = async (formData) => {
  try {
    const response = await apiClient.post('/auth/signup', formData);
    return response.data;
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Signup failed. Please try again.'
    };
  }
};