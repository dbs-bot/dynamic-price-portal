
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import LoginForm from "@/components/auth/LoginForm";
import RegisterForm from "@/components/auth/RegisterForm";

const AuthPage: React.FC = () => {
  const { user } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }
  
  const toggleForm = () => {
    setIsLogin(!isLogin);
  };
  
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center pt-12">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">Welcome to DynamicPrice</h1>
          <p className="text-gray-600 mt-2">
            {isLogin ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>
        
        {isLogin ? (
          <LoginForm onToggleForm={toggleForm} />
        ) : (
          <RegisterForm onToggleForm={toggleForm} />
        )}
      </div>
    </Layout>
  );
};

export default AuthPage;
