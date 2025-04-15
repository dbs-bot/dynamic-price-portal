
import React from "react";
import { Link } from "react-router-dom";
import { Product } from "@/contexts/ProductContext";
import { useCart } from "@/contexts/CartContext";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { recordProductView } = useAnalytics();
  
  // Record product view when card is rendered
  React.useEffect(() => {
    if (user) {
      recordProductView(product.id, product.name, user.id);
    }
  }, [product.id, product.name, recordProductView, user]);
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  // Get price display based on user role
  const getPriceDisplay = () => {
    if (!user) return formatPrice(product.basePrice);
    
    switch (user.role) {
      case UserRole.FRIEND:
        return (
          <div className="flex flex-col">
            <span className="text-lg font-bold text-green-600">{formatPrice(product.price)}</span>
            <span className="text-sm text-gray-500 line-through">{formatPrice(product.basePrice)}</span>
            <Badge className="w-fit mt-1 bg-green-100 text-green-800 hover:bg-green-100">20% DISCOUNT</Badge>
          </div>
        );
      case UserRole.OPPONENT:
        return (
          <div className="flex flex-col">
            <span className="text-lg font-bold text-red-600">{formatPrice(product.price)}</span>
            <Badge className="w-fit mt-1 bg-red-100 text-red-800 hover:bg-red-100">PREMIUM PRICE</Badge>
          </div>
        );
      default:
        return (
          <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
        );
    }
  };
  
  const handleAddToCart = () => {
    addToCart(product, 1);
  };
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <Link to={`/products/${product.id}`}>
        <div className="h-48 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link to={`/products/${product.id}`} className="block">
          <h3 className="text-lg font-semibold line-clamp-1 mb-1">{product.name}</h3>
          <p className="text-sm text-gray-500 line-clamp-2 h-10 mb-2">{product.description}</p>
        </Link>
        <div className="flex justify-between items-start mt-2">
          <div>
            {getPriceDisplay()}
          </div>
          <Badge variant={product.stock > 0 ? "outline" : "secondary"} className="text-xs">
            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart} 
          className="w-full"
          disabled={product.stock === 0}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
