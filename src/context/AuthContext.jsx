import { AuthContext } from "./useAuth"; 
import { useAuth } from "./useAuth";


export const AuthProvider = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};





// import React, { createContext, useContext, useState, useEffect } from 'react';


// import api from '../services/api';

// // إنشاء سياق المصادقة
// const AuthContext = createContext();

// // مزود سياق المصادقة
// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // التحقق من حالة المصادقة عند تحميل التطبيق
//   useEffect(() => {
//     const checkAuthStatus = async () => {
//       const token = localStorage.getItem('token');
      
//       if (!token) {
//         setLoading(false);
//         return;
//       }
      
//       try {
//         const response = await api.get('/users/me');
//         setUser(response.data.user);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//         localStorage.removeItem('token');
//         localStorage.removeItem('refreshToken');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     checkAuthStatus();
//   }, []);

//   // تسجيل الدخول
//   const login = async (email, password) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await api.post('/auth/login', { email, password });
//       const { token, refresh_token, user } = response.data;
      
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refresh_token);
      
//       setUser(user);
//       return user;
//     } catch (error) {
//       setError(error.response?.data?.message || 'حدث خطأ أثناء تسجيل الدخول');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // تسجيل مستخدم جديد
//   const register = async (userData) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await api.post('/auth/register', userData);
//       const { token, refresh_token, user } = response.data;
      
//       localStorage.setItem('token', token);
//       localStorage.setItem('refreshToken', refresh_token);
      
//       setUser(user);
//       return user;
//     } catch (error) {
//       setError(error.response?.data?.message || 'حدث خطأ أثناء التسجيل');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // تسجيل الخروج
//   const logout = async () => {
//     try {
//       await api.post('/auth/logout');
//     } catch (error) {
//       console.error('Error during logout:', error);
//     } finally {
//       localStorage.removeItem('token');
//       localStorage.removeItem('refreshToken');
//       setUser(null);
//     }
//   };

//   // تحديث بيانات المستخدم
//   const updateUserData = async (userData) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await api.put('/users/me', userData);
//       setUser(response.data.user);
      
//       return response.data.user;
//     } catch (error) {
//       setError(error.response?.data?.message || 'حدث خطأ أثناء تحديث البيانات');
//       throw error;
//     } finally {
//       setLoading(false);
//     }
//   };

//   // القيم التي سيتم توفيرها للمكونات
//   const value = {
//     user,
//     loading,
//     error,
//     login,
//     register,
//     logout,
//     updateUserData,
//   };

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };

// // هوك مخصص لاستخدام سياق المصادقة
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

// export default AuthContext;
