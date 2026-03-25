import axios from "axios";
import { jwtDecode } from "jwt-decode";

// ==================== Django Auth API ====================
const DJANGO_API = axios.create({
  baseURL: "http://98.93.254.237",
});

// Axios Interceptor for Token Refresh
let isRefreshing = false;
let refreshSubscribers = [];
let refreshTimer = null;

const scheduleTokenRefresh = (token) => {
  if (refreshTimer) clearTimeout(refreshTimer);

  try {
    const decoded = jwtDecode(token);
    const expiryTime = decoded.exp * 1000;
    const currentTime = Date.now();
    const timeUntilExpiry = expiryTime - currentTime;

    // Refresh 1 minute before expiry, or immediately if already expired/near expiry
    const refreshDelay = Math.max(0, timeUntilExpiry - 60000);

    console.log(`Scheduling token refresh in ${Math.round(refreshDelay / 1000 / 60)} minutes`);

    refreshTimer = setTimeout(async () => {
      console.log("Proactively refreshing token...");
      try {
        const refreshToken = localStorage.getItem("refreshToken")?.replace(/^"|"$/g, '')
        if (refreshToken) {
          const res = await axios.post("http://98.93.254.237/user/login/refresh/", {
            refresh: refreshToken,
          });
          const newAccessToken = res.data.access;
          localStorage.setItem("accessToken", newAccessToken);
          scheduleTokenRefresh(newAccessToken);
        }
      } catch (err) {
        console.error("Proactive refresh failed:", err);
      }
    }, refreshDelay);
  } catch (error) {
    console.error("Failed to decode token for scheduling refresh:", error);
  }
};

export const initRefresh = () => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    scheduleTokenRefresh(token);
  }
};

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (token) => {
  refreshSubscribers.map((cb) => cb(token));
  refreshSubscribers = [];
};

DJANGO_API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config, response } = error;
    const originalRequest = config;

    if (response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(DJANGO_API(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken")?.replace(/^"|"$/g, '');
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const res = await axios.post("http://98.93.254.237/user/login/refresh/", {
          refresh: refreshToken,
        });

        const newAccessToken = res.data.access;
        localStorage.setItem("accessToken", newAccessToken);

        isRefreshing = false;
        onRefreshed(newAccessToken);
        scheduleTokenRefresh(newAccessToken); // Schedule next refresh

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return DJANGO_API(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        console.error("Token refresh failed:", refreshError);
        
        // Prevent redirect loop if already on login page
        if (window.location.pathname !== "/login") {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("isAdmin");
            window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const registerDjangoUser = (data) => DJANGO_API.post("/user/register/", data);

export const loginDjangoUser = (data) =>
  DJANGO_API.post("/user/login/", data).then(res => {
    if (res.data.access) {
      scheduleTokenRefresh(res.data.access);
    }
    return res;
  });

export const googleLogin = (data) =>
  DJANGO_API.post("/user/google/", data);

export const logoutDjangoUser = (data, token) =>
  DJANGO_API.post("/user/logout/", data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

export const getProfile = (token) =>
  DJANGO_API.get("/user/profile/", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }).catch(err => {
    if (window.location.pathname === "/login") {
        throw err; 
    }
    return Promise.reject(err);
  });

// ==================== Users (Legacy JSON-Server) ====================

export const getAllUsers = (token) =>
  DJANGO_API.get("/api/user/",{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

export const updateUsers = (id, data, token) =>
  DJANGO_API.patch(`/api/user/update/${id}/`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

export const DeleteUsers = (id,token) =>
  DJANGO_API.delete(`/api/user/delete/${id}/`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

//=========dashboardStuse===========
export const getDashboardStats = (token) =>
  DJANGO_API.get('/api/dashboard/stats/', {
    headers: { Authorization: `Bearer ${token}` }
  });

//===============Orders==============
export const getAllOrders = (token, page = 1) =>
  DJANGO_API.get(`/api/orders/list/?page=${page}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const OrderUpdate = (token, id, data) =>
  DJANGO_API.patch(`/api/orders/update/${id}/`,
    { status: data },
    { headers: { Authorization: `Bearer ${token}` } })

//================Products================
export const getAllProducts = (token, search = '', brand = '', page = 1) => {
  const isValidToken = token && typeof token === 'string' && token !== 'undefined' && token !== 'null';
  const config = {
    params: {
      ...(search && { search }),
      ...(brand && { brand }),
      page,                
    },
    ...(isValidToken && { headers: { Authorization: `Bearer ${token}` } })
  };
  return DJANGO_API.get("api/product/products/", config);
};

export const getProductByIdDjango = (id, token) => {
  const isValidToken = token && typeof token === 'string' && token !== 'undefined' && token !== 'null';
  const config = isValidToken ? { headers: { Authorization: `Bearer ${token}` } } : {};
  return DJANGO_API.get(`api/product/products/${id}/`, config);
};

export const addProducts = (token,data) => 
  DJANGO_API.post('/api/product/addproducts/',data,{
    headers: { Authorization: `Bearer ${token}` } 
  });

export const updateProduct = (id, data, token) =>
  DJANGO_API.patch(`/api/product/products/${id}/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const deleteProducts = (id,token) =>
  DJANGO_API.delete(`/api/product/products/${id}/`,{
    headers: { Authorization: `Bearer ${token}` }
  });

export const getBrands = (token) => 
  DJANGO_API.get('/api/product/brands/',{
    headers: { Authorization: `Bearer ${token}` } 
  });

// ==================== Cart API (Django) ====================

export const getCart = (token) =>
  DJANGO_API.get("/api/cart/", {
    headers: { Authorization: `Bearer ${token}` }
  });

export const addToCart = (data, token) =>
  DJANGO_API.post("/api/cart/", data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const removeFromCart = (id, token) =>
  DJANGO_API.delete(`/api/cart/${id}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateCartItem = (id, data, token) =>
  DJANGO_API.patch(`/api/cart/${id}/`, data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const clearCart = (token) =>
  DJANGO_API.delete("/api/cart/clear/", {
    headers: { Authorization: `Bearer ${token}` }
  });

// ==================== Order API (Django) ====================

export const createOrder = (data, token) =>
  DJANGO_API.post("/api/order/", data, {
    headers: { Authorization: `Bearer ${token}` }
  });

export const getOrders = (token) =>
  DJANGO_API.get("/api/order/", {
    headers: { Authorization: `Bearer ${token}` }
  });

export const updateOrder= (id,token,data) =>
  DJANGO_API.patch(`/api/order/${id}/`,
    {status: data},
    {headers: { Authorization: `Bearer ${token}` }})