
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import CsvUpload from "@/components/admin/CsvUpload";
import ProductTable from "@/components/admin/ProductTable";
import UserTable from "@/components/admin/UserTable";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  
  // Redirect if not admin
  if (!user || user.role !== UserRole.ADMIN) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Manage products, users, and view analytics
        </p>
        
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid grid-cols-4 max-w-md">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="upload">CSV Upload</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>
                  View and edit your products
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProductTable />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  Manage users and their roles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserTable />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="upload">
            <CsvUpload />
          </TabsContent>
          
          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  View sales data, user activity, and product performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AnalyticsDashboard />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
