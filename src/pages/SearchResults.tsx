import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Design } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Heart, Star } from "lucide-react";
import { BACKEND_URL } from "@/lib/config";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [designs, setDesigns] = useState<Design[]>([]);
  const [searchResults, setSearchResults] = useState<Design[]>([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/design`)
      .then((res) => res.json())
      .then((data) => setDesigns(data.designs || []));
  }, []);

  useEffect(() => {
    if (!query) {
      setSearchResults([]);
      return;
    }
    const filtered = designs.filter(
      (design) =>
        design.title.toLowerCase().includes(query.toLowerCase()) ||
        design.description.toLowerCase().includes(query.toLowerCase()) ||
        design.category.toLowerCase().includes(query.toLowerCase()) ||
        (design.tags &&
          design.tags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          ))
    );
    setSearchResults(filtered);
  }, [query, designs]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container-custom py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Search Results</h1>
            <p className="text-muted-foreground">
              {query
                ? `${searchResults.length} result${
                    searchResults.length !== 1 ? "s" : ""
                  } for "${query}"`
                : "Enter a search term to find products"}
            </p>
          </div>

          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.map((design) => (
                <SearchResultCard key={design.id} design={design} />
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your search terms or browse our categories.
                </p>
                <Link to="/marketplace">
                  <Button>Browse All Products</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <Search className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-lg font-semibold mb-2">Start searching</h3>
              <p className="text-muted-foreground">
                Enter a search term to find products that match your interests.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SearchResultCard = ({ design }: { design: Design }) => {
  return (
    <Link to={`/marketplace/${design.id}`}>
      <div className="card-modern group">
        <div className="aspect-[4/5] rounded-lg mb-3 relative overflow-hidden">
          <img
            src={design.imageUrl}
            alt={design.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <button className="absolute top-3 right-3 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-background">
            <Heart className="h-4 w-4" />
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

export default SearchResults;
