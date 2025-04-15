
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { useProducts } from "@/contexts/ProductContext";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/products/ProductGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { recordUserLogin } = useAnalytics();
  const { products } = useProducts();
  
  // Record user login on page visit
  useEffect(() => {
    if (user) {
      recordUserLogin(user);
    }
  }, [user, recordUserLogin]);
  
  // Get featured products (first 4)
  const featuredProducts = products.slice(0, 4);
  
  // Get role display
  const getRoleDisplay = () => {
    if (!user) return null;
    
    switch (user.role) {
      case UserRole.FRIEND:
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            Friend/Partner - You receive 20% discount on all products!
          </Badge>
        );
      case UserRole.OPPONENT:
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            Opponent/Rival - Premium pricing applied
          </Badge>
        );
      case UserRole.ADMIN:
        return (
          <Badge className="bg-purple-500 hover:bg-purple-600">
            Admin - You have access to the admin dashboard
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            Normal User - Regular pricing
          </Badge>
        );
    }
  };
  
  return (
    <Layout>
      <section className="py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Welcome to DynamicPrice</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dynamic product pricing based on user roles. Explore our products with
            personalized pricing just for you.
          </p>
          
          {user ? (
            <div className="mt-6 flex flex-col items-center">
              <p className="text-lg font-medium mb-2">
                Hello, {user.name}
              </p>
              <div>{getRoleDisplay()}</div>
              
              {user.role === UserRole.ADMIN && (
                <div className="mt-4">
                  <Link to="/admin">
                    <Button variant="outline">
                      Go to Admin Dashboard
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6">
              <Link to="/auth">
                <Button>
                  Login to See Your Personalized Prices
                </Button>
              </Link>
            </div>
          )}
        </div>
        
        <Card className="mb-12 bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Role-Based Pricing</h3>
                <p className="text-gray-600">
                  Different prices for different user roles. Friends get discounts, rivals pay premium.
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"/><polyline points="2.32 6.16 12 11 21.68 6.16"/><line x1="12" y1="22.76" y2="11"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">CSV Integration</h3>
                <p className="text-gray-600">
                  Admin can upload product data via CSV, simulating AWS S3 integration.
                </p>
              </div>
              
              <div className="text-center p-4">
                <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Analytics Dashboard</h3>
                <p className="text-gray-600">
                  Admin can view product performance, user activity, and sales data.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Featured Products</h2>
            <Link to="/products">
              <Button variant="outline">View All Products</Button>
            </Link>
          </div>
          
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
