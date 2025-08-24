import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useWishlist } from "../contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserRole } from "@/types";
import { Search, User, ShoppingBag, Heart, Menu, X } from "lucide-react";

type NavLinkProps = {
  to: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
};

const NavLink = ({ to, children, className = "", onClick }: NavLinkProps) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        px-4 py-2 text-sm font-medium transition-colors duration-200
        ${
          isActive
            ? "text-primary border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground"
        }
        ${className}
      `}
    >
      {children}
    </Link>
  );
};

export const Layout = ({ children }: { children: ReactNode }) => {
  const { user, logout } = useAuth();
  const { wishlistItems } = useWishlist();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Don't show layout on auth pages
  if (location.pathname === "/login" || location.pathname === "/register") {
    return <>{children}</>;
  }
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="border-b border-border bg-background">
        <div className="container-custom">
          <div className="flex items-center justify-between h-12 text-xs">
            <div className="hidden md:flex items-center space-x-6 text-muted-foreground">
              <span>Free shipping on orders over $100</span>
              <span>30-day returns</span>
            </div>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <Link to="/help" className="hover:text-foreground">
                Help
              </Link>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link
                to="/"
                className="text-2xl font-bold text-foreground hover:text-primary transition-colors"
              >
                TailorTrade
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/marketplace">Shop</NavLink>
              {user && user.role === UserRole.CUSTOMER && (
                <NavLink to="/requests">My Orders</NavLink>
              )}
              {user && user.role === UserRole.TAILOR && (
                <>
                  <NavLink to="/dashboard">Dashboard</NavLink>
                  <NavLink to="/designs">My Designs</NavLink>
                </>
              )}
              <NavLink to="/chat">Messages</NavLink>
            </nav>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </form>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Icon for Mobile */}
              <button
                className="md:hidden p-4 hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Search className="h-5 w-5" />
              </button>

              {user ? (
                <>
                  {/* Wishlist */}
                  <Link
                    to="/wishlist"
                    className="p-4 hover:bg-muted rounded-md transition-colors relative"
                  >
                    <Heart className="h-5 w-5" />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {wishlistItems.length}
                      </span>
                    )}
                  </Link>

                  {/* Cart */}
                  <button className="p-4 hover:bg-muted rounded-md transition-colors relative">
                    <ShoppingBag className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      0
                    </span>
                  </button>

                  {/* Profile */}
                  <Link
                    to="/profile"
                    className="hidden md:flex items-center space-x-2 p-2 hover:bg-muted rounded-md transition-colors"
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                    <span className="hidden lg:block text-sm font-medium">
                      {user.name}
                    </span>
                  </Link>

                  <Button
                    variant="ghost"
                    onClick={logout}
                    size="sm"
                    className="hidden md:flex text-muted-foreground hover:text-foreground"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <div className="hidden md:flex items-center space-x-3">
                  <Link to="/login">
                    <Button variant="ghost" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm" className="btn-primary">
                      Join
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-4 hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-background">
            <div className="container-custom py-4 space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4"
                />
              </form>

              {/* Mobile Navigation */}
              <nav className="flex flex-col space-y-2">
                <NavLink to="/" onClick={closeMobileMenu}>
                  Home
                </NavLink>
                <NavLink to="/marketplace" onClick={closeMobileMenu}>
                  Shop
                </NavLink>
                {user && user.role === UserRole.CUSTOMER && (
                  <NavLink to="/requests" onClick={closeMobileMenu}>
                    My Orders
                  </NavLink>
                )}
                {user && user.role === UserRole.TAILOR && (
                  <>
                    <NavLink to="/dashboard" onClick={closeMobileMenu}>
                      Dashboard
                    </NavLink>
                    <NavLink to="/designs" onClick={closeMobileMenu}>
                      My Designs
                    </NavLink>
                  </>
                )}
                <NavLink to="/chat" onClick={closeMobileMenu}>
                  Messages
                </NavLink>

                {user ? (
                  <>
                    <NavLink to="/profile" onClick={closeMobileMenu}>
                      Profile
                    </NavLink>
                    <NavLink to="/wishlist" onClick={closeMobileMenu}>
                      Wishlist ({wishlistItems.length})
                    </NavLink>
                    <button
                      onClick={() => {
                        logout();
                        closeMobileMenu();
                      }}
                      className="text-left px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2 pt-2 border-t border-border">
                    <Link to="/login" onClick={closeMobileMenu}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/register" onClick={closeMobileMenu}>
                      <Button size="sm" className="w-full btn-primary">
                        Join
                      </Button>
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border">
        <div className="container-custom">
          <div className="py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">TailorTrade</h3>
                <p className="text-sm text-muted-foreground max-w-xs">
                  Premium custom clothing crafted by skilled artisans worldwide.
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Shop</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="/marketplace"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      All Products
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/marketplace?category=Shirts"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Shirts
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/marketplace?category=Suits"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Suits
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/marketplace?category=Dresses"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Dresses
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Support</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="/help"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/contact"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/returns"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Returns
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/shipping"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Shipping
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="/terms"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cookies"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Cookie Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
              <p>
                &copy; {new Date().getFullYear()} TailorTrade. All rights
                reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <Link
                  to="/facebook"
                  className="hover:text-foreground transition-colors"
                >
                  Facebook
                </Link>
                <Link
                  to="/instagram"
                  className="hover:text-foreground transition-colors"
                >
                  Instagram
                </Link>
                <Link
                  to="/twitter"
                  className="hover:text-foreground transition-colors"
                >
                  Twitter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
