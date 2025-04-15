
import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth, UserRole } from "./AuthContext";

// Define product interface
export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  price: number; // Calculated price after role discount/markup
  stock: number;
  image: string;
  category: string;
}

// Define product context interface
interface ProductContextType {
  products: Product[];
  filteredProducts: Product[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  categories: string[];
  uploadProducts: (products: Omit<Product, "price">[]) => void;
  updateProduct: (id: string, product: Partial<Omit<Product, "id" | "price">>) => void;
  deleteProduct: (id: string) => void;
  isLoading: boolean;
}

// Create context with default values
const ProductContext = createContext<ProductContextType>({
  products: [],
  filteredProducts: [],
  searchTerm: "",
  setSearchTerm: () => {},
  filterCategory: "all",
  setFilterCategory: () => {},
  categories: [],
  uploadProducts: () => {},
  updateProduct: () => {},
  deleteProduct: () => {},
  isLoading: false
});

// Sample products for demo
const initialProducts: Omit<Product, "price">[] = [
  {
    id: "1",
    name: "Laptop Pro",
    description: "High-performance laptop for professionals",
    basePrice: 1200,
    stock: 10,
    image: "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=500&auto=format",
    category: "Electronics"
  },
  {
    id: "2",
    name: "Ergonomic Chair",
    description: "Comfortable office chair with lumbar support",
    basePrice: 300,
    stock: 25,
    image: "https://images.unsplash.com/photo-1519947486511-46149fa0a254?w=500&auto=format",
    category: "Furniture"
  },
  {
    id: "3",
    name: "Mechanical Keyboard",
    description: "Tactile mechanical keyboard for typing enthusiasts",
    basePrice: 150,
    stock: 30,
    image: "https://images.unsplash.com/photo-1627483297886-49710ae1fc22?w=500&auto=format",
    category: "Electronics"
  },
  {
    id: "4",
    name: "Wireless Mouse",
    description: "Precise wireless mouse with long battery life",
    basePrice: 80,
    stock: 45,
    image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=500&auto=format",
    category: "Electronics"
  },
  {
    id: "5",
    name: "LED Desk Lamp",
    description: "Adjustable LED desk lamp with multiple brightness levels",
    basePrice: 50,
    stock: 60,
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500&auto=format",
    category: "Home Office"
  },
  {
    id: "6",
    name: "Monitor Stand",
    description: "Adjustable monitor stand for better ergonomics",
    basePrice: 65,
    stock: 40,
    image: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=500&auto=format",
    category: "Accessories"
  }
];

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [baseProducts, setBaseProducts] = useState<Omit<Product, "price">[]>(initialProducts);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  
  // Calculate prices based on user role
  useEffect(() => {
    const productsWithPrices = baseProducts.map(product => {
      let price = product.basePrice;
      
      // Apply role-based pricing
      if (user) {
        switch (user.role) {
          case UserRole.FRIEND:
            // Friends get 20% discount
            price = product.basePrice * 0.8;
            break;
          case UserRole.OPPONENT:
            // Opponents pay 20% more
            price = product.basePrice * 1.2;
            break;
          default:
            // Normal users pay regular price
            price = product.basePrice;
        }
      }
      
      return {
        ...product,
        price
      };
    });
    
    setProducts(productsWithPrices);
  }, [baseProducts, user]);
  
  // Get unique categories
  const categories = [...new Set(products.map(product => product.category))];
  
  // Filter products based on search term and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Upload new products (simulating CSV upload)
  const uploadProducts = (newProducts: Omit<Product, "price">[]) => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setBaseProducts(newProducts);
      setIsLoading(false);
    }, 1000);
  };
  
  // Update a product
  const updateProduct = (id: string, updatedFields: Partial<Omit<Product, "id" | "price">>) => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setBaseProducts(prevProducts => 
        prevProducts.map(product => 
          product.id === id ? { ...product, ...updatedFields } : product
        )
      );
      setIsLoading(false);
    }, 500);
  };
  
  // Delete a product
  const deleteProduct = (id: string) => {
    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      setBaseProducts(prevProducts => prevProducts.filter(product => product.id !== id));
      setIsLoading(false);
    }, 500);
  };
  
  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        searchTerm,
        setSearchTerm,
        filterCategory,
        setFilterCategory,
        categories,
        uploadProducts,
        updateProduct,
        deleteProduct,
        isLoading
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

// Hook for easy context usage
export const useProducts = () => useContext(ProductContext);

export default ProductContext;
