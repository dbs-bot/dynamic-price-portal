
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProducts, Product } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { products } = useProducts();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { recordProductView } = useAnalytics();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  
  // Find product
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      const foundProduct = products.find(p => p.id === id);
      setProduct(foundProduct || null);
      setIsLoading(false);
      
      // Record view if product is found and user is logged in
      if (foundProduct && user) {
        recordProductView(foundProduct.id, foundProduct.name, user.id);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [id, products, user, recordProductView]);
  
  // Handle adding to cart
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  // Get price display based on user role
  const getPriceDisplay = () => {
    if (!product) return null;
    if (!user) return <span className="text-2xl font-bold">{formatPrice(product.basePrice)}</span>;
    
    switch (user.role) {
      case UserRole.FRIEND:
        return (
          <div className="space-y-1">
            <span className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</span>
            <div className="flex items-center gap-2">
              <span className="text-gray-500 line-through">{formatPrice(product.basePrice)}</span>
              <Badge className="bg-green-100 text-green-800 hover:bg-green-100">20% DISCOUNT</Badge>
            </div>
          </div>
        );
      case UserRole.OPPONENT:
        return (
          <div className="space-y-1">
            <span className="text-2xl font-bold text-red-600">{formatPrice(product.price)}</span>
            <Badge className="bg-red-100 text-red-800 hover:bg-red-100">PREMIUM PRICE</Badge>
          </div>
        );
      default:
        return <span className="text-2xl font-bold">{formatPrice(product.price)}</span>;
    }
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="animate-pulse py-8">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="h-80 bg-gray-200 rounded"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3 mt-6"></div>
              <div className="h-10 bg-gray-200 rounded w-1/2 mt-6"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!product) {
    return (
      <Layout>
        <div className="py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-600 mb-8">The product you are looking for does not exist or has been removed.</p>
          <Button onClick={() => navigate("/products")}>
            Browse Products
          </Button>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/products")}
          className="mb-6"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Back to Products
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg overflow-hidden shadow-lg">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-80 object-cover"
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <Badge className="mb-4">{product.category}</Badge>
              <p className="text-gray-600">{product.description}</p>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <div>
                {getPriceDisplay()}
              </div>
              
              <div className="flex items-center">
                <Badge variant={product.stock > 0 ? "outline" : "secondary"} className="text-sm">
                  {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                </Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-32">
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full rounded-md border-gray-300 py-2 pl-3 pr-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    disabled={product.stock === 0}
                  >
                    {[...Array(Math.min(10, product.stock)).keys()].map((i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <Button
                onClick={handleAddToCart}
                className="w-full md:w-auto"
                size="lg"
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
            
            <Card className="mt-6">
              <CardContent className="p-4">
                <h3 className="font-medium mb-2">Price Information</h3>
                <p className="text-sm text-gray-600">
                  {!user && (
                    <>
                      Login to see personalized pricing. Friends/Partners receive a 20% discount on products!
                    </>
                  )}
                  {user?.role === UserRole.FRIEND && (
                    <>
                      As a Friend/Partner, you receive a 20% discount on all products!
                    </>
                  )}
                  {user?.role === UserRole.NORMAL && (
                    <>
                      As a Normal User, you see regular pricing without any adjustments.
                    </>
                  )}
                  {user?.role === UserRole.OPPONENT && (
                    <>
                      As an Opponent/Rival, your pricing includes a 20% premium.
                    </>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
