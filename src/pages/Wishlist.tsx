import { useState } from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { Design } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Star, Trash2 } from "lucide-react";
import { BACKEND_URL } from "@/lib/config";

const Wishlist = () => {
  // Mock wishlist items (in real app, this would come from context/state)
  const [designs, setDesigns] = useState<Design[]>([]);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);
  const [wishlistDesigns, setWishlistDesigns] = useState<Design[]>([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/design`)
      .then((res) => res.json())
      .then((data) => setDesigns(data.designs || []));
  }, []);

  useEffect(() => {
    // Example: load wishlist from localStorage or context
    // For demo, just pick first 3 designs after fetch
    if (designs.length > 0 && wishlistItems.length === 0) {
      setWishlistItems(designs.slice(0, 3).map((d) => d.id));
    }
    setWishlistDesigns(
      designs.filter((design) => wishlistItems.includes(design.id))
    );
  }, [designs, wishlistItems]);

  const removeFromWishlist = (designId: string) => {
    setWishlistItems((prev) => prev.filter((id) => id !== designId));
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Wishlist</h1>
              <p className="text-muted-foreground">
                {wishlistDesigns.length} item
                {wishlistDesigns.length !== 1 ? "s" : ""} saved
              </p>
            </div>
            <Heart className="h-8 w-8 text-secondary fill-current" />
          </div>

          {wishlistDesigns.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistDesigns.map((design) => (
                <WishlistCard
                  key={design.id}
                  design={design}
                  onRemove={() => removeFromWishlist(design.id)}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-lg font-semibold mb-2">
                  Your wishlist is empty
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start browsing and save items you love to your wishlist.
                </p>
                <Link to="/marketplace">
                  <Button>Browse Products</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const WishlistCard = ({
  design,
  onRemove,
}: {
  design: Design;
  onRemove: () => void;
}) => {
  return (
    <div className="card-modern group">
      <div className="relative">
        <Link to={`/marketplace/${design.id}`}>
          <div className="aspect-[4/5] rounded-lg mb-4 overflow-hidden">
            <img
              src={design.imageUrl}
              alt={design.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </Link>
        <button
          onClick={onRemove}
          className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </button>
        <Badge className="absolute top-3 left-3 bg-background/90 text-foreground">
          {design.category}
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <Link to={`/marketplace/${design.id}`}>
            <h3 className="font-medium line-clamp-2 hover:text-primary transition-colors">
              {design.title}
            </h3>
          </Link>
          <div className="flex items-center space-x-1 ml-2">
            <Star className="h-3 w-3 fill-current text-warning" />
            <span className="text-xs text-muted-foreground">4.8</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {design.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-semibold">${design.price}</span>
          <Link to={`/marketplace/${design.id}`}>
            <Button size="sm">View Details</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
