
import React, { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const CartSummary: React.FC = () => {
  const { items, totalPrice, clearCart, checkout, isCheckingOut } = useCart();
  const { user } = useAuth();
  const { recordTransaction } = useAnalytics();
  const navigate = useNavigate();
  
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  
  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };
  
  const handleCheckout = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    
    setShowCheckoutModal(true);
  };
  
  const processCheckout = async () => {
    try {
      // Record the transaction for analytics
      recordTransaction({
        id: `tr-${Date.now()}`,
        userId: user!.id,
        userName: user!.name,
        userRole: user!.role,
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        total: totalPrice
      });
      
      // Process checkout (clears cart)
      await checkout();
      
      // Show confirmation
      setCheckoutComplete(true);
    } catch (error) {
      console.error("Checkout error:", error);
    }
  };
  
  const completeCheckout = () => {
    setShowCheckoutModal(false);
    setCheckoutComplete(false);
    navigate("/");
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>{formatPrice(totalPrice * 0.08)}</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatPrice(totalPrice * 1.08)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex-col space-y-2">
          <Button 
            onClick={handleCheckout} 
            className="w-full"
            disabled={items.length === 0 || isCheckingOut}
          >
            {isCheckingOut ? "Processing..." : "Proceed to Checkout"}
          </Button>
          <Button 
            variant="outline"
            onClick={() => clearCart()}
            className="w-full"
            disabled={items.length === 0 || isCheckingOut}
          >
            Clear Cart
          </Button>
        </CardFooter>
      </Card>
      
      <Dialog open={showCheckoutModal} onOpenChange={setShowCheckoutModal}>
        <DialogContent className="sm:max-w-md">
          {!checkoutComplete ? (
            <>
              <DialogHeader>
                <DialogTitle>Complete Your Order</DialogTitle>
                <DialogDescription>
                  This is a demo checkout process. No real payment will be processed.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Order Summary</h4>
                  <div className="text-sm space-y-1">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between">
                        <span>
                          {item.product.name} x {item.quantity}
                        </span>
                        <span>{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (8%)</span>
                    <span>{formatPrice(totalPrice * 0.08)}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2">
                    <span>Total</span>
                    <span>{formatPrice(totalPrice * 1.08)}</span>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="sm:justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowCheckoutModal(false)}
                  disabled={isCheckingOut}
                >
                  Cancel
                </Button>
                <Button
                  onClick={processCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? "Processing..." : "Complete Order"}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Order Confirmed!</DialogTitle>
                <DialogDescription>
                  Your order has been successfully processed.
                </DialogDescription>
              </DialogHeader>
              
              <div className="flex justify-center py-6">
                <div className="rounded-full bg-green-100 p-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
              </div>
              
              <div className="text-center space-y-2">
                <p className="font-medium">Thank you for your order!</p>
                <p className="text-sm text-gray-500">
                  This is a demo application. In a real application, you would
                  receive an email confirmation with your order details.
                </p>
              </div>
              
              <DialogFooter className="sm:justify-center">
                <Button onClick={completeCheckout}>
                  Continue Shopping
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CartSummary;
