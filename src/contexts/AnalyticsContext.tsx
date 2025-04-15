
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "./AuthContext";

// Define analytics data interfaces
export interface ProductView {
  productId: string;
  productName: string;
  timestamp: Date;
  userId: string;
}

export interface UserLogin {
  userId: string;
  userName: string;
  userRole: UserRole;
  timestamp: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  total: number;
  timestamp: Date;
}

// Define analytics context interface
interface AnalyticsContextType {
  productViews: ProductView[];
  userLogins: UserLogin[];
  transactions: Transaction[];
  recordProductView: (productId: string, productName: string, userId: string) => void;
  recordUserLogin: (user: User) => void;
  recordTransaction: (transaction: Omit<Transaction, "timestamp">) => void;
  getProductViewStats: () => { productId: string; productName: string; count: number }[];
  getUserRoleStats: () => { role: UserRole; count: number }[];
  getSalesStats: () => { date: string; sales: number }[];
}

// Create context with default values
const AnalyticsContext = createContext<AnalyticsContextType>({
  productViews: [],
  userLogins: [],
  transactions: [],
  recordProductView: () => {},
  recordUserLogin: () => {},
  recordTransaction: () => {},
  getProductViewStats: () => [],
  getUserRoleStats: () => [],
  getSalesStats: () => []
});

// Generate some sample data
const generateSampleData = () => {
  // Sample users for reference
  const users = [
    { id: "1", name: "Admin User", role: UserRole.ADMIN },
    { id: "2", name: "Friend User", role: UserRole.FRIEND },
    { id: "3", name: "Normal User", role: UserRole.NORMAL },
    { id: "4", name: "Opponent User", role: UserRole.OPPONENT }
  ];
  
  // Sample products for reference
  const products = [
    { id: "1", name: "Laptop Pro" },
    { id: "2", name: "Ergonomic Chair" },
    { id: "3", name: "Mechanical Keyboard" },
    { id: "4", name: "Wireless Mouse" },
    { id: "5", name: "LED Desk Lamp" },
    { id: "6", name: "Monitor Stand" }
  ];
  
  // Generate product views
  const productViews: ProductView[] = [];
  for (let i = 0; i < 50; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const product = products[Math.floor(Math.random() * products.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    
    productViews.push({
      productId: product.id,
      productName: product.name,
      userId: user.id,
      timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
    });
  }
  
  // Generate user logins
  const userLogins: UserLogin[] = [];
  for (let i = 0; i < 40; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    
    userLogins.push({
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
    });
  }
  
  // Generate transactions
  const transactions: Transaction[] = [];
  for (let i = 0; i < 20; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const daysAgo = Math.floor(Math.random() * 30);
    const numItems = Math.floor(Math.random() * 3) + 1;
    const items = [];
    let total = 0;
    
    for (let j = 0; j < numItems; j++) {
      const product = products[Math.floor(Math.random() * products.length)];
      const quantity = Math.floor(Math.random() * 3) + 1;
      const price = Math.floor(Math.random() * 200) + 50;
      const itemTotal = price * quantity;
      
      items.push({
        productId: product.id,
        productName: product.name,
        quantity,
        price
      });
      
      total += itemTotal;
    }
    
    transactions.push({
      id: `tr-${i + 1}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      items,
      total,
      timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
    });
  }
  
  return { productViews, userLogins, transactions };
};

export const AnalyticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize with sample data
  const { productViews: initialViews, userLogins: initialLogins, transactions: initialTransactions } = generateSampleData();
  
  const [productViews, setProductViews] = useState<ProductView[]>(initialViews);
  const [userLogins, setUserLogins] = useState<UserLogin[]>(initialLogins);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  
  // Record a product view
  const recordProductView = (productId: string, productName: string, userId: string) => {
    const newView: ProductView = {
      productId,
      productName,
      userId,
      timestamp: new Date()
    };
    
    setProductViews(prev => [...prev, newView]);
  };
  
  // Record a user login
  const recordUserLogin = (user: User) => {
    const newLogin: UserLogin = {
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      timestamp: new Date()
    };
    
    setUserLogins(prev => [...prev, newLogin]);
  };
  
  // Record a transaction
  const recordTransaction = (transaction: Omit<Transaction, "timestamp">) => {
    const newTransaction: Transaction = {
      ...transaction,
      timestamp: new Date()
    };
    
    setTransactions(prev => [...prev, newTransaction]);
  };
  
  // Get product view statistics
  const getProductViewStats = () => {
    const stats: Record<string, { productId: string; productName: string; count: number }> = {};
    
    productViews.forEach(view => {
      if (!stats[view.productId]) {
        stats[view.productId] = {
          productId: view.productId,
          productName: view.productName,
          count: 0
        };
      }
      
      stats[view.productId].count += 1;
    });
    
    return Object.values(stats).sort((a, b) => b.count - a.count);
  };
  
  // Get user role statistics
  const getUserRoleStats = () => {
    const stats: Record<string, { role: UserRole; count: number }> = {
      [UserRole.ADMIN]: { role: UserRole.ADMIN, count: 0 },
      [UserRole.FRIEND]: { role: UserRole.FRIEND, count: 0 },
      [UserRole.NORMAL]: { role: UserRole.NORMAL, count: 0 },
      [UserRole.OPPONENT]: { role: UserRole.OPPONENT, count: 0 }
    };
    
    userLogins.forEach(login => {
      stats[login.userRole].count += 1;
    });
    
    return Object.values(stats);
  };
  
  // Get sales statistics by date
  const getSalesStats = () => {
    const stats: Record<string, { date: string; sales: number }> = {};
    
    transactions.forEach(transaction => {
      const date = transaction.timestamp.toISOString().split('T')[0];
      
      if (!stats[date]) {
        stats[date] = {
          date,
          sales: 0
        };
      }
      
      stats[date].sales += transaction.total;
    });
    
    return Object.values(stats).sort((a, b) => a.date.localeCompare(b.date));
  };
  
  return (
    <AnalyticsContext.Provider
      value={{
        productViews,
        userLogins,
        transactions,
        recordProductView,
        recordUserLogin,
        recordTransaction,
        getProductViewStats,
        getUserRoleStats,
        getSalesStats
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  );
};

// Hook for easy context usage
export const useAnalytics = () => useContext(AnalyticsContext);

export default AnalyticsContext;
