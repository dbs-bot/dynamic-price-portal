
import React from "react";
import { CartItem as CartItemType } from "@/contexts/CartContext";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CartItemProps {
  item: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      updateQuantity(item.product.id, newQuantity);
    }
  };
  
  const decrementQuantity = () => {
    if (item.quantity > 1) {
      updateQuantity(item.product.id, item.quantity - 1);
    } else {
      removeFromCart(item.product.id);
    }
  };
  
  const incrementQuantity = () => {
    updateQuantity(item.product.id, item.quantity + 1);
  };
  
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 border-b">
      <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
        <img
          src={item.product.image}
          alt={item.product.name}
          className="w-20 h-20 object-cover rounded"
        />
      </div>
      
      <div className="flex-grow">
        <h3 className="text-lg font-medium">{item.product.name}</h3>
        <p className="text-gray-500 text-sm line-clamp-1 mb-2">{item.product.description}</p>
        <p className="font-medium">{formatPrice(item.product.price)}</p>
      </div>
      
      <div className="flex items-center mt-4 sm:mt-0">
        <div className="flex items-center border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none rounded-l-md"
            onClick={decrementQuantity}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-minus">
              <path d="M5 12h14"/>
            </svg>
            <span className="sr-only">Decrease</span>
          </Button>
          
          <Input
            type="number"
            min="1"
            value={item.quantity}
            onChange={handleQuantityChange}
            className="w-12 h-9 text-center p-0 border-none"
          />
          
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-none rounded-r-md"
            onClick={incrementQuantity}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
              <path d="M5 12h14"/><path d="M12 5v14"/>
            </svg>
            <span className="sr-only">Increase</span>
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          className="ml-2 text-gray-500 hover:text-red-500"
          onClick={() => removeFromCart(item.product.id)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
            <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>
          </svg>
          <span className="sr-only">Remove</span>
        </Button>
      </div>
    </div>
  );
};

export default CartItem;
