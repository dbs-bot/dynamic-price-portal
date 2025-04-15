
import React, { useState } from "react";
import { useProducts, Product } from "@/contexts/ProductContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CsvUpload: React.FC = () => {
  const { uploadProducts } = useProducts();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setUploadStatus(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus({
        type: "error",
        message: "Please select a CSV file."
      });
      return;
    }

    if (!file.name.endsWith('.csv')) {
      setUploadStatus({
        type: "error",
        message: "Please upload a valid CSV file."
      });
      return;
    }

    setUploading(true);
    setUploadStatus(null);

    try {
      // Parse CSV (in this demo app, we do it locally)
      const text = await file.text();
      
      // Process the CSV text
      console.log("CSV content:", text);
      
      // Split into rows and trim empty rows
      const rows = text.split('\n').filter(row => row.trim() !== '');
      console.log("Rows:", rows);
      
      if (rows.length < 2) {
        throw new Error("CSV file must have a header row and at least one data row");
      }
      
      // Extract headers
      const headers = rows[0].split(',').map(header => header.trim());
      console.log("Headers:", headers);
      
      // Validate required columns
      const requiredColumns = ['id', 'name', 'description', 'basePrice', 'stock', 'image', 'category'];
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));
      
      if (missingColumns.length > 0) {
        throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
      }
      
      // Parse data rows
      const products: Omit<Product, "price">[] = [];
      
      for (let i = 1; i < rows.length; i++) {
        // Skip empty rows
        if (!rows[i].trim()) continue;
        
        const values = rows[i].split(',');
        // Ensure we have the correct number of values
        if (values.length !== headers.length) {
          console.warn(`Row ${i} has ${values.length} values but should have ${headers.length}. Skipping.`);
          continue;
        }
        
        // Create product object
        const product: any = {};
        
        // Populate product object from CSV data
        headers.forEach((header, index) => {
          const value = values[index]?.trim();
          
          if (header === 'basePrice' || header === 'stock') {
            product[header] = parseFloat(value) || 0;
          } else {
            product[header] = value || '';
          }
        });
        
        products.push(product as Omit<Product, "price">);
      }
      
      console.log("Parsed products:", products);
      
      if (products.length === 0) {
        throw new Error("No valid products found in CSV file");
      }
      
      // Upload products to the store
      uploadProducts(products);

      setUploadStatus({
        type: "success",
        message: `Successfully processed ${products.length} products.`
      });
    } catch (error) {
      console.error('CSV upload error:', error);
      setUploadStatus({
        type: "error",
        message: error instanceof Error ? error.message : "An error occurred while processing the CSV file."
      });
    } finally {
      setUploading(false);
    }
  };

  const handleClearFile = () => {
    setFile(null);
    setUploadStatus(null);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Product CSV</CardTitle>
        <CardDescription>
          Upload a CSV file to update product inventory. The file should contain columns for id, name, description, basePrice, stock, image, and category.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="csvFile">Select CSV File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={uploading}
              />
              {file && (
                <Button
                  variant="outline"
                  onClick={handleClearFile}
                  disabled={uploading}
                  size="sm"
                >
                  Clear
                </Button>
              )}
            </div>
            {file && (
              <p className="text-sm text-gray-500">
                Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
              </p>
            )}
          </div>

          {uploadStatus && (
            <Alert variant={uploadStatus.type === "success" ? "default" : "destructive"}>
              <AlertTitle>
                {uploadStatus.type === "success" ? "Success" : "Error"}
              </AlertTitle>
              <AlertDescription>{uploadStatus.message}</AlertDescription>
            </Alert>
          )}

          <div className="mt-4">
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full"
            >
              {uploading ? "Uploading..." : "Process CSV File"}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              This is a demo application. The CSV is processed locally without actual AWS integration.
            </p>
          </div>

          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h4 className="text-sm font-medium mb-2">Sample CSV Format</h4>
            <pre className="text-xs overflow-x-auto p-2 bg-white rounded border">
              id,name,description,basePrice,stock,image,category<br />
              7,Gaming Headset,High-quality gaming headphones,150,20,https://example.com/headset.jpg,Electronics<br />
              8,Ergonomic Desk,Adjustable standing desk,500,15,https://example.com/desk.jpg,Furniture
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CsvUpload;
