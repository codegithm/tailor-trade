import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { UserRole } from "../types";
import { ArrowRight, Star, Truck, Shield, Headphones } from "lucide-react";
import { BACKEND_URL } from "@/lib/config";

const Home = () => {
  const { user } = useAuth();
  const [featuredDesigns, setFeaturedDesigns] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/design`)
      .then((res) => res.json())
      .then((data) => setFeaturedDesigns(data.designs?.slice(0, 8) || []));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-custom">
          <div className="py-20 md:py-32">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                Tailored to <span className="italic">Perfection</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Discover custom clothing crafted by skilled artisans. Premium
                quality, perfect fit, delivered to your door.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/marketplace">
                  <Button size="lg" className="btn-primary text-base px-8">
                    Shop Collection
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                {!user && (
                  <Link to="/register">
                    <Button
                      size="lg"
                      variant="outline"
                      className="btn-secondary text-base px-8"
                    >
                      Create Account
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 border-t border-border">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Free Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Complimentary shipping on orders over $100
              </p>
            </div>
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Quality Guarantee</h3>
              <p className="text-sm text-muted-foreground">
                Premium materials and expert craftsmanship
              </p>
            </div>
            <div className="space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full">
                <Headphones className="h-6 w-6" />
              </div>
              <h3 className="font-semibold">Expert Support</h3>
              <p className="text-sm text-muted-foreground">
                Personal styling advice and fitting assistance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/20">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Collection</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Handpicked pieces from our most talented artisans
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredDesigns.map((design) => (
              <Link key={design.id} to={`/marketplace/${design.id}`}>
                <div className="product-card">
                  <div className="product-image rounded-lg mb-4">
                    <img
                      src={design.imageUrls[0]}
                      alt={design.title}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        {design.category}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 fill-current text-warning" />
                        <span className="text-xs text-muted-foreground">
                          4.8
                        </span>
                      </div>
                    </div>
                    <h3 className="font-medium text-sm line-clamp-2">
                      {design.title}
                    </h3>
                    <p className="font-semibold">${design.price}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/marketplace">
              <Button variant="outline" className="btn-secondary">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Stay in Style
            </h2>
            <p className="mb-8 opacity-90">
              Get exclusive access to new collections, styling tips, and special
              offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-md text-foreground bg-background border-0 focus:outline-none focus:ring-2 focus:ring-primary-foreground/20"
              />
              <Button className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
