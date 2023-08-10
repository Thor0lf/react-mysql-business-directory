import http from "../http-common";
import jwt_decode from "jwt-decode";

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await http.post("/login", { email, password });
      localStorage.setItem("accessToken", response.data.accessToken);
      return response.data;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
  },
  logout: () => {
    localStorage.removeItem("accessToken");
    window.location.href = "/login";
  },
  getCurrentUser: () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      const decodedToken = jwt_decode(token);
      const currentTime = Math.ceil(Date.now() / 1000);
      if (decodedToken.exp < currentTime) {
        AuthService.logout();
      }
      return decodedToken;
    }
  },
  getAuthHeaders: () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      return { Authorization: `${token}` };
    } else {
      return {};
    }
  },
};

export default AuthService;