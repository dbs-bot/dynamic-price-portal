
import React from "react";
import { useAnalytics } from "@/contexts/AnalyticsContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/contexts/AuthContext";

const AnalyticsDashboard: React.FC = () => {
  const { 
    getProductViewStats, 
    getUserRoleStats, 
    getSalesStats 
  } = useAnalytics();
  
  const productViewStats = getProductViewStats();
  const userRoleStats = getUserRoleStats();
  const salesStats = getSalesStats();
  
  // Get role display name
  const getRoleDisplayName = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "Admin";
      case UserRole.FRIEND:
        return "Friend/Partner";
      case UserRole.OPPONENT:
        return "Opponent/Rival";
      default:
        return "Normal User";
    }
  };
  
  // Get role color
  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "bg-purple-500";
      case UserRole.FRIEND:
        return "bg-green-500";
      case UserRole.OPPONENT:
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };
  
  // Calculate total sales
  const totalSales = salesStats.reduce((sum, stat) => sum + stat.sales, 0);
  
  // Calculate total views
  const totalViews = productViewStats.reduce((sum, stat) => sum + stat.count, 0);
  
  // Calculate total users
  const totalUserLogins = userRoleStats.reduce((sum, stat) => sum + stat.count, 0);
  
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="products">Product Analytics</TabsTrigger>
        <TabsTrigger value="users">User Analytics</TabsTrigger>
        <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${totalSales.toLocaleString('en-US', { maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">
                Across {salesStats.length} days
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Product Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalViews}</div>
              <p className="text-xs text-muted-foreground">
                Across {productViewStats.length} products
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">User Logins</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUserLogins}</div>
              <p className="text-xs text-muted-foreground">
                From {userRoleStats.length} user types
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Most Viewed Products</CardTitle>
              <CardDescription>
                Top 5 products by view count
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {productViewStats.slice(0, 5).map((stat) => (
                  <div key={stat.productId} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {stat.productName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ID: {stat.productId}
                      </p>
                    </div>
                    <div className="font-medium">{stat.count} views</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>User Role Distribution</CardTitle>
              <CardDescription>
                Login counts by user role
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userRoleStats.map((stat) => (
                  <div key={stat.role} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${getRoleColor(stat.role)}`} />
                      <p className="text-sm font-medium">
                        {getRoleDisplayName(stat.role)}
                      </p>
                    </div>
                    <div className="font-medium">{stat.count} logins</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
      
      <TabsContent value="products" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Product Views</CardTitle>
            <CardDescription>
              All products sorted by view count
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {productViewStats.map((stat, index) => (
                <div key={stat.productId} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-sm text-gray-800">
                        {index + 1}. {stat.productName}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">
                        (ID: {stat.productId})
                      </span>
                    </div>
                    <div className="font-medium">{stat.count} views</div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full" 
                      style={{ width: `${(stat.count / productViewStats[0].count) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="users" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>User Role Distribution</CardTitle>
            <CardDescription>
              Login counts by user role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {userRoleStats.map((stat) => (
                <div key={stat.role} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-4 w-4 rounded-full ${getRoleColor(stat.role)}`} />
                      <div>
                        <p className="font-medium">{getRoleDisplayName(stat.role)}</p>
                        <p className="text-xs text-gray-500">
                          {stat.role === UserRole.FRIEND 
                            ? "Receives 20% discount" 
                            : stat.role === UserRole.OPPONENT 
                            ? "Pays 20% markup"
                            : stat.role === UserRole.ADMIN
                            ? "Has admin privileges"
                            : "Pays regular price"}
                        </p>
                      </div>
                    </div>
                    <div className="text-lg font-bold">
                      {stat.count} <span className="text-sm font-normal text-gray-500">logins</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`${getRoleColor(stat.role)} h-3 rounded-full`}
                      style={{ width: `${(stat.count / totalUserLogins) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-right text-gray-500">
                    {((stat.count / totalUserLogins) * 100).toFixed(1)}% of total
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="sales" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Sales by Date</CardTitle>
            <CardDescription>
              Total sales amount per day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {salesStats.map((stat) => {
                // Format date
                const date = new Date(stat.date);
                const formattedDate = date.toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                });
                
                return (
                  <div key={stat.date} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{formattedDate}</p>
                      <p className="text-lg font-bold">
                        ${stat.sales.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-green-500 h-3 rounded-full"
                        style={{ width: `${(stat.sales / Math.max(...salesStats.map(s => s.sales))) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-right text-gray-500">
                      {((stat.sales / totalSales) * 100).toFixed(1)}% of total
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default AnalyticsDashboard;
