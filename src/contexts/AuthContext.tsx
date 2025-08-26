import {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { User, UserRole } from "../types";
import { BACKEND_URL } from "@/lib/config";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check for saved session on load
  useEffect(() => {
    const savedUser = localStorage.getItem("tailor_trade_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error("Failed to parse saved user", err);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Login failed");
        return false;
      }
      setUser(data.user);
      localStorage.setItem("tailor_trade_user", JSON.stringify(data.user));
      if (data.token) localStorage.setItem("jwt", data.token);
      return true;
    } catch (err) {
      setError("Login failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: UserRole
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, role }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registration failed");
        return false;
      }
      setUser(data.user);
      localStorage.setItem("tailor_trade_user", JSON.stringify(data.user));
      if (data.token) localStorage.setItem("jwt", data.token);
      return true;
    } catch (err) {
      setError("Registration failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("tailor_trade_user");
    localStorage.removeItem("jwt");
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
