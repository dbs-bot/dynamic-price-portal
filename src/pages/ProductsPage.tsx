
import React from "react";
import { useProducts } from "@/contexts/ProductContext";
import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilter from "@/components/products/ProductFilter";

const ProductsPage: React.FC = () => {
  const { filteredProducts, isLoading } = useProducts();
  
  return (
    <Layout>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        
        <ProductFilter />
        
        <ProductGrid 
          products={filteredProducts} 
          isLoading={isLoading} 
        />
      </div>
    </Layout>
  );
};

export default ProductsPage;
