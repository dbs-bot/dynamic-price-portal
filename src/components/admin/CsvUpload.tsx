
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
      // Simulate AWS S3 upload
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Parse CSV (in a real app, this would happen server-side)
      const text = await file.text();
      const rows = text.split('\n').filter(row => row.trim() !== '');
      const headers = rows[0].split(',');

      // Validate headers
      const requiredColumns = ['id', 'name', 'description', 'basePrice', 'stock', 'image', 'category'];
      const missingColumns = requiredColumns.filter(col => !headers.includes(col));

      if (missingColumns.length > 0) {
        throw new Error(`Missing required columns: ${missingColumns.join(', ')}`);
      }

      // Parse data
      const products = rows.slice(1).map(row => {
        const values = row.split(',');
        const product: Omit<Product, "price"> = {
          id: "",
          name: "",
          description: "",
          basePrice: 0,
          stock: 0,
          image: "",
          category: ""
        };

        headers.forEach((header, index) => {
          if (header === 'basePrice' || header === 'stock') {
            (product as any)[header] = parseFloat(values[index]);
          } else {
            (product as any)[header] = values[index];
          }
        });

        return product;
      });

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
              {uploading ? "Uploading..." : "Upload to AWS S3 & Process"}
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              This is a demo application. The CSV is processed locally without actual AWS integration.
            </p>
          </div>

          <div className="mt-4 p-4 bg-gray-100 rounded-md">
            <h4 className="text-sm font-medium mb-2">Sample CSV Format</h4>
            <pre className="text-xs overflow-x-auto p-2 bg-white rounded border">
              id,name,description,basePrice,stock,image,category<br />
              1,Laptop Pro,High-performance laptop,1200,10,https://example.com/laptop.jpg,Electronics<br />
              2,Office Chair,Ergonomic chair for your office,300,25,https://example.com/chair.jpg,Furniture
            </pre>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CsvUpload;
