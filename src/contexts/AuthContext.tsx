
import React, { createContext, useContext, useState, useEffect } from "react";

// Define user roles
export enum UserRole {
  ADMIN = "admin",
  FRIEND = "friend",
  NORMAL = "normal",
  OPPONENT = "opponent"
}

// Define user interface
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Define auth context interface
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  register: async () => {},
  isLoading: false,
  error: null
});

// Mock users for demo purposes
const mockUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: UserRole.ADMIN
  },
  {
    id: "2",
    name: "Friend User",
    email: "friend@example.com",
    role: UserRole.FRIEND
  },
  {
    id: "3",
    name: "Normal User",
    email: "user@example.com",
    role: UserRole.NORMAL
  },
  {
    id: "4",
    name: "Opponent User",
    email: "opponent@example.com",
    role: UserRole.OPPONENT
  }
];

// Mock credentials mapping for demo
const mockCredentials: Record<string, { password: string; userId: string }> = {
  "admin@example.com": { password: "admin123", userId: "1" },
  "friend@example.com": { password: "friend123", userId: "2" },
  "user@example.com": { password: "user123", userId: "3" },
  "opponent@example.com": { password: "opponent123", userId: "4" }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const credentials = mockCredentials[email];
      
      if (!credentials) {
        throw new Error("User not found");
      }
      
      if (credentials.password !== password) {
        throw new Error("Invalid password");
      }
      
      const foundUser = mockUsers.find(u => u.id === credentials.userId);
      
      if (!foundUser) {
        throw new Error("User data not found");
      }
      
      setUser(foundUser);
      localStorage.setItem("user", JSON.stringify(foundUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Register function (simplified for demo)
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      if (mockCredentials[email]) {
        throw new Error("Email already in use");
      }
      
      // For demo, just create a new user with normal role
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        name,
        email,
        role: UserRole.NORMAL
      };
      
      mockUsers.push(newUser);
      mockCredentials[email] = { password, userId: newUser.id };
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy context usage
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
