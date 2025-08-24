import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Design } from "../types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { Search, SlidersHorizontal, Star, Heart } from "lucide-react";
import { BACKEND_URL } from "@/lib/config";

const Marketplace = () => {
  const { user } = useAuth();
  const [designs, setDesigns] = useState<Design[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [fabricTypes, setFabricTypes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/design`)
      .then((res) => res.json())
      .then((data) => {
        setDesigns(data.designs || []);
        setCategories(
          Array.from(new Set((data.designs || []).map((d: any) => d.category)))
        );
        setFabricTypes(
          Array.from(
            new Set(
              (data.designs || [])
                .filter((d: any) => d.fabricType)
                .map((d: any) => d.fabricType)
            )
          )
        );
      });
  }, []);

  // Filter designs based on search and filters
  const filteredDesigns = designs.filter((design) => {
    const matchesSearch =
      !searchTerm ||
      design.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      design.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (design.tags &&
        design.tags.some((tag) =>
          tag.toLowerCase().includes(searchTerm.toLowerCase())
        ));

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(design.category);

    const matchesFabric =
      selectedFabrics.length === 0 ||
      (design.fabricType && selectedFabrics.includes(design.fabricType));

    const matchesPrice =
      design.price >= priceRange[0] && design.price <= priceRange[1];

    return matchesSearch && matchesCategory && matchesFabric && matchesPrice;
  });

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const toggleFabric = (fabric: string) => {
    setSelectedFabrics((prev) =>
      prev.includes(fabric)
        ? prev.filter((f) => f !== fabric)
        : [...prev, fabric]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-background">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold mb-2">Shop Collection</h1>
          <p className="text-muted-foreground">
            Discover premium custom clothing from talented artisans
          </p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="border-b border-border bg-background sticky top-16 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>

            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              {filteredDesigns.length} products
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-64 shrink-0">
              <div className="card-modern p-6 sticky top-32">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold">Filters</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategories([]);
                      setSelectedFabrics([]);
                      setPriceRange([0, 1000]);
                    }}
                  >
                    Clear all
                  </Button>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={(value) =>
                        setPriceRange(value as [number, number])
                      }
                      max={1000}
                      step={10}
                      className="mb-3"
                    />
                  </div>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Categories */}
                <div className="mb-6">
                  <h3 className="font-medium mb-3">Categories</h3>
                  <div className="space-y-3">
                    {categories.map((category) => (
                      <div
                        key={category}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => toggleCategory(category)}
                        />
                        <Label
                          htmlFor={`category-${category}`}
                          className="text-sm cursor-pointer"
                        >
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fabric Types */}
                <div>
                  <h3 className="font-medium mb-3">Fabric Type</h3>
                  <div className="space-y-3">
                    {fabricTypes.map((fabric) => (
                      <div key={fabric} className="flex items-center space-x-2">
                        <Checkbox
                          id={`fabric-${fabric}`}
                          checked={selectedFabrics.includes(fabric)}
                          onCheckedChange={() => toggleFabric(fabric)}
                        />
                        <Label
                          htmlFor={`fabric-${fabric}`}
                          className="text-sm cursor-pointer"
                        >
                          {fabric}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="flex-1">
            {filteredDesigns.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredDesigns.map((design) => (
                  <ProductCard key={design.id} design={design} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your search or filters to find what you're
                    looking for.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategories([]);
                      setSelectedFabrics([]);
                      setPriceRange([0, 1000]);
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ design }: { design: Design }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isLiked = isInWishlist(design.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(design.id);
  };

  const mainImage =
    Array.isArray(design.imageUrls) && design.imageUrls.length > 0
      ? design.imageUrls[0]
      : design.imageUrl || "/placeholder.svg";

  return (
    <Link to={`/marketplace/${design.id}`}>
      <div className="card-modern group">
        <div className="aspect-[4/5] rounded-lg mb-3 relative overflow-hidden">
          <img
            src={mainImage}
            alt={design.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <button
            onClick={handleWishlistClick}
            className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background"
          >
            <Heart
              className={`h-4 w-4 ${
                isLiked ? "fill-current text-secondary" : ""
              }`}
            />
          </button>
          <Badge className="absolute top-3 left-3 bg-background/90 text-foreground">
            {design.category}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm line-clamp-1 flex-1">
              {design.title}
            </h3>
            <div className="flex items-center space-x-1 ml-2">
              <Star className="h-3 w-3 fill-current text-warning" />
              <span className="text-xs text-muted-foreground">4.8</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {design.description}
          </p>
          <div className="flex items-center justify-between">
            <span className="font-semibold">${design.price}</span>
            <span className="text-xs text-muted-foreground">Custom made</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Marketplace;
